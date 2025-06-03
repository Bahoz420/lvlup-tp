"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button" // Corrected import path
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Copy, Check, AlertCircle } from "lucide-react"
import Image from "next/image"
import type { PaymentProvider } from "@/types/payment"
import {
  getCryptoSymbol,
  getNetworkName,
  CONFIRMATION_TIME_MAP,
  getRequiredConfirmations,
} from "@/lib/crypto-api-service"
import { logger } from "@/lib/logger"

interface CryptoPaymentProps {
  orderId: string
  paymentId: string
  amount: number // This is the FIAT amount for display purposes
  cryptoAmount: string // This is the actual crypto amount to be sent/checked
  cryptoType: PaymentProvider
  onPaymentComplete: (success: boolean, data?: any) => void
  disabled?: boolean
  walletAddress?: string // Made optional for debugging with a default
}

export function CryptoPayment(props: CryptoPaymentProps) {
  // Log the entire props object upon entry
  logger.info("[CryptoPayment] Function Entry. Raw props received:", JSON.stringify(props))

  const {
    orderId,
    paymentId,
    amount,
    cryptoAmount,
    cryptoType,
    onPaymentComplete,
    disabled = false,
    walletAddress: walletAddressProp = "DEBUG_DEFAULT_ADDRESS", // Default value for debugging
  } = props

  logger.info(
    "[CryptoPayment] After destructuring. walletAddressProp value:",
    `'${walletAddressProp}'`,
    "Type:",
    typeof walletAddressProp,
  )

  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [confirmations, setConfirmations] = useState(0)
  const [requiredConfirmations, setRequiredConfirmations] = useState(getRequiredConfirmations(cryptoType))
  const [error, setError] = useState<string | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const cryptoSymbol = getCryptoSymbol(cryptoType)
  const networkName = getNetworkName(cryptoType)
  const iconPath = `/${cryptoType.toLowerCase()}-icon.png`

  useEffect(() => {
    if (walletAddressProp === "DEBUG_DEFAULT_ADDRESS") {
      logger.warn(
        "[CryptoPayment] WARNING: walletAddress prop was not provided, using DEBUG_DEFAULT_ADDRESS. This indicates a problem in the parent component.",
      )
      setError("Payment address was not provided by the parent component. Using a debug default. (CP_DEBUG_WARN)")
      // Do not return here, let it proceed with the debug address to see if other logic works
    } else if (!walletAddressProp || walletAddressProp.trim() === "") {
      logger.error(
        "[CryptoPayment] CRITICAL: walletAddress prop is missing or empty (and not the debug default)! Value:",
        `'${walletAddressProp}'`,
        "Type:",
        typeof walletAddressProp,
      )
      setError("Payment address is not available. Please try again or contact support. (CP01)")
      setIsProcessing(false)
      return
    } else {
      if (
        error === "Payment address is not available. Please try again or contact support. (CP01)" ||
        error?.includes("CP_DEBUG_WARN")
      ) {
        setError(null)
      }
    }
    setRequiredConfirmations(getRequiredConfirmations(cryptoType))
  }, [walletAddressProp, cryptoType, error])

  const getExplorerUrl = useCallback(() => {
    if (!transactionId) return null
    switch (cryptoType) {
      case "bitcoin":
        return `https://blockstream.info/tx/${transactionId}`
      case "ethereum":
        return `https://etherscan.io/tx/${transactionId}`
      case "cardano":
        return `https://cardanoscan.io/transaction/${transactionId}`
      default:
        return null
    }
  }, [cryptoType, transactionId])

  const checkForTransaction = useCallback(async () => {
    logger.info("[CryptoPayment] checkForTransaction called. Using params:", {
      provider: cryptoType,
      walletAddress: walletAddressProp,
      expectedAmount: cryptoAmount,
      orderId: orderId,
      paymentId: paymentId,
    })

    if (
      !walletAddressProp ||
      walletAddressProp.trim() === "" ||
      walletAddressProp === "DEBUG_DEFAULT_ADDRESS" || // Include debug default in check for actual operations
      !cryptoAmount ||
      checkingStatus ||
      !orderId ||
      !paymentId
    ) {
      logger.warn("[CryptoPayment] checkForTransaction prerequisites not met (or using debug address):", {
        walletAddress: walletAddressProp,
        cryptoAmount,
        checkingStatus,
        orderId,
        paymentId,
      })
      if (walletAddressProp !== "DEBUG_DEFAULT_ADDRESS" && walletAddressProp && walletAddressProp.trim() !== "") {
        setError("Missing critical information to check transaction. Please refresh. (CP02)")
      } else if (walletAddressProp === "DEBUG_DEFAULT_ADDRESS") {
        // Do not set error here if it's the debug address, allow UI to show it.
      }
      return
    }

    try {
      setCheckingStatus(true)
      setLastChecked(new Date())
      setError(null)

      const response = await fetch("/api/payments/crypto/check-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: cryptoType,
          walletAddress: walletAddressProp,
          expectedAmount: cryptoAmount,
          orderId: orderId,
          paymentId: paymentId,
        }),
      })

      const responseData = await response.json()
      logger.info("[CryptoPayment] /api/payments/crypto/check-transaction response:", responseData)

      if (!response.ok) {
        const errorMsg = responseData?.error || "Failed to check transaction status (server error)"
        logger.error(`[CryptoPayment] API error from check-transaction: ${response.status} - ${errorMsg}`)
        throw new Error(errorMsg)
      }

      if (responseData.success && responseData.transactionFound && responseData.transactionId) {
        setTransactionId(responseData.transactionId)
        setConfirmations(responseData.confirmations || 0)
      } else if (responseData.success && !responseData.transactionFound) {
        logger.info("[CryptoPayment] Transaction not yet found for", { paymentId, walletAddressProp })
      } else if (!responseData.success) {
        logger.error("[CryptoPayment] API reported failure for check-transaction:", responseData.error)
        setError(responseData.error || "Failed to process transaction check. (CP03)")
      }
    } catch (error) {
      logger.error("[CryptoPayment] Error in checkForTransaction:", error)
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred while checking the transaction. (CP04)",
      )
    } finally {
      setCheckingStatus(false)
    }
  }, [cryptoType, walletAddressProp, cryptoAmount, orderId, paymentId, checkingStatus])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (
      isProcessing &&
      !transactionId &&
      walletAddressProp &&
      walletAddressProp.trim() !== "" &&
      walletAddressProp !== "DEBUG_DEFAULT_ADDRESS"
    ) {
      setCountdown(CONFIRMATION_TIME_MAP[cryptoType] || 600)
      checkForTransaction()
      interval = setInterval(checkForTransaction, 15000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isProcessing, transactionId, cryptoType, checkForTransaction, walletAddressProp])

  const checkConfirmations = useCallback(async () => {
    if (!transactionId || checkingStatus) return
    logger.info("[CryptoPayment] checkConfirmations called for txId:", transactionId)

    try {
      setCheckingStatus(true)
      setLastChecked(new Date())
      setError(null)

      const response = await fetch("/api/payments/crypto/check-confirmations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: cryptoType,
          transactionId,
          paymentId,
          orderId,
        }),
      })

      const responseData = await response.json()
      logger.info("[CryptoPayment] /api/payments/crypto/check-confirmations response:", responseData)

      if (!response.ok) {
        const errorMsg = responseData?.error || "Failed to check confirmations (server error)"
        logger.error(`[CryptoPayment] API error from check-confirmations: ${response.status} - ${errorMsg}`)
        throw new Error(errorMsg)
      }

      if (responseData.success) {
        setConfirmations(responseData.confirmations)
        if (responseData.confirmed || responseData.confirmations >= requiredConfirmations) {
          onPaymentComplete(true, {
            provider: cryptoType,
            paymentId: paymentId,
            transactionId: transactionId,
            confirmations: responseData.confirmations,
          })
          setIsProcessing(false)
        }
      } else {
        logger.error("[CryptoPayment] API reported failure for check-confirmations:", responseData.error)
        setError(responseData.error || "Failed to process confirmation check. (CP05)")
      }
    } catch (error) {
      logger.error("[CryptoPayment] Error in checkConfirmations:", error)
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred while checking confirmations. (CP06)",
      )
    } finally {
      setCheckingStatus(false)
    }
  }, [transactionId, cryptoType, paymentId, orderId, requiredConfirmations, onPaymentComplete, checkingStatus])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (transactionId) {
      checkConfirmations()
      interval = setInterval(checkConfirmations, 30000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [transactionId, checkConfirmations])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isProcessing && countdown > 0 && !transactionId) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev <= 1 ? 0 : prev - 1))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isProcessing, countdown, transactionId])

  const handleCopyAddress = () => {
    if (!walletAddressProp || walletAddressProp.trim() === "" || walletAddressProp === "DEBUG_DEFAULT_ADDRESS") {
      setError("Wallet address not available to copy. (CP07)")
      return
    }
    navigator.clipboard.writeText(walletAddressProp)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleCheckPayment = () => {
    if (
      disabled ||
      !walletAddressProp ||
      walletAddressProp.trim() === "" ||
      walletAddressProp === "DEBUG_DEFAULT_ADDRESS"
    ) {
      if (!walletAddressProp || walletAddressProp.trim() === "") {
        setError("Cannot start payment check: Wallet address is missing. (CP08)")
      } else if (walletAddressProp === "DEBUG_DEFAULT_ADDRESS") {
        setError("Cannot start payment check with debug address. (CP09)")
      }
      return
    }
    setIsProcessing(true)
    setError(null)
  }

  const formatLastChecked = () => {
    if (!lastChecked) return ""
    return `Last checked: ${lastChecked.toLocaleTimeString()}`
  }

  const explorerUrl = getExplorerUrl()

  // Render logic using walletAddressProp
  // If walletAddressProp is "DEBUG_DEFAULT_ADDRESS", it will be displayed, and the useEffect will log a warning.
  // If it's truly undefined/empty (and not the default), the useEffect should set an error.

  if (walletAddressProp !== "DEBUG_DEFAULT_ADDRESS" && (!walletAddressProp || walletAddressProp.trim() === "")) {
    // This condition is for the case where the prop is not the debug default AND is empty/undefined.
    // The useEffect should have already set an error.
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error || "Payment address is critically missing."}</p>
            </div>
          ) : (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
              <p className="text-gray-600">Verifying payment address...</p>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 relative mr-2">
            <Image src={iconPath || "/placeholder.svg"} alt={networkName} fill className="object-contain" />
          </div>
          <h3 className="text-lg font-medium">{networkName} Payment</h3>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {walletAddressProp === "DEBUG_DEFAULT_ADDRESS" && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-md mb-4">
            DEBUG MODE: Using default wallet address. This indicates an issue with prop passing.
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Amount to Send</div>
            <div className="text-2xl font-bold">
              {cryptoAmount} {cryptoSymbol}
            </div>
            <div className="text-sm text-gray-400">(~€{amount.toFixed(2)})</div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">Send {cryptoSymbol} to this address:</div>
            <div className="flex">
              <div className="bg-gray-50 p-3 rounded-l-lg flex-1 text-sm font-mono truncate">{walletAddressProp}</div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-l-none"
                onClick={handleCopyAddress}
                disabled={
                  !walletAddressProp || walletAddressProp.trim() === "" || walletAddressProp === "DEBUG_DEFAULT_ADDRESS"
                }
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Only send {cryptoSymbol} to this address on the {networkName} network
            </div>
          </div>

          {isProcessing ? (
            <div className="space-y-4">
              {transactionId ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-green-600">Transaction Detected!</p>
                    <p className="text-sm mt-1">
                      Confirmations: {confirmations}/{requiredConfirmations}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                  </div>
                  <p className="font-medium mt-2">Waiting for {networkName} Transaction</p>
                </div>
              )}
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleCheckPayment}
              disabled={
                disabled ||
                !walletAddressProp ||
                walletAddressProp.trim() === "" ||
                walletAddressProp === "DEBUG_DEFAULT_ADDRESS"
              }
            >
              I've Sent the {cryptoSymbol}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
