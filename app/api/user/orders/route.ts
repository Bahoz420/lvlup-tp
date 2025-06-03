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
        orders: [
          {
            id: "demo-order-1",
            order_number: "ORD-20231201-0001",
            total_amount: 29.99,
            currency: "BTC",
            status: "confirmed",
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "demo-order-2",
            order_number: "ORD-20231115-0002",
            total_amount: 49.99,
            currency: "ETH",
            status: "confirmed",
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      })
    }

    // Get user's orders from database
    const { data: orders, error } = await db.getOrdersByUser(user.id)

    if (error) {
      console.error("Error fetching user orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
