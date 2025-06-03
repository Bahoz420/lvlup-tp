import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import {
  CACHE_TAG_REVIEWS,
  CACHE_TAG_REVIEW_RECENT,
  CACHE_TAG_REVIEW_FEATURED,
  getProductTag,
  getProductReviewsTag,
  combineTags,
} from "@/lib/cache-constants"
import { handleApiError, validateRequired, ApiError, validateUUID } from "@/lib/api-error-handler"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const featured = searchParams.get("featured") === "true"
    const recent = searchParams.get("recent") === "true"
    const minRating = searchParams.get("minRating") ? Number.parseInt(searchParams.get("minRating")!, 10) : undefined

    // Validate minRating if provided
    if (minRating !== undefined && (isNaN(minRating) || minRating < 1 || minRating > 5)) {
      throw new ApiError(400, "minRating must be a number between 1 and 5")
    }

    // Validate productId if provided
    if (productId) {
      try {
        validateUUID(productId, "Product ID")
      } catch (error) {
        throw new ApiError(400, "Invalid product ID format")
      }
    }

    const supabase = createClient()

    // Base query for reviews
    let query = supabase
      .from("reviews")
      .select(`
        id,
        created_at,
        product_id,
        user_name,
        rating,
        comment
      `)
      .order("created_at", { ascending: false })

    // Filter by product ID
    if (productId) {
      query = query.eq("product_id", productId)
    }

    // Filter by minimum rating
    if (minRating !== undefined) {
      query = query.gte("rating", minRating)
    }

    // Filter for featured reviews (Rating 5)
    if (featured) {
      query = query.eq("rating", 5)
    }

    // Filter for recent reviews (last 7 days)
    if (recent) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      query = query.gte("created_at", sevenDaysAgo)
    }

    const { data: reviews, error } = await query

    if (error) {
      throw new ApiError(500, "Failed to fetch reviews")
    }

    // Generate cache tags
    const cacheTags = [CACHE_TAG_REVIEWS]
    if (productId) {
      cacheTags.push(getProductTag(productId), getProductReviewsTag(productId))
    }
    if (featured) cacheTags.push(CACHE_TAG_REVIEW_FEATURED)
    if (recent) cacheTags.push(CACHE_TAG_REVIEW_RECENT)

    return NextResponse.json(
      {
        reviews: reviews || [],
        count: reviews?.length || 0,
        total: reviews?.length || 0,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=1800",
          "Cache-Tag": combineTags([...new Set(cacheTags)]),
        },
      },
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { product_id, user_name, rating, comment } = data

    // Validate required fields
    validateRequired(data, ["product_id", "user_name", "rating", "comment"])

    // Validate rating
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be a number between 1 and 5")
    }

    // Validate product_id format
    validateUUID(product_id, "Product ID")

    const supabase = createClient()

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", product_id)
      .single()

    if (productError || !product) {
      throw new ApiError(404, "Product not found")
    }

    // Add new review to database
    const { data: newReview, error: insertError } = await supabase
      .from("reviews")
      .insert({
        product_id,
        user_name,
        rating,
        comment,
      })
      .select()
      .single()

    if (insertError) {
      throw new ApiError(500, "Failed to submit review")
    }

    // Revalidate cache
    await revalidateReviewCaches(newReview)

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        review: newReview,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      },
    )
  } catch (error) {
    return handleApiError(error)
  }
}

async function revalidateReviewCaches(review: any) {
  try {
    const revalidateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`
    const token = process.env.REVALIDATE_TOKEN || "your-secret-token"

    const tags = [CACHE_TAG_REVIEWS, getProductTag(review.product_id), getProductReviewsTag(review.product_id)]

    if (review.rating === 5) {
      tags.push(CACHE_TAG_REVIEW_FEATURED)
    }

    for (const tag of tags) {
      await fetch(revalidateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-token": token,
        },
        body: JSON.stringify({ type: "tag", tag }),
      })
    }
  } catch (error) {
    console.error("Error revalidating review caches:", error)
  }
}
