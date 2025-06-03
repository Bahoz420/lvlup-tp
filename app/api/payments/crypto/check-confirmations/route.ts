import { type NextRequest, NextResponse } from "next/server"
import { checkTransactionConfirmations } from "@/lib/crypto-api-service"
import type { PaymentProvider } from "@/types/payment"
import { logger } from "@/lib/logger"
import { db } from "@/lib/supabase-database" // Import db
import { paymentService } from "@/lib/payment-service" // Import paymentService

// Define required confirmations per provider if not globally available
const REQUIRED_CONFIRMATIONS: Record<PaymentProvider, number> = {
  bitcoin: 1, // Example: 1 for faster testing, usually 2-6
  ethereum: 12, // Example
  cardano: 10, // Example
  stripe: 0, // Not applicable
  paypal: 0, // Not applicable
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, provider, transactionId, orderId } = body // Added paymentId and orderId

    if (!paymentId || !provider || !transactionId || !orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (paymentId, provider, transactionId, orderId)" },
        { status: 400 },
      )
    }

    if (!["bitcoin", "ethereum", "cardano"].includes(provider)) {
      return NextResponse.json({ success: false, error: "Invalid crypto provider" }, { status: 400 })
    }

    const result = await checkTransactionConfirmations(provider as PaymentProvider, transactionId)
    logger.info(`Confirmation check for payment ${paymentId} (${provider} tx ${transactionId}):`, result)

    if (result.success && result.confirmations !== undefined) {
      const { data: paymentRecord, error: fetchError } = await db.getPaymentById(paymentId)

      if (fetchError || !paymentRecord) {
        logger.error(`Payment record ${paymentId} not found or error fetching:`, fetchError)
      } else if (paymentRecord.order_id !== orderId) {
        logger.error(
          `Order ID mismatch for payment ${paymentId} during confirmation. Expected ${paymentRecord.order_id}, got ${orderId}`,
        )
      } else {
        const requiredConfs = REQUIRED_CONFIRMATIONS[provider as PaymentProvider] || 1 // Fallback
        const isConfirmed = result.confirmations >= requiredConfs

        if (isConfirmed && paymentRecord.status === "pending_confirmation") {
          const { error: updateError } = await db.updatePayment(paymentId, {
            status: "completed",
            confirmations: result.confirmations,
          })

          if (updateError) {
            logger.error(`Failed to update payment record ${paymentId} to completed:`, updateError)
          } else {
            logger.info(`Payment record ${paymentId} updated to completed. Confirmations: ${result.confirmations}`)
            // Now, update the main order status and trigger post-completion logic
            try {
              // paymentService.updatePaymentStatus expects the main order ID (UUID)
              // and the payment record ID (UUID)
              await paymentService.updatePaymentStatus(
                paymentRecord.order_id,
                paymentId,
                "completed",
                transactionId,
                provider as PaymentProvider,
              )
              logger.info(`Main order ${paymentRecord.order_id} status update triggered by payment ${paymentId}.`)
            } catch (orderUpdateError) {
              logger.error(
                `Error triggering main order update for order ${paymentRecord.order_id} from payment ${paymentId}:`,
                orderUpdateError,
              )
              // This is critical, might need a retry mechanism or manual intervention flag
            }
          }
        } else if (paymentRecord.status === "pending_confirmation" && !isConfirmed) {
          // Optionally update confirmations count even if not fully confirmed yet
          const { error: updateConfirmationsError } = await db.updatePayment(paymentId, {
            confirmations: result.confirmations,
          })
          if (updateConfirmationsError) {
            logger.warn(`Failed to update confirmations count for payment ${paymentId}:`, updateConfirmationsError)
          }
        }
      }
    }

    return NextResponse.json({
      success: true, // API call itself was successful
      ...result, // Result from checkTransactionConfirmations
    })
  } catch (error) {
    logger.error("Confirmation check API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
