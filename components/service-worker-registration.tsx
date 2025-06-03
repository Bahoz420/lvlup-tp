"use client"

import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw } from "lucide-react"

export function ServiceWorkerRegistration() {
  const [isOnline, setIsOnline] = useState(true)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Überprüfe den Online-Status beim Laden
    setIsOnline(navigator.onLine)

    // Event-Listener für Online-/Offline-Status
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "Du bist wieder online",
        description: "Alle Funktionen sind wieder verfügbar",
        duration: 3000,
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "Du bist offline",
        description: "Einige Funktionen sind möglicherweise eingeschränkt",
        variant: "destructive",
        duration: 3000,
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Service Worker nur in Produktionsumgebung registrieren
    const isProduction =
      window.location.hostname !== "localhost" &&
      !window.location.hostname.includes("vusercontent.net") && // Exclude preview environments
      window.location.protocol === "https:"

    if ("serviceWorker" in navigator && isProduction) {
      // Check if the service worker file exists before trying to register it
      fetch("/sw.js")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Service Worker file not found: ${response.status}`)
          }
          return response
        })
        .then(() => {
          // Only register if the file exists and has the correct MIME type
          return navigator.serviceWorker.register("/sw.js")
        })
        .then((reg) => {
          console.log("Service Worker registered successfully")
          setRegistration(reg)

          // Auf Updates prüfen
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true)
                }
              })
            }
          })
        })
        .catch((error) => {
          // Log the error but don't show it to the user in development/preview
          console.warn("Service Worker registration skipped or failed:", error)
        })

      // Auf Controller-Änderungen reagieren
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        // Wenn sich der Controller ändert, ist ein Update verfügbar
        if (isOnline) {
          setIsUpdateAvailable(true)
        }
      })
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      // Sende eine Nachricht an den wartenden Service Worker, um ihn zu aktivieren
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
      setIsUpdateAvailable(false)

      // Seite nach kurzer Verzögerung neu laden
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  if (!isOnline) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md z-50 bg-red-900 border-red-800 text-white">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Offline-Modus</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>Du bist offline. Einige Funktionen sind eingeschränkt.</span>
          <Button
            size="sm"
            variant="outline"
            className="border-red-700 hover:bg-red-800 text-white"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Verbindung wiederherstellen
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (isUpdateAvailable) {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md z-50 bg-blue-900 border-blue-800 text-white">
        <RefreshCw className="h-4 w-4" />
        <AlertTitle>Update verfügbar</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>Eine neue Version der Website ist verfügbar.</span>
          <Button
            size="sm"
            variant="outline"
            className="border-blue-700 hover:bg-blue-800 text-white"
            onClick={updateServiceWorker}
          >
            Jetzt aktualisieren
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
