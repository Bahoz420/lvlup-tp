"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"

// Omit 'onError' from the props that can be passed to OptimizedImage
// This prevents passing function props from Server Components if 'onError' was used.
interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg?height=200&width=300", // Added query to fallback
  // The `onError` prop is not accepted from outside due to Omit in OptimizedImageProps
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [errorOccurred, setErrorOccurred] = useState(false)

  useEffect(() => {
    setCurrentSrc(src)
    setErrorOccurred(false) // Reset error state when src changes
  }, [src])

  // Internal error handler for the Next.js Image component
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!errorOccurred) {
      // Prevent infinite loops if fallback also fails
      console.warn(`OptimizedImage: Error loading image: ${String(src)}. Falling back to ${fallbackSrc}`)
      setCurrentSrc(fallbackSrc)
      setErrorOccurred(true)
    }
    // Note: Any external onError prop passed to <OptimizedImage> would have been caught by TypeScript
    // due to the Omit in props, but this internal handler is for the <Image> component itself.
  }

  return (
    <Image
      src={currentSrc || fallbackSrc} // Ensure src is always a valid string
      alt={alt}
      onError={handleError} // Use the internal handler
      {...props}
    />
  )
}
