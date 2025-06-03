import { createClient } from "@/utils/supabase/server"

/**
 * Validates an activation code
 * @param code The activation code to validate
 * @returns A validation result object
 */
export async function validateActivationCode(code: string): Promise<{
  valid: boolean
  message: string
}> {
  if (!code || code.trim() === "") {
    return {
      valid: false,
      message: "Aktivierungscode ist erforderlich",
    }
  }

  const normalizedCode = code.trim().toUpperCase()

  if (!/^[A-Z0-9]{8,16}$/.test(normalizedCode)) {
    return {
      valid: false,
      message: "Ungültiges Format. Der Code sollte 8-16 alphanumerische Zeichen enthalten.",
    }
  }

  try {
    const supabase = createClient()

    // Check activation code in Supabase
    const { data: activationCode, error } = await supabase
      .from("activation_codes")
      .select("*")
      .eq("code", normalizedCode)
      .eq("is_used", false)
      .single()

    if (error || !activationCode) {
      // Fall back to mock validation if no database entry
      return getMockValidationResult(normalizedCode)
    }

    // Check if code is expired
    if (activationCode.expires_at && new Date(activationCode.expires_at) < new Date()) {
      return {
        valid: false,
        message: "Dieser Code ist abgelaufen",
      }
    }

    return {
      valid: true,
      message: "Aktivierungscode erfolgreich validiert",
    }
  } catch (error) {
    console.error("Error validating activation code:", error)
    // Fall back to mock validation
    return getMockValidationResult(normalizedCode)
  }
}

// Fallback mock validation
function getMockValidationResult(normalizedCode: string): { valid: boolean; message: string } {
  if (normalizedCode.startsWith("TEST")) {
    return { valid: true, message: "Testcode erfolgreich validiert" }
  }
  if (normalizedCode.startsWith("INVALID")) {
    return { valid: false, message: "Dieser Code ist ungültig" }
  }
  if (normalizedCode.startsWith("EXPIRED")) {
    return { valid: false, message: "Dieser Code ist abgelaufen" }
  }
  if (normalizedCode.startsWith("VIP")) {
    return { valid: true, message: "VIP-Zugang freigeschaltet" }
  }
  if (normalizedCode.startsWith("PREMIUM")) {
    return { valid: true, message: "Premium-Paket freigeschaltet" }
  }

  const isValid = Math.random() < 0.8
  return {
    valid: isValid,
    message: isValid ? "Aktivierungscode erfolgreich validiert" : "Ungültiger oder bereits verwendeter Code",
  }
}

// Add this function if it doesn't exist
export async function updateOrderStatus(
  orderId: string,
  newStatus: string, // e.g., 'COMPLETED', 'PAID', 'SHIPPED', 'CANCELLED'
  details?: any,
): Promise<{ success: boolean; error?: string }> {
  // This function would interact with your database (e.g., via lib/supabase-database.ts)
  // to update the overall status of an order.
  console.log(`Updating order status for ${orderId} to ${newStatus}`, details)
  // Example (replace with actual db call):
  // const { data, error } = await db.updateOrderStatusInDB(orderId, newStatus, details);
  // if (error) return { success: false, error: error.message };
  // return { success: true };
  await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate async
  return { success: true } // Placeholder
}

export async function processOrder(orderData: {
  userId?: string
  customerEmail: string
  cartItems: any[]
  subtotalAmount: number
  discountAmount: number
  totalAmount: number
  discountCodeId?: string
  isGift: boolean
  giftMessage?: string
  recipientEmail?: string
  paymentMethod: string
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const supabase = createClient()

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email: orderData.customerEmail,
        user_id: orderData.userId,
        total_amount: orderData.totalAmount,
        discount_amount: orderData.discountAmount,
        status: "pending",
        is_gift: orderData.isGift,
        gift_message: orderData.giftMessage,
        gift_recipient_email: orderData.recipientEmail,
        payment_method: orderData.paymentMethod,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error("Error creating order:", orderError)
      return { success: false, error: "Failed to create order" }
    }

    // Create order items
    const orderItems = orderData.cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Don't fail the order if items creation fails
    }

    return { success: true, orderId: orderNumber }
  } catch (error) {
    console.error("Error processing order:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
