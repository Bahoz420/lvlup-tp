"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DiscountCodeInput } from "@/components/discount-code-input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Gift, Sparkles, Star, Zap } from "lucide-react"
import type { CartItem } from "@/types/product"

interface CartCheckoutProps {
  cartItems: CartItem[]
  onInformationSubmit?: (email: string, discountAmount: number, isGift?: boolean, recipientEmail?: string) => void
}

export function CartCheckout({ cartItems, onInformationSubmit }: CartCheckoutProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [discountCode, setDiscountCode] = useState<string | null>(null)
  const [isGift, setIsGift] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState("")
  const [discountInfo, setDiscountInfo] = useState<{
    code: string
    discount: number
    type: "percent" | "fixed"
    value: number
  } | null>(null)

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.19 // 19% VAT
  const total = subtotal + tax - discount

  const handleApplyDiscount = (info: {
    code: string
    discount: number
    type: "percent" | "fixed"
    value: number
  }) => {
    setDiscountCode(info.code || null)
    setDiscount(info.discount)
    setDiscountInfo(info.code ? info : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    if (isGift && !recipientEmail) {
      toast({
        title: "Error",
        description: "Please enter the recipient's email address",
        variant: "destructive",
      })
      return
    }

    if (onInformationSubmit) {
      onInformationSubmit(email, discount, isGift, isGift ? recipientEmail : undefined)
    } else {
      setIsSubmitting(true)

      try {
        // Simulate order processing
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Show success message
        toast({
          title: "Order Successful",
          description: `Your order has been successfully placed${discountCode ? ` with discount code ${discountCode}` : ""}`,
        })

        // Empty the cart
        localStorage.removeItem("cart")

        // Redirect to success page
        router.push("/purchase-complete")
      } catch (error) {
        console.error("Checkout error:", error)
        toast({
          title: "Error",
          description: "An error occurred during checkout",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Format price
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)}€`
  }

  return (
    <div className="grid gap-8 md:grid-cols-5">
      <div className="md:col-span-3">
        <div className="glass-effect rounded-3xl overflow-hidden animate-fade-in-up">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Your Information
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="glass-effect rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  <Label htmlFor="email" className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={isSubmitting}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                  />
                  <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Your activation code will be sent to this email address instantly.
                  </p>
                </div>

                <div className="glass-effect rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="is-gift"
                      checked={isGift}
                      onCheckedChange={(checked) => setIsGift(checked === true)}
                      disabled={isSubmitting}
                      className="border-white/30 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                    />
                    <Label
                      htmlFor="is-gift"
                      className="cursor-pointer text-white font-semibold flex items-center gap-2"
                    >
                      <Gift className="w-4 h-4 text-pink-400" />
                      This is a gift
                    </Label>
                  </div>

                  {isGift && (
                    <div className="mt-4 animate-fade-in-up">
                      <Label
                        htmlFor="recipient-email"
                        className="text-white font-semibold mb-3 flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        Recipient's Email
                      </Label>
                      <Input
                        id="recipient-email"
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="recipient@email.com"
                        required
                        disabled={isSubmitting}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-pink-400 focus:ring-pink-400/20 rounded-xl"
                      />
                      <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        The gift will be sent to this email address.
                      </p>
                    </div>
                  )}
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  <DiscountCodeInput
                    subtotal={subtotal}
                    onApplyDiscount={handleApplyDiscount}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </form>

            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <Link href="/cart">
                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  className="glass-effect border-white/20 hover:bg-white/10 text-white hover:text-white transition-all duration-300"
                >
                  Back to Cart
                </Button>
              </Link>
              <Button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-8 py-3 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 animate-glow"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : onInformationSubmit ? (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Continue to Payment
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Buy Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div
          className="glass-effect rounded-3xl p-8 animate-fade-in-up animate-float"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Order Summary
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
          </div>

          <div className="space-y-6">
            {cartItems.length > 0 ? (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.subscription}`}
                    className="glass-effect rounded-xl p-4 animate-fade-in-up"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="text-white font-semibold block">
                          {item.name} ({item.subscription})
                        </span>
                        {item.quantity > 1 && <span className="text-white/60 text-sm">Quantity: {item.quantity}</span>}
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center">Your cart is empty</p>
            )}

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Subtotal</span>
                <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/80">VAT (19%)</span>
                <span className="text-white font-semibold">{formatPrice(tax)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-green-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Discount (
                    {discountInfo?.type === "percent" ? `${discountInfo.value}%` : `${discountInfo?.value.toFixed(2)}€`}
                    )
                  </span>
                  <span className="text-green-400 font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div
          className="glass-effect rounded-3xl p-6 mt-6 animate-fade-in-up animate-float"
          style={{ animationDelay: "0.6s", animationDuration: "4s" }}
        >
          <div className="text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3 animate-pulse" />
            <h3 className="text-lg font-bold text-white mb-3">🔒 Secure & Trusted</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="glass-effect rounded-lg p-3">
                <span className="text-green-400">✓ SSL Encrypted</span>
              </div>
              <div className="glass-effect rounded-lg p-3">
                <span className="text-blue-400">✓ Instant Delivery</span>
              </div>
              <div className="glass-effect rounded-lg p-3">
                <span className="text-purple-400">✓ 24/7 Support</span>
              </div>
              <div className="glass-effect rounded-lg p-3">
                <span className="text-pink-400">✓ Money Back</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
