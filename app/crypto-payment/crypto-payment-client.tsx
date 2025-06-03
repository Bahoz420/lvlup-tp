"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import EnhancedCryptoPayment from "./enhanced-crypto-payment" // Default import
import type { PaymentProvider } from "@/types/payment"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { logger } from "@/lib/logger"

export function CryptoPaymentClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for parsed props
  const [parsedOrderId, setParsedOrderId] = useState<string | null>(null)
  const [parsedPaymentId, setParsedPaymentId] = useState<string | null>(null)
  const [parsedProvider, setParsedProvider] = useState<PaymentProvider | null>(null)
  const [parsedFiatAmount, setParsedFiatAmount] = useState<number | null>(null)
  const [parsedCryptoAmount, setParsedCryptoAmount] = useState<string | null>(null)
  const [parsedWalletAddress, setParsedWalletAddress] = useState<string | null>(null)
  // Removed parsedCryptoCurrency as it's not directly used by EnhancedCryptoPayment props

  useEffect(() => {
    logger.info("[CryptoPaymentClient] Processing searchParams:", searchParams.toString())

    const orderIdFromParams = searchParams.get("orderId")
    const paymentIdFromParams = searchParams.get("paymentId")
    const providerFromParams = searchParams.get("provider") as PaymentProvider | null
    const fiatAmountStrFromParams = searchParams.get("fiatAmount") // Corrected to fiatAmount
    const cryptoAmountStrFromParams = searchParams.get("amount") // Corrected to amount (crypto)
    const walletAddressFromParams = searchParams.get("walletAddress")

    logger.debug("[CryptoPaymentClient] Raw URL Params:", {
      orderIdFromParams,
      paymentIdFromParams,
      providerFromParams,
      fiatAmountStrFromParams,
      cryptoAmountStrFromParams,
      walletAddressFromParams,
    })

    let hasError = false
    let errorMsg = "Critical payment information is missing or invalid. Please try the checkout process again."

    if (!orderIdFromParams) {
      logger.error("[CryptoPaymentClient] Missing orderId from URL")
      hasError = true
    }
    if (!paymentIdFromParams) {
      logger.error("[CryptoPaymentClient] Missing paymentId from URL")
      hasError = true
    }
    if (!providerFromParams) {
      logger.error("[CryptoPaymentClient] Missing provider from URL")
      hasError = true
    }
    if (!fiatAmountStrFromParams) {
      // Check for fiatAmount
      logger.error("[CryptoPaymentClient] Missing fiatAmount from URL")
      hasError = true
    }
    if (!cryptoAmountStrFromParams) {
      // Check for cryptoAmount (param name 'amount')
      logger.error("[CryptoPaymentClient] Missing cryptoAmount (URL param 'amount') from URL")
      hasError = true
    }

    if (!walletAddressFromParams || walletAddressFromParams.trim() === "") {
      logger.error("[CryptoPaymentClient] walletAddress from URL is missing, empty, or whitespace.", {
        val: walletAddressFromParams,
      })
      errorMsg =
        "Payment address is missing or invalid in the URL. This could be an issue with payment intent creation. Please try checking out again or contact support. (CPC01)"
      hasError = true
    }

    if (hasError) {
      setError(errorMsg)
      setIsLoading(false)
      return
    }

    // All critical string params are present, and walletAddress is a non-empty string
    setParsedOrderId(orderIdFromParams)
    setParsedPaymentId(paymentIdFromParams)
    setParsedProvider(providerFromParams)
    setParsedCryptoAmount(cryptoAmountStrFromParams!) // Assert non-null due to check
    setParsedWalletAddress(walletAddressFromParams!.trim()) // Assert non-null due to check, and trim

    try {
      const fiat = Number.parseFloat(fiatAmountStrFromParams!) // Assert non-null
      if (isNaN(fiat) || fiat <= 0) {
        logger.error("[CryptoPaymentClient] Invalid fiat amount in URL:", fiatAmountStrFromParams)
        setError("Invalid payment amount specified in URL. (CPC02)")
        hasError = true
      } else {
        setParsedFiatAmount(fiat)
      }
    } catch (e) {
      logger.error("[CryptoPaymentClient] Error parsing fiat amount from URL:", e)
      setError("Error processing payment amount from URL. (CPC03)")
      hasError = true
    }

    if (hasError) {
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setError(null)
  }, [searchParams])

  const handleActualPaymentComplete = (success: boolean, data?: any) => {
    logger.info(`[CryptoPaymentClient] Payment process finished. Success: ${success}, Data:`, data)
    if (success) {
      router.push(
        `/purchase-complete?orderId=${parsedOrderId}&paymentId=${parsedPaymentId}&status=success&txId=${data?.transactionId || ""}&provider=${parsedProvider}`,
      )
    } else {
      setError("Payment failed, was cancelled, or an error occurred. Please try again or contact support. (CPC04)")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[300px] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading payment details...</p>
        <p className="text-sm text-muted-foreground">Please wait while we prepare your payment session.</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Payment Initialization Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (
    !parsedProvider ||
    !parsedOrderId ||
    !parsedPaymentId ||
    !parsedWalletAddress || // Crucial check
    parsedFiatAmount === null ||
    !parsedCryptoAmount
  ) {
    logger.error(
      "[CryptoPaymentClient] Final check failed: One or more parsed props are invalid before rendering EnhancedCryptoPayment",
      {
        parsedProvider,
        parsedOrderId,
        parsedPaymentId,
        parsedWalletAddress,
        parsedFiatAmount,
        parsedCryptoAmount,
      },
    )
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Critical Error</AlertTitle>
        <AlertDescription>
          Could not initialize the payment module due to missing or invalid critical information. This may be due to an
          issue with the payment link. Please try the checkout process again. If the problem persists, contact support.
          (CPC05)
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <EnhancedCryptoPayment
      provider={parsedProvider}
      fiatAmount={parsedFiatAmount}
      cryptoAmount={parsedCryptoAmount}
      walletAddress={parsedWalletAddress} // This must be a valid string
      orderId={parsedOrderId}
      paymentId={parsedPaymentId}
      onPaymentComplete={handleActualPaymentComplete}
    />
  )
}
