import { NextResponse } from "next/server"
import { db } from "@/lib/supabase-database" // Assuming this uses the server client

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  if (!slug) {
    return new NextResponse("Missing slug", { status: 400 })
  }

  try {
    const { data: product, error } = await db.getProductBySlug(slug as string)

    if (error) {
      console.error("Error fetching product by slug:", error.message)
      // It's better to return a generic error message to the client for security
      return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (e: any) {
    console.error("Unexpected error in GET /api/products/[slug]:", e.message)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
