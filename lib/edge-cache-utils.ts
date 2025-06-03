/**
 * Hilfsfunktionen für die Edge-Cache-Verwaltung
 */

// Revalidiere einen bestimmten Pfad im Edge-Cache
export async function purgeEdgeCachePath(path: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "your-secret-token",
      },
      body: JSON.stringify({
        type: "path",
        path,
      }),
    })

    if (!response.ok) {
      console.error("Failed to purge Edge Cache for path:", path, await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error("Error purging Edge Cache for path:", path, error)
    return false
  }
}

// Revalidiere einen bestimmten Tag im Edge-Cache
export async function purgeEdgeCacheTag(tag: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "your-secret-token",
      },
      body: JSON.stringify({
        type: "tag",
        tag,
      }),
    })

    if (!response.ok) {
      console.error("Failed to purge Edge Cache for tag:", tag, await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error("Error purging Edge Cache for tag:", tag, error)
    return false
  }
}

// Revalidiere einen bestimmten Produktstatus im Edge-Cache
export async function purgeProductStatusEdgeCache(productId: string): Promise<boolean> {
  try {
    // Revalidiere den produktspezifischen Tag
    const tagSuccess = await purgeEdgeCacheTag(`product-${productId}`)

    // Revalidiere den allgemeinen Status-Tag
    const statusSuccess = await purgeEdgeCacheTag("status")

    // Revalidiere den Produktpfad
    const pathSuccess = await purgeEdgeCachePath(`/products/${productId}`)

    return tagSuccess && statusSuccess && pathSuccess
  } catch (error) {
    console.error("Error purging Edge Cache for product status:", productId, error)
    return false
  }
}

// Revalidiere alle wichtigen Caches im Edge-Cache
export async function purgeAllEdgeCaches(): Promise<boolean> {
  try {
    const promises = [
      // Wichtige Pfade
      purgeEdgeCachePath("/"),
      purgeEdgeCachePath("/products"),
      purgeEdgeCachePath("/status"),

      // Wichtige Tags
      purgeEdgeCacheTag("products"),
      purgeEdgeCacheTag("status"),
      purgeEdgeCacheTag("all-products"),
    ]

    const results = await Promise.all(promises)

    return results.every(Boolean)
  } catch (error) {
    console.error("Error purging all Edge Caches:", error)
    return false
  }
}
