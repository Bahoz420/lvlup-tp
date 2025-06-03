import type { ProductStatus, CartItem } from "./product"

// Discount-bezogene Typen
export interface DiscountCodeInfo {
  code: string
  type: "percent" | "fixed"
  value: number
  discount: number
  minPurchase?: number
  maxUses?: number
  currentUses?: number
  expiresAt?: string
}

export interface DiscountCode {
  id: string
  code: string
  description?: string
  discount_percent: number | null
  discount_amount: number | null
  min_order_amount: number | null
  max_uses: number | null
  current_uses: number
  is_active: boolean
  starts_at: string | null
  expires_at: string | null
  created_at: string
}

export interface DiscountValidationResult {
  valid: boolean
  message?: string
  discountCode?: DiscountCode
  discountAmount?: number
  type?: "percent" | "fixed"
  value?: number
}

// Order-bezogene Typen
export interface OrderOptions {
  recipientEmail?: string
  discountCode?: string
  discountAmount?: number
  isGift?: boolean
}

export interface OrderResult {
  success: boolean
  message?: string
  orderId?: string // This is likely the order_number
  redirectTo?: string
}

// This Order type is more of an application-level representation, including items.
// For DB direct interaction, we'll use DbOrder.
export interface Order {
  id: string // UUID
  order_number: string // User-facing order identifier
  customer_email: string
  user_id?: string | null // If linked to a registered user
  total_amount: number
  discount_amount?: number
  discount_code?: string | null
  status: string // e.g., 'pending', 'paid', 'failed', 'completed', 'refunded'
  currency: string // e.g., 'EUR', 'USD'
  payment_method?: string | null
  is_gift: boolean
  gift_message?: string | null
  recipient_email?: string | null
  created_at: string // Timestamp
  updated_at: string // Timestamp
  items: OrderItem[] // Related order items
}

export interface OrderItem {
  id: string // UUID
  order_id: string // Foreign key to orders table
  product_id: string // Foreign key to products table
  product_name: string // Denormalized for convenience
  quantity: number
  unit_price: number // Price per unit at the time of purchase
  total_price: number // quantity * unit_price
  created_at: string // Timestamp
  // Potentially other fields like 'subscription_type' if applicable at item level
}

// Checkout related types
export interface CheckoutFormData {
  email: string
  recipientEmail?: string
  discountCode?: string
  isGift: boolean
  cartItems: CartItem[]
}

export interface OrderConfirmation {
  orderId: string
  email: string
  recipientEmail: string
  cartItems: CartItem[]
  originalPrice: number
  finalPrice: number
  discountAmount: number
  discountCode?: string
  isGift: boolean
}

// API-bezogene Typen
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// UI-bezogene Typen
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export interface PaginationOptions {
  page: number
  limit: number
  total: number
}

export interface SortOption {
  label: string
  value: string
  direction: "asc" | "desc"
}

export interface SortOptions {
  field: string
  direction: "asc" | "desc"
}

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface FilterOptions {
  [key: string]: string | number | boolean | null
}

// Event-Handler-Typen
export type DiscountCodeApplyHandler = (info: DiscountCodeInfo) => void

export type GiftOptionChangeHandler = (isGift: boolean, email: string | null) => void

// Status-bezogene Typen
export interface ProductStatusInfo {
  status: ProductStatus
  active_users: number
  last_updated: string // Consider Date
}

export interface SystemStatusInfo {
  productsOnline: number
  totalProducts: number
  uptime: number
  activeUsers: number
  detectionRisk: number
  lastUpdated: string
}

// User-bezogene Typen
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  last_sign_in_at?: string | null
  full_name?: string | null
  avatar_url?: string | null
}

export interface UserCreationPayload {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

export interface UserUpdatePayload {
  full_name?: string
  avatar_url?: string
}
