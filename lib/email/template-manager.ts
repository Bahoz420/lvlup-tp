import { orderConfirmationTemplate } from "./templates/order-confirmation"
import { paymentReceiptTemplate } from "./templates/payment-receipt"
import { productDeliveryTemplate } from "./templates/product-delivery"
import { giftNotificationTemplate } from "./templates/gift-notification"
import type { EmailTemplate, EmailTemplateRenderer } from "@/types/email"

/**
 * Email Template Manager
 * Manages all email templates and renders them with provided data
 */
export class EmailTemplateManager {
  private templates: Map<EmailTemplate, EmailTemplateRenderer>

  constructor() {
    this.templates = new Map()
    this.registerDefaultTemplates()
  }

  /**
   * Register default email templates
   */
  private registerDefaultTemplates(): void {
    this.templates.set("order-confirmation", orderConfirmationTemplate)
    this.templates.set("payment-receipt", paymentReceiptTemplate)
    this.templates.set("product-delivery", productDeliveryTemplate)
    this.templates.set("gift-notification", giftNotificationTemplate)
  }

  /**
   * Register a custom email template
   */
  registerTemplate(name: EmailTemplate, renderer: EmailTemplateRenderer): void {
    this.templates.set(name, renderer)
  }

  /**
   * Render an email template with provided data
   */
  renderTemplate(template: EmailTemplate, data: Record<string, any>): string {
    const renderer = this.templates.get(template)

    if (!renderer) {
      throw new Error(`Email template '${template}' not found`)
    }

    return renderer(data)
  }

  /**
   * Check if a template exists
   */
  hasTemplate(template: EmailTemplate): boolean {
    return this.templates.has(template)
  }

  /**
   * Get all registered template names
   */
  getTemplateNames(): EmailTemplate[] {
    return Array.from(this.templates.keys())
  }
}

/**
 * Create and export a singleton instance
 */
export const emailTemplateManager = new EmailTemplateManager()
