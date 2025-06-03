"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function LogoutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Logged out successfully",
        description: "You have been signed out.",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} disabled={loading} variant="ghost" size="sm" className={className}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {loading ? "Signing out..." : "Logout"}
    </Button>
  )
}
