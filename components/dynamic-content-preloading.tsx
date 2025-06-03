"use client"

import { useEffect, useRef, useState } from "react"

// Definiere die Typen für die Preloading-Konfiguration
interface DynamicContentConfig {
  id: string
  selector: string
  assets: string[]
  threshold?: number
  rootMargin?: string
}

// Definiere die Props für die DynamicContentPreloading-Komponente
interface DynamicContentPreloadingProps {
  configs: DynamicContentConfig[]
}

export function DynamicContentPreloading({ configs }: DynamicContentPreloadingProps) {
  const [loadedConfigs, setLoadedConfigs] = useState<Set<string>>(new Set())
  const observersRef = useRef<Record<string, IntersectionObserver>>({})

  useEffect(() => {
    // Überprüfen, ob IntersectionObserver unterstützt wird
    if (!("IntersectionObserver" in window)) {
      // Fallback: Alle Assets sofort laden
      configs.forEach((config) => {
        if (!loadedConfigs.has(config.id)) {
          preloadAssets(config.assets)
          setLoadedConfigs((prev) => new Set([...prev, config.id]))
        }
      })
      return
    }

    // Für jede Konfiguration einen IntersectionObserver erstellen
    configs.forEach((config) => {
      if (loadedConfigs.has(config.id)) return

      const elements = document.querySelectorAll(config.selector)
      if (elements.length === 0) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !loadedConfigs.has(config.id)) {
              preloadAssets(config.assets)
              setLoadedConfigs((prev) => new Set([...prev, config.id]))

              // Observer entfernen, nachdem die Assets geladen wurden
              observer.disconnect()
              delete observersRef.current[config.id]
            }
          })
        },
        {
          threshold: config.threshold || 0,
          rootMargin: config.rootMargin || "0px",
        },
      )

      // Alle passenden Elemente beobachten
      elements.forEach((element) => {
        observer.observe(element)
      })

      // Observer speichern
      observersRef.current[config.id] = observer
    })

    return () => {
      // Alle Observer bereinigen
      Object.values(observersRef.current).forEach((observer) => {
        observer.disconnect()
      })
      observersRef.current = {}
    }
  }, [configs, loadedConfigs])

  // Funktion zum Preloaden von Assets
  const preloadAssets = (assets: string[]) => {
    assets.forEach((asset) => {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = asset

      // Bestimme das richtige 'as'-Attribut basierend auf der Dateierweiterung
      const extension = asset.split(".").pop()?.toLowerCase()
      if (extension) {
        if (["js", "mjs"].includes(extension)) {
          link.as = "script"
        } else if (["css"].includes(extension)) {
          link.as = "style"
        } else if (["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"].includes(extension)) {
          link.as = "image"
        } else if (["woff", "woff2", "ttf", "otf"].includes(extension)) {
          link.as = "font"
        }
      }

      document.head.appendChild(link)
    })
  }

  // Diese Komponente rendert nichts sichtbares
  return null
}
