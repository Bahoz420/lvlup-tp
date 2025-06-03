"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { CheckCircle, XCircle, AlertCircle, ShoppingCart } from "lucide-react"

interface CartTestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
}

export function CartTestComponent() {
  const [testResults, setTestResults] = useState<CartTestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const { addItem, items, itemCount, subtotal, clearCart } = useCart()

  const runCartTests = async () => {
    setIsRunning(true)
    setTestResults([])
    const results: CartTestResult[] = []

    // Clear cart first
    clearCart()

    // Test 1: Add CS2 Product
    try {
      const cs2Product = {
        id: "cs2",
        name: "CS2 lvlup Cheat",
        slug: "cs2",
        price: 29.99,
        image_url: "/cs2.png",
        quantity: 1,
        subscription: "month" as const,
      }

      addItem(cs2Product)

      // Wait for state update
      await new Promise((resolve) => setTimeout(resolve, 100))

      if (items.length > 0) {
        results.push({
          name: "Add CS2 to Cart",
          status: "success",
          message: "CS2 product added successfully",
        })
      } else {
        results.push({
          name: "Add CS2 to Cart",
          status: "error",
          message: "Failed to add CS2 product to cart",
        })
      }
    } catch (error) {
      results.push({
        name: "Add CS2 to Cart",
        status: "error",
        message: `Error adding CS2: ${error}`,
      })
    }

    // Test 2: Add Valorant Product
    try {
      const valorantProduct = {
        id: "valorant",
        name: "Valorant lvlup Cheat",
        slug: "valorant",
        price: 34.99,
        image_url: "/valorant.png",
        quantity: 1,
        subscription: "week" as const,
      }

      addItem(valorantProduct)

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (items.length >= 2) {
        results.push({
          name: "Add Valorant to Cart",
          status: "success",
          message: "Valorant product added successfully",
        })
      } else {
        results.push({
          name: "Add Valorant to Cart",
          status: "error",
          message: "Failed to add Valorant product to cart",
        })
      }
    } catch (error) {
      results.push({
        name: "Add Valorant to Cart",
        status: "error",
        message: `Error adding Valorant: ${error}`,
      })
    }

    // Test 3: Add Fortnite Product
    try {
      const fortniteProduct = {
        id: "fortnite",
        name: "Fortnite lvlup Cheat",
        slug: "fortnite",
        price: 24.99,
        image_url: "/fortnite.png",
        quantity: 1,
        subscription: "day" as const,
      }

      addItem(fortniteProduct)

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (items.length >= 3) {
        results.push({
          name: "Add Fortnite to Cart",
          status: "success",
          message: "Fortnite product added successfully",
        })
      } else {
        results.push({
          name: "Add Fortnite to Cart",
          status: "error",
          message: "Failed to add Fortnite product to cart",
        })
      }
    } catch (error) {
      results.push({
        name: "Add Fortnite to Cart",
        status: "error",
        message: `Error adding Fortnite: ${error}`,
      })
    }

    // Test 4: Cart Count
    try {
      if (itemCount === 3) {
        results.push({
          name: "Cart Item Count",
          status: "success",
          message: `Cart count correct: ${itemCount} items`,
        })
      } else {
        results.push({
          name: "Cart Item Count",
          status: "warning",
          message: `Cart count unexpected: ${itemCount} items (expected 3)`,
        })
      }
    } catch (error) {
      results.push({
        name: "Cart Item Count",
        status: "error",
        message: `Error checking cart count: ${error}`,
      })
    }

    // Test 5: Subtotal Calculation
    try {
      const expectedSubtotal = 29.99 + 34.99 + 24.99 // CS2 + Valorant + Fortnite
      const actualSubtotal = Math.round(subtotal * 100) / 100
      const expectedRounded = Math.round(expectedSubtotal * 100) / 100

      if (actualSubtotal === expectedRounded) {
        results.push({
          name: "Subtotal Calculation",
          status: "success",
          message: `Subtotal correct: $${actualSubtotal}`,
        })
      } else {
        results.push({
          name: "Subtotal Calculation",
          status: "warning",
          message: `Subtotal: $${actualSubtotal} (expected: $${expectedRounded})`,
        })
      }
    } catch (error) {
      results.push({
        name: "Subtotal Calculation",
        status: "error",
        message: `Error calculating subtotal: ${error}`,
      })
    }

    // Test 6: LocalStorage Persistence
    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          results.push({
            name: "LocalStorage Persistence",
            status: "success",
            message: "Cart data persisted to localStorage",
          })
        } else {
          results.push({
            name: "LocalStorage Persistence",
            status: "warning",
            message: "Cart data not properly stored in localStorage",
          })
        }
      } else {
        results.push({
          name: "LocalStorage Persistence",
          status: "error",
          message: "No cart data found in localStorage",
        })
      }
    } catch (error) {
      results.push({
        name: "LocalStorage Persistence",
        status: "error",
        message: `LocalStorage test error: ${error}`,
      })
    }

    setTestResults(results)
    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">🛒 Cart Functionality Tests</h2>

      <div className="mb-6">
        <Button onClick={runCartTests} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
          {isRunning ? "Running Cart Tests..." : "🧪 Test Cart Functionality"}
        </Button>
      </div>

      {/* Current Cart Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-blue-800">Items</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{itemCount}</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-800">Subtotal</span>
          </div>
          <div className="text-2xl font-bold text-green-600">${subtotal.toFixed(2)}</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-purple-800">Products</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{items.length}</div>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div>
                  <div className="font-medium text-gray-900">{result.name}</div>
                  <div className="text-sm text-gray-600">{result.message}</div>
                </div>
              </div>
              <Badge
                className={
                  result.status === "success"
                    ? "bg-green-100 text-green-800"
                    : result.status === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }
              >
                {result.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Current Cart Items */}
      {items.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Current Cart Items:</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({item.subscription})</span>
                </div>
                <span className="font-bold">${item.price}</span>
              </div>
            ))}
          </div>
          <Button onClick={clearCart} variant="outline" className="mt-3">
            Clear Cart
          </Button>
        </div>
      )}
    </div>
  )
}
