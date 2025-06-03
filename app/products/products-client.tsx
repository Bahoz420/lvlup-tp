"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Star,
  Search,
  X,
  Grid,
  List,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Filter,
  Shield,
  Users,
  Gamepad2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductStatusIndicator } from "@/components/product-status-indicator"
import { OptimizedImage } from "@/components/optimized-image"
import type { Product } from "@/types/product"
import { AdaptiveAnimation } from "@/components/adaptive-animation"
import { PerformanceAwareBackground } from "@/components/performance-aware-background"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"
import { ProductsStructuredData } from "./products-structured-data"

interface ProductWithStatus extends Product {
  product_status?: Array<{
    status: string
    active_users: number
    last_updated: string
  }>
  product_features?: Array<{
    feature: string
  }>
}

interface ProductsClientProps {
  initialProducts: ProductWithStatus[]
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<ProductWithStatus[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchInput, setSearchInput] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const [filters, setFilters] = useState({
    search: "",
    game: "all",
    minPrice: 0,
    maxPrice: 100,
    minRating: 0,
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
    detectionStatus: "all", // undetected, detected, unknown
    minActiveUsers: 0,
    subscriptionType: "all", // day, week, month, lifetime
    hasFeature: "all", // aimbot, esp, wallhack, etc.
  })

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  // Get unique games from products
  const availableGames = useMemo(() => {
    const games = new Set(products.map((p) => p.game || p.category).filter(Boolean))
    return Array.from(games)
  }, [products])

  // Get unique features from products
  const availableFeatures = useMemo(() => {
    const features = new Set<string>()
    products.forEach((product) => {
      product.product_features?.forEach((f) => {
        const feature = f.feature.toLowerCase()
        if (feature.includes("aimbot")) features.add("aimbot")
        if (feature.includes("esp") || feature.includes("wallhack")) features.add("esp")
        if (feature.includes("radar")) features.add("radar")
        if (feature.includes("recoil")) features.add("no-recoil")
        if (feature.includes("hwid") || feature.includes("spoofer")) features.add("hwid-spoofer")
        if (feature.includes("triggerbot")) features.add("triggerbot")
      })
    })
    return Array.from(features)
  }, [products])

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          (product.game && product.game.toLowerCase().includes(filters.search.toLowerCase())),
      )
    }

    // Game filter
    if (filters.game !== "all") {
      filtered = filtered.filter((product) => {
        const game = product.game || product.category
        return game === filters.game
      })
    }

    // Price filter
    filtered = filtered.filter((product) => {
      const price = typeof product.price === "string" ? Number.parseFloat(product.price) : product.price
      return price >= filters.minPrice && price <= filters.maxPrice
    })

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter((product) => {
        const rating = typeof product.rating === "string" ? Number.parseFloat(product.rating) : product.rating || 0
        return rating >= filters.minRating
      })
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((product) => {
        const status = product.product_status?.[0]?.status || product.status
        return status === filters.status
      })
    }

    // Active users filter
    if (filters.minActiveUsers > 0) {
      filtered = filtered.filter((product) => {
        const activeUsers = product.product_status?.[0]?.active_users || 0
        return activeUsers >= filters.minActiveUsers
      })
    }

    // Feature filter
    if (filters.hasFeature !== "all") {
      filtered = filtered.filter((product) => {
        const features = product.product_features?.map((f) => f.feature.toLowerCase()).join(" ") || ""
        switch (filters.hasFeature) {
          case "aimbot":
            return features.includes("aimbot")
          case "esp":
            return features.includes("esp") || features.includes("wallhack")
          case "radar":
            return features.includes("radar")
          case "no-recoil":
            return features.includes("recoil")
          case "hwid-spoofer":
            return features.includes("hwid") || features.includes("spoofer")
          case "triggerbot":
            return features.includes("triggerbot")
          default:
            return true
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (filters.sortBy) {
        case "price":
          aValue = typeof a.price === "string" ? Number.parseFloat(a.price) : a.price
          bValue = typeof b.price === "string" ? Number.parseFloat(b.price) : b.price
          break
        case "rating":
          aValue = typeof a.rating === "string" ? Number.parseFloat(a.rating) : a.rating || 0
          bValue = typeof b.rating === "string" ? Number.parseFloat(b.rating) : b.rating || 0
          break
        case "users":
          aValue = a.product_status?.[0]?.active_users || 0
          bValue = b.product_status?.[0]?.active_users || 0
          break
        case "updated":
          aValue = new Date(a.product_status?.[0]?.last_updated || a.updated_at || 0).getTime()
          bValue = new Date(b.product_status?.[0]?.last_updated || b.updated_at || 0).getTime()
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (filters.sortOrder === "desc") {
        return aValue < bValue ? 1 : -1
      }
      return aValue > bValue ? 1 : -1
    })

    return filtered
  }, [products, filters])

  const renderProductCard = (product: ProductWithStatus, index: number) => {
    const status = product.product_status?.[0] || {
      status: product.status || "online",
      active_users: 1000,
      last_updated: new Date().toISOString(),
    }

    const features = product.product_features?.map((f) => f.feature) || []
    const price = typeof product.price === "string" ? Number.parseFloat(product.price) : product.price
    const rating = typeof product.rating === "string" ? Number.parseFloat(product.rating) : product.rating || 0

    if (viewMode === "list") {
      return (
        <AdaptiveAnimation
          key={product.id}
          highPerformance="animate-fade-in-up hover:scale-[1.02] transition-all duration-500"
          mediumPerformance="animate-fade-in transition-all duration-300"
          lowPerformance="opacity-100"
          className={`opacity-0 animate-fade-in-up`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <MobileOptimizedCard className="group relative overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:border-white/20">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Floating sparkles */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            </div>

            <div className="flex gap-6 relative z-10 p-6">
              <div className="w-32 h-24 flex-shrink-0 relative overflow-hidden rounded-xl">
                <OptimizedImage
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  width={128}
                  height={96}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  priority="medium"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <ProductStatusIndicator
                    initialStatus={status.status}
                    productId={product.id}
                    initialUsers={status.active_users}
                    initialLastUpdated={status.last_updated}
                  />
                </div>
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 transition-all duration-300 ${
                        i < Math.floor(rating)
                          ? "fill-amber-400 text-amber-400 group-hover:scale-110"
                          : "fill-muted stroke-muted-foreground"
                      }`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                  <span className="ml-2 text-sm text-purple-200 group-hover:text-white transition-colors duration-300">
                    {rating} ({product.review_count || 0})
                  </span>
                  <div className="ml-4 flex items-center gap-1 text-xs text-purple-300">
                    <Users className="h-3 w-3" />
                    {status.active_users.toLocaleString()} users
                  </div>
                </div>
                <p className="text-purple-200 mb-3 line-clamp-2 group-hover:text-purple-100 transition-colors duration-300">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {features.slice(0, 3).map((feature, featureIndex) => (
                    <Badge
                      key={featureIndex}
                      variant="secondary"
                      className="text-xs bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                      style={{ transitionDelay: `${featureIndex * 100}ms` }}
                    >
                      {feature}
                    </Badge>
                  ))}
                  {features.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                      +{features.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors duration-300 group-hover:scale-105 transform">
                    ${price.toFixed(2)}
                  </span>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <Zap className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </MobileOptimizedCard>
        </AdaptiveAnimation>
      )
    }

    return (
      <AdaptiveAnimation
        key={product.id}
        highPerformance="animate-fade-in-up hover:scale-105 transition-all duration-500"
        mediumPerformance="animate-fade-in transition-all duration-300"
        lowPerformance="opacity-100"
        className={`opacity-0 animate-fade-in-up`}
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <MobileOptimizedCard className="group relative overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-purple-500/25 hover:border-white/20 hover:-translate-y-2">
          {/* Animated background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Floating elements */}
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-125"></div>

          {rating >= 4.8 && (
            <div className="absolute right-3 top-3 z-20 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg animate-pulse">
              <Sparkles className="inline h-3 w-3 mr-1" />
              Popular
            </div>
          )}

          <div className="aspect-video overflow-hidden relative">
            <OptimizedImage
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={400}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              priority="medium"
            />
            {/* Image overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Floating action indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30">
                <Target className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>
          </div>

          <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors duration-300">
                {product.name}
              </h3>
              <ProductStatusIndicator
                initialStatus={status.status}
                productId={product.id}
                initialUsers={status.active_users}
                initialLastUpdated={status.last_updated}
                className="ml-2"
              />
            </div>

            <div className="flex items-center mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 transition-all duration-300 ${
                    i < Math.floor(rating)
                      ? "fill-amber-400 text-amber-400 group-hover:scale-125 group-hover:rotate-12"
                      : "fill-muted stroke-muted-foreground"
                  }`}
                  style={{ transitionDelay: `${i * 75}ms` }}
                />
              ))}
              <span className="ml-2 text-sm text-purple-200 group-hover:text-white transition-colors duration-300">
                {rating} ({product.review_count || 0})
              </span>
            </div>

            <div className="flex items-center gap-4 mb-3 text-xs text-purple-300">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {status.active_users.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Gamepad2 className="h-3 w-3" />
                {product.game || product.category}
              </div>
            </div>

            <p className="text-sm text-purple-200 line-clamp-2 mb-4 group-hover:text-purple-100 transition-colors duration-300">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {features.slice(0, 2).map((feature, featureIndex) => (
                <Badge
                  key={featureIndex}
                  variant="secondary"
                  className="text-xs bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/10"
                  style={{ transitionDelay: `${featureIndex * 100}ms` }}
                >
                  {feature}
                </Badge>
              ))}
              {features.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  +{features.length - 2}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-amber-400 group-hover:text-amber-300 transition-all duration-300 group-hover:scale-110 transform">
                ${price.toFixed(2)}
              </span>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 group-hover:animate-pulse"
              >
                <Link href={`/products/${product.slug}`}>
                  <Zap className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            </div>
          </div>
        </MobileOptimizedCard>
      </AdaptiveAnimation>
    )
  }

  return (
    <PerformanceAwareBackground className="min-h-screen">
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <ProductsStructuredData products={filteredProducts} />
        {/* Enhanced animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-purple-800/50 to-indigo-900/50"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>

        {/* Dynamic floating orbs with mouse parallax */}
        <div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        ></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-xl animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * 0.01}px)`,
          }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.02}px)`,
          }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-r from-amber-500/25 to-orange-500/25 rounded-full blur-lg animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.025}px)`,
          }}
        ></div>

        {/* Animated geometric shapes */}
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-amber-400/60 rounded-full animate-ping"></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/60 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* REMOVED NAVIGATION COMPONENT FROM HERE */}

        <div className="container py-8 relative z-10">
          {/* Enhanced Breadcrumb */}
          <AdaptiveAnimation
            highPerformance="animate-fade-in-up"
            mediumPerformance="animate-fade-in"
            lowPerformance="opacity-100"
            className="opacity-0"
          >
            <div className="flex items-center gap-2 mb-6 text-sm text-purple-200 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 w-fit">
              <Link href="/" className="hover:text-amber-300 transition-colors duration-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Home
              </Link>
              <ChevronRight className="h-4 w-4 animate-pulse" />
              <span className="font-medium text-white">Products</span>
            </div>
          </AdaptiveAnimation>

          {/* Enhanced Header */}
          <AdaptiveAnimation
            highPerformance="animate-fade-in-up"
            mediumPerformance="animate-fade-in"
            lowPerformance="opacity-100"
            className="opacity-0 mb-8"
            style={{ animationDelay: "200ms" }}
          >
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-pink-400 mb-4 animate-pulse-slow">
                Our Products
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-purple-400 mx-auto mb-6 rounded-full"></div>
              <p className="text-purple-200 max-w-3xl mx-auto text-lg leading-relaxed">
                Browse our selection of premium gaming enhancements designed to give you the competitive edge. All our
                products come with 24/7 support and regular updates.
              </p>
            </div>
          </AdaptiveAnimation>

          {/* Enhanced Search and Controls */}
          <AdaptiveAnimation
            highPerformance="animate-fade-in-up"
            mediumPerformance="animate-fade-in"
            lowPerformance="opacity-100"
            className="opacity-0 mb-8"
            style={{ animationDelay: "400ms" }}
          >
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400 animate-pulse" />
                  <Input
                    type="search"
                    placeholder="Search for gaming enhancements..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-12 pr-4 py-3 border-purple-200/30 focus-visible:ring-purple-500 bg-white/10 backdrop-blur-md text-white placeholder-purple-300 rounded-xl border-2 hover:border-purple-300/50 transition-all duration-300 focus:scale-[1.02]"
                  />
                  {searchInput && (
                    <button
                      onClick={() => setSearchInput("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-white transition-colors duration-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="flex border border-purple-200/30 rounded-xl overflow-hidden backdrop-blur-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none px-4 py-3 transition-all duration-300 hover:scale-105"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-none px-4 py-3 transition-all duration-300 hover:scale-105"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AdaptiveAnimation>

          {/* BEAUTIFUL LAYOUT WITH FILTERS */}
          <div className="grid gap-8 lg:grid-cols-4">
            {/* ENHANCED FILTERS SIDEBAR */}
            <div className="lg:col-span-1 space-y-6">
              <MobileOptimizedCard className="shadow-2xl shadow-purple-500/20 transition-all duration-500 sticky top-8 group">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                {/* Floating sparkles */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Filter className="h-5 w-5 text-amber-400 animate-pulse" />
                </div>

                <div className="relative z-10 p-6 max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-amber-400 animate-pulse" />
                      Filters
                    </h3>
                  </div>

                  {/* Game Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4 text-amber-400 animate-pulse" />
                      Game
                    </label>
                    <select
                      value={filters.game}
                      onChange={(e) => setFilters((prev) => ({ ...prev, game: e.target.value }))}
                      className="w-full p-3 border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-md text-white hover:border-white/50 transition-all duration-300 focus:scale-[1.02] focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="all" className="bg-purple-900 text-white">
                        All Games
                      </option>
                      {availableGames.map((game) => (
                        <option key={game} value={game} className="bg-purple-900 text-white">
                          {game}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Enhanced Price Range with Input Fields */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                      Price Range: ${filters.minPrice} - ${filters.maxPrice}
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              minPrice: Math.max(0, Number.parseInt(e.target.value) || 0),
                            }))
                          }
                          className="w-full p-2 border border-white/30 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-purple-300 text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              maxPrice: Math.max(filters.minPrice, Number.parseInt(e.target.value) || 100),
                            }))
                          }
                          className="w-full p-2 border border-white/30 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-purple-300 text-sm"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number.parseInt(e.target.value) }))}
                        className="w-full h-3 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  {/* Enhanced Rating Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
                      Minimum Rating: {filters.minRating}★
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filters.minRating}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, minRating: Number.parseFloat(e.target.value) }))
                      }
                      className="w-full h-3 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-colors duration-300"
                    />
                  </div>

                  {/* Active Users Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-400 animate-pulse" />
                      Min Active Users: {filters.minActiveUsers}
                    </label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Min users"
                        value={filters.minActiveUsers}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            minActiveUsers: Math.max(0, Number.parseInt(e.target.value) || 0),
                          }))
                        }
                        className="w-full p-2 border border-white/30 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-purple-300 text-sm"
                      />
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={filters.minActiveUsers}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, minActiveUsers: Number.parseInt(e.target.value) }))
                        }
                        className="w-full h-3 bg-white/30 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  {/* Feature Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-400 animate-pulse" />
                      Required Feature
                    </label>
                    <select
                      value={filters.hasFeature}
                      onChange={(e) => setFilters((prev) => ({ ...prev, hasFeature: e.target.value }))}
                      className="w-full p-3 border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-md text-white hover:border-white/50 transition-all duration-300 focus:scale-[1.02] focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="all" className="bg-purple-900 text-white">
                        All Features
                      </option>
                      <option value="aimbot" className="bg-purple-900 text-white">
                        Aimbot
                      </option>
                      <option value="esp" className="bg-purple-900 text-white">
                        ESP/Wallhack
                      </option>
                      <option value="radar" className="bg-purple-900 text-white">
                        Radar Hack
                      </option>
                      <option value="no-recoil" className="bg-purple-900 text-white">
                        No Recoil
                      </option>
                      <option value="hwid-spoofer" className="bg-purple-900 text-white">
                        HWID Spoofer
                      </option>
                      <option value="triggerbot" className="bg-purple-900 text-white">
                        Triggerbot
                      </option>
                    </select>
                  </div>

                  {/* Enhanced Status Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                      className="w-full p-3 border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-md text-white hover:border-white/50 transition-all duration-300 focus:scale-[1.02] focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="all" className="bg-purple-900 text-white">
                        All statuses
                      </option>
                      <option value="online" className="bg-purple-900 text-white">
                        Online
                      </option>
                      <option value="offline" className="bg-purple-900 text-white">
                        Offline
                      </option>
                      <option value="updating" className="bg-purple-900 text-white">
                        Updating
                      </option>
                    </select>
                  </div>

                  {/* Enhanced Sort */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      Sort by
                    </label>
                    <div className="space-y-3">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                        className="w-full p-3 border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-md text-white hover:border-white/50 transition-all duration-300 focus:scale-[1.02] focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="name" className="bg-purple-900 text-white">
                          Name
                        </option>
                        <option value="price" className="bg-purple-900 text-white">
                          Price
                        </option>
                        <option value="rating" className="bg-purple-900 text-white">
                          Rating
                        </option>
                        <option value="users" className="bg-purple-900 text-white">
                          Active Users
                        </option>
                        <option value="updated" className="bg-purple-900 text-white">
                          Last Updated
                        </option>
                      </select>
                      <select
                        value={filters.sortOrder}
                        onChange={(e) => setFilters((prev) => ({ ...prev, sortOrder: e.target.value }))}
                        className="w-full p-3 border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-md text-white hover:border-white/50 transition-all duration-300 focus:scale-[1.02] focus:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="asc" className="bg-purple-900 text-white">
                          Ascending
                        </option>
                        <option value="desc" className="bg-purple-900 text-white">
                          Descending
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <Button
                    onClick={() => {
                      setFilters({
                        search: "",
                        game: "all",
                        minPrice: 0,
                        maxPrice: 100,
                        minRating: 0,
                        status: "all",
                        sortBy: "name",
                        sortOrder: "asc",
                        detectionStatus: "all",
                        minActiveUsers: 0,
                        subscriptionType: "all",
                        hasFeature: "all",
                      })
                      setSearchInput("")
                    }}
                    variant="outline"
                    className="w-full border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              </MobileOptimizedCard>
            </div>

            {/* Enhanced Products Grid */}
            <div className="lg:col-span-3">
              {/* Enhanced Results Info */}
              <div className="flex justify-between items-center mb-8">
                <div className="text-sm text-purple-200 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 flex items-center gap-2">
                  <Target className="h-4 w-4 text-amber-400 animate-pulse" />
                  {loading
                    ? "Loading..."
                    : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
                </div>
              </div>

              {/* Enhanced Loading State */}
              {loading && (
                <div className="text-center py-20">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400/30 border-t-purple-400 mx-auto mb-6"></div>
                    <div
                      className="absolute inset-0 rounded-full h-16 w-16 border-4 border-amber-400/20 border-t-amber-400 mx-auto animate-spin"
                      style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                    ></div>
                  </div>
                  <p className="text-purple-200 text-lg animate-pulse">Loading amazing products...</p>
                </div>
              )}

              {/* Enhanced Error State */}
              {error && (
                <div className="text-center py-20">
                  <MobileOptimizedCard className="bg-red-500/10 border-red-500/20 p-8 max-w-md mx-auto">
                    <p className="text-red-400 mb-6 text-lg">{error}</p>
                    <Button
                      onClick={() => {}}
                      variant="outline"
                      className="border-red-400/50 text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:scale-105"
                    >
                      Try Again
                    </Button>
                  </MobileOptimizedCard>
                </div>
              )}

              {/* Enhanced Products */}
              {!loading && !error && (
                <>
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                      <MobileOptimizedCard className="p-8 max-w-md mx-auto">
                        <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                        <p className="text-purple-200 mb-6 text-lg">No products found matching your criteria.</p>
                        <Button
                          onClick={() =>
                            setFilters({
                              search: "",
                              game: "all",
                              minPrice: 0,
                              maxPrice: 100,
                              minRating: 0,
                              status: "all",
                              sortBy: "name",
                              sortOrder: "asc",
                              detectionStatus: "all",
                              minActiveUsers: 0,
                              subscriptionType: "all",
                              hasFeature: "all",
                            })
                          }
                          variant="outline"
                          className="border-purple-400/50 text-purple-400 hover:bg-purple-500/10 transition-all duration-300 hover:scale-105"
                        >
                          Clear Filters
                        </Button>
                      </MobileOptimizedCard>
                    </div>
                  ) : (
                    <div
                      className={
                        viewMode === "grid" ? "grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "space-y-6"
                      }
                    >
                      {filteredProducts.map((product, index) => renderProductCard(product, index))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PerformanceAwareBackground>
  )
}
