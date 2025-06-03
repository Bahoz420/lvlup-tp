import { NextResponse } from "next/server"

// Types for status metrics
interface StatusMetrics {
  uptime: {
    daily: number[]
    weekly: number[]
    monthly: number[]
  }
  activeUsers: {
    daily: number[]
    weekly: number[]
    monthly: number[]
  }
  incidents: {
    daily: number
    weekly: number
    monthly: number
    total: number
  }
  responseTime: {
    average: number
    p95: number
    p99: number
  }
}

// Generate random metrics data
function generateMetrics(): StatusMetrics {
  // Generate random uptime percentages (95-100%)
  const generateUptimeData = (count: number) => Array.from({ length: count }, () => 95 + Math.random() * 5)

  // Generate random user counts
  const generateUserData = (count: number, base: number) =>
    Array.from({ length: count }, () => Math.floor(base * (0.8 + Math.random() * 0.4)))

  return {
    uptime: {
      daily: generateUptimeData(24),
      weekly: generateUptimeData(7),
      monthly: generateUptimeData(30),
    },
    activeUsers: {
      daily: generateUserData(24, 2000),
      weekly: generateUserData(7, 2000),
      monthly: generateUserData(30, 2000),
    },
    incidents: {
      daily: Math.floor(Math.random() * 2),
      weekly: Math.floor(Math.random() * 3) + 1,
      monthly: Math.floor(Math.random() * 5) + 3,
      total: Math.floor(Math.random() * 20) + 10,
    },
    responseTime: {
      average: Math.floor(50 + Math.random() * 30),
      p95: Math.floor(80 + Math.random() * 40),
      p99: Math.floor(120 + Math.random() * 50),
    },
  }
}

// In-memory cache for metrics
// In a real app, this would be stored in a database
const metricsCache: Record<string, StatusMetrics> = {}

// GET handler for retrieving metrics
export async function GET(request: Request) {
  // Get the product ID from the query string
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId") || "system"

  // Generate metrics if they don't exist in the cache
  if (!metricsCache[productId]) {
    metricsCache[productId] = generateMetrics()
  }

  return NextResponse.json({
    success: true,
    metrics: metricsCache[productId],
  })
}
