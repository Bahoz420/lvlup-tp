export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-supabase"
import { db } from "@/lib/supabase-database"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Demo mode for testing
    if (user.id === "demo-user") {
      return NextResponse.json({
        products: [
          {
            id: "demo-product-1",
            name: "CS2 Premium Cheats",
            description: "Advanced aimbot and wallhack features",
            game: "Counter-Strike 2",
            image_url: "/placeholder.svg?height=200&width=300",
            download_url: "#",
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            software_username: "demo_user",
            software_password: "demo_password",
            is_active: true,
          },
          {
            id: "demo-product-2",
            name: "Valorant Hack Suite",
            description: "Complete Valorant cheat package",
            game: "Valorant",
            image_url: "/placeholder.svg?height=200&width=300",
            download_url: "#",
            expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            software_username: "demo_user",
            software_password: "demo_password",
            is_active: true,
          },
        ],
      })
    }

    // Get user's products from database
    const { data: products, error } = await db.getUserProducts(user.id)

    if (error) {
      console.error("Error fetching user products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json({ products: products || [] })
  } catch (error) {
    console.error("Error fetching user products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
