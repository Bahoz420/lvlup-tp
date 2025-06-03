import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email/email-service"
import { logger } from "@/lib/logger"
import type { EmailTemplate } from "@/types/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { template, email, data } = body

    if (!template || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Template and email are required",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    // Generate subject based on template
    let subject = "Test Email"
    switch (template) {
      case "order-confirmation":
        subject = `Order Confirmation #${data.orderId || "TEST-ORDER"}`
        break
      case "payment-receipt":
        subject = `Payment Receipt for Order #${data.orderId || "TEST-ORDER"}`
        break
      case "product-delivery":
        subject = `Your Products Are Ready - Order #${data.orderId || "TEST-ORDER"}`
        break
      case "gift-notification":
        subject = `You've Received a Gift from ${data.fromName || "Someone"}!`
        break
      default:
        subject = `Test Email - ${template}`
    }

    const result = await emailService.sendEmail({
      template: template as EmailTemplate,
      to: email,
      subject,
      data: data || {},
    })

    if (result) {
      return NextResponse.json({
        success: true,
        message: `Test email sent to ${email}`,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send test email",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    logger.error("Send test email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test email",
      },
      { status: 500 },
    )
  }
}
