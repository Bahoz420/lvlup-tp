"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AddToCartButtonProps {
  product: any // Product object
  subscription: string
  subscriptionPrice: number
  className?: string
}

export function AddToCartButton({ product, subscription, subscriptionPrice, className = "" }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  // Debug logging
  console.log("AddToCartButton - Product:", product)
  console.log("AddToCartButton - Product status:", product?.status)
  console.log("AddToCartButton - Product product_status:", product?.product_status)

  // Determine if the product is available for purchase
  // FIXED: Handle the actual status values from the database
  const productStatus = product?.status || "offline"

  // Product is available if status is "online" or "active"
  const isAvailable = productStatus === "online" || productStatus === "active"

  console.log("AddToCartButton - isAvailable:", isAvailable, "productStatus:", productStatus)

  // Get appropriate message based on status
  const getStatusMessage = () => {
    if (productStatus === "offline" || productStatus === "inactive") {
      return "Out of Stock - Will be refilled soon"
    }
    if (productStatus === "updating" || productStatus === "maintenance") {
      return "Coming Soon - Stay tuned for updates"
    }
    return ""
  }

  const handleAddToCart = () => {
    // Only allow adding if product is available
    if (!isAvailable) {
      console.log("AddToCartButton - Product not available, blocking add to cart")
      return
    }

    console.log("AddToCartButton - Adding to cart:", {
      id: product.id || product.slug,
      name: product.name,
      price: subscriptionPrice,
      subscription,
      image_url: product.image_url,
      quantity: 1,
    })

    addItem({
      id: product.id || product.slug,
      name: product.name,
      price: subscriptionPrice,
      subscription,
      image_url: product.image_url,
      quantity: 1,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  // If product is not available, show disabled button with tooltip
  if (!isAvailable) {
    const buttonText = productStatus === "maintenance" || productStatus === "updating" ? "Coming Soon" : "Out of Stock"

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled className={`${className} bg-gray-500 text-white cursor-not-allowed opacity-70`}>
              <AlertCircle className="w-4 h-4 mr-2" />
              {buttonText}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getStatusMessage()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Normal button for available products
  return (
    <Button
      onClick={handleAddToCart}
      className={`${className} ${
        isAdded
          ? "bg-green-500 hover:bg-green-600"
          : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
      } text-white transition-all duration-300`}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
