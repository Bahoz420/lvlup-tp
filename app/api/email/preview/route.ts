import { type NextRequest, NextResponse } from "next/server"
import { emailTemplateManager } from "@/lib/email/template-manager"
import { logger } from "@/lib/logger"
import type { EmailTemplate } from "@/types/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { template, data } = body

    if (!template) {
      return NextResponse.json({ success: false, error: "Template is required" }, { status: 400 })
    }

    if (!emailTemplateManager.hasTemplate(template as EmailTemplate)) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 })
    }

    const html = emailTemplateManager.renderTemplate(template as EmailTemplate, data || {})

    return NextResponse.json({
      success: true,
      html,
    })
  } catch (error) {
    logger.error("Email preview error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate preview" }, { status: 500 })
  }
}
