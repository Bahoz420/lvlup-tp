"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp } from "lucide-react"

interface DebugInfoProps {
  data: any
  title?: string
}

export function DebugInfo({ data, title = "Debug Information" }: DebugInfoProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <Card className="mt-4 border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-yellow-800 flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              DEBUG
            </Badge>
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-yellow-700 hover:text-yellow-900"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          <pre className="text-xs bg-yellow-100 p-3 rounded overflow-auto max-h-96 text-yellow-900">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      )}
    </Card>
  )
}
