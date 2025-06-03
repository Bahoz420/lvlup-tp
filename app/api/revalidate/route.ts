import { type NextRequest, NextResponse } from "next/server"
import { revalidateTag as nextRevalidateTag, revalidatePath as nextRevalidatePath } from "next/cache"
import {
  CACHE_TAG_ALL,
  CACHE_TAG_GLOBAL,
  CACHE_TAG_PRODUCTS,
  CACHE_TAG_STATUS,
  CACHE_TAG_OFFERS,
  CACHE_TAG_REVIEWS,
  CACHE_TAG_FORUM,
  CACHE_TAG_USERS,
  CACHE_TAG_PAGE_HOME,
  CACHE_TAG_PAGE_PRODUCTS,
  CACHE_TAG_PRODUCT_FEATURED,
  CACHE_TAG_PRODUCT_NEW,
  CACHE_TAG_PRODUCT_SALE,
  CACHE_TAG_PRODUCT_TRENDING,
  CACHE_TAG_PRODUCT_POPULAR,
  CACHE_TAG_PRODUCT_RECOMMENDED,
  CACHE_TAG_STATUS_ONLINE,
  CACHE_TAG_STATUS_OFFLINE,
  CACHE_TAG_STATUS_UPDATING,
  CACHE_TAG_STATUS_MAINTENANCE,
  CACHE_TAG_STATUS_DETECTION_RISK,
  CACHE_TAG_STATUS_UPTIME,
  CACHE_TAG_OFFER_FEATURED,
  CACHE_TAG_OFFER_LIMITED,
  CACHE_TAG_OFFER_EXPIRING_SOON,
  CACHE_TAG_OFFER_FLASH_SALE,
  CACHE_TAG_OFFER_BUNDLE,
  CACHE_TAG_OFFER_SEASONAL,
  CACHE_TAG_REVIEW_RECENT,
  CACHE_TAG_REVIEW_FEATURED,
  CACHE_TAG_REVIEW_VERIFIED,
  CACHE_TAG_REVIEW_HELPFUL,
  CACHE_TAG_FORUM_RECENT,
  CACHE_TAG_FORUM_POPULAR,
  CACHE_TAG_FORUM_FEATURED,
  CACHE_TAG_FORUM_ANNOUNCEMENT,
  CACHE_TAG_FORUM_STICKY,
  CACHE_TAG_FORUM_UNANSWERED,
  CACHE_TAG_USER_PREMIUM,
  CACHE_TAG_USER_NEW,
  CACHE_TAG_USER_ACTIVE,
  CACHE_TAG_LANGUAGE_DE,
  CACHE_TAG_LANGUAGE_EN,
  CACHE_TAG_LANGUAGE_FR,
  CACHE_TAG_LANGUAGE_ES,
  CACHE_TAG_LANGUAGE_RU,
  CACHE_TAG_PAGE_BLOG,
  CACHE_TAG_PAGE_CHECKOUT,
  CACHE_TAG_PAGE_CART,
  CACHE_TAG_PAGE_FORUM,
  CACHE_TAG_PAGE_GALLERY,
  CACHE_TAG_PAGE_SUPPORT,
  CACHE_TAG_PAGE_FAQ,
  CACHE_TAG_PAGE_CONTACT,
  CACHE_TAG_PAGE_ABOUT,
  CACHE_TAG_PAGE_TERMS,
  CACHE_TAG_PAGE_PRIVACY,
  CACHE_TAG_PAYMENT,
  CACHE_TAG_PAYMENT_CRYPTO,
  CACHE_TAG_PAYMENT_CREDIT_CARD,
  CACHE_TAG_PAYMENT_PAYPAL,
  CACHE_TAG_DEVICE,
  CACHE_TAG_DEVICE_MOBILE,
  CACHE_TAG_DEVICE_DESKTOP,
  CACHE_TAG_DEVICE_TABLET,
  CACHE_TAG_REGION_EU,
  CACHE_TAG_REGION_NA,
  CACHE_TAG_REGION_ASIA,
  CACHE_TAG_FEATURE_AIMBOT,
  CACHE_TAG_FEATURE_ESP,
  CACHE_TAG_FEATURE_RADAR,
  CACHE_TAG_FEATURE_SPOOFER,
} from "@/lib/cache-constants"

// Definiere Tag-Gruppen für einfachere Revalidierung
const TAG_GROUPS = {
  // Globale Gruppen
  all: [CACHE_TAG_ALL, CACHE_TAG_GLOBAL],
  global: [CACHE_TAG_GLOBAL],

  // Produkt-bezogene Gruppen
  "all-products": [CACHE_TAG_PRODUCTS, CACHE_TAG_PAGE_PRODUCTS],
  "featured-products": [CACHE_TAG_PRODUCTS, CACHE_TAG_PRODUCT_FEATURED],
  "new-products": [CACHE_TAG_PRODUCTS, CACHE_TAG_PRODUCT_NEW],
  "sale-products": [CACHE_TAG_PRODUCTS, CACHE_TAG_PRODUCT_SALE],
  "trending-products": [CACHE_TAG_PRODUCTS, CACHE_TAG_PRODUCT_TRENDING],
  "popular-products": [CACHE_TAG_PRODUCTS, CACHE_TAG_PRODUCT_POPULAR],
  "recommended-products": [CACHE_TAG_PRODUCTS, CACHE_TAG_PRODUCT_RECOMMENDED],

  // Status-bezogene Gruppen
  "all-status": [
    CACHE_TAG_STATUS,
    CACHE_TAG_STATUS_ONLINE,
    CACHE_TAG_STATUS_OFFLINE,
    CACHE_TAG_STATUS_UPDATING,
    CACHE_TAG_STATUS_MAINTENANCE,
    CACHE_TAG_STATUS_DETECTION_RISK,
    CACHE_TAG_STATUS_UPTIME,
  ],
  "online-status": [CACHE_TAG_STATUS, CACHE_TAG_STATUS_ONLINE],
  "offline-status": [CACHE_TAG_STATUS, CACHE_TAG_STATUS_OFFLINE],
  "updating-status": [CACHE_TAG_STATUS, CACHE_TAG_STATUS_UPDATING],
  "maintenance-status": [CACHE_TAG_STATUS, CACHE_TAG_STATUS_MAINTENANCE],
  "detection-risk": [CACHE_TAG_STATUS, CACHE_TAG_STATUS_DETECTION_RISK],
  "uptime-status": [CACHE_TAG_STATUS, CACHE_TAG_STATUS_UPTIME],

  // Angebots-bezogene Gruppen
  "all-offers": [CACHE_TAG_OFFERS],
  "featured-offers": [CACHE_TAG_OFFERS, CACHE_TAG_OFFER_FEATURED],
  "limited-offers": [CACHE_TAG_OFFERS, CACHE_TAG_OFFER_LIMITED],
  "expiring-offers": [CACHE_TAG_OFFERS, CACHE_TAG_OFFER_EXPIRING_SOON],
  "flash-sale-offers": [CACHE_TAG_OFFERS, CACHE_TAG_OFFER_FLASH_SALE],
  "bundle-offers": [CACHE_TAG_OFFERS, CACHE_TAG_OFFER_BUNDLE],
  "seasonal-offers": [CACHE_TAG_OFFERS, CACHE_TAG_OFFER_SEASONAL],

  // Bewertungs-bezogene Gruppen
  "all-reviews": [CACHE_TAG_REVIEWS],
  "featured-reviews": [CACHE_TAG_REVIEWS, CACHE_TAG_REVIEW_FEATURED],
  "recent-reviews": [CACHE_TAG_REVIEWS, CACHE_TAG_REVIEW_RECENT],
  "verified-reviews": [CACHE_TAG_REVIEWS, CACHE_TAG_REVIEW_VERIFIED],
  "helpful-reviews": [CACHE_TAG_REVIEWS, CACHE_TAG_REVIEW_HELPFUL],

  // Forum-bezogene Gruppen
  "all-forum": [CACHE_TAG_FORUM],
  "recent-forum": [CACHE_TAG_FORUM, CACHE_TAG_FORUM_RECENT],
  "popular-forum": [CACHE_TAG_FORUM, CACHE_TAG_FORUM_POPULAR],
  "featured-forum": [CACHE_TAG_FORUM, CACHE_TAG_FORUM_FEATURED],
  announcements: [CACHE_TAG_FORUM, CACHE_TAG_FORUM_ANNOUNCEMENT],
  "sticky-topics": [CACHE_TAG_FORUM, CACHE_TAG_FORUM_STICKY],
  "unanswered-topics": [CACHE_TAG_FORUM, CACHE_TAG_FORUM_UNANSWERED],

  // Benutzer-bezogene Gruppen
  "all-users": [CACHE_TAG_USERS],
  "premium-users": [CACHE_TAG_USERS, CACHE_TAG_USER_PREMIUM],
  "new-users": [CACHE_TAG_USERS, CACHE_TAG_USER_NEW],
  "active-users": [CACHE_TAG_USERS, CACHE_TAG_USER_ACTIVE],

  // Sprach-bezogene Gruppen
  "all-languages": [
    CACHE_TAG_LANGUAGE_DE,
    CACHE_TAG_LANGUAGE_EN,
    CACHE_TAG_LANGUAGE_FR,
    CACHE_TAG_LANGUAGE_ES,
    CACHE_TAG_LANGUAGE_RU,
  ],
  "german-content": [CACHE_TAG_LANGUAGE_DE],
  "english-content": [CACHE_TAG_LANGUAGE_EN],
  "french-content": [CACHE_TAG_LANGUAGE_FR],
  "spanish-content": [CACHE_TAG_LANGUAGE_ES],
  "russian-content": [CACHE_TAG_LANGUAGE_RU],

  // Seiten-bezogene Gruppen
  "all-pages": [
    CACHE_TAG_PAGE_HOME,
    CACHE_TAG_PAGE_PRODUCTS,
    CACHE_TAG_PAGE_FORUM,
    CACHE_TAG_PAGE_GALLERY,
    CACHE_TAG_PAGE_SUPPORT,
    CACHE_TAG_PAGE_FAQ,
    CACHE_TAG_PAGE_CONTACT,
    CACHE_TAG_PAGE_ABOUT,
    CACHE_TAG_PAGE_TERMS,
    CACHE_TAG_PAGE_PRIVACY,
    CACHE_TAG_PAGE_BLOG,
    CACHE_TAG_PAGE_CHECKOUT,
    CACHE_TAG_PAGE_CART,
  ],
  "main-pages": [CACHE_TAG_PAGE_HOME, CACHE_TAG_PAGE_PRODUCTS, CACHE_TAG_PAGE_FORUM],
  "info-pages": [
    CACHE_TAG_PAGE_ABOUT,
    CACHE_TAG_PAGE_TERMS,
    CACHE_TAG_PAGE_PRIVACY,
    CACHE_TAG_PAGE_FAQ,
    CACHE_TAG_PAGE_CONTACT,
  ],
  "shop-pages": [CACHE_TAG_PAGE_PRODUCTS, CACHE_TAG_PAGE_CHECKOUT, CACHE_TAG_PAGE_CART],
  "community-pages": [CACHE_TAG_PAGE_FORUM, CACHE_TAG_PAGE_BLOG, CACHE_TAG_PAGE_GALLERY],

  // Zahlungs-bezogene Gruppen
  "all-payment-methods": [
    CACHE_TAG_PAYMENT,
    CACHE_TAG_PAYMENT_CRYPTO,
    CACHE_TAG_PAYMENT_CREDIT_CARD,
    CACHE_TAG_PAYMENT_PAYPAL,
  ],
  "crypto-payments": [CACHE_TAG_PAYMENT, CACHE_TAG_PAYMENT_CRYPTO],
  "card-payments": [CACHE_TAG_PAYMENT, CACHE_TAG_PAYMENT_CREDIT_CARD],
  "paypal-payments": [CACHE_TAG_PAYMENT, CACHE_TAG_PAYMENT_PAYPAL],

  // Geräte-bezogene Gruppen
  "all-devices": [CACHE_TAG_DEVICE, CACHE_TAG_DEVICE_MOBILE, CACHE_TAG_DEVICE_DESKTOP, CACHE_TAG_DEVICE_TABLET],
  "mobile-devices": [CACHE_TAG_DEVICE, CACHE_TAG_DEVICE_MOBILE],
  "desktop-devices": [CACHE_TAG_DEVICE, CACHE_TAG_DEVICE_DESKTOP],
  "tablet-devices": [CACHE_TAG_DEVICE, CACHE_TAG_DEVICE_TABLET],

  // Region-bezogene Gruppen
  "all-regions": [CACHE_TAG_REGION_EU, CACHE_TAG_REGION_NA, CACHE_TAG_REGION_ASIA],
  "eu-region": [CACHE_TAG_REGION_EU],
  "na-region": [CACHE_TAG_REGION_NA],
  "asia-region": [CACHE_TAG_REGION_ASIA],

  // Feature-bezogene Gruppen
  "all-features": [CACHE_TAG_FEATURE_AIMBOT, CACHE_TAG_FEATURE_ESP, CACHE_TAG_FEATURE_RADAR, CACHE_TAG_FEATURE_SPOOFER],
  "aimbot-features": [CACHE_TAG_FEATURE_AIMBOT],
  "esp-features": [CACHE_TAG_FEATURE_ESP],
  "radar-features": [CACHE_TAG_FEATURE_RADAR],
  "spoofer-features": [CACHE_TAG_FEATURE_SPOOFER],
}

export async function POST(request: NextRequest) {
  // Überprüfe den Revalidierungs-Token
  const token = request.headers.get("x-revalidate-token")

  if (token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { type, tag, path, group } = await request.json()

    // Protokolliere die Revalidierungsanfrage
    console.log(`Revalidation request: type=${type}, tag=${tag}, path=${path}, group=${group}`)

    // Revalidiere basierend auf dem Typ
    if (type === "tag" && tag) {
      // Prüfe, ob es sich um eine Tag-Gruppe handelt
      if (tag in TAG_GROUPS) {
        const tags = TAG_GROUPS[tag as keyof typeof TAG_GROUPS]
        console.log(`Revalidating tag group: ${tag} (${tags.join(", ")})`)

        // Revalidiere alle Tags in der Gruppe
        for (const groupTag of tags) {
          nextRevalidateTag(groupTag)
        }
      } else {
        // Revalidiere einen einzelnen Tag
        console.log(`Revalidating tag: ${tag}`)
        nextRevalidateTag(tag)
      }

      return NextResponse.json({ success: true, revalidated: true, type: "tag", tag })
    } else if (type === "path" && path) {
      // Revalidiere einen Pfad
      console.log(`Revalidating path: ${path}`)
      nextRevalidatePath(path)

      return NextResponse.json({ success: true, revalidated: true, type: "path", path })
    } else if (type === "group" && group) {
      // Revalidiere eine benannte Gruppe
      if (group in TAG_GROUPS) {
        const tags = TAG_GROUPS[group as keyof typeof TAG_GROUPS]
        console.log(`Revalidating tag group: ${group} (${tags.join(", ")})`)

        // Revalidiere alle Tags in der Gruppe
        for (const groupTag of tags) {
          nextRevalidateTag(groupTag)
        }

        return NextResponse.json({ success: true, revalidated: true, type: "group", group })
      } else {
        return NextResponse.json({ error: "Invalid group" }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: "Invalid revalidation parameters" }, { status: 400 })
    }
  } catch (error) {
    console.error("Revalidation error:", error)
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Liste alle verfügbaren Tag-Gruppen auf
  return NextResponse.json({
    tagGroups: Object.keys(TAG_GROUPS),
    message: "Use POST to revalidate cache",
  })
}
