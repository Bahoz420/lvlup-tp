"use client"
import useSWR from "swr"
import { ArrowUp, ArrowDown } from "lucide-react"

// Fetcher-Funktion für SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface DynamicPriceDisplayProps {
  productId: string | number
  initialPrice: number
  subscription: "day" | "week" | "month" | "lifetime"
}

export function DynamicPriceDisplay({ productId, initialPrice, subscription }: DynamicPriceDisplayProps) {
  // SWR für Echtzeit-Updates mit mittleren Revalidierungsintervallen
  const { data, error } = useSWR(`/api/products/${productId}/price?subscription=${subscription}`, fetcher, {
    refreshInterval: 60000, // Alle 60 Sekunden aktualisieren
    revalidateOnFocus: true, // Bei Fokuswechsel aktualisieren
    fallbackData: { price: initialPrice, previousPrice: initialPrice },
  })

  // Preise aus den Daten extrahieren
  const currentPrice = data?.price || initialPrice
  const previousPrice = data?.previousPrice || initialPrice

  // Bestimme, ob der Preis gestiegen oder gefallen ist
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0

  // Formatiere den Preis
  const formattedPrice = `$${currentPrice.toFixed(2)}`
  const formattedPriceChange =
    priceChange !== 0
      ? `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(2)} (${priceChangePercent.toFixed(1)}%)`
      : null

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold text-xl text-amber-500">{formattedPrice}</span>

      {formattedPriceChange && (
        <div className={`text-xs font-medium flex items-center ${priceChange > 0 ? "text-red-500" : "text-green-500"}`}>
          {priceChange > 0 ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
          {formattedPriceChange}
        </div>
      )}
    </div>
  )
}
