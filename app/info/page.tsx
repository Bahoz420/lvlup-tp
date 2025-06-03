export const revalidate = 86400 // Revalidiere die Info-Seite einmal täglich

import { Suspense } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { StatusDashboard } from "@/components/status-dashboard"
import { PerformanceAwareBackground } from "@/components/performance-aware-background"
import { AdaptiveAnimation } from "@/components/adaptive-animation"

// Replace API call with hardcoded data
function SystemStatusSection() {
  // Hardcoded system status data
  const systemStatus = {
    productsOnline: 5,
    totalProducts: 6,
    uptime: 99.7,
    activeUsers: 12483,
    detectionRisk: 15,
    lastUpdated: new Date().toISOString(),
  }

  return (
    <AdaptiveAnimation
      className="transform transition-all duration-1000"
      highPerformance="animate-fade-in-up"
      mediumPerformance="animate-fade-in"
      lowPerformance=""
    >
      <StatusDashboard initialSystemStatus={systemStatus} />
    </AdaptiveAnimation>
  )
}

export default function InfoPage() {
  return (
    <PerformanceAwareBackground className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce-slow blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-30 animate-pulse-slow blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-15 animate-bounce-slow blur-2xl"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-25 animate-pulse-slow blur-lg"></div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 dot-pattern animate-pulse opacity-30"></div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/10 via-transparent to-amber-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
      </div>

      <div className="container py-8 relative z-10">
        <AdaptiveAnimation
          className="flex items-center gap-2 mb-6 text-sm text-black/70"
          highPerformance="animate-fade-in-left"
          mediumPerformance="animate-fade-in"
          lowPerformance=""
        >
          <Link href="/" className="hover:text-black transition-colors duration-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-black">Status</span>
        </AdaptiveAnimation>

        <AdaptiveAnimation
          className="mb-8"
          highPerformance="animate-fade-in-up"
          mediumPerformance="animate-fade-in"
          lowPerformance=""
        >
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4 neon-text">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent animate-pulse">
              Status
            </span>
          </h1>
          <p className="text-black/80 max-w-3xl text-lg">
            Check the current status of our products and services. We provide real-time updates on system performance,
            maintenance schedules, and more.
          </p>
        </AdaptiveAnimation>

        <Suspense
          fallback={
            <div className="glass-effect rounded-xl p-8 animate-pulse">
              <div className="text-black/60">Loading system status...</div>
            </div>
          }
        >
          <SystemStatusSection />
        </Suspense>

        {/* Rest of the page content... */}
        {/* Content removed for brevity */}
      </div>
    </PerformanceAwareBackground>
  )
}
