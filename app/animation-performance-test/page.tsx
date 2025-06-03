"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Monitor, Smartphone, Tablet, Zap, AlertTriangle, CheckCircle } from "lucide-react"

interface PerformanceMetrics {
  fps: number
  frameDrops: number
  memoryUsage: number
  cpuUsage: number
  animationCount: number
  renderTime: number
  deviceType: string
  screenSize: string
  userAgent: string
  timestamp: number
}

interface AnimationTest {
  name: string
  description: string
  element: React.ReactNode
  performance: "good" | "medium" | "poor" | "testing"
}

export default function AnimationPerformanceTest() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [testResults, setTestResults] = useState<AnimationTest[]>([])
  const [deviceInfo, setDeviceInfo] = useState<any>({})
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(0)
  const animationFrameRef = useRef<number>()

  // Device detection
  useEffect(() => {
    const getDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent

      let deviceType = "desktop"
      if (width <= 768) deviceType = "mobile"
      else if (width <= 1024) deviceType = "tablet"

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isTablet = /iPad|Android(?=.*Tablet)|(?=.*\bAndroid\b)(?=.*\b(?:Tablet|Tab)\b)/i.test(userAgent)

      return {
        width,
        height,
        deviceType: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
        userAgent,
        pixelRatio: window.devicePixelRatio || 1,
        hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
        memory: (navigator as any).deviceMemory || "unknown",
        connection: (navigator as any).connection?.effectiveType || "unknown",
      }
    }

    setDeviceInfo(getDeviceInfo())
  }, [])

  // Performance monitoring
  const startMonitoring = () => {
    setIsMonitoring(true)
    frameCountRef.current = 0
    lastTimeRef.current = performance.now()

    const measurePerformance = (currentTime: number) => {
      frameCountRef.current++

      if (currentTime - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current))

        // Get memory usage if available
        const memoryInfo = (performance as any).memory
        const memoryUsage = memoryInfo ? Math.round(memoryInfo.usedJSHeapSize / 1048576) : 0

        // Count active animations
        const animatedElements = document.querySelectorAll('[class*="animate-"]')

        setMetrics({
          fps,
          frameDrops: fps < 55 ? 60 - fps : 0,
          memoryUsage,
          cpuUsage: fps < 30 ? 100 - (fps / 60) * 100 : 0,
          animationCount: animatedElements.length,
          renderTime: currentTime - lastTimeRef.current,
          deviceType: deviceInfo.deviceType,
          screenSize: `${deviceInfo.width}x${deviceInfo.height}`,
          userAgent: deviceInfo.userAgent,
          timestamp: Date.now(),
        })

        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }

      if (isMonitoring) {
        animationFrameRef.current = requestAnimationFrame(measurePerformance)
      }
    }

    animationFrameRef.current = requestAnimationFrame(measurePerformance)
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  // Animation tests
  const animationTests: AnimationTest[] = [
    {
      name: "Floating Orbs",
      description: "Multiple floating orbs with blur effects",
      element: (
        <div className="relative w-full h-32 overflow-hidden bg-purple-900/20 rounded-lg">
          <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-bounce-slow blur-sm"></div>
          <div className="absolute top-8 right-8 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-80 animate-pulse-slow blur-sm"></div>
          <div className="absolute bottom-4 left-1/3 w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-40 animate-bounce-slow blur-md"></div>
        </div>
      ),
      performance: "testing",
    },
    {
      name: "Glass Morphism Cards",
      description: "Backdrop blur with hover animations",
      element: (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
          <div className="text-white font-medium">Hover me!</div>
          <div className="text-purple-200 text-sm">Glass morphism effect</div>
        </div>
      ),
      performance: "testing",
    },
    {
      name: "Gradient Animations",
      description: "Animated gradient backgrounds",
      element: (
        <div className="w-full h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 rounded-lg animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        </div>
      ),
      performance: "testing",
    },
    {
      name: "Spinning Icons",
      description: "Rotating icons with different speeds",
      element: (
        <div className="flex gap-4 items-center justify-center">
          <Sparkles className="h-8 w-8 text-amber-400 animate-spin" />
          <Zap className="h-8 w-8 text-blue-400 animate-pulse" />
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-bounce-slow"></div>
        </div>
      ),
      performance: "testing",
    },
    {
      name: "Marquee Animation",
      description: "Horizontal scrolling text",
      element: (
        <div className="overflow-hidden bg-purple-600/20 rounded-lg p-2">
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="text-white mx-4">🎮 Gaming Performance Test</span>
            <span className="text-amber-400 mx-4">⚡ Speed Test</span>
            <span className="text-green-400 mx-4">✓ Optimization Check</span>
            <span className="text-blue-400 mx-4">🚀 Animation Test</span>
          </div>
        </div>
      ),
      performance: "testing",
    },
  ]

  // Performance evaluation
  const getPerformanceStatus = (fps: number) => {
    if (fps >= 55) return { status: "good", color: "bg-green-500", text: "Excellent" }
    if (fps >= 30) return { status: "medium", color: "bg-yellow-500", text: "Good" }
    return { status: "poor", color: "bg-red-500", text: "Poor" }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Tablet className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent mb-4">
            Animation Performance Monitor
          </h1>
          <p className="text-purple-200 text-lg">
            Test how animations perform across different devices and screen sizes
          </p>
        </div>

        {/* Device Information */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {getDeviceIcon(deviceInfo.deviceType)}
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-purple-300 text-sm">Device Type</div>
                <div className="font-medium capitalize">{deviceInfo.deviceType}</div>
              </div>
              <div>
                <div className="text-purple-300 text-sm">Screen Size</div>
                <div className="font-medium">
                  {deviceInfo.width}×{deviceInfo.height}
                </div>
              </div>
              <div>
                <div className="text-purple-300 text-sm">Pixel Ratio</div>
                <div className="font-medium">{deviceInfo.pixelRatio}x</div>
              </div>
              <div>
                <div className="text-purple-300 text-sm">CPU Cores</div>
                <div className="font-medium">{deviceInfo.hardwareConcurrency}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Real-time Performance Metrics
              <div className="flex gap-2">
                {!isMonitoring ? (
                  <Button onClick={startMonitoring} className="bg-green-600 hover:bg-green-700">
                    Start Monitoring
                  </Button>
                ) : (
                  <Button onClick={stopMonitoring} variant="destructive">
                    Stop Monitoring
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{metrics.fps}</div>
                  <div className="text-purple-300 text-sm mb-2">FPS</div>
                  <Badge className={`${getPerformanceStatus(metrics.fps).color} text-white`}>
                    {getPerformanceStatus(metrics.fps).text}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{metrics.frameDrops}</div>
                  <div className="text-purple-300 text-sm mb-2">Frame Drops</div>
                  <Badge className={metrics.frameDrops > 5 ? "bg-red-500" : "bg-green-500"}>
                    {metrics.frameDrops > 5 ? "High" : "Low"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{metrics.memoryUsage}</div>
                  <div className="text-purple-300 text-sm mb-2">Memory (MB)</div>
                  <Badge className={metrics.memoryUsage > 100 ? "bg-yellow-500" : "bg-green-500"}>
                    {metrics.memoryUsage > 100 ? "High" : "Normal"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{metrics.animationCount}</div>
                  <div className="text-purple-300 text-sm mb-2">Active Animations</div>
                  <Badge className={metrics.animationCount > 20 ? "bg-yellow-500" : "bg-blue-500"}>
                    {metrics.animationCount > 20 ? "Many" : "Normal"}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center text-purple-300 py-8">
                Click "Start Monitoring" to begin performance analysis
              </div>
            )}
          </CardContent>
        </Card>

        {/* Animation Tests */}
        <div className="grid gap-6 md:grid-cols-2">
          {animationTests.map((test, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  {test.name}
                  <Badge
                    className={
                      metrics?.fps >= 55
                        ? "bg-green-500"
                        : metrics?.fps >= 30
                          ? "bg-yellow-500"
                          : metrics?.fps
                            ? "bg-red-500"
                            : "bg-gray-500"
                    }
                  >
                    {metrics?.fps >= 55
                      ? "Smooth"
                      : metrics?.fps >= 30
                        ? "Acceptable"
                        : metrics?.fps
                          ? "Laggy"
                          : "Not Tested"}
                  </Badge>
                </CardTitle>
                <p className="text-purple-300 text-sm">{test.description}</p>
              </CardHeader>
              <CardContent>{test.element}</CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Recommendations */}
        {metrics && (
          <Card className="mt-6 bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {metrics.fps >= 55 ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                )}
                Performance Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-3">
                {metrics.fps < 30 && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <div className="font-medium text-red-300">⚠️ Poor Performance Detected</div>
                    <div className="text-sm text-red-200 mt-1">
                      Consider reducing animation complexity or disabling some effects on this device.
                    </div>
                  </div>
                )}

                {metrics.fps >= 30 && metrics.fps < 55 && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <div className="font-medium text-yellow-300">⚡ Moderate Performance</div>
                    <div className="text-sm text-yellow-200 mt-1">
                      Performance is acceptable but could be optimized for smoother animations.
                    </div>
                  </div>
                )}

                {metrics.fps >= 55 && (
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="font-medium text-green-300">✅ Excellent Performance</div>
                    <div className="text-sm text-green-200 mt-1">
                      All animations are running smoothly on this device.
                    </div>
                  </div>
                )}

                {metrics.memoryUsage > 100 && (
                  <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                    <div className="font-medium text-orange-300">🧠 High Memory Usage</div>
                    <div className="text-sm text-orange-200 mt-1">
                      Consider optimizing animations to reduce memory consumption.
                    </div>
                  </div>
                )}

                {deviceInfo.deviceType === "mobile" && (
                  <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <div className="font-medium text-blue-300">📱 Mobile Device Detected</div>
                    <div className="text-sm text-blue-200 mt-1">
                      Consider implementing reduced motion preferences for better battery life.
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Instructions */}
        <Card className="mt-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">How to Use This Tool</CardTitle>
          </CardHeader>
          <CardContent className="text-purple-200">
            <ol className="list-decimal list-inside space-y-2">
              <li>Click "Start Monitoring" to begin real-time performance tracking</li>
              <li>Interact with the animation test cards to see how they perform</li>
              <li>Monitor the FPS counter - 60 FPS is ideal, 30+ FPS is acceptable</li>
              <li>Check memory usage and frame drops for optimization insights</li>
              <li>Test on different devices (mobile, tablet, desktop) for comparison</li>
              <li>Use the recommendations to optimize animation performance</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
