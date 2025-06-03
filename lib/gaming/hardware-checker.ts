import type { HardwareRequirements } from "./hardware-requirements" // Assuming HardwareRequirements is imported from another file

export interface SystemInfo {
  cpu: {
    cores: number
    architecture: string
    vendor?: string
  }
  memory: {
    total: number
    available: number
  }
  gpu: {
    vendor?: string
    model?: string
    memory?: number
  }
  os: {
    name: string
    version: string
    architecture: string
  }
  display: {
    resolution: string
    pixelRatio: number
  }
}

export interface CompatibilityResult {
  compatible: boolean
  score: number
  issues: CompatibilityIssue[]
  recommendations: string[]
  performance: "excellent" | "good" | "fair" | "poor"
}

export interface CompatibilityIssue {
  type: "error" | "warning" | "info"
  component: "cpu" | "memory" | "gpu" | "os" | "display"
  message: string
  solution?: string
}

export class HardwareChecker {
  private static instance: HardwareChecker

  static getInstance(): HardwareChecker {
    if (!HardwareChecker.instance) {
      HardwareChecker.instance = new HardwareChecker()
    }
    return HardwareChecker.instance
  }

  async getSystemInfo(): Promise<SystemInfo> {
    const systemInfo: SystemInfo = {
      cpu: {
        cores: navigator.hardwareConcurrency || 4,
        architecture: this.getCpuArchitecture(),
      },
      memory: {
        total: this.getMemoryInfo().total,
        available: this.getMemoryInfo().available,
      },
      gpu: {
        vendor: this.getGpuInfo().vendor,
        model: this.getGpuInfo().model,
      },
      os: {
        name: this.getOsInfo().name,
        version: this.getOsInfo().version,
        architecture: this.getOsInfo().architecture,
      },
      display: {
        resolution: `${window.screen.width}x${window.screen.height}`,
        pixelRatio: window.devicePixelRatio || 1,
      },
    }

    return systemInfo
  }

  async checkCompatibility(cheatId: string, requirements: HardwareRequirements): Promise<CompatibilityResult> {
    const systemInfo = await this.getSystemInfo()
    const issues: CompatibilityIssue[] = []
    const recommendations: string[] = []
    let score = 100

    // Check CPU
    if (systemInfo.cpu.cores < requirements.minCpuCores) {
      issues.push({
        type: "error",
        component: "cpu",
        message: `Insufficient CPU cores. Required: ${requirements.minCpuCores}, Available: ${systemInfo.cpu.cores}`,
        solution: "Upgrade to a CPU with more cores or close background applications",
      })
      score -= 30
    } else if (systemInfo.cpu.cores === requirements.minCpuCores) {
      issues.push({
        type: "warning",
        component: "cpu",
        message: "CPU meets minimum requirements but may impact performance",
        solution: "Consider upgrading CPU for better performance",
      })
      score -= 10
    }

    // Check Memory
    if (systemInfo.memory.total < requirements.minRamGb) {
      issues.push({
        type: "error",
        component: "memory",
        message: `Insufficient RAM. Required: ${requirements.minRamGb}GB, Available: ${systemInfo.memory.total}GB`,
        solution: "Upgrade RAM or close memory-intensive applications",
      })
      score -= 25
    } else if (systemInfo.memory.available < requirements.minRamGb * 0.8) {
      issues.push({
        type: "warning",
        component: "memory",
        message: "Low available memory may cause performance issues",
        solution: "Close unnecessary applications before running the cheat",
      })
      score -= 15
    }

    // Check OS
    if (!requirements.supportedOs.includes(systemInfo.os.name)) {
      issues.push({
        type: "error",
        component: "os",
        message: `Unsupported operating system: ${systemInfo.os.name}`,
        solution: `Upgrade to one of: ${requirements.supportedOs.join(", ")}`,
      })
      score -= 40
    }

    // Check GPU (if required)
    if (requirements.gpuRequired && !systemInfo.gpu.vendor) {
      issues.push({
        type: "warning",
        component: "gpu",
        message: "GPU information not available, but GPU is required",
        solution: "Ensure you have a dedicated graphics card",
      })
      score -= 20
    }

    // Generate recommendations
    if (score >= 90) {
      recommendations.push("Your system exceeds requirements - expect excellent performance")
    } else if (score >= 70) {
      recommendations.push("Your system meets requirements - expect good performance")
    } else if (score >= 50) {
      recommendations.push("Your system barely meets requirements - consider upgrades")
    } else {
      recommendations.push("Your system does not meet requirements - upgrades necessary")
    }

    // Performance rating
    let performance: "excellent" | "good" | "fair" | "poor"
    if (score >= 90) performance = "excellent"
    else if (score >= 70) performance = "good"
    else if (score >= 50) performance = "fair"
    else performance = "poor"

    return {
      compatible: score >= 50,
      score,
      issues,
      recommendations,
      performance,
    }
  }

  private getCpuArchitecture(): string {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes("wow64") || userAgent.includes("win64") || userAgent.includes("x64")) {
      return "x64"
    }
    return "x86"
  }

  private getMemoryInfo(): { total: number; available: number } {
    // @ts-ignore - This is a newer API that might not be available
    if (navigator.deviceMemory) {
      // @ts-ignore
      return { total: navigator.deviceMemory, available: navigator.deviceMemory * 0.7 }
    }
    // Fallback estimation based on device type
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    return isMobile ? { total: 4, available: 2.8 } : { total: 8, available: 5.6 }
  }

  private getGpuInfo(): { vendor?: string; model?: string } {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        return { vendor, model: renderer }
      }
    }

    return {}
  }

  private getOsInfo(): { name: string; version: string; architecture: string } {
    const userAgent = navigator.userAgent
    const platform = navigator.platform

    let osName = "Unknown"
    let osVersion = "Unknown"
    let architecture = "Unknown"

    if (userAgent.includes("Windows NT")) {
      osName = "Windows"
      const versionMatch = userAgent.match(/Windows NT (\d+\.\d+)/)
      if (versionMatch) {
        const version = Number.parseFloat(versionMatch[1])
        if (version >= 10.0) osVersion = "11"
        else if (version >= 6.2) osVersion = "10"
        else if (version >= 6.1) osVersion = "7"
      }
      architecture = userAgent.includes("WOW64") || userAgent.includes("Win64") ? "x64" : "x86"
    } else if (userAgent.includes("Mac OS X")) {
      osName = "macOS"
      const versionMatch = userAgent.match(/Mac OS X (\d+[._]\d+[._]\d+)/)
      if (versionMatch) {
        osVersion = versionMatch[1].replace(/_/g, ".")
      }
      architecture = "x64"
    } else if (userAgent.includes("Linux")) {
      osName = "Linux"
      architecture = platform.includes("64") ? "x64" : "x86"
    }

    return { name: osName, version: osVersion, architecture }
  }
}
