"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { isOnline } from "@/lib/offline-storage"
import { cn } from "@/lib/utils"

interface OfflineImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export function OfflineImage({ src, alt, fallbackSrc = "/placeholder.svg", className, ...props }: OfflineImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setImgSrc(src)
    setIsLoaded(false)
  }, [src])

  const handleError = () => {
    if (!isLoaded) {
      setImgSrc(fallbackSrc)
      setIsLoaded(true)
    }
  }

  // Wenn offline und das Bild noch nicht geladen wurde, zeige Fallback
  useEffect(() => {
    if (!isOnline() && !isLoaded) {
      // Versuche das Bild aus dem Cache zu laden
      fetch(src as string)
        .then((response) => {
          if (!response.ok) {
            handleError()
          }
        })
        .catch(() => {
          handleError()
        })
    }
  }, [src, isLoaded])

  return (
    <Image
      {...props}
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      onError={handleError}
      className={cn("w-full", className)}
      sizes={props.sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
    />
  )
}
