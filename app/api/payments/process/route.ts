import { type NextRequest, NextResponse } from "next/server"
import { processPayment } from "@/lib/payment-service"
import type { PaymentProvider } from "@/types/payment" // Ensure this type only includes crypto providers
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentProvider, amount, currency = "EUR", orderId, metadata } = body

    if (!paymentProvider || !amount || !orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: paymentProvider, amount, orderId" },
        { status: 400 },
      )
    }

    // Validate payment provider (should only be crypto now)
    const validCryptoProviders: PaymentProvider[] = ["bitcoin", "ethereum", "cardano"]
    if (!validCryptoProviders.includes(paymentProvider as PaymentProvider)) {
      return NextResponse.json(
        { success: false, error: "Invalid payment provider. Only cryptocurrency payments are accepted." },
        { status: 400 },
      )
    }

    const result = await processPayment(paymentProvider as PaymentProvider, amount, currency, {
      orderId,
      ...(metadata || {}),
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.errorMessage || "Payment processing failed" },
        { status: result.paymentId && result.redirectUrl ? 200 : 400 }, // If redirectUrl is present, it's a success from processPayment's perspective
      )
    }

    // processPayment for crypto now returns a redirectUrl and paymentId
    return NextResponse.json(result)
  } catch (error) {
    logger.error("Payment processing error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error during payment processing" },
      { status: 500 },
    )
  }
}
