export type ProductStatus = "online" | "offline" | "maintenance" | "beta"

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image_url: string
  category?: string
  created_at?: string // Consider making these non-nullable if they always exist
  updated_at?: string // Consider making these non-nullable if they always exist
  subscription_duration_days?: number // Example: if this is a direct column
}

export interface CartItem {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
  subscription: string
}

export interface ProductWithDetails extends Product {
  long_description?: string
  requirements?: string[]
  faq?: ProductFAQ[]
  reviews?: ProductReview[]
  related_products?: Product[]
}

export interface ProductFAQ {
  question: string
  answer: string
}

export interface ProductReview {
  id: string
  user_name: string // This might be joined or part of the review table
  rating: number
  comment: string
  date: string // Or Date
  created_at: string // If different from 'date'
  user_id?: string // Add if it's selected
}

export interface ProductFilterOptions {
  category?: string
  status?: ProductStatus
  minPrice?: number
  maxPrice?: number
  search?: string
}

export interface ProductSortOptions {
  field: "price" | "name" | "created_at"
  direction: "asc" | "desc"
}
