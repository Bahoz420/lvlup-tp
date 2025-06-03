import { logger } from "@/lib/logger"
import type {
  EmailProvider,
  EmailSendOptions,
  EmailTemplateDataAccountVerification,
  EmailTemplateDataOrderConfirmation,
  EmailTemplateDataPasswordReset,
  EmailTemplateDataPaymentReceipt,
  EmailTemplateDataProductDelivery,
  EmailTemplateDataGiftNotification,
  ProductDeliveryItem,
  EmailTemplate,
} from "@/types/email"
import { emailTemplateManager } from "./template-manager" // Corrected import

// Basic Resend provider (replace with your actual provider logic)
class ResendEmailProvider implements EmailProvider {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    if (!apiKey) {
      logger.warn("Resend API key is not configured. Email sending will be disabled.")
    }
  }

  async send(options: EmailSendOptions): Promise<boolean> {
    if (!this.apiKey) {
      logger.error("Cannot send email: Resend API key is missing.")
      return false
    }
    if (!options.html) {
      logger.error("Cannot send email: HTML content is missing.")
      return false
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: options.from,
          to: options.to,
          subject: options.subject,
          html: options.html,
          bcc: options.bcc,
          cc: options.cc,
          reply_to: options.replyTo,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        logger.error(`Failed to send email via Resend. Status: ${response.status}`, {
          errorBody,
          to: options.to,
          subject: options.subject,
        })
        return false
      }
      const data = await response.json()
      logger.info(`Email sent successfully via Resend to ${options.to}. Message ID: ${data.id}`)
      return true
    } catch (error) {
      logger.error("Error sending email via Resend:", { error, to: options.to, subject: options.subject })
      return false
    }
  }
}

class EmailServiceImpl {
  private provider: EmailProvider
  private defaultFrom: string = process.env.DEFAULT_EMAIL_FROM || "noreply@lvlup.io"
  private siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://lvlup.io"
  private supportEmail: string = process.env.SUPPORT_EMAIL || "support@lvlup.io"

  constructor(provider: EmailProvider) {
    this.provider = provider
  }

  private async sendEmail(
    to: string,
    subject: string,
    template: EmailTemplate,
    data: any,
    from?: string,
  ): Promise<boolean> {
    const fullData = {
      ...data,
      siteUrl: this.siteUrl,
      supportEmail: this.supportEmail,
      // Add other global template variables here if needed
    }
    // Use emailTemplateManager and renderTemplate method
    const htmlContent = emailTemplateManager.renderTemplate(template, fullData)
    if (!htmlContent) {
      logger.error(`Failed to render email template: ${template}`)
      return false
    }
    return this.provider.send({
      to,
      from: from || this.defaultFrom,
      subject,
      html: htmlContent,
    })
  }

  async sendOrderConfirmation(
    to: string,
    orderNumber: string,
    orderDate: string,
    totalAmount: number,
    items: Array<{ name: string; quantity: number; price: number }>,
  ): Promise<boolean> {
    const data: EmailTemplateDataOrderConfirmation = { to, orderNumber, orderDate, totalAmount, items }
    return this.sendEmail(to, `Ihre Bestellung #${orderNumber} bei lvlup.io`, "orderConfirmation", data)
  }

  async sendPaymentReceipt(
    to: string,
    orderNumber: string,
    amountPaid: number,
    paymentMethod: string,
    transactionId?: string,
  ): Promise<boolean> {
    const data: EmailTemplateDataPaymentReceipt = {
      to,
      orderNumber,
      amountPaid,
      paymentMethod,
      transactionDate: new Date().toLocaleDateString("de-DE"),
      transactionId,
    }
    return this.sendEmail(to, `Zahlungsbestätigung für Bestellung #${orderNumber}`, "paymentReceipt", data)
  }

  async sendProductDelivery(
    to: string,
    orderNumber: string,
    productsWithDetails: ProductDeliveryItem[],
  ): Promise<boolean> {
    const data: EmailTemplateDataProductDelivery = {
      to,
      orderNumber,
      products: productsWithDetails, // This now includes name, description, activationCode, downloadLink
    }
    return this.sendEmail(to, `Ihre Produkte zu Bestellung #${orderNumber} sind bereit!`, "productDelivery", data)
  }

  async sendAccountVerification(to: string, verificationLink: string): Promise<boolean> {
    const data: EmailTemplateDataAccountVerification = { to, verificationLink }
    return this.sendEmail(to, "Verifizieren Sie Ihre E-Mail-Adresse für lvlup.io", "accountVerification", data)
  }

  async sendPasswordReset(to: string, resetLink: string): Promise<boolean> {
    const data: EmailTemplateDataPasswordReset = { to, resetLink }
    return this.sendEmail(to, "Anleitung zum Zurücksetzen Ihres Passworts für lvlup.io", "passwordReset", data)
  }

  async sendGiftNotification(
    to: string, // Recipient's email
    fromName: string, // Sender's name (or email as fallback)
    products: Array<{ name: string; description?: string }>,
    message?: string,
  ): Promise<boolean> {
    const claimGiftBaseUrl = `${this.siteUrl}/claim-gift` // Base URL, token might be appended later
    const data: EmailTemplateDataGiftNotification = {
      to,
      fromName,
      products,
      message,
      claimGiftUrl: claimGiftBaseUrl, // Pass the constructed URL
    }
    return this.sendEmail(to, `Sie haben ein Geschenk von ${fromName} erhalten!`, "giftNotification", data)
  }
}

const resendApiKey = process.env.RESEND_API_KEY
if (!resendApiKey && process.env.NODE_ENV === "production") {
  logger.error("RESEND_API_KEY is not set. Email functionality will be severely impacted in production.")
}
const emailProviderInstance = new ResendEmailProvider(resendApiKey || "")
export const emailService = new EmailServiceImpl(emailProviderInstance)
