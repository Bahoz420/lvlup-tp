"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Safely log the error
    if (error) {
      console.error("Application error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        digest: error.digest,
      })
    }
  }, [error])

  // Safely extract error message
  const getErrorMessage = () => {
    if (!error) return "Unknown error occurred"

    // Handle different error types
    if (typeof error === "string") return error
    if (error.message) return error.message
    if (error.name) return error.name

    // If it's a complex object, try to stringify safely
    try {
      return JSON.stringify(error, null, 2)
    } catch {
      return "Error occurred but cannot display details"
    }
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100 p-4">
      <div className="text-center max-w-md">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <Image src="/logo.png" alt="lvlup Logo" fill className="object-contain" />
        </div>
        <h1 className="text-4xl font-bold text-purple-800 mb-4">Something went wrong!</h1>
        <p className="text-purple-600 mb-4">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left max-w-full overflow-auto">
            <h3 className="font-semibold text-red-800 mb-2">Error Details (Development):</h3>
            <pre className="text-sm text-red-700 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
              {errorMessage}
            </pre>
            {error?.digest && <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => {
              try {
                reset()
              } catch (resetError) {
                console.error("Reset failed:", resetError)
                window.location.href = "/"
              }
            }}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
          >
            Try Again
          </Button>
          <Button asChild variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
