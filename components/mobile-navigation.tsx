"use client"

import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Home,
  ShoppingBag,
  Info,
  ImageIcon,
  Users,
  LayoutDashboard,
  HeartHandshake,
  FileQuestion,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  BarChart3,
  BookOpen,
} from "lucide-react"

interface MobileNavigationProps {
  isDark?: boolean
}

export function MobileNavigation({ isDark = false }: MobileNavigationProps) {
  const [infoOpen, setInfoOpen] = useState(false)

  const textColor = isDark ? "text-white" : "text-purple-700"
  const hoverColor = isDark ? "hover:text-purple-300" : "hover:text-purple-900"
  const bgColor = isDark ? "bg-black/90 backdrop-blur-md border-white/20" : "bg-white"
  const buttonColor = isDark
    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
    : "border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-900"
  const gradientButton = isDark
    ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
    : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={`md:hidden ${isDark ? "text-white hover:bg-white/10" : ""}`}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={`w-[300px] sm:w-[400px] pt-10 ${bgColor}`}>
        <nav className="flex flex-col gap-4">
          <Link href="/" className={`flex items-center gap-2 text-lg font-medium ${textColor} ${hoverColor}`}>
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link href="/products" className={`flex items-center gap-2 text-lg font-medium ${textColor} ${hoverColor}`}>
            <ShoppingBag className="h-5 w-5" />
            <span>Products</span>
          </Link>

          {/* Info dropdown for mobile */}
          <div>
            <button
              onClick={() => setInfoOpen(!infoOpen)}
              className={`flex items-center justify-between w-full text-lg font-medium ${textColor} ${hoverColor}`}
            >
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <span>Info</span>
              </div>
              {infoOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>

            {infoOpen && (
              <div
                className={`ml-7 mt-2 space-y-2 border-l-2 ${isDark ? "border-white/20" : "border-purple-100"} pl-4`}
              >
                <Link
                  href="/info"
                  className={`flex items-center gap-2 text-base font-medium ${textColor} ${hoverColor}`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Status</span>
                </Link>
                <Link
                  href="/info/setup-guide"
                  className={`flex items-center gap-2 text-base font-medium ${textColor} ${hoverColor}`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Setup Guide</span>
                </Link>
              </div>
            )}
          </div>

          <Link href="/gallery" className={`flex items-center gap-2 text-lg font-medium ${textColor} ${hoverColor}`}>
            <ImageIcon className="h-5 w-5" />
            <span>Gallery</span>
          </Link>
          <Link href="/community" className={`flex items-center gap-2 text-lg font-medium ${textColor} ${hoverColor}`}>
            <Users className="h-5 w-5" />
            <span>Community</span>
          </Link>
          <Link href="/dashboard" className={`flex items-center gap-2 text-lg font-medium ${textColor} ${hoverColor}`}>
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/support" className={`flex items-center gap-2 text-lg font-medium ${textColor} ${hoverColor}`}>
            <HeartHandshake className="h-5 w-5" />
            <span>Support</span>
          </Link>
          <Link href="/faq" className={`flex items-center gap-2 text-lg font-medium ${textColor} ${hoverColor}`}>
            <FileQuestion className="h-5 w-5" />
            <span>FAQ</span>
          </Link>
          <Link href="/contact" className={`flex items-center gap-2 text-lg font-medium ${textColor} ${hoverColor}`}>
            <MessageSquare className="h-5 w-5" />
            <span>Contact</span>
          </Link>

          <div className={`h-px ${isDark ? "bg-white/20" : "bg-purple-100"} my-2`} />

          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button variant="outline" className={`w-full ${buttonColor}`}>
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className={`w-full ${gradientButton}`}>Activate</Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
