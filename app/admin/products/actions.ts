"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// Produkt löschen
export async function deleteProduct(id: string) {
  const supabase = createClient()

  // Zuerst die zugehörigen Einträge in product_features löschen
  await supabase.from("product_features").delete().eq("product_id", id)

  // Dann die zugehörigen Einträge in product_status löschen
  await supabase.from("product_status").delete().eq("product_id", id)

  // Schließlich das Produkt selbst löschen
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    throw new Error(`Failed to delete product: ${error.message}`)
  }

  // Cache invalidieren
  revalidatePath("/admin/products")
  revalidatePath("/products")

  return { success: true }
}

// Produktstatus aktualisieren
export async function updateProductStatus(id: string, status: "online" | "offline" | "maintenance" | "beta") {
  const supabase = createClient()

  // Prüfen, ob bereits ein Status-Eintrag existiert
  const { data: existingStatus } = await supabase.from("product_status").select("*").eq("product_id", id).single()

  if (existingStatus) {
    // Status aktualisieren
    const { error } = await supabase
      .from("product_status")
      .update({
        status,
        last_updated: new Date().toISOString(),
      })
      .eq("product_id", id)

    if (error) {
      console.error("Error updating product status:", error)
      throw new Error(`Failed to update product status: ${error.message}`)
    }
  } else {
    // Neuen Status erstellen
    const { error } = await supabase.from("product_status").insert({
      product_id: id,
      status,
      active_users: 0,
      last_updated: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating product status:", error)
      throw new Error(`Failed to create product status: ${error.message}`)
    }
  }

  // Cache invalidieren
  revalidatePath("/admin/products")
  revalidatePath("/products")
  revalidatePath(`/products/[slug]`)

  return { success: true }
}

// Produkt erstellen
export async function createProduct(formData: FormData) {
  const supabase = createClient()

  // Produktdaten aus dem Formular extrahieren
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const longDescription = formData.get("longDescription") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const salePrice = formData.get("salePrice") ? Number.parseFloat(formData.get("salePrice") as string) : null
  const category = formData.get("category") as string
  const imageUrl = formData.get("imageUrl") as string
  const version = formData.get("version") as string
  const status = formData.get("status") as "online" | "offline" | "maintenance" | "beta"

  // Features aus dem Formular extrahieren
  const featuresString = formData.get("features") as string
  const features = featuresString ? featuresString.split("\n").filter((f) => f.trim() !== "") : []

  // Produkt erstellen
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description,
      long_description: longDescription,
      price,
      sale_price: salePrice,
      category,
      image_url: imageUrl,
      version,
      rating: 0,
      review_count: 0,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating product:", error)
    throw new Error(`Failed to create product: ${error.message}`)
  }

  // Features hinzufügen
  if (features.length > 0) {
    const featuresData = features.map((feature) => ({
      product_id: product.id,
      feature,
    }))

    const { error: featuresError } = await supabase.from("product_features").insert(featuresData)

    if (featuresError) {
      console.error("Error adding product features:", featuresError)
      // Wir werfen hier keinen Fehler, da das Produkt bereits erstellt wurde
    }
  }

  // Status hinzufügen
  const { error: statusError } = await supabase.from("product_status").insert({
    product_id: product.id,
    status,
    active_users: 0,
    last_updated: new Date().toISOString(),
  })

  if (statusError) {
    console.error("Error adding product status:", statusError)
    // Wir werfen hier keinen Fehler, da das Produkt bereits erstellt wurde
  }

  // Cache invalidieren
  revalidatePath("/admin/products")
  revalidatePath("/products")

  return { success: true, id: product.id }
}

// Produkt aktualisieren
export async function updateProduct(id: string, formData: FormData) {
  const supabase = createClient()

  // Produktdaten aus dem Formular extrahieren
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const longDescription = formData.get("longDescription") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const salePrice = formData.get("salePrice") ? Number.parseFloat(formData.get("salePrice") as string) : null
  const category = formData.get("category") as string
  const imageUrl = formData.get("imageUrl") as string
  const version = formData.get("version") as string
  const status = formData.get("status") as "online" | "offline" | "maintenance" | "beta"

  // Features aus dem Formular extrahieren
  const featuresString = formData.get("features") as string
  const features = featuresString ? featuresString.split("\n").filter((f) => f.trim() !== "") : []

  // Produkt aktualisieren
  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description,
      long_description: longDescription,
      price,
      sale_price: salePrice,
      category,
      image_url: imageUrl,
      version,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating product:", error)
    throw new Error(`Failed to update product: ${error.message}`)
  }

  // Bestehende Features löschen und neue hinzufügen
  await supabase.from("product_features").delete().eq("product_id", id)

  if (features.length > 0) {
    const featuresData = features.map((feature) => ({
      product_id: id,
      feature,
    }))

    const { error: featuresError } = await supabase.from("product_features").insert(featuresData)

    if (featuresError) {
      console.error("Error updating product features:", featuresError)
    }
  }

  // Status aktualisieren
  const { data: existingStatus } = await supabase.from("product_status").select("*").eq("product_id", id).single()

  if (existingStatus) {
    await supabase
      .from("product_status")
      .update({
        status,
        last_updated: new Date().toISOString(),
      })
      .eq("product_id", id)
  } else {
    await supabase.from("product_status").insert({
      product_id: id,
      status,
      active_users: 0,
      last_updated: new Date().toISOString(),
    })
  }

  // Cache invalidieren
  revalidatePath("/admin/products")
  revalidatePath("/products")
  revalidatePath(`/products/${slug}`)

  return { success: true }
}

// Produkt abrufen
export async function getProduct(id: string) {
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_features (
        feature
      ),
      product_status (
        status,
        active_users,
        last_updated
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    throw new Error(`Failed to fetch product: ${error.message}`)
  }

  // Features formatieren
  const features = Array.isArray(product.product_features)
    ? product.product_features.map((pf) => pf.feature).join("\n")
    : ""

  // Status extrahieren
  const statusInfo =
    Array.isArray(product.product_status) && product.product_status.length > 0
      ? product.product_status[0]
      : { status: "offline" }

  return {
    ...product,
    features,
    status: statusInfo.status,
  }
}

// Kategorien abrufen
export async function getCategories() {
  const supabase = createClient()

  const { data, error } = await supabase.from("products").select("category").order("category")

  if (error) {
    console.error("Error fetching categories:", error)
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  // Eindeutige Kategorien extrahieren
  const categories = Array.from(new Set(data.map((p) => p.category)))

  return categories
}
