"use client"
// Konfiguriere die Startseite für ISR mit einer Revalidierungszeit von 1 Stunde
export const revalidate = 3600

import Link from "next/link"
import Image from "next/image"
import { Shield, Zap, HeadsetIcon, Star, Sparkles, Target, Users2, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
// REMOVED: import { Navigation } from "@/components/navigation" - This was causing duplicate
import { PerformanceAwareBackground } from "@/components/performance-aware-background"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { SmartLoadingAnimation } from "@/components/smart-loading-animation"
import { usePerformance } from "@/hooks/use-performance"
import { formatPrice } from "@/utils/price-formatter"

export default function Home() {
  const performance = usePerformance()

  return (
    <PerformanceAwareBackground className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* REMOVED: <Navigation /> - This was causing duplicate navigation */}

      <main className="min-h-screen relative z-10">
        {/* Features Section with Glass Cards */}
        <section className="py-8 sm:py-12 md:py-20 relative">
          <div className="container mx-auto px-4 sm:px-6 grid gap-6 sm:gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-amber-500/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 animate-pulse-slow">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="text-white text-sm font-medium">Premium Gaming Solutions</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent">
                A Whole New Experience Of Gaming With <span className="text-amber-400 animate-pulse">lvlup</span>
              </h1>

              <p className="text-lg text-purple-100/90">
                Level up your gaming skills with our undetected aimbot & ESP. Gain the competitive edge you've been
                looking for.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300">
                  <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-medium text-white group-hover:text-amber-400 transition-colors">
                    100% Undetected
                  </span>
                </div>
                <div className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300">
                  <div
                    className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-medium text-white group-hover:text-amber-400 transition-colors">
                    Fast Delivery
                  </span>
                </div>
                <div className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300">
                  <div
                    className="p-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                  >
                    <HeadsetIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-medium text-white group-hover:text-amber-400 transition-colors">
                    24/7 Support
                  </span>
                </div>
              </div>

              <MobileOptimizedCard className="p-4">
                <p className="font-medium text-white">
                  <span className="text-amber-400 font-bold text-xl animate-pulse">13+ years</span> of experience with
                  developers from all over Europe.
                </p>
              </MobileOptimizedCard>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white rounded-full px-8 py-3 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-amber-500/25"
                >
                  <Link href="/products">
                    <span className="mr-2">🛒</span> Products
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-amber-400/70 text-amber-400 hover:bg-amber-400/10 backdrop-blur-md rounded-full px-8 py-3 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Link href="/forum">Forum</Link>
                </Button>
              </div>

              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-2">
                <div className="flex animate-pulse-slow">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white font-bold">4.8/5.0</span>
                <span className="text-purple-200 text-sm">from 10,000+ reviews</span>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 opacity-20 blur-3xl animate-pulse"></div>
              <MobileOptimizedCard className="relative p-8 shadow-2xl group">
                <div className="flex flex-col items-center gap-6">
                  <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-6 animate-bounce-slow group-hover:animate-spin">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 127.14 96.36"
                      fill="#fff"
                    >
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-white">Join Our Discord</h3>
                  <p className="text-sm text-center text-purple-200">
                    Get instant support and connect with our community
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full py-3 hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    <Link href="https://discord.gg/CN8XS9Eb" target="_blank" rel="noopener noreferrer">
                      Join Discord
                    </Link>
                  </Button>
                </div>
              </MobileOptimizedCard>
            </div>
          </div>
        </section>

        {/* Top Products Section with Enhanced Glass Cards */}
        <section className="py-10 sm:py-12 md:py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-6 animate-bounce-slow">
                <Target className="h-5 w-5 text-amber-400 animate-pulse" />
                <span className="text-white font-medium">Premium Gaming Arsenal</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent mb-4">
                Top Products
              </h2>
              <p className="text-purple-200 max-w-2xl mx-auto">
                Discover our most popular gaming enhancements, trusted by thousands of players worldwide
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Product Card 1 - Fortnite */}
              <MobileOptimizedCard className="group relative overflow-hidden shadow-2xl">
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white animate-pulse">
                  Popular
                </div>
                <div className="aspect-video overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
                  <Image
                    src="/fortnite-star-wars.jpg"
                    alt="Fortnite lvlup Cheat"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Fortnite lvlup Cheat</h3>
                  <p className="text-sm text-purple-200 mb-4">
                    Premium Fortnite cheat with aimbot, ESP and more features
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      {formatPrice(19.99)}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-red-500 text-white rounded-full px-6 hover:scale-105 transition-all duration-300"
                    >
                      <Link href="/products/fortnite">View Details</Link>
                    </Button>
                  </div>
                </div>
              </MobileOptimizedCard>

              {/* Product Card 2 - Valorant */}
              <MobileOptimizedCard className="group relative overflow-hidden shadow-2xl">
                <div className="aspect-video overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
                  <Image
                    src="/valorant.png"
                    alt="Valorant lvlup Cheat"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Valorant lvlup Cheat</h3>
                  <p className="text-sm text-purple-200 mb-4">Premium Valorant cheat with advanced features</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      {formatPrice(19.99)}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-red-500 text-white rounded-full px-6 hover:scale-105 transition-all duration-300"
                    >
                      <Link href="/products/valorant">View Details</Link>
                    </Button>
                  </div>
                </div>
              </MobileOptimizedCard>

              {/* Product Card 3 - CS2 */}
              <MobileOptimizedCard className="group relative overflow-hidden shadow-2xl">
                <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white animate-pulse">
                  New
                </div>
                <div className="aspect-video overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
                  <Image
                    src="/cs2.png"
                    alt="CS2 lvlup Cheat"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">CS2 lvlup Cheat</h3>
                  <p className="text-sm text-purple-200 mb-4">Premium CS2 cheat with aimbot and wallhack</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      {formatPrice(19.99)}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-red-500 text-white rounded-full px-6 hover:scale-105 transition-all duration-300"
                    >
                      <Link href="/products/cs2">View Details</Link>
                    </Button>
                  </div>
                </div>
              </MobileOptimizedCard>
            </div>
          </div>
        </section>

        {/* Enhanced Reviews Banner with More Animation */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 py-4 overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {/* Enhanced review items with more visual flair */}
            {[
              {
                name: "MG",
                review: "Best Fortnite cheat I've ever used!",
                user: "MikeGamer",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "VP",
                review: "Valorant ESP is undetectable, amazing!",
                user: "ValPro",
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "AH",
                review: "Customer support is top notch!",
                user: "ApexHunter",
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "WZ",
                review: "Warzone cheat works flawlessly!",
                user: "WarzoneKing",
                color: "from-amber-500 to-orange-500",
              },
              {
                name: "RB",
                review: "Instant delivery, no waiting!",
                user: "RustBeast",
                color: "from-red-500 to-pink-500",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center mx-6 py-2 group">
                <div
                  className={`h-10 w-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mr-4 animate-pulse group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-sm font-bold text-white">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex mr-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse"
                        style={{ animationDelay: `${star * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-white text-sm font-medium mr-3 group-hover:text-amber-300 transition-colors">
                    "{item.review}"
                  </span>
                  <span className="text-purple-200 text-xs">- {item.user}</span>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              {
                name: "MG",
                review: "Best Fortnite cheat I've ever used!",
                user: "MikeGamer",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "VP",
                review: "Valorant ESP is undetectable, amazing!",
                user: "ValPro",
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "AH",
                review: "Customer support is top notch!",
                user: "ApexHunter",
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "WZ",
                review: "Warzone cheat works flawlessly!",
                user: "WarzoneKing",
                color: "from-amber-500 to-orange-500",
              },
              {
                name: "RB",
                review: "Instant delivery, no waiting!",
                user: "RustBeast",
                color: "from-red-500 to-pink-500",
              },
            ].map((item, index) => (
              <div key={`dup-${index}`} className="flex items-center mx-6 py-2 group">
                <div
                  className={`h-10 w-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mr-4 animate-pulse group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-sm font-bold text-white">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex mr-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse"
                        style={{ animationDelay: `${star * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-white text-sm font-medium mr-3 group-hover:text-amber-300 transition-colors">
                    "{item.review}"
                  </span>
                  <span className="text-purple-200 text-xs">- {item.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Special Offer Section */}
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
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="lg:w-1/2 space-y-6">
                <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-2 animate-bounce-slow">
                  🔥 Limited Time Offer
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">
                  50% OFF Fortnite Lifetime Package
                </h2>
                <p className="text-purple-100 text-lg">
                  Get our premium Fortnite cheat with lifetime access including aimbot, ESP, radar hack, and HWID
                  spoofer at half price.
                </p>

                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                      {formatPrice(29.99)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-purple-300 line-through text-lg">{formatPrice(59.99)}</span>
                      <span className="text-amber-400 font-semibold">Save 50%</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-purple-200 text-sm mb-2">Offer ends in:</span>
                    <div className="flex gap-3">
                      {[
                        { value: "2", label: "Days" },
                        { value: "18", label: "Hours" },
                        { value: "45", label: "Min" },
                      ].map((time, index) => (
                        <MobileOptimizedCard
                          key={index}
                          className="px-3 py-2 text-center min-w-[60px]"
                          enableScale={false}
                        >
                          <div className="text-white text-lg font-bold animate-pulse">{time.value}</div>
                          <div className="text-purple-300 text-xs">{time.label}</div>
                        </MobileOptimizedCard>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-red-500 hover:to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-amber-500/25 animate-pulse-slow"
                  >
                    <Link href="/products/fortnite">
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Claim Offer Now
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-amber-400/70 text-amber-400 hover:bg-amber-400/10 backdrop-blur-md rounded-full px-8 py-3 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <Link href="/products/fortnite">View Details</Link>
                  </Button>
                </div>
              </div>

              <div className="lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-transparent rounded-2xl"></div>
                <MobileOptimizedCard className="relative p-6 shadow-2xl group">
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full uppercase animate-pulse">
                    Best Value
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">Fortnite Lifetime Package Includes:</h3>

                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-start gap-3 group/item hover:scale-105 transition-transform duration-300">
                      <div className="text-lg animate-bounce-slow" style={{ animationDelay: "0s" }}>
                        🎯
                      </div>
                      <div>
                        <span className="text-white font-medium group-hover/item:text-amber-400 transition-colors">
                          Advanced Aimbot
                        </span>
                        <p className="text-purple-300 text-xs">
                          Precision targeting with customizable FOV and smoothness
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item hover:scale-105 transition-transform duration-300">
                      <div className="text-lg animate-bounce-slow" style={{ animationDelay: "0.2s" }}>
                        👁️
                      </div>
                      <div>
                        <span className="text-white font-medium group-hover/item:text-amber-400 transition-colors">
                          Full ESP Features
                        </span>
                        <p className="text-purple-300 text-xs">Player boxes, health bars, items, and chest locations</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item hover:scale-105 transition-transform duration-300">
                      <div className="text-lg animate-bounce-slow" style={{ animationDelay: "0.4s" }}>
                        📡
                      </div>
                      <div>
                        <span className="text-white font-medium group-hover/item:text-amber-400 transition-colors">
                          Radar Hack
                        </span>
                        <p className="text-purple-300 text-xs">See all players on your minimap in real-time</p>
                      </div>
                    </li>
                  </ul>

                  <div className="flex items-center justify-between border-t border-white/20 pt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse"
                            style={{ animationDelay: `${star * 0.1}s` }}
                          />
                        ))}
                      </div>
                      <span className="text-purple-200">4.8/5 (342 reviews)</span>
                    </div>
                    <div className="text-purple-200">
                      <span className="text-amber-400 font-bold animate-pulse">1,847</span> sold this week
                    </div>
                  </div>
                </MobileOptimizedCard>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Why Choose Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-indigo-900/50 backdrop-blur-sm"></div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8 animate-bounce-slow">
                <Users2 className="h-5 w-5 text-amber-400 animate-pulse" />
                <span className="text-white font-medium">Trusted by 10,000+ Gamers</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent mb-6">
                Why Choose lvlup?
              </h2>
              <p className="text-purple-100 mb-8 max-w-3xl mx-auto text-lg">
                Our premium cheats deliver unmatched precision and reliability with industry-leading detection evasion
                technology. Each product is meticulously engineered with customizable settings for aimbot sensitivity,
                ESP visibility range, and trigger preferences—allowing you to tailor your advantage to match your exact
                playstyle.
              </p>

              <div className="mb-16 max-w-4xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-6 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                  <MobileOptimizedCard className="relative aspect-video shadow-2xl">
                    <video
                      className="w-full h-full object-cover rounded-2xl"
                      controls
                      poster="/gaming-software-interface.png"
                    >
                      <source src="#" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white group-hover:bg-black/20 transition-all duration-300 rounded-2xl">
                      <div className="text-center p-8">
                        <div className="mb-4 animate-bounce-slow">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">See Our Cheat in Action</h3>
                        <p className="text-purple-200">
                          Watch how our advanced aimbot and ESP features give you the competitive edge
                        </p>
                      </div>
                    </div>
                  </MobileOptimizedCard>
                </div>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Shield,
                  title: "Undetected",
                  desc: "Our products use advanced technology to remain undetected by anti-cheat systems.",
                  color: "from-green-400 to-emerald-500",
                },
                {
                  icon: Zap,
                  title: "Instant Delivery",
                  desc: "Get access to your products immediately after purchase with our automated system.",
                  color: "from-amber-400 to-orange-500",
                },
                {
                  icon: HeadsetIcon,
                  title: "24/7 Support",
                  desc: "Our dedicated support team is available around the clock to assist you with any issues.",
                  color: "from-blue-400 to-cyan-500",
                },
              ].map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <MobileOptimizedCard className="relative p-8 shadow-xl">
                    <div
                      className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r ${feature.color} p-4 animate-bounce-slow group-hover:animate-pulse`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-purple-200 group-hover:text-purple-100 transition-colors">{feature.desc}</p>
                  </MobileOptimizedCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Newsletter Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-amber-500/20 backdrop-blur-sm"></div>
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500 rounded-full opacity-10 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <MobileOptimizedCard className="relative shadow-2xl overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <div className="p-10 md:p-12 flex flex-col justify-center">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 animate-pulse-slow">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span className="text-white text-sm font-medium">Exclusive Updates</span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent mb-6">
                        Stay Ahead of the Game
                      </h2>
                      <p className="text-purple-200 mb-8 text-lg">
                        Subscribe to our newsletter and be the first to know about:
                      </p>

                      <ul className="space-y-4 mb-8">
                        {[
                          "New product releases and updates",
                          "Exclusive discounts and promotions",
                          "Tips and tricks to improve your gaming",
                        ].map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 group/item hover:scale-105 transition-transform duration-300"
                          >
                            <div
                              className="rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-1 mt-1 animate-pulse"
                              style={{ animationDelay: `${index * 0.2}s` }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            </div>
                            <span className="text-white group-hover/item:text-amber-400 transition-colors">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-6 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-purple-300 hover:bg-white/20 transition-all duration-300"
                          />
                        </div>
                        <Button className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-red-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl">
                          Subscribe
                        </Button>
                      </div>
                      <p className="text-xs text-purple-300 mt-6">
                        By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600/80 to-purple-800/80 backdrop-blur-md p-10 md:p-12 flex flex-col justify-center text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                      <div
                        className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/20 rounded-full blur-xl animate-pulse"
                        style={{ animationDelay: "1s" }}
                      ></div>

                      <div className="mb-8 relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mb-6 animate-bounce-slow">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Join 10,000+ Gamers</h3>
                        <p className="text-purple-200">
                          Our community is growing fast. Don't miss out on the latest gaming advantages.
                        </p>
                      </div>

                      <div className="space-y-6 relative z-10">
                        {[
                          {
                            name: "JD",
                            text: "The newsletter alerts have saved me from missing out on limited-time offers multiple times!",
                            user: "John D. - Premium Member",
                          },
                          {
                            name: "AK",
                            text: "I got early access to the new Valorant features thanks to the newsletter!",
                            user: "Alex K. - VIP Member",
                          },
                        ].map((testimonial, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 group hover:scale-105 transition-transform duration-300"
                          >
                            <div
                              className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 animate-pulse"
                              style={{ animationDelay: `${index * 0.5}s` }}
                            >
                              <span className="text-sm font-bold">{testimonial.name}</span>
                            </div>
                            <div>
                              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-2 group-hover:bg-white/20 transition-all duration-300">
                                <p className="text-sm">"{testimonial.text}"</p>
                              </div>
                              <p className="text-xs text-purple-200">{testimonial.user}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </MobileOptimizedCard>
              </div>
            </div>
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
                  { href: "/info", label: "Info" },
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
                <Link
                  href="https://discord.gg/CN8XS9Eb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-110 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 127.14 96.36"
                      fill="#fff"
                      className="h-6 w-6"
                    >
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                </Link>
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
