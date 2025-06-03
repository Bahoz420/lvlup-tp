import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/supabase-database"
import { logger } from "@/lib/logger"

// Helper function (consider moving to a shared utility if used elsewhere)
function generateDownloadToken(orderId: string, productId: string): string {
  const timestamp = Date.now()
  const randomPart = Math.random().toString(36).substring(2, 10)
  return Buffer.from(`${orderId}:${productId}:${timestamp}:${randomPart}`).toString("base64")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Expecting orderId (UUID of the order) and paymentId (UUID of the payment record)
    // Other fields like paymentProvider, transactionId, amount, cryptoAmount are for context/logging
    // but the primary identifiers are orderId and paymentId.
    const { orderId, paymentId, paymentProvider, transactionId, amount, cryptoAmount } = body

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: orderId and paymentId" },
        { status: 400 },
      )
    }

    // 1. Fetch the payment record
    const { data: paymentRecord, error: paymentFetchError } = await db.getPaymentById(paymentId)

    if (paymentFetchError) {
      logger.error(`Error fetching payment record ${paymentId}:`, paymentFetchError)
      return NextResponse.json({ success: false, error: "Failed to fetch payment details" }, { status: 500 })
    }
    if (!paymentRecord) {
      logger.warn(`Payment record ${paymentId} not found for order completion.`)
      return NextResponse.json({ success: false, error: "Payment record not found" }, { status: 404 })
    }

    // 2. Verify payment status and association
    if (paymentRecord.order_id !== orderId) {
      logger.error(
        `Order ID mismatch for payment ${paymentId}. Associated: ${paymentRecord.order_id}, Request: ${orderId}`,
      )
      return NextResponse.json({ success: false, error: "Payment record does not match order" }, { status: 400 })
    }

    if (paymentRecord.status !== "completed") {
      logger.info(
        `Order completion attempt for order ${orderId} via payment ${paymentId}, but payment status is ${paymentRecord.status}.`,
      )
      return NextResponse.json(
        { success: false, error: `Payment not yet completed. Current status: ${paymentRecord.status}` },
        { status: 402 },
      ) // Payment Required
    }

    // 3. Fetch the order
    // Assuming getOrderById takes the UUID of the order
    const { data: order, error: orderFetchError } = await db.getOrderById(orderId)

    if (orderFetchError) {
      logger.error(`Error fetching order ${orderId} for completion:`, orderFetchError)
      return NextResponse.json({ success: false, error: "Failed to fetch order details" }, { status: 500 })
    }
    if (!order) {
      logger.warn(`Order ${orderId} not found for completion.`)
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // 4. Check if order is already completed (idempotency)
    if (order.status === "completed" || order.status === "processing") {
      logger.info(`Order ${orderId} is already in status ${order.status}. No action needed.`)
      return NextResponse.json({
        success: true,
        order: order, // Return the existing order
        payment: paymentRecord,
        message: `Order already ${order.status}.`,
      })
    }

    // 5. Update order status (this step might be redundant if paymentService.updatePaymentStatus already did it)
    // However, paymentService.updatePaymentStatus might have failed, or this is a re-check.
    // For safety, we can ensure the order status is correct here if the payment is 'completed'.
    // The actual update of order status and email sending is now primarily handled by
    // paymentService.updatePaymentStatus, called from the check-confirmations route.
    // This route now mostly serves as a final verification for the client.

    // If paymentService.updatePaymentStatus in check-confirmations handles emails and order update,
    // this /api/orders/complete route might just return the current state.
    // For now, let's assume it's a final check and confirmation.
    // The critical logic for emails/downloads was moved to paymentService.updatePaymentStatus.
    // If that function failed, this route won't re-trigger it unless explicitly designed to.

    logger.info(
      `Order ${orderId} (associated with payment ${paymentId}) confirmed as completed by client request. Payment status: ${paymentRecord.status}, Order status: ${order.status}.`,
    )

    // The actual update to order.status and sending emails should have been done by paymentService.updatePaymentStatus
    // when the payment was confirmed. This route is now more of a "client says it's done, let's give them the final order details".
    // If the order status isn't 'completed' here, but paymentRecord.status is 'completed', it indicates an issue
    // in the paymentService.updatePaymentStatus call from check-confirmations.

    // Let's ensure the order object reflects the latest state.
    const { data: finalOrderState, error: finalOrderError } = await db.getOrderById(orderId)
    if (finalOrderError || !finalOrderState) {
      logger.error(`Failed to re-fetch final order state for ${orderId}`)
      // Fallback to 'order' object, but log this issue.
    }

    return NextResponse.json({
      success: true,
      order: finalOrderState || order, // Return the potentially updated order
      payment: paymentRecord,
      message: "Order completion processed. Final status should reflect payment.",
    })
  } catch (error) {
    logger.error("Order completion API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
