"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OptimizedBackgroundProps {
  src: string
  lowQualitySrc?: string
  fallbackColor?: string
  className?: string
  children?: React.ReactNode
  overlay?: boolean
  overlayColor?: string
  overlayOpacity?: number
}

export function OptimizedBackground({
  src,
  lowQualitySrc,
  fallbackColor = "#f0f0f0",
  className,
  children,
  overlay = false,
  overlayColor = "#000000",
  overlayOpacity = 0.5,
}: OptimizedBackgroundProps) {
  const [bgImage, setBgImage] = useState<string>(lowQualitySrc || "")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!src) return

    // Zurücksetzen bei Änderung der Quelle
    setBgImage(lowQualitySrc || "")
    setIsLoaded(false)

    const img = new Image()
    img.src = src

    img.onload = () => {
      setBgImage(src)
      setIsLoaded(true)
    }

    img.onerror = () => {
      // Bei Fehler Fallback-Farbe verwenden
      setBgImage("")
      setIsLoaded(true)
    }
  }, [src, lowQualitySrc])

  return (
    <div
      className={cn(
        "relative bg-cover bg-center bg-no-repeat transition-opacity duration-500",
        isLoaded ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        backgroundColor: fallbackColor,
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
      }}
    >
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
