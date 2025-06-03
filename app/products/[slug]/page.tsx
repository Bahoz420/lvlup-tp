// This is the new Server Component
import { notFound } from "next/navigation"
import ProductDetailClient from "./product-detail-client"
import { getSupabaseServerClient } from "@/lib/supabase" // Fixed import
import type { Product, ProductWithDetails, ProductStatus, ProductReview } from "@/types/product"

// Move data fetching functions here or import from a lib
async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  try {
    const supabaseServer = getSupabaseServerClient()
    console.log("Server: Searching for product with slug:", slug)

    const { data: productData, error: productError } = await supabaseServer
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single() // Use .single() if slug is unique

    if (productError && productError.code !== "PGRST116") {
      // PGRST116: no rows found
      console.error("Server: Error fetching product:", productError)
      // Optionally, throw error to be caught by error.tsx or return null for notFound
    }

    if (!productData) {
      console.log("Server: No product found for slug:", slug)
      return null
    }

    const product = productData
    console.log("Server: Found product:", product)

    // Fetch product features
    const { data: features, error: featuresError } = await supabaseServer
      .from("product_features")
      .select("feature")
      .eq("product_id", product.id)
    if (featuresError) console.error("Server: Error fetching product features:", featuresError)

    // Fetch product status
    const { data: status, error: statusError } = await supabaseServer
      .from("product_status")
      .select("status, active_users, last_updated")
      .eq("product_id", product.id)
      .single()
    if (statusError && statusError.code !== "PGRST116")
      console.error("Server: Error fetching product status:", statusError)

    // Fetch reviews (if you have a reviews table)
    const { data: reviewsData, error: reviewsError } = await supabaseServer
      .from("reviews")
      .select("id, user_name, rating, comment, created_at")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false })
      .limit(5)
    if (reviewsError) console.error("Server: Error fetching reviews:", reviewsError)

    // Convert price to number if it's a string
    const price = typeof product.price === "string" ? Number.parseFloat(product.price) : product.price

    // Map reviews to the correct format
    const mappedReviews: ProductReview[] = reviewsData
      ? reviewsData.map((r) => ({
          id: r.id.toString(),
          user_name: r.user_name,
          rating: r.rating,
          comment: r.comment,
          date: r.created_at,
        }))
      : []

    // Return product with additional details
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      long_description: product.description || "", // Use description as long_description if not available
      price: price,
      sale_price: product.original_price ? Number(product.original_price) : undefined,
      image_url: product.image_url || "/placeholder.svg?height=400&width=400",
      status: (status?.status as ProductStatus) || "offline",
      category: product.game || "",
      rating: 4.8, // Default rating if not available
      review_count: 120, // Default review count if not available
      version: "v2.0", // Default version if not available
      created_at: product.created_at,
      updated_at: product.updated_at,
      features: features?.map((f) => f.feature) || [],
      reviews: mappedReviews,
    }
  } catch (error) {
    console.error("Server: Unexpected error in getProductBySlug:", error)
    return null
  }
}

async function getRelatedProducts(currentProductId: string, category?: string): Promise<Product[]> {
  try {
    const supabaseServer = getSupabaseServerClient()
    let query = supabaseServer
      .from("products")
      .select("id, name, slug, description, price, image_url")
      .neq("id", currentProductId)
      .limit(3)

    if (category) {
      query = query.eq("game", category)
    }

    const { data, error } = await query
    if (error) {
      console.error("Server: Error fetching related products:", error)
      return []
    }

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      price: typeof p.price === "string" ? Number.parseFloat(p.price) : p.price,
      image_url: p.image_url || "/placeholder.svg?height=200&width=300",
      status: "online" as ProductStatus, // Assuming default, or fetch status if needed
      rating: 4.5, // Default rating
      review_count: 100, // Default review count
    }))
  } catch (error) {
    console.error("Server: Unexpected error in getRelatedProducts:", error)
    return []
  }
}

export default async function ProductPageServer({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category)

  // Don't include Navigation here - it should only be in the layout
  return <ProductDetailClient product={product} relatedProducts={relatedProducts} slug={params.slug} />
}
