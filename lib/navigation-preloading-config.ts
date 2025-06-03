// Definiere die Preloading-Konfiguration für die Navigation
export const navigationPreloadingConfig = [
  {
    path: "/",
    assets: [
      // JavaScript-Chunks
      "/_next/static/chunks/pages/index.js",
      // CSS
      "/_next/static/css/index.css",
      // Bilder
      "/abstract-geometric-shapes.png",
      "/fortnite.png",
      "/valorant.png",
      "/apex.png",
    ],
  },
  {
    path: "/products",
    assets: [
      // JavaScript-Chunks
      "/_next/static/chunks/pages/products.js",
      // CSS
      "/_next/static/css/products.css",
      // Bilder
      "/fortnite.png",
      "/valorant.png",
      "/apex.png",
      "/warzone.png",
      "/pubg.png",
      "/rust.png",
    ],
  },
  {
    path: "/cart",
    assets: [
      // JavaScript-Chunks
      "/_next/static/chunks/pages/cart.js",
      // CSS
      "/_next/static/css/cart.css",
      // Bilder
      "/credit-card-icon.png",
      "/paypal-icon.png",
      "/bitcoin-icon.png",
      "/ethereum-icon.png",
    ],
  },
  {
    path: "/checkout",
    assets: [
      // JavaScript-Chunks
      "/_next/static/chunks/pages/checkout.js",
      // CSS
      "/_next/static/css/checkout.css",
      // Bilder
      "/credit-card-icon.png",
      "/paypal-icon.png",
      "/bitcoin-icon.png",
      "/ethereum-icon.png",
    ],
  },
  {
    path: "/gallery",
    assets: [
      // JavaScript-Chunks
      "/_next/static/chunks/pages/gallery.js",
      // CSS
      "/_next/static/css/gallery.css",
      // Bilder (erste paar Bilder der Galerie)
      "/gaming-software-interface.png",
    ],
  },
  {
    path: "/forum",
    assets: [
      // JavaScript-Chunks
      "/_next/static/chunks/pages/forum.js",
      // CSS
      "/_next/static/css/forum.css",
    ],
  },
  {
    path: "/support",
    assets: [
      // JavaScript-Chunks
      "/_next/static/chunks/pages/support.js",
      // CSS
      "/_next/static/css/support.css",
    ],
  },
  {
    path: "/contact",
    assets: [
      // JavaScript-Chunks
      "/_next/static/chunks/pages/contact.js",
      // CSS
      "/_next/static/css/contact.css",
    ],
  },
  {
    path: "/login",
    assets: [
      // JavaScript-Chunks
      "/_next/static/chunks/pages/login.js",
      // CSS
      "/_next/static/css/login.css",
    ],
  },
  {
    path: "/register",
    assets: [
      // JavaScript-Chunks
      "/_next/static/chunks/pages/register.js",
      // CSS
      "/_next/static/css/register.css",
    ],
  },
]
