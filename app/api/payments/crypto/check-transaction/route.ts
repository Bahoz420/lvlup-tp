import { type NextRequest, NextResponse } from "next/server"
import { checkTransactionStatus, isValidCryptoAddress } from "@/lib/crypto-api-service"
import type { PaymentProvider } from "@/types/payment"
import { logger } from "@/lib/logger"
import { db } from "@/lib/supabase-database" // Import db

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, provider, walletAddress, expectedAmount, orderId } = body // Added paymentId and orderId

    if (!paymentId || !provider || !walletAddress || !expectedAmount || !orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields (paymentId, provider, walletAddress, expectedAmount, orderId)",
        },
        { status: 400 },
      )
    }

    if (!["bitcoin", "ethereum", "cardano"].includes(provider)) {
      return NextResponse.json({ success: false, error: "Invalid crypto provider" }, { status: 400 })
    }

    if (!isValidCryptoAddress(provider as PaymentProvider, walletAddress)) {
      return NextResponse.json({ success: false, error: "Invalid wallet address" }, { status: 400 })
    }

    const result = await checkTransactionStatus(
      provider as PaymentProvider,
      walletAddress,
      Number.parseFloat(expectedAmount as string),
    )
    logger.info(`Transaction check for payment ${paymentId} (${provider} address ${walletAddress}):`, result)

    if (result.success && result.transactionFound && result.transactionId) {
      // Fetch the payment record
      const { data: paymentRecord, error: fetchError } = await db.getPaymentById(paymentId)

      if (fetchError || !paymentRecord) {
        logger.error(`Payment record ${paymentId} not found or error fetching:`, fetchError)
        // Continue to return transaction status, but log error
      } else if (paymentRecord.order_id !== orderId) {
        logger.error(`Order ID mismatch for payment ${paymentId}. Expected ${paymentRecord.order_id}, got ${orderId}`)
        // Continue, but this is a serious issue
      } else {
        // Update payment record if it's still in an initial state
        if (paymentRecord.status === "awaiting_payment") {
          const updatePayload: any = {
            // Use 'any' for flexibility or define a specific update type
            transaction_id: result.transactionId,
            status: "pending_confirmation",
            // crypto_received_amount: result.receivedAmount, // If your checkTransactionStatus provides this
          }
          if (result.receivedAmount) {
            updatePayload.crypto_received_amount = Number.parseFloat(result.receivedAmount)
          }

          const { error: updateError } = await db.updatePayment(paymentId, updatePayload)
          if (updateError) {
            logger.error(`Failed to update payment record ${paymentId} after transaction found:`, updateError)
          } else {
            logger.info(
              `Payment record ${paymentId} updated. Status: pending_confirmation, TxID: ${result.transactionId}`,
            )
          }
        }
      }
    }

    return NextResponse.json({
      success: true, // API call itself was successful
      ...result, // Result from checkTransactionStatus
    })
  } catch (error) {
    logger.error("Transaction check API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
