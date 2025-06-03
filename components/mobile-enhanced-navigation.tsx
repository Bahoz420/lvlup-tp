"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePerformance } from "@/hooks/use-performance"
import { AdaptiveAnimation } from "@/components/adaptive-animation"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import {
  Home,
  ShoppingBag,
  Info,
  ImageIcon,
  LayoutDashboard,
  HeartHandshake,
  Users,
  FileQuestion,
  MessageSquare,
  Search,
  User,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"

export function MobileEnhancedNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const performance = usePerformance()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeSheet = () => {
    setIsOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
    closeSheet()
  }

  // Navigation items
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: ShoppingBag },
    { href: "/info", label: "Info", icon: Info },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/community", label: "Community", icon: Users },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/support", label: "Support", icon: HeartHandshake },
    { href: "/faq", label: "FAQ", icon: FileQuestion },
    { href: "/contact", label: "Contact", icon: MessageSquare },
  ]

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <AdaptiveAnimation
            highPerformance="hover:scale-110 transition-transform duration-200"
            mediumPerformance="hover:scale-105 transition-transform duration-300"
            lowPerformance=""
            fallback=""
          >
            <button
              className="flex items-center justify-center p-2 rounded-lg touch-active"
              aria-label="Open menu"
              data-testid="mobile-menu-trigger"
            >
              {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </AdaptiveAnimation>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="flex flex-col w-4/5 sm:max-w-md p-0 bg-gradient-to-b from-purple-900 to-indigo-900 border-purple-700"
        >
          <SheetHeader className="border-b border-purple-700/50 p-4">
            <AdaptiveAnimation
              highPerformance="hover:scale-105 transition-transform duration-200"
              mediumPerformance=""
              lowPerformance=""
            >
              <Link href="/" className="flex items-center gap-2" onClick={closeSheet}>
                <Image
                  src="/logo-white.png"
                  alt="lvlup Logo"
                  width={200}
                  height={50}
                  className="h-auto max-h-12 w-auto"
                />
              </Link>
            </AdaptiveAnimation>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 bg-white/10 border-purple-600 text-white placeholder-purple-300 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {navItems.map((item, index) => (
                <AdaptiveAnimation
                  key={item.href}
                  highPerformance="hover:translate-x-2 transition-transform duration-200"
                  mediumPerformance="hover:translate-x-1 transition-transform duration-300"
                  lowPerformance=""
                  className="block"
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-white hover:bg-white/10 touch-active group"
                    onClick={closeSheet}
                    data-testid={`mobile-${item.label.toLowerCase()}-link`}
                  >
                    <item.icon className="h-5 w-5 text-purple-300 group-hover:text-amber-400 transition-colors" />
                    <span className="font-medium group-hover:text-amber-400 transition-colors">{item.label}</span>
                  </Link>
                </AdaptiveAnimation>
              ))}
            </nav>

            {/* Performance Info (Debug) */}
            {performance.shouldReduceAnimations && (
              <MobileOptimizedCard className="mt-6 p-3 bg-amber-500/20 border-amber-500/30">
                <div className="text-amber-300 text-xs">⚡ Performance mode active</div>
              </MobileOptimizedCard>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-purple-700/50 p-4 space-y-3">
            <Link href="/login" onClick={closeSheet}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-purple-400 text-purple-200 hover:bg-purple-800 hover:text-white flex items-center justify-center gap-2 touch-active"
                data-testid="mobile-login-button"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
            <Link href="/register" onClick={closeSheet}>
              <AdaptiveAnimation
                highPerformance="hover:scale-105 transition-transform duration-200"
                mediumPerformance=""
                lowPerformance=""
              >
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white flex items-center justify-center gap-2 touch-active"
                  data-testid="mobile-register-button"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Activate</span>
                </Button>
              </AdaptiveAnimation>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
