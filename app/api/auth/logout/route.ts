import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_CONSTANTS, getCookieOptions } from "@/lib/auth-constants";

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.set(AUTH_CONSTANTS.COOKIE_NAME, "", getCookieOptions(0)); // Expire the cookie

    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
