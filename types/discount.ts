// types/discount.ts

export type DiscountType = "percentage" | "fixed_amount" // Add other types if present in discount_codes.discount_type

// Represents the structure of the discount_codes table in the user's DB
export interface DiscountCode {
  id: string // uuid
  code: string // character varying
  description?: string | null // text
  discount_type: DiscountType // character varying
  discount_value: number // numeric
  minimum_amount?: number | null // numeric
  maximum_uses?: number | null // integer
  current_uses: number // integer, defaults to 0
  is_active: boolean // boolean, defaults to true
  expires_at?: string | null // timestamp with time zone
  created_at: string // timestamp with time zone
  created_by_admin_id?: string | null // uuid
  // updated_at is likely managed by a DB trigger, not explicitly in this type unless needed
}

// For creating a new discount code
export interface DiscountCodeCreateInput {
  code: string
  description?: string | null
  discount_type: DiscountType
  discount_value: number
  minimum_amount?: number | null
  maximum_uses?: number | null
  current_uses?: number // Optional, defaults to 0
  is_active?: boolean // Optional, defaults to true
  expires_at?: string | null
  created_by_admin_id?: string | null
}

// For updating an existing discount code
export interface DiscountCodeUpdateInput extends Partial<Omit<DiscountCodeCreateInput, "code">> {
  // code might be updatable or not, depending on policy.
  // id is used to find the record, not in the update payload itself usually.
  is_active?: boolean
  current_uses?: number
}

// Represents the structure of the discount_code_usages table
export interface DiscountCodeUsage {
  id: string // uuid
  discount_code_id: string // uuid
  order_id: string // uuid
  customer_email?: string | null // text
  amount: number // numeric, likely the discounted amount for this usage
  created_at: string // timestamp with time zone
  // user_id is not in the user's schema for this table
}

export interface DiscountCodeUsageCreateInput {
  discount_code_id: string
  order_id: string
  customer_email?: string | null
  amount: number // The actual amount discounted for this specific usage
}

// Result from validating a discount code
export interface DiscountValidationResult {
  valid: boolean
  message?: string
  error?: string // More specific error message
  discountCode?: DiscountCode // The validated discount code details
  discountAmount?: number // Calculated discount amount for the current context
  // Removed scope-related fields as they are not in the user's schema
}

// For fetching discount codes with filters
export interface DiscountCodeFilter {
  status?: "active" | "inactive" | "scheduled" | "expired" | "used_up"
  search?: string // Search by code or description
  sortBy?: keyof DiscountCode | string // Allow string for custom sort fields
  sortDirection?: "asc" | "desc"
  page?: number
  limit?: number
  // Removed scope filter
  startDate?: string // Filter by created_at
  endDate?: string // Filter by created_at
  minUses?: number
  maxUses?: number
}

// For discount code statistics
export interface DiscountCodeStats {
  total_uses: number
  total_discount_amount: number // Sum of 'amount' from discount_code_usages
  average_discount_per_use: number
  // most_used_with_product is not directly supportable without product_id in usages
  usage_by_date: Array<{ date: string; count: number; total_amount_discounted: number }>
}

export interface BulkActionResult {
  success: boolean
  message: string
  successCount: number
  failureCount: number
  failedItems: string[] // IDs of items that failed
}
