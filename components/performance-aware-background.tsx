"use client"

import type React from "react"
import { usePerformance } from "@/hooks/use-performance"
import { cn } from "@/lib/utils"

interface PerformanceAwareBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function PerformanceAwareBackground({ children, className, ...props }: PerformanceAwareBackgroundProps) {
  const { prefersReducedMotion, shouldReduceAnimations, deviceType, connectionSpeed } = usePerformance()

  // High performance: Full effects
  const highPerformanceEffects = (
    <>
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce-slow blur-xl"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-30 animate-pulse-slow blur-lg"></div>
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-15 animate-bounce-slow blur-2xl"></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-25 animate-pulse-slow blur-lg"></div>

      {/* Animated Grid */}
      <div className="absolute inset-0 dot-pattern animate-pulse"></div>

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/10 via-transparent to-amber-500/10 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
    </>
  )

  // Medium performance: Reduced effects
  const mediumPerformanceEffects = (
    <>
      {/* Fewer, simpler orbs */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-15 blur-lg"></div>
      <div className="absolute bottom-32 right-20 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-20 blur-md"></div>

      {/* Static grid */}
      <div className="absolute inset-0 dot-pattern opacity-50"></div>

      {/* Simple gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/5 to-amber-500/5"></div>
    </>
  )

  // Low performance: Minimal effects
  const lowPerformanceEffects = (
    <>
      {/* Single static element */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20"></div>
    </>
  )

  const getBackgroundEffects = () => {
    if (prefersReducedMotion || shouldReduceAnimations) {
      return lowPerformanceEffects
    }

    if (deviceType === "mobile" || connectionSpeed === "slow") {
      return mediumPerformanceEffects
    }

    return highPerformanceEffects
  }

  const dynamicClassName = shouldReduceAnimations ? "reduce-animations-active" : ""

  return (
    <div className={cn("relative overflow-hidden performance-aware-bg", className, dynamicClassName)} {...props}>
      <div className="absolute inset-0 overflow-hidden">{getBackgroundEffects()}</div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
