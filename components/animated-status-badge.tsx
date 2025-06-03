import type { ProductStatus } from "@/types/product"

interface AnimatedStatusBadgeProps {
  status: ProductStatus
}

export default function AnimatedStatusBadge({ status }: AnimatedStatusBadgeProps) {
  const statusConfig = {
    online: {
      bgClass: "bg-gradient-to-r from-green-500 to-emerald-600",
      textClass: "text-white",
      label: "Online",
      pulseClass: "bg-green-400",
    },
    updating: {
      bgClass: "bg-gradient-to-r from-amber-500 to-orange-600",
      textClass: "text-white",
      label: "Updating",
      pulseClass: "bg-amber-400",
    },
    offline: {
      bgClass: "bg-gradient-to-r from-red-500 to-rose-600",
      textClass: "text-white",
      label: "Offline",
      pulseClass: "bg-red-400",
    },
    maintenance: {
      bgClass: "bg-gradient-to-r from-amber-500 to-orange-600",
      textClass: "text-white",
      label: "Maintenance",
      pulseClass: "bg-amber-400",
    },
  }

  // Default to 'offline' if status is not recognized
  const config = statusConfig[status] || statusConfig.offline

  return (
    <div
      className={`relative flex items-center px-3 py-1 rounded-full ${config.bgClass} ${config.textClass} shadow-lg`}
    >
      <div className="absolute flex items-center justify-center">
        <div className={`h-2 w-2 rounded-full ${config.pulseClass} animate-ping-slow absolute`}></div>
        <div className={`h-2 w-2 rounded-full ${config.pulseClass}`}></div>
      </div>
      <span className="ml-3 font-medium">{config.label}</span>
    </div>
  )
}
