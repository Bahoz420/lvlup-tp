"use client"

import type React from "react"
import { usePerformance } from "@/hooks/use-performance"
import { cn } from "@/lib/utils"

interface AdaptiveAnimationProps {
  children: React.ReactNode
  className?: string
  highPerformance?: string
  mediumPerformance?: string
  lowPerformance?: string
  fallback?: string
  disabled?: boolean
}

export function AdaptiveAnimation({
  children,
  className,
  highPerformance = "",
  mediumPerformance = "",
  lowPerformance = "",
  fallback = "",
  disabled = false,
}: AdaptiveAnimationProps) {
  const performance = usePerformance()

  if (disabled || performance.prefersReducedMotion) {
    return <div className={cn(className, fallback)}>{children}</div>
  }

  let animationClass = ""

  if (performance.shouldReduceAnimations) {
    animationClass = lowPerformance
  } else if (performance.deviceType === "mobile" || performance.connectionSpeed === "medium") {
    animationClass = mediumPerformance
  } else {
    animationClass = highPerformance
  }

  return <div className={cn(className, animationClass)}>{children}</div>
}
