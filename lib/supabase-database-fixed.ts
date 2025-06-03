import { createClient } from "@/utils/supabase/server"

// Simple error handling without complex inheritance
class DatabaseError extends Error {
  constructor(
    message: string,
    public originalError?: any,
  ) {
    super(message)
    this.name = "DatabaseError"
  }
}

// Simplified error handling function
function handleError(error: any, operation: string): never {
  console.error(`Database error in ${operation}:`, error)
  throw new DatabaseError(`${operation} failed: ${error.message || "Unknown error"}`)
}

export const db = {
  async getAllProducts() {
    try {
      const supabase = createClient()

      // Get products first
      const { data: products, error: productsError } = await supabase.from("products").select("*").order("name")

      if (productsError) {
        handleError(productsError, "getAllProducts - products")
      }

      if (!products || products.length === 0) {
        return { data: [], error: null }
      }

      // Get all product features
      const { data: features } = await supabase.from("product_features").select("product_id, feature")

      // Get all product statuses
      const { data: statuses } = await supabase
        .from("product_status")
        .select("product_id, status, active_users, last_updated")

      // Combine the data manually
      const enrichedProducts = products.map((product) => ({
        ...product,
        product_features: features?.filter((f) => f.product_id === product.id) || [],
        product_status: statuses?.filter((s) => s.product_id === product.id) || [],
      }))

      return { data: enrichedProducts, error: null }
    } catch (error) {
      console.error("getAllProducts error:", error)
      return { data: [], error: error.message || "Failed to fetch products" }
    }
  },

  async getProductBySlug(slug: string) {
    try {
      const supabase = createClient()

      // Get the main product
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single()

      if (productError) {
        handleError(productError, "getProductBySlug - product")
      }

      if (!product) {
        return { data: null, error: "Product not found" }
      }

      // Get product features
      const { data: features } = await supabase.from("product_features").select("feature").eq("product_id", product.id)

      // Get product status
      const { data: status } = await supabase
        .from("product_status")
        .select("status, active_users, last_updated")
        .eq("product_id", product.id)
        .single()

      // Combine the data
      const enrichedProduct = {
        ...product,
        product_features: features || [],
        product_status: status ? [status] : [],
      }

      return { data: enrichedProduct, error: null }
    } catch (error) {
      console.error("getProductBySlug error:", error)
      return { data: null, error: error.message || "Failed to fetch product" }
    }
  },

  async getProductById(id: string) {
    try {
      const supabase = createClient()

      // Get the main product
      const { data: product, error: productError } = await supabase.from("products").select("*").eq("id", id).single()

      if (productError) {
        handleError(productError, "getProductById - product")
      }

      if (!product) {
        return { data: null, error: "Product not found" }
      }

      // Get product features
      const { data: features } = await supabase.from("product_features").select("feature").eq("product_id", product.id)

      // Get product status
      const { data: status } = await supabase
        .from("product_status")
        .select("status, active_users, last_updated")
        .eq("product_id", product.id)
        .single()

      // Combine the data
      const enrichedProduct = {
        ...product,
        product_features: features || [],
        product_status: status ? [status] : [],
      }

      return { data: enrichedProduct, error: null }
    } catch (error) {
      console.error("getProductById error:", error)
      return { data: null, error: error.message || "Failed to fetch product" }
    }
  },

  // Test database connection
  async testConnection() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("products").select("count").limit(1)

      if (error) {
        return { data: null, error: error.message }
      }

      return { data: "Connection successful", error: null }
    } catch (error) {
      return { data: null, error: error.message || "Connection failed" }
    }
  },
}
