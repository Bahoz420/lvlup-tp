"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"
import { CartTestComponent } from "./cart-test"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  url?: string
  details?: string
}

interface ProductTestData {
  slug: string
  name: string
  expectedFeatures: string[]
  expectedPrice: number
}

export default function ProductTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [productData, setProductData] = useState<any[]>([])

  const products: ProductTestData[] = [
    {
      slug: "cs2",
      name: "CS2 lvlup Cheat",
      expectedFeatures: ["Aimbot", "ESP", "Wallhack", "Anti-Recoil"],
      expectedPrice: 29.99,
    },
    {
      slug: "valorant",
      name: "Valorant lvlup Cheat",
      expectedFeatures: ["Aimbot", "Wallhack", "Triggerbot", "Anti-Recoil"],
      expectedPrice: 34.99,
    },
    {
      slug: "fortnite",
      name: "Fortnite lvlup Cheat",
      expectedFeatures: ["Aimbot", "ESP", "Radar Hack", "HWID Spoofer"],
      expectedPrice: 29.99,
    },
  ]

  const runProductTests = async () => {
    setIsRunning(true)
    setTestResults([])
    const results: TestResult[] = []
    const fetchedProductData: any[] = []

    // Test 1: API Connectivity
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        results.push({
          name: "Products API",
          status: "success",
          message: `Products API responding correctly (${data.products?.length || 0} products found)`,
        })
        fetchedProductData.push(...(data.products || []))
      } else {
        results.push({
          name: "Products API",
          status: "error",
          message: `Products API error: ${response.status} ${response.statusText}`,
        })
      }
    } catch (error) {
      results.push({
        name: "Products API",
        status: "error",
        message: `Products API connection failed: ${error}`,
      })
    }

    // Test 2: Individual Product API Tests
    for (const product of products) {
      try {
        const response = await fetch(`/api/products/${product.slug}`)
        if (response.ok) {
          const data = await response.json()
          const productInfo = data.product

          if (productInfo) {
            results.push({
              name: `${product.name} API`,
              status: "success",
              message: `Product data loaded successfully`,
              url: `/products/${product.slug}`,
              details: `Price: $${productInfo.price}, Features: ${productInfo.features?.length || 0}`,
            })

            // Validate product data
            if (productInfo.name && productInfo.description && productInfo.price) {
              results.push({
                name: `${product.name} Data Validation`,
                status: "success",
                message: "All required product fields present",
              })
            } else {
              results.push({
                name: `${product.name} Data Validation`,
                status: "warning",
                message: "Some product fields might be missing",
              })
            }

            // Check features
            if (productInfo.features && productInfo.features.length > 0) {
              results.push({
                name: `${product.name} Features`,
                status: "success",
                message: `${productInfo.features.length} features found`,
                details: productInfo.features.join(", "),
              })
            } else {
              results.push({
                name: `${product.name} Features`,
                status: "warning",
                message: "No features found for this product",
              })
            }
          } else {
            results.push({
              name: `${product.name} API`,
              status: "error",
              message: "Product data structure invalid",
              url: `/products/${product.slug}`,
            })
          }
        } else {
          results.push({
            name: `${product.name} API`,
            status: "error",
            message: `API error: ${response.status} ${response.statusText}`,
            url: `/products/${product.slug}`,
          })
        }
      } catch (error) {
        results.push({
          name: `${product.name} API`,
          status: "error",
          message: `API request failed: ${error}`,
          url: `/products/${product.slug}`,
        })
      }
    }

    // Test 3: Database Connection Test
    try {
      const response = await fetch("/api/products/overview")
      if (response.ok) {
        const data = await response.json()
        results.push({
          name: "Database Connection",
          status: "success",
          message: `Database connected successfully (${data.products?.length || 0} products)`,
        })
      } else {
        results.push({
          name: "Database Connection",
          status: "warning",
          message: "Database might be using fallback data",
        })
      }
    } catch (error) {
      results.push({
        name: "Database Connection",
        status: "error",
        message: `Database connection failed: ${error}`,
      })
    }

    // Test 4: Product Status Tests
    for (const product of products) {
      try {
        const response = await fetch(`/api/status/${product.slug}`)
        if (response.ok) {
          const data = await response.json()
          results.push({
            name: `${product.name} Status`,
            status: "success",
            message: `Status: ${data.status || "Unknown"}, Users: ${data.activeUsers || 0}`,
          })
        } else {
          results.push({
            name: `${product.name} Status`,
            status: "warning",
            message: "Status API not responding (using fallback)",
          })
        }
      } catch (error) {
        results.push({
          name: `${product.name} Status`,
          status: "warning",
          message: "Status check failed (using fallback)",
        })
      }
    }

    setProductData(fetchedProductData)
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
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎮 Product Pages Test Dashboard</h1>
            <p className="text-gray-600 mb-6">Comprehensive testing of CS2, Valorant, and Fortnite product pages</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <Button onClick={runProductTests} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
                {isRunning ? "Running API Tests..." : "🚀 Run API Tests"}
              </Button>

              <Link href="/products">
                <Button variant="outline">📦 View Products Page</Button>
              </Link>

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

          {/* Quick Product Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {products.map((product) => (
              <div key={product.slug} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">Expected Price: ${product.expectedPrice}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.expectedFeatures.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Link href={`/products/${product.slug}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Page
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/api/products/${product.slug}`, "_blank")}
                  >
                    API
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Test Results</h2>

              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{result.name}</div>
                        <div className="text-sm text-gray-600">{result.message}</div>
                        {result.details && (
                          <div className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded">{result.details}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
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

          {/* Cart Tests */}
          <CartTestComponent />

          {/* Manual Testing Checklist */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Manual Testing Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-800 mb-3">For Each Product Page:</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Page loads without errors
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Product image displays correctly
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Product name and description visible
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Pricing tabs work (Day/Week/Month/Lifetime)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Add to Cart button functions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Product features list displays
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Reviews section loads
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    FAQ section accessible
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-3">Functionality Tests:</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Product status indicator works
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Star ratings display correctly
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Breadcrumb navigation works
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Related products section
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Mobile responsive design
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Tab navigation (Description/Requirements/Reviews/FAQ)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    Cart integration works
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-300 rounded"></div>
                    No console errors
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
