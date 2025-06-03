import { type NextRequest, NextResponse } from "next/server"

// Sicherer Token für die Authentifizierung der Webhook-Anfragen
// In einer echten Anwendung sollte dieser in einer Umgebungsvariable gespeichert werden
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "your-webhook-secret"

export async function POST(request: NextRequest) {
  try {
    // Überprüfe den Authentifizierungstoken
    const token = request.headers.get("x-webhook-token")

    if (token !== WEBHOOK_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { productId, event, data } = await request.json()

    if (!productId || !event) {
      return NextResponse.json({ success: false, message: "Product ID and event are required" }, { status: 400 })
    }

    // Führe verschiedene Aktionen basierend auf dem Ereignistyp durch
    switch (event) {
      case "product.updated":
        await invalidateProductCache(productId)
        break
      case "product.created":
        await invalidateProductsListCache()
        break
      case "product.deleted":
        await invalidateProductsListCache()
        await invalidateProductCache(productId)
        break
      case "status.updated":
        await invalidateStatusCache(productId)
        break
      default:
        return NextResponse.json({ success: false, message: "Unknown event type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Cache invalidated for ${event} event on product ${productId}`,
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { success: false, message: "Webhook processing failed", error: (error as Error).message },
      { status: 500 },
    )
  }
}

// Hilfsfunktion zur Invalidierung des Caches für ein bestimmtes Produkt
async function invalidateProductCache(productId: string) {
  try {
    // Revalidiere den Cache für dieses Produkt
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "your-secret-token",
      },
      body: JSON.stringify({
        type: "tag",
        tag: `product-${productId}`,
      }),
    })

    // Revalidiere die Produktseite
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "your-secret-token",
      },
      body: JSON.stringify({
        type: "path",
        path: `/products/${productId}`,
      }),
    })
  } catch (error) {
    console.error("Error invalidating product cache:", error)
    throw error
  }
}

// Hilfsfunktion zur Invalidierung des Caches für die Produktliste
async function invalidateProductsListCache() {
  try {
    // Revalidiere den Cache für die Produktliste
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "your-secret-token",
      },
      body: JSON.stringify({
        type: "tag",
        tag: "products",
      }),
    })

    // Revalidiere die Produktseite
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "your-secret-token",
      },
      body: JSON.stringify({
        type: "path",
        path: "/products",
      }),
    })
  } catch (error) {
    console.error("Error invalidating products list cache:", error)
    throw error
  }
}

// Hilfsfunktion zur Invalidierung des Caches für den Status
async function invalidateStatusCache(productId: string) {
  try {
    // Revalidiere den Cache für den Status dieses Produkts
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "your-secret-token",
      },
      body: JSON.stringify({
        type: "tag",
        tag: `product-${productId}`,
      }),
    })

    // Revalidiere den allgemeinen Status-Cache
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "your-secret-token",
      },
      body: JSON.stringify({
        type: "tag",
        tag: "status",
      }),
    })
  } catch (error) {
    console.error("Error invalidating status cache:", error)
    throw error
  }
}
