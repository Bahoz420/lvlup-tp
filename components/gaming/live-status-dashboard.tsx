"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheatStatusService, type CheatStatusData, type CheatStatus } from "@/lib/gaming/cheat-status-service"
import { RefreshCw, Users, Shield, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export function LiveStatusDashboard() {
  const [cheats, setCheats] = useState<CheatStatusData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  const cheatService = CheatStatusService.getInstance()

  useEffect(() => {
    loadCheatStatus()

    if (autoRefresh) {
      const interval = setInterval(loadCheatStatus, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const loadCheatStatus = async () => {
    try {
      const data = await cheatService.getAllCheatStatus()
      setCheats(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to load cheat status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: CheatStatus) => {
    const configs = {
      online: { color: "bg-green-500", text: "Online", icon: CheckCircle },
      offline: { color: "bg-gray-500", text: "Offline", icon: XCircle },
      detected: { color: "bg-red-500", text: "Detected", icon: AlertTriangle },
      updating: { color: "bg-blue-500", text: "Updating", icon: RefreshCw },
      maintenance: { color: "bg-yellow-500", text: "Maintenance", icon: Clock },
    }

    const config = configs[status]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const getRiskBadge = (risk: "low" | "medium" | "high") => {
    const configs = {
      low: { color: "bg-green-100 text-green-800", text: "Low Risk" },
      medium: { color: "bg-yellow-100 text-yellow-800", text: "Medium Risk" },
      high: { color: "bg-red-100 text-red-800", text: "High Risk" },
    }

    return <Badge className={configs[risk].color}>{configs[risk].text}</Badge>
  }

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(1)}%`
  }

  const formatDetectionRate = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Cheat Status</h2>
          <p className="text-purple-300">Real-time monitoring of all gaming software</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-purple-300">Last updated: {lastUpdate.toLocaleTimeString()}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadCheatStatus}
            className="border-purple-400 text-purple-300 hover:bg-purple-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {cheats.filter((c) => c.status === "online").length}
                </div>
                <div className="text-sm text-purple-300">Online</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {cheats.filter((c) => c.status === "detected").length}
                </div>
                <div className="text-sm text-purple-300">Detected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-white">{cheats.reduce((sum, c) => sum + c.activeUsers, 0)}</div>
                <div className="text-sm text-purple-300">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {formatUptime(cheats.reduce((sum, c) => sum + c.uptime, 0) / cheats.length)}
                </div>
                <div className="text-sm text-purple-300">Avg Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cheats.map((cheat) => (
          <Card key={cheat.id} className="bg-gray-900/50 border-purple-500/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    {cheat.name}
                    {getStatusBadge(cheat.status)}
                  </CardTitle>
                  <CardDescription className="text-purple-300">
                    {cheat.game} • Version {cheat.version}
                  </CardDescription>
                </div>
                {getRiskBadge(cheat.riskLevel)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-purple-300">Active Users</div>
                  <div className="text-lg font-semibold text-white flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {cheat.activeUsers}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-purple-300">Uptime</div>
                  <div className="text-lg font-semibold text-white">{formatUptime(cheat.uptime)}</div>
                </div>
              </div>

              {/* Detection Rate */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-purple-300">Detection Rate</span>
                  <span className="text-white">{formatDetectionRate(cheat.detectionRate)}</span>
                </div>
                <Progress
                  value={cheat.detectionRate * 100}
                  className="h-2"
                  indicatorClassName={
                    cheat.detectionRate < 0.05
                      ? "bg-green-500"
                      : cheat.detectionRate < 0.2
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }
                />
              </div>

              {/* Anti-Cheat Status */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-300">Anti-Cheat Status</span>
                <Badge
                  className={
                    cheat.antiCheatStatus === "bypassed"
                      ? "bg-green-100 text-green-800"
                      : cheat.antiCheatStatus === "detected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {cheat.antiCheatStatus.charAt(0).toUpperCase() + cheat.antiCheatStatus.slice(1)}
                </Badge>
              </div>

              {/* Features */}
              <div>
                <div className="text-sm text-purple-300 mb-2">Features</div>
                <div className="flex flex-wrap gap-1">
                  {cheat.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs border-purple-400 text-purple-300">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Last Update */}
              <div className="text-xs text-purple-400">
                Last updated: {new Date(cheat.lastUpdate).toLocaleString()}
                {cheat.nextUpdate && (
                  <span className="ml-2">• Next update: {new Date(cheat.nextUpdate).toLocaleString()}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
