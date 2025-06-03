import { type NextRequest, NextResponse } from "next/server"
import { capturePayPalOrder } from "@/lib/payment/paypal"
import { updatePaymentStatus } from "@/lib/payment-service"
import { updateOrderStatus } from "@/lib/order-service"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json()

    if (!orderID) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 })
    }

    // Capture the PayPal order
    const captureResult = await capturePayPalOrder(orderID)

    if (!captureResult) {
      return NextResponse.json({ success: false, error: "Failed to capture PayPal payment" }, { status: 400 })
    }

    // Update payment status in our database
    await updatePaymentStatus(orderID, "succeeded", {
      captureId: captureResult.metadata?.captureId,
      payerEmail: captureResult.metadata?.payerEmail,
    })

    // Update order status if we can find the order
    // In a real app, you'd look up the order by the PayPal order ID
    const orderIdFromMetadata = captureResult.metadata?.orderId
    if (orderIdFromMetadata) {
      await updateOrderStatus(orderIdFromMetadata, "paid", {
        paymentId: orderID,
        paymentProvider: "paypal",
        captureId: captureResult.metadata?.captureId,
      })
    }

    return NextResponse.json({
      success: true,
      captureId: captureResult.metadata?.captureId,
    })
  } catch (error) {
    logger.error("Error capturing PayPal payment:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
