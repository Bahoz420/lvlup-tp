"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Star, Shield, Clock, Users, Check, Info, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { formatPrice, calculateSubscriptionPrice } from "@/utils/price-formatter"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import AnimatedStatusBadge from "@/components/animated-status-badge"

// Status color mapping
const statusColorMap = {
  online: "green",
  updating: "amber",
  offline: "red",
  maintenance: "blue",
}

export default function ProductDetailClient({ product, relatedProducts, slug }) {
  const [selectedSubscription, setSelectedSubscription] = useState("day")
  const [quantity, setQuantity] = useState(1)

  // Calculate price based on subscription using your existing function
  const finalPrice = calculateSubscriptionPrice(product.slug, selectedSubscription)

  // Format the subscription for display
  const formatSubscription = (sub) => {
    switch (sub) {
      case "day":
        return "3 Days"
      case "week":
        return "1 Week"
      case "month":
        return "1 Month"
      case "lifetime":
        return "Lifetime"
      default:
        return sub
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-purple-800/50 to-indigo-900/50"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>

      {/* Static floating orbs for better performance */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-pulse-slow"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-xl animate-bounce-slow"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-r from-amber-500/25 to-orange-500/25 rounded-full blur-lg animate-bounce-slow"></div>

      <div className="container py-8 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-purple-300">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-amber-400 transition-colors">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-amber-400">{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
            <MobileOptimizedCard className="relative overflow-hidden aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-900/50"></div>
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                width={800}
                height={450}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <AnimatedStatusBadge status={product.status} />
              </div>
            </MobileOptimizedCard>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-600"}`}
                    />
                  ))}
                  <span className="ml-2 text-white">{product.rating}</span>
                  <span className="ml-1 text-purple-300">({product.review_count} reviews)</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-purple-400/50 text-purple-300 bg-purple-400/10 backdrop-blur-sm"
                >
                  {product.version || "v2.0"}
                </Badge>
              </div>
              <p className="text-purple-200 mb-6">{product.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-green-500/20 backdrop-blur-sm">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-white">Undetected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-500/20 backdrop-blur-sm">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-white">Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-amber-500/20 backdrop-blur-sm">
                    <Users className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-white">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Subscription Selection */}
            <MobileOptimizedCard className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Select Subscription</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {["day", "week", "month", "lifetime"].map((sub) => (
                  <button
                    key={sub}
                    className={`p-3 rounded-lg border ${
                      selectedSubscription === sub
                        ? "border-amber-400 bg-amber-400/20 text-amber-400"
                        : "border-purple-400/30 bg-purple-400/10 text-purple-300 hover:bg-purple-400/20"
                    } transition-all duration-300 text-sm font-medium`}
                    onClick={() => setSelectedSubscription(sub)}
                  >
                    {formatSubscription(sub)}
                  </button>
                ))}
              </div>

              {/* Price Display */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    {formatPrice(finalPrice)}
                  </span>
                  {product.sale_price && product.sale_price > finalPrice && (
                    <span className="ml-2 text-lg text-purple-300 line-through">{formatPrice(product.sale_price)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 rounded-full border border-purple-400/30 bg-purple-400/10 text-white flex items-center justify-center hover:bg-purple-400/20"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-white">{quantity}</span>
                  <button
                    className="w-8 h-8 rounded-full border border-purple-400/30 bg-purple-400/10 text-white flex items-center justify-center hover:bg-purple-400/20"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <AddToCartButton
                product={product}
                subscription={selectedSubscription}
                subscriptionPrice={finalPrice}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              />

              {/* Status Info */}
              <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                <p className="text-sm text-blue-300">
                  This product is currently{" "}
                  <span className={`font-medium text-${statusColorMap[product.status]}-400`}>{product.status}</span>.
                  Check our{" "}
                  <Link href="/info" className="text-amber-400 hover:underline">
                    status page
                  </Link>{" "}
                  for more information.
                </p>
              </div>
            </MobileOptimizedCard>
          </div>
        </div>

        {/* Product Details Tabs */}
        <MobileOptimizedCard className="mb-12">
          <Tabs defaultValue="features">
            <TabsList className="w-full grid grid-cols-3 bg-purple-400/10 border-b border-purple-400/20">
              <TabsTrigger
                value="features"
                className="data-[state=active]:bg-purple-400/20 data-[state=active]:text-white"
              >
                Features
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-purple-400/20 data-[state=active]:text-white"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-purple-400/20 data-[state=active]:text-white"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-500/20 mt-0.5">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                    <span className="text-purple-200">{feature}</span>
                  </li>
                ))}
                {!product.features?.length && (
                  <li className="text-purple-300">No features specified for this product.</li>
                )}
              </ul>
            </TabsContent>
            <TabsContent value="description" className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Product Description</h3>
              <div className="text-purple-200 space-y-4">
                <p>{product.long_description || product.description}</p>
                <p>
                  Our {product.name} is designed to give you the competitive edge you need. With regular updates and
                  dedicated support, you can be confident that your gaming experience will be enhanced to the fullest.
                </p>
                <p>
                  We pride ourselves on providing undetected, high-quality gaming software that is easy to use and
                  effective in gameplay.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Customer Reviews</h3>
              <div className="space-y-6">
                {product.reviews?.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="border-b border-purple-400/20 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {review.user_name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <span className="font-medium text-white">{review.user_name}</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-purple-200">{review.comment}</p>
                      <p className="text-xs text-purple-400 mt-1">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-purple-300 mb-4">No reviews yet. Be the first to review this product!</p>
                    <Button variant="outline" className="border-purple-400/30 text-purple-300 hover:bg-purple-400/10">
                      Write a Review
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </MobileOptimizedCard>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <MobileOptimizedCard key={relatedProduct.id} className="group overflow-hidden">
                  <div className="aspect-video w-full relative overflow-hidden">
                    <Image
                      src={relatedProduct.image_url || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-lg font-bold text-white">{relatedProduct.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">{formatPrice(relatedProduct.price)}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(relatedProduct.rating || 4.5)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex justify-end">
                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-red-500 text-white rounded-full"
                    >
                      <Link href={`/products/${relatedProduct.slug}`}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View Product
                      </Link>
                    </Button>
                  </div>
                </MobileOptimizedCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
