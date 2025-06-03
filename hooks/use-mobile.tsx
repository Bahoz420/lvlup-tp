"use client"

import { useState, useEffect } from "react"

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Initiale Überprüfung
    setIsMobile(window.innerWidth < breakpoint)

    // Event-Handler für Größenänderungen
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Event-Listener hinzufügen
    window.addEventListener("resize", handleResize)

    // Event-Listener entfernen beim Unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [breakpoint])

  return isMobile
}
