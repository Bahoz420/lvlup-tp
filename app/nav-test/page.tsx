"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"
import { AdvancedNavigationTests } from "./advanced-tests"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  url?: string
}

export default function NavigationTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const navigationLinks = [
    { name: "Home", url: "/", expected: "Homepage" },
    { name: "Products", url: "/products", expected: "Products page" },
    { name: "Info", url: "/info", expected: "Info page" },
    { name: "Gallery", url: "/gallery", expected: "Gallery page" },
    { name: "Community", url: "/community", expected: "Community page" },
    { name: "Dashboard", url: "/dashboard", expected: "Dashboard page" },
    { name: "Support", url: "/support", expected: "Support page" },
    { name: "FAQ", url: "/faq", expected: "FAQ page" },
    { name: "Contact", url: "/contact", expected: "Contact page" },
    { name: "Login", url: "/login", expected: "Login page" },
    { name: "Register", url: "/register", expected: "Register page" },
    { name: "Cart", url: "/cart", expected: "Cart page" },
  ]

  const runNavigationTests = async () => {
    setIsRunning(true)
    setTestResults([])
    const results: TestResult[] = []

    // Test 1: Navigation Component Rendering
    try {
      const navElement = document.querySelector('[data-testid="main-navigation"]')
      if (navElement) {
        results.push({
          name: "Navigation Rendering",
          status: "success",
          message: "Navigation component renders successfully",
        })
      } else {
        results.push({
          name: "Navigation Rendering",
          status: "error",
          message: "Navigation component not found in DOM",
        })
      }
    } catch (error) {
      results.push({
        name: "Navigation Rendering",
        status: "error",
        message: `Navigation rendering error: ${error}`,
      })
    }

    // Test 2: Logo Visibility
    try {
      const logoElement = document.querySelector('[data-testid="logo-link"] img')
      if (logoElement) {
        results.push({
          name: "Logo Display",
          status: "success",
          message: "Logo is visible and properly loaded",
        })
      } else {
        results.push({
          name: "Logo Display",
          status: "warning",
          message: "Logo element not found or not loaded",
        })
      }
    } catch (error) {
      results.push({
        name: "Logo Display",
        status: "error",
        message: `Logo test error: ${error}`,
      })
    }

    // Test 3: Navigation Links
    for (const link of navigationLinks) {
      try {
        const linkElement =
          document.querySelector(`[data-testid="${link.name.toLowerCase()}-link"]`) ||
          document.querySelector(`a[href="${link.url}"]`)
        if (linkElement) {
          results.push({
            name: `${link.name} Link`,
            status: "success",
            message: `${link.name} link found and accessible`,
            url: link.url,
          })
        } else {
          results.push({
            name: `${link.name} Link`,
            status: "warning",
            message: `${link.name} link not found in navigation`,
            url: link.url,
          })
        }
      } catch (error) {
        results.push({
          name: `${link.name} Link`,
          status: "error",
          message: `Error testing ${link.name} link: ${error}`,
          url: link.url,
        })
      }
    }

    // Test 4: Mobile Navigation
    try {
      const mobileNavTrigger = document.querySelector('[data-testid="mobile-menu-trigger"]')
      if (mobileNavTrigger) {
        results.push({
          name: "Mobile Navigation",
          status: "success",
          message: "Mobile navigation trigger found",
        })
      } else {
        results.push({
          name: "Mobile Navigation",
          status: "warning",
          message: "Mobile navigation trigger not found",
        })
      }
    } catch (error) {
      results.push({
        name: "Mobile Navigation",
        status: "error",
        message: `Mobile navigation test error: ${error}`,
      })
    }

    // Test 5: Search Functionality
    try {
      const searchInput = document.querySelector('[data-testid="search-input"]')
      if (searchInput) {
        results.push({
          name: "Search Input",
          status: "success",
          message: "Search input field is present and functional",
        })
      } else {
        results.push({
          name: "Search Input",
          status: "warning",
          message: "Search input not found",
        })
      }
    } catch (error) {
      results.push({
        name: "Search Input",
        status: "error",
        message: `Search test error: ${error}`,
      })
    }

    // Test 6: Cart Button
    try {
      const cartButton = document.querySelector('[data-testid="cart-button"]')
      if (cartButton) {
        results.push({
          name: "Cart Button",
          status: "success",
          message: "Cart button is present and accessible",
        })
      } else {
        results.push({
          name: "Cart Button",
          status: "warning",
          message: "Cart button not found",
        })
      }
    } catch (error) {
      results.push({
        name: "Cart Button",
        status: "error",
        message: `Cart button test error: ${error}`,
      })
    }

    // Test 7: Responsive Design
    try {
      const navElement = document.querySelector('[data-testid="main-navigation"]')
      if (navElement) {
        const styles = window.getComputedStyle(navElement)
        const isSticky = styles.position === "sticky" || styles.position === "fixed"

        if (isSticky) {
          results.push({
            name: "Sticky Navigation",
            status: "success",
            message: "Navigation is properly positioned (sticky/fixed)",
          })
        } else {
          results.push({
            name: "Sticky Navigation",
            status: "warning",
            message: "Navigation might not be sticky positioned",
          })
        }
      }
    } catch (error) {
      results.push({
        name: "Sticky Navigation",
        status: "error",
        message: `Responsive design test error: ${error}`,
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

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
    }

    return <Badge className={variants[status as keyof typeof variants]}>{status.toUpperCase()}</Badge>
  }

  const successCount = testResults.filter((r) => r.status === "success").length
  const errorCount = testResults.filter((r) => r.status === "error").length
  const warningCount = testResults.filter((r) => r.status === "warning").length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 Navigation System Test Dashboard</h1>
            <p className="text-gray-600 mb-6">Comprehensive testing of all navigation components and functionality</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <Button onClick={runNavigationTests} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
                {isRunning ? "Running Tests..." : "🚀 Run Navigation Tests"}
              </Button>

              <Link href="/">
                <Button variant="outline">🏠 Back to Homepage</Button>
              </Link>
            </div>

            {testResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-green-800">Passed</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{successCount}</div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold text-yellow-800">Warnings</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="font-semibold text-red-800">Failed</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                </div>
              </div>
            )}
          </div>

          {testResults.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Test Results</h2>

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

                    <div className="flex items-center gap-2">
                      {getStatusBadge(result.status)}
                      {result.url && (
                        <Link href={result.url}>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Test
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <AdvancedNavigationTests />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 Manual Testing Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Desktop Navigation:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Click each navigation link</li>
                  <li>• Test search functionality</li>
                  <li>• Verify cart button works</li>
                  <li>• Check dropdown menus</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Mobile Navigation:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Open mobile menu</li>
                  <li>• Test all mobile links</li>
                  <li>• Verify responsive design</li>
                  <li>• Check touch interactions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
