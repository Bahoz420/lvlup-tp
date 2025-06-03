// Definiere die Preloading-Konfiguration für dynamische Inhalte
export const dynamicContentPreloadingConfig = [
  {
    id: "product-carousel",
    selector: ".product-carousel",
    assets: [
      // JavaScript für das Karussell
      "/_next/static/chunks/carousel.js",
      // Bilder für das Karussell (erste paar Bilder)
      "/fortnite.png",
      "/valorant.png",
      "/apex.png",
    ],
    threshold: 0.1,
    rootMargin: "100px",
  },
  {
    id: "reviews-section",
    selector: ".reviews-section",
    assets: [
      // JavaScript für die Bewertungen
      "/_next/static/chunks/reviews.js",
      // API-Daten
      "/api/reviews",
    ],
    threshold: 0.1,
    rootMargin: "200px",
  },
  {
    id: "video-section",
    selector: ".video-section",
    assets: [
      // JavaScript für den Videoplayer
      "/_next/static/chunks/video-player.js",
      // Vorschaubilder für Videos
      "/video-thumbnail.jpg",
    ],
    threshold: 0.1,
    rootMargin: "300px",
  },
  {
    id: "forum-posts",
    selector: ".forum-posts",
    assets: [
      // JavaScript für die Forumbeiträge
      "/_next/static/chunks/forum-posts.js",
      // API-Daten
      "/api/forum/posts",
    ],
    threshold: 0.1,
    rootMargin: "200px",
  },
  {
    id: "related-products",
    selector: ".related-products",
    assets: [
      // JavaScript für ähnliche Produkte
      "/_next/static/chunks/related-products.js",
      // Bilder für ähnliche Produkte (erste paar Bilder)
      "/warzone.png",
      "/pubg.png",
      "/rust.png",
    ],
    threshold: 0.1,
    rootMargin: "200px",
  },
]
