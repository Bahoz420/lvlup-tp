"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { CartCheckout } from "@/components/cart-checkout"
import { PaymentProcessor } from "@/components/payment-processor"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, CreditCard, Sparkles, Star, Zap, Shield, Clock } from "lucide-react"
import type { CartItem } from "@/types/product"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("information")
  const [email, setEmail] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)

  useEffect(() => {
    // Load cart from localStorage
    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        if (parsedCart && parsedCart.length > 0) {
          setCartItems(parsedCart)
        } else {
          // Redirect to cart page if cart is empty
          router.push("/cart")
          toast({
            title: "Empty Cart",
            description: "Your cart is empty. Please add products before proceeding to checkout.",
            variant: "destructive",
          })
        }
      } else {
        // Redirect to cart page if no cart exists
        router.push("/cart")
        toast({
          title: "Empty Cart",
          description: "Your cart is empty. Please add products before proceeding to checkout.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading cart:", error)
      toast({
        title: "Error",
        description: "An error occurred while loading your cart.",
        variant: "destructive",
      })
      // Also redirect to cart page in case of an error
      router.push("/cart")
    } finally {
      setIsLoading(false)
    }
  }, [router, toast])

  // Handle information submission
  const handleInformationSubmit = (customerEmail: string, discount: number) => {
    setEmail(customerEmail)
    setDiscountAmount(discount)
    setActiveTab("payment")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <Navigation />

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-bounce-slow"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-float"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
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
              <Sparkles className="w-3 h-3 text-white/20" />
            </div>
          ))}
        </div>

        <main className="container py-16 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">
              Secure Checkout
            </h1>
            <div className="flex justify-center items-center h-64">
              <div className="glass-effect rounded-3xl p-8 animate-fade-in-up">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-white/80 text-lg">Loading your order...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

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
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Secure Checkout
          </h1>
          <p className="text-xl text-white/80">Complete your order and get instant access to your gaming cheats</p>

          {/* Security badges */}
          <div className="flex justify-center space-x-6 mt-6">
            <div className="glass-effect rounded-xl p-3 animate-float" style={{ animationDelay: "0s" }}>
              <Shield className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <span className="text-xs text-green-400 font-semibold">SSL Secured</span>
            </div>
            <div className="glass-effect rounded-xl p-3 animate-float" style={{ animationDelay: "0.5s" }}>
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <span className="text-xs text-blue-400 font-semibold">Instant Delivery</span>
            </div>
            <div className="glass-effect rounded-xl p-3 animate-float" style={{ animationDelay: "1s" }}>
              <Zap className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <span className="text-xs text-purple-400 font-semibold">Auto Activation</span>
            </div>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="glass-effect rounded-3xl overflow-hidden mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="p-6 border-b border-white/10">
                  <TabsList className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1 w-full max-w-md mx-auto">
                    <TabsTrigger
                      value="information"
                      className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Information
                    </TabsTrigger>
                    <TabsTrigger
                      value="payment"
                      disabled={!email}
                      className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300 disabled:opacity-50"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8">
                  <TabsContent value="information" className="mt-0">
                    <div className="animate-fade-in-up">
                      <CartCheckout cartItems={cartItems} onInformationSubmit={handleInformationSubmit} />
                    </div>
                  </TabsContent>

                  <TabsContent value="payment" className="mt-0">
                    {activeTab === "payment" && (
                      <div className="space-y-6 animate-fade-in-up">
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("information")}
                          className="mb-6 glass-effect border-white/20 hover:bg-white/10 text-white hover:text-white transition-all duration-300"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Information
                        </Button>

                        <div
                          className="glass-effect rounded-2xl p-6 mb-6 animate-fade-in-up"
                          style={{ animationDelay: "0.1s" }}
                        >
                          <div className="text-center mb-4">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                              Order Summary
                            </h3>
                            <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-white/10">
                              <span className="text-white/80">Subtotal:</span>
                              <span className="text-white font-semibold">
                                {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}€
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/10">
                              <span className="text-white/80">Tax (19%):</span>
                              <span className="text-white font-semibold">
                                {(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.19).toFixed(
                                  2,
                                )}
                                €
                              </span>
                            </div>
                            {discountAmount > 0 && (
                              <div className="flex justify-between py-2 border-b border-white/10">
                                <span className="text-green-400">Discount:</span>
                                <span className="text-green-400 font-semibold">-{discountAmount.toFixed(2)}€</span>
                              </div>
                            )}
                            <div className="flex justify-between py-3 border-t border-white/20">
                              <span className="text-xl font-bold text-white">Total:</span>
                              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                {(
                                  cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.19 -
                                  discountAmount
                                ).toFixed(2)}
                                €
                              </span>
                            </div>
                            <div className="text-center pt-2">
                              <p className="text-sm text-white/60">
                                Email: <span className="text-purple-300">{email}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                          <PaymentProcessor cartItems={cartItems} discountAmount={discountAmount} email={email} />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="glass-effect rounded-3xl p-12 max-w-2xl mx-auto">
              <ShoppingCart className="w-24 h-24 text-purple-400 mx-auto mb-6 animate-bounce-slow" />
              <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-lg mb-6 text-white/80">Add some epic gaming cheats to get started!</p>
              <Button
                onClick={() => router.push("/products")}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-8 py-4 text-lg rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 animate-glow"
              >
                <Zap className="w-5 h-5 mr-2" />
                Browse Products
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
