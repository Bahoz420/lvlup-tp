export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const { searchParams } = new URL(request.url)

    // Filter-Parameter
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : 0
    const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : 1000
    const minRating = searchParams.get("minRating") ? Number.parseFloat(searchParams.get("minRating")!) : 0
    const status = searchParams.get("status") || ""
    const features = searchParams.get("features")?.split(",").filter(Boolean) || []
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    // Basis-Query
    let query = supabase.from("products").select(`
        *,
        product_status (
          status,
          active_users,
          last_updated
        ),
        product_features (
          feature
        )
      `)

    // Filter anwenden
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq("category", category)
    }

    if (status) {
      query = query.eq("product_status.status", status)
    }

    // Daten abrufen
    const { data: products, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Client-seitige Filter (für komplexere Logik)
    let filteredProducts = products || []

    // Preis-Filter
    filteredProducts = filteredProducts.filter((product) => {
      const price = Number.parseFloat(product.price)
      return price >= minPrice && price <= maxPrice
    })

    // Rating-Filter
    filteredProducts = filteredProducts.filter((product) => {
      const rating = Number.parseFloat(product.rating || "0")
      return rating >= minRating
    })

    // Features-Filter
    if (features.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const productFeatures = product.product_features?.map((f) => f.feature.toLowerCase()) || []
        return features.some((feature) => productFeatures.some((pf) => pf.includes(feature.toLowerCase())))
      })
    }

    // Sortierung
    filteredProducts.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "price":
          aValue = Number.parseFloat(a.price)
          bValue = Number.parseFloat(b.price)
          break
        case "rating":
          aValue = Number.parseFloat(a.rating || "0")
          bValue = Number.parseFloat(b.rating || "0")
          break
        case "created_at":
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        case "popularity":
          aValue = a.product_status?.[0]?.active_users || 0
          bValue = b.product_status?.[0]?.active_users || 0
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (sortOrder === "desc") {
        return aValue < bValue ? 1 : -1
      }
      return aValue > bValue ? 1 : -1
    })

    // Statistiken für Filter
    const stats = {
      totalProducts: filteredProducts.length,
      priceRange: {
        min: Math.min(...filteredProducts.map((p) => Number.parseFloat(p.price))),
        max: Math.max(...filteredProducts.map((p) => Number.parseFloat(p.price))),
      },
      categories: [...new Set(products?.map((p) => p.category).filter(Boolean))],
      availableFeatures: [...new Set(products?.flatMap((p) => p.product_features?.map((f) => f.feature) || []))],
      statusCounts: {
        online: filteredProducts.filter((p) => p.product_status?.[0]?.status === "online").length,
        offline: filteredProducts.filter((p) => p.product_status?.[0]?.status === "offline").length,
        maintenance: filteredProducts.filter((p) => p.product_status?.[0]?.status === "maintenance").length,
      },
    }

    return NextResponse.json({
      products: filteredProducts,
      stats,
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        minRating,
        status,
        features,
        sortBy,
        sortOrder,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
