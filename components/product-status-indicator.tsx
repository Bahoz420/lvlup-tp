"use client"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useSWR from "swr"

// Fetcher-Funktion für SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ProductStatusIndicatorProps {
  initialStatus: "online" | "updating" | "offline"
  productId: string | number
  initialUsers: number
  initialLastUpdated: string
  className?: string
}

export function ProductStatusIndicator({
  initialStatus,
  productId,
  initialUsers,
  initialLastUpdated,
  className = "",
}: ProductStatusIndicatorProps) {
  // SWR für Echtzeit-Updates mit kurzen Revalidierungsintervallen
  const { data, error } = useSWR(`/api/status/${productId}`, fetcher, {
    refreshInterval: 30000, // Alle 30 Sekunden aktualisieren
    dedupingInterval: 15000, // Doppelte Anfragen innerhalb von 15 Sekunden vermeiden
    revalidateOnFocus: true, // Bei Fokuswechsel aktualisieren
    fallbackData: {
      status: initialStatus,
      activeUsers: initialUsers,
      lastUpdated: initialLastUpdated,
    },
  })

  // Status und Benutzer aus den Daten extrahieren
  const status = data?.status || initialStatus
  const activeUsers = data?.activeUsers || initialUsers
  const lastUpdated = data?.lastUpdated || initialLastUpdated

  // Formatiere das Datum für die Anzeige
  const formattedDate = new Date(lastUpdated).toLocaleString()

  // Bestimme die Farbe basierend auf dem Status
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "updating":
        return "bg-amber-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Bestimme den Statustext
  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Online"
      case "updating":
        return "Updating"
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${className}`}>
            <Badge variant="outline" className="flex items-center gap-1.5 py-1">
              <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
              <span className="text-xs font-medium">{getStatusText()}</span>
              {status === "online" && <span className="text-xs text-gray-500">({activeUsers})</span>}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">Status: {getStatusText()}</p>
            {status === "online" && <p>Active users: {activeUsers}</p>}
            <p className="text-xs text-gray-500">Last updated: {formattedDate}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
