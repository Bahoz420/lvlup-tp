"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ApiTestPage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testApi = async (endpoint: string) => {
    setLoading(true)
    setResult("")

    try {
      const response = await fetch(endpoint)
      const data = await response.text() // Get as text first

      setResult(`Status: ${response.status}\nResponse: ${data}`)
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <div className="space-y-4 mb-6">
        <Button onClick={() => testApi("/api/status/550e8400-e29b-41d4-a716-446655440001")} disabled={loading}>
          Test Fortnite Status API
        </Button>

        <Button onClick={() => testApi("/api/status/invalid-id")} disabled={loading} variant="outline">
          Test Invalid ID (should return 400)
        </Button>

        <Button
          onClick={() => testApi("/api/status/550e8400-e29b-41d4-a716-446655440099")}
          disabled={loading}
          variant="outline"
        >
          Test Non-existent ID (should return 404)
        </Button>
      </div>

      {loading && <p>Loading...</p>}

      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  )
}
