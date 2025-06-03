// FIXED: API route with proper error handling
import { NextResponse } from "next/server"
import { db } from "@/lib/supabase-database-fixed"
import { handleApiError, ApiError } from "@/lib/api-error-handler"

export async function GET(request: Request) {
  try {
    const { data: products, error } = await db.getAllProducts()

    if (error) {
      throw new ApiError(500, `Failed to fetch products: ${error}`)
    }

    if (!products || products.length === 0) {
      // Return fallback data structure
      return NextResponse.json({
        products: [],
        message: "No products found, using fallback data",
        fallback: true,
      })
    }

    return NextResponse.json({
      products,
      count: products.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// ADDED: POST method for creating products (admin only)
export async function POST(request: Request) {
  try {
    // TODO: Add authentication check
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "slug", "description", "price"]
    const missing = requiredFields.filter((field) => !body[field])

    if (missing.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missing.join(", ")}`)
    }

    // TODO: Implement product creation
    throw new ApiError(501, "Product creation not implemented yet")
  } catch (error) {
    return handleApiError(error)
  }
}
