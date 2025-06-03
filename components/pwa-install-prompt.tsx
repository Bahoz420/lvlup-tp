"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X } from "lucide-react"
import { isPWAInstalled, isPWAInstallable } from "@/lib/offline-storage"

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Überprüfe, ob die App bereits installiert ist
    if (isPWAInstalled()) {
      return
    }

    // Überprüfe, ob der Benutzer die Installation bereits abgelehnt hat
    const hasUserDismissedPrompt = localStorage.getItem("pwa-prompt-dismissed")
    if (hasUserDismissedPrompt === "true") {
      return
    }

    // Event-Listener für das beforeinstallprompt-Event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Verhindere, dass der Browser seinen eigenen Dialog anzeigt
      e.preventDefault()
      // Speichere das Event für später
      setDeferredPrompt(e)
      // Zeige den eigenen Installations-Prompt an
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Überprüfe nach 3 Sekunden, ob die App installierbar ist
    const timer = setTimeout(async () => {
      const installable = await isPWAInstallable()
      if (installable && !dismissed) {
        setShowPrompt(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      clearTimeout(timer)
    }
  }, [dismissed])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return
    }

    // Zeige den Browser-Dialog an
    deferredPrompt.prompt()

    // Warte auf die Antwort des Benutzers
    const choiceResult = await deferredPrompt.userChoice

    // Setze deferredPrompt auf null, da es nur einmal verwendet werden kann
    setDeferredPrompt(null)

    // Verstecke den Prompt
    setShowPrompt(false)

    // Speichere die Entscheidung des Benutzers
    if (choiceResult.outcome === "accepted") {
      console.log("Benutzer hat die Installation akzeptiert")
    } else {
      console.log("Benutzer hat die Installation abgelehnt")
      localStorage.setItem("pwa-prompt-dismissed", "true")
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-green-600 bg-gray-900 text-white shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">App installieren</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-gray-400">Installiere lvlup für ein besseres Erlebnis</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <ul className="space-y-1 text-sm">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Schnellerer Zugriff auf alle Funktionen</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Offline-Zugriff auf besuchte Seiten</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Bessere Performance und Benutzererfahrung</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleInstall}>
            <Download className="mr-2 h-4 w-4" />
            Jetzt installieren
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
