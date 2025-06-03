"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"
import { addOnlineStatusListener } from "@/lib/offline-storage"

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Initialen Status setzen
    setIsOffline(!navigator.onLine)

    // Event-Listener für Online-/Offline-Status
    const removeListener = addOnlineStatusListener((online) => {
      setIsOffline(!online)
    })

    return removeListener
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-red-600 text-white px-3 py-2 rounded-md flex items-center shadow-lg">
      <WifiOff className="h-4 w-4 mr-2" />
      <span className="text-sm font-medium">Offline-Modus</span>
    </div>
  )
}
