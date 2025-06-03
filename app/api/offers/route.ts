import { NextResponse } from "next/server"
import {
  CACHE_TAG_OFFERS,
  CACHE_TAG_OFFER_FEATURED,
  CACHE_TAG_OFFER_LIMITED,
  CACHE_TAG_OFFER_EXPIRING_SOON,
  CACHE_TAG_OFFER_FLASH_SALE,
  CACHE_TAG_OFFER_BUNDLE,
  CACHE_TAG_OFFER_SEASONAL,
  getProductTag,
  combineTags,
  generateOfferCacheTags,
  generateDeviceCacheTags,
} from "@/lib/cache-constants"

// Konfiguriere diese Route als Edge-Funktion
export const runtime = "edge"

// Beispiel-Angebote
const offers = [
  {
    id: "valorant-50-off",
    title: "50% OFF Valorant Premium Package",
    description:
      "Get our most advanced Valorant cheat with aimbot, ESP, radar hack, and our exclusive HWID spoofer at half price.",
    productId: "valorant",
    originalPrice: 24.99,
    currentPrice: 12.49,
    discountPercentage: 50,
    featured: true,
    limited: true,
    isBundle: false,
    timeRemaining: {
      days: 2,
      hours: 18,
      minutes: 45,
    },
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "fortnite-30-off",
    title: "30% OFF Fortnite Premium Package",
    description: "Dominate in Fortnite with our premium cheat package at a special discount price.",
    productId: "fortnite",
    originalPrice: 19.99,
    currentPrice: 13.99,
    discountPercentage: 30,
    featured: false,
    limited: true,
    isBundle: false,
    timeRemaining: {
      days: 5,
      hours: 12,
      minutes: 30,
    },
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "apex-legends-25-off",
    title: "25% OFF Apex Legends Elite Package",
    description: "Take your Apex Legends gameplay to the next level with our elite cheat package.",
    productId: "apex-legends",
    originalPrice: 22.99,
    currentPrice: 17.24,
    discountPercentage: 25,
    featured: false,
    limited: false,
    isBundle: false,
    timeRemaining: {
      days: 7,
      hours: 0,
      minutes: 0,
    },
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "flash-sale-all-games",
    title: "FLASH SALE: 40% OFF All Games",
    description: "Limited time flash sale! Get 40% off on all our premium cheat packages for the next 6 hours only!",
    productId: null,
    originalPrice: null,
    currentPrice: null,
    discountPercentage: 40,
    featured: true,
    limited: true,
    isBundle: false,
    timeRemaining: {
      days: 0,
      hours: 5,
      minutes: 45,
    },
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ultimate-bundle",
    title: "Ultimate Cheat Bundle",
    description: "Get all our premium cheats in one bundle and save 60%!",
    productId: null,
    originalPrice: 99.99,
    currentPrice: 39.99,
    discountPercentage: 60,
    featured: true,
    limited: true,
    isBundle: true,
    timeRemaining: {
      days: 3,
      hours: 0,
      minutes: 0,
    },
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET(request: Request) {
  // URL-Parameter abrufen
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get("featured") === "true"
  const limited = searchParams.get("limited") === "true"
  const expiringSoon = searchParams.get("expiringSoon") === "true"
  const flashSale = searchParams.get("flashSale") === "true"
  const bundle = searchParams.get("bundle") === "true"
  const seasonal = searchParams.get("seasonal") === "true"
  const productId = searchParams.get("productId")
  const minDiscount = searchParams.get("minDiscount") ? Number.parseInt(searchParams.get("minDiscount")!) : undefined

  // Angebote filtern
  let filteredOffers = [...offers]

  if (featured) {
    filteredOffers = filteredOffers.filter((offer) => offer.featured)
  }

  if (limited) {
    filteredOffers = filteredOffers.filter((offer) => offer.limited)
  }

  if (expiringSoon) {
    // Angebote, die in weniger als 24 Stunden ablaufen
    const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    filteredOffers = filteredOffers.filter((offer) => new Date(offer.expiresAt) < twentyFourHoursFromNow)
  }

  if (flashSale) {
    // Angebote, die in weniger als 6 Stunden ablaufen
    const sixHoursFromNow = new Date(Date.now() + 6 * 60 * 60 * 1000)
    filteredOffers = filteredOffers.filter((offer) => new Date(offer.expiresAt) < sixHoursFromNow)
  }

  if (bundle) {
    filteredOffers = filteredOffers.filter((offer) => offer.isBundle || offer.title.toLowerCase().includes("bundle"))
  }

  if (seasonal) {
    // Aktuelle Saison bestimmen
    const currentMonth = new Date().getMonth()
    // Saisonale Angebote basierend auf dem Monat filtern
    filteredOffers = filteredOffers.filter((offer) => {
      // Weihnachten (Dezember)
      if (currentMonth === 11 && offer.title.toLowerCase().includes("christmas")) return true
      // Black Friday (November)
      if (currentMonth === 10 && offer.title.toLowerCase().includes("black friday")) return true
      // Sommer-Sale (Juni, Juli, August)
      if (currentMonth >= 5 && currentMonth <= 7 && offer.title.toLowerCase().includes("summer")) return true
      return false
    })
  }

  if (productId) {
    filteredOffers = filteredOffers.filter((offer) => offer.productId === productId)
  }

  if (minDiscount !== undefined) {
    filteredOffers = filteredOffers.filter((offer) => offer.discountPercentage >= minDiscount)
  }

  // Generiere Cache-Tags basierend auf den Filterparametern
  const cacheTags = [CACHE_TAG_OFFERS]

  // Füge spezielle Angebots-Tags hinzu
  if (featured) {
    cacheTags.push(CACHE_TAG_OFFER_FEATURED)
  }

  if (limited) {
    cacheTags.push(CACHE_TAG_OFFER_LIMITED)
  }

  if (expiringSoon) {
    cacheTags.push(CACHE_TAG_OFFER_EXPIRING_SOON)
  }

  if (flashSale) {
    cacheTags.push(CACHE_TAG_OFFER_FLASH_SALE)
  }

  if (bundle) {
    cacheTags.push(CACHE_TAG_OFFER_BUNDLE)
  }

  if (seasonal) {
    cacheTags.push(CACHE_TAG_OFFER_SEASONAL)
  }

  // Füge produkt-spezifische Tags hinzu
  if (productId) {
    cacheTags.push(getProductTag(productId))
  }

  // Füge angebots-spezifische Tags hinzu
  filteredOffers.forEach((offer) => {
    const offerTags = generateOfferCacheTags(offer)
    cacheTags.push(...offerTags)
  })

  // Füge gerätespezifische Tags hinzu, wenn User-Agent verfügbar ist
  const userAgent = request.headers.get("user-agent") || ""
  if (userAgent) {
    const deviceTags = generateDeviceCacheTags(userAgent)
    cacheTags.push(...deviceTags)
  }

  // Entferne Duplikate
  const uniqueTags = [...new Set(cacheTags)]

  return NextResponse.json(
    {
      offers: filteredOffers,
      count: filteredOffers.length,
      total: offers.length,
      filters: {
        featured,
        limited,
        expiringSoon,
        flashSale,
        bundle,
        seasonal,
        productId,
        minDiscount,
      },
    },
    {
      headers: {
        // Cache-Strategie für Angebote (kürzere Zeit, da zeitkritisch)
        "Cache-Control": "public, max-age=120, s-maxage=120, stale-while-revalidate=600",
        // Cache-Tags für gezielte Invalidierung
        "Cache-Tag": combineTags(uniqueTags),
        // Vercel-spezifische Edge-Cache-Header
        "Vercel-CDN-Cache-Control": "max-age=120, stale-while-revalidate=600",
        "CDN-Cache-Control": "max-age=120",
        "Vercel-Edge-Cache-Tag": combineTags(uniqueTags),
      },
    },
  )
}
