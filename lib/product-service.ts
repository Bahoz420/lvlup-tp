import { createClient } from "@/utils/supabase/server"
import type { ProductStatus } from "@/types/product"

// Types for our status API
export interface ProductStatusData {
  id: string
  name: string
  slug: string
  status: ProductStatus
  category: string
  version: string
  lastUpdated: string
  activeUsers: number
  features: string[]
}

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

export interface ProductResponse {
  success: boolean
  product: ProductStatusData
}

export interface SystemStatus {
  productsOnline: number
  totalProducts: number
  uptime: number
  activeUsers: number
  detectionRisk: number
  lastUpdated: string
}

// Function to fetch all status data
export async function getProductStatuses(): Promise<StatusResponse> {
  const supabase = createClient() // Use the standard Supabase client

  try {
    // Fetch products from Supabase
    const { data: products, error } = await supabase.from("products").select(`
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

    if (error) {
      console.error("Error fetching products from Supabase:", error)
      // Fall back to mock data if Supabase fails
      return getMockProductStatuses()
    }

    // Transform Supabase data to match expected format
    const transformedProducts: ProductStatusData[] =
      products?.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        status: product.product_status?.[0]?.status || "offline",
        category: product.category,
        version: product.version || "v1.0.0",
        lastUpdated: product.product_status?.[0]?.last_updated || product.updated_at,
        activeUsers: product.product_status?.[0]?.active_users || 0,
        features: product.product_features?.map((f) => f.feature) || [],
      })) || []

    const system: SystemStatus = {
      productsOnline: transformedProducts.filter((p) => p.status === "online").length,
      totalProducts: transformedProducts.length,
      uptime: 99.7,
      activeUsers: transformedProducts.reduce((acc, p) => acc + p.activeUsers, 0),
      detectionRisk: 15,
      lastUpdated: new Date().toISOString(),
    }

    return { products: transformedProducts, system }
  } catch (error) {
    console.error("Unexpected error fetching products:", error)
    return getMockProductStatuses()
  }
}

// Fallback mock data function
function getMockProductStatuses(): StatusResponse {
  const products: ProductStatusData[] = [
    {
      id: "fortnite",
      name: "lvlup Fortnite",
      slug: "fortnite",
      status: "online",
      category: "BATTLE ROYALE",
      version: "v2.3.0",
      lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      activeUsers: 476,
      features: ["Aimbot", "ESP", "Radar Hack", "HWID Spoofer"],
    },
    {
      id: "valorant",
      name: "lvlup Valorant",
      slug: "valorant",
      status: "online",
      category: "FPS",
      version: "v1.8.5",
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      activeUsers: 389,
      features: ["Aimbot", "Wallhack", "Triggerbot", "Anti-Recoil"],
    },
    {
      id: "apex-legends",
      name: "lvlup Apex Legends",
      slug: "apex-legends",
      status: "updating",
      category: "BATTLE ROYALE",
      version: "v1.5.2",
      lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      activeUsers: 215,
      features: ["Aimbot", "ESP", "Item ESP", "No Recoil"],
    },
    {
      id: "warzone",
      name: "lvlup Warzone",
      slug: "warzone",
      status: "online",
      category: "BATTLE ROYALE",
      version: "v2.1.0",
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      activeUsers: 312,
      features: ["Aimbot", "ESP", "Radar", "Unlock All"],
    },
    {
      id: "pubg",
      name: "lvlup PUBG",
      slug: "pubg",
      status: "online",
      category: "BATTLE ROYALE",
      version: "v1.9.3",
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      activeUsers: 198,
      features: ["Aimbot", "ESP", "Magic Bullet", "Speed Hack"],
    },
    {
      id: "rust",
      name: "lvlup Rust",
      slug: "rust",
      status: "offline",
      category: "SURVIVAL",
      version: "v1.4.7",
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      activeUsers: 0,
      features: ["ESP", "Aimbot", "No Recoil", "Admin Tools"],
    },
  ]

  const system: SystemStatus = {
    productsOnline: products.filter((p) => p.status === "online").length,
    totalProducts: products.length,
    uptime: 99.7,
    activeUsers: products.reduce((acc, p) => acc + p.activeUsers, 0),
    detectionRisk: 15,
    lastUpdated: new Date().toISOString(),
  }

  return { products, system }
}

// Format relative time for display
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return `${diffSecs} seconds ago`
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
  } else {
    return date.toLocaleDateString()
  }
}
