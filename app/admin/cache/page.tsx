import type { Metadata } from "next"
import CacheControlPanel from "@/components/admin/cache-control-panel"

export const metadata: Metadata = {
  title: "Cache-Verwaltung | lvlup Admin",
  description: "Verwalte den Cache deiner Website",
}

export default function CachePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Cache-Verwaltung</h1>
      <CacheControlPanel />
    </div>
  )
}
