export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  try {
    // Supabase-Client erstellen
    const supabase = createClient()

    // Einfache Abfrage ohne Joins oder komplexe Beziehungen
    const { data, error } = await supabase.from("products").select("*")

    if (error) {
      console.error("Database query error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Minimale Datenverarbeitung
    const products = data.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      sale_price: product.sale_price,
      category: product.category,
      image_url: product.image_url,
      created_at: product.created_at,
      status: { status: "online" }, // Standardwert für Status
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Unexpected error in admin products API:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
