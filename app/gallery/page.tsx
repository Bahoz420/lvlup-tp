import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Play, Eye, Star, Sparkles } from "lucide-react"
import { AdaptiveAnimation } from "@/components/adaptive-animation"
import { PerformanceAwareBackground } from "@/components/performance-aware-background"

export const revalidate = 86400 // Revalidiere die Galerie-Seite einmal täglich

export default function GalleryPage() {
  return (
    <PerformanceAwareBackground className="min-h-screen">
      <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        {/* Enhanced Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Large Floating Orbs */}
          <AdaptiveAnimation highPerformance="animate-float" mediumPerformance="animate-pulse-slow" lowPerformance="">
            <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
          </AdaptiveAnimation>

          <AdaptiveAnimation
            highPerformance="animate-bounce-slow"
            mediumPerformance="animate-pulse-slow"
            lowPerformance=""
          >
            <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-amber-400/15 to-orange-400/15 rounded-full blur-xl"></div>
          </AdaptiveAnimation>

          <AdaptiveAnimation highPerformance="animate-float" mediumPerformance="" lowPerformance="">
            <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-gradient-to-r from-blue-400/8 to-cyan-400/8 rounded-full blur-3xl"></div>
          </AdaptiveAnimation>

          {/* Gaming-themed floating icons */}
          <div className="absolute top-1/3 right-1/3 animate-bounce-slow">
            <Sparkles className="w-8 h-8 text-purple-400/30" />
          </div>
          <div className="absolute bottom-1/3 left-1/4 animate-pulse-slow">
            <Star className="w-6 h-6 text-amber-400/30" />
          </div>
          <div className="absolute top-2/3 right-1/4 animate-float">
            <Play className="w-10 h-10 text-pink-400/25" />
          </div>

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 dot-pattern animate-pulse opacity-10"></div>

          {/* Dynamic Gradient Overlays */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/5 via-transparent to-amber-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
        </div>

        <div className="relative z-10 container py-8">
          {/* Breadcrumb with Animation */}
          <AdaptiveAnimation
            highPerformance="animate-fade-in-left"
            mediumPerformance="animate-fade-in"
            lowPerformance=""
          >
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors duration-200">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-white">Gallery</span>
            </div>
          </AdaptiveAnimation>

          {/* Hero Section with Enhanced Effects */}
          <AdaptiveAnimation highPerformance="animate-fade-in-up" mediumPerformance="animate-fade-in" lowPerformance="">
            <div className="mb-8 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 blur-3xl rounded-full"></div>
              <div className="relative">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-4">
                  lvlup Gallery
                </h1>
                <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                  Check out our collection of gameplay videos and screenshots.
                </p>
              </div>
            </div>
          </AdaptiveAnimation>

          {/* Enhanced Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Video 1 - Enhanced with Glass Effect */}
            <AdaptiveAnimation
              highPerformance="animate-fade-in-up"
              mediumPerformance="animate-fade-in"
              lowPerformance=""
              className="opacity-0"
            >
              <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="aspect-video w-full relative overflow-hidden">
                  <iframe
                    className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                    src="https://www.youtube.com/embed/wyh0B14k41g"
                    title="Trolling with HACKS in Creative"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="bg-red-500/80 backdrop-blur-sm rounded-full p-2">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-gray-400">1.2M views</span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                    Trolling with HACKS in Creative
                  </h2>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-amber-400 fill-current animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AdaptiveAnimation>

            {/* Video 2 */}
            <AdaptiveAnimation
              highPerformance="animate-fade-in-up"
              mediumPerformance="animate-fade-in"
              lowPerformance=""
              className="opacity-0"
            >
              <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="aspect-video w-full relative overflow-hidden">
                  <iframe
                    className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                    src="https://www.youtube.com/embed/3dO-CX69wNI"
                    title="BEST DUO CUP Cheat"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="bg-red-500/80 backdrop-blur-sm rounded-full p-2">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-gray-400">850K views</span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors duration-300">
                    BEST DUO CUP Cheat
                  </h2>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-amber-400 fill-current animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AdaptiveAnimation>

            {/* Image Gallery Items with Enhanced Effects */}
            {[
              {
                src: "https://img.youtube.com/vi/vcVWwDtCsQE/maxresdefault.jpg",
                title: "Solo Cheat Showcase",
                views: "2.1M",
              },
              {
                src: "https://img.youtube.com/vi/GvNv5bvaicA/maxresdefault.jpg",
                title: "Tilted Zone Wars Trolling",
                views: "1.8M",
              },
              {
                src: "https://img.youtube.com/vi/16FtgKggt2E/maxresdefault.jpg",
                title: "Speedrun Unranked to Unreal",
                views: "3.2M",
              },
              {
                src: "https://img.youtube.com/vi/K4ZT-IPaACY/maxresdefault.jpg",
                title: "Softaim und Undetected",
                views: "1.5M",
              },
            ].map((item, index) => (
              <AdaptiveAnimation
                key={index}
                highPerformance="animate-fade-in-up"
                mediumPerformance="animate-fade-in"
                lowPerformance=""
                className="opacity-0"
              >
                <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="aspect-video w-full relative overflow-hidden">
                    <Image
                      src={item.src || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                      <div className="bg-purple-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-xs text-white font-medium">HD</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-400">{item.views} views</span>
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                      {item.title}
                    </h2>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-amber-400 fill-current animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </AdaptiveAnimation>
            ))}
          </div>
        </div>
      </div>
    </PerformanceAwareBackground>
  )
}
