"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { validateActivationCode } from "@/lib/validation-utils"

export default function ActivationCodeTestPage() {
  const [testCode, setTestCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [testResults, setTestResults] = useState<any[]>([])

  // Test codes to validate
  const testCodes = [
    { code: "", description: "Empty code" },
    { code: "INVALID123", description: "Invalid code format" },
    { code: "TEST-VALID-CODE-123", description: "Valid test code" },
    { code: "EXPIRED-CODE-456", description: "Expired code" },
    { code: "USED-CODE-789", description: "Already used code" },
    { code: "VALORANT-PREMIUM-2024", description: "Valorant premium code" },
    { code: "CS2-HACK-LIFETIME", description: "CS2 lifetime code" },
  ]

  const validateSingleCode = async (code: string) => {
    setTestCode(code)
    setIsValidating(true)
    setValidationResult(null)

    try {
      const result = await validateActivationCode(code)
      setValidationResult(result)

      // Add to test results
      setTestResults((prev) => [
        ...prev,
        {
          code,
          result,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    } catch (error) {
      setValidationResult({
        valid: false,
        message: "Error during validation",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const runAllTests = async () => {
    setTestResults([])
    for (const testCase of testCodes) {
      await validateSingleCode(testCase.code)
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const clearResults = () => {
    setTestResults([])
    setValidationResult(null)
    setTestCode("")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-800">Activation Code Validation Test</CardTitle>
            <p className="text-gray-600">Test the activation code validation to ensure all responses are in English</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Manual Test Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Manual Test</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter activation code to test"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => validateSingleCode(testCode)} disabled={isValidating || !testCode}>
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    "Validate"
                  )}
                </Button>
              </div>

              {/* Current Validation Result */}
              {validationResult && (
                <Alert className={validationResult.valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <div className="flex items-center gap-2">
                    {validationResult.valid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={validationResult.valid ? "text-green-800" : "text-red-800"}>
                      <div>
                        <strong>Status:</strong> {validationResult.valid ? "Valid" : "Invalid"}
                      </div>
                      <div>
                        <strong>Message:</strong> {validationResult.message}
                      </div>
                      {validationResult.productName && (
                        <div>
                          <strong>Product:</strong> {validationResult.productName}
                        </div>
                      )}
                      {validationResult.expiresAt && (
                        <div>
                          <strong>Expires:</strong> {new Date(validationResult.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                      {validationResult.error && (
                        <div>
                          <strong>Error:</strong> {validationResult.error}
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </div>

            {/* Automated Tests Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Automated Tests</h3>
                <div className="flex gap-2">
                  <Button onClick={runAllTests} disabled={isValidating}>
                    Run All Tests
                  </Button>
                  <Button variant="outline" onClick={clearResults}>
                    Clear Results
                  </Button>
                </div>
              </div>

              {/* Test Cases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testCodes.map((testCase, index) => (
                  <Card key={index} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{testCase.description}</p>
                          <p className="text-sm text-gray-600 font-mono">{testCase.code || "(empty)"}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => validateSingleCode(testCase.code)}
                          disabled={isValidating}
                        >
                          Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Test Results</h3>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <Card key={index} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={result.result.valid ? "default" : "destructive"}>
                                {result.result.valid ? "Valid" : "Invalid"}
                              </Badge>
                              <span className="text-sm text-gray-500">{result.timestamp}</span>
                            </div>
                            <p className="font-mono text-sm bg-gray-100 p-2 rounded">{result.code || "(empty)"}</p>
                          </div>
                          <div className="ml-4">
                            {result.result.valid ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>
                            <strong>Message:</strong> {result.result.message}
                          </div>
                          {result.result.productName && (
                            <div>
                              <strong>Product:</strong> {result.result.productName}
                            </div>
                          )}
                          {result.result.expiresAt && (
                            <div>
                              <strong>Expires:</strong> {new Date(result.result.expiresAt).toLocaleDateString()}
                            </div>
                          )}
                          {result.result.error && (
                            <div className="text-red-600">
                              <strong>Error:</strong> {result.result.error}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* API Endpoint Information */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-2">API Endpoint Information</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>
                    <strong>Endpoint:</strong> /api/validate-code
                  </p>
                  <p>
                    <strong>Method:</strong> POST
                  </p>
                  <p>
                    <strong>Expected Response Format:</strong>
                  </p>
                  <pre className="bg-blue-100 p-2 rounded mt-2 text-xs overflow-x-auto">
                    {`{
  "valid": boolean,
  "message": string,
  "productName"?: string,
  "expiresAt"?: string
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Language Check */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2">Language Validation Checklist</h4>
                <div className="text-sm text-green-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>All error messages should be in English</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Success messages should be in English</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Product names can be in any language</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Date formats should be localized properly</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
