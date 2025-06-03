export type PaymentProvider = "bitcoin" | "ethereum" | "cardano"

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded"

export interface PaymentMethod {
  id: string
  provider: PaymentProvider
  label: string
  description: string
  iconPath: string
  isActive: boolean
  processingFee?: number | string
  processingTime?: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentProvider: PaymentProvider
  clientSecret?: string
  metadata?: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface CryptoPaymentConfig {
  walletAddress: string
  network: string
  confirmationsRequired: number
}

export interface PaymentProcessResult {
  success: boolean
  redirectUrl?: string
  orderId?: string
  paymentId?: string
  errorMessage?: string
  paymentIntentId?: string
  clientSecret?: string
}

export interface PaymentProviderConfig {
  bitcoin?: CryptoPaymentConfig
  ethereum?: CryptoPaymentConfig
  cardano?: CryptoPaymentConfig
}
