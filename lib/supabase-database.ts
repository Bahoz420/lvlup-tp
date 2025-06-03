import { createClient as createSupabaseClient } from "@/utils/supabase/server"
import type { SupabaseClient, PostgrestError } from "@supabase/supabase-js"
import type {
  ProductWithRelations,
  ProductOverviewItem,
  ActivationCodeWithProductDetails,
  AssignedActivationCode,
  UserProductBase,
  UserProductCreationPayload,
  UserProductWithProductDetails,
  DbOrder,
  OrderCreationPayload,
  DbOrderItem,
  OrderItemCreationPayload,
  DbOrderWithFullDetails,
  DbPayment,
  PaymentCreationPayload,
  PaymentUpdatePayload,
  DbDiscountCode,
  ValidatedDiscountCode,
  DiscountCartContext,
  DiscountCodeUsage,
  DiscountCodeUsageCreateInput,
  // Add a type for basic product details needed for checkout
  ProductBase as DbProductBaseDetails, // Re-using ProductBase from database.ts for now
} from "@/types/database"
import type { User, UserCreationPayload, UserUpdatePayload } from "@/types/index"
import { logger } from "@/lib/logger"

// Function to get a Supabase client instance
function getClient(): SupabaseClient {
  return createSupabaseClient()
}

// Helper to generate order_number, can be more sophisticated
function generateOrderNumber(): string {
  const timestamp = Date.now()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp}-${randomPart}`
}

const PAYMENT_SELECT_STRING =
  "id, order_id, provider, transaction_id, amount, currency, crypto_amount, crypto_currency, status, confirmations, payment_details, created_at, updated_at"
const ORDER_SELECT_STRING =
  "id, order_number, customer_email, user_id, total_amount, subtotal_amount, discount_amount, discount_code_id, status, currency, payment_method, payment_intent_id, transaction_id, is_gift, gift_message, recipient_email, created_at, updated_at"
const ACTIVATION_CODE_SELECT_STRING =
  "id, code, product_id, is_used, used_by_user_id, order_id, used_at, created_at, expires_at"
const DISCOUNT_CODE_SELECT_STRING =
  "id, code, description, discount_type, discount_value, minimum_amount, maximum_uses, current_uses, is_active, expires_at, created_at, created_by_admin_id"
const ORDER_ITEM_SELECT_STRING =
  "id, order_id, product_id, product_name, quantity, unit_price, total_price, created_at, updated_at"
const PRODUCT_DETAILS_SELECT_STRING = "id, name, price, requires_activation, subscription_duration_days" // Added subscription_duration_days

// Define the type for product items passed to the RPC function
interface RpcProductItem {
  product_id: string
  quantity: number
}

export const db = {
  // ... other existing methods ...

  async getProductBySlug(slug: string): Promise<{ data: ProductWithRelations | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("products")
      .select(`
        id, name, slug, description, long_description, price, image_url, category, requires_activation, created_at, updated_at, subscription_duration_days,
        product_status (
          status,
          active_users,
          last_updated
        ),
        product_features (
          feature
        ),
        reviews (
          id,
          rating,
          comment,
          created_at,
          user_id
        )
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      logger.error(`Error fetching product by slug "${slug}":`, { error: JSON.stringify(error, null, 2) })
      return { data: null, error }
    }
    return { data: data as ProductWithRelations | null, error: null }
  },

  async getAllProducts(): Promise<{ data: ProductOverviewItem[] | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase.from("products").select(`
        id, name, slug, description, long_description, price, image_url, category, requires_activation, created_at, updated_at, subscription_duration_days,
        product_status (
          status,
          active_users,
          last_updated
        ),
        product_features (
          feature
        )
      `)

    if (error) {
      logger.error("Error fetching all products from Supabase:", { error: JSON.stringify(error, null, 2) })
      return { data: null, error }
    }
    return { data: data as ProductOverviewItem[] | null, error: null }
  },

  // NEW: Function to get essential details for multiple products by their IDs
  async getProductsDetailsByIds(
    productIds: string[],
  ): Promise<{ data: DbProductBaseDetails[] | null; error: PostgrestError | null }> {
    if (!productIds || productIds.length === 0) {
      return { data: [], error: null }
    }
    const supabase = getClient()
    const { data, error } = await supabase.from("products").select(PRODUCT_DETAILS_SELECT_STRING).in("id", productIds)

    if (error) {
      logger.error("Error fetching products details by IDs:", { productIds, error: JSON.stringify(error, null, 2) })
      return { data: null, error }
    }
    return { data: data as DbProductBaseDetails[] | null, error: null }
  },

  async getUserByEmail(email: string): Promise<{ data: User | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("users")
      .select("id, email, created_at, updated_at, last_sign_in_at, full_name, avatar_url")
      .eq("email", email)
      .single()

    if (error && error.code !== "PGRST116") {
      logger.error(`Error fetching user by email ${email}:`, { error: JSON.stringify(error, null, 2) })
    }
    return { data: data as User | null, error: error?.code === "PGRST116" ? null : error }
  },

  async getUserById(id: string): Promise<{ data: User | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("users")
      .select("id, email, created_at, updated_at, last_sign_in_at, full_name, avatar_url")
      .eq("id", id)
      .single()

    if (error && error.code !== "PGRST116") {
      logger.error(`Error fetching user by id ${id}:`, { error: JSON.stringify(error, null, 2) })
    }
    return { data: data as User | null, error: error?.code === "PGRST116" ? null : error }
  },

  async createUser(userData: UserCreationPayload): Promise<{ data: User | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("users")
      .insert(userData)
      .select("id, email, created_at, updated_at, last_sign_in_at, full_name, avatar_url")
      .single()

    if (error) {
      logger.error("Error creating user:", { error: JSON.stringify(error, null, 2) })
    }
    return { data: data as User | null, error }
  },

  async updateUser(
    userId: string,
    updates: UserUpdatePayload,
  ): Promise<{ data: User | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select("id, email, created_at, updated_at, last_sign_in_at, full_name, avatar_url")
      .single()

    if (error) {
      logger.error(`Error updating user ${userId}:`, { error: JSON.stringify(error, null, 2) })
    }
    return { data: data as User | null, error }
  },

  // Activation Code Functions
  async getActivationCode(
    code: string,
  ): Promise<{ data: ActivationCodeWithProductDetails | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("activation_codes")
      .select(
        `
        ${ACTIVATION_CODE_SELECT_STRING},
        products ( 
          name,
          subscription_duration_days
        )
      `,
      )
      .eq("code", code)
      .single()

    if (error && error.code !== "PGRST116") {
      logger.error(`Database error fetching activation code "${code}":`, { error: JSON.stringify(error, null, 2) })
      return { data: null, error }
    }
    if (!data) {
      return { data: null, error: null }
    }
    if (data && !data.products) {
      logger.warn(
        `Activation code "${code}" (ID: ${data.id}) found, but its linked product (product_id: ${data.product_id}) is missing or inaccessible.`,
      )
      return {
        data: data as ActivationCodeWithProductDetails,
        error: {
          message: "Activation code found, but linked product details are missing.",
          details: `Product with ID ${data.product_id} not found or inaccessible.`,
          hint: "Check database integrity or product visibility.",
          code: "V0_LINKED_PRODUCT_MISSING",
        } as unknown as PostgrestError,
      }
    }
    return { data: data as ActivationCodeWithProductDetails, error: null }
  },
  async findAndAssignActivationCode(
    productId: string,
    orderId: string,
    userId: string | null,
  ): Promise<{ data: AssignedActivationCode | null; error: PostgrestError | null; errorCode?: string }> {
    logger.warn(
      "findAndAssignActivationCode called directly. Prefer atomic RPC complete_order_and_assign_codes for order completion.",
    )
    const supabase = getClient()
    const { data: availableCode, error: findError } = await supabase
      .from("activation_codes")
      .select(ACTIVATION_CODE_SELECT_STRING)
      .eq("product_id", productId)
      .eq("is_used", false)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .limit(1)
      .single()

    if (findError && findError.code !== "PGRST116") {
      logger.error(`Error finding available activation code for product ${productId}:`, findError)
      return { data: null, error: findError, errorCode: findError.code }
    }

    if (!availableCode) {
      logger.warn(`No available activation codes found for product ${productId}.`)
      return {
        data: null,
        error: {
          message: "No available activation codes for this product.",
          details: `Product ID: ${productId}`,
          hint: "Check inventory of activation codes.",
          code: "V0_NO_CODES_AVAILABLE",
        } as unknown as PostgrestError,
        errorCode: "NO_CODES_AVAILABLE",
      }
    }

    const updatePayload: Partial<ActivationCodeWithProductDetails> = {
      is_used: true,
      used_at: new Date().toISOString(),
      order_id: orderId,
    }
    if (userId) {
      updatePayload.used_by_user_id = userId
    }

    const { data: assignedCodeData, error: assignError } = await supabase
      .from("activation_codes")
      .update(updatePayload)
      .eq("id", availableCode.id)
      .eq("is_used", false)
      .select("id, code, product_id")
      .single()

    if (assignError) {
      logger.error(
        `Error assigning activation code ${availableCode.code} (ID: ${availableCode.id}) to order ${orderId}:`,
        assignError,
      )
      return { data: null, error: assignError, errorCode: assignError.code }
    }
    if (!assignedCodeData) {
      logger.error(
        `Failed to assign activation code ${availableCode.code} (ID: ${availableCode.id}) to order ${orderId} - code might have been used concurrently.`,
      )
      return {
        data: null,
        error: {
          message: "Failed to assign activation code due to concurrent update.",
          details: `Code ID: ${availableCode.id}`,
          hint: "Retry the operation or check code status.",
          code: "V0_CODE_ASSIGN_CONFLICT",
        } as unknown as PostgrestError,
        errorCode: "CODE_ASSIGN_CONFLICT",
      }
    }

    logger.info(
      `Successfully assigned activation code ${assignedCodeData.code} (ID: ${assignedCodeData.id}) to product ${productId} for order ${orderId}.`,
    )
    return { data: assignedCodeData as AssignedActivationCode, error: null }
  },

  async markActivationCodeAsUsed(
    codeId: string,
    userId: string,
    orderId?: string,
  ): Promise<{ data: null; error: PostgrestError | null }> {
    const supabase = getClient()
    const updatePayload: Partial<ActivationCodeWithProductDetails> = {
      is_used: true,
      used_by_user_id: userId,
      used_at: new Date().toISOString(),
    }
    if (orderId) {
      updatePayload.order_id = orderId
    }

    const { error } = await supabase
      .from("activation_codes")
      .update(updatePayload)
      .eq("id", codeId)
      .eq("is_used", false)
      .select("id")
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        logger.warn(`Failed to mark activation code ${codeId} as used: Code not found or already used.`)
        return {
          data: null,
          error: {
            message: "Activation code not found or already used.",
            details: "No matching unused code found for the given ID.",
            hint: "Verify code ID and its current status.",
            code: "V0_CODE_NOT_FOUND_OR_USED",
          } as unknown as PostgrestError,
        }
      }
      logger.error(`Error marking activation code ${codeId} as used:`, { error: JSON.stringify(error, null, 2) })
      return { data: null, error }
    }
    return { data: null, error: null }
  },

  async createUserProduct(
    userProductData: UserProductCreationPayload,
  ): Promise<{ data: UserProductBase | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const payload = {
      ...userProductData,
      is_active: userProductData.is_active !== undefined ? userProductData.is_active : true,
    }
    const { data, error } = await supabase
      .from("user_products")
      .insert(payload)
      .select(
        "id, user_id, product_id, activation_code_id, order_id, activated_at, expires_at, is_active, created_at, updated_at",
      )
      .single()

    if (error) {
      logger.error("Error creating user product entry:", { error: JSON.stringify(error, null, 2) })
    }
    return { data: data as UserProductBase | null, error }
  },

  async getUserProducts(
    userId: string,
  ): Promise<{ data: UserProductWithProductDetails[] | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("user_products")
      .select(
        `
        id, user_id, product_id, activation_code_id, order_id, activated_at, expires_at, is_active, created_at, updated_at,
        products (
          id, name, description, image_url, category, requires_activation
        )
      `,
      )
      .eq("user_id", userId)
      .eq("is_active", true)

    if (error) {
      logger.error(`Error fetching user products for user ${userId}:`, { error: JSON.stringify(error, null, 2) })
      return { data: null, error }
    }
    return { data: data as UserProductWithProductDetails[] | null, error: null }
  },

  // Order functions
  async createOrder(orderData: OrderCreationPayload): Promise<{ data: DbOrder | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const orderNumber = generateOrderNumber()
    const payloadToInsert = {
      ...orderData,
      order_number: orderNumber,
      is_gift: orderData.is_gift || false,
    }
    const { data, error } = await supabase.from("orders").insert(payloadToInsert).select(ORDER_SELECT_STRING).single()
    if (error) {
      logger.error("Error creating order:", { error: JSON.stringify(error, null, 2), orderData })
    }
    return { data: data as DbOrder | null, error }
  },

  async createOrderItems(
    orderItems: OrderItemCreationPayload[],
  ): Promise<{ data: DbOrderItem[] | null; error: PostgrestError | null }> {
    const supabase = getClient()
    if (!orderItems || orderItems.length === 0) {
      return { data: [], error: null }
    }
    const { data, error } = await supabase.from("order_items").insert(orderItems).select(ORDER_ITEM_SELECT_STRING)
    if (error) {
      logger.error("Error creating order items:", { error: JSON.stringify(error, null, 2), orderItems })
    }
    return { data: data as DbOrderItem[] | null, error }
  },

  async getOrderById(orderId: string): Promise<{ data: DbOrder | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase.from("orders").select(ORDER_SELECT_STRING).eq("id", orderId).single()

    if (error && error.code !== "PGRST116") {
      logger.error(`Error fetching order by ID ${orderId}:`, { error: JSON.stringify(error, null, 2) })
    }
    return { data: data as DbOrder | null, error: error?.code === "PGRST116" ? null : error }
  },

  // New function to get order with items by ID
  async getOrderByIdWithFullDetails(
    orderId: string,
  ): Promise<{ data: DbOrderWithFullDetails | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const selectString = `
      ${ORDER_SELECT_STRING},
      order_items (
        ${ORDER_ITEM_SELECT_STRING},
        products (${PRODUCT_DETAILS_SELECT_STRING}) 
      )
    `
    const { data, error } = await supabase.from("orders").select(selectString).eq("id", orderId).single()

    if (error && error.code !== "PGRST116") {
      logger.error(`Error fetching order with full details by ID ${orderId}:`, {
        error: JSON.stringify(error, null, 2),
      })
      return { data: null, error }
    }
    return { data: data as DbOrderWithFullDetails | null, error: error?.code === "PGRST116" ? null : error }
  },

  async getOrderByNumber(
    orderNumber: string,
  ): Promise<{ data: DbOrderWithFullDetails | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const selectString = `
      ${ORDER_SELECT_STRING},
      order_items (
        ${ORDER_ITEM_SELECT_STRING},
        products (${PRODUCT_DETAILS_SELECT_STRING})
      )
    `
    const { data, error } = await supabase.from("orders").select(selectString).eq("order_number", orderNumber).single()
    if (error && error.code !== "PGRST116") {
      logger.error(`Error fetching order by number ${orderNumber}:`, { error: JSON.stringify(error, null, 2) })
    }
    return { data: data as DbOrderWithFullDetails | null, error: error?.code === "PGRST116" ? null : error }
  },

  async updateOrder(
    orderId: string,
    updates: Partial<Omit<DbOrder, "id" | "order_number" | "created_at">>,
  ): Promise<{ data: DbOrder | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from("orders")
      .update(updatesWithTimestamp)
      .eq("id", orderId)
      .select(ORDER_SELECT_STRING)
      .single()
    if (error) {
      if (error.code === "PGRST116") {
        logger.warn(`Attempted to update non-existent order with ID ${orderId}.`)
        return { data: null, error: null }
      }
      logger.error(`Error updating order ${orderId}:`, { error: JSON.stringify(error, null, 2), updates })
      return { data: null, error }
    }
    if (!data && !error) {
      logger.warn(`Order with ID ${orderId} not found after update attempt, or RLS prevented returning data.`)
      return { data: null, error: null }
    }
    return { data: data as DbOrder, error: null }
  },

  // Payment functions
  async createPayment(
    paymentData: PaymentCreationPayload,
  ): Promise<{ data: DbPayment | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const payloadWithTimestamps: Omit<DbPayment, "id"> = {
      ...paymentData,
      transaction_id: paymentData.transaction_id || null,
      crypto_amount: paymentData.crypto_amount || null,
      crypto_currency: paymentData.crypto_currency || null,
      confirmations: null,
      payment_details: paymentData.payment_details || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from("payments")
      .insert(payloadWithTimestamps)
      .select(PAYMENT_SELECT_STRING)
      .single()
    if (error) {
      logger.error("Error creating payment record:", { error: JSON.stringify(error, null, 2), paymentData })
    }
    return { data: data as DbPayment, error }
  },

  async getPaymentById(paymentId: string): Promise<{ data: DbPayment | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase.from("payments").select(PAYMENT_SELECT_STRING).eq("id", paymentId).single()

    if (error && error.code !== "PGRST116") {
      logger.error(`Error fetching payment by ID ${paymentId}:`, { error: JSON.stringify(error, null, 2) })
    }
    return { data: data as DbPayment | null, error: error?.code === "PGRST116" ? null : error }
  },

  async updatePayment(
    paymentId: string,
    updates: PaymentUpdatePayload,
  ): Promise<{ data: DbPayment | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from("payments")
      .update(updatesWithTimestamp)
      .eq("id", paymentId)
      .select(PAYMENT_SELECT_STRING)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        logger.warn(`Attempted to update non-existent payment with ID ${paymentId}.`)
        return { data: null, error: null }
      }
      logger.error(`Error updating payment ${paymentId}:`, { error: JSON.stringify(error, null, 2), updates })
      return { data: null, error }
    }
    if (!data && !error) {
      logger.warn(`Payment with ID ${paymentId} not found after update attempt, or RLS prevented returning data.`)
      return { data: null, error: null }
    }
    return { data: data as DbPayment, error: null }
  },

  // --- Discount Code Functions ---
  async getDiscountCodeByCodeRaw(code: string): Promise<{ data: DbDiscountCode | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("discount_codes")
      .select(DISCOUNT_CODE_SELECT_STRING)
      .eq("code", code)
      .single()

    if (error && error.code !== "PGRST116") {
      logger.error(`Error fetching discount code by code (raw) ${code}:`, { error: JSON.stringify(error, null, 2) })
      return { data: null, error }
    }
    return { data: data as DbDiscountCode | null, error: null }
  },

  async validateDiscountCode(
    code: string,
    cartContext?: DiscountCartContext,
  ): Promise<{ data: ValidatedDiscountCode | null; error: PostgrestError | null }> {
    const { data: dbCode, error: fetchError } = await this.getDiscountCodeByCodeRaw(code)

    if (fetchError) {
      return { data: null, error: fetchError }
    }

    if (!dbCode) {
      // Ensure all fields from DbDiscountCode are present or correctly defaulted for ValidatedDiscountCode
      const notFoundResponse: ValidatedDiscountCode = {
        id: "", // Placeholder
        code: code,
        type: "fixed_amount", // Default
        value: 0, // Default
        uses_count: 0, // Default
        is_active: false,
        created_at: new Date().toISOString(), // Placeholder
        updated_at: new Date().toISOString(), // Placeholder
        // Add other DbDiscountCode fields with defaults or null
        description: null,
        min_purchase_amount: null,
        max_uses: null,
        max_uses_per_user: null,
        valid_from: null,
        valid_until: null,
        applicable_product_ids: null,
        // ValidatedDiscountCode specific fields
        isValid: false,
        reason: "not_found",
      }
      return {
        data: notFoundResponse,
        error: null,
      }
    }

    const validatedCode: ValidatedDiscountCode = {
      ...dbCode,
      isValid: true,
    }

    if (!validatedCode.is_active) {
      validatedCode.isValid = false
      validatedCode.reason = "inactive"
    } else if (validatedCode.valid_until && new Date(validatedCode.valid_until) < new Date()) {
      validatedCode.isValid = false
      validatedCode.reason = "expired"
    } else if (validatedCode.valid_from && new Date(validatedCode.valid_from) > new Date()) {
      validatedCode.isValid = false
      validatedCode.reason = "not_yet_valid"
    } else if (validatedCode.max_uses !== null && validatedCode.uses_count >= validatedCode.max_uses) {
      validatedCode.isValid = false
      validatedCode.reason = "max_uses_reached"
    }

    if (validatedCode.isValid && cartContext) {
      if (
        validatedCode.min_purchase_amount !== null &&
        cartContext.currentCartAmount < validatedCode.min_purchase_amount
      ) {
        validatedCode.isValid = false
        validatedCode.reason = "min_purchase_not_met"
      }
    }

    if (validatedCode.isValid && cartContext) {
      const amountToDiscount = cartContext.currentCartAmount

      if (validatedCode.type === "percentage") {
        validatedCode.discountAmountCalculated = Math.round(amountToDiscount * (validatedCode.value / 100))
      } else if (validatedCode.type === "fixed_amount") {
        validatedCode.discountAmountCalculated = validatedCode.value
      }

      if (validatedCode.discountAmountCalculated && validatedCode.discountAmountCalculated > amountToDiscount) {
        validatedCode.discountAmountCalculated = amountToDiscount
      }
    } else if (validatedCode.isValid && !cartContext) {
      validatedCode.discountAmountCalculated = undefined
    }

    return { data: validatedCode, error: null }
  },

  async incrementDiscountCodeUsage(
    discountCodeId: string,
  ): Promise<{ data: { uses_count: number } | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data: currentCode, error: fetchError } = await supabase
      .from("discount_codes")
      .select("uses_count, max_uses")
      .eq("id", discountCodeId)
      .single()

    if (fetchError) {
      logger.error(`Error fetching discount code ${discountCodeId} for increment:`, fetchError)
      return { data: null, error: fetchError }
    }
    if (!currentCode) {
      logger.warn(`Discount code ${discountCodeId} not found for increment.`)
      return {
        data: null,
        error: { message: "Discount code not found.", code: "PGRST116", details: "", hint: "" } as PostgrestError,
      }
    }

    if (currentCode.max_uses !== null && currentCode.uses_count >= currentCode.max_uses) {
      logger.warn(`Discount code ${discountCodeId} already reached max uses (${currentCode.max_uses}).`)
      return { data: { uses_count: currentCode.uses_count }, error: null }
    }

    const newUsesCount = currentCode.uses_count + 1
    const { data, error } = await supabase
      .from("discount_codes")
      .update({ uses_count: newUsesCount, updated_at: new Date().toISOString() })
      .eq("id", discountCodeId)
      .select("uses_count")
      .single()

    if (error) {
      logger.error(`Error incrementing usage count for discount code ${discountCodeId}:`, error)
      return { data: null, error }
    }
    return { data: data as { uses_count: number } | null, error }
  },

  async recordDiscountCodeUsage(
    usageData: DiscountCodeUsageCreateInput,
  ): Promise<{ data: DiscountCodeUsage | null; error: PostgrestError | null }> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("discount_code_usages")
      .insert(usageData)
      .select("id, discount_code_id, order_id, customer_email, amount, created_at")
      .single()

    if (error) {
      logger.error("Error recording discount code usage:", { error: JSON.stringify(error, null, 2), usageData })
    }
    return { data: data as DiscountCodeUsage | null, error }
  },

  // NEW RPC Call Method
  async completeOrderAndAssignCodesDB(
    orderId: string,
    newStatus: string,
    paymentTransactionId: string,
    paymentProvider: string,
    productItems: RpcProductItem[],
  ): Promise<{ success: boolean; error: PostgrestError | null; errorCode?: string }> {
    const supabase = getClient()
    const params = {
      p_order_id: orderId,
      p_new_status: newStatus,
      p_payment_transaction_id: paymentTransactionId,
      p_payment_provider: paymentProvider,
      p_product_items: productItems,
    }
    logger.info("Calling RPC complete_order_and_assign_codes with params:", params)

    const { data, error } = await supabase.rpc("complete_order_and_assign_codes", params)

    if (error) {
      logger.error("RPC call complete_order_and_assign_codes failed:", {
        error: JSON.stringify(error, null, 2),
        params,
      })
      let errorCode = error.code
      if (error.message?.includes("No available activation code")) {
        errorCode = "NO_CODES_AVAILABLE_RPC"
      }
      return { success: false, error, errorCode }
    }

    if (data === true) {
      logger.info(`RPC complete_order_and_assign_codes succeeded for order ${orderId}.`)
      return { success: true, error: null }
    } else {
      logger.error(
        `RPC complete_order_and_assign_codes returned unexpected data: ${data} for order ${orderId}. Assuming failure.`,
      )
      return {
        success: false,
        error: {
          message: "RPC returned unexpected result.",
          details: `Expected TRUE, got ${data}`,
          hint: "Check RPC function logic.",
          code: "V0_RPC_UNEXPECTED_RESULT",
        } as unknown as PostgrestError,
        errorCode: "RPC_UNEXPECTED_RESULT",
      }
    }
  },
}
