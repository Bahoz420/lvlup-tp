import { type NextRequest, NextResponse } from "next/server"
import { loginUser, createToken } from "@/lib/auth-supabase"
import { AUTH_CONSTANTS, getCookieOptions } from "@/lib/auth-constants"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Login user
    const result = await loginUser(email, password)

    if (!result.success) {
      return NextResponse.json({ message: result.error }, { status: 401 })
    }

    // Create JWT token
    const token = createToken(result.user!)

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: result.user,
    })

    // Set auth cookie
    response.cookies.set({
      name: AUTH_CONSTANTS.COOKIE_NAME,
      value: token,
      ...getCookieOptions(),
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
