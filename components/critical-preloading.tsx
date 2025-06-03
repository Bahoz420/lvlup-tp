import React from "react"
import Head from "next/head"

// Definiere die Typen für verschiedene Resource Hints
type ResourceHintType = "preload" | "prefetch" | "preconnect" | "dns-prefetch"

// Interface für ein Asset, das vorgeladen werden soll
interface PreloadAsset {
  href: string
  as?: "script" | "style" | "image" | "font" | "fetch"
  type?: string
  crossOrigin?: "anonymous" | "use-credentials"
  media?: string
  importance?: "high" | "low" | "auto"
}

// Interface für eine Verbindung, die vorhergestellt werden soll
interface PreconnectDomain {
  href: string
  crossOrigin?: boolean
}

// Props für die CriticalPreloading-Komponente
interface CriticalPreloadingProps {
  preloads?: PreloadAsset[]
  prefetches?: PreloadAsset[]
  preconnects?: PreconnectDomain[]
  dnsPrefetches?: string[]
}

export function CriticalPreloading({
  preloads = [],
  prefetches = [],
  preconnects = [],
  dnsPrefetches = [],
}: CriticalPreloadingProps) {
  // Generiere Resource Hints für Preloads
  const preloadLinks = preloads.map((asset, index) => (
    <link
      key={`preload-${index}`}
      rel="preload"
      href={asset.href}
      as={asset.as}
      type={asset.type}
      crossOrigin={asset.crossOrigin}
      media={asset.media}
      importance={asset.importance || "high"}
    />
  ))

  // Generiere Resource Hints für Prefetches
  const prefetchLinks = prefetches.map((asset, index) => (
    <link
      key={`prefetch-${index}`}
      rel="prefetch"
      href={asset.href}
      as={asset.as}
      type={asset.type}
      crossOrigin={asset.crossOrigin}
      media={asset.media}
      importance={asset.importance || "low"}
    />
  ))

  // Generiere Resource Hints für Preconnects
  const preconnectLinks = preconnects.map((domain, index) => (
    <link
      key={`preconnect-${index}`}
      rel="preconnect"
      href={domain.href}
      crossOrigin={domain.crossOrigin ? "anonymous" : undefined}
    />
  ))

  // Generiere Resource Hints für DNS-Prefetches
  const dnsPrefetchLinks = dnsPrefetches.map((domain, index) => (
    <link key={`dns-prefetch-${index}`} rel="dns-prefetch" href={domain} />
  ))

  return React.createElement(
    Head,
    null,
    /* Füge alle Resource Hints zum Head hinzu */
    preloadLinks,
    prefetchLinks,
    preconnectLinks,
    dnsPrefetchLinks,
  )
}

export type { PreloadAsset, PreconnectDomain }
