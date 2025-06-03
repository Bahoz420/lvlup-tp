"use client"
// Konfiguriere die Community-Seite für ISR mit einer Revalidierungszeit von 1 Stunde
export const revalidate = 3600

import Link from "next/link"
import Image from "next/image"
import { Users, MessageSquare, Trophy, Calendar, Upload, Award, UserPlus, Users2, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
// REMOVED: import { Navigation } from "@/components/navigation" - This was causing duplicate
import { ForumThreads } from "@/components/forum-threads"
import { PerformanceAwareBackground } from "@/components/performance-aware-background"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { SmartLoadingAnimation } from "@/components/smart-loading-animation"
import { usePerformance } from "@/hooks/use-performance"

export default function CommunityPage() {
  const performance = usePerformance()

  return (
    <PerformanceAwareBackground className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* REMOVED: <Navigation /> - This was causing duplicate navigation */}

      <main className="min-h-screen relative z-10">
        {/* Hero Section */}
        <section className="py-8 sm:py-12 md:py-20 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-amber-500/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 animate-pulse-slow mb-6">
                <Users2 className="h-4 w-4 text-amber-400" />
                <span className="text-white text-sm font-medium">Gaming Community Hub</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent mb-6">
                Join the <span className="text-amber-400 animate-pulse">lvlup</span> Community
              </h1>

              <p className="text-lg text-purple-100/90 max-w-3xl mx-auto mb-8">
                Connect with thousands of gamers, participate in exciting contests, share your achievements, and get
                exclusive access to premium gaming content.
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex animate-pulse-slow">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white font-bold">4.9/5.0</span>
                <span className="text-purple-200 text-sm">from 15,000+ community members</span>
              </div>
            </div>

            {/* Community Features */}
            <div className="grid gap-8 md:grid-cols-3 mb-16">
              <MobileOptimizedCard className="group relative overflow-hidden shadow-2xl">
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white animate-pulse">
                  Active
                </div>
                <div className="p-8 text-center">
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 p-4 animate-bounce-slow group-hover:animate-pulse">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
                    Forum Discussions
                  </h3>
                  <p className="text-purple-200 mb-6">
                    Join discussions, ask questions, and share your experiences with other lvlup users in our active
                    community forum.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                    <Users className="h-4 w-4" />
                    <span>2,847 active members</span>
                  </div>
                </div>
              </MobileOptimizedCard>

              <MobileOptimizedCard className="group relative overflow-hidden shadow-2xl">
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white animate-pulse">
                  Hot
                </div>
                <div className="p-8 text-center">
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 p-4 animate-bounce-slow group-hover:animate-pulse">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
                    Gaming Contests
                  </h3>
                  <p className="text-purple-200 mb-6">
                    Participate in exciting gaming contests and tournaments. Win free access to premium cheats and
                    exclusive rewards.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                    <Award className="h-4 w-4" />
                    <span>12 active contests</span>
                  </div>
                </div>
              </MobileOptimizedCard>

              <MobileOptimizedCard className="group relative overflow-hidden shadow-2xl">
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white animate-pulse">
                  Live
                </div>
                <div className="p-8 text-center">
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-500 p-4 animate-bounce-slow group-hover:animate-pulse">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
                    Community Events
                  </h3>
                  <p className="text-purple-200 mb-6">
                    Stay updated on upcoming community events, tournaments, special promotions, and exclusive member
                    meetups.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                    <Calendar className="h-4 w-4" />
                    <span>3 upcoming events</span>
                  </div>
                </div>
              </MobileOptimizedCard>
            </div>
          </div>
        </section>

        {/* Forum Section */}
        <section className="py-10 sm:py-12 md:py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-6 animate-bounce-slow">
                <MessageSquare className="h-5 w-5 text-cyan-400 animate-pulse" />
                <span className="text-white font-medium">Community Forum</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent mb-4">
                Forum Discussions
              </h2>
              <p className="text-purple-200 max-w-2xl mx-auto">
                Connect with fellow gamers, share strategies, get help, and discuss the latest gaming trends
              </p>
            </div>

            <MobileOptimizedCard className="shadow-2xl">
              <div className="p-6">
                <ForumThreads />
              </div>
            </MobileOptimizedCard>
          </div>
        </section>

        {/* Contests Section */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-purple-900/80 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-6 animate-bounce-slow">
                <Trophy className="h-5 w-5 text-amber-400 animate-pulse" />
                <span className="text-white font-medium">Gaming Competitions</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent mb-4">
                Active Contests
              </h2>
              <p className="text-purple-100 text-lg max-w-2xl mx-auto mb-8">
                Showcase your skills, compete with other players, and win exclusive prizes including free premium access
                and special rewards.
              </p>

              <Button className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-red-500 hover:to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-amber-500/25 animate-pulse-slow mb-12">
                <Upload className="mr-2 h-5 w-5" />
                Submit Your Entry
              </Button>
            </div>

            <MobileOptimizedCard className="shadow-2xl overflow-hidden">
              <Tabs defaultValue="all" className="w-full">
                <div className="p-6 border-b border-white/10">
                  <TabsList className="bg-white/10 backdrop-blur-md w-full grid grid-cols-3 border border-white/20">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-300 text-white/70 hover:scale-105 transition-all"
                    >
                      All Contests
                    </TabsTrigger>
                    <TabsTrigger
                      value="popular"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-300 text-white/70 hover:scale-105 transition-all"
                    >
                      Popular
                    </TabsTrigger>
                    <TabsTrigger
                      value="ending-soon"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-300 text-white/70 hover:scale-105 transition-all"
                    >
                      Ending Soon
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="p-6">
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Contest Card 1 */}
                    <MobileOptimizedCard className="group relative overflow-hidden shadow-xl">
                      <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white animate-pulse">
                        Featured
                      </div>
                      <div className="aspect-video overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
                        <Image
                          src="/fortnite.png"
                          alt="Fortnite Best Clip Contest"
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                            Fortnite
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-amber-400">
                            <Calendar className="h-4 w-4" />
                            <span>Ends in 3 days</span>
                          </div>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                          Best Clip Contest
                        </h4>
                        <p className="text-purple-200 mb-4">
                          Submit your best Fortnite gameplay clips using our cheat. The winner gets 7 days of free
                          access!
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-400" />
                            <span className="font-medium text-white">7-day free access</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-purple-300">
                            <UserPlus className="h-4 w-4" />
                            <span>32 entries</span>
                          </div>
                        </div>
                      </div>
                    </MobileOptimizedCard>

                    {/* Contest Card 2 */}
                    <MobileOptimizedCard className="group relative overflow-hidden shadow-xl">
                      <div className="aspect-video overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
                        <Image
                          src="/valorant.png"
                          alt="Valorant Screenshot Contest"
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                            Valorant
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-amber-400">
                            <Calendar className="h-4 w-4" />
                            <span>Ends in 5 days</span>
                          </div>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                          Best Screenshot Contest
                        </h4>
                        <p className="text-purple-200 mb-4">
                          Share your most impressive Valorant screenshots. Top 3 winners get free access to our premium
                          package!
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-400" />
                            <span className="font-medium text-white">5-day free access</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-purple-300">
                            <UserPlus className="h-4 w-4" />
                            <span>47 entries</span>
                          </div>
                        </div>
                      </div>
                    </MobileOptimizedCard>

                    {/* Contest Card 3 */}
                    <MobileOptimizedCard className="group relative overflow-hidden shadow-xl">
                      <div className="aspect-video overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
                        <Image
                          src="/apex.png"
                          alt="Apex Legends Montage Contest"
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                            Apex Legends
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-amber-400">
                            <Calendar className="h-4 w-4" />
                            <span>Ends in 7 days</span>
                          </div>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                          Best Montage Contest
                        </h4>
                        <p className="text-purple-200 mb-4">
                          Create a montage of your best Apex Legends moments. The winner gets 10 days of free access!
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-400" />
                            <span className="font-medium text-white">10-day free access</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-purple-300">
                            <UserPlus className="h-4 w-4" />
                            <span>19 entries</span>
                          </div>
                        </div>
                      </div>
                    </MobileOptimizedCard>

                    {/* Contest Card 4 */}
                    <MobileOptimizedCard className="group relative overflow-hidden shadow-xl">
                      <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white animate-pulse">
                        Ending Soon
                      </div>
                      <div className="aspect-video overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
                        <Image
                          src="/warzone.png"
                          alt="Warzone Killstreak Contest"
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                            Warzone
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-red-400">
                            <Calendar className="h-4 w-4" />
                            <span>Ends in 2 days</span>
                          </div>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                          Best Killstreak Contest
                        </h4>
                        <p className="text-purple-200 mb-4">
                          Show off your best Warzone killstreak. Top 3 winners get free access to our premium package!
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-400" />
                            <span className="font-medium text-white">7-day free access</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-purple-300">
                            <UserPlus className="h-4 w-4" />
                            <span>28 entries</span>
                          </div>
                        </div>
                      </div>
                    </MobileOptimizedCard>
                  </div>
                </TabsContent>

                <TabsContent value="popular" className="p-6">
                  <div className="grid gap-8 md:grid-cols-2">
                    <MobileOptimizedCard className="group relative overflow-hidden shadow-xl">
                      <div className="aspect-video overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
                        <Image
                          src="/valorant.png"
                          alt="Valorant Screenshot Contest"
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                            Valorant
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-amber-400">
                            <Calendar className="h-4 w-4" />
                            <span>Ends in 5 days</span>
                          </div>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                          Best Screenshot Contest
                        </h4>
                        <p className="text-purple-200 mb-4">
                          Share your most impressive Valorant screenshots. Top 3 winners get free access!
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-400" />
                            <span className="font-medium text-white">5-day free access</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-purple-300">
                            <UserPlus className="h-4 w-4" />
                            <span>47 entries</span>
                          </div>
                        </div>
                      </div>
                    </MobileOptimizedCard>
                  </div>
                </TabsContent>

                <TabsContent value="ending-soon" className="p-6">
                  <div className="grid gap-8 md:grid-cols-2">
                    <MobileOptimizedCard className="group relative overflow-hidden shadow-xl">
                      <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white animate-pulse">
                        Ending Soon
                      </div>
                      <div className="aspect-video overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
                        <Image
                          src="/warzone.png"
                          alt="Warzone Killstreak Contest"
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                            Warzone
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-red-400">
                            <Calendar className="h-4 w-4" />
                            <span>Ends in 2 days</span>
                          </div>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                          Best Killstreak Contest
                        </h4>
                        <p className="text-purple-200 mb-4">
                          Show off your best Warzone killstreak. Top 3 winners get free access!
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-400" />
                            <span className="font-medium text-white">7-day free access</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-purple-300">
                            <UserPlus className="h-4 w-4" />
                            <span>28 entries</span>
                          </div>
                        </div>
                      </div>
                    </MobileOptimizedCard>
                  </div>
                </TabsContent>
              </Tabs>
            </MobileOptimizedCard>
          </div>
        </section>

        {/* Performance Debug Info */}
        {performance.shouldReduceAnimations && (
          <div className="fixed bottom-4 right-4 z-50">
            <MobileOptimizedCard className="p-3 bg-amber-500/20 border-amber-500/30">
              <div className="text-amber-300 text-xs flex items-center gap-2">
                <SmartLoadingAnimation size="sm" />
                Performance Mode Active
              </div>
            </MobileOptimizedCard>
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 animate-pulse"></div>

        <div className="container relative z-10">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <Image
                  src="/logo-white.png"
                  alt="lvlup Logo"
                  width={200}
                  height={50}
                  className="h-16 w-auto mb-6 relative z-10 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-purple-200 text-sm group-hover:text-purple-100 transition-colors">
                Level up your gaming experience with our premium products and services.
              </p>
            </div>

            <div className="group">
              <h3 className="text-lg font-bold mb-6 group-hover:text-amber-400 transition-colors">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/products", label: "Products" },
                  { href: "/info", label: "Status" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/community", label: "Community" },
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/faq", label: "FAQ" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group">
              <h3 className="text-lg font-bold mb-6 group-hover:text-amber-400 transition-colors">Legal</h3>
              <ul className="space-y-3">
                {[
                  { href: "/terms", label: "Terms of Service" },
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/refund", label: "Refund Policy" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group">
              <h3 className="text-lg font-bold mb-6 group-hover:text-amber-400 transition-colors">Connect With Us</h3>
              <div className="flex space-x-4 mb-6">
                {[
                  { icon: "discord", color: "from-indigo-500 to-purple-600" },
                  { icon: "twitter", color: "from-blue-400 to-cyan-500" },
                  { icon: "instagram", color: "from-pink-500 to-purple-600" },
                  { icon: "youtube", color: "from-red-500 to-pink-600" },
                ].map((social, index) => (
                  <Link key={index} href="#" className="group/social">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${social.color} hover:scale-110 transition-all duration-300 animate-pulse`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="h-6 w-6 bg-white rounded-sm"></div>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="text-sm text-purple-200 group-hover:text-purple-100 transition-colors">
                Email: support@lvlup.com
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-purple-700/50 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-purple-300">© 2025 lvlup. All rights reserved.</p>
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </PerformanceAwareBackground>
  )
}
