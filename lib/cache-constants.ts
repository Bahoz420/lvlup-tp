/**
 * Zentrale Konstanten für Cache-Tags
 *
 * Diese Konstanten werden in der gesamten Anwendung verwendet, um eine konsistente
 * Benennung von Cache-Tags zu gewährleisten.
 */

// Globale Tags
export const CACHE_TAG_ALL = "all"
export const CACHE_TAG_GLOBAL = "global"

// Produkt-bezogene Tags
export const CACHE_TAG_PRODUCTS = "products"
export const CACHE_TAG_PRODUCT_PREFIX = "product-"
export const CACHE_TAG_PRODUCT_CATEGORY_PREFIX = "product-category-"
export const CACHE_TAG_PRODUCT_STATUS_PREFIX = "product-status-"
export const CACHE_TAG_PRODUCT_FEATURED = "product-featured"
export const CACHE_TAG_PRODUCT_NEW = "product-new"
export const CACHE_TAG_PRODUCT_SALE = "product-sale"
export const CACHE_TAG_PRODUCT_TRENDING = "product-trending" // Neu: Trending-Produkte
export const CACHE_TAG_PRODUCT_POPULAR = "product-popular" // Neu: Beliebte Produkte
export const CACHE_TAG_PRODUCT_RECOMMENDED = "product-recommended" // Neu: Empfohlene Produkte

// Status-bezogene Tags
export const CACHE_TAG_STATUS = "status"
export const CACHE_TAG_STATUS_ONLINE = "status-online"
export const CACHE_TAG_STATUS_OFFLINE = "status-offline"
export const CACHE_TAG_STATUS_UPDATING = "status-updating"
export const CACHE_TAG_STATUS_MAINTENANCE = "status-maintenance"
export const CACHE_TAG_STATUS_DETECTION_RISK = "status-detection-risk" // Neu: Erkennungsrisiko
export const CACHE_TAG_STATUS_UPTIME = "status-uptime" // Neu: Uptime-Status

// Angebots-bezogene Tags
export const CACHE_TAG_OFFERS = "offers"
export const CACHE_TAG_OFFER_PREFIX = "offer-"
export const CACHE_TAG_OFFER_FEATURED = "offer-featured"
export const CACHE_TAG_OFFER_LIMITED = "offer-limited"
export const CACHE_TAG_OFFER_EXPIRING_SOON = "offer-expiring-soon"
export const CACHE_TAG_OFFER_FLASH_SALE = "offer-flash-sale" // Neu: Flash-Sales
export const CACHE_TAG_OFFER_BUNDLE = "offer-bundle" // Neu: Bundle-Angebote
export const CACHE_TAG_OFFER_SEASONAL = "offer-seasonal" // Neu: Saisonale Angebote

// Bewertungs-bezogene Tags
export const CACHE_TAG_REVIEWS = "reviews"
export const CACHE_TAG_REVIEW_PREFIX = "review-"
export const CACHE_TAG_REVIEW_PRODUCT_PREFIX = "review-product-"
export const CACHE_TAG_REVIEW_RECENT = "review-recent"
export const CACHE_TAG_REVIEW_FEATURED = "review-featured"
export const CACHE_TAG_REVIEW_VERIFIED = "review-verified" // Neu: Verifizierte Bewertungen
export const CACHE_TAG_REVIEW_HELPFUL = "review-helpful" // Neu: Als hilfreich markierte Bewertungen
export const CACHE_TAG_REVIEW_RATING_PREFIX = "review-rating-" // Neu: Bewertungen nach Sternzahl

// Forum-bezogene Tags
export const CACHE_TAG_FORUM = "forum"
export const CACHE_TAG_FORUM_TOPIC_PREFIX = "forum-topic-"
export const CACHE_TAG_FORUM_CATEGORY_PREFIX = "forum-category-"
export const CACHE_TAG_FORUM_RECENT = "forum-recent"
export const CACHE_TAG_FORUM_POPULAR = "forum-popular"
export const CACHE_TAG_FORUM_FEATURED = "forum-featured"
export const CACHE_TAG_FORUM_ANNOUNCEMENT = "forum-announcement" // Neu: Ankündigungen
export const CACHE_TAG_FORUM_STICKY = "forum-sticky" // Neu: Angeheftete Themen
export const CACHE_TAG_FORUM_UNANSWERED = "forum-unanswered" // Neu: Unbeantwortete Themen

// Benutzer-bezogene Tags
export const CACHE_TAG_USERS = "users"
export const CACHE_TAG_USER_PREFIX = "user-"
export const CACHE_TAG_USER_ROLE_PREFIX = "user-role-"
export const CACHE_TAG_USER_PREMIUM = "user-premium" // Neu: Premium-Benutzer
export const CACHE_TAG_USER_NEW = "user-new" // Neu: Neue Benutzer
export const CACHE_TAG_USER_ACTIVE = "user-active" // Neu: Aktive Benutzer

// Sprach-bezogene Tags
export const CACHE_TAG_LANGUAGE_PREFIX = "lang-"
export const CACHE_TAG_LANGUAGE_DE = "lang-de" // Neu: Deutsch
export const CACHE_TAG_LANGUAGE_EN = "lang-en" // Neu: Englisch
export const CACHE_TAG_LANGUAGE_FR = "lang-fr" // Neu: Französisch
export const CACHE_TAG_LANGUAGE_ES = "lang-es" // Neu: Spanisch
export const CACHE_TAG_LANGUAGE_RU = "lang-ru" // Neu: Russisch

// Seiten-bezogene Tags
export const CACHE_TAG_PAGE_HOME = "page-home"
export const CACHE_TAG_PAGE_PRODUCTS = "page-products"
export const CACHE_TAG_PAGE_PRODUCT_DETAIL_PREFIX = "page-product-"
export const CACHE_TAG_PAGE_FORUM = "page-forum"
export const CACHE_TAG_PAGE_GALLERY = "page-gallery"
export const CACHE_TAG_PAGE_SUPPORT = "page-support"
export const CACHE_TAG_PAGE_FAQ = "page-faq"
export const CACHE_TAG_PAGE_CONTACT = "page-contact"
export const CACHE_TAG_PAGE_ABOUT = "page-about"
export const CACHE_TAG_PAGE_TERMS = "page-terms"
export const CACHE_TAG_PAGE_PRIVACY = "page-privacy"
export const CACHE_TAG_PAGE_BLOG = "page-blog" // Neu: Blog-Seite
export const CACHE_TAG_PAGE_BLOG_POST_PREFIX = "page-blog-post-" // Neu: Blog-Beiträge
export const CACHE_TAG_PAGE_CHECKOUT = "page-checkout" // Neu: Checkout-Seite
export const CACHE_TAG_PAGE_CART = "page-cart" // Neu: Warenkorb-Seite

// Neue Kategorie: Zahlungs-bezogene Tags
export const CACHE_TAG_PAYMENT = "payment"
export const CACHE_TAG_PAYMENT_METHOD_PREFIX = "payment-method-"
export const CACHE_TAG_PAYMENT_CRYPTO = "payment-crypto"
export const CACHE_TAG_PAYMENT_CREDIT_CARD = "payment-credit-card"
export const CACHE_TAG_PAYMENT_PAYPAL = "payment-paypal"

// Neue Kategorie: Geräte-bezogene Tags
export const CACHE_TAG_DEVICE = "device"
export const CACHE_TAG_DEVICE_MOBILE = "device-mobile"
export const CACHE_TAG_DEVICE_DESKTOP = "device-desktop"
export const CACHE_TAG_DEVICE_TABLET = "device-tablet"

// Neue Kategorie: Region-bezogene Tags
export const CACHE_TAG_REGION_PREFIX = "region-"
export const CACHE_TAG_REGION_EU = "region-eu"
export const CACHE_TAG_REGION_NA = "region-na"
export const CACHE_TAG_REGION_ASIA = "region-asia"

// Neue Kategorie: Feature-bezogene Tags
export const CACHE_TAG_FEATURE_PREFIX = "feature-"
export const CACHE_TAG_FEATURE_AIMBOT = "feature-aimbot"
export const CACHE_TAG_FEATURE_ESP = "feature-esp"
export const CACHE_TAG_FEATURE_RADAR = "feature-radar"
export const CACHE_TAG_FEATURE_SPOOFER = "feature-spoofer"

// Hilfsfunktion zum Erstellen eines Produkt-Tags
export function getProductTag(productId: string): string {
  return `${CACHE_TAG_PRODUCT_PREFIX}${productId}`
}

// Hilfsfunktion zum Erstellen eines Kategorie-Tags
export function getCategoryTag(category: string): string {
  return `${CACHE_TAG_PRODUCT_CATEGORY_PREFIX}${category.toLowerCase()}`
}

// Hilfsfunktion zum Erstellen eines Angebots-Tags
export function getOfferTag(offerId: string): string {
  return `${CACHE_TAG_OFFER_PREFIX}${offerId}`
}

// Hilfsfunktion zum Erstellen eines Bewertungs-Tags
export function getReviewTag(reviewId: string): string {
  return `${CACHE_TAG_REVIEW_PREFIX}${reviewId}`
}

// Hilfsfunktion zum Erstellen eines Produkt-Bewertungs-Tags
export function getProductReviewsTag(productId: string): string {
  return `${CACHE_TAG_REVIEW_PRODUCT_PREFIX}${productId}`
}

// Hilfsfunktion zum Erstellen eines Forums-Themen-Tags
export function getForumTopicTag(topicId: string): string {
  return `${CACHE_TAG_FORUM_TOPIC_PREFIX}${topicId}`
}

// Hilfsfunktion zum Erstellen eines Forums-Kategorie-Tags
export function getForumCategoryTag(category: string): string {
  return `${CACHE_TAG_FORUM_CATEGORY_PREFIX}${category.toLowerCase()}`
}

// Hilfsfunktion zum Erstellen eines Benutzer-Tags
export function getUserTag(userId: string): string {
  return `${CACHE_TAG_USER_PREFIX}${userId}`
}

// Hilfsfunktion zum Erstellen eines Benutzergruppen-Tags
export function getUserRoleTag(role: string): string {
  return `${CACHE_TAG_USER_ROLE_PREFIX}${role.toLowerCase()}`
}

// Hilfsfunktion zum Erstellen eines Sprach-Tags
export function getLanguageTag(language: string): string {
  return `${CACHE_TAG_LANGUAGE_PREFIX}${language.toLowerCase()}`
}

// Hilfsfunktion zum Erstellen eines Produkt-Seiten-Tags
export function getProductPageTag(productId: string): string {
  return `${CACHE_TAG_PAGE_PRODUCT_DETAIL_PREFIX}${productId}`
}

// Hilfsfunktion zum Erstellen eines Produkt-Status-Tags
export function getProductStatusTag(productId: string): string {
  return `${CACHE_TAG_PRODUCT_STATUS_PREFIX}${productId}`
}

// Hilfsfunktion zum Erstellen eines Blog-Beitrags-Tags
export function getBlogPostTag(postId: string): string {
  return `${CACHE_TAG_PAGE_BLOG_POST_PREFIX}${postId}`
}

// Hilfsfunktion zum Erstellen eines Zahlungsmethoden-Tags
export function getPaymentMethodTag(method: string): string {
  return `${CACHE_TAG_PAYMENT_METHOD_PREFIX}${method.toLowerCase()}`
}

// Hilfsfunktion zum Erstellen eines Regions-Tags
export function getRegionTag(region: string): string {
  return `${CACHE_TAG_REGION_PREFIX}${region.toLowerCase()}`
}

// Hilfsfunktion zum Erstellen eines Feature-Tags
export function getFeatureTag(feature: string): string {
  return `${CACHE_TAG_FEATURE_PREFIX}${feature.toLowerCase()}`
}

// Hilfsfunktion zum Erstellen eines Bewertungs-Rating-Tags
export function getReviewRatingTag(rating: number): string {
  return `${CACHE_TAG_REVIEW_RATING_PREFIX}${rating}`
}

// Hilfsfunktion zum Kombinieren von Tags zu einem Header-Wert
export function combineTags(tags: string[]): string {
  return [...new Set(tags)].join(",")
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

  // Prüfe auf beliebte Produkte
  if (product.review_count > 50 || product.rating >= 4.5) {
    tags.push(CACHE_TAG_PRODUCT_POPULAR)
  }

  // Prüfe auf Trending-Produkte (basierend auf aktiven Nutzern)
  if (product.statusDetail?.active_users > 300) {
    tags.push(CACHE_TAG_PRODUCT_TRENDING)
  }

  // Füge Feature-Tags hinzu
  if (product.features) {
    product.features.forEach((feature: string) => {
      tags.push(getFeatureTag(feature))
    })
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

  // Prüfe auf Flash-Sale (weniger als 6 Stunden)
  if (offer.expiresAt) {
    const expiryDate = new Date(offer.expiresAt)
    const sixHoursFromNow = new Date()
    sixHoursFromNow.setHours(sixHoursFromNow.getHours() + 6)

    if (expiryDate < sixHoursFromNow) {
      tags.push(CACHE_TAG_OFFER_FLASH_SALE)
    }
  }

  // Prüfe auf Bundle-Angebote
  if (offer.isBundle || (offer.title && offer.title.toLowerCase().includes("bundle"))) {
    tags.push(CACHE_TAG_OFFER_BUNDLE)
  }

  // Prüfe auf saisonale Angebote
  const currentMonth = new Date().getMonth()
  // Weihnachten (Dezember)
  if (currentMonth === 11) {
    tags.push(CACHE_TAG_OFFER_SEASONAL)
  }
  // Black Friday (November)
  if (currentMonth === 10) {
    tags.push(CACHE_TAG_OFFER_SEASONAL)
  }
  // Sommer-Sale (Juni, Juli, August)
  if (currentMonth >= 5 && currentMonth <= 7) {
    tags.push(CACHE_TAG_OFFER_SEASONAL)
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

  // Füge Rating-Tag hinzu
  if (review.rating !== undefined) {
    tags.push(getReviewRatingTag(review.rating))
  }

  // Prüfe auf verifizierte Bewertung
  if (review.verified) {
    tags.push(CACHE_TAG_REVIEW_VERIFIED)
  }

  // Prüfe auf hilfreiche Bewertung
  if (review.helpful_votes > 5) {
    tags.push(CACHE_TAG_REVIEW_HELPFUL)
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

  // Prüfe auf Ankündigung
  if (topic.isAnnouncement) {
    tags.push(CACHE_TAG_FORUM_ANNOUNCEMENT)
  }

  // Prüfe auf angeheftetes Thema
  if (topic.isSticky) {
    tags.push(CACHE_TAG_FORUM_STICKY)
  }

  // Prüfe auf unbeantwortetes Thema
  if (topic.replies === 0) {
    tags.push(CACHE_TAG_FORUM_UNANSWERED)
  }

  return tags
}

// Generiere Cache-Tags für einen Benutzer
export function generateUserCacheTags(user: any): string[] {
  const tags = [CACHE_TAG_USERS, getUserTag(user.id)]

  // Füge Rollen-Tags hinzu
  if (user.role) {
    tags.push(getUserRoleTag(user.role))
  }

  // Prüfe auf Premium-Benutzer
  if (user.isPremium) {
    tags.push(CACHE_TAG_USER_PREMIUM)
  }

  // Prüfe auf neuen Benutzer (weniger als 30 Tage alt)
  if (user.created_at) {
    const createdDate = new Date(user.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (createdDate > thirtyDaysAgo) {
      tags.push(CACHE_TAG_USER_NEW)
    }
  }

  // Prüfe auf aktiven Benutzer (letzte Aktivität in den letzten 7 Tagen)
  if (user.last_active) {
    const lastActiveDate = new Date(user.last_active)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    if (lastActiveDate > sevenDaysAgo) {
      tags.push(CACHE_TAG_USER_ACTIVE)
    }
  }

  // Füge Sprach-Tag hinzu
  if (user.language) {
    tags.push(getLanguageTag(user.language))
  }

  // Füge Regions-Tag hinzu
  if (user.region) {
    tags.push(getRegionTag(user.region))
  }

  return tags
}

// Generiere Cache-Tags für eine Seite basierend auf dem Pfad
export function generatePageCacheTags(path: string): string[] {
  const tags = []

  // Startseite
  if (path === "/" || path === "/home") {
    tags.push(CACHE_TAG_PAGE_HOME)
  }

  // Produktseiten
  if (path === "/products") {
    tags.push(CACHE_TAG_PAGE_PRODUCTS)
    tags.push(CACHE_TAG_PRODUCTS)
  }

  // Produktdetailseite
  const productMatch = path.match(/^\/products\/([^/]+)$/)
  if (productMatch) {
    const productId = productMatch[1]
    tags.push(getProductPageTag(productId))
    tags.push(getProductTag(productId))
    tags.push(CACHE_TAG_PRODUCTS)
  }

  // Forumseiten
  if (path === "/forum") {
    tags.push(CACHE_TAG_PAGE_FORUM)
    tags.push(CACHE_TAG_FORUM)
  }

  // Forumsthema
  const forumTopicMatch = path.match(/^\/forum\/topic\/([^/]+)$/)
  if (forumTopicMatch) {
    const topicId = forumTopicMatch[1]
    tags.push(getForumTopicTag(topicId))
    tags.push(CACHE_TAG_FORUM)
  }

  // Galerie
  if (path === "/gallery") {
    tags.push(CACHE_TAG_PAGE_GALLERY)
  }

  // Support
  if (path === "/support") {
    tags.push(CACHE_TAG_PAGE_SUPPORT)
  }

  // FAQ
  if (path === "/faq") {
    tags.push(CACHE_TAG_PAGE_FAQ)
  }

  // Kontakt
  if (path === "/contact") {
    tags.push(CACHE_TAG_PAGE_CONTACT)
  }

  // Über uns
  if (path === "/about") {
    tags.push(CACHE_TAG_PAGE_ABOUT)
  }

  // Nutzungsbedingungen
  if (path === "/terms") {
    tags.push(CACHE_TAG_PAGE_TERMS)
  }

  // Datenschutz
  if (path === "/privacy") {
    tags.push(CACHE_TAG_PAGE_PRIVACY)
  }

  // Blog
  if (path === "/blog") {
    tags.push(CACHE_TAG_PAGE_BLOG)
  }

  // Blog-Beitrag
  const blogPostMatch = path.match(/^\/blog\/([^/]+)$/)
  if (blogPostMatch) {
    const postId = blogPostMatch[1]
    tags.push(getBlogPostTag(postId))
    tags.push(CACHE_TAG_PAGE_BLOG)
  }

  // Checkout
  if (path === "/checkout") {
    tags.push(CACHE_TAG_PAGE_CHECKOUT)
  }

  // Warenkorb
  if (path === "/cart") {
    tags.push(CACHE_TAG_PAGE_CART)
  }

  return tags
}

// Generiere gerätespezifische Cache-Tags
export function generateDeviceCacheTags(userAgent: string): string[] {
  const tags = [CACHE_TAG_DEVICE]

  // Prüfe auf Mobilgeräte
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    tags.push(CACHE_TAG_DEVICE_MOBILE)

    // Prüfe speziell auf Tablets
    if (/iPad|Android(?!.*Mobile)/i.test(userAgent)) {
      tags.push(CACHE_TAG_DEVICE_TABLET)
    }
  } else {
    // Desktop-Geräte
    tags.push(CACHE_TAG_DEVICE_DESKTOP)
  }

  return tags
}
