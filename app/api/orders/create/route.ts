import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/supabase-database"
import { logger } from "@/lib/logger"
import { emailService } from "@/lib/email/email-service"
import { ApiError, handleApiError } from "@/lib/api-error-handler"
import {
  validateEmail,
  validateProductArray,
  validateNumber,
  validateString,
  validateBoolean,
} from "@/lib/validation-utils"
import type { CartItem } from "@/contexts/cart-context" // Assuming CartItem is similar to OrderProductInput

interface OrderRequestBody {
  email: string
  products: CartItem[] // Use CartItem or a specific OrderProductInput type
  total: number
  discountCode?: string
  discountAmount?: number
  isGift?: boolean
  recipientEmail?: string
  giftMessage?: string
  paymentMethod: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderRequestBody

    // --- Input Validation ---
    const emailValidation = validateEmail(body.email)
    if (!emailValidation.valid) throw new ApiError(400, emailValidation.message)
    const validatedEmail = emailValidation.message // validateEmail returns message as value on success in current impl. Let's assume it returns the email.
    // Corrected: validateEmail should return { valid: true, message: "", value: email }
    // For now, we'll use body.email directly after validation.

    const productsValidation = validateProductArray(body.products, "products")
    if (!productsValidation.valid) throw new ApiError(400, productsValidation.message)
    const validatedProducts = productsValidation.value!

    const totalValidation = validateNumber(body.total, "total", { min: 0 })
    if (!totalValidation.valid) throw new ApiError(400, totalValidation.message)
    const validatedTotal = totalValidation.value!

    const paymentMethodValidation = validateString(body.paymentMethod, "paymentMethod")
    if (!paymentMethodValidation.valid) throw new ApiError(400, paymentMethodValidation.message)
    const validatedPaymentMethod = paymentMethodValidation.value!

    let validatedDiscountCode: string | undefined
    if (body.discountCode !== undefined) {
      const discountCodeValidation = validateString(body.discountCode, "discountCode", { required: false })
      if (!discountCodeValidation.valid) throw new ApiError(400, discountCodeValidation.message)
      validatedDiscountCode = discountCodeValidation.value
    }

    let validatedDiscountAmount: number | undefined
    if (body.discountAmount !== undefined) {
      const discountAmountValidation = validateNumber(body.discountAmount, "discountAmount", {
        min: 0,
        required: false,
      })
      if (!discountAmountValidation.valid) throw new ApiError(400, discountAmountValidation.message)
      validatedDiscountAmount = discountAmountValidation.value
    }

    const isGiftValidation = validateBoolean(body.isGift, "isGift", { required: false })
    if (!isGiftValidation.valid) throw new ApiError(400, isGiftValidation.message)
    const validatedIsGift = isGiftValidation.value || false

    let validatedRecipientEmail: string | undefined
    let validatedGiftMessage: string | undefined

    if (validatedIsGift) {
      if (!body.recipientEmail) throw new ApiError(400, "Recipient email is required for gifts.")
      const recipientEmailValidation = validateEmail(body.recipientEmail)
      if (!recipientEmailValidation.valid)
        throw new ApiError(400, `Invalid recipient email: ${recipientEmailValidation.message}`)
      validatedRecipientEmail = body.recipientEmail // Assuming validateEmail is corrected or use its value

      if (body.giftMessage) {
        const giftMessageValidation = validateString(body.giftMessage, "giftMessage", {
          maxLength: 500,
          required: false,
        })
        if (!giftMessageValidation.valid) throw new ApiError(400, giftMessageValidation.message)
        validatedGiftMessage = giftMessageValidation.value
      }
    }
    // --- End Input Validation ---

    // TODO: Server-side recalculation of total based on validatedProducts and discount for security.
    // For now, we trust the client's total after basic validation.

    // Create order record
    const { data: order, error: orderError } = await db.createOrder({
      customer_email: body.email, // Use original email from body after validation
      total_amount: validatedTotal,
      status: "pending", // Or "processing" if payment is initiated
      discount_code: validatedDiscountCode,
      discount_amount: validatedDiscountAmount || 0,
      is_gift: validatedIsGift,
      gift_message: validatedGiftMessage,
      gift_recipient_email: validatedRecipientEmail,
      currency: "USD", // Consider making this dynamic or configurable
      payment_method: validatedPaymentMethod, // Add payment_method to order
    })

    if (orderError || !order) {
      logger.error("Error creating order in DB:", orderError)
      throw new ApiError(500, "Failed to create order record.")
    }

    // Create order items
    // Ensure validatedProducts items have all necessary fields for order_items
    const orderItems = validatedProducts.map((product) => ({
      order_id: order.id,
      product_id: product.id,
      product_name: product.name, // Ensure name is part of validatedProduct
      quantity: product.quantity, // Ensure quantity is part of validatedProduct
      unit_price: product.price, // Ensure price is unit_price and part of validatedProduct
      // total_price: product.price * product.quantity, // if your table needs this
    }))

    const { error: itemsError } = await db.createOrderItems(orderItems)

    if (itemsError) {
      logger.error("Error creating order items in DB:", itemsError)
      // Potentially rollback order creation or mark order as failed
      throw new ApiError(500, "Failed to create order items.")
    }

    // Send order confirmation email
    try {
      await emailService.sendOrderConfirmation(
        body.email,
        order.order_number, // Assuming order_number is generated by db.createOrder
        validatedProducts, // Send validated products structure
        validatedTotal,
        validatedPaymentMethod,
      )

      if (validatedIsGift && validatedRecipientEmail) {
        await emailService.sendGiftNotification(
          validatedRecipientEmail,
          body.email.split("@")[0],
          validatedProducts,
          validatedGiftMessage,
        )
      }
    } catch (emailError) {
      logger.warn("Error sending confirmation email (order still created):", emailError)
      // Don't fail the order if email fails, but log as warning
    }

    logger.info(`Order ${order.order_number} created successfully for ${body.email}`)

    return NextResponse.json({
      success: true,
      orderId: order.order_number, // Or order.id if order_number is not primary identifier for client
      message: "Order created successfully",
    })
  } catch (error) {
    // Log the error with more details if it's not an ApiError or if it's a 500
    if (!(error instanceof ApiError) || (error instanceof ApiError && error.statusCode === 500)) {
      logger.error("Order creation API error:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        details: error instanceof ApiError ? error.details : undefined,
      })
    }
    return handleApiError(error)
  }
}
