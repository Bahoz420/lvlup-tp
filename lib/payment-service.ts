import type { PaymentMethod, PaymentProvider, PaymentProcessResult } from "@/types/payment"
import { generateWalletAddress, convertFiatToCrypto, getNetworkName, getCryptoSymbol } from "@/lib/crypto-api-service"
import { db } from "@/lib/supabase-database"
import { logger } from "@/lib/logger"
import { emailService } from "@/lib/email/email-service"
import type { DbOrder, ProductDeliveryItem } from "@/types/database"

// Placeholder for admin notification service
async function notifyAdminOfCriticalIssue(subject: string, details: Record<string, any>) {
  logger.error(`CRITICAL ADMIN ALERT: ${subject}`, details)
  // In a real app, this would send an email, Slack message, or trigger another alert.
  // Example: await emailService.sendEmail({ to: process.env.ADMIN_EMAIL, subject, template: 'admin-alert', data: details });
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "bitcoin",
    provider: "bitcoin",
    label: "Bitcoin",
    description: "Pay with Bitcoin cryptocurrency",
    iconPath: "/bitcoin-icon.png",
    isActive: true,
    processingTime: "~10-60 minutes for confirmation",
  },
  {
    id: "ethereum",
    provider: "ethereum",
    label: "Ethereum",
    description: "Pay with Ethereum cryptocurrency",
    iconPath: "/ethereum-icon.png",
    isActive: true,
    processingTime: "~15 seconds for confirmation",
  },
  {
    id: "cardano",
    provider: "cardano",
    label: "Cardano (ADA)",
    description: "Pay with Cardano cryptocurrency",
    iconPath: "/cardano-icon.png",
    isActive: true,
    processingTime: "~5-10 minutes for confirmation",
  },
]

export async function getAvailablePaymentMethods(): Promise<PaymentMethod[]> {
  return paymentMethods.filter((method) => method.isActive)
}

export async function processPayment(
  paymentProvider: PaymentProvider,
  amount: number,
  currency = "EUR",
  metadata: Record<string, any> = {},
): Promise<PaymentProcessResult> {
  try {
    if (!metadata.orderId) {
      logger.error("processPayment error: orderId is missing in metadata")
      return {
        success: false,
        errorMessage: "Order ID is missing.",
      }
    }

    const validCryptoProviders: PaymentProvider[] = ["bitcoin", "ethereum", "cardano"]
    if (!validCryptoProviders.includes(paymentProvider)) {
      logger.error(`processPayment error: Unsupported payment provider: ${paymentProvider}`)
      return {
        success: false,
        errorMessage: `Unsupported payment provider: ${paymentProvider}. Only cryptocurrency payments are accepted.`,
      }
    }

    return await processCryptoPayment(paymentProvider, amount, currency.toLowerCase(), metadata.orderId, metadata)
  } catch (error) {
    logger.error("Payment processing error:", { error, paymentProvider, amount, currency, metadata })
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown payment error",
    }
  }
}

async function processCryptoPayment(
  cryptoType: PaymentProvider,
  fiatAmount: number,
  fiatCurrency: string,
  orderId: string,
  metadata: Record<string, any>,
): Promise<PaymentProcessResult> {
  try {
    logger.info(
      `Processing ${getNetworkName(cryptoType)} payment for order ${orderId} of ${fiatAmount} ${fiatCurrency.toUpperCase()} equivalent`,
      metadata,
    )

    const walletAddress = await generateWalletAddress(cryptoType)
    if (!walletAddress) {
      throw new Error(`Failed to generate wallet address for ${cryptoType}`)
    }

    const conversion = await convertFiatToCrypto(fiatAmount, cryptoType, fiatCurrency)
    if (!conversion) {
      throw new Error(`Failed to convert ${fiatAmount} ${fiatCurrency.toUpperCase()} to ${cryptoType}`)
    }
    const { cryptoAmount, fiatPrice } = conversion

    const paymentRecordPayload = {
      order_id: orderId,
      provider: cryptoType,
      amount: fiatAmount,
      currency: fiatCurrency.toUpperCase(),
      crypto_amount: Number.parseFloat(cryptoAmount),
      crypto_currency: getCryptoSymbol(cryptoType),
      status: "awaiting_payment",
      payment_details: { walletAddress, expectedCryptoAmount: cryptoAmount, exchangeRate: fiatPrice },
    }

    const { data: paymentEntry, error: dbError } = await db.createPayment(paymentRecordPayload)

    if (dbError || !paymentEntry) {
      logger.error(`Failed to create payment record for order ${orderId}:`, {
        error: dbError,
        payload: paymentRecordPayload,
      })
      throw new Error(`Failed to create payment record: ${dbError?.message || "Unknown database error"}`)
    }
    logger.info(`Payment record ${paymentEntry.id} created for order ${orderId}`)

    return {
      success: true,
      orderId: orderId,
      paymentId: paymentEntry.id,
      redirectUrl: `/crypto-payment?provider=${cryptoType}&orderId=${orderId}&paymentId=${paymentEntry.id}&amount=${cryptoAmount}&walletAddress=${walletAddress}&fiatAmount=${fiatAmount}&fiatCurrency=${fiatCurrency.toUpperCase()}`,
    }
  } catch (error) {
    logger.error(`Error processing ${cryptoType} payment for order ${orderId}:`, {
      error,
      cryptoType,
      fiatAmount,
      fiatCurrency,
      orderId,
    })
    return {
      success: false,
      orderId: orderId,
      errorMessage: error instanceof Error ? error.message : `Unknown ${cryptoType} payment error`,
    }
  }
}

export async function updatePaymentStatus(
  orderId: string, // This is the UUID of the order
  paymentId: string,
  orderNewStatus: string, // e.g., "completed"
  transactionId: string,
  paymentProvider: PaymentProvider,
): Promise<{ success: boolean; error?: string; order?: DbOrder }> {
  logger.info(
    `Attempting to finalize order ${orderId} to status ${orderNewStatus} via payment ${paymentId} (Tx: ${transactionId}, Provider: ${paymentProvider}) using RPC.`,
  )

  // 1. Fetch the full order details to get items for activation code assignment
  //    and other details needed for emails.
  const { data: fullOrderDetails, error: orderFetchError } = await db.getOrderByIdWithFullDetails(orderId)

  if (orderFetchError || !fullOrderDetails) {
    logger.error(`Failed to fetch full order details for ${orderId} before RPC call:`, orderFetchError)
    return { success: false, error: orderFetchError?.message || `Order ${orderId} not found for status update.` }
  }

  // Idempotency check: If order is already in the target status or a subsequent one, don't reprocess.
  if (
    ["completed", "processing", "paid"].includes(fullOrderDetails.status) &&
    fullOrderDetails.status === orderNewStatus
  ) {
    logger.info(`Order ${orderId} already in status ${orderNewStatus}. No update needed.`)
    return { success: true, order: fullOrderDetails }
  }
  // If order is already completed, but a previous status like 'processing' is requested, that's unusual.
  // For now, we only prevent re-processing if it's already at or beyond the target status.

  // 2. Prepare product items for the RPC call
  const productItemsForRpc = fullOrderDetails.order_items
    .filter((item) => item.products?.requires_activation) // Only include items that require activation
    .map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }))

  // 3. Call the RPC function to atomically update order and assign codes
  const {
    success: rpcSuccess,
    error: rpcError,
    errorCode: rpcErrorCode,
  } = await db.completeOrderAndAssignCodesDB(
    orderId,
    orderNewStatus,
    transactionId,
    paymentProvider,
    productItemsForRpc,
  )

  if (!rpcSuccess) {
    logger.error(`RPC completeOrderAndAssignCodesDB failed for order ${orderId}:`, { rpcError, rpcErrorCode })
    if (rpcErrorCode === "NO_CODES_AVAILABLE_RPC") {
      await notifyAdminOfCriticalIssue("No Activation Codes Available During RPC", {
        orderId: orderId,
        paymentId: paymentId,
        details: rpcError?.message,
      })
    }
    return { success: false, error: rpcError?.message || "Failed to complete order and assign codes via RPC." }
  }

  logger.info(`Order ${orderId} status updated and codes assigned successfully via RPC.`)

  // 4. Post-RPC actions: Send emails
  //    The RPC handled DB updates. Now we fetch the (potentially updated) order details again
  //    to ensure we have the latest state for emails, though the RPC should have set it.
  //    Alternatively, the RPC could return the assigned codes if needed for direct emailing.
  //    For now, we assume codes are in the DB and the dashboard is the primary access point.

  // Re-fetch the order to get the final state for email purposes (or use fullOrderDetails if confident RPC updated it)
  const { data: finalOrderState, error: finalOrderFetchError } = await db.getOrderByIdWithFullDetails(orderId)
  if (finalOrderFetchError || !finalOrderState) {
    logger.error(
      `Failed to fetch final order state for ${orderId} after RPC for email sending. Using initial details.`,
      finalOrderFetchError,
    )
    // Fallback to fullOrderDetails, but this is not ideal.
  }

  const orderForEmail = finalOrderState || fullOrderDetails

  try {
    // Construct ProductDeliveryItem[] for emails.
    // Since codes are assigned in DB by RPC, we don't have them directly here unless RPC returns them.
    // For "codes available in dashboard" email, we don't need to list codes here.
    const productDeliveriesForEmail: ProductDeliveryItem[] = orderForEmail.order_items.map((item) => {
      const productInfo: ProductDeliveryItem = {
        name: item.products?.name || item.product_name,
        description: item.products?.description || "N/A",
        // Activation code will be accessible via dashboard.
        // If you want to include it in email, RPC would need to return assigned codes,
        // or you'd query them separately here (adds complexity, less atomic for email content).
        activationCode: item.products?.requires_activation ? "Available in your account dashboard" : null,
        downloadLink: item.products?.downloadable
          ? generateDownloadToken(orderForEmail.order_number, item.product_id)
          : null,
      }
      return productInfo
    })

    await emailService.sendPaymentReceipt(
      orderForEmail.customer_email,
      orderForEmail.order_number,
      orderForEmail.total_amount,
      paymentProvider,
      transactionId,
    )

    await emailService.sendProductDelivery(
      orderForEmail.customer_email,
      orderForEmail.order_number,
      productDeliveriesForEmail, // Use the dashboard-focused message
    )

    if (orderForEmail.is_gift && orderForEmail.recipient_email) {
      await emailService.sendGiftNotification(
        orderForEmail.recipient_email,
        orderForEmail.customer_email,
        productDeliveriesForEmail.map((p) => ({ name: p.name, description: p.description })),
        orderForEmail.gift_message || undefined,
      )
    }
    logger.info(`Emails sent for order ${orderForEmail.order_number}`)
  } catch (emailError) {
    logger.error(`Error during post-RPC email sending for order ${orderForEmail.order_number}:`, emailError)
    // Don't fail the whole process if emails fail, but log it critically.
  }

  return { success: true, order: orderForEmail }
}

// Keep this utility function if product delivery emails generate download links
function generateDownloadToken(orderId: string, productId: string): string {
  const timestamp = Date.now()
  const randomPart = Math.random().toString(36).substring(2, 10)
  // Use order_number for token if it's more user-facing or stable for links
  return Buffer.from(`${orderId}:${productId}:${timestamp}:${randomPart}`).toString("base64")
}

export async function validatePayment(paymentId: string, provider: PaymentProvider): Promise<boolean> {
  logger.info(`Validating payment ${paymentId} with provider ${provider}`)
  // This function's purpose might need re-evaluation.
  // Actual payment validation happens via webhooks/confirmation checks.
  await new Promise((resolve) => setTimeout(resolve, 500)) // Placeholder
  return true
}
