"use client"

import { useEffect, useState } from "react"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import useSWR from "swr"

// Fetcher-Funktion für SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Notification {
  id: string
  title: string
  description: string
  type: "info" | "success" | "warning" | "error"
  action?: {
    label: string
    url: string
  }
  expiresAt: string
}

export function RealTimeNotifications() {
  const { toast } = useToast()
  const [shownNotifications, setShownNotifications] = useState<string[]>([])

  // SWR für Echtzeit-Updates mit kurzen Revalidierungsintervallen
  const { data } = useSWR("/api/notifications", fetcher, {
    refreshInterval: 30000, // Alle 30 Sekunden aktualisieren
    revalidateOnFocus: true, // Bei Fokuswechsel aktualisieren
  })

  // Zeige neue Benachrichtigungen an
  useEffect(() => {
    if (!data?.notifications) return

    // Filtere neue Benachrichtigungen
    const now = new Date()
    const newNotifications = data.notifications.filter((notification: Notification) => {
      const isNew = !shownNotifications.includes(notification.id)
      const isValid = new Date(notification.expiresAt) > now
      return isNew && isValid
    })

    // Zeige neue Benachrichtigungen an
    newNotifications.forEach((notification: Notification) => {
      toast({
        title: notification.title,
        description: notification.description,
        variant: notification.type === "error" ? "destructive" : "default",
        action: notification.action ? (
          <ToastAction altText={notification.action.label}>
            <a href={notification.action.url}>{notification.action.label}</a>
          </ToastAction>
        ) : undefined,
      })
    })

    // Aktualisiere die Liste der angezeigten Benachrichtigungen
    setShownNotifications((prev) => [...prev, ...newNotifications.map((n: Notification) => n.id)])
  }, [data, toast])

  return null // Diese Komponente rendert nichts, sie zeigt nur Toasts an
}
