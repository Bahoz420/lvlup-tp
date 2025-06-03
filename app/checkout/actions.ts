"use server"

import { cookies } from "next/headers"
import { validateDiscountCode, incrementDiscountCodeUsage } from "@/lib/discount-service"
import { processOrder } from "@/lib/order-service"
import type { CartItem as ClientCartItem } from "@/types" // Client-side cart item type
import { createClient } from "@/utils/supabase/server"
import { logger } from "@/lib/logger"
import { db } from "@/lib/supabase-database" // Import db
import type { DiscountValidationResult } from "@/types"

interface ProcessCheckoutResult {
  success: boolean
  orderId?: string
  paymentId?: string
  redirectUrl?: string
  error?: string
  message?: string
}

// Define a type for cart items that have been verified with server data
interface VerifiedCartItem {
  id: string // product ID
  name: string // server-fetched name
  price: number // server-fetched price
  quantity: number
  subscription: string // from client cart, as this defines the "variant"
  image_url?: string // from client cart, or server if fetched
  requires_activation?: boolean // server-fetched
  subscription_duration_days?: number // server-fetched
}

export async function processCheckout(formData: FormData): Promise<ProcessCheckoutResult> {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const cartCookie = cookies().get("cart")
    if (!cartCookie?.value) {
      return { success: false, error: "Cart is empty" }
    }

    let clientCartItems: ClientCartItem[] = []
    try {
      clientCartItems = JSON.parse(cartCookie.value)
    } catch (e) {
      logger.error("Error parsing cart JSON:", e)
      return { success: false, error: "Invalid cart data" }
    }

    if (!Array.isArray(clientCartItems) || clientCartItems.length === 0) {
      return { success: false, error: "Cart is empty" }
    }

    const email = formData.get("email") as string
    const paymentMethod = formData.get("paymentMethod") as string
    const discountCodeInput = formData.get("discountCode") as string | null
    const isGift = formData.get("isGift") === "on"
    const giftMessage = formData.get("giftMessage") as string | null
    const recipientEmail = formData.get("recipientEmail") as string | null

    if (!email) return { success: false, error: "Email address is required" }
    if (!paymentMethod) return { success: false, error: "Payment method is required" }

    // --- Server-side Product & Price Verification ---
    const productIdsFromCart = clientCartItems.map((item) => item.id)
    const { data: serverProductsData, error: productsError } = await db.getProductsDetailsByIds(productIdsFromCart)

    if (productsError) {
      logger.error("Error fetching product details from DB for checkout:", productsError)
      return { success: false, error: "Could not verify product information. Please try again." }
    }
    if (!serverProductsData || serverProductsData.length !== productIdsFromCart.length) {
      logger.warn("Mismatch between cart product IDs and DB results during checkout.", {
        cartIds: productIdsFromCart,
        dbProductCount: serverProductsData?.length,
      })
      return { success: false, error: "Some products in your cart are no longer available. Please review your cart." }
    }

    const serverProductsMap = new Map(serverProductsData.map((p) => [p.id, p]))
    const verifiedCartItems: VerifiedCartItem[] = []

    for (const clientItem of clientCartItems) {
      const serverProduct = serverProductsMap.get(clientItem.id)
      if (!serverProduct) {
        logger.warn(`Product ID ${clientItem.id} from cart not found in server verification step.`)
        return {
          success: false,
          error: `Product ${clientItem.name || clientItem.id} is no longer available. Please remove it from your cart.`,
        }
      }

      verifiedCartItems.push({
        id: serverProduct.id,
        name: serverProduct.name,
        price: serverProduct.price,
        quantity: Number(clientItem.quantity),
        subscription: clientItem.subscription,
        image_url: clientItem.image_url,
        requires_activation: serverProduct.requires_activation,
        subscription_duration_days: serverProduct.subscription_duration_days,
      })
    }
    // --- End Server-side Product & Price Verification ---

    const subtotal = verifiedCartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    let actualDiscountAmount = 0
    let finalTotal = subtotal
    let appliedDiscountCodeId: string | null = null
    let discountCodeString: string | null = null
    let userMessage: string | undefined = "Order initiated."

    if (discountCodeInput) {
      const discountResult = await validateDiscountCode(discountCodeInput, subtotal)

      if (discountResult.valid && discountResult.discountCode && typeof discountResult.discountAmount === "number") {
        actualDiscountAmount = discountResult.discountAmount
        finalTotal = subtotal - actualDiscountAmount
        appliedDiscountCodeId = discountResult.discountCode.id
        discountCodeString = discountResult.discountCode.code
        userMessage = discountResult.message || "Discount applied successfully."
      } else if (!discountResult.valid) {
        return { success: false, error: discountResult.message || discountResult.error || "Invalid discount code." }
      }
    }
    finalTotal = Math.max(0, finalTotal)

    const orderResult = await processOrder({
      userId: session?.user?.id,
      customerEmail: email,
      cartItems: verifiedCartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subscription: item.subscription,
        image_url: item.image_url,
      })),
      subtotalAmount: subtotal,
      discountAmount: actualDiscountAmount,
      totalAmount: finalTotal,
      discountCode: discountCodeString,
      isGift,
      giftMessage,
      recipientEmail,
      paymentMethod,
    })

    if (
      !orderResult.success ||
      !orderResult.orderId ||
      !orderResult.paymentDetails?.paymentId ||
      !orderResult.paymentDetails.redirectUrl
    ) {
      logger.error("Order processing failed or did not return expected details.", { orderResult })
      return { success: false, error: orderResult.error || "Error processing the order." }
    }

    if (appliedDiscountCodeId && actualDiscountAmount > 0) {
      const incrementResult = await incrementDiscountCodeUsage(
        appliedDiscountCodeId,
        orderResult.orderId,
        actualDiscountAmount,
        email,
      )
      if (!incrementResult.success) {
        logger.warn(`Failed to increment usage for discount code ID ${appliedDiscountCodeId}: ${incrementResult.error}`)
        userMessage += " (Note: Discount usage tracking issue occurred.)"
      }
    }

    cookies().set("cart", "[]", { maxAge: -1, path: "/" })

    return {
      success: true,
      orderId: orderResult.orderId,
      paymentId: orderResult.paymentDetails.paymentId,
      redirectUrl: orderResult.paymentDetails.redirectUrl,
      message: userMessage,
    }
  } catch (error: any) {
    logger.error("Checkout error:", { message: error.message, stack: error.stack })
    return { success: false, error: error.message || "An unexpected error occurred during checkout." }
  }
}

export async function validateDiscountCodeAction(formData: FormData): Promise<DiscountValidationResult> {
  const discountCode = formData.get("discountCode") as string | null
  const subtotalString = formData.get("subtotal") as string | null

  if (!discountCode || !subtotalString) {
    return { valid: false, error: "Discount code and subtotal are required." }
  }
  const subtotal = Number.parseFloat(subtotalString)
  if (isNaN(subtotal)) {
    return { valid: false, error: "Invalid subtotal amount." }
  }

  const result = await validateDiscountCode(discountCode, subtotal)
  return result
}
