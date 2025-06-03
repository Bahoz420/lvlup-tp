import { type NextRequest, NextResponse } from "next/server"
import { validatePayment } from "@/lib/payment-service"
import type { PaymentProvider } from "@/types/payment"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { paymentId, provider } = body

    if (!paymentId || !provider) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Validate payment provider
    if (!["bitcoin", "ethereum", "cardano"].includes(provider)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment provider. Only cryptocurrency payments are supported for verification.",
        },
        { status: 400 },
      )
    }

    // Verify the payment
    const isValid = await validatePayment(paymentId, provider as PaymentProvider)

    return NextResponse.json({
      success: isValid,
      verified: isValid,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
