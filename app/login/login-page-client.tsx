"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default function LoginPageClient({
  searchParams,
}: {
  searchParams?: { redirectTo?: string }
}) {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mouse tracking for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800"
      onMouseMove={handleMouseMove}
    >
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
                  Welcome Back
                </h1>
                <p className="text-white/70">Sign in to access your premium gaming advantages</p>
              </div>

              <LoginForm redirectTo={searchParams?.redirectTo || "/dashboard"} />
            </div>

            <div className="mt-8 text-center animate-fade-in">
              <p className="text-white/70">
                Don't have an account?{" "}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="hidden lg:flex lg:flex-1 relative items-center justify-center p-12">
          <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl max-w-md animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-4">
                Level Up Your Gaming
              </h2>
              <p className="text-white/70 text-lg">Access your premium cheats and take your gaming to the next level</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Undetected Cheats</h3>
                  <p className="text-white/60 text-sm">Stay safe with our regularly updated cheats</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-pink-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Secure Access</h3>
                  <p className="text-white/60 text-sm">Your account is protected with advanced security</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-amber-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Instant Downloads</h3>
                  <p className="text-white/60 text-sm">Get immediate access to your purchased products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
