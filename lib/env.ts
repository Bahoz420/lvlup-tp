// No changes to this file from the previous correct version.
// Ensure this file is correctly providing the `env` object with all necessary variables.
export const env = {
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",

  // PayPal
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || "",
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  PAYPAL_SANDBOX_MODE: process.env.PAYPAL_SANDBOX_MODE === "true",

  // Site
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || "", // Ensure this is set in your Vercel env vars

  // Database
  DATABASE_URL: process.env.POSTGRES_URL || process.env.DATABASE_URL || "",

  // General
  NODE_ENV: process.env.NODE_ENV || "development",

  get isProduction() {
    return this.NODE_ENV === "production"
  },

  get isDevelopment() {
    return this.NODE_ENV === "development"
  },
} as const

export function validateEnvironment() {
  const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_JWT_SECRET"] as const // Added SUPABASE_JWT_SECRET
  const missing = required.filter((key) => !env[key])

  if (missing.length > 0) {
    const message = `Missing critical environment variables: ${missing.join(", ")}. Please ensure they are set in your Vercel project settings.`
    console.warn(message)
    if (env.isProduction) {
      // In production, this should ideally prevent startup or critical functions
      // For now, we'll log a severe warning. Depending on usage, throwing an error might be better.
      console.error(`CRITICAL ERROR: ${message} Application might not function correctly.`)
    }
  }
}

if (typeof window === "undefined") {
  // Run validation on server-side import
  validateEnvironment()
}
