"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OptimizedIconProps {
  src: string
  alt: string
  size?: number
  className?: string
  fallbackSrc?: string
  inline?: boolean
}

export function OptimizedIcon({
  src,
  alt,
  size = 24,
  className,
  fallbackSrc = "/placeholder.svg",
  inline = false,
}: OptimizedIconProps) {
  const [iconSrc, setIconSrc] = useState<string>(src)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIconSrc(src)
    setIsLoaded(false)

    // Lade das Icon im Voraus
    const img = new Image()
    img.src = src
    img.onload = () => setIsLoaded(true)
    img.onerror = () => setIconSrc(fallbackSrc)
  }, [src, fallbackSrc])

  // Für SVG-Icons
  if (src.endsWith(".svg")) {
    return (
      <img
        src={iconSrc || "/placeholder.svg"}
        alt={alt}
        width={size}
        height={size}
        className={cn(
          "transition-opacity duration-200",
          isLoaded ? "opacity-100" : "opacity-0",
          inline ? "inline-block align-middle" : "block",
          className,
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIconSrc(fallbackSrc)}
        style={{ width: size, height: size }}
      />
    )
  }

  // Für andere Icon-Formate
  return (
    <img
      src={iconSrc || "/placeholder.svg"}
      alt={alt}
      width={size}
      height={size}
      className={cn(
        "transition-opacity duration-200",
        isLoaded ? "opacity-100" : "opacity-0",
        inline ? "inline-block align-middle" : "block",
        className,
      )}
      onLoad={() => setIsLoaded(true)}
      onError={() => setIconSrc(fallbackSrc)}
      style={{ width: size, height: size }}
    />
  )
}
