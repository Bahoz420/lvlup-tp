import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Demo-Modus aktivieren
    const response = NextResponse.json({
      message: "Demo mode activated",
      user: {
        id: "demo-user",
        email: "demo@example.com",
        role: "customer",
      },
    })

    // Demo-Modus-Cookie setzen
    response.cookies.set({
      name: "demo_mode",
      value: "true",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 Tag
    })

    return response
  } catch (error) {
    console.error("Demo login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
