"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getProductStatuses, formatRelativeTime } from "@/lib/product-service"
import type { SystemStatus } from "@/lib/product-service"

interface StatusDashboardProps {
  initialSystemStatus?: SystemStatus
}

export function StatusDashboard({ initialSystemStatus }: StatusDashboardProps) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(
    initialSystemStatus || {
      productsOnline: 0,
      totalProducts: 0,
      uptime: 99.7,
      activeUsers: 0,
      detectionRisk: 15,
      lastUpdated: new Date().toISOString(),
    },
  )
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch the current system status from the API
  const fetchSystemStatus = async () => {
    setIsRefreshing(true)
    setError(null)

    try {
      const data = await getProductStatuses()
      setSystemStatus(data.system)
    } catch (err) {
      console.error("Error fetching system status:", err)
      setError("Failed to fetch system status")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Refresh the dashboard
  const refreshDashboard = async () => {
    await fetchSystemStatus()
  }

  // Auto-refresh dashboard every 60 seconds
  useEffect(() => {
    // Initial fetch if no initial data
    if (!initialSystemStatus) {
      fetchSystemStatus()
    }

    const interval = setInterval(() => {
      fetchSystemStatus()
    }, 60000)

    return () => clearInterval(interval)
  }, [initialSystemStatus])

  // Format the last refreshed time
  const formatLastRefreshed = () => {
    return formatRelativeTime(systemStatus.lastUpdated)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden mb-10">
      <div className="p-6 flex justify-between items-center border-b border-purple-100">
        <div>
          <h2 className="text-xl font-bold text-purple-800">System Overview</h2>
          <p className="text-sm text-purple-600">Last updated: {formatLastRefreshed()}</p>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-purple-200"
          onClick={refreshDashboard}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh Status</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-purple-100">
        {/* Products Online */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600"
              >
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-500">PRODUCTS ONLINE</h3>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-purple-800">{systemStatus.productsOnline}</span>
                <span className="text-sm text-purple-600">/ {systemStatus.totalProducts}</span>
              </div>
            </div>
          </div>
          <Progress
            value={(systemStatus.productsOnline / systemStatus.totalProducts) * 100}
            className="h-2 bg-purple-100"
            indicatorClassName="bg-purple-600"
          />
        </div>

        {/* Average Uptime */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-500">AVERAGE UPTIME</h3>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-blue-800">{systemStatus.uptime}%</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${i < Math.floor(systemStatus.uptime / 10) ? "bg-blue-500" : "bg-blue-200"}`}
              />
            ))}
          </div>
        </div>

        {/* Active Users */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-600"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-amber-500">ACTIVE USERS</h3>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-amber-800">{systemStatus.activeUsers}+</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < 4 ? "bg-amber-300" : i < 8 ? "bg-amber-400" : "bg-amber-500"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Detection Status */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-500">DETECTION STATUS</h3>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-green-800">
                  {systemStatus.detectionRisk < 20
                    ? "Undetected"
                    : systemStatus.detectionRisk < 50
                      ? "Low Risk"
                      : "High Risk"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-600">Very Low</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  systemStatus.detectionRisk < 20
                    ? "bg-green-500"
                    : systemStatus.detectionRisk < 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${systemStatus.detectionRisk}%` }}
              ></div>
            </div>
            <span className="text-xs text-purple-600">High</span>
          </div>
        </div>
      </div>
    </div>
  )
}
