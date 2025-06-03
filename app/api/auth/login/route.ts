import { loginUser, createToken } from "@/lib/auth-supabase"
import { AUTH_CONSTANTS, getCookieOptions } from "@/lib/auth-constants"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const result = await loginUser(email, password)

    if (!result.success || !result.user) {
      return NextResponse.json({ message: result.error || "Login failed" }, { status: 401 })
    }

    const token = createToken(result.user)

    const response = NextResponse.json({
      message: "Login successful",
      user: result.user,
    })

    response.cookies.set({
      name: AUTH_CONSTANTS.COOKIE_NAME,
      value: token,
      ...getCookieOptions(),
    })

    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 })
  }
}
