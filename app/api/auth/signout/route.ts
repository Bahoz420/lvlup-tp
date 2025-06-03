import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Benutzer abmelden
  await supabase.auth.signOut()

  // Zur Startseite weiterleiten
  return NextResponse.redirect(new URL("/", request.url), {
    status: 302,
  })
}
