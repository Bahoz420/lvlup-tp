"use client"

import { useEffect, useRef } from "react"

interface AssetToPreload {
  href: string
  as: "image" | "style" | "script" | "font"
  type?: string
  crossOrigin?: "anonymous" | "use-credentials"
  media?: string
  importance?: "high" | "low" | "auto"
}

interface AssetPreloaderProps {
  assets: AssetToPreload[]
  onlyWhenIdle?: boolean
}

export function AssetPreloader({ assets, onlyWhenIdle = true }: AssetPreloaderProps) {
  const preloadedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const preloadAssets = () => {
      assets.forEach((asset) => {
        // Überprüfen, ob das Asset bereits vorgeladen wurde
        if (preloadedRef.current.has(asset.href)) return

        const link = document.createElement("link")
        link.rel = "preload"
        link.href = asset.href
        link.as = asset.as

        if (asset.type) link.type = asset.type
        if (asset.crossOrigin) link.crossOrigin = asset.crossOrigin
        if (asset.media) link.media = asset.media
        if (asset.importance) link.importance = asset.importance

        document.head.appendChild(link)
        preloadedRef.current.add(asset.href)
      })
    }

    if (onlyWhenIdle) {
      // Nur vorladen, wenn der Browser im Leerlauf ist
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(preloadAssets)
      } else {
        // Fallback für Browser ohne requestIdleCallback
        setTimeout(preloadAssets, 1000)
      }
    } else {
      // Sofort vorladen
      preloadAssets()
    }

    return () => {
      // Cleanup ist nicht wirklich nötig, da die Links im DOM bleiben sollten
    }
  }, [assets, onlyWhenIdle])

  // Diese Komponente rendert nichts sichtbares
  return null
}
