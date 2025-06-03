"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Fetcher-Funktion für SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface SpecialOfferCountdownProps {
  offerId?: string
  featured?: boolean
  productId?: string
}

export function SpecialOfferCountdown({ offerId, featured = true, productId }: SpecialOfferCountdownProps) {
  // Erstelle die URL basierend auf den Parametern
  const getUrl = () => {
    let url = "/api/offers"
    const params = new URLSearchParams()

    if (featured) {
      params.append("featured", "true")
    }

    if (productId) {
      params.append("productId", productId)
    }

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    return url
  }

  // SWR für Echtzeit-Updates mit kurzen Revalidierungsintervallen
  const { data, error } = useSWR(getUrl(), fetcher, {
    refreshInterval: 60000, // Alle 60 Sekunden aktualisieren
    revalidateOnFocus: true, // Bei Fokuswechsel aktualisieren
  })

  // Lokaler State für den Countdown
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
  } | null>(null)

  // Finde das Angebot basierend auf der ID oder nimm das erste
  const offer = offerId ? data?.offers?.find((o: any) => o.id === offerId) : data?.offers?.[0]

  // Aktualisiere den Countdown jede Minute
  useEffect(() => {
    if (!offer) return

    // Initialisiere den Countdown
    setTimeRemaining({
      days: offer.timeRemaining.days,
      hours: offer.timeRemaining.hours,
      minutes: offer.timeRemaining.minutes,
    })

    // Aktualisiere den Countdown jede Minute
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (!prev) return null

        let newMinutes = prev.minutes - 1
        let newHours = prev.hours
        let newDays = prev.days

        if (newMinutes < 0) {
          newMinutes = 59
          newHours -= 1
        }

        if (newHours < 0) {
          newHours = 23
          newDays -= 1
        }

        if (newDays < 0) {
          clearInterval(interval)
          return { days: 0, hours: 0, minutes: 0 }
        }

        return { days: newDays, hours: newHours, minutes: newMinutes }
      })
    }, 60000) // Jede Minute

    return () => clearInterval(interval)
  }, [offer])

  // Wenn keine Daten oder kein Angebot vorhanden ist
  if (!data || !offer) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-4 rounded-lg text-white">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="space-y-2">
          <div className="inline-block bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-bold uppercase">
            Special Offer
          </div>
          <h3 className="text-xl font-bold">{offer.title}</h3>
          <p className="text-purple-200 text-sm">{offer.description}</p>

          <div className="flex items-center gap-2">
            <div className="text-amber-400 text-2xl font-bold">${offer.currentPrice.toFixed(2)}</div>
            <div className="flex flex-col">
              <span className="text-purple-200 line-through text-sm">${offer.originalPrice.toFixed(2)}</span>
              <span className="text-amber-400 font-semibold text-xs">Save {offer.discountPercentage}%</span>
            </div>
          </div>
        </div>

        {timeRemaining && (
          <div className="flex flex-col items-center">
            <span className="text-purple-200 text-xs mb-1">Offer ends in:</span>
            <div className="flex gap-2">
              <div className="bg-purple-950/50 rounded-lg px-2 py-1 text-center min-w-[50px]">
                <div className="text-white text-base font-bold">{timeRemaining.days}</div>
                <div className="text-purple-300 text-xs">Days</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg px-2 py-1 text-center min-w-[50px]">
                <div className="text-white text-base font-bold">{timeRemaining.hours}</div>
                <div className="text-purple-300 text-xs">Hours</div>
              </div>
              <div className="bg-purple-950/50 rounded-lg px-2 py-1 text-center min-w-[50px]">
                <div className="text-white text-base font-bold">{timeRemaining.minutes}</div>
                <div className="text-purple-300 text-xs">Min</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            asChild
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
          >
            <Link href={`/offers/${offer.id}`}>Claim Offer</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-purple-400 text-purple-100 hover:bg-purple-700/30 hover:text-white"
          >
            <Link href={`/products/${offer.productId}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
