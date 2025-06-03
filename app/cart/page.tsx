"use client"

import { useCart, type CartItem } from "@/contexts/cart-context"
import { formatPrice } from "@/utils/price-formatter"
import { Trash2, Plus, Minus, ShoppingBag, Sparkles, Star, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart()
  const [mounted, setMounted] = useState(false)
  const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleQuantityChange = (id: string, subscription: string, newQuantity: number) => {
    const itemKey = `${id}-${subscription}`
    setAnimatedItems((prev) => new Set(prev).add(itemKey))
    updateQuantity(id, subscription, newQuantity)

    setTimeout(() => {
      setAnimatedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemKey)
        return newSet
      })
    }, 500)
  }

  const handleRemoveItem = (id: string, subscription: string) => {
    const itemKey = `${id}-${subscription}`
    setAnimatedItems((prev) => new Set(prev).add(itemKey))

    setTimeout(() => {
      removeItem(id, subscription)
      setAnimatedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemKey)
        return newSet
      })
    }, 300)
  }

  // Helper function to get proper product image
  const getItemImage = (item: CartItem): string => {
    if (item.image_url && !item.image_url.includes("placeholder")) {
      return item.image_url
    }

    // Map product IDs to images
    if (item.id.includes("fortnite")) return "/fortnite-star-wars.jpg"
    if (item.id.includes("cs2")) return "/cs2.png"
    if (item.id.includes("valorant")) return "/valorant.png"
    if (item.id.includes("apex")) return "/apex.png"
    if (item.id.includes("warzone")) return "/warzone.png"
    if (item.id.includes("pubg")) return "/pubg.png"
    if (item.id.includes("rust")) return "/rust.png"

    return "/placeholder.svg"
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (items.length === 0) {
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
              <Star className="w-4 h-4 text-white/20" />
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <div className="glass-effect rounded-3xl p-12 max-w-2xl mx-auto animate-fade-in-up">
            <div className="mb-8 animate-bounce-slow">
              <ShoppingBag className="w-24 h-24 text-purple-400 mx-auto mb-4" />
              <Sparkles
                className="w-8 h-8 text-yellow-400 absolute animate-pulse"
                style={{ marginLeft: "60px", marginTop: "-80px" }}
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">
              Your Cart is Empty
            </h1>

            <p className="text-xl mb-8 text-white/80 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Ready to level up your gaming experience?
            </p>

            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-8 py-4 text-lg rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 animate-glow">
                  <Zap className="w-5 h-5 mr-2" />
                  Discover Epic Cheats
                </Button>
              </Link>

              <div className="flex justify-center space-x-4 mt-6">
                <div className="glass-effect rounded-xl p-4 animate-float" style={{ animationDelay: "0s" }}>
                  <span className="text-purple-400 font-semibold">🎮 Premium Quality</span>
                </div>
                <div className="glass-effect rounded-xl p-4 animate-float" style={{ animationDelay: "1s" }}>
                  <span className="text-blue-400 font-semibold">⚡ Instant Delivery</span>
                </div>
                <div className="glass-effect rounded-xl p-4 animate-float" style={{ animationDelay: "2s" }}>
                  <span className="text-pink-400 font-semibold">🔒 100% Safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Your Gaming Arsenal
          </h1>
          <p className="text-xl text-white/80">
            {itemCount} epic {itemCount === 1 ? "item" : "items"} ready for checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div
              className="glass-effect rounded-3xl overflow-hidden animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="p-8">
                <div className="space-y-6">
                  {items.map((item, index) => {
                    const itemKey = `${item.id}-${item.subscription}`
                    const isAnimated = animatedItems.has(itemKey)
                    const itemImage = getItemImage(item)

                    return (
                      <div
                        key={itemKey}
                        className={`glass-effect rounded-2xl p-6 transform transition-all duration-500 hover:scale-[1.02] animate-fade-in-up ${
                          isAnimated ? "animate-pulse scale-105" : ""
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          {/* Product Image */}
                          <div className="relative group">
                            <div className="w-24 h-24 relative overflow-hidden rounded-xl border-2 border-purple-400/30 group-hover:border-purple-400/60 transition-all duration-300">
                              <Image
                                src={itemImage || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                            <p className="text-purple-300 mb-2">
                              <span className="inline-flex items-center gap-1 glass-effect px-3 py-1 rounded-full text-sm">
                                <Zap className="w-4 h-4" />
                                {getSubscriptionLabel(item.subscription)}
                              </span>
                            </p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                              {formatPrice(item.price)} / {getSubscriptionLabel(item.subscription)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 glass-effect rounded-2xl p-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.subscription, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white flex items-center justify-center transform hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                                {item.quantity || 1}
                              </span>

                              <button
                                onClick={() => handleQuantityChange(item.id, item.subscription, item.quantity + 1)}
                                className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center justify-center transform hover:scale-110 transition-all duration-200"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.id, item.subscription)}
                              className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white flex items-center justify-center transform hover:scale-110 hover:rotate-12 transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
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
                <div className="glass-effect rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80">Items in cart:</span>
                    <span className="text-xl font-bold text-purple-400">{itemCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Subtotal:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link href="/checkout">
                    <Button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white py-4 text-lg rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 animate-glow">
                      <Zap className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-4">Secure checkout with:</p>
                    <div className="flex justify-center space-x-4">
                      <div className="glass-effect rounded-lg p-2 animate-float" style={{ animationDelay: "0s" }}>
                        <span className="text-xs text-purple-400">🔒 SSL</span>
                      </div>
                      <div className="glass-effect rounded-lg p-2 animate-float" style={{ animationDelay: "0.5s" }}>
                        <span className="text-xs text-blue-400">💳 Crypto</span>
                      </div>
                      <div className="glass-effect rounded-lg p-2 animate-float" style={{ animationDelay: "1s" }}>
                        <span className="text-xs text-green-400">⚡ Instant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotional Banner */}
            <div
              className="glass-effect rounded-3xl p-6 mt-6 animate-fade-in-up animate-float"
              style={{ animationDelay: "0.6s", animationDuration: "4s" }}
            >
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2 animate-pulse" />
                <h3 className="text-lg font-bold text-white mb-2">🔥 Limited Time Offer!</h3>
                <p className="text-sm text-white/80 mb-3">50% OFF Fortnite Lifetime Package</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                    {formatPrice(29.99)}
                  </span>
                  <span className="text-purple-300 line-through text-sm">{formatPrice(59.99)}</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
                  <div className="h-full w-3/4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
                <Link href="/products/fortnite">
                  <Button className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-red-500 hover:to-pink-500 text-white rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 text-sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Claim Offer Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getSubscriptionLabel(subscription: CartItem["subscription"]): string {
  if (!subscription) {
    return "3 Days"
  }

  console.log("getSubscriptionLabel - Input subscription:", subscription)

  switch (subscription) {
    case "day":
      return "3 Days" // FIXED: Map "day" to "3 Days" since that's what we're using
    case "3day":
      return "3 Days"
    case "week":
      return "1 Week"
    case "month":
      return "1 Month"
    case "3month":
      return "3 Months"
    case "6month":
      return "6 Months"
    case "year":
      return "1 Year"
    case "lifetime":
      return "Lifetime"
    default:
      if (subscription.endsWith("day") || subscription.endsWith("days")) {
        const days = subscription.replace(/day.*$/, "")
        return `${days} Day${days === "1" ? "" : "s"}`
      }
      if (subscription.endsWith("week") || subscription.endsWith("weeks")) {
        const weeks = subscription.replace(/week.*$/, "")
        return `${weeks} Week${weeks === "1" ? "" : "s"}`
      }
      if (subscription.endsWith("month") || subscription.endsWith("months")) {
        const months = subscription.replace(/month.*$/, "")
        return `${months} Month${months === "1" ? "" : "s"}`
      }
      if (subscription.endsWith("year") || subscription.endsWith("years")) {
        const years = subscription.replace(/year.*$/, "")
        return `${years} Year${years === "1" ? "" : "s"}`
      }
      return subscription
  }
}
