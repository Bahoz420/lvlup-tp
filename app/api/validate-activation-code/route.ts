import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/supabase-database"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ message: "Activation code is required" }, { status: 400 })
    }

    // Get activation code from database
    const { data: activationData, error } = await db.getActivationCode(code)

    if (error || !activationData) {
      return NextResponse.json({ message: "Invalid or expired activation code" }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      message: "Valid activation code",
      productName: activationData.products.name,
      expiresAt: activationData.expires_at,
      customerEmail: activationData.customer_email,
    })
  } catch (error) {
    console.error("Validation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
