import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getProductTag, getProductStatusTag, combineTags } from "@/lib/cache-constants"
import { handleApiError, validateUUID, ApiError } from "@/lib/api-error-handler"

export const runtime = "edge"

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  try {
    const productId = params.productId

    // Validate productId format
    validateUUID(productId, "Product ID")

    const supabase = createClient()

    // Query product with status from database - fix the join with proper casting
    const { data: product, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        game,
        price,
        original_price,
        status
      `)
      .eq("id", productId)
      .single()

    if (error) {
      console.error("Database error:", error)
      throw new ApiError(404, "Product not found")
    }

    if (!product) {
      throw new ApiError(404, "Product not found")
    }

    // Get product status separately due to type casting issues
    const { data: statusData } = await supabase
      .from("product_status")
      .select("status, active_users, last_updated")
      .eq("product_id", productId)
      .single()

    // Get product features separately
    const { data: featuresData } = await supabase.from("product_features").select("feature").eq("product_id", productId)

    const features = featuresData?.map((pf) => pf.feature) || []

    const productData = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      status: statusData?.status || "offline",
      activeUsers: statusData?.active_users || 0,
      lastUpdated: statusData?.last_updated || new Date().toISOString(),
      game: product.game,
      price: product.price,
      originalPrice: product.original_price,
      productStatus: product.status,
      features,
    }

    return NextResponse.json(
      {
        success: true,
        product: productData,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=30, stale-while-revalidate=120",
          "Cache-Tag": combineTags([getProductTag(productId), getProductStatusTag(productId), "status"]),
        },
      },
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request, { params }: { params: { productId: string } }) {
  try {
    const productId = params.productId

    // Validate productId format
    validateUUID(productId, "Product ID")

    const data = await request.json()
    const { status, activeUsers, version } = data

    // Validate input data
    if (status && !["online", "offline", "updating"].includes(status)) {
      throw new ApiError(400, "Invalid status value. Must be 'online', 'offline', or 'updating'")
    }

    if (activeUsers !== undefined && (isNaN(Number(activeUsers)) || Number(activeUsers) < 0)) {
      throw new ApiError(400, "Active users must be a non-negative number")
    }

    const supabase = createClient()

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .single()

    if (productError || !product) {
      throw new ApiError(404, "Product not found")
    }

    // Update product version if provided
    if (version) {
      await supabase.from("products").update({ version }).eq("id", productId)
    }

    // Update or insert product status
    const statusUpdate = {
      product_id: productId,
      ...(status && { status }),
      ...(activeUsers !== undefined && { active_users: activeUsers }),
      last_updated: new Date().toISOString(),
    }

    const { error: statusError } = await supabase
      .from("product_status")
      .upsert(statusUpdate, { onConflict: "product_id" })

    if (statusError) {
      throw new ApiError(500, "Failed to update product status")
    }

    // Revalidate cache
    await revalidateProductCache(productId)

    return NextResponse.json({
      success: true,
      message: "Product status updated successfully",
    })
  } catch (error) {
    return handleApiError(error)
  }
}

async function revalidateProductCache(productId: string) {
  try {
    const revalidateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`
    const token = process.env.REVALIDATE_TOKEN || "your-secret-token"

    const tags = [`product-${productId}`, "status", `product-status-${productId}`]

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

    // Revalidate product page
    await fetch(revalidateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": token,
      },
      body: JSON.stringify({ type: "path", path: `/products/${productId}` }),
    })
  } catch (error) {
    console.error("Error revalidating cache:", error)
  }
}
