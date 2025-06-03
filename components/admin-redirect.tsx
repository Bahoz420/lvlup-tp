"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function AdminRedirect() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Prüfe, ob der Benutzer angemeldet ist
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Prüfe, ob der Benutzer ein Admin ist
        const { data: userRole } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single()

        // Wenn der Benutzer ein Admin ist, zum Admin-Dashboard weiterleiten
        if (userRole) {
          router.push("/admin")
        }
      }
    }

    checkAdminStatus()
  }, [router, supabase])

  return null
}
