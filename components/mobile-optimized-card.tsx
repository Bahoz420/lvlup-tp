"use client"

import type React from "react"
import { usePerformance } from "@/hooks/use-performance"
import { cn } from "@/lib/utils"

interface MobileOptimizedCardProps {
  children: React.ReactNode
  className?: string
  enableHover?: boolean
  enableScale?: boolean
  enableBlur?: boolean
}

export function MobileOptimizedCard({
  children,
  className,
  enableHover = true,
  enableScale = true,
  enableBlur = true,
}: MobileOptimizedCardProps) {
  const performance = usePerformance()

  // Base styles
  let cardStyles = "rounded-2xl border border-white/20 shadow-xl transition-all duration-300"

  // Background based on performance
  if (performance.shouldReduceAnimations || !enableBlur) {
    cardStyles += " bg-white/10"
  } else {
    cardStyles += " bg-white/10 backdrop-blur-xl"
  }

  // Hover effects based on device and performance
  if (enableHover && performance.deviceType !== "mobile" && !performance.prefersReducedMotion) {
    cardStyles += " hover:bg-white/20"

    if (enableScale && !performance.shouldReduceAnimations) {
      cardStyles += " hover:scale-105"
    }
  }

  // Touch-friendly styles for mobile
  if (performance.deviceType === "mobile") {
    cardStyles += " active:scale-95 active:bg-white/15"
  }

  return <div className={cn(cardStyles, className)}>{children}</div>
}
