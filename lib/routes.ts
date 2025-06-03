/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/",
  "/products",
  "/products/:slug", // For dynamic product pages
  "/offers/:slug", // For dynamic offer pages
  "/forum",
  "/forum/topic/:id", // For dynamic forum topics
  "/info",
  "/info/setup-guide",
  "/gallery",
  "/faq",
  "/contact",
  "/support",
  "/terms",
  "/privacy",
  "/refund",
  "/cart",
  "/checkout",
  "/purchase-complete",
  "/thank-you",
  "/crypto-payment",
  "/offline",
  "/api/status", // Public status API
  "/api/status/:productId",
  "/api/products/overview",
  "/api/products", // Public product API
  "/api/products/:slug",
  "/api/reviews", // Public reviews API
  "/api/forum/threads", // Public forum threads API
  "/api/offers", // Public offers API
  "/api/optimize-image", // Image optimization endpoint
  "/api/webhooks/product-update", // Webhook for product updates
  "/api/webhooks/stripe", // Stripe webhook
  "/api/webhooks/paypal", // PayPal webhook
  "/manifest.json", // PWA manifest
  "/sw.js", // Service worker
  // Add any other public image/icon paths if necessary, e.g. /logo.png
]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/login",
  "/register",
  "/forgot-password",
  "/auth/login", // API route for login
  "/auth/register", // API route for register
  "/api/login", // Old API route for login (if still used by some client)
  "/api/register", // Old API route for register (if still used by some client)
  "/api/demo-login",
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth"

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard"

/**
 * Routes that require admin privileges.
 * @type {string[]}
 */
export const adminRoutes: string[] = [
  "/admin",
  "/admin/users",
  "/admin/orders",
  "/admin/products",
  "/admin/products/new",
  "/admin/products/:id", // Dynamic admin product edit page
  "/admin/discount-codes",
  "/admin/discount-codes/new",
  "/admin/discount-codes/:id", // Dynamic admin discount edit page
  "/admin/cache",
  "/admin/cache-tags",
  "/admin/email-test",
  "/admin/create-admin",
  "/api/admin/products", // Admin product API
  "/api/status/admin", // Admin status API
]
