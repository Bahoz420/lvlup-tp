/**
 * Email template types
 */
export type EmailTemplate =
  | "order-confirmation"
  | "payment-receipt"
  | "product-delivery"
  | "gift-notification"
  | "welcome-email"
  | "password-reset"
  | string

/**
 * Email template renderer function type
 */
export type EmailTemplateRenderer<TData = any> = (data: TData) => string

/**
 * Email sending options
 */
export interface EmailOptions<T extends EmailTemplateName = EmailTemplateName> {
  template: T
  to: string
  subject: string
  data: EmailDataMap[T]
  from?: string
  replyTo?: string
  cc?: string[]
  bcc?: string[]
  attachments?: EmailAttachment[]
}

/**
 * Email attachment
 */
export interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType?: string
}

/**
 * Email sending result
 */
export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface ProductDeliveryItem {
  name: string
  description?: string
  activationCode?: string | null
  downloadLink?: string | null
}

export interface EmailTemplateDataProductDelivery {
  orderId: string
  products: ProductDeliveryItem[]
  expiryHours?: number
  date: string
  supportEmail: string
  siteUrl: string
  customerName?: string
}

export interface EmailTemplateDataGiftNotification {
  fromName: string
  products: Array<{ name: string; description?: string }>
  message: string
  date: string
  supportEmail: string
  siteUrl: string
  claimGiftUrl: string
  recipientName?: string
}

export interface EmailTemplateDataOrderConfirmation {
  orderId: string
  products: Array<{ name: string; quantity: number; price: number; subscription?: string }>
  total: number
  paymentMethod: string
  date: string
  supportEmail: string
  siteUrl: string
  customerName?: string
}

export interface EmailTemplateDataPaymentReceipt {
  orderId: string
  amount: number
  paymentMethod: string
  transactionId: string
  date: string
  supportEmail: string
  siteUrl: string
  customerName?: string
}

export type EmailTemplateName =
  | "order-confirmation"
  | "payment-receipt"
  | "product-delivery"
  | "gift-notification"
  | "welcome-email"
  | "password-reset"

export type EmailDataMap = {
  "order-confirmation": EmailTemplateDataOrderConfirmation
  "payment-receipt": EmailTemplateDataPaymentReceipt
  "product-delivery": EmailTemplateDataProductDelivery
  "gift-notification": EmailTemplateDataGiftNotification
  "welcome-email": { userName: string; siteUrl: string }
  "password-reset": { userName: string; resetLink: string; siteUrl: string }
}
