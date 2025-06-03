"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Download, Shield, Zap, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdaptiveAnimation } from "@/components/adaptive-animation"
import { PerformanceAwareBackground } from "@/components/performance-aware-background"

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <PerformanceAwareBackground />

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AdaptiveAnimation>
          <div
            className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "0s", animationDuration: "4s" }}
          />
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-blue-500/30 rounded-full blur-lg animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "6s" }}
          />
          <div
            className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          />
          <div
            className="absolute top-1/3 right-1/3 w-20 h-20 bg-cyan-500/25 rounded-full blur-md animate-ping"
            style={{ animationDelay: "3s", animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-20 right-10 w-36 h-36 bg-purple-600/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "4s", animationDuration: "7s" }}
          />
        </AdaptiveAnimation>
      </div>

      {/* Animated Dot Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            animation: "float 20s ease-in-out infinite",
          }}
        />
      </div>

      <div className="container py-8 relative z-10">
        {/* Breadcrumb */}
        <AdaptiveAnimation>
          <div className="flex items-center gap-2 mb-6 text-sm text-purple-300 animate-fade-in">
            <Link href="/" className="hover:text-white transition-colors duration-300 hover:glow">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/info" className="hover:text-white transition-colors duration-300 hover:glow">
              Status
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-white glow">Setup Guide</span>
          </div>
        </AdaptiveAnimation>

        {/* Header */}
        <AdaptiveAnimation>
          <div className="mb-8 text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 glow-text">
              Setup Guide
            </h1>
            <p className="text-purple-200 max-w-3xl mx-auto text-lg">
              Follow our step-by-step instructions to properly install and configure our products for optimal
              performance and safety.
            </p>
          </div>
        </AdaptiveAnimation>

        {/* Main Content */}
        <AdaptiveAnimation>
          <div
            className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden mb-10 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="p-6 relative">
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />

              <Tabs defaultValue="fortnite" className="w-full relative z-10">
                <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6 bg-black/40 backdrop-blur-md border border-white/20 p-2 rounded-xl">
                  <TabsTrigger
                    value="fortnite"
                    className="flex items-center gap-2 data-[state=active]:bg-purple-600/80 data-[state=active]:text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
                  >
                    <div className="w-5 h-5 relative">
                      <Image src="/fortnite.png" alt="Fortnite" fill className="object-cover rounded-sm" />
                    </div>
                    <span className="hidden md:inline">Fortnite</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="valorant"
                    className="flex items-center gap-2 data-[state=active]:bg-red-600/80 data-[state=active]:text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
                  >
                    <div className="w-5 h-5 relative">
                      <Image src="/valorant.png" alt="Valorant" fill className="object-cover rounded-sm" />
                    </div>
                    <span className="hidden md:inline">Valorant</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="cs2"
                    className="flex items-center gap-2 data-[state=active]:bg-orange-600/80 data-[state=active]:text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
                  >
                    <div className="w-5 h-5 relative">
                      <Image src="/cs2.png" alt="CS2" fill className="object-cover rounded-sm" />
                    </div>
                    <span className="hidden md:inline">CS2</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="warzone"
                    className="flex items-center gap-2 data-[state=active]:bg-green-600/80 data-[state=active]:text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
                  >
                    <div className="w-5 h-5 relative">
                      <Image src="/warzone.png" alt="Warzone" fill className="object-cover rounded-sm" />
                    </div>
                    <span className="hidden md:inline">Warzone</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="pubg"
                    className="flex items-center gap-2 data-[state=active]:bg-yellow-600/80 data-[state=active]:text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
                  >
                    <div className="w-5 h-5 relative">
                      <Image src="/pubg.png" alt="PUBG" fill className="object-cover rounded-sm" />
                    </div>
                    <span className="hidden md:inline">PUBG</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="rust"
                    className="flex items-center gap-2 data-[state=active]:bg-amber-600/80 data-[state=active]:text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
                  >
                    <div className="w-5 h-5 relative">
                      <Image src="/rust.png" alt="Rust" fill className="object-cover rounded-sm" />
                    </div>
                    <span className="hidden md:inline">Rust</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="fortnite" className="space-y-6">
                  {/* Game Header */}
                  <div className="bg-gradient-to-r from-purple-600/80 to-purple-800/80 backdrop-blur-md rounded-xl p-6 text-white border border-purple-400/30 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="w-16 h-16 relative flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Image src="/fortnite.png" alt="Fortnite" fill className="object-cover rounded-md" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-md blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold glow-text">Fortnite Cheat Setup</h2>
                        <p className="text-purple-100">Version 3.2.1 | Last Updated: May 12, 2025</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 relative z-10">
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-white/30 hover:bg-white/30 transition-all duration-300">
                        <CheckCircle className="h-4 w-4 animate-pulse" />
                        <span>Undetected</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-white/30 hover:bg-white/30 transition-all duration-300">
                        <Shield className="h-4 w-4" />
                        <span>HWID Spoofer Included</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-white/30 hover:bg-white/30 transition-all duration-300">
                        <Zap className="h-4 w-4 animate-pulse" />
                        <span>Performance Optimized</span>
                      </div>
                    </div>
                  </div>

                  {/* Installation Steps */}
                  <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-black/50 transition-all duration-500">
                    <h3 className="text-xl font-bold text-white mb-4 glow-text">Installation Steps</h3>

                    <ol className="space-y-6">
                      {[
                        {
                          title: "Download the Launcher",
                          description: "Download our secure launcher from your dashboard after purchasing the product.",
                          hasButton: true,
                        },
                        {
                          title: "Disable Anti-Virus",
                          description:
                            "Temporarily disable your anti-virus software to prevent false positives during installation.",
                          hasWarning: true,
                        },
                        {
                          title: "Run as Administrator",
                          description:
                            'Right-click the launcher and select "Run as Administrator" to ensure proper installation.',
                        },
                        {
                          title: "Login and Install",
                          description:
                            "Log in with your lvlup account credentials and follow the on-screen instructions to complete the installation.",
                        },
                        {
                          title: "Launch Fortnite",
                          description:
                            "Start Fortnite through our launcher. The cheat will automatically inject and you'll see the overlay in-game.",
                        },
                      ].map((step, index) => (
                        <li
                          key={index}
                          className="flex gap-4 group animate-slide-up"
                          style={{ animationDelay: `${0.1 * index}s` }}
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 glow">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                              {step.title}
                            </h4>
                            <p className="text-gray-300 mb-3 group-hover:text-white transition-colors duration-300">
                              {step.description}
                            </p>
                            {step.hasButton && (
                              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2 shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 glow">
                                <Download className="h-4 w-4" />
                                Download Launcher
                              </Button>
                            )}
                            {step.hasWarning && (
                              <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-lg p-3 flex items-start gap-2 hover:bg-amber-500/30 transition-all duration-300">
                                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                                <p className="text-amber-200 text-sm">
                                  This is a common step for any game enhancement software. Our products are safe, but
                                  anti-virus programs often flag game modification tools as suspicious.
                                </p>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Configuration Guide */}
                  <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-black/50 transition-all duration-500">
                    <h3 className="text-xl font-bold text-white mb-4 glow-text">Configuration Guide</h3>

                    <div className="space-y-4">
                      <div className="group">
                        <h4 className="font-bold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                          Accessing the Menu
                        </h4>
                        <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                          Press{" "}
                          <span className="bg-gradient-to-r from-purple-500 to-blue-500 px-2 py-0.5 rounded font-mono text-white shadow-lg glow">
                            INSERT
                          </span>{" "}
                          key to open the cheat menu in-game.
                        </p>
                      </div>

                      <div className="group">
                        <h4 className="font-bold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                          Recommended Settings
                        </h4>
                        <p className="text-gray-300 mb-3 group-hover:text-white transition-colors duration-300">
                          For optimal performance and to minimize detection risk, we recommend these settings:
                        </p>
                        <ul className="space-y-2">
                          {[
                            "Aimbot Smoothness: 5-7 (higher is less detectable)",
                            "ESP Distance: 150-200 meters",
                            "Disable ESP for spectators",
                            'Use "Smart Mode" during tournaments',
                          ].map((setting, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 group animate-slide-up"
                              style={{ animationDelay: `${0.1 * index}s` }}
                            >
                              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                              <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                                {setting}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Troubleshooting */}
                  <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-black/50 transition-all duration-500">
                    <h3 className="text-xl font-bold text-white mb-4 glow-text">Troubleshooting</h3>

                    <div className="space-y-4">
                      {[
                        {
                          title: "Cheat Not Injecting",
                          description:
                            "Make sure you're running both the launcher and Fortnite as administrator. If the issue persists, try restarting your PC and disabling any other overlays (Discord, GeForce Experience, etc.).",
                        },
                        {
                          title: "Game Crashes",
                          description:
                            "Verify your game files through Epic Games Launcher and ensure you're using the latest version of our cheat. If crashes continue, contact our support team with your system specifications.",
                        },
                        {
                          title: "HWID Spoofer Issues",
                          description:
                            'If you\'re having issues with the HWID spoofer, make sure all other anti-cheat services are closed before launching our software. For persistent issues, use our "Clean PC" tool from the launcher.',
                        },
                      ].map((issue, index) => (
                        <div
                          key={index}
                          className="group animate-slide-up"
                          style={{ animationDelay: `${0.1 * index}s` }}
                        >
                          <h4 className="font-bold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                            {issue.title}
                          </h4>
                          <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                            {issue.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="bg-gradient-to-r from-amber-600/80 to-orange-600/80 backdrop-blur-md rounded-xl p-6 text-white border border-amber-400/30 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2 glow-text">Need Help?</h3>
                      <p className="mb-4 text-amber-100">
                        Our support team is available 24/7 to assist you with any installation or configuration issues.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30 hover:scale-105 transition-all duration-300 glow">
                          Contact Support
                        </Button>
                        <Button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300">
                          Join Discord
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="valorant" className="space-y-6">
                  <div className="bg-gradient-to-r from-red-600/80 to-red-800/80 backdrop-blur-md rounded-xl p-6 text-white border border-red-400/30 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="w-16 h-16 relative flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Image src="/valorant.png" alt="Valorant" fill className="object-cover rounded-md" />
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-md blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold glow-text">Valorant Cheat Setup</h2>
                        <p className="text-red-100">Version 2.8.5 | Last Updated: May 10, 2025</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 relative z-10">
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-white/30 hover:bg-white/30 transition-all duration-300">
                        <AlertTriangle className="h-4 w-4 animate-pulse" />
                        <span>Updating</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-white/30 hover:bg-white/30 transition-all duration-300">
                        <Shield className="h-4 w-4" />
                        <span>Kernel-Level Protection</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-10 bg-black/40 backdrop-blur-xl rounded-xl border border-red-400/30 hover:bg-black/50 transition-all duration-500">
                    <div className="text-center">
                      <AlertTriangle className="h-16 w-16 text-amber-400 mx-auto mb-4 animate-pulse glow" />
                      <h3 className="text-xl font-bold text-white mb-2 glow-text">Product Currently Updating</h3>
                      <p className="text-gray-300 max-w-md mx-auto mb-4">
                        Our Valorant cheat is currently being updated to support the latest game patch. The setup guide
                        will be available once the update is complete.
                      </p>
                      <p className="text-sm text-gray-400">Expected completion: May 18, 2025</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Other tabs with similar styling */}
                {["cs2", "warzone", "pubg", "rust"].map((game) => (
                  <TabsContent key={game} value={game}>
                    <div className="p-10 text-center bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-black/50 transition-all duration-500">
                      <h3 className="text-xl font-bold text-white mb-2 glow-text">{game.toUpperCase()} Setup Guide</h3>
                      <p className="text-gray-300">
                        Please select the {game.toUpperCase()} cheat from your dashboard to access the setup
                        instructions.
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </AdaptiveAnimation>

        {/* Safety Guidelines */}
        <AdaptiveAnimation>
          <div
            className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden mb-10 animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
              <h2 className="text-xl font-bold text-white glow-text">General Safety Guidelines</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30 hover:bg-purple-500/30 hover:scale-105 transition-all duration-500 group">
                  <h3 className="font-bold text-white mb-2 flex items-center gap-2 glow-text">
                    <Shield className="h-5 w-5 group-hover:animate-pulse" />
                    Account Security
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Use our products on alternate accounts first",
                      "Enable 2FA on all gaming accounts",
                      "Use different passwords for each gaming platform",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 animate-slide-up"
                        style={{ animationDelay: `${0.1 * index}s` }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-purple-200 group-hover:text-white transition-colors duration-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30 hover:bg-blue-500/30 hover:scale-105 transition-all duration-500 group">
                  <h3 className="font-bold text-white mb-2 flex items-center gap-2 glow-text">
                    <Zap className="h-5 w-5 group-hover:animate-pulse" />
                    Usage Best Practices
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Start with subtle settings and gradually adjust",
                      "Avoid using cheats in tournaments or competitive modes",
                      "Check our Discord for real-time detection status updates",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 animate-slide-up"
                        style={{ animationDelay: `${0.1 * index}s` }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-blue-200 group-hover:text-white transition-colors duration-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 hover:bg-red-500/30 transition-all duration-500 group">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-1 group-hover:animate-pulse" />
                  <div>
                    <h3 className="font-medium text-red-300 glow-text">Important Warning</h3>
                    <p className="text-red-200 text-sm mt-1 group-hover:text-white transition-colors duration-300">
                      While we take extensive measures to ensure our products are undetected, there is always a risk
                      when using third-party software in games. We recommend using our products responsibly and at your
                      own discretion. lvlup is not responsible for any bans or penalties imposed by game developers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdaptiveAnimation>

        {/* Help Section */}
        <AdaptiveAnimation>
          <div
            className="bg-gradient-to-br from-purple-600/80 to-indigo-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-white border border-purple-400/30 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 animate-slide-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <h2 className="text-2xl font-bold mb-4 glow-text">Need Additional Help?</h2>
              <p className="text-purple-100 mb-6 group-hover:text-white transition-colors duration-300">
                Our support team is available 24/7 to assist you with any installation or configuration issues. Join our
                Discord for real-time assistance and updates.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30 hover:scale-105 transition-all duration-300 glow">
                  Contact Support
                </Button>
                <Button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300">
                  Join Discord
                </Button>
              </div>
            </div>
          </div>
        </AdaptiveAnimation>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .glow {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
        }
        
        .glow-text {
          text-shadow: 0 0 20px rgba(147, 51, 234, 0.8);
        }
        
        .hover\\:glow:hover {
          text-shadow: 0 0 20px rgba(147, 51, 234, 0.8);
        }
      `}</style>
    </div>
  )
}
