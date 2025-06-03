"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HardwareChecker, type SystemInfo, type CompatibilityResult } from "@/lib/gaming/hardware-checker"
import { CheatStatusService } from "@/lib/gaming/cheat-status-service"
import { Cpu, HardDrive, Monitor, Smartphone, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface Props {
  cheatId?: string
}

export function HardwareCompatibilityChecker({ cheatId }: Props) {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedCheat, setSelectedCheat] = useState<string>(cheatId || "fortnite")

  const hardwareChecker = HardwareChecker.getInstance()
  const cheatService = CheatStatusService.getInstance()

  useEffect(() => {
    loadSystemInfo()
  }, [])

  useEffect(() => {
    if (systemInfo && selectedCheat) {
      checkCompatibility()
    }
  }, [systemInfo, selectedCheat])

  const loadSystemInfo = async () => {
    setLoading(true)
    try {
      const info = await hardwareChecker.getSystemInfo()
      setSystemInfo(info)
    } catch (error) {
      console.error("Failed to load system info:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkCompatibility = async () => {
    if (!systemInfo) return

    try {
      const cheat = await cheatService.getCheatStatus(selectedCheat)
      if (!cheat) return

      const result = await hardwareChecker.checkCompatibility(selectedCheat, cheat.hwRequirements)
      setCompatibility(result)
    } catch (error) {
      console.error("Failed to check compatibility:", error)
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "text-green-500"
      case "good":
        return "text-blue-500"
      case "fair":
        return "text-yellow-500"
      case "poor":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-purple-300">Analyzing your system...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* System Information */}
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            System Information
          </CardTitle>
          <CardDescription className="text-purple-300">Your current hardware configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {systemInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CPU Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Processor</span>
                </div>
                <div className="text-white">
                  {systemInfo.cpu.cores} cores • {systemInfo.cpu.architecture}
                </div>
              </div>

              {/* Memory Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Memory</span>
                </div>
                <div className="text-white">
                  {systemInfo.memory.total}GB total • {systemInfo.memory.available}GB available
                </div>
              </div>

              {/* OS Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Operating System</span>
                </div>
                <div className="text-white">
                  {systemInfo.os.name} {systemInfo.os.version} ({systemInfo.os.architecture})
                </div>
              </div>

              {/* Display Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Display</span>
                </div>
                <div className="text-white">
                  {systemInfo.display.resolution} • {systemInfo.display.pixelRatio}x pixel ratio
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compatibility Results */}
      {compatibility && (
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {compatibility.compatible ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              Compatibility Results
            </CardTitle>
            <CardDescription className="text-purple-300">Analysis for {selectedCheat} cheat software</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-purple-300">Compatibility Score</span>
                <span className="text-white font-semibold">{compatibility.score}/100</span>
              </div>
              <Progress
                value={compatibility.score}
                className="h-3"
                indicatorClassName={
                  compatibility.score >= 80
                    ? "bg-green-500"
                    : compatibility.score >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              />
            </div>

            {/* Performance Rating */}
            <div className="flex justify-between items-center">
              <span className="text-purple-300">Expected Performance</span>
              <Badge className={`${getPerformanceColor(compatibility.performance)} bg-gray-800`}>
                {compatibility.performance.charAt(0).toUpperCase() + compatibility.performance.slice(1)}
              </Badge>
            </div>

            {/* Issues */}
            {compatibility.issues.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-white font-medium">Issues Found</h4>
                {compatibility.issues.map((issue, index) => (
                  <Alert key={index} className="bg-gray-800/50 border-gray-700">
                    <div className="flex items-start gap-2">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <AlertDescription className="text-gray-300">
                          <strong className="text-white">{issue.component.toUpperCase()}:</strong> {issue.message}
                          {issue.solution && <div className="mt-1 text-sm text-purple-300">💡 {issue.solution}</div>}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {compatibility.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-medium">Recommendations</h4>
                <ul className="space-y-1">
                  {compatibility.recommendations.map((rec, index) => (
                    <li key={index} className="text-purple-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={loadSystemInfo} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Cpu className="h-4 w-4 mr-2" />
          Re-analyze System
        </Button>
      </div>
    </div>
  )
}
