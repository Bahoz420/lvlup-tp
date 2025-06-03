"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Users } from "lucide-react"

// Fetcher-Funktion für SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ActiveUsersCounter() {
  // SWR für Echtzeit-Updates mit kurzen Revalidierungsintervallen
  const { data, error } = useSWR("/api/status", fetcher, {
    refreshInterval: 30000, // Alle 30 Sekunden aktualisieren
    revalidateOnFocus: true, // Bei Fokuswechsel aktualisieren
  })

  // Lokaler State für die Animation
  const [count, setCount] = useState(0)
  const [isIncreasing, setIsIncreasing] = useState(false)

  // Aktualisiere den Zähler mit Animation
  useEffect(() => {
    if (!data) return

    const targetCount = data.system.activeUsers

    // Wenn der Zähler noch nicht initialisiert wurde
    if (count === 0) {
      setCount(targetCount)
      return
    }

    // Bestimme, ob der Zähler steigt oder fällt
    setIsIncreasing(targetCount > count)

    // Animiere den Zähler
    const step = Math.ceil(Math.abs(targetCount - count) / 20)
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (targetCount > prevCount) {
          return Math.min(prevCount + step, targetCount)
        } else if (targetCount < prevCount) {
          return Math.max(prevCount - step, targetCount)
        } else {
          clearInterval(interval)
          return prevCount
        }
      })
    }, 50)

    return () => clearInterval(interval)
  }, [data, count])

  if (!data || count === 0) {
    return (
      <div className="flex items-center gap-2 text-purple-600">
        <Users className="h-5 w-5" />
        <span>Loading users...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Users className="h-5 w-5 text-purple-600" />
      <div className="flex items-center">
        <span className="font-medium text-purple-800">{count.toLocaleString()}</span>
        <span className="text-purple-600 ml-1">active users</span>
        {isIncreasing ? <span className="text-green-500 ml-1">↑</span> : <span className="text-red-500 ml-1">↓</span>}
      </div>
    </div>
  )
}
