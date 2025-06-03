import { NextResponse } from "next/server"
import { cookies } from "next/headers" // Added this import
import { AUTH_CONSTANTS, getCookieOptions } from "@/lib/auth-constants"

export async function POST() {
  try {
    const cookieStore = cookies()
    cookieStore.set(AUTH_CONSTANTS.COOKIE_NAME, "", getCookieOptions(0)) // Expire the cookie

    return NextResponse.json({ message: "Logout successful" }) // This message suggests logout
  } catch (error) {
    console.error("Logout error:", error) // This also suggests logout
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
