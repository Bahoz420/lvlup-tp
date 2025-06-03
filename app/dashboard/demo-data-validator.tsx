"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface ValidationResult {
  category: string
  tests: {
    name: string
    status: "pass" | "fail" | "warning"
    message: string
  }[]
}

export default function DashboardValidator() {
  const [results, setResults] = useState<ValidationResult[]>([])

  useEffect(() => {
    const validateDashboard = () => {
      const validationResults: ValidationResult[] = []

      // User Info Validation
      const userInfoTests = {
        category: "User Information",
        tests: [
          {
            name: "Demo Banner Present",
            status: document.querySelector('[class*="amber-100"]') ? "pass" : ("fail" as const),
            message: document.querySelector('[class*="amber-100"]') ? "Demo banner visible" : "Demo banner missing",
          },
          {
            name: "Welcome Message",
            status: document.textContent?.includes("Welcome back, Demo") ? "pass" : ("fail" as const),
            message: document.textContent?.includes("Welcome back, Demo")
              ? "Welcome message correct"
              : "Welcome message missing",
          },
          {
            name: "Demo Email",
            status: document.textContent?.includes("demo@lvlup.com") ? "pass" : ("fail" as const),
            message: document.textContent?.includes("demo@lvlup.com") ? "Demo email displayed" : "Demo email missing",
          },
        ],
      }

      // Products Validation
      const productsTests = {
        category: "Products Display",
        tests: [
          {
            name: "CS2 Product",
            status: document.textContent?.includes("CS2 Premium Cheats") ? "pass" : ("fail" as const),
            message: document.textContent?.includes("CS2 Premium Cheats")
              ? "CS2 product visible"
              : "CS2 product missing",
          },
          {
            name: "Valorant Product",
            status: document.textContent?.includes("Valorant Hack Suite") ? "pass" : ("fail" as const),
            message: document.textContent?.includes("Valorant Hack Suite")
              ? "Valorant product visible"
              : "Valorant product missing",
          },
          {
            name: "Active Badges",
            status: document.querySelectorAll('[class*="bg-green"]').length >= 2 ? "pass" : ("warning" as const),
            message: `Found ${document.querySelectorAll('[class*="bg-green"]').length} active badges`,
          },
        ],
      }

      // UI Elements Validation
      const uiTests = {
        category: "UI Elements",
        tests: [
          {
            name: "Download Buttons",
            status: document.textContent?.includes("Download") ? "pass" : ("fail" as const),
            message: document.textContent?.includes("Download")
              ? "Download buttons present"
              : "Download buttons missing",
          },
          {
            name: "Extend Buttons",
            status: document.textContent?.includes("Extend") ? "pass" : ("fail" as const),
            message: document.textContent?.includes("Extend") ? "Extend buttons present" : "Extend buttons missing",
          },
          {
            name: "Tabs Functionality",
            status: document.querySelector('[role="tablist"]') ? "pass" : ("fail" as const),
            message: document.querySelector('[role="tablist"]') ? "Tabs component found" : "Tabs component missing",
          },
        ],
      }

      validationResults.push(userInfoTests, productsTests, uiTests)
      setResults(validationResults)
    }

    // Run validation after component mounts
    const timer = setTimeout(validateDashboard, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>
      case "fail":
        return <Badge className="bg-red-100 text-red-800">Fail</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Dashboard Validation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {results.map((category, index) => (
            <div key={index}>
              <h3 className="font-medium text-purple-800 mb-3">{category.category}</h3>
              <div className="space-y-2">
                {category.tests.map((test, testIndex) => (
                  <div key={testIndex} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className="text-sm">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">{test.message}</span>
                      {getStatusBadge(test.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
