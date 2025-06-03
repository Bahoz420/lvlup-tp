"use client"
import { usePerformance } from "@/hooks/use-performance"
import { Loader2, Circle } from "lucide-react"

interface SmartLoadingAnimationProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function SmartLoadingAnimation({ size = "md", className }: SmartLoadingAnimationProps) {
  const performance = usePerformance()

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  // High performance: Spinning loader
  if (!performance.shouldReduceAnimations && !performance.prefersReducedMotion) {
    return <Loader2 className={`${sizeClasses[size]} animate-spin ${className}`} />
  }

  // Medium performance: Pulsing circle
  if (performance.deviceType !== "mobile") {
    return <Circle className={`${sizeClasses[size]} animate-pulse ${className}`} />
  }

  // Low performance: Static dots
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-current rounded-full"></div>
        <div className="w-1 h-1 bg-current rounded-full"></div>
        <div className="w-1 h-1 bg-current rounded-full"></div>
      </div>
    </div>
  )
}
