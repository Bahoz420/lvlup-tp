"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function EmailTestPage() {
  const [email, setEmail] = useState("")
  const [templateType, setTemplateType] = useState("order-confirmation")
  const [loading, setLoading] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")

  const testTemplates = {
    "order-confirmation": {
      orderId: "ORD-1234567890",
      products: [
        { name: "CS2 Premium Cheats", subscription: "1 Month", price: 29.99 },
        { name: "Valorant Hack Suite", subscription: "Lifetime", price: 104.97 },
      ],
      total: 134.96,
      paymentMethod: "Credit Card",
      date: new Date().toISOString(),
      supportEmail: "support@lvlup.io",
    },
    "payment-receipt": {
      orderId: "ORD-1234567890",
      amount: 134.96,
      paymentMethod: "Credit Card",
      transactionId: "TXN-987654321",
      date: new Date().toISOString(),
      supportEmail: "support@lvlup.io",
    },
    "product-delivery": {
      orderId: "ORD-1234567890",
      products: [
        { name: "CS2 Premium Cheats", subscription: "1 Month", description: "Advanced aimbot and ESP features" },
        { name: "Valorant Hack Suite", subscription: "Lifetime", description: "Complete cheat package for Valorant" },
      ],
      downloadLinks: [
        "https://lvlup.io/download/cs2-premium?token=abc123",
        "https://lvlup.io/download/valorant-suite?token=xyz789",
      ],
      expiryHours: 24,
      date: new Date().toISOString(),
      supportEmail: "support@lvlup.io",
    },
    "gift-notification": {
      fromName: "John Doe",
      products: [{ name: "Fortnite Cheats", subscription: "1 Week", description: "Premium Fortnite advantage" }],
      message: "Enjoy this gift! Hope it helps you win more games!",
      date: new Date().toISOString(),
      supportEmail: "support@lvlup.io",
    },
  }

  const handlePreview = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/email/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: templateType,
          data: testTemplates[templateType as keyof typeof testTemplates],
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPreviewHtml(data.html)
      } else {
        toast({
          title: "Preview Error",
          description: data.error || "Failed to generate preview",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Preview Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendTest = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch("/api/email/send-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: templateType,
          email: email,
          data: testTemplates[templateType as keyof typeof testTemplates],
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Test Email Sent",
          description: `Email successfully sent to ${email}`,
        })
      } else {
        toast({
          title: "Send Error",
          description: data.error || "Failed to send test email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Send Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Email Template Testing</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Configure and send test emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Type</label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order-confirmation">Order Confirmation</SelectItem>
                  <SelectItem value="payment-receipt">Payment Receipt</SelectItem>
                  <SelectItem value="product-delivery">Product Delivery</SelectItem>
                  <SelectItem value="gift-notification">Gift Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Test Email Address</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" onClick={handlePreview} disabled={loading}>
              Preview Template
            </Button>
            <Button className="w-full" onClick={handleSendTest} disabled={loading || !email} variant="secondary">
              Send Test Email
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Template Preview</CardTitle>
            <CardDescription>
              {templateType === "order-confirmation" && "Preview of the order confirmation email"}
              {templateType === "payment-receipt" && "Preview of the payment receipt email"}
              {templateType === "product-delivery" && "Preview of the product delivery email"}
              {templateType === "gift-notification" && "Preview of the gift notification email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden h-[600px]">
              {previewHtml ? (
                <iframe srcDoc={previewHtml} className="w-full h-full" title="Email Preview" />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <p className="text-gray-500">Click "Preview Template" to see the email</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
