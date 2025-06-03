import { type NextRequest, NextResponse } from "next/server"
import { registerUser, createToken } from "@/lib/auth-supabase"
import { AUTH_CONSTANTS, getCookieOptions } from "@/lib/auth-constants"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, activationCode } = await request.json()

    // Validate inputs
    if (!email || !password || !activationCode) {
      return NextResponse.json({ message: "Email, password, and activation code are required" }, { status: 400 })
    }

    // Register user
    const result = await registerUser(email, password, activationCode, firstName, lastName)

    if (!result.success) {
      return NextResponse.json({ message: result.error }, { status: 400 })
    }

    // Create JWT token
    const token = createToken(result.user!)

    // Create response
    const response = NextResponse.json({
      message: "Account created successfully",
      user: result.user,
      software_credentials: result.softwareCredentials,
    })

    // Set auth cookie
    response.cookies.set({
      name: AUTH_CONSTANTS.COOKIE_NAME,
      value: token,
      ...getCookieOptions(),
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
