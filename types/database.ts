// Existing content from previous turn...
import type { ProductStatus, ProductReview as AppProductReview } from "./product"

interface ProductBase {
  id: string
  name: string
  slug: string
  description: string
  long_description?: string
  price: number
  image_url: string
  category?: string
  requires_activation?: boolean // Flag to indicate if product needs activation code
  created_at: string
  updated_at: string
  subscription_duration_days?: number
}

interface DbProductStatus {
  status: ProductStatus
  active_users: number
  last_updated: string
}

interface DbProductFeature {
  feature: string
}

interface DbProductReview extends AppProductReview {
  user_id?: string
}

export interface ProductWithRelations extends ProductBase {
  product_status: DbProductStatus | null
  product_features: DbProductFeature[]
  reviews: DbProductReview[]
}

export interface ProductOverviewItem extends ProductBase {
  product_status: DbProductStatus | null
  product_features: DbProductFeature[]
}

export interface ActivationCodeBase {
  id: string
  code: string
  product_id: string
  is_used: boolean
  used_by_user_id?: string | null
  order_id?: string | null // Added to link code to a specific order
  used_at?: string | null
  created_at: string
  expires_at?: string | null
}

export interface ActivationCodeProductInfo {
  name: string
  subscription_duration_days?: number | null
}

// This type is for when we fetch a code and its product details
export interface ActivationCodeWithProductDetails extends ActivationCodeBase {
  products: ActivationCodeProductInfo | null
}

// This type represents an assigned code, just the code string and its ID
export interface AssignedActivationCode {
  id: string
  code: string
  product_id: string
}

export interface UserProductBase {
  id: string
  user_id: string
  product_id: string
  activation_code_id?: string | null
  order_id?: string | null
  activated_at: string
  expires_at?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserProductCreationPayload {
  user_id: string
  product_id: string
  activation_code_id?: string
  order_id?: string
  activated_at: string
  expires_at?: string
  is_active?: boolean
}

export interface UserProductProductInfo {
  name: string
  description?: string
  image_url?: string
  category?: string
}

export interface UserProductWithProductDetails extends UserProductBase {
  products: UserProductProductInfo | null
}

// --- Types for Orders ---
export interface DbOrder {
  id: string
  order_number: string
  customer_email: string
  user_id?: string | null
  total_amount: number
  subtotal_amount?: number
  discount_amount?: number
  discount_code_id?: string | null
  status: string
  currency: string
  payment_method?: string | null
  payment_intent_id?: string | null
  transaction_id?: string | null
  is_gift: boolean
  gift_message?: string | null
  recipient_email?: string | null
  created_at: string
  updated_at: string
}

export interface OrderCreationPayload {
  customer_email: string
  user_id?: string | null
  total_amount: number
  subtotal_amount?: number
  discount_amount?: number
  discount_code_id?: string | null
  status: string
  currency: string
  payment_method?: string | null
  is_gift?: boolean
  gift_message?: string | null
  recipient_email?: string | null
}

export interface DbOrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  updated_at: string
}

export interface OrderItemCreationPayload {
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface DbOrderWithItems extends DbOrder {
  order_items: DbOrderItem[]
}

export interface DbOrderItemWithProductInfo extends DbOrderItem {
  products: {
    id: string
    name: string
    description?: string
    requires_activation?: boolean
  } | null
}
export interface DbOrderWithFullDetails extends DbOrder {
  order_items: DbOrderItemWithProductInfo[]
}

// --- Types for Payments ---
export interface DbPayment {
  id: string
  order_id: string
  provider: string
  transaction_id: string | null
  amount: number
  currency: string
  crypto_amount?: number | null
  crypto_currency?: string | null
  status: string
  confirmations?: number | null
  payment_details?: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface PaymentCreationPayload {
  order_id: string
  provider: string
  transaction_id?: string | null
  amount: number
  currency: string
  crypto_amount?: number | null
  crypto_currency?: string | null
  status: string
  payment_details?: Record<string, any> | null
}

export interface PaymentUpdatePayload extends Partial<Omit<DbPayment, "id" | "order_id" | "created_at">> {}

// --- Types for Discount Codes ---
export type DiscountType = "percentage" | "fixed_amount"

export interface DbDiscountCode {
  id: string // UUID
  code: string // The actual discount code string (e.g., "SUMMER20") - should be unique
  type: DiscountType
  value: number // If percentage, 0-100. If fixed_amount, the amount in currency units (e.g., cents or smallest unit)
  min_purchase_amount?: number | null // Minimum purchase amount for the code to be valid (in currency units)
  max_uses?: number | null // Maximum number of times this code can be used in total
  uses_count: number // How many times this code has been used
  max_uses_per_user?: number | null // Maximum times a single user can use this code
  // To track per-user usage, you'd need a separate table: discount_code_usages (user_id, discount_code_id, count)
  valid_from?: string | null // Timestamp
  valid_until?: string | null // Timestamp
  is_active: boolean // General flag to enable/disable the code
  applicable_product_ids?: string[] | null // Array of product IDs this code applies to (null for all products)
  created_at: string
  updated_at: string
}

// Payload for creating a new discount code
export interface DiscountCodeCreationPayload
  extends Omit<DbDiscountCode, "id" | "uses_count" | "created_at" | "updated_at"> {
  // uses_count defaults to 0
}

// For validating a discount code, we might return the code and a status/reason
export type DiscountCodeValidationReason =
  | "not_found"
  | "inactive"
  | "expired"
  | "not_yet_valid"
  | "max_uses_reached"
  | "min_purchase_not_met"
  | "not_applicable_to_cart"
  | "user_limit_reached" // For max_uses_per_user

export interface ValidatedDiscountCode extends DbDiscountCode {
  isValid: boolean
  reason?: DiscountCodeValidationReason
  discountAmountCalculated?: number // The actual discount this code would provide for a given cart
}

// Context for validating a discount code against a cart
export interface DiscountCartContextItem {
  productId: string
  price: number // Price per unit
  quantity: number
}
export interface DiscountCartContext {
  currentCartAmount: number // Subtotal of the cart before discount
  cartItems: DiscountCartContextItem[]
  userId?: string | null // For per-user limit checks
}
