import { type NextRequest, NextResponse } from "next/server"
import { generateWalletAddress } from "@/lib/crypto-api-service"
import type { PaymentProvider } from "@/types/payment"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { provider } = body

    if (!provider) {
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
          error: "Invalid crypto provider",
        },
        { status: 400 },
      )
    }

    // Generate wallet address
    const walletAddress = await generateWalletAddress(provider as PaymentProvider)

    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate wallet address",
        },
        { status: 500 },
      )
    }

    logger.info(`Generated wallet address for ${provider}: ${walletAddress}`)

    return NextResponse.json({
      success: true,
      walletAddress,
    })
  } catch (error) {
    logger.error("Wallet address generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
