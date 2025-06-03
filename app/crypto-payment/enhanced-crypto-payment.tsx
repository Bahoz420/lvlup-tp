"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { CryptoPayment } from "@/components/payment-methods/crypto-payment"
import type { PaymentProvider } from "@/types/payment"
import { logger } from "@/lib/logger"

interface EnhancedCryptoPaymentProps {
  orderId: string
  paymentId: string
  fiatAmount: number
  cryptoAmount: string
  provider: PaymentProvider
  walletAddress: string | undefined // Prop received from CryptoPaymentClient
  onPaymentComplete: (success: boolean, data?: any) => void
}

const EnhancedCryptoPayment: React.FC<EnhancedCryptoPaymentProps> = ({
  orderId,
  paymentId,
  fiatAmount,
  cryptoAmount,
  provider,
  walletAddress, // This is the walletAddress from CryptoPaymentClient's props
  onPaymentComplete,
}) => {
  useEffect(() => {
    logger.info(
      "[EnhancedCryptoPayment] Props received/updated. Current walletAddress from parent (CryptoPaymentClient):",
      `'${walletAddress}'`,
      "Type:",
      typeof walletAddress,
    )
  }, [orderId, paymentId, fiatAmount, cryptoAmount, provider, walletAddress])

  const [isOverallProcessing, setIsOverallProcessing] = useState(false)

  const handleInternalPaymentComplete = (success: boolean, data?: any) => {
    logger.info("[EnhancedCryptoPayment] handleInternalPaymentComplete. Success:", success, "Data:", data)
    setIsOverallProcessing(false)
    onPaymentComplete(success, data)
  }

  // Log *just before* rendering CryptoPayment to see what value is being passed
  logger.info(
    "[EnhancedCryptoPayment] ABOUT TO RENDER CryptoPayment. The 'walletAddress' variable being passed to CryptoPayment component is:",
    `'${walletAddress}'`, // This is the 'walletAddress' from this component's props
    "Type:",
    typeof walletAddress,
  )

  // The critical line: Ensure `walletAddress={walletAddress}` is correct.
  // If `walletAddress` (the variable from this component's props) is undefined here,
  // then CryptoPayment will receive undefined.
  return (
    <CryptoPayment
      orderId={orderId}
      paymentId={paymentId}
      amount={fiatAmount}
      cryptoAmount={cryptoAmount}
      cryptoType={provider}
      onPaymentComplete={handleInternalPaymentComplete}
      disabled={isOverallProcessing}
      walletAddress={walletAddress} // Passing the 'walletAddress' variable from EnhancedCryptoPayment's props
    />
  )
}
export default EnhancedCryptoPayment
