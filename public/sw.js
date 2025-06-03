// Service Worker für lvlup-website
// Content-Type: application/javascript

const CACHE_NAME = "lvlup-cache-v1"

// Assets, die beim Installieren des Service Workers gecacht werden sollen
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/logo.png",
  "/logo-white.png",
  "/noise.png",
  "/fortnite.png",
  "/valorant.png",
  "/apex.png",
  "/warzone.png",
  "/pubg.png",
  "/rust.png",
  "/credit-card-icon.png",
  "/paypal-icon.png",
  "/bitcoin-icon.png",
  "/ethereum-icon.png",
  "/gaming-software-interface.png",
  "/abstract-geometric-shapes.png",
]

// Installation des Service Workers
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Precaching assets")
        return cache.addAll(PRECACHE_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Aktivierung des Service Workers
self.addEventListener("activate", (event) => {
  // Alte Caches löschen
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch-Event-Handler
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // API-Anfragen mit Network-First-Strategie behandeln
  if (event.request.url.includes("/api/")) {
    event.respondWith(networkFirstStrategy(event.request))
    return
  }

  // Statische Assets mit Cache-First-Strategie behandeln
  if (
    event.request.destination === "style" ||
    event.request.destination === "script" ||
    event.request.destination === "font" ||
    event.request.url.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    event.respondWith(cacheFirstStrategy(event.request))
    return
  }

  // HTML-Seiten mit Network-First-Strategie behandeln
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/offline")
      }),
    )
    return
  }

  // Standardstrategie: Stale-While-Revalidate
  event.respondWith(staleWhileRevalidateStrategy(event.request))
})

// Cache-First-Strategie
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    // Aktualisiere den Cache im Hintergrund
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, response))
        }
      })
      .catch(() => {})
    return cachedResponse
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      const responseToCache = response.clone()
      caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache))
    }
    return response
  } catch (error) {
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    })
  }
}

// Network-First-Strategie
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const responseToCache = response.clone()
      caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache))
    }
    return response
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Wenn es sich um eine API-Anfrage handelt, gib einen JSON-Fehler zurück
    if (request.url.includes("/api/")) {
      return new Response(JSON.stringify({ error: "You are offline" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    })
  }
}

// Stale-While-Revalidate-Strategie
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request)

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache))
      }
      return response
    })
    .catch(() => {
      // Wenn das Netzwerk fehlschlägt, gib einen Fehler zurück
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      })
    })

  return cachedResponse || fetchPromise
}

// Synchronisierung im Hintergrund
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-cart") {
    event.waitUntil(syncCart())
  }
})

// Funktion zum Synchronisieren des Warenkorbs
async function syncCart() {
  try {
    const requests = await getStoredCartRequests()

    for (const request of requests) {
      await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      })
    }

    await clearStoredCartRequests()
  } catch (error) {
    console.error("Background sync failed:", error)
  }
}

// Hilfsfunktionen für die Speicherung von Anfragen
async function getStoredCartRequests() {
  return []
}

async function clearStoredCartRequests() {
  // Implementierung zum Löschen gespeicherter Anfragen
}

// Push-Benachrichtigungen
self.addEventListener("push", (event) => {
  const data = event.data.json()

  const options = {
    body: data.body,
    icon: "/logo.png",
    badge: "/logo.png",
    data: {
      url: data.url,
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Klick auf Benachrichtigung
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})
