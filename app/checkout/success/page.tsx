"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const orderId = searchParams.get("orderId")
  const paymentId = searchParams.get("paymentId")
  const provider = searchParams.get("provider")

  useEffect(() => {
    async function loadOrderDetails() {
      try {
        setIsLoading(true)

        // In a real app, we would fetch the order details from the API
        // For now, we'll just simulate a delay and create mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setOrderDetails({
          id: orderId || `order_${Math.random().toString(36).substring(2, 15)}`,
          status: "completed",
          paymentStatus: "paid",
          paymentMethod: provider || "unknown",
          paymentId: paymentId || "unknown",
          items: [{ name: "CS2 lvlup Cheat", price: 29.99, quantity: 1 }],
          subtotal: 29.99,
          tax: 5.7,
          total: 35.69,
          customerEmail: "customer@example.com",
          createdAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error loading order details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrderDetails()

    // Clear cart
    localStorage.removeItem("cart")
  }, [orderId, paymentId, provider])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navigation />
      <main className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-purple-900">Payment Successful!</h1>
            <p className="text-gray-600 mt-2">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-8 flex justify-center">
                <div className="animate-pulse space-y-4 w-full">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order #{orderDetails?.id}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {new Date(orderDetails?.createdAt).toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Order Summary</h3>
                    <div className="space-y-2">
                      {orderDetails?.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>{item.price.toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-2 pt-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{orderDetails?.subtotal.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (19%)</span>
                        <span>{orderDetails?.tax.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between font-bold mt-2">
                        <span>Total</span>
                        <span>{orderDetails?.total.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Payment Information</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Payment Method</span>
                        <span className="capitalize">{orderDetails?.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment ID</span>
                        <span className="text-gray-500 text-xs">{orderDetails?.paymentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status</span>
                        <span className="text-green-600 font-medium">Paid</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild>
                    <Link href="/dashboard/downloads">
                      <Download className="mr-2 h-4 w-4" />
                      Download Software
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/orders">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      View All Orders
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
