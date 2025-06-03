// Konstanten für den lokalen Speicher
const CART_STORAGE_KEY = "lvlup-cart"
const PENDING_REQUESTS_KEY = "lvlup-pending-requests"
const VIEWED_PRODUCTS_KEY = "lvlup-viewed-products"
const USER_PREFERENCES_KEY = "lvlup-user-preferences"

// Typdefinitionen
interface PendingRequest {
  url: string
  method: string
  headers: Record<string, string>
  body?: string
  timestamp: number
}

interface ViewedProduct {
  slug: string
  name: string
  timestamp: number
}

interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: string
  notifications: boolean
}

// Warenkorb-Funktionen
export function saveCartToStorage(cart: any) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error("Failed to save cart to storage:", error)
  }
}

export function getCartFromStorage() {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY)
    return cart ? JSON.parse(cart) : null
  } catch (error) {
    console.error("Failed to get cart from storage:", error)
    return null
  }
}

// Funktionen für ausstehende Anfragen
export function savePendingRequest(request: Omit<PendingRequest, "timestamp">) {
  try {
    const pendingRequests = getPendingRequests()
    const newRequest = { ...request, timestamp: Date.now() }
    pendingRequests.push(newRequest)
    localStorage.setItem(PENDING_REQUESTS_KEY, JSON.stringify(pendingRequests))

    // Wenn der Service Worker verfügbar ist, versuche eine Synchronisierung
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register("sync-cart").catch((error) => {
          console.error("Background sync registration failed:", error)
        })
      })
    }
  } catch (error) {
    console.error("Failed to save pending request:", error)
  }
}

export function getPendingRequests(): PendingRequest[] {
  try {
    const requests = localStorage.getItem(PENDING_REQUESTS_KEY)
    return requests ? JSON.parse(requests) : []
  } catch (error) {
    console.error("Failed to get pending requests:", error)
    return []
  }
}

export function clearPendingRequest(url: string, method: string) {
  try {
    const pendingRequests = getPendingRequests()
    const filteredRequests = pendingRequests.filter((req) => !(req.url === url && req.method === method))
    localStorage.setItem(PENDING_REQUESTS_KEY, JSON.stringify(filteredRequests))
  } catch (error) {
    console.error("Failed to clear pending request:", error)
  }
}

// Funktionen für angesehene Produkte
export function saveViewedProduct(product: Omit<ViewedProduct, "timestamp">) {
  try {
    const viewedProducts = getViewedProducts()

    // Entferne das Produkt, wenn es bereits vorhanden ist
    const filteredProducts = viewedProducts.filter((p) => p.slug !== product.slug)

    // Füge das Produkt am Anfang hinzu
    filteredProducts.unshift({ ...product, timestamp: Date.now() })

    // Begrenze die Anzahl der gespeicherten Produkte auf 20
    const limitedProducts = filteredProducts.slice(0, 20)

    localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(limitedProducts))
  } catch (error) {
    console.error("Failed to save viewed product:", error)
  }
}

export function getViewedProducts(): ViewedProduct[] {
  try {
    const products = localStorage.getItem(VIEWED_PRODUCTS_KEY)
    return products ? JSON.parse(products) : []
  } catch (error) {
    console.error("Failed to get viewed products:", error)
    return []
  }
}

// Funktionen für Benutzereinstellungen
export function saveUserPreferences(preferences: Partial<UserPreferences>) {
  try {
    const currentPreferences = getUserPreferences()
    const updatedPreferences = { ...currentPreferences, ...preferences }
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updatedPreferences))
  } catch (error) {
    console.error("Failed to save user preferences:", error)
  }
}

export function getUserPreferences(): UserPreferences {
  try {
    const preferences = localStorage.getItem(USER_PREFERENCES_KEY)
    return preferences ? JSON.parse(preferences) : { theme: "system", language: "en", notifications: true }
  } catch (error) {
    console.error("Failed to get user preferences:", error)
    return { theme: "system", language: "en", notifications: true }
  }
}

// Offline-Status-Funktionen
export function isOnline(): boolean {
  return navigator.onLine
}

export function addOnlineStatusListener(callback: (online: boolean) => void) {
  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)

  window.addEventListener("online", handleOnline)
  window.addEventListener("offline", handleOffline)

  return () => {
    window.removeEventListener("online", handleOnline)
    window.removeEventListener("offline", handleOffline)
  }
}

// Funktion zum Überprüfen, ob die App als PWA installiert ist
export function isPWAInstalled(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
}

// Funktion zum Überprüfen, ob die App installierbar ist
export function isPWAInstallable(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!("BeforeInstallPromptEvent" in window)) {
      resolve(false)
      return
    }

    let deferredPrompt: any = null

    const promptHandler = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e
      window.removeEventListener("beforeinstallprompt", promptHandler)
      resolve(true)
    }

    window.addEventListener("beforeinstallprompt", promptHandler)

    // Wenn nach 1 Sekunde kein Event ausgelöst wurde, ist die App wahrscheinlich nicht installierbar
    setTimeout(() => {
      window.removeEventListener("beforeinstallprompt", promptHandler)
      resolve(false)
    }, 1000)
  })
}
