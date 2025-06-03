import type { ProductStatus } from "@/app/api/status/route"

// Types for our status API
export interface ProductStatusData {
  id: string
  name: string
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

// Function to fetch all status data
export async function fetchStatusData(): Promise<StatusResponse> {
  const response = await fetch("/api/status", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch status data")
  }

  return response.json()
}

// Function to fetch a specific product's status
export async function fetchProductStatus(productId: string): Promise<ProductResponse> {
  const response = await fetch(`/api/status/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch product status")
  }

  return response.json()
}

// Function to update a product's status
export async function updateProductStatus(
  productId: string,
  data: {
    status?: ProductStatus
    activeUsers?: number
    version?: string
  },
): Promise<ProductResponse> {
  const response = await fetch(`/api/status/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update product status")
  }

  return response.json()
}

// Function to update system status
export async function updateSystemStatus(
  data: Partial<SystemStatusData>,
): Promise<{ success: boolean; message: string; system: SystemStatusData }> {
  const response = await fetch("/api/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ system: data }),
  })

  if (!response.ok) {
    throw new Error("Failed to update system status")
  }

  return response.json()
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
