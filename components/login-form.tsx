"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { validateEmail } from "@/lib/validation-utils"

export function LoginForm({ redirectTo: initialPropRedirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter()
  const supabase = createClient()
  const redirectTo =
    initialPropRedirectTo && initialPropRedirectTo.startsWith("/") ? initialPropRedirectTo : "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  // Validation states
  const [emailValidation, setEmailValidation] = useState({ valid: false, message: "", touched: false })
  const [passwordValidation, setPasswordValidation] = useState({ valid: false, message: "", touched: false })

  // Validate email
  const validateEmailField = useCallback(() => {
    const result = validateEmail(email)
    setEmailValidation({ ...result, touched: true })
  }, [email])

  // Validate password (simple presence check)
  const validatePasswordField = useCallback(() => {
    const valid = password.length > 0
    setPasswordValidation({
      valid,
      message: valid ? "" : "Password is required",
      touched: true,
    })
  }, [password])

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Check if form is valid
  const isFormValid = () => {
    return emailValidation.valid && passwordValidation.valid
  }

  // Demo login function
  const handleDemoLogin = async () => {
    setLoading(true)
    setDemoMode(true)

    try {
      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Demo Login Successful",
        description: "Welcome to the demo dashboard!",
      })

      // Redirect to dashboard with demo mode
      router.push(`${redirectTo}?demo=true`)
      router.refresh()
    } catch (err) {
      console.error("Demo login error:", err)
      toast({
        title: "Demo Login Error",
        description: "Something went wrong with demo mode.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setDemoMode(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields before submission
    validateEmailField()
    validatePasswordField()

    if (!isFormValid()) {
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)

        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect. Please try again or use demo mode.",
            variant: "destructive",
          })
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and click the verification link.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          })
        }
        return
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })

      // Successfully logged in, redirect to target page
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      console.error("Unexpected login error:", err)
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try demo mode or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Render validation icon
  const renderValidationIcon = (field: { valid: boolean; touched: boolean }) => {
    if (!field.touched) return null

    return field.valid ? (
      <CheckCircle2 className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-500" />
    )
  }

  return (
    <div className="space-y-6">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmailField}
              placeholder="Enter your email"
              className={`w-full pr-10 rounded-lg border-2 ${
                emailValidation.touched
                  ? emailValidation.valid
                    ? "border-green-500 focus:ring-green-500"
                    : "border-red-500 focus:ring-red-500"
                  : "border-purple-200 focus:ring-purple-500"
              }`}
              required
              disabled={loading}
              aria-describedby="email-feedback"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {renderValidationIcon(emailValidation)}
            </div>
          </div>
          {emailValidation.touched && !emailValidation.valid && (
            <p id="email-feedback" className="mt-1 text-sm text-red-600">
              {emailValidation.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePasswordField}
              placeholder="Enter your password"
              className={`w-full pr-20 rounded-lg border-2 ${
                passwordValidation.touched
                  ? passwordValidation.valid
                    ? "border-green-500 focus:ring-green-500"
                    : "border-red-500 focus:ring-red-500"
                  : "border-purple-200 focus:ring-purple-500"
              }`}
              required
              disabled={loading}
              aria-describedby="password-feedback"
            />
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              {renderValidationIcon(passwordValidation)}
            </div>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={0}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {passwordValidation.touched && !passwordValidation.valid && (
            <p id="password-feedback" className="mt-1 text-sm text-red-600">
              {passwordValidation.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              id="remember"
              className="text-purple-600 focus:ring-purple-500 mr-2"
              disabled={loading}
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <label htmlFor="remember" className="text-sm text-purple-600">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800 underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading || !isFormValid()}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg"
        >
          {loading && !demoMode ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Demo Mode Section */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-purple-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-purple-500">Or try demo mode</span>
        </div>
      </div>

      <Button
        onClick={handleDemoLogin}
        disabled={loading}
        variant="outline"
        className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 py-3 rounded-lg font-medium transition-all duration-200"
      >
        {loading && demoMode ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading Demo...
          </>
        ) : (
          "Continue with Demo Mode"
        )}
      </Button>

      {/* Updated Test credentials section */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800 font-semibold mb-2">⚠️ Supabase Authentication Required</p>
        <p className="text-xs text-amber-700 mb-2">
          To use real authentication, you need to set up Supabase users. For now, use <strong>Demo Mode</strong> to
          explore the dashboard.
        </p>
        <p className="text-xs text-amber-600">
          Demo mode provides full access to all features without requiring real authentication.
        </p>
      </div>
    </div>
  )
}
