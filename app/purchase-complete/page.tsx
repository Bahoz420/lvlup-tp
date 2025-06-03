"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Check, Loader2, Star, Sparkles, Shield, Zap, Download, ExternalLink, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { PaymentProvider } from "@/types/payment"

export default function PurchaseCompletePage() {
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(true)
  const [orderNumber, setOrderNumber] = useState<string>("")

  // Get payment provider from query params if available
  const provider = searchParams.get("provider") as PaymentProvider | null
  const paymentId = searchParams.get("paymentId") || ""
  const orderId = searchParams.get("orderId") || ""

  useEffect(() => {
    // Generate a random order number for demo purposes
    const randomOrderNumber = `ORD-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`
    setOrderNumber(orderId || paymentId || randomOrderNumber)

    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [paymentId, orderId])

  // Get payment method details
  const getPaymentMethodDetails = () => {
    if (!provider) return { name: "Cryptocurrency Payment", icon: null }

    switch (provider) {
      case "bitcoin":
        return {
          name: "Bitcoin",
          icon: "/bitcoin-icon.png",
        }
      case "ethereum":
        return {
          name: "Ethereum",
          icon: "/ethereum-icon.png",
        }
      case "cardano":
        return {
          name: "Cardano",
          icon: "/cardano-icon.png",
        }
      default:
        // This case should ideally not be hit if provider is correctly typed
        return { name: "Cryptocurrency Payment", icon: null }
    }
  }

  const paymentMethod = getPaymentMethodDetails()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <Navigation />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Star className="w-3 h-3 text-white/20" />
          </div>
        ))}
      </div>

      <main className="container py-16 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="glass-effect rounded-3xl p-12 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-purple-400 mx-auto mb-6" />
              <p className="text-xl text-white/80">Finalizing your purchase...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Thank You for Your Purchase!
              </h1>
              <p className="text-xl text-white/80">Your order has been successfully processed and confirmed</p>
            </div>

            <div className="glass-effect rounded-3xl p-8 mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 glass-effect rounded-full flex items-center justify-center mb-6 border border-green-400/30 animate-pulse">
                  <Check className="h-10 w-10 text-green-400" />
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto mb-6"></div>
              </div>

              <div className="border-t border-b border-white/10 py-6 my-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-white/60">Order Number:</div>
                  <div className="font-medium text-white bg-gradient-to-r from-purple-400 to-pink-400 px-4 py-2 rounded-xl">
                    {orderNumber}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-white/60">Payment Method:</div>
                  <div className="font-medium flex items-center glass-effect px-4 py-2 rounded-xl">
                    {paymentMethod.icon && (
                      <div className="w-6 h-6 relative mr-2">
                        <Image
                          src={paymentMethod.icon || "/placeholder.svg"}
                          alt={paymentMethod.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <span className="text-white">{paymentMethod.name}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-white/80 text-center">
                  We've sent a confirmation email with details of your purchase and activation instructions. Please
                  check your inbox (and spam folder) for this important information.
                </p>

                <div
                  className="glass-effect rounded-2xl p-6 bg-purple-900/30 animate-float"
                  style={{ animationDelay: "0.3s" }}
                >
                  <h3 className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 text-center">
                    What's Next?
                  </h3>
                  <ul className="space-y-4">
                    <li
                      className="flex items-start glass-effect rounded-xl p-3 animate-fade-in-up"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-purple-400" />
                      <span className="text-white/90">Check your email for your activation code and instructions</span>
                    </li>
                    <li
                      className="flex items-start glass-effect rounded-xl p-3 animate-fade-in-up"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <Download className="h-5 w-5 mr-3 flex-shrink-0 text-blue-400" />
                      <span className="text-white/90">Download the software from your account dashboard</span>
                    </li>
                    <li
                      className="flex items-start glass-effect rounded-xl p-3 animate-fade-in-up"
                      style={{ animationDelay: "0.6s" }}
                    >
                      <Zap className="h-5 w-5 mr-3 flex-shrink-0 text-pink-400" />
                      <span className="text-white/90">Follow the installation guide to set up your new software</span>
                    </li>
                  </ul>
                </div>

                <div
                  className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6 animate-fade-in-up"
                  style={{ animationDelay: "0.7s" }}
                >
                  <Link href="/dashboard/downloads">
                    <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-8 py-3 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 animate-glow w-full sm:w-auto">
                      <Download className="w-5 h-5 mr-2" />
                      Go to Downloads
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="glass-effect border-white/20 hover:bg-white/10 text-white hover:text-white transition-all duration-300 w-full sm:w-auto"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      View Order in Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Security badges */}
            <div className="flex justify-center space-x-6 mt-10 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
              <div className="glass-effect rounded-xl p-3 animate-float" style={{ animationDelay: "0s" }}>
                <Shield className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <span className="text-xs text-green-400 font-semibold">Secure Payment</span>
              </div>
              <div className="glass-effect rounded-xl p-3 animate-float" style={{ animationDelay: "0.5s" }}>
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <span className="text-xs text-blue-400 font-semibold">Instant Delivery</span>
              </div>
              <div className="glass-effect rounded-xl p-3 animate-float" style={{ animationDelay: "1s" }}>
                <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <span className="text-xs text-purple-400 font-semibold">Premium Support</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
