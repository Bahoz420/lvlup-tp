"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

// Definiere die Typen für die Preloading-Konfiguration
interface PreloadingConfig {
  path: string
  assets: string[]
}

// Definiere die Props für die NavigationPreloading-Komponente
interface NavigationPreloadingProps {
  configs: PreloadingConfig[]
  hoverDelay?: number
  idleTimeout?: number
}

export function NavigationPreloading({ configs, hoverDelay = 100, idleTimeout = 2000 }: NavigationPreloadingProps) {
  const preloadedPaths = useRef<Set<string>>(new Set())
  const hoverTimers = useRef<Record<string, NodeJS.Timeout>>({})
  const pathname = usePathname()

  useEffect(() => {
    // Preload assets for the current path
    const currentPathConfig = configs.find((config) => config.path === pathname)
    if (currentPathConfig) {
      preloadAssets(currentPathConfig.assets)
      preloadedPaths.current.add(pathname)
    }

    // Set up event listeners for navigation links
    const navLinks = document.querySelectorAll('a[href^="/"]')

    navLinks.forEach((link) => {
      const href = link.getAttribute("href")
      if (!href) return

      // Skip if already preloaded
      if (preloadedPaths.current.has(href)) return

      // Add hover listener
      link.addEventListener("mouseenter", () => {
        // Clear any existing timer
        if (hoverTimers.current[href]) {
          clearTimeout(hoverTimers.current[href])
        }

        // Set a new timer
        hoverTimers.current[href] = setTimeout(() => {
          const config = configs.find((config) => config.path === href)
          if (config) {
            preloadAssets(config.assets)
            preloadedPaths.current.add(href)
          }
        }, hoverDelay)
      })

      // Clear timer on mouse leave
      link.addEventListener("mouseleave", () => {
        if (hoverTimers.current[href]) {
          clearTimeout(hoverTimers.current[href])
          delete hoverTimers.current[href]
        }
      })
    })

    // Preload remaining paths when idle
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(
        () => {
          preloadRemainingPaths()
        },
        { timeout: idleTimeout },
      )
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(preloadRemainingPaths, idleTimeout)
    }

    return () => {
      // Clean up event listeners
      navLinks.forEach((link) => {
        link.removeEventListener("mouseenter", () => {})
        link.removeEventListener("mouseleave", () => {})
      })

      // Clear all timers
      Object.values(hoverTimers.current).forEach((timer) => {
        clearTimeout(timer)
      })
    }
  }, [configs, hoverDelay, idleTimeout, pathname])

  // Function to preload assets
  const preloadAssets = (assets: string[]) => {
    assets.forEach((asset) => {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = asset

      // Determine the correct 'as' attribute based on file extension
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

  // Function to preload remaining paths
  const preloadRemainingPaths = () => {
    configs.forEach((config) => {
      if (!preloadedPaths.current.has(config.path)) {
        preloadAssets(config.assets)
        preloadedPaths.current.add(config.path)
      }
    })
  }

  // This component doesn't render anything
  return null
}
