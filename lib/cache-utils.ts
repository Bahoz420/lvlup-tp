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
  getProductTag,
  getCategoryTag,
  getOfferTag,
  getReviewTag,
  getProductReviewsTag,
  getForumTopicTag,
  getForumCategoryTag,
  getProductStatusTag,
  CACHE_TAG_FORUM_RECENT,
  CACHE_TAG_PRODUCT_FEATURED,
  CACHE_TAG_OFFER_FEATURED,
  CACHE_TAG_REVIEW_FEATURED,
  CACHE_TAG_PRODUCT_NEW,
  CACHE_TAG_PRODUCT_SALE,
  CACHE_TAG_OFFER_LIMITED,
  CACHE_TAG_OFFER_EXPIRING_SOON,
  CACHE_TAG_REVIEW_RECENT,
  CACHE_TAG_FORUM_POPULAR,
  CACHE_TAG_FORUM_FEATURED,
} from "./cache-constants"

/**
 * Hilfsfunktionen für die Cache-Verwaltung
 */

// Revalidiere einen bestimmten Pfad
export async function revalidatePath(path: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "your-secret-token",
      },
      body: JSON.stringify({
        type: "path",
        path,
      }),
    })

    if (!response.ok) {
      console.error("Failed to revalidate path:", path, await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error("Error revalidating path:", path, error)
    return false
  }
}

// Revalidiere einen bestimmten Tag
export async function revalidateTag(tag: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "your-secret-token",
      },
      body: JSON.stringify({
        type: "tag",
        tag,
      }),
    })

    if (!response.ok) {
      console.error("Failed to revalidate tag:", tag, await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error("Error revalidating tag:", tag, error)
    return false
  }
}

// Revalidiere mehrere Tags gleichzeitig
export async function revalidateTags(tags: string[]): Promise<boolean> {
  try {
    const promises = tags.map((tag) => revalidateTag(tag))
    const results = await Promise.all(promises)
    return results.every(Boolean)
  } catch (error) {
    console.error("Error revalidating tags:", tags, error)
    return false
  }
}

// Revalidiere einen bestimmten Produktstatus
export async function revalidateProductStatus(productId: string): Promise<boolean> {
  const tags = [getProductTag(productId), getProductStatusTag(productId), CACHE_TAG_STATUS, CACHE_TAG_PRODUCTS]

  const paths = [`/products/${productId}`, "/products", "/"]

  try {
    const tagPromises = tags.map((tag) => revalidateTag(tag))
    const pathPromises = paths.map((path) => revalidatePath(path))

    const results = await Promise.all([...tagPromises, ...pathPromises])
    return results.every(Boolean)
  } catch (error) {
    console.error("Error revalidating product status:", productId, error)
    return false
  }
}

// Revalidiere eine bestimmte Produktkategorie
export async function revalidateProductCategory(category: string): Promise<boolean> {
  const tags = [getCategoryTag(category), CACHE_TAG_PRODUCTS]

  const paths = ["/products", "/"]

  try {
    const tagPromises = tags.map((tag) => revalidateTag(tag))
    const pathPromises = paths.map((path) => revalidatePath(path))

    const results = await Promise.all([...tagPromises, ...pathPromises])
    return results.every(Boolean)
  } catch (error) {
    console.error("Error revalidating product category:", category, error)
    return false
  }
}

// Revalidiere ein bestimmtes Angebot
export async function revalidateOffer(offerId: string): Promise<boolean> {
  const tags = [getOfferTag(offerId), CACHE_TAG_OFFERS]

  const paths = [`/offers/${offerId}`, "/"]

  try {
    const tagPromises = tags.map((tag) => revalidateTag(tag))
    const pathPromises = paths.map((path) => revalidatePath(path))

    const results = await Promise.all([...tagPromises, ...pathPromises])
    return results.every(Boolean)
  } catch (error) {
    console.error("Error revalidating offer:", offerId, error)
    return false
  }
}

// Revalidiere Bewertungen für ein bestimmtes Produkt
export async function revalidateProductReviews(productId: string): Promise<boolean> {
  const tags = [getProductReviewsTag(productId), getProductTag(productId), CACHE_TAG_REVIEWS]

  const paths = [`/products/${productId}`, "/products"]

  try {
    const tagPromises = tags.map((tag) => revalidateTag(tag))
    const pathPromises = paths.map((path) => revalidatePath(path))

    const results = await Promise.all([...tagPromises, ...pathPromises])
    return results.every(Boolean)
  } catch (error) {
    console.error("Error revalidating product reviews:", productId, error)
    return false
  }
}

// Revalidiere ein bestimmtes Forums-Thema
export async function revalidateForumTopic(topicId: string, category?: string): Promise<boolean> {
  const tags = [getForumTopicTag(topicId), CACHE_TAG_FORUM, CACHE_TAG_FORUM_RECENT]

  if (category) {
    tags.push(getForumCategoryTag(category))
  }

  const paths = [`/forum/topic/${topicId}`, "/forum"]

  try {
    const tagPromises = tags.map((tag) => revalidateTag(tag))
    const pathPromises = paths.map((path) => revalidatePath(path))

    const results = await Promise.all([...tagPromises, ...pathPromises])
    return results.every(Boolean)
  } catch (error) {
    console.error("Error revalidating forum topic:", topicId, error)
    return false
  }
}

// Revalidiere alle wichtigen Caches
export async function revalidateAllCaches(): Promise<boolean> {
  try {
    const globalTags = [
      CACHE_TAG_ALL,
      CACHE_TAG_GLOBAL,
      CACHE_TAG_PRODUCTS,
      CACHE_TAG_STATUS,
      CACHE_TAG_OFFERS,
      CACHE_TAG_REVIEWS,
      CACHE_TAG_FORUM,
      CACHE_TAG_USERS,
    ]

    const globalPaths = ["/", "/products", "/forum", "/gallery", "/support", "/faq", "/contact"]

    const tagPromises = globalTags.map((tag) => revalidateTag(tag))
    const pathPromises = globalPaths.map((path) => revalidatePath(path))

    const results = await Promise.all([...tagPromises, ...pathPromises])
    return results.every(Boolean)
  } catch (error) {
    console.error("Error revalidating all caches:", error)
    return false
  }
}

// Revalidiere die Startseite und zugehörige Daten
export async function revalidateHomePage(): Promise<boolean> {
  const tags = [CACHE_TAG_PAGE_HOME, CACHE_TAG_PRODUCT_FEATURED, CACHE_TAG_OFFER_FEATURED, CACHE_TAG_REVIEW_FEATURED]

  try {
    const tagPromises = tags.map((tag) => revalidateTag(tag))
    const pathPromise = revalidatePath("/")

    const results = await Promise.all([...tagPromises, pathPromise])
    return results.every(Boolean)
  } catch (error) {
    console.error("Error revalidating home page:", error)
    return false
  }
}

// Revalidiere die Produktseite und zugehörige Daten
export async function revalidateProductsPage(): Promise<boolean> {
  const tags = [
    CACHE_TAG_PAGE_PRODUCTS,
    CACHE_TAG_PRODUCTS,
    CACHE_TAG_PRODUCT_FEATURED,
    CACHE_TAG_PRODUCT_NEW,
    CACHE_TAG_PRODUCT_SALE,
  ]

  try {
    const tagPromises = tags.map((tag) => revalidateTag(tag))
    const pathPromise = revalidatePath("/products")

    const results = await Promise.all([...tagPromises, pathPromise])
    return results.every(Boolean)
  } catch (error) {
    console.error("Error revalidating products page:", error)
    return false
  }
}

// Generiere Cache-Tags für ein Produkt
export function generateProductCacheTags(product: any): string[] {
  const tags = [CACHE_TAG_PRODUCTS, getProductTag(product.id)]

  if (product.category) {
    tags.push(getCategoryTag(product.category))
  }

  if (product.status) {
    tags.push(getProductStatusTag(product.id))
    tags.push(`status-${product.status.toLowerCase()}`)
  }

  // Füge Tags für spezielle Produkteigenschaften hinzu
  if (product.featured) {
    tags.push(CACHE_TAG_PRODUCT_FEATURED)
  }

  if (product.sale_price) {
    tags.push(CACHE_TAG_PRODUCT_SALE)
  }

  // Prüfe, ob das Produkt neu ist (weniger als 30 Tage alt)
  if (product.created_at) {
    const createdDate = new Date(product.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (createdDate > thirtyDaysAgo) {
      tags.push(CACHE_TAG_PRODUCT_NEW)
    }
  }

  return tags
}

// Generiere Cache-Tags für ein Angebot
export function generateOfferCacheTags(offer: any): string[] {
  const tags = [CACHE_TAG_OFFERS, getOfferTag(offer.id)]

  if (offer.productId) {
    tags.push(getProductTag(offer.productId))
  }

  if (offer.featured) {
    tags.push(CACHE_TAG_OFFER_FEATURED)
  }

  if (offer.limited) {
    tags.push(CACHE_TAG_OFFER_LIMITED)
  }

  // Prüfe, ob das Angebot bald abläuft (weniger als 24 Stunden)
  if (offer.expiresAt) {
    const expiryDate = new Date(offer.expiresAt)
    const twentyFourHoursFromNow = new Date()
    twentyFourHoursFromNow.setHours(twentyFourHoursFromNow.getHours() + 24)

    if (expiryDate < twentyFourHoursFromNow) {
      tags.push(CACHE_TAG_OFFER_EXPIRING_SOON)
    }
  }

  return tags
}

// Generiere Cache-Tags für eine Bewertung
export function generateReviewCacheTags(review: any): string[] {
  const tags = [CACHE_TAG_REVIEWS, getReviewTag(review.id)]

  if (review.product_id) {
    tags.push(getProductReviewsTag(review.product_id))
    tags.push(getProductTag(review.product_id))
  }

  // Prüfe, ob die Bewertung neu ist (weniger als 7 Tage alt)
  if (review.created_at) {
    const createdDate = new Date(review.created_at)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    if (createdDate > sevenDaysAgo) {
      tags.push(CACHE_TAG_REVIEW_RECENT)
    }
  }

  // Prüfe, ob es sich um eine hervorgehobene Bewertung handelt
  if (review.featured || review.rating === 5) {
    tags.push(CACHE_TAG_REVIEW_FEATURED)
  }

  return tags
}

// Generiere Cache-Tags für ein Forums-Thema
export function generateForumTopicCacheTags(topic: any): string[] {
  const tags = [CACHE_TAG_FORUM, getForumTopicTag(topic.id)]

  if (topic.category) {
    tags.push(getForumCategoryTag(topic.category))
  }

  // Prüfe, ob das Thema neu ist (weniger als 24 Stunden alt)
  if (topic.created_at) {
    const createdDate = new Date(topic.created_at)
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    if (createdDate > twentyFourHoursAgo) {
      tags.push(CACHE_TAG_FORUM_RECENT)
    }
  }

  // Prüfe, ob es sich um ein beliebtes Thema handelt
  if (topic.views > 1000 || topic.replies > 50) {
    tags.push(CACHE_TAG_FORUM_POPULAR)
  }

  // Prüfe, ob es sich um ein hervorgehobenes Thema handelt
  if (topic.featured || topic.pinned) {
    tags.push(CACHE_TAG_FORUM_FEATURED)
  }

  return tags
}
