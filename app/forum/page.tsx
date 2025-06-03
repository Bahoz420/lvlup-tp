"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, MessageSquare, Users, Clock, Search } from "lucide-react"
import {
  Home,
  Package,
  Info,
  ImageIcon,
  LayoutDashboard,
  HelpCircle,
  MessageSquareIcon,
  ChevronDown,
  Mail,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileNavigation } from "@/components/mobile-navigation"

// import { AdaptiveAnimation } from "@/components/adaptive-animation"
// import { PerformanceAwareBackground } from "@/components/performance-aware-background"
// import { SmartLoadingAnimation } from "@/components/smart-loading-animation"
// import { usePerformance } from "@/hooks/use-performance"

export default function ForumPage() {
  // const { shouldReduceMotion } = usePerformance()

  // Floating Orb Component
  const FloatingOrb = ({
    size,
    color,
    delay,
    duration,
  }: { size: string; color: string; delay: string; duration: string }) => (
    <div
      className={`absolute ${size} ${color} rounded-full blur-xl opacity-20 animate-float`}
      style={{
        animationDelay: delay,
        animationDuration: duration,
      }}
    />
  )

  // Animated Dot Pattern Component
  const AnimatedDotPattern = () => (
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-slide-right" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(147, 51, 234, 0.3) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Performance-aware background with floating elements */}
      {/* <PerformanceAwareBackground /> */}

      {/* Floating orbs */}
      <FloatingOrb size="w-64 h-64" color="bg-purple-500" delay="0s" duration="20s" />
      <FloatingOrb size="w-48 h-48" color="bg-blue-500" delay="5s" duration="25s" />
      <FloatingOrb size="w-32 h-32" color="bg-pink-500" delay="10s" duration="30s" />
      <FloatingOrb size="w-56 h-56" color="bg-indigo-500" delay="15s" duration="22s" />

      {/* Animated dot pattern */}
      <AnimatedDotPattern />

      {/* Navigation with dark overlay */}
      <div className="relative z-50 bg-black/20 backdrop-blur-md">
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
          {/* Keep the existing header content but add glassmorphism styling */}
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="lvlup Logo" width={180} height={180} className="h-14 w-auto" />
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white hover:glow"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/products"
                  className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white hover:glow"
                >
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                </Link>
                <Link
                  href="/info"
                  className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white hover:glow"
                >
                  <Info className="h-4 w-4" />
                  <span>Status</span>
                </Link>
                <Link
                  href="/gallery"
                  className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white hover:glow"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Gallery</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white hover:glow"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white hover:glow">
                    <span>More</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute left-0 top-full hidden w-48 overflow-hidden rounded-md border border-white/20 bg-black/80 backdrop-blur-md shadow-md group-hover:block">
                    <Link
                      href="/faq"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>FAQ</span>
                    </Link>
                    <Link
                      href="/forum"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/20 bg-white/10"
                    >
                      <MessageSquareIcon className="h-4 w-4" />
                      <span>Forum</span>
                    </Link>
                    <Link
                      href="/support"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Support</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Contact</span>
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] pl-8 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-purple-500 backdrop-blur-md"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex border-white/20 text-white/80 hover:bg-white/10 hover:text-white backdrop-blur-md"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="hidden md:flex bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg hover:shadow-amber-500/25"
              >
                Register
              </Button>
              <MobileNavigation isDark={true} />
            </div>
          </div>
        </header>
      </div>

      {/* Main content with glassmorphism */}
      <div className="container py-8 relative z-10">
        {/* <AdaptiveAnimation>
          <SmartLoadingAnimation delay={0}> */}
        <div className="flex items-center gap-2 mb-6 text-sm text-white/80">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-white">Forum</span>
        </div>
        {/* </SmartLoadingAnimation>
        </AdaptiveAnimation>

        <AdaptiveAnimation>
          <SmartLoadingAnimation delay={200}> */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 glow-text">Community Forum</h1>
          <p className="text-white/80 max-w-3xl">
            Join our community discussions, share your experiences, ask questions, and get help from other lvlup users
            and our support team.
          </p>
        </div>
        {/* </SmartLoadingAnimation>
        </AdaptiveAnimation> */}

        <div className="grid gap-6 lg:grid-cols-4 mb-8">
          {/* <AdaptiveAnimation>
            <SmartLoadingAnimation delay={400}> */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Search Forum Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <h3 className="font-medium text-white mb-3">Search Forum</h3>
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search topics..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-purple-500 backdrop-blur-md"
                />
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <h3 className="font-medium text-white mb-3">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="flex items-center justify-between text-white/80 hover:text-white transition-colors"
                  >
                    <span>Announcements</span>
                    <span className="text-xs bg-purple-500/30 backdrop-blur-md px-2 py-1 rounded-full border border-purple-400/30">
                      12
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center justify-between text-white/80 hover:text-white transition-colors"
                  >
                    <span>General Discussion</span>
                    <span className="text-xs bg-purple-500/30 backdrop-blur-md px-2 py-1 rounded-full border border-purple-400/30">
                      45
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center justify-between text-white/80 hover:text-white transition-colors"
                  >
                    <span>Technical Support</span>
                    <span className="text-xs bg-purple-500/30 backdrop-blur-md px-2 py-1 rounded-full border border-purple-400/30">
                      28
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center justify-between text-white/80 hover:text-white transition-colors"
                  >
                    <span>Game Specific</span>
                    <span className="text-xs bg-purple-500/30 backdrop-blur-md px-2 py-1 rounded-full border border-purple-400/30">
                      67
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center justify-between text-white/80 hover:text-white transition-colors"
                  >
                    <span>Tutorials & Guides</span>
                    <span className="text-xs bg-purple-500/30 backdrop-blur-md px-2 py-1 rounded-full border border-purple-400/30">
                      19
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Forum Stats Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <h3 className="font-medium text-white mb-3">Forum Stats</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Topics:</span>
                  <span className="font-medium text-white">1,245</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Posts:</span>
                  <span className="font-medium text-white">8,721</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Members:</span>
                  <span className="font-medium text-white">3,492</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Online Now:</span>
                  <span className="font-medium text-white">42</span>
                </li>
              </ul>
            </div>

            {/* Join Discussion Card */}
            <div className="bg-gradient-to-br from-purple-600/80 to-purple-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 text-white border border-purple-400/30 hover:scale-105 transition-all duration-300">
              <h3 className="font-bold text-xl mb-3 glow-text">Join the Discussion</h3>
              <p className="mb-4 text-purple-100">
                Create an account to participate in discussions and get help from our community.
              </p>
              <Button className="w-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30 shadow-lg hover:shadow-white/25">
                Create Account
              </Button>
            </div>
          </div>
          {/* </SmartLoadingAnimation>
          </AdaptiveAnimation>

          <AdaptiveAnimation>
            <SmartLoadingAnimation delay={600}> */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <Tabs defaultValue="latest" className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="bg-white/10 backdrop-blur-md border border-white/20 p-1">
                    <TabsTrigger
                      value="latest"
                      className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                    >
                      Latest
                    </TabsTrigger>
                    <TabsTrigger
                      value="popular"
                      className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                    >
                      Popular
                    </TabsTrigger>
                    <TabsTrigger
                      value="unanswered"
                      className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                    >
                      Unanswered
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300"
                    size="sm"
                  >
                    New Topic
                  </Button>
                </div>

                {/* Keep the existing TabsContent but add glassmorphism styling to forum topic cards */}
                <TabsContent value="latest" className="mt-0">
                  <div className="space-y-4">
                    {/* Update each forum topic card with glassmorphism */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] touch-active">
                      {/* Keep existing forum topic content but update colors to white/light colors */}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href="#" className="text-lg font-bold text-white hover:text-white/80">
                              Fortnite cheat not working after latest update
                            </Link>
                            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>GamerPro123</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>2 hours ago</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>12 replies</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                            Fortnite
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/80 line-clamp-2">
                          After the latest Fortnite update, the aimbot feature is not working properly. I've tried
                          reinstalling but still having issues. Has anyone else experienced this problem?
                        </p>
                      </div>
                      <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-purple-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-800">JD</span>
                          </div>
                          <span className="text-xs text-white/60">Last reply by JohnDoe</span>
                        </div>
                        <Link href="#" className="text-xs font-medium text-white hover:text-white/80">
                          View Topic →
                        </Link>
                      </div>
                    </div>

                    {/* Forum Topic 2 */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] touch-active">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href="#" className="text-lg font-bold text-white hover:text-white/80">
                              Best settings for Valorant ESP?
                            </Link>
                            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>ValMaster</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>5 hours ago</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>8 replies</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                            Valorant
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/80 line-clamp-2">
                          I'm trying to optimize my Valorant ESP settings for better visibility without being too
                          obvious. What settings are you all using for competitive play?
                        </p>
                      </div>
                      <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-purple-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-800">AK</span>
                          </div>
                          <span className="text-xs text-white/60">Last reply by AimKing</span>
                        </div>
                        <Link href="#" className="text-xs font-medium text-white hover:text-white/80">
                          View Topic →
                        </Link>
                      </div>
                    </div>

                    {/* Forum Topic 3 */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] touch-active">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href="#" className="text-lg font-bold text-white hover:text-white/80">
                              [ANNOUNCEMENT] New Apex Legends cheat released!
                            </Link>
                            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>Admin</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>1 day ago</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>24 replies</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Announcement
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/80 line-clamp-2">
                          We're excited to announce the release of our new Apex Legends cheat! This version includes
                          improved aimbot, ESP features, and is fully undetected with the latest game update.
                        </p>
                      </div>
                      <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-purple-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-800">SU</span>
                          </div>
                          <span className="text-xs text-white/60">Last reply by SupportUser</span>
                        </div>
                        <Link href="#" className="text-xs font-medium text-white hover:text-white/80">
                          View Topic →
                        </Link>
                      </div>
                    </div>

                    {/* Forum Topic 4 */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] touch-active">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href="#" className="text-lg font-bold text-white hover:text-white/80">
                              Payment methods not working?
                            </Link>
                            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>NewUser42</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>2 days ago</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>3 replies</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Support
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/80 line-clamp-2">
                          I'm trying to purchase the Warzone cheat but my credit card keeps getting declined. Are there
                          any alternative payment methods available? I've tried multiple cards.
                        </p>
                      </div>
                      <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-purple-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-800">ST</span>
                          </div>
                          <span className="text-xs text-white/60">Last reply by SupportTeam</span>
                        </div>
                        <Link href="#" className="text-xs font-medium text-white hover:text-white/80">
                          View Topic →
                        </Link>
                      </div>
                    </div>

                    {/* Forum Topic 5 */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] touch-active">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href="#" className="text-lg font-bold text-white hover:text-white/80">
                              Tutorial: How to set up HWID spoofer
                            </Link>
                            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>TechGuru</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>3 days ago</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>17 replies</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            Tutorial
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/80 line-clamp-2">
                          In this tutorial, I'll show you how to properly set up and use the HWID spoofer to avoid
                          hardware bans. This is essential for maintaining account security when using our products.
                        </p>
                      </div>
                      <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-purple-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-800">TG</span>
                          </div>
                          <span className="text-xs text-white/60">Last reply by TechGuru</span>
                        </div>
                        <Link href="#" className="text-xs font-medium text-white hover:text-white/80">
                          View Topic →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8 border-purple-200">
                        <ChevronRight className="h-4 w-4 rotate-180" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 border-purple-200 bg-purple-100">
                        1
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 border-purple-200">
                        2
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 border-purple-200">
                        3
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 border-purple-200">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  </div>
                </TabsContent>

                <TabsContent value="popular" className="mt-0">
                  <div className="space-y-4">
                    {/* Popular forum topics would go here */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] touch-active">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href="#" className="text-lg font-bold text-white hover:text-white/80">
                              [ANNOUNCEMENT] New Apex Legends cheat released!
                            </Link>
                            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>Admin</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>1 day ago</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>24 replies</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Announcement
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/80 line-clamp-2">
                          We're excited to announce the release of our new Apex Legends cheat! This version includes
                          improved aimbot, ESP features, and is fully undetected with the latest game update.
                        </p>
                      </div>
                      <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-purple-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-800">SU</span>
                          </div>
                          <span className="text-xs text-white/60">Last reply by SupportUser</span>
                        </div>
                        <Link href="#" className="text-xs font-medium text-white hover:text-white/80">
                          View Topic →
                        </Link>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="unanswered" className="mt-0">
                  <div className="space-y-4">
                    {/* Unanswered forum topics would go here */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] touch-active">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href="#" className="text-lg font-bold text-white hover:text-white/80">
                              Payment methods not working?
                            </Link>
                            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>NewUser42</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>2 days ago</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>0 replies</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Support
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/80 line-clamp-2">
                          I'm trying to purchase the Warzone cheat but my credit card keeps getting declined. Are there
                          any alternative payment methods available? I've tried multiple cards.
                        </p>
                      </div>
                      <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
                        <span className="text-xs text-white/60">No replies yet</span>
                        <Link href="#" className="text-xs font-medium text-white hover:text-white/80">
                          View Topic →
                        </Link>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          {/* </SmartLoadingAnimation>
          </AdaptiveAnimation> */}
        </div>
      </div>

      {/* Footer with glassmorphism */}
      <footer className="bg-black/40 backdrop-blur-md text-white py-12 border-t border-white/10">
        {/* Keep existing footer content but update colors */}
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Image src="/logo-white.png" alt="lvlup Logo" width={180} height={180} className="h-14 w-auto mb-4" />
              <p className="text-purple-200 text-sm">
                Level up your gaming experience with our premium products and services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-purple-200 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-purple-200 hover:text-white transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/info" className="text-purple-200 hover:text-white transition-colors">
                    Info
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="text-purple-200 hover:text-white transition-colors">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-purple-200 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-purple-200 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-purple-200 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-purple-200 hover:text-white transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <Link href="#" className="text-purple-200 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>
                <Link href="#" className="text-purple-200 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Link>
                <Link href="#" className="text-purple-200 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
                <Link href="#" className="text-purple-200 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 127.14 96.36"
                    fill="currentColor"
                  >
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                </Link>
              </div>
              <p className="text-sm text-purple-200">Email: support@lvlup.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-purple-800 text-center text-sm text-purple-300">
            <p>© 2025 lvlup. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(-20px) rotate(240deg); }
        }
        
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-slide-right {
          animation: slide-right 15s linear infinite;
        }
        
        .glow-text {
          text-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
        }
        
        .hover\\:glow:hover {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        }

        .touch-active:active {
          transform: scale(0.98);
          transition: transform 0.1s ease-out;
        }
      `}</style>
    </div>
  )
}
