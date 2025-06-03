"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PaymentMethodSelector } from "@/components/payment-method-selector"
import { CryptoPayment } from "@/components/payment-methods/crypto-payment"
import { getAvailablePaymentMethods } from "@/lib/payment-service"
import { convertFiatToCrypto } from "@/lib/crypto-api-service"
import type { PaymentMethod } from "@/types/payment"
import type { CartItem } from "@/types/product"

interface PaymentProcessorProps {
  cartItems: CartItem[]
  discountAmount?: number
  email: string
}

export function PaymentProcessor({ cartItems, discountAmount = 0, email }: PaymentProcessorProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cryptoAmount, setCryptoAmount] = useState<string>("")

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.19 // 19% VAT
  const total = subtotal + tax - discountAmount

  // Load available payment methods
  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        const methods = await getAvailablePaymentMethods()
        setPaymentMethods(methods)

        if (methods.length > 0) {
          setSelectedPaymentMethodId(methods[0].id)
        }
      } catch (error) {
        console.error("Error loading payment methods:", error)
        setError("Failed to load payment methods. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadPaymentMethods()
  }, [])

  // Convert fiat to crypto when payment method changes
  useEffect(() => {
    async function convertAmount() {
      const selectedMethod = paymentMethods.find((method) => method.id === selectedPaymentMethodId)
      if (!selectedMethod) return

      try {
        const conversion = await convertFiatToCrypto(total, selectedMethod.provider, "eur")
        if (conversion) {
          setCryptoAmount(conversion.cryptoAmount)
        }
      } catch (error) {
        console.error("Error converting amount:", error)
        setError("Failed to convert amount to cryptocurrency.")
      }
    }

    if (selectedPaymentMethodId && total > 0) {
      convertAmount()
    }
  }, [selectedPaymentMethodId, total, paymentMethods])

  // Get the selected payment method
  const selectedMethod = paymentMethods.find((method) => method.id === selectedPaymentMethodId)

  // Handle payment completion from the payment method components
  const handlePaymentComplete = async (success: boolean, paymentData?: any) => {
    if (!success || !paymentData) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // In a real app, we would finalize the order with our backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Clear cart
      localStorage.removeItem("cart")

      // Display success message
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully!",
      })

      // Redirect to purchase complete page
      router.push(`/purchase-complete?provider=${paymentData.provider}&paymentId=${paymentData.paymentId}`)
    } catch (error) {
      console.error("Error finalizing payment:", error)
      toast({
        title: "Error",
        description: "There was an error finalizing your order. Please contact support.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Cryptocurrency</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethodSelector
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onSelectPaymentMethod={setSelectedPaymentMethodId}
            disabled={isProcessing}
          />
        </CardContent>
      </Card>

      <div className="mt-6">
        {selectedMethod && cryptoAmount && (
          <CryptoPayment
            amount={total}
            cryptoAmount={cryptoAmount}
            cryptoType={selectedMethod.provider}
            onPaymentComplete={handlePaymentComplete}
            disabled={isProcessing}
          />
        )}
      </div>
    </div>
  )
}
