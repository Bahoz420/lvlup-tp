"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface ImageStatus {
  src: string
  name: string
  status: "loading" | "loaded" | "error"
  dimensions?: { width: number; height: number }
  fileSize?: string
}

export function ImageDebugHelper() {
  const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([
    { src: "/cs2.png", name: "CS2 Game Image", status: "loading" },
    { src: "/valorant.png", name: "Valorant Game Image", status: "loading" },
    { src: "/fortnite.png", name: "Fortnite Game Image", status: "loading" },
    { src: "/abstract-geometric-shapes.png", name: "Updates Background", status: "loading" },
  ])

  const checkImage = (imageStatus: ImageStatus, index: number) => {
    const img = new Image()

    img.onload = () => {
      setImageStatuses((prev) =>
        prev.map((status, i) =>
          i === index
            ? {
                ...status,
                status: "loaded" as const,
                dimensions: { width: img.naturalWidth, height: img.naturalHeight },
              }
            : status,
        ),
      )
    }

    img.onerror = () => {
      setImageStatuses((prev) =>
        prev.map((status, i) => (i === index ? { ...status, status: "error" as const } : status)),
      )
    }

    img.src = imageStatus.src
  }

  useEffect(() => {
    imageStatuses.forEach((imageStatus, index) => {
      checkImage(imageStatus, index)
    })
  }, [])

  const recheckImages = () => {
    setImageStatuses((prev) => prev.map((status) => ({ ...status, status: "loading" as const })))
    setTimeout(() => {
      imageStatuses.forEach((imageStatus, index) => {
        checkImage(imageStatus, index)
      })
    }, 100)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "loaded":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "loading":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "loaded":
        return <Badge className="bg-green-100 text-green-800">Loaded</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case "loading":
        return <Badge className="bg-blue-100 text-blue-800">Loading</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const loadedCount = imageStatuses.filter((s) => s.status === "loaded").length
  const errorCount = imageStatuses.filter((s) => s.status === "error").length
  const loadingCount = imageStatuses.filter((s) => s.status === "loading").length

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🖼️ Image Status Checker</span>
          <button
            onClick={recheckImages}
            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
          >
            Recheck All
          </button>
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <span className="text-green-600">✅ Loaded: {loadedCount}</span>
          <span className="text-red-600">❌ Errors: {errorCount}</span>
          <span className="text-blue-600">⏳ Loading: {loadingCount}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {imageStatuses.map((imageStatus, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(imageStatus.status)}
                <div>
                  <h4 className="font-medium">{imageStatus.name}</h4>
                  <p className="text-sm text-gray-600">{imageStatus.src}</p>
                  {imageStatus.dimensions && (
                    <p className="text-xs text-gray-500">
                      {imageStatus.dimensions.width} × {imageStatus.dimensions.height}px
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(imageStatus.status)}
                {imageStatus.status === "loaded" && (
                  <img
                    src={imageStatus.src || "/placeholder.svg"}
                    alt={imageStatus.name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Manual Check Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">🔍 Manual Check Instructions:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Open Browser DevTools (F12)</li>
            <li>
              Go to <strong>Network</strong> tab
            </li>
            <li>
              Filter by <strong>Images</strong>
            </li>
            <li>Refresh the dashboard page</li>
            <li>Check for red/failed image requests</li>
          </ol>
        </div>

        {/* Common Issues */}
        <div className="mt-4 p-4 bg-amber-50 rounded-lg">
          <h4 className="font-medium mb-2">⚠️ Common Image Issues:</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>
              <strong>404 Not Found:</strong> Image file doesn't exist in /public folder
            </li>
            <li>
              <strong>CORS Error:</strong> Image blocked by browser security
            </li>
            <li>
              <strong>Slow Loading:</strong> Large file size or slow connection
            </li>
            <li>
              <strong>Broken Path:</strong> Incorrect file path or typo
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
