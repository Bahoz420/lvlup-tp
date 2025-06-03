import { NextResponse } from "next/server"
import { db } from "@/lib/supabase-database"

export async function GET(request: Request) {
  try {
    const { data: products, error } = await db.getAllProducts()
    if (error) {
      // Handle error appropriately
      return NextResponse.json({ message: "Failed to fetch products", error: error.message }, { status: 500 })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
