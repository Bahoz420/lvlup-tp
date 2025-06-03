"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProductStatusProps {
  productId: string
}

export function ProductStatus({ productId }: ProductStatusProps) {
  const [status, setStatus] = useState<"online" | "updating" | "offline">("offline")
  const [activeUsers, setActiveUsers] = useState(0)
  const [lastUpdated, setLastUpdated] = useState("")

  useEffect(() => {
    // Mock data for now
    setStatus("online")
    setActiveUsers(476)
    setLastUpdated(new Date(Date.now() - 15 * 60 * 1000).toISOString()) // 15 minutes ago
  }, [productId])

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "updating":
        return "bg-amber-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Online"
      case "updating":
        return "Updating"
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  const formattedDate = new Date(lastUpdated).toLocaleString()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5 py-1">
              <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
              <span className="text-xs font-medium">{getStatusText()}</span>
              {status === "online" && <span className="text-xs text-gray-500">({activeUsers})</span>}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">Status: {getStatusText()}</p>
            {status === "online" && <p>Active users: {activeUsers}</p>}
            <p className="text-xs text-gray-500">Last updated: {formattedDate}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
