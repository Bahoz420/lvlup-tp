import type { Metadata } from "next"
import { db } from "@/lib/supabase-database-fixed"
import { ProductsClient } from "./products-client"
import { ProductsLoadingSkeleton } from "./products-loading-skeleton"
import { Suspense } from "react"

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: "Premium Gaming Software & Cheats | LvlUp Products",
  description:
    "Browse our collection of premium gaming software for CS2, Valorant, Fortnite, and more. Professional-grade cheats with advanced features, regular updates, and 24/7 support.",
  keywords: "gaming software, CS2 cheats, Valorant hacks, Fortnite cheats, gaming enhancements, aimbot, wallhack, ESP",
  openGraph: {
    title: "Premium Gaming Software & Cheats | LvlUp Products",
    description: "Professional gaming software with advanced features and regular updates",
    type: "website",
    url: "/products",
    images: [
      {
        url: "/og-products.jpg",
        width: 1200,
        height: 630,
        alt: "LvlUp Gaming Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Gaming Software & Cheats | LvlUp Products",
    description: "Professional gaming software with advanced features and regular updates",
    images: ["/og-products.jpg"],
  },
  alternates: {
    canonical: "/products",
  },
}

// Enable ISR for better performance
export const revalidate = 1800 // 30 minutes

// Fallback products for better reliability
const fallbackProducts = [
  {
    id: "fortnite-fallback",
    name: "Fortnite lvlup Cheat",
    slug: "fortnite",
    description: "Advanced Fortnite cheat with aimbot, ESP, and more premium features",
    price: 29.99,
    original_price: 59.99,
    game: "Fortnite",
    image_url: "/fortnite-star-wars.jpg",
    status: "active",
    is_featured: true,
    product_status: [{ status: "online", active_users: 1247, last_updated: new Date().toISOString() }],
    product_features: [
      { feature: "Advanced Aimbot with customizable settings" },
      { feature: "ESP (Wallhack) for players, items, and vehicles" },
      { feature: "Radar Hack showing all players on minimap" },
    ],
  },
  {
    id: "warzone-fallback",
    name: "Warzone lvlup Cheat",
    slug: "warzone",
    description: "Dominate Call of Duty Warzone with our feature-rich cheat package",
    price: 59.99,
    original_price: 59.99,
    game: "Warzone",
    image_url: "/warzone.png",
    status: "inactive",
    is_featured: true,
    product_status: [{ status: "offline", active_users: 0, last_updated: new Date().toISOString() }],
    product_features: [
      { feature: "Advanced aimbot with smoothing" },
      { feature: "ESP for players, vehicles, and loot" },
      { feature: "No recoil and no sway" },
    ],
  },
  {
    id: "cs2-fallback",
    name: "CS2 lvlup Cheat",
    slug: "cs2",
    description: "Professional Counter-Strike 2 cheat with advanced features and anti-detection",
    price: 59.99,
    original_price: 59.99,
    game: "CS2",
    image_url: "/cs2.png",
    status: "maintenance",
    is_featured: true,
    product_status: [{ status: "updating", active_users: 0, last_updated: new Date().toISOString() }],
    product_features: [
      { feature: "Precision Aimbot with bone targeting" },
      { feature: "Wallhack with customizable colors" },
      { feature: "Triggerbot with reaction time settings" },
    ],
  },
]

async function getProducts() {
  try {
    // Try to fetch from database first
    const { data: products, error } = await db.getAllProducts()

    if (error || !products) {
      console.warn("Database fetch failed, using fallback products:", error)
      return fallbackProducts
    }

    // Ensure products have the expected structure
    const processedProducts = products.map((product) => ({
      ...product,
      price: typeof product.price === "string" ? Number.parseFloat(product.price) : product.price,
      original_price:
        typeof product.original_price === "string" ? Number.parseFloat(product.original_price) : product.original_price,
      rating: 4.8, // Default rating since we don't have reviews yet
      review_count: Math.floor(Math.random() * 300) + 100, // Mock review count
    }))

    return processedProducts
  } catch (error) {
    console.error("Error fetching products:", error)
    return fallbackProducts
  }
}

export default async function ProductsPage() {
  // Fetch products on the server
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-purple-800/50 to-indigo-900/50"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>

      {/* Static floating orbs for better performance */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-pulse-slow"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-xl animate-bounce-slow"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-r from-amber-500/25 to-orange-500/25 rounded-full blur-lg animate-bounce-slow"></div>

      {/* Animated geometric shapes */}
      <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-amber-400/60 rounded-full animate-ping"></div>
      <div
        className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/60 rounded-full animate-ping"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-ping"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* REMOVED NAVIGATION COMPONENT FROM HERE */}

      <Suspense fallback={<ProductsLoadingSkeleton />}>
        <ProductsClient initialProducts={products} />
      </Suspense>
    </div>
  )
}
