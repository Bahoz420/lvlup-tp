import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a random activation code
 */
export function generateActivationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Formats a price as currency
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(2)}€`
}

/**
 * Converts a subscription type to a readable label
 */
export function getSubscriptionLabel(subscription: string): string {
  switch (subscription) {
    case "day":
      return "1 Day Access"
    case "week":
      return "1 Week Access"
    case "month":
      return "1 Month Access"
    case "lifetime":
      return "Lifetime Access"
    default:
      return subscription
  }
}
