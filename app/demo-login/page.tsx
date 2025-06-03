"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DemoLoginPage() {
  const router = useRouter()

  const handleDemoLogin = () => {
    // Set a demo session flag in localStorage
    localStorage.setItem("demo-session", "true")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Demo Login</CardTitle>
          <CardDescription>Access the dashboard in demo mode for testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleDemoLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Enter Demo Mode
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Or{" "}
              <a href="/login" className="text-purple-600 hover:underline">
                login with real account
              </a>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Demo Features:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• View sample orders and products</li>
              <li>• Test dashboard functionality</li>
              <li>• Explore user interface</li>
              <li>• No real data or payments</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
