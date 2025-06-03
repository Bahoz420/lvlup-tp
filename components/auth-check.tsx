"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function AuthCheck({ redirectTo = "/login" }: { redirectTo?: string }) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // Benutzer ist nicht angemeldet, zur Anmeldeseite weiterleiten
        router.push(`${redirectTo}?redirectTo=${window.location.pathname}`)
      }
    }

    checkAuth()
  }, [router, redirectTo, supabase])

  return null
}
