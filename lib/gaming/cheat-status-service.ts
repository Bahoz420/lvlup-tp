import { createClient as createServerSupabaseClient } from "@/utils/supabase/server" // Use the standardized server client
// Removed: import { createClient } from "@/lib/supabase" - this was problematic

export type CheatStatus = "online" | "offline" | "detected" | "updating" | "maintenance"
export type AntiCheatStatus = "bypassed" | "detected" | "unknown" | "patching"
export type GameVersion = "latest" | "outdated" | "unsupported"

export interface CheatStatusData {
  id: string
  name: string
  game: string
  status: CheatStatus
  antiCheatStatus: AntiCheatStatus
  gameVersion: GameVersion
  lastUpdate: string
  nextUpdate?: string
  activeUsers: number
  detectionRate: number
  uptime: number
  features: string[]
  supportedVersions: string[]
  hwRequirements: HardwareRequirements
  riskLevel: "low" | "medium" | "high"
  statusHistory: StatusHistoryEntry[]
}

export interface HardwareRequirements {
  minCpuCores: number
  minRamGb: number
  supportedOs: string[]
  gpuRequired: boolean
  diskSpaceGb: number
}

export interface StatusHistoryEntry {
  timestamp: string
  status: CheatStatus
  reason?: string
  duration?: number
}

export interface AntiCheatInfo {
  name: string
  version: string
  lastUpdate: string
  bypassStatus: AntiCheatStatus
  detectionMethods: string[]
  riskFactors: string[]
}

// Mock data for demonstration
const mockCheatData: CheatStatusData[] = [
  {
    id: "fortnite",
    name: "lvlup Fortnite",
    game: "Fortnite",
    status: "online",
    antiCheatStatus: "bypassed",
    gameVersion: "latest",
    lastUpdate: "2024-01-15T10:30:00Z",
    nextUpdate: "2024-01-16T02:00:00Z",
    activeUsers: 476,
    detectionRate: 0.02,
    uptime: 99.7,
    features: ["Aimbot", "ESP", "Radar Hack", "HWID Spoofer"],
    supportedVersions: ["28.10", "28.20", "28.30"],
    hwRequirements: {
      minCpuCores: 4,
      minRamGb: 8,
      supportedOs: ["Windows 10", "Windows 11"],
      gpuRequired: true,
      diskSpaceGb: 2,
    },
    riskLevel: "low",
    statusHistory: [
      { timestamp: "2024-01-15T10:30:00Z", status: "online", duration: 1440 },
      { timestamp: "2024-01-14T10:30:00Z", status: "updating", reason: "Game patch", duration: 120 },
      { timestamp: "2024-01-14T08:30:00Z", status: "online", duration: 2880 },
    ],
  },
  {
    id: "valorant",
    name: "lvlup Valorant",
    game: "Valorant",
    status: "online",
    antiCheatStatus: "bypassed",
    gameVersion: "latest",
    lastUpdate: "2024-01-14T15:45:00Z",
    activeUsers: 389,
    detectionRate: 0.01,
    uptime: 98.9,
    features: ["Aimbot", "Wallhack", "Triggerbot", "Anti-Recoil"],
    supportedVersions: ["8.0.1", "8.0.2"],
    hwRequirements: {
      minCpuCores: 4,
      minRamGb: 4,
      supportedOs: ["Windows 10", "Windows 11"],
      gpuRequired: false,
      diskSpaceGb: 1.5,
    },
    riskLevel: "medium",
    statusHistory: [
      { timestamp: "2024-01-14T15:45:00Z", status: "online", duration: 1200 },
      { timestamp: "2024-01-14T12:45:00Z", status: "detected", reason: "Vanguard update", duration: 180 },
      { timestamp: "2024-01-14T09:45:00Z", status: "online", duration: 1800 },
    ],
  },
  {
    id: "apex-legends",
    name: "lvlup Apex Legends",
    game: "Apex Legends",
    status: "detected",
    antiCheatStatus: "detected",
    gameVersion: "latest",
    lastUpdate: "2024-01-13T20:15:00Z",
    nextUpdate: "2024-01-16T12:00:00Z",
    activeUsers: 0,
    detectionRate: 0.85,
    uptime: 45.2,
    features: ["Aimbot", "ESP", "Item ESP", "No Recoil"],
    supportedVersions: ["19.1.0"],
    hwRequirements: {
      minCpuCores: 4,
      minRamGb: 6,
      supportedOs: ["Windows 10", "Windows 11"],
      gpuRequired: true,
      diskSpaceGb: 2.5,
    },
    riskLevel: "high",
    statusHistory: [
      { timestamp: "2024-01-13T20:15:00Z", status: "detected", reason: "EAC update", duration: 2880 },
      { timestamp: "2024-01-11T20:15:00Z", status: "online", duration: 2880 },
      { timestamp: "2024-01-10T20:15:00Z", status: "updating", reason: "Bypass patch", duration: 240 },
    ],
  },
]

const antiCheatSystems: Record<string, AntiCheatInfo> = {
  fortnite: {
    name: "BattlEye",
    version: "1.7.2",
    lastUpdate: "2024-01-14T08:00:00Z",
    bypassStatus: "bypassed",
    detectionMethods: ["Memory scanning", "Process monitoring", "Network analysis"],
    riskFactors: ["Frequent updates", "Machine learning detection"],
  },
  valorant: {
    name: "Vanguard",
    version: "2.1.8",
    lastUpdate: "2024-01-14T12:00:00Z",
    bypassStatus: "bypassed",
    detectionMethods: ["Kernel-level monitoring", "Hardware fingerprinting", "Behavioral analysis"],
    riskFactors: ["Ring-0 access", "Hardware bans", "Statistical analysis"],
  },
  "apex-legends": {
    name: "Easy Anti-Cheat",
    version: "3.2.1",
    lastUpdate: "2024-01-13T18:00:00Z",
    bypassStatus: "detected",
    detectionMethods: ["File integrity checks", "Memory protection", "API hooking detection"],
    riskFactors: ["Recent update", "Improved detection algorithms"],
  },
}

export class CheatStatusService {
  private static instance: CheatStatusService
  private supabase = createServerSupabaseClient() // Use the server client

  static getInstance(): CheatStatusService {
    if (!CheatStatusService.instance) {
      CheatStatusService.instance = new CheatStatusService()
    }
    return CheatStatusService.instance
  }

  async getAllCheatStatus(): Promise<CheatStatusData[]> {
    // In production, this would fetch from Supabase
    // Example: const { data, error } = await this.supabase.from('cheat_statuses').select('*');
    // if (error) { console.error(error); return []; }
    // return data as CheatStatusData[];
    return mockCheatData
  }

  async getCheatStatus(cheatId: string): Promise<CheatStatusData | null> {
    // Example: const { data, error } = await this.supabase.from('cheat_statuses').select('*').eq('id', cheatId).single();
    // if (error) { console.error(error); return null; }
    // return data as CheatStatusData | null;
    const cheat = mockCheatData.find((c) => c.id === cheatId)
    return cheat || null
  }

  async getAntiCheatInfo(game: string): Promise<AntiCheatInfo | null> {
    // Example: const { data, error } = await this.supabase.from('anticheat_info').select('*').eq('game_id', game).single();
    // if (error) { console.error(error); return null; }
    // return data as AntiCheatInfo | null;
    return antiCheatSystems[game] || null
  }

  async updateCheatStatus(cheatId: string, status: CheatStatus, reason?: string): Promise<boolean> {
    // In production, this would update Supabase and trigger real-time updates
    // Example: const { error } = await this.supabase.from('cheat_statuses').update({ status, last_update: new Date().toISOString() }).eq('id', cheatId);
    // if (error) { console.error(error); return false; }
    // // Also update status history
    // return true;
    const cheat = mockCheatData.find((c) => c.id === cheatId)
    if (cheat) {
      cheat.status = status
      cheat.lastUpdate = new Date().toISOString()
      cheat.statusHistory.unshift({
        timestamp: new Date().toISOString(),
        status,
        reason,
      })
      return true
    }
    return false
  }

  async checkForUpdates(): Promise<{ hasUpdates: boolean; updates: any[] }> {
    // Simulate checking for game/anti-cheat updates
    const now = new Date()
    const updates = mockCheatData
      .filter((cheat) => {
        if (!cheat.nextUpdate) return false
        return new Date(cheat.nextUpdate) <= now
      })
      .map((cheat) => ({
        cheatId: cheat.id,
        type: "scheduled_update",
        message: `${cheat.name} update available`,
      }))

    return {
      hasUpdates: updates.length > 0,
      updates,
    }
  }

  getStatusColor(status: CheatStatus): string {
    switch (status) {
      case "online":
        return "text-green-500"
      case "offline":
        return "text-gray-500"
      case "detected":
        return "text-red-500"
      case "updating":
        return "text-blue-500"
      case "maintenance":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  getStatusIcon(status: CheatStatus): string {
    switch (status) {
      case "online":
        return "✅"
      case "offline":
        return "⚫"
      case "detected":
        return "🚨"
      case "updating":
        return "🔄"
      case "maintenance":
        return "🔧"
      default:
        return "❓"
    }
  }

  getRiskLevelColor(risk: "low" | "medium" | "high"): string {
    switch (risk) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-red-500"
    }
  }
}
