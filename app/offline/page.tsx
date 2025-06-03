"use client"

import { Button } from "@/components/ui/button"
import { WifiOff, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-900/30 p-4 rounded-full mb-6">
            <WifiOff className="h-12 w-12 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Du bist offline</h1>
          <p className="text-gray-400 mb-6">
            Es konnte keine Verbindung zum Internet hergestellt werden. Einige Funktionen sind möglicherweise
            eingeschränkt.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Erneut versuchen
            </Button>

            <Button className="flex-1" variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Zur Startseite
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Du kannst weiterhin auf gecachte Inhalte zugreifen.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
