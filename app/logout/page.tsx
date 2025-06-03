"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate logout process
    const timer = setTimeout(() => {
      // In a real app, you would clear auth tokens, cookies, etc.
      router.push("/")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100 p-4">
      <div className="text-center max-w-md">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <Image src="/logo.png" alt="lvlup Logo" fill className="object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-purple-800 mb-4">Logging Out...</h1>
        <p className="text-purple-600 mb-8">Thank you for using lvlup. You are being securely logged out.</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        </div>
      </div>
    </div>
  )
}
