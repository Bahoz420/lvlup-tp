"use client"
import { useRouter, useSearchParams } from "next/navigation" // Keep useSearchParams
import { Navigation } from "@/components/navigation" // Assuming Navigation is correctly imported
import { EnhancedCryptoPayment } from "./enhanced-crypto-payment" // Corrected import path
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react" // For loading state
import { AlertCircle } from "lucide-react" // Import AlertCircle
import { Button } from "@/components/button" // Assuming Button is correctly imported

export default function CryptoPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams() // Get searchParams instance

  const [provider, setProvider] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [amount, setAmount] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [fiatAmount, setFiatAmount] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null) // New state for paymentId
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams) {
      const p = searchParams.get("provider")
      const o = searchParams.get("orderId")
      const a = searchParams.get("amount")
      const w = searchParams.get("walletAddress")
      const fA = searchParams.get("fiatAmount")
      const pId = searchParams.get("paymentId") // Get paymentId

      if (!p || !o || !a || !w || !fA || !pId) {
        // Check for paymentId
        setError("Missing one or more required payment parameters in URL.")
        setIsLoading(false)
        // return notFound(); // Or handle error more gracefully
        return
      }

      if (!["bitcoin", "ethereum", "cardano"].includes(p)) {
        setError("Invalid payment provider specified.")
        setIsLoading(false)
        // return notFound();
        return
      }
      setProvider(p)
      setOrderId(o)
      setAmount(a)
      setWalletAddress(w)
      setFiatAmount(fA)
      setPaymentId(pId) // Set paymentId
      setIsLoading(false)
    }
  }, [searchParams]) // Depend on searchParams

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-700" />
        <p className="mt-4 text-lg text-purple-700">Loading Payment Details...</p>
      </div>
    )
  }

  if (error || !provider || !orderId || !amount || !walletAddress || !fiatAmount || !paymentId) {
    // Instead of notFound(), show an error message or redirect
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex flex-col">
        <Navigation />
        <main className="container py-12 flex-grow flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-700 mb-2">Payment Error</h1>
            <p className="text-red-600">
              {error || "Could not load payment details. Please check the URL or try again."}
            </p>
            <Button onClick={() => router.push("/")} className="mt-6">
              Go to Homepage
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col">
      <Navigation />
      <main className="container py-12 flex-grow">
        <EnhancedCryptoPayment
          provider={provider as any} // Cast as any, or ensure provider type matches PaymentProvider
          amount={amount}
          fiatAmount={Number.parseFloat(fiatAmount || "0")}
          walletAddress={walletAddress}
          orderId={orderId}
          paymentId={paymentId} // Pass paymentId
        />
      </main>
    </div>
  )
}
