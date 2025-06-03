"use client"
import useSWR from "swr"
import { Check, AlertTriangle, X } from "lucide-react"

// Fetcher-Funktion für SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ProductAvailabilityProps {
  productId: string | number
  initialStatus: "online" | "updating" | "offline"
}

export function ProductAvailability({ productId, initialStatus }: ProductAvailabilityProps) {
  // SWR für Echtzeit-Updates mit kurzen Revalidierungsintervallen
  const { data, error } = useSWR(`/api/status/${productId}`, fetcher, {
    refreshInterval: 30000, // Alle 30 Sekunden aktualisieren
    revalidateOnFocus: true, // Bei Fokuswechsel aktualisieren
    fallbackData: { status: initialStatus },
  })

  // Status aus den Daten extrahieren
  const status = data?.status || initialStatus

  // Bestimme die Farbe und das Icon basierend auf dem Status
  const getStatusInfo = () => {
    switch (status) {
      case "online":
        return {
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: <Check className="h-5 w-5 text-green-500" />,
          text: "Available Now",
          description: "This product is online and ready to use.",
        }
      case "updating":
        return {
          color: "text-amber-500",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          text: "Updating",
          description: "This product is currently being updated. It may be unavailable for a short time.",
        }
      case "offline":
        return {
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: <X className="h-5 w-5 text-red-500" />,
          text: "Unavailable",
          description: "This product is currently offline for maintenance.",
        }
      default:
        return {
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
          text: "Unknown Status",
          description: "The status of this product is unknown.",
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className={`p-4 rounded-lg ${statusInfo.bgColor} border ${statusInfo.borderColor} flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-0.5">{statusInfo.icon}</div>
      <div>
        <h4 className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</h4>
        <p className="text-sm text-gray-600">{statusInfo.description}</p>
      </div>
    </div>
  )
}
