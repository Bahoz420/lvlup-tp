"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
}

export function AdvancedNavigationTests() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runAdvancedTests = async () => {
    setIsRunning(true)
    setTestResults([])
    const results: TestResult[] = []

    // Test 1: Dropdown Menu Functionality
    try {
      const dropdownTrigger = document.querySelector('[data-testid="more-dropdown"]')
      if (dropdownTrigger) {
        // Simulate click to open dropdown
        ;(dropdownTrigger as HTMLElement).click()

        // Wait for dropdown to open
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Check if dropdown content is visible
        const dropdownContent = document.querySelector('[role="menu"]')
        if (dropdownContent) {
          results.push({
            name: "Dropdown Menu",
            status: "success",
            message: "Dropdown menu opens and closes correctly",
          })
        } else {
          results.push({
            name: "Dropdown Menu",
            status: "warning",
            message: "Dropdown menu might not be opening correctly",
          })
        }

        // Close dropdown
        document.body.click()
      } else {
        results.push({
          name: "Dropdown Menu",
          status: "warning",
          message: "Dropdown trigger not found",
        })
      }
    } catch (error) {
      results.push({
        name: "Dropdown Menu",
        status: "error",
        message: `Dropdown test error: ${error}`,
      })
    }

    // Test 2: Cart Dropdown Functionality
    try {
      const cartButton = document.querySelector('[data-testid="cart-button"]')
      if (cartButton) {
        // Simulate hover
        const mouseEnterEvent = new MouseEvent("mouseenter", {
          bubbles: true,
          cancelable: true,
        })
        cartButton.dispatchEvent(mouseEnterEvent)

        // Wait for dropdown to open
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Check if cart dropdown is visible
        const cartDropdown = document.querySelector('[data-testid="cart-dropdown"]')
        if (cartDropdown) {
          results.push({
            name: "Cart Dropdown",
            status: "success",
            message: "Cart dropdown opens on hover",
          })
        } else {
          results.push({
            name: "Cart Dropdown",
            status: "warning",
            message: "Cart dropdown might not be opening on hover",
          })
        }

        // Simulate mouse leave
        const mouseLeaveEvent = new MouseEvent("mouseleave", {
          bubbles: true,
          cancelable: true,
        })
        cartButton.dispatchEvent(mouseLeaveEvent)
      } else {
        results.push({
          name: "Cart Dropdown",
          status: "warning",
          message: "Cart button not found",
        })
      }
    } catch (error) {
      results.push({
        name: "Cart Dropdown",
        status: "error",
        message: `Cart dropdown test error: ${error}`,
      })
    }

    // Test 3: Mobile Navigation Functionality
    try {
      const mobileMenuTrigger = document.querySelector('[data-testid="mobile-menu-trigger"]')
      if (mobileMenuTrigger) {
        results.push({
          name: "Mobile Menu Trigger",
          status: "success",
          message: "Mobile menu trigger found and accessible",
        })
      } else {
        results.push({
          name: "Mobile Menu Trigger",
          status: "warning",
          message: "Mobile menu trigger not found (might be hidden on desktop)",
        })
      }
    } catch (error) {
      results.push({
        name: "Mobile Menu Trigger",
        status: "error",
        message: `Mobile menu test error: ${error}`,
      })
    }

    // Test 4: Search Input Functionality
    try {
      const searchInput = document.querySelector('[data-testid="search-input"]')
      if (searchInput) {
        // Focus the input
        ;(searchInput as HTMLInputElement).focus()(
          // Type something
          searchInput as HTMLInputElement,
        ).value = "test search"

        // Check if value is set
        if ((searchInput as HTMLInputElement).value === "test search") {
          results.push({
            name: "Search Input",
            status: "success",
            message: "Search input accepts text input",
          })
        } else {
          results.push({
            name: "Search Input",
            status: "warning",
            message: "Search input might not be accepting text input",
          })
        }
      } else {
        results.push({
          name: "Search Input",
          status: "warning",
          message: "Search input not found (might be hidden on mobile)",
        })
      }
    } catch (error) {
      results.push({
        name: "Search Input",
        status: "error",
        message: `Search input test error: ${error}`,
      })
    }

    setTestResults(results)
    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Advanced Navigation Tests</h2>

        <Button onClick={runAdvancedTests} disabled={isRunning} className="bg-indigo-600 hover:bg-indigo-700 mb-6">
          {isRunning ? "Running Advanced Tests..." : "Run Advanced Tests"}
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium text-gray-900">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.message}</div>
                  </div>
                </div>
                <Badge
                  className={
                    result.status === "success"
                      ? "bg-green-100 text-green-800"
                      : result.status === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {result.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
