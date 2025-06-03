import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import type { ProductStatusData } from "./route"
import {
  CACHE_TAG_STATUS,
  CACHE_TAG_PRODUCTS,
  CACHE_TAG_STATUS_ONLINE,
  CACHE_TAG_STATUS_OFFLINE,
  CACHE_TAG_STATUS_UPDATING,
  CACHE_TAG_STATUS_MAINTENANCE,
  CACHE_TAG_STATUS_DETECTION_RISK,
  CACHE_TAG_STATUS_UPTIME,
  getProductTag,
  getProductStatusTag,
  combineTags,
  generateDeviceCacheTags,
} from "@/lib/cache-constants"

export type ProductStatus = "online" | "updating" | "offline" | "maintenance"

export interface SystemStatusData {
  productsOnline: number
  totalProducts: number
  uptime: number
  activeUsers: number
  detectionRisk: number
  lastUpdated: string
}

export interface StatusResponse {
  products: ProductStatusData[]
  system: SystemStatusData
}

// Konfiguriere diese Route als Edge-Funktion
export const runtime = "edge"

export async function GET(request: Request) {
  // URL-Parameter abrufen
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const status = searchParams.get("status")
  const minActiveUsers = searchParams.get("minActiveUsers")
    ? Number.parseInt(searchParams.get("minActiveUsers")!)
    : undefined
  const maxDetectionRisk = searchParams.get("maxDetectionRisk")
    ? Number.parseInt(searchParams.get("maxDetectionRisk")!)
    : undefined

  const supabase = createClient()

  try {
    // Produkte abrufen
    let query = supabase.from("products").select(`
      id,
      name,
      slug,
      description,
      price,
      sale_price,
      category,
      rating,
      review_count,
      image_url,
      version,
      created_at,
      updated_at,
      product_status (
        status,
        active_users,
        last_updated
      )
    `)

    // Filter anwenden
    if (category) {
      query = query.eq("category", category)
    }

    if (status) {
      query = query.eq("product_status.status", status)
    }

    // Daten abrufen
    const { data: products, error } = await query

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Produkte filtern
    let filteredProducts = [...products]

    if (minActiveUsers !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.product_status && p.product_status[0]?.active_users >= minActiveUsers,
      )
    }

    // Count products by status
    const productsOnline = filteredProducts.filter((p) => p.product_status && p.product_status[0]?.status === "online")
      .length
    const productsOffline = filteredProducts.filter((p) => p.product_status && p.product_status[0]?.status === "offline")
      .length
    const productsUpdating = filteredProducts.filter(
      (p) => p.product_status && p.product_status[0]?.status === "updating",
    ).length
    const productsMaintenance = filteredProducts.filter(
      (p) => p.product_status && p.product_status[0]?.status === "maintenance",
    ).length
    const totalProducts = filteredProducts.length

    // Calculate total active users
    const activeUsers = filteredProducts.reduce(
      (sum, p) => sum + (p.product_status && p.product_status[0]?.active_users ? p.product_status[0].active_users : 0),
      0,
    )

    // Berechne das Erkennungsrisiko basierend auf dem Status und der Anzahl der aktiven Benutzer
    const detectionRisk = 15 //calculateDetectionRisk(filteredProducts)

    // Generate system status data
    const systemStatus = {
      productsOnline,
      productsOffline,
      productsUpdating,
      productsMaintenance,
      totalProducts,
      uptime: 99.7, // Example value
      activeUsers,
      detectionRisk,
      lastUpdated: new Date().toISOString(),
    }

    // Generiere detaillierte Cache-Tags
    const cacheTags = [CACHE_TAG_STATUS, CACHE_TAG_PRODUCTS]

    // Füge Status-spezifische Tags hinzu
    if (productsOnline > 0) cacheTags.push(CACHE_TAG_STATUS_ONLINE)
    if (productsOffline > 0) cacheTags.push(CACHE_TAG_STATUS_OFFLINE)
    if (productsUpdating > 0) cacheTags.push(CACHE_TAG_STATUS_UPDATING)
    if (productsMaintenance > 0) cacheTags.push(CACHE_TAG_STATUS_MAINTENANCE)

    // Füge Erkennungsrisiko-Tag hinzu
    cacheTags.push(CACHE_TAG_STATUS_DETECTION_RISK)

    // Füge Uptime-Tag hinzu
    cacheTags.push(CACHE_TAG_STATUS_UPTIME)

    // Füge produkt-spezifische Status-Tags hinzu
    filteredProducts.forEach((product) => {
      cacheTags.push(getProductTag(product.id))
      cacheTags.push(getProductStatusTag(product.id))
    })

    // Füge kategorie-spezifische Tags hinzu
    if (category) {
      cacheTags.push(`product-category-${category.toLowerCase()}`)
    }

    // Füge gerätespezifische Tags hinzu, wenn User-Agent verfügbar ist
    const userAgent = request.headers.get("user-agent") || ""
    if (userAgent) {
      const deviceTags = generateDeviceCacheTags(userAgent)
      cacheTags.push(...deviceTags)
    }

    // Entferne Duplikate
    const uniqueTags = [...new Set(cacheTags)]

    return NextResponse.json(
      {
        products: filteredProducts.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          status: product.product_status[0]?.status,
          activeUsers: product.product_status[0]?.active_users,
          lastUpdated: product.product_status[0]?.last_updated,
          category: product.category,
          version: product.version,
          features: [],
        })),
        system: systemStatus,
        filters: {
          category,
          status,
          minActiveUsers,
          maxDetectionRisk,
        },
      },
      {
        headers: {
          // Nur 60 Sekunden frischer Cache, dann bis zu 5 Minuten stale-while-revalidate
          "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
          // Cache-Tags für gezielte Invalidierung
          "Cache-Tag": combineTags(uniqueTags),
          // Vercel-spezifische Edge-Cache-Header
          "Vercel-CDN-Cache-Control": "max-age=60, stale-while-revalidate=300",
          "CDN-Cache-Control": "max-age=60",
          "Vercel-Edge-Cache-Tag": combineTags(uniqueTags),
        },
      },
    )
  } catch (error) {
    console.error("Error fetching system status:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch system status" }, { status: 500 })
  }
}
