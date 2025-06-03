"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface CreditCardPaymentProps {
  amount: number
  onPaymentComplete: (success: boolean, data?: any) => void
  disabled?: boolean
}

export function CreditCardPayment({ amount, onPaymentComplete, disabled = false }: CreditCardPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Split into chunks of 4 and join with spaces
    const formatted = digits.match(/.{1,4}/g)?.join(" ") || digits

    return formatted.substring(0, 19) // Max 16 digits + 3 spaces
  }

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`
    }

    return digits
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate card number (simple Luhn check would be here in a real app)
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Please enter a valid card number"
    }

    // Validate expiry date
    if (!expiryDate || expiryDate.length < 5) {
      newErrors.expiryDate = "Please enter a valid expiry date"
    } else {
      const [month, year] = expiryDate.split("/")
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
        newErrors.expiryDate = "Invalid month"
      } else if (
        Number.parseInt(`20${year}`) < new Date().getFullYear() ||
        (Number.parseInt(`20${year}`) === new Date().getFullYear() && Number.parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "Card has expired"
      }
    }

    // Validate CVC
    if (!cvc || cvc.length < 3) {
      newErrors.cvc = "Please enter a valid CVC"
    }

    // Validate cardholder name
    if (!cardholderName || cardholderName.length < 3) {
      newErrors.cardholderName = "Please enter the cardholder name"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || disabled) {
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, this would call a Stripe API
      onPaymentComplete(true, {
        provider: "stripe",
        paymentId: `pi_${Math.random().toString(36).substring(2, 15)}`,
      })
    } catch (error) {
      console.error("Payment error:", error)
      onPaymentComplete(false)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              disabled={isProcessing || disabled}
              className={errors.cardNumber ? "border-red-500" : ""}
            />
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={5}
                disabled={isProcessing || disabled}
                className={errors.expiryDate ? "border-red-500" : ""}
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 3))}
                maxLength={3}
                disabled={isProcessing || disabled}
                className={errors.cvc ? "border-red-500" : ""}
              />
              {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              disabled={isProcessing || disabled}
              className={errors.cardholderName ? "border-red-500" : ""}
            />
            {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isProcessing || disabled}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${amount.toFixed(2)}€`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
