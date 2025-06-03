/**
 * Formats a price as Euro amount
 * @param price - The price to format
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted price as string
 */
export function formatPrice(price: number | string, locale = "en-US"): string {
  const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price

  if (isNaN(numericPrice) || numericPrice === null || numericPrice === undefined) {
    console.error("Invalid price for formatting:", price, "Type:", typeof price)
    return "$0.00"
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

/**
 * Calculates the price for a subscription based on the product and subscription type
 * @param productSlug - The product slug (fortnite, cs2, valorant, etc.)
 * @param subscriptionType - The subscription type
 * @returns Calculated price for the subscription
 */
export function calculateSubscriptionPrice(productSlug: string, subscriptionType: string): number {
  console.log("calculateSubscriptionPrice called with:", { productSlug, subscriptionType })

  // Updated pricing structure to match the new subscription types
  const pricingMap: Record<string, Record<string, number>> = {
    fortnite: {
      "3day": 5.99,
      day: 5.99, // Fallback for legacy data
      week: 9.99,
      month: 19.99,
      lifetime: 29.99, // Special offer price (usually 59.99)
    },
    cs2: {
      "3day": 5.99,
      day: 5.99, // Fallback for legacy data
      week: 9.99,
      month: 19.99,
      lifetime: 59.99,
    },
    valorant: {
      "3day": 5.99,
      day: 5.99, // Fallback for legacy data
      week: 9.99,
      month: 19.99,
      lifetime: 59.99,
    },
    apex: {
      "3day": 5.99,
      day: 5.99,
      week: 9.99,
      month: 19.99,
      lifetime: 59.99,
    },
    warzone: {
      "3day": 5.99,
      day: 5.99,
      week: 9.99,
      month: 19.99,
      lifetime: 59.99,
    },
    pubg: {
      "3day": 5.99,
      day: 5.99,
      week: 9.99,
      month: 19.99,
      lifetime: 59.99,
    },
    rust: {
      "3day": 5.99,
      day: 5.99,
      week: 9.99,
      month: 19.99,
      lifetime: 59.99,
    },
    // Default pricing for other products
    default: {
      "3day": 5.99,
      day: 5.99,
      week: 9.99,
      month: 19.99,
      lifetime: 59.99,
    },
  }

  // Ensure we have valid inputs
  if (!productSlug || !subscriptionType) {
    console.error("Missing productSlug or subscriptionType:", { productSlug, subscriptionType })
    return 5.99 // Default fallback price
  }

  const productPricing = pricingMap[productSlug] || pricingMap.default
  const price = productPricing[subscriptionType] || productPricing["3day"] || 5.99

  console.log("Calculated price:", price, "for", productSlug, subscriptionType)
  return price
}

/**
 * Gets the regular price for lifetime (before discount)
 * @param productSlug - The product slug
 * @returns Regular lifetime price
 */
export function getRegularLifetimePrice(productSlug: string): number {
  if (productSlug === "fortnite") {
    return 59.99 // Regular price before special offer
  }
  return 59.99 // Standard lifetime price for other products
}
