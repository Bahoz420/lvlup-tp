"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheatStatusService, type AntiCheatInfo } from "@/lib/gaming/cheat-status-service"
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function AntiCheatMonitor() {
  const [antiCheatData, setAntiCheatData] = useState<Record<string, AntiCheatInfo>>({})
  const [loading, setLoading] = useState(true)

  const cheatService = CheatStatusService.getInstance()

  useEffect(() => {
    loadAntiCheatData()
  }, [])

  const loadAntiCheatData = async () => {
    try {
      const games = ["fortnite", "valorant", "apex-legends", "warzone", "pubg", "rust"]
      const data: Record<string, AntiCheatInfo> = {}

      for (const game of games) {
        const info = await cheatService.getAntiCheatInfo(game)
        if (info) {
          data[game] = info
        }
      }

      setAntiCheatData(data)
    } catch (error) {
      console.error("Failed to load anti-cheat data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "bypassed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "detected":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "patching":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const configs = {
      bypassed: { color: "bg-green-100 text-green-800", text: "Bypassed" },
      detected: { color: "bg-red-100 text-red-800", text: "Detected" },
      patching: { color: "bg-yellow-100 text-yellow-800", text: "Patching" },
      unknown: { color: "bg-gray-100 text-gray-800", text: "Unknown" },
    }

    const config = configs[status as keyof typeof configs] || configs.unknown

    return <Badge className={config.color}>{config.text}</Badge>
  }

  const getRiskLevel = (riskFactors: string[]) => {
    if (riskFactors.length >= 3) return { level: "High", color: "text-red-500" }
    if (riskFactors.length >= 2) return { level: "Medium", color: "text-yellow-500" }
    return { level: "Low", color: "text-green-500" }
  }

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-purple-300">Loading anti-cheat data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Anti-Cheat Monitor</h2>
        <p className="text-purple-300">Real-time monitoring of anti-cheat systems and bypass status</p>
      </div>

      {/* Overview Alert */}
      <Alert className="bg-blue-900/20 border-blue-500/30">
        <Shield className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-300">
          <strong>Security Notice:</strong> Anti-cheat systems are constantly evolving. Always check the latest status
          before using any cheat software.
        </AlertDescription>
      </Alert>

      {/* Anti-Cheat Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(antiCheatData).map(([game, info]) => {
          const risk = getRiskLevel(info.riskFactors)

          return (
            <Card key={game} className="bg-gray-900/50 border-purple-500/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {getStatusIcon(info.bypassStatus)}
                      {info.name}
                    </CardTitle>
                    <CardDescription className="text-purple-300">
                      {game.charAt(0).toUpperCase() + game.slice(1).replace("-", " ")} • Version {info.version}
                    </CardDescription>
                  </div>
                  {getStatusBadge(info.bypassStatus)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-purple-300">Last Update</div>
                    <div className="text-white text-sm">{new Date(info.lastUpdate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300">Risk Level</div>
                    <div className={`font-semibold ${risk.color}`}>{risk.level}</div>
                  </div>
                </div>

                {/* Detection Methods */}
                <div>
                  <div className="text-sm text-purple-300 mb-2">Detection Methods</div>
                  <div className="flex flex-wrap gap-1">
                    {info.detectionMethods.map((method, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-purple-400 text-purple-300">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                {info.riskFactors.length > 0 && (
                  <div>
                    <div className="text-sm text-purple-300 mb-2">Risk Factors</div>
                    <div className="space-y-1">
                      {info.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          <span className="text-gray-300">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status-specific alerts */}
                {info.bypassStatus === "detected" && (
                  <Alert className="bg-red-900/20 border-red-500/30">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      <strong>Warning:</strong> This anti-cheat system has detected our bypass. Using cheats for this
                      game is currently high risk.
                    </AlertDescription>
                  </Alert>
                )}

                {info.bypassStatus === "patching" && (
                  <Alert className="bg-yellow-900/20 border-yellow-500/30">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-300">
                      <strong>In Progress:</strong> Our team is working on a new bypass. Check back soon for updates.
                    </AlertDescription>
                  </Alert>
                )}

                {info.bypassStatus === "bypassed" && (
                  <Alert className="bg-green-900/20 border-green-500/30">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      <strong>All Clear:</strong> Anti-cheat bypass is working. Safe to use with normal precautions.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Legend */}
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white text-lg">Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-white">Bypassed</span>
                <span className="text-purple-300 text-sm">- Safe to use</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-white">Detected</span>
                <span className="text-purple-300 text-sm">- High risk, avoid use</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-white">Patching</span>
                <span className="text-purple-300 text-sm">- Working on fix</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-white">Unknown</span>
                <span className="text-purple-300 text-sm">- Status unclear</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
