import { LiveStatusDashboard } from "@/components/gaming/live-status-dashboard"
import { HardwareCompatibilityChecker } from "@/components/gaming/hardware-compatibility-checker"
import { AntiCheatMonitor } from "@/components/gaming/anti-cheat-monitor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GamingStatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Gaming Status Center</h1>
          <p className="text-xl text-purple-300">
            Real-time monitoring, hardware compatibility, and anti-cheat status for all gaming software
          </p>
        </div>

        <Tabs defaultValue="status" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-purple-500/20">
            <TabsTrigger
              value="status"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-300"
            >
              Live Status
            </TabsTrigger>
            <TabsTrigger
              value="hardware"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-300"
            >
              Hardware Check
            </TabsTrigger>
            <TabsTrigger
              value="anticheat"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-300"
            >
              Anti-Cheat Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            <LiveStatusDashboard />
          </TabsContent>

          <TabsContent value="hardware" className="space-y-6">
            <HardwareCompatibilityChecker />
          </TabsContent>

          <TabsContent value="anticheat" className="space-y-6">
            <AntiCheatMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
