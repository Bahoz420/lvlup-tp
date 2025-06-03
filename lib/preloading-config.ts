import type { PreloadAsset, PreconnectDomain } from "@/components/critical-preloading"

// Konfiguration für die Startseite
export const homepagePreloadingConfig = {
  // Kritische Assets, die sofort geladen werden sollen
  preloads: [
    // Kritische Schriftarten
    {
      href: "/fonts/inter-var.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    // Hero-Bild
    {
      href: "/abstract-geometric-shapes.png",
      as: "image",
    },
    // Logo
    {
      href: "/logo.png",
      as: "image",
    },
    // Kritisches CSS
    {
      href: "/_next/static/css/critical-home.css",
      as: "style",
    },
  ] as PreloadAsset[],

  // Assets, die mit niedrigerer Priorität geladen werden sollen
  prefetches: [
    // Produktbilder für den ersten Viewport
    {
      href: "/fortnite.png",
      as: "image",
    },
    {
      href: "/valorant.png",
      as: "image",
    },
    {
      href: "/apex.png",
      as: "image",
    },
    // JavaScript für interaktive Elemente
    {
      href: "/_next/static/chunks/pages/products.js",
      as: "script",
    },
  ] as PreloadAsset[],

  // Domains, zu denen eine Verbindung hergestellt werden soll
  preconnects: [
    {
      href: "https://fonts.googleapis.com",
      crossOrigin: true,
    },
    {
      href: "https://fonts.gstatic.com",
      crossOrigin: true,
    },
    {
      href: "https://img.youtube.com",
      crossOrigin: true,
    },
  ] as PreconnectDomain[],

  // Domains, für die DNS-Lookups durchgeführt werden sollen
  dnsPrefetches: ["https://example.com", "https://api.lvlup.io"],
}

// Konfiguration für Produktseiten
export const productPagePreloadingConfig = {
  preloads: [
    // Kritische Schriftarten
    {
      href: "/fonts/inter-var.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    // Logo
    {
      href: "/logo.png",
      as: "image",
    },
    // Kritisches CSS
    {
      href: "/_next/static/css/critical-product.css",
      as: "style",
    },
  ] as PreloadAsset[],

  prefetches: [
    // Ähnliche Produkte
    {
      href: "/api/products/related",
      as: "fetch",
    },
    // Bewertungen
    {
      href: "/api/reviews",
      as: "fetch",
    },
    // JavaScript für den Warenkorb
    {
      href: "/_next/static/chunks/pages/cart.js",
      as: "script",
    },
  ] as PreloadAsset[],

  preconnects: [
    {
      href: "https://fonts.googleapis.com",
      crossOrigin: true,
    },
    {
      href: "https://fonts.gstatic.com",
      crossOrigin: true,
    },
  ] as PreconnectDomain[],

  dnsPrefetches: ["https://api.lvlup.io"],
}

// Konfiguration für die Warenkorb-Seite
export const cartPagePreloadingConfig = {
  preloads: [
    // Kritische Schriftarten
    {
      href: "/fonts/inter-var.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    // Logo
    {
      href: "/logo.png",
      as: "image",
    },
    // Zahlungsmethoden-Icons
    {
      href: "/credit-card-icon.png",
      as: "image",
    },
    {
      href: "/paypal-icon.png",
      as: "image",
    },
    // Kritisches CSS
    {
      href: "/_next/static/css/critical-cart.css",
      as: "style",
    },
  ] as PreloadAsset[],

  prefetches: [
    // Checkout-Seite
    {
      href: "/_next/static/chunks/pages/checkout.js",
      as: "script",
    },
    // Empfohlene Produkte
    {
      href: "/api/products/recommended",
      as: "fetch",
    },
  ] as PreloadAsset[],

  preconnects: [
    {
      href: "https://fonts.googleapis.com",
      crossOrigin: true,
    },
    {
      href: "https://fonts.gstatic.com",
      crossOrigin: true,
    },
    {
      href: "https://api.stripe.com",
      crossOrigin: true,
    },
  ] as PreconnectDomain[],

  dnsPrefetches: ["https://api.lvlup.io", "https://checkout.stripe.com"],
}

// Allgemeine Konfiguration für alle Seiten
export const globalPreloadingConfig = {
  preloads: [
    // Kritische Schriftarten
    {
      href: "/fonts/inter-var.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    // Logo
    {
      href: "/logo.png",
      as: "image",
    },
  ] as PreloadAsset[],

  preconnects: [
    {
      href: "https://fonts.googleapis.com",
      crossOrigin: true,
    },
    {
      href: "https://fonts.gstatic.com",
      crossOrigin: true,
    },
  ] as PreconnectDomain[],

  dnsPrefetches: ["https://api.lvlup.io"],
}

// Hilfsfunktion zum Kombinieren von Preloading-Konfigurationen
export function combinePreloadingConfigs(...configs: any[]) {
  const result = {
    preloads: [] as PreloadAsset[],
    prefetches: [] as PreloadAsset[],
    preconnects: [] as PreconnectDomain[],
    dnsPrefetches: [] as string[],
  }

  // Hilfsfunktion zum Deduplizieren von Arrays basierend auf einem Schlüssel
  const deduplicateByKey = (array: any[], key: string) => {
    const seen = new Set()
    return array.filter((item) => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  }

  // Hilfsfunktion zum Deduplizieren von String-Arrays
  const deduplicateStrings = (array: string[]) => {
    return [...new Set(array)]
  }

  // Kombiniere alle Konfigurationen
  configs.forEach((config) => {
    if (config.preloads) result.preloads.push(...config.preloads)
    if (config.prefetches) result.prefetches.push(...config.prefetches)
    if (config.preconnects) result.preconnects.push(...config.preconnects)
    if (config.dnsPrefetches) result.dnsPrefetches.push(...config.dnsPrefetches)
  })

  // Dedupliziere die Arrays
  result.preloads = deduplicateByKey(result.preloads, "href")
  result.prefetches = deduplicateByKey(result.prefetches, "href")
  result.preconnects = deduplicateByKey(result.preconnects, "href")
  result.dnsPrefetches = deduplicateStrings(result.dnsPrefetches)

  return result
}
