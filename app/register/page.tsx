"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle, AlertCircle, Eye, EyeOff, Sparkles, Shield, Users, Zap } from "lucide-react"
import {
  validateEmail,
  validatePassword,
  validateName,
  validateActivationCode,
  validatePasswordsMatch,
  debounce,
} from "@/lib/validation-utils"

type ValidationState = {
  valid: boolean
  message: string
  touched: boolean
  strength?: "weak" | "medium" | "strong"
  productName?: string
  expiresAt?: string
}

type FormState = {
  firstName: ValidationState
  lastName: ValidationState
  email: ValidationState
  password: ValidationState
  confirmPassword: ValidationState
  activationCode: ValidationState
  terms: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Form values
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [activationCode, setActivationCode] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Form validation state
  const [formState, setFormState] = useState<FormState>({
    firstName: { valid: false, message: "", touched: false },
    lastName: { valid: false, message: "", touched: false },
    email: { valid: false, message: "", touched: false },
    password: { valid: false, message: "", touched: false, strength: "weak" },
    confirmPassword: { valid: false, message: "", touched: false },
    activationCode: { valid: false, message: "", touched: false },
    terms: false,
  })

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // Check if form is valid
  const isFormValid = () => {
    return (
      formState.firstName.valid &&
      formState.lastName.valid &&
      formState.email.valid &&
      formState.password.valid &&
      formState.confirmPassword.valid &&
      formState.activationCode.valid &&
      acceptTerms
    )
  }

  // Validate first name
  const validateFirstName = useCallback(() => {
    const result = validateName(firstName, "First Name")
    setFormState((prev) => ({
      ...prev,
      firstName: { ...result, touched: true },
    }))
  }, [firstName])

  // Validate last name
  const validateLastName = useCallback(() => {
    const result = validateName(lastName, "Last Name")
    setFormState((prev) => ({
      ...prev,
      lastName: { ...result, touched: true },
    }))
  }, [lastName])

  // Validate email
  const validateEmailField = useCallback(() => {
    const result = validateEmail(email)
    setFormState((prev) => ({
      ...prev,
      email: { ...result, touched: true },
    }))
  }, [email])

  // Validate password
  const validatePasswordField = useCallback(() => {
    const result = validatePassword(password)
    setFormState((prev) => ({
      ...prev,
      password: { ...result, touched: true, strength: result.strength },
    }))

    // If confirm password is already touched, validate it again
    if (formState.confirmPassword.touched) {
      const matchResult = validatePasswordsMatch(password, confirmPassword)
      setFormState((prev) => ({
        ...prev,
        confirmPassword: { ...matchResult, touched: true },
      }))
    }
  }, [password, confirmPassword, formState.confirmPassword.touched])

  // Validate confirm password
  const validateConfirmPasswordField = useCallback(() => {
    const result = validatePasswordsMatch(password, confirmPassword)
    setFormState((prev) => ({
      ...prev,
      confirmPassword: { ...result, touched: true },
    }))
  }, [password, confirmPassword])

  // Debounced validation functions
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedValidateCode = useCallback(
    debounce(async (code: string) => {
      if (!code || code.trim() === "") {
        setFormState((prev) => ({
          ...prev,
          activationCode: { valid: false, message: "Activation code is required", touched: true },
        }))
        return
      }

      setIsValidatingCode(true)
      const result = await validateActivationCode(code)
      setFormState((prev) => ({
        ...prev,
        activationCode: {
          ...result,
          touched: true,
        },
      }))
      setIsValidatingCode(false)
    }, 500),
    [],
  )

  // Trigger validation when activation code changes
  useEffect(() => {
    if (activationCode !== "") {
      debouncedValidateCode(activationCode)
    } else {
      setFormState((prev) => ({
        ...prev,
        activationCode: { valid: false, message: "Activation code is required", touched: true },
      }))
    }
  }, [activationCode, debouncedValidateCode])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate all fields before submission
    validateFirstName()
    validateLastName()
    validateEmailField()
    validatePasswordField()
    validateConfirmPasswordField()

    if (!isFormValid()) {
      setError("Please correct the highlighted fields.")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Register the user
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          activationCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      setSuccess("Registration successful! You will be redirected...")

      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "An error occurred during registration.")
    } finally {
      setIsLoading(false)
    }
  }

  // Get color for password strength indicator
  const getPasswordStrengthColor = () => {
    switch (formState.password.strength) {
      case "weak":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "strong":
        return "bg-green-500"
      default:
        return "bg-gray-200"
    }
  }

  // Get progress value for password strength
  const getPasswordStrengthProgress = () => {
    switch (formState.password.strength) {
      case "weak":
        return 33
      case "medium":
        return 66
      case "strong":
        return 100
      default:
        return 0
    }
  }

  // Render validation icon
  const renderValidationIcon = (field: ValidationState) => {
    if (!field.touched) return null

    return field.valid ? (
      <CheckCircle2 className="h-5 w-5 text-green-400" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-400" />
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"
          style={{
            top: "10%",
            left: "10%",
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div
          className="absolute w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow"
          style={{
            top: "60%",
            right: "10%",
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
          }}
        />
        <div
          className="absolute w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse-slow"
          style={{
            bottom: "20%",
            left: "20%",
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Logo Section */}
            <div className="text-center mb-8 animate-fade-in">
              <Link href="/" className="inline-block group">
                <div className="relative">
                  <Image
                    src="/logo-white.png"
                    alt="lvlup Logo"
                    width={200}
                    height={50}
                    className="h-16 w-auto transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg blur-xl" />
                </div>
              </Link>
            </div>

            {/* Main Form Card */}
            <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl animate-fade-in-up">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
                  Join the Elite
                </h1>
                <p className="text-white/70">Create your account and unlock premium gaming advantages</p>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="mb-6 bg-red-500/10 border-red-500/20 backdrop-blur-sm animate-fade-in"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 bg-green-500/10 border-green-500/20 backdrop-blur-sm animate-fade-in">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">{success}</AlertDescription>
                </Alert>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <Label htmlFor="firstName" className="block text-sm font-medium text-white/80 mb-2">
                      First Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        className={`w-full pr-10 bg-white/5 border-white/20 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/10 focus:border-purple-400/50 focus:ring-purple-400/50 group-hover:bg-white/8 ${
                          formState.firstName.touched
                            ? formState.firstName.valid
                              ? "border-green-400/50 focus:ring-green-400/50"
                              : "border-red-400/50 focus:ring-red-400/50"
                            : ""
                        }`}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={validateFirstName}
                        required
                        disabled={isLoading}
                        aria-describedby="firstName-feedback"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {renderValidationIcon(formState.firstName)}
                      </div>
                    </div>
                    {formState.firstName.touched && !formState.firstName.valid && (
                      <p id="firstName-feedback" className="mt-1 text-sm text-red-400 animate-fade-in">
                        {formState.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="group">
                    <Label htmlFor="lastName" className="block text-sm font-medium text-white/80 mb-2">
                      Last Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        className={`w-full pr-10 bg-white/5 border-white/20 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/10 focus:border-purple-400/50 focus:ring-purple-400/50 group-hover:bg-white/8 ${
                          formState.lastName.touched
                            ? formState.lastName.valid
                              ? "border-green-400/50 focus:ring-green-400/50"
                              : "border-red-400/50 focus:ring-red-400/50"
                            : ""
                        }`}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={validateLastName}
                        required
                        disabled={isLoading}
                        aria-describedby="lastName-feedback"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {renderValidationIcon(formState.lastName)}
                      </div>
                    </div>
                    {formState.lastName.touched && !formState.lastName.valid && (
                      <p id="lastName-feedback" className="mt-1 text-sm text-red-400 animate-fade-in">
                        {formState.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="group">
                  <Label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      className={`w-full pr-10 bg-white/5 border-white/20 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/10 focus:border-purple-400/50 focus:ring-purple-400/50 group-hover:bg-white/8 ${
                        formState.email.touched
                          ? formState.email.valid
                            ? "border-green-400/50 focus:ring-green-400/50"
                            : "border-red-400/50 focus:ring-red-400/50"
                          : ""
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={validateEmailField}
                      required
                      disabled={isLoading}
                      aria-describedby="email-feedback"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {renderValidationIcon(formState.email)}
                    </div>
                  </div>
                  {formState.email.touched && !formState.email.valid && (
                    <p id="email-feedback" className="mt-1 text-sm text-red-400 animate-fade-in">
                      {formState.email.message}
                    </p>
                  )}
                </div>

                <div className="group">
                  <Label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      className={`w-full pr-20 bg-white/5 border-white/20 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/10 focus:border-purple-400/50 focus:ring-purple-400/50 group-hover:bg-white/8 ${
                        formState.password.touched
                          ? formState.password.valid
                            ? "border-green-400/50 focus:ring-green-400/50"
                            : "border-red-400/50 focus:ring-red-400/50"
                          : ""
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={validatePasswordField}
                      required
                      disabled={isLoading}
                      aria-describedby="password-feedback"
                    />
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      {renderValidationIcon(formState.password)}
                    </div>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-purple-400 focus:outline-none transition-colors duration-200"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={0}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-3 animate-fade-in">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/70">Password strength:</span>
                        <span
                          className={
                            formState.password.strength === "weak"
                              ? "text-red-400"
                              : formState.password.strength === "medium"
                                ? "text-yellow-400"
                                : "text-green-400"
                          }
                        >
                          {formState.password.strength === "weak"
                            ? "Weak"
                            : formState.password.strength === "medium"
                              ? "Medium"
                              : "Strong"}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                          style={{ width: `${getPasswordStrengthProgress()}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {formState.password.touched && !formState.password.valid && (
                    <p id="password-feedback" className="mt-2 text-sm text-red-400 animate-fade-in">
                      {formState.password.message}
                    </p>
                  )}
                </div>

                <div className="group">
                  <Label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className={`w-full pr-20 bg-white/5 border-white/20 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/10 focus:border-purple-400/50 focus:ring-purple-400/50 group-hover:bg-white/8 ${
                        formState.confirmPassword.touched
                          ? formState.confirmPassword.valid
                            ? "border-green-400/50 focus:ring-green-400/50"
                            : "border-red-400/50 focus:ring-red-400/50"
                          : ""
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={validateConfirmPasswordField}
                      required
                      disabled={isLoading}
                      aria-describedby="confirmPassword-feedback"
                    />
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      {renderValidationIcon(formState.confirmPassword)}
                    </div>
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-purple-400 focus:outline-none transition-colors duration-200"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      tabIndex={0}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {formState.confirmPassword.touched && !formState.confirmPassword.valid && (
                    <p id="confirmPassword-feedback" className="mt-1 text-sm text-red-400 animate-fade-in">
                      {formState.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="group">
                  <Label htmlFor="activationCode" className="block text-sm font-medium text-white/80 mb-2">
                    Activation Code (required)
                  </Label>
                  <div className="relative">
                    <Input
                      id="activationCode"
                      name="activationCode"
                      type="text"
                      placeholder="Enter your activation code"
                      className={`w-full pr-10 bg-white/5 border-white/20 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/10 focus:border-purple-400/50 focus:ring-purple-400/50 group-hover:bg-white/8 ${
                        activationCode && formState.activationCode.touched
                          ? formState.activationCode.valid
                            ? "border-green-400/50 focus:ring-green-400/50"
                            : "border-red-400/50 focus:ring-red-400/50"
                          : ""
                      }`}
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value)}
                      disabled={isLoading}
                      aria-describedby="activationCode-feedback"
                      required
                    />
                    {isValidatingCode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                      </div>
                    )}
                    {!isValidatingCode && activationCode && formState.activationCode.touched && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {formState.activationCode.valid ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {!isValidatingCode && activationCode && formState.activationCode.touched && (
                    <p
                      id="activationCode-feedback"
                      className={`mt-1 text-sm animate-fade-in ${formState.activationCode.valid ? "text-green-400" : "text-red-400"}`}
                    >
                      {formState.activationCode.message}
                      {formState.activationCode.valid && formState.activationCode.productName && (
                        <span className="block mt-1 text-white/70">
                          Product: <strong className="text-purple-400">{formState.activationCode.productName}</strong>
                          {formState.activationCode.expiresAt && (
                            <> (Valid until: {new Date(formState.activationCode.expiresAt).toLocaleDateString()})</>
                          )}
                        </span>
                      )}
                    </p>
                  )}
                  {!activationCode && (
                    <p className="mt-1 text-xs text-white/50">
                      Enter the activation code you received with your purchase.
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-3 group">
                  <Checkbox
                    id="terms"
                    name="terms"
                    className={`mt-1 text-purple-400 focus:ring-purple-400 border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 ${!acceptTerms && "border-red-400/50"}`}
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                    required
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-sm text-white/70 leading-relaxed">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-200 underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and the{" "}
                    <Link
                      href="/privacy"
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-200 underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {!acceptTerms && (
                  <p className="text-sm text-red-400 mt-1 animate-fade-in">You must agree to the terms of service.</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:from-purple-600 hover:via-pink-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading || !isFormValid() || isValidatingCode}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Join the Elite
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-white/60">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="hidden lg:flex lg:flex-1 relative items-center justify-center p-12">
          <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl max-w-md animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-4">
                Elite Gaming Community
              </h2>
              <p className="text-white/70 text-lg">
                Join thousands of satisfied customers and unlock premium gaming advantages.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Undetected & Safe</h3>
                  <p className="text-white/60 text-sm">Advanced protection systems keep you secure</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-pink-500 to-amber-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Instant Access</h3>
                  <p className="text-white/60 text-sm">Get started immediately after registration</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-amber-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">24/7 Support</h3>
                  <p className="text-white/60 text-sm">Expert support whenever you need it</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-white/80 text-sm mb-2">Trusted by</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  50,000+ Gamers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
