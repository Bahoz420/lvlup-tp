"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Mail, ExternalLink, Copy, Check, Calendar, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getCryptoSymbol, getNetworkName } from "@/lib/crypto-api-service"

interface OrderDetails {
  orderId: string
  provider: string
  transactionId: string
  amount: number
  cryptoAmount: string
  status: string
  createdAt: string
  products: Array<{
    name: string
    type: string
    downloadUrl?: string
  }>
}

export default function EnhancedPurchaseComplete() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const provider = searchParams.get("provider")
  const txId = searchParams.get("txId")

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderDetails(data.order)
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyTxId = () => {
    if (txId) {
      navigator.clipboard.writeText(txId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getExplorerUrl = () => {
    if (!txId || !provider) return null

    switch (provider) {
      case "bitcoin":
        return `https://blockstream.info/tx/${txId}`
      case "ethereum":
        return `https://etherscan.io/tx/${txId}`
      case "cardano":
        return `https://cardanoscan.io/transaction/${txId}`
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const cryptoSymbol = provider ? getCryptoSymbol(provider as any) : ""
  const networkName = provider ? getNetworkName(provider as any) : ""

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Success Header */}
          <Card>
            <CardContent className="pt-8 text-center">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
              <p className="text-lg text-muted-foreground mb-6">Your order has been confirmed and is being processed</p>

              {orderId && (
                <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-green-700">Order ID: {orderId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Method */}
                {provider && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <div className="flex items-center">
                      <Image src={`/${provider}-icon.png`} alt={networkName} width={20} height={20} className="mr-2" />
                      <span className="font-medium">{networkName}</span>
                    </div>
                  </div>
                )}

                {/* Amount */}
                {orderDetails && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span className="font-medium">€{orderDetails.amount.toFixed(2)}</span>
                    </div>

                    {orderDetails.cryptoAmount && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Crypto Amount:</span>
                        <span className="font-medium">
                          {orderDetails.cryptoAmount} {cryptoSymbol}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Transaction ID */}
                {txId && (
                  <div className="space-y-2">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm flex-1 truncate">{txId}</code>
                      <Button variant="outline" size="sm" onClick={handleCopyTxId}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default">Confirmed</Badge>
                </div>

                {/* Date */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>

                <Separator />

                {/* Blockchain Explorer Link */}
                {getExplorerUrl() && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={getExplorerUrl()!} target="_blank" rel="noopener noreferrer">
                      View on Blockchain Explorer
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Email Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        You'll receive an email with your order details and download links
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Download className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Download Access</h4>
                      <p className="text-sm text-muted-foreground">
                        Your products will be available in your dashboard within 5-10 minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Account Activation</h4>
                      <p className="text-sm text-muted-foreground">Your subscription will be activated automatically</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/products">Browse More Products</Link>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/support">Contact Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-medium">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about your order, please contact our support team.
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/support">Support Center</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/faq">FAQ</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
