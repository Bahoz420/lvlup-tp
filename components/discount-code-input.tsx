"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Test codes for demonstration
const TEST_DISCOUNT_CODES = {
  TEST10: { type: "percent", value: 10 },
  TEST20: { type: "percent", value: 20 },
  FLAT15: { type: "fixed", value: 15 },
  FLAT30: { type: "fixed", value: 30 },
}

interface DiscountCodeInputProps {
  subtotal: number
  onApplyDiscount: (info: {
    code: string
    discount: number
    type: "percent" | "fixed"
    value: number
  }) => void
  disabled?: boolean
}

export function DiscountCodeInput({ subtotal, onApplyDiscount, disabled = false }: DiscountCodeInputProps) {
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [appliedCode, setAppliedCode] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleApplyCode = async () => {
    if (!code) {
      setError("Please enter a discount code")
      toast({
        title: "Error",
        description: "Please enter a discount code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate an API request
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Check if the code is valid (for testing purposes)
      const upperCode = code.toUpperCase()
      const discountInfo = TEST_DISCOUNT_CODES[upperCode as keyof typeof TEST_DISCOUNT_CODES]

      if (!discountInfo) {
        setError("The entered discount code is invalid")
        toast({
          title: "Invalid Discount Code",
          description: "The entered discount code is invalid",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Calculate the discount amount
      let discountAmount = 0
      if (discountInfo.type === "percent") {
        discountAmount = (subtotal * discountInfo.value) / 100
      } else {
        discountAmount = Math.min(discountInfo.value, subtotal) // Discount cannot be greater than the order value
      }

      // Call the callback function to apply the discount
      onApplyDiscount({
        code: upperCode,
        discount: discountAmount,
        type: discountInfo.type,
        value: discountInfo.value,
      })

      setIsApplied(true)
      setAppliedCode(upperCode)

      toast({
        title: "Discount Code Applied",
        description: `The discount code "${upperCode}" has been successfully applied`,
      })
    } catch (error) {
      console.error("Error applying discount code:", error)
      setError("An error occurred while applying the discount code")
      toast({
        title: "Error",
        description: "An error occurred while applying the discount code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveCode = () => {
    setCode("")
    setIsApplied(false)
    setAppliedCode("")
    setError(null)
    onApplyDiscount({
      code: "",
      discount: 0,
      type: "fixed",
      value: 0,
    })

    toast({
      title: "Discount Code Removed",
      description: "The discount code has been removed",
    })
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="discount-code">Discount Code</Label>
      <div className="flex space-x-2">
        <Input
          id="discount-code"
          placeholder="Enter discount code"
          value={isApplied ? appliedCode : code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isApplied || isLoading || disabled}
          aria-invalid={!!error}
          aria-errormessage={error ? "discount-code-error" : undefined}
        />
        {isApplied ? (
          <Button variant="outline" onClick={handleRemoveCode} disabled={isLoading || disabled}>
            Remove
          </Button>
        ) : (
          <Button onClick={handleApplyCode} disabled={isLoading || !code || disabled}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Apply"
            )}
          </Button>
        )}
      </div>
      {error && (
        <p id="discount-code-error" className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
      {isApplied && <p className="text-sm text-green-600 mt-1">Discount code applied: {appliedCode}</p>}
    </div>
  )
}
