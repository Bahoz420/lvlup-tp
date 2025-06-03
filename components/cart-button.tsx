"use client"

import type React from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export function CartButton() {
  const cart = useCart()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useMobile()

  // Safely get cart data with fallbacks
  const items = cart?.items || []
  const itemCount = cart?.itemCount || 0
  const subtotal = cart?.subtotal || 0

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (isMobile) return // Keine Hover-Effekte auf Mobilgeräten

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setShowDropdown(true)
  }

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    if (isMobile) return // Keine Hover-Effekte auf Mobilgeräten

    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false)
    }, 300) // Delay to allow moving cursor to dropdown
  }

  // Handle dropdown mouse enter
  const handleDropdownMouseEnter = () => {
    if (isMobile) return // Keine Hover-Effekte auf Mobilgeräten

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // Handle dropdown mouse leave
  const handleDropdownMouseLeave = () => {
    if (isMobile) return // Keine Hover-Effekte auf Mobilgeräten
    setShowDropdown(false)
  }

  // Toggle dropdown für Mobilgeräte
  const handleCartClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault()
      setShowDropdown(!showDropdown)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={buttonRef}
      data-testid="cart-button"
    >
      <Link href={isMobile ? "#" : "/cart"} onClick={handleCartClick} className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          className="border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-900 flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden md:inline">Cart</span>
          {itemCount > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              data-testid="cart-count"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Button>
      </Link>

      {/* Cart Dropdown */}
      {showDropdown && (
        <div
          className={`absolute right-0 mt-2 w-full min-w-[16rem] max-w-xs bg-white rounded-md shadow-lg z-50 border border-gray-200 ${
            isMobile ? "max-w-[calc(100vw-2rem)]" : ""
          }`}
          ref={dropdownRef}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
          data-testid="cart-dropdown"
        >
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Your Cart ({itemCount} items)</h3>

            {items.length === 0 ? (
              <div className="py-4 text-center text-gray-500">Your cart is empty</div>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto">
                  {items.slice(0, 3).map((item) => (
                    <div
                      key={`${item.id}-${item.subscription}`}
                      className="flex items-center gap-3 py-2 border-b border-gray-100"
                      data-testid={`cart-item-${item.id}`}
                    >
                      <div className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name || "Product"}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{item.name || "Unknown Product"}</p>
                        <p className="text-xs text-gray-500">
                          {item.subscription
                            ? item.subscription.charAt(0).toUpperCase() + item.subscription.slice(1)
                            : "Lifetime"}{" "}
                          · Qty: {item.quantity || 1}
                        </p>
                      </div>
                      <p className="text-xs font-medium text-gray-900">
                        {formatPrice((item.price || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  ))}

                  {items.length > 3 && (
                    <div className="py-2 text-center text-xs text-purple-600">
                      +{items.length - 3} more items in cart
                    </div>
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Subtotal</p>
                    <p className="font-medium text-gray-900" data-testid="cart-subtotal">
                      {formatPrice(subtotal)}
                    </p>
                  </div>

                  <Link href="/cart" className="block">
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      data-testid="checkout-button"
                    >
                      Checkout
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
