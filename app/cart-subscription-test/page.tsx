"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Plus, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"

interface TestStep {
  id: string
  name: string
  product: string
  subscription: "day" | "week" | "month" | "lifetime"
  expectedPrice: number
  completed: boolean
}

export default function CartSubscriptionTest() {
  const { items, addItem, clearCart, subtotal, itemCount } = useCart()
  const [currentStep, setCurrentStep] = useState(0)

  const testSteps: TestStep[] = [
    {
      id: "fortnite-day",
      name: "Fortnite 1 Day",
      product: "fortnite",
      subscription: "day",
      expectedPrice: 4.5,
      completed: false,
    },
    {
      id: "fortnite-week",
      name: "Fortnite 1 Week",
      product: "fortnite",
      subscription: "week",
      expectedPrice: 15.0,
      completed: false,
    },
    {
      id: "cs2-month",
      name: "CS2 1 Month",
      product: "cs2",
      subscription: "month",
      expectedPrice: 29.99,
      completed: false,
    },
    {
      id: "valorant-lifetime",
      name: "Valorant Lifetime",
      product: "valorant",
      subscription: "lifetime",
      expectedPrice: 104.97,
      completed: false,
    },
  ]

  const addTestItem = (step: TestStep) => {
    const cartItem = {
      id: step.product,
      name:
        step.product === "fortnite"
          ? "lvlup Fortnite"
          : step.product === "cs2"
            ? "CS2 Premium Cheats"
            : "Valorant Hack Suite",
      slug: step.product,
      price: step.expectedPrice,
      image_url: `/${step.product}.png`,
      quantity: 1,
      subscription: step.subscription,
    }

    addItem(cartItem)
    setCurrentStep(currentStep + 1)
  }

  const getSubscriptionLabel = (subscription: string) => {
    switch (subscription) {
      case "day":
        return "1 Day"
      case "week":
        return "1 Week"
      case "month":
        return "1 Month"
      case "lifetime":
        return "Lifetime"
      default:
        return subscription
    }
  }

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "day":
        return "bg-amber-100 text-amber-800"
      case "week":
        return "bg-green-100 text-green-800"
      case "month":
        return "bg-blue-100 text-blue-800"
      case "lifetime":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 Cart Subscription Test</h1>

      {/* Test Progress */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Test Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {testSteps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border-2 ${
                index < currentStep
                  ? "border-green-500 bg-green-50"
                  : index === currentStep
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-gray-300 text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                )}
                <span className="font-medium">{step.name}</span>
              </div>
              <Badge className={getSubscriptionColor(step.subscription)}>
                {getSubscriptionLabel(step.subscription)}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">${step.expectedPrice}</div>
              {index === currentStep && (
                <Button onClick={() => addTestItem(step)} size="sm" className="mt-2 w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Cart Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-blue-800">Items in Cart</span>
          </div>
          <div className="text-3xl font-bold text-blue-600">{itemCount}</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-green-800">Subtotal</span>
          </div>
          <div className="text-3xl font-bold text-green-600">${subtotal.toFixed(2)}</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-purple-800">Products</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">{items.length}</div>
        </div>
      </div>

      {/* Current Cart Items */}
      {items.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Current Cart Items</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.id}-${item.subscription}`}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold">{item.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <Badge className={getSubscriptionColor(item.subscription)}>
                      {getSubscriptionLabel(item.subscription)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${item.price}</div>
                  <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-amber-800 mb-4">📋 Test Instructions</h2>
        <div className="space-y-2 text-amber-700">
          <p>
            <strong>Step {currentStep + 1}:</strong>{" "}
            {currentStep < testSteps.length ? `Add ${testSteps[currentStep].name} to cart` : "All tests completed!"}
          </p>
          <p>
            <strong>Expected:</strong>{" "}
            {currentStep < testSteps.length
              ? `Price should be $${testSteps[currentStep].expectedPrice}`
              : "Review all items in cart"}
          </p>
          <p>
            <strong>Next:</strong>{" "}
            {currentStep < testSteps.length
              ? "Click the 'Add to Cart' button above"
              : "Visit /cart to see full cart page"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={clearCart} variant="outline" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Clear Cart
        </Button>
        <Link href="/cart">
          <Button className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            View Full Cart
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">Browse Products</Button>
        </Link>
      </div>

      {/* Manual Test Links */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold mb-4">🔗 Manual Test Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/products/fortnite" className="text-blue-600 hover:underline">
            → Fortnite Product Page
          </Link>
          <Link href="/products/cs2" className="text-blue-600 hover:underline">
            → CS2 Product Page
          </Link>
          <Link href="/products/valorant" className="text-blue-600 hover:underline">
            → Valorant Product Page
          </Link>
        </div>
      </div>
    </div>
  )
}
