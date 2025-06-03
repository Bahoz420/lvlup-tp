"use client" // Hooks that use client-side features or state must be client-side

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface PerformanceContextType {
  shouldReduceAnimations: boolean
  isLowPowerMode: boolean
  isDataSaverMode: boolean
  effectiveConnectionType: string | null
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false)
  const [isLowPowerMode, setIsLowPowerMode] = useState(false)
  const [isDataSaverMode, setIsDataSaverMode] = useState(false)
  const [effectiveConnectionType, setEffectiveConnectionType] = useState<string | null>(null)

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setShouldReduceAnimations(mediaQuery.matches)
    const handleChange = () => setShouldReduceAnimations(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)

    // Check for low power mode (conceptual, browser support varies)
    // For example, on Apple devices, this might be detectable via battery status API nuances
    // This is a simplified check
    if (typeof navigator.getBattery === "function") {
      navigator.getBattery().then((battery) => {
        setIsLowPowerMode(battery.level <= 0.2 || (battery.charging === false && battery.level <= 0.5)) // Example logic
      })
    }

    // Check for data saver mode (navigator.connection.saveData)
    // @ts-ignore
    if (navigator.connection) {
      // @ts-ignore
      setIsDataSaverMode(navigator.connection.saveData === true)
      // @ts-ignore
      setEffectiveConnectionType(navigator.connection.effectiveType)

      // @ts-ignore
      const handleConnectionChange = () => {
        // @ts-ignore
        setIsDataSaverMode(navigator.connection.saveData === true)
        // @ts-ignore
        setEffectiveConnectionType(navigator.connection.effectiveType)
      }
      // @ts-ignore
      navigator.connection.addEventListener("change", handleConnectionChange)
      // @ts-ignore
      return () => navigator.connection.removeEventListener("change", handleConnectionChange)
    }

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const value = { shouldReduceAnimations, isLowPowerMode, isDataSaverMode, effectiveConnectionType }

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>
}

export function usePerformance(): PerformanceContextType {
  const context = useContext(PerformanceContext)
  if (context === undefined) {
    // Fallback values if used outside of provider, though ideally it shouldn't be.
    // This helps prevent crashes during SSR/build if context is not available.
    console.warn("usePerformance used outside of PerformanceProvider. Using default (non-performant) values.")
    return {
      shouldReduceAnimations: false,
      isLowPowerMode: false,
      isDataSaverMode: false,
      effectiveConnectionType: "4g", // Assume good connection
    }
  }
  return context
}
