import { type NextRequest, NextResponse } from "next/server"

// Mock database of activation codes for testing
const mockActivationCodes = [
  {
    code: "TEST-VALID-CODE-123",
    productName: "Valorant Premium Hack",
    expiresAt: "2024-12-31T23:59:59Z",
    isUsed: false,
    isValid: true,
  },
  {
    code: "VALORANT-PREMIUM-2024",
    productName: "Valorant Premium Features",
    expiresAt: "2024-06-30T23:59:59Z",
    isUsed: false,
    isValid: true,
  },
  {
    code: "CS2-HACK-LIFETIME",
    productName: "CS2 Lifetime Access",
    expiresAt: null, // Lifetime
    isUsed: false,
    isValid: true,
  },
  {
    code: "EXPIRED-CODE-456",
    productName: "Fortnite Hack",
    expiresAt: "2023-12-31T23:59:59Z", // Expired
    isUsed: false,
    isValid: false,
  },
  {
    code: "USED-CODE-789",
    productName: "Apex Legends Hack",
    expiresAt: "2024-12-31T23:59:59Z",
    isUsed: true, // Already used
    isValid: false,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    // Validate input
    if (!code || typeof code !== "string") {
      return NextResponse.json({
        valid: false,
        message: "Activation code is required",
      })
    }

    // Trim and normalize the code
    const normalizedCode = code.trim().toUpperCase()

    // Check if code exists in our mock database
    const activationCode = mockActivationCodes.find((ac) => ac.code.toUpperCase() === normalizedCode)

    if (!activationCode) {
      return NextResponse.json({
        valid: false,
        message: "Invalid activation code. Please check your code and try again.",
      })
    }

    // Check if code has been used
    if (activationCode.isUsed) {
      return NextResponse.json({
        valid: false,
        message: "This activation code has already been used.",
      })
    }

    // Check if code has expired
    if (activationCode.expiresAt) {
      const expirationDate = new Date(activationCode.expiresAt)
      const now = new Date()

      if (now > expirationDate) {
        return NextResponse.json({
          valid: false,
          message: "This activation code has expired.",
        })
      }
    }

    // Check if code is marked as invalid
    if (!activationCode.isValid) {
      return NextResponse.json({
        valid: false,
        message: "This activation code is no longer valid.",
      })
    }

    // Code is valid
    return NextResponse.json({
      valid: true,
      message: "Activation code is valid and ready to use.",
      productName: activationCode.productName,
      expiresAt: activationCode.expiresAt,
    })
  } catch (error) {
    console.error("Error validating activation code:", error)

    return NextResponse.json(
      {
        valid: false,
        message: "An error occurred while validating the activation code. Please try again.",
      },
      { status: 500 },
    )
  }
}
