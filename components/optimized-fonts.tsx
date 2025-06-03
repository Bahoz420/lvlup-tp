"use client"

import type React from "react"

import { useEffect } from "react"
import { inter, robotoMono } from "@/lib/font-optimization"

interface OptimizedFontsProps {
  children: React.ReactNode
}

export function OptimizedFonts({ children }: OptimizedFontsProps) {
  useEffect(() => {
    // Schriftarten vorladen
    const preloadFonts = () => {
      const fontUrls = [
        // Inter
        "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
        // Roboto Mono
        "https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.woff2",
      ]

      fontUrls.forEach((url) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.href = url
        link.as = "font"
        link.type = "font/woff2"
        link.crossOrigin = "anonymous"
        document.head.appendChild(link)
      })
    }

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preloadFonts)
    } else {
      setTimeout(preloadFonts, 1000)
    }
  }, [])

  return <div className={`${inter.variable} ${robotoMono.variable} font-sans`}>{children}</div>
}
