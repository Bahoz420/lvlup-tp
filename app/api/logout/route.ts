import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    })

    response.cookies.set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
