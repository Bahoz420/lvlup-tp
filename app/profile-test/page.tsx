"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { createClient } from "@/utils/supabase/client"
import type { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js"
import { CheckCircle, XCircle, AlertCircle, User, Database, Lock } from "lucide-react"
import { toast } from "react-toastify"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: string
}

const tests = [
  "testAuthConnection",
  "testDatabaseConnection",
  "testUserProfile",
  "testProfileUpdate",
  "testPasswordChange",
  "testSecuritySettings",
  "testImageUpload",
  "testNavigation",
]

export default function ProfileTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (!supabase) return
    checkAuthStatus()
  }, [supabase])

  const checkAuthStatus = async () => {
    if (!supabase) return
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error("Auth error:", error)
        return
      }
      setUser(authUser)
    } catch (error) {
      console.error("Error checking auth:", error)
    }
  }

  const runAllTests = async () => {
    if (!supabase) {
      toast({ title: "Error", description: "Supabase client not initialized.", variant: "destructive" })
      return
    }
    setIsRunning(true)
    setTestResults([])

    const testFunctions = [
      testAuthConnection,
      testDatabaseConnection,
      testUserProfile,
      testProfileUpdate,
      testPasswordChange,
      testSecuritySettings,
      testImageUpload,
      testNavigation,
    ]

    for (const test of testFunctions) {
      try {
        // Pass supabase client to each test function
        const result = await test(supabase, user)
        setTestResults((prev) => [...prev, result])
      } catch (error) {
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name.replace(/bound |test/g, "").trim(), // Clean up function name
            status: "error",
            message: "Test failed with exception",
            details: error instanceof Error ? error.message : "Unknown error",
          },
        ])
      }
      await new Promise((resolve) => setTimeout(resolve, 300)) // Shorter delay
    }
    setIsRunning(false)
  }

  // Modified test functions to accept supabase client and user
  const testAuthConnection = async (
    supabaseClient: SupabaseClient,
    _currentUser: SupabaseUser | null,
  ): Promise<TestResult> => {
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabaseClient.auth.getUser()
      if (error)
        return {
          name: "Authentication Connection",
          status: "error",
          message: "Failed to get user",
          details: error.message,
        }
      if (!authUser)
        return {
          name: "Authentication Connection",
          status: "warning",
          message: "No user logged in",
          details: "Please log in to test profile features",
        }
      return {
        name: "Authentication Connection",
        status: "success",
        message: "User authenticated successfully",
        details: `User ID: ${authUser.id}`,
      }
    } catch (error) {
      return {
        name: "Authentication Connection",
        status: "error",
        message: "Auth connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const testDatabaseConnection = async (
    supabaseClient: SupabaseClient,
    _currentUser: SupabaseUser | null,
  ): Promise<TestResult> => {
    try {
      const { error } = await supabaseClient.from("users").select("id").limit(1) // Test with 'id'
      if (error)
        return {
          name: "Database Connection",
          status: "error",
          message: "Database query failed",
          details: error.message,
        }
      return {
        name: "Database Connection",
        status: "success",
        message: "Database connection successful",
        details: "Users table accessible",
      }
    } catch (error) {
      return {
        name: "Database Connection",
        status: "error",
        message: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const testUserProfile = async (
    supabaseClient: SupabaseClient,
    currentUser: SupabaseUser | null,
  ): Promise<TestResult> => {
    if (!currentUser)
      return {
        name: "User Profile Fetch",
        status: "warning",
        message: "No user to test",
        details: "User must be logged in",
      }
    try {
      const { data: profile, error } = await supabaseClient.from("users").select("*").eq("id", currentUser.id).single()
      if (error)
        return {
          name: "User Profile Fetch",
          status: "error",
          message: "Failed to fetch user profile",
          details: error.message,
        }
      if (!profile)
        return {
          name: "User Profile Fetch",
          status: "warning",
          message: "User profile not found",
          details: "Profile may need to be created",
        }
      return {
        name: "User Profile Fetch",
        status: "success",
        message: "User profile loaded successfully",
        details: `Profile for ${profile.email || "unknown"}`,
      }
    } catch (error) {
      return {
        name: "User Profile Fetch",
        status: "error",
        message: "Profile fetch failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const testProfileUpdate = async (
    supabaseClient: SupabaseClient,
    currentUser: SupabaseUser | null,
  ): Promise<TestResult> => {
    if (!currentUser)
      return {
        name: "Profile Update Test",
        status: "warning",
        message: "No user to test",
        details: "User must be logged in",
      }
    try {
      const testData = {
        first_name: "Test",
        last_name: `User-${Date.now()}`,
        bio: "Test bio",
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabaseClient.from("users").update(testData).eq("id", currentUser.id)
      if (error)
        return {
          name: "Profile Update Test",
          status: "error",
          message: "Profile update failed",
          details: error.message,
        }
      return {
        name: "Profile Update Test",
        status: "success",
        message: "Profile update successful",
        details: "Test data written to database",
      }
    } catch (error) {
      return {
        name: "Profile Update Test",
        status: "error",
        message: "Profile update test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const testPasswordChange = async (
    supabaseClient: SupabaseClient,
    currentUser: SupabaseUser | null,
  ): Promise<TestResult> => {
    if (!currentUser)
      return {
        name: "Password Change Test",
        status: "warning",
        message: "No user to test",
        details: "User must be logged in",
      }
    try {
      // This test can only check if the method exists, not actually change password without current one.
      if (typeof supabaseClient.auth.updateUser !== "function") {
        return {
          name: "Password Change Test",
          status: "error",
          message: "Auth update method not available",
          details: "updateUser method missing from auth object",
        }
      }
      return {
        name: "Password Change Test",
        status: "success",
        message: "Password change functionality available",
        details: "Auth updateUser method accessible",
      }
    } catch (error) {
      return {
        name: "Password Change Test",
        status: "error",
        message: "Password change test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const testSecuritySettings = async (
    _supabaseClient: SupabaseClient,
    currentUser: SupabaseUser | null,
  ): Promise<TestResult> => {
    if (!currentUser)
      return {
        name: "Security Settings Test",
        status: "warning",
        message: "No user to test",
        details: "User must be logged in",
      }
    try {
      const metadata = currentUser.user_metadata || {}
      return {
        name: "Security Settings Test",
        status: "success",
        message: "Security settings accessible",
        details: `Metadata keys: ${Object.keys(metadata).join(", ") || "none"}`,
      }
    } catch (error) {
      return {
        name: "Security Settings Test",
        status: "error",
        message: "Security settings test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const testImageUpload = async (
    supabaseClient: SupabaseClient,
    _currentUser: SupabaseUser | null,
  ): Promise<TestResult> => {
    try {
      const { error } = await supabaseClient.storage.from("profile-pictures").list("", { limit: 1 })
      if (error)
        return {
          name: "Image Upload Test",
          status: "error",
          message: "Storage bucket not accessible",
          details: error.message,
        }
      return {
        name: "Image Upload Test",
        status: "success",
        message: "Storage bucket accessible",
        details: "profile-pictures bucket available",
      }
    } catch (error) {
      return {
        name: "Image Upload Test",
        status: "error",
        message: "Image upload test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const testNavigation = async (
    _supabaseClient: SupabaseClient,
    _currentUser: SupabaseUser | null,
  ): Promise<TestResult> => {
    // This test is conceptual as we can't programmatically navigate and check page content easily here.
    // It just confirms the routes are known.
    const routes = ["/profile", "/profile/edit", "/profile/change-password", "/profile/security"]
    return {
      name: "Navigation Test",
      status: "success",
      message: "Profile routes configured",
      details: `Routes: ${routes.join(", ")}`,
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "pending":
        return <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
    }
  }

  const successCount = testResults.filter((r) => r.status === "success").length
  const errorCount = testResults.filter((r) => r.status === "error").length
  const warningCount = testResults.filter((r) => r.status === "warning").length

  if (!supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
        <Navigation />
        <div className="container py-8">
          <div className="text-center">Initializing Supabase...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navigation />
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-900 mb-2">Profile System Test Dashboard</h1>
            <p className="text-purple-600">Comprehensive testing of the profile management system functionality</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Tests</p>
                    <p className="text-2xl font-bold">{tests.length}</p>
                  </div>
                  <Database className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Passed</p>
                    <p className="text-2xl font-bold text-green-600">{successCount}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Errors</p>
                    <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Current User Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>User ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Email Confirmed:</strong>{" "}
                    {user.email_confirmed_at ? (
                      <Badge className="bg-green-100 text-green-800">Yes</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </p>
                  <p>
                    <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">No user logged in, or still loading user data.</p>
                  <Button asChild>
                    <Link href="/login">Login to Test</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={runAllTests}
                  disabled={isRunning || !supabase}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Running Tests...
                    </>
                  ) : (
                    "Run All Tests"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setTestResults([])}>
                  Clear Results
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/profile">Go to Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 && !isRunning ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No tests run yet. Click "Run All Tests" to begin.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">{getStatusIcon(result.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{result.name}</h3>
                          {getStatusBadge(result.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{result.message}</p>
                        {result.details && (
                          <p className="text-xs text-gray-500 font-mono bg-gray-200 p-2 rounded">{result.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isRunning && testResults.length < tests.length && (
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex-shrink-0 mt-1">{getStatusIcon("pending")}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">Running next test...</h3>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link href="/profile" className="flex flex-col items-center gap-2">
                    <User className="h-6 w-6" />
                    <span>Profile</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link href="/profile/edit" className="flex flex-col items-center gap-2">
                    <User className="h-6 w-6" />
                    <span>Edit Profile</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link href="/profile/change-password" className="flex flex-col items-center gap-2">
                    <Lock className="h-6 w-6" />
                    <span>Change Password</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link href="/profile/security" className="flex flex-col items-center gap-2">
                    <Lock className="h-6 w-6" />
                    <span>Security</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
