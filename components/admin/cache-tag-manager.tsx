"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Tag,
  Globe,
  ShoppingBag,
  Star,
  MessageSquare,
  User,
  Home,
  CreditCard,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Crosshair,
  Eye,
  Radio,
  Shield,
  Clock,
  Percent,
  Package,
  Calendar,
  CheckSquare,
  ThumbsUp,
  Bell,
  PinIcon,
  HelpCircle,
  Crown,
  UserPlus,
  UserCheck,
  Languages,
  ShoppingCart,
  Info,
  Bitcoin,
  DollarSign,
} from "lucide-react"

export function CacheTagManager() {
  const [selectedTab, setSelectedTab] = useState("tags")
  const [selectedTagGroup, setSelectedTagGroup] = useState("")
  const [customTag, setCustomTag] = useState("")
  const [customPath, setCustomPath] = useState("")
  const [tagGroups, setTagGroups] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedPaths, setSelectedPaths] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Vordefinierte Pfade
  const predefinedPaths = [
    { label: "Home", value: "/", category: "main" },
    { label: "Products", value: "/products", category: "shop" },
    { label: "Product Detail", value: "/products/valorant", category: "shop" },
    { label: "Forum", value: "/forum", category: "community" },
    { label: "Gallery", value: "/gallery", category: "community" },
    { label: "Support", value: "/support", category: "info" },
    { label: "FAQ", value: "/faq", category: "info" },
    { label: "Contact", value: "/contact", category: "info" },
    { label: "About", value: "/about", category: "info" },
    { label: "Terms", value: "/terms", category: "info" },
    { label: "Privacy", value: "/privacy", category: "info" },
    { label: "Blog", value: "/blog", category: "community" },
    { label: "Checkout", value: "/checkout", category: "shop" },
    { label: "Cart", value: "/cart", category: "shop" },
    { label: "Login", value: "/login", category: "account" },
    { label: "Register", value: "/register", category: "account" },
    { label: "Profile", value: "/profile", category: "account" },
    { label: "Dashboard", value: "/dashboard", category: "account" },
  ]

  // Kategorien für Tags
  const tagCategories = [
    { label: "Global", value: "global" },
    { label: "Products", value: "products" },
    { label: "Status", value: "status" },
    { label: "Offers", value: "offers" },
    { label: "Reviews", value: "reviews" },
    { label: "Forum", value: "forum" },
    { label: "Users", value: "users" },
    { label: "Pages", value: "pages" },
    { label: "Languages", value: "languages" },
    { label: "Payments", value: "payments" },
    { label: "Devices", value: "devices" },
    { label: "Regions", value: "regions" },
    { label: "Features", value: "features" },
  ]

  // Vordefinierte Tags
  const predefinedTags = [
    // Globale Tags
    { label: "All", value: "all", icon: <Globe className="h-4 w-4" />, category: "global" },
    { label: "Global", value: "global", icon: <Globe className="h-4 w-4" />, category: "global" },

    // Produkt-bezogene Tags
    { label: "All Products", value: "all-products", icon: <ShoppingBag className="h-4 w-4" />, category: "products" },
    {
      label: "Featured Products",
      value: "featured-products",
      icon: <ShoppingBag className="h-4 w-4" />,
      category: "products",
    },
    { label: "New Products", value: "new-products", icon: <ShoppingBag className="h-4 w-4" />, category: "products" },
    { label: "Sale Products", value: "sale-products", icon: <ShoppingBag className="h-4 w-4" />, category: "products" },
    {
      label: "Trending Products",
      value: "trending-products",
      icon: <ShoppingBag className="h-4 w-4" />,
      category: "products",
    },
    {
      label: "Popular Products",
      value: "popular-products",
      icon: <ShoppingBag className="h-4 w-4" />,
      category: "products",
    },
    {
      label: "Recommended Products",
      value: "recommended-products",
      icon: <ShoppingBag className="h-4 w-4" />,
      category: "products",
    },

    // Status-bezogene Tags
    { label: "All Status", value: "all-status", icon: <Tag className="h-4 w-4" />, category: "status" },
    { label: "Online Status", value: "online-status", icon: <Tag className="h-4 w-4" />, category: "status" },
    { label: "Offline Status", value: "offline-status", icon: <Tag className="h-4 w-4" />, category: "status" },
    { label: "Updating Status", value: "updating-status", icon: <Tag className="h-4 w-4" />, category: "status" },
    { label: "Maintenance Status", value: "maintenance-status", icon: <Tag className="h-4 w-4" />, category: "status" },
    { label: "Detection Risk", value: "detection-risk", icon: <Shield className="h-4 w-4" />, category: "status" },
    { label: "Uptime Status", value: "uptime-status", icon: <Clock className="h-4 w-4" />, category: "status" },

    // Angebots-bezogene Tags
    { label: "All Offers", value: "all-offers", icon: <Percent className="h-4 w-4" />, category: "offers" },
    { label: "Featured Offers", value: "featured-offers", icon: <Percent className="h-4 w-4" />, category: "offers" },
    { label: "Limited Offers", value: "limited-offers", icon: <Percent className="h-4 w-4" />, category: "offers" },
    { label: "Expiring Offers", value: "expiring-offers", icon: <Percent className="h-4 w-4" />, category: "offers" },
    {
      label: "Flash Sale Offers",
      value: "flash-sale-offers",
      icon: <Percent className="h-4 w-4" />,
      category: "offers",
    },
    { label: "Bundle Offers", value: "bundle-offers", icon: <Package className="h-4 w-4" />, category: "offers" },
    { label: "Seasonal Offers", value: "seasonal-offers", icon: <Calendar className="h-4 w-4" />, category: "offers" },

    // Bewertungs-bezogene Tags
    { label: "All Reviews", value: "all-reviews", icon: <Star className="h-4 w-4" />, category: "reviews" },
    { label: "Featured Reviews", value: "featured-reviews", icon: <Star className="h-4 w-4" />, category: "reviews" },
    { label: "Recent Reviews", value: "recent-reviews", icon: <Star className="h-4 w-4" />, category: "reviews" },
    {
      label: "Verified Reviews",
      value: "verified-reviews",
      icon: <CheckSquare className="h-4 w-4" />,
      category: "reviews",
    },
    { label: "Helpful Reviews", value: "helpful-reviews", icon: <ThumbsUp className="h-4 w-4" />, category: "reviews" },

    // Forum-bezogene Tags
    { label: "All Forum", value: "all-forum", icon: <MessageSquare className="h-4 w-4" />, category: "forum" },
    { label: "Recent Forum", value: "recent-forum", icon: <MessageSquare className="h-4 w-4" />, category: "forum" },
    { label: "Popular Forum", value: "popular-forum", icon: <MessageSquare className="h-4 w-4" />, category: "forum" },
    {
      label: "Featured Forum",
      value: "featured-forum",
      icon: <MessageSquare className="h-4 w-4" />,
      category: "forum",
    },
    { label: "Announcements", value: "announcements", icon: <Bell className="h-4 w-4" />, category: "forum" },
    { label: "Sticky Topics", value: "sticky-topics", icon: <PinIcon className="h-4 w-4" />, category: "forum" },
    {
      label: "Unanswered Topics",
      value: "unanswered-topics",
      icon: <HelpCircle className="h-4 w-4" />,
      category: "forum",
    },

    // Benutzer-bezogene Tags
    { label: "All Users", value: "all-users", icon: <User className="h-4 w-4" />, category: "users" },
    { label: "Premium Users", value: "premium-users", icon: <Crown className="h-4 w-4" />, category: "users" },
    { label: "New Users", value: "new-users", icon: <UserPlus className="h-4 w-4" />, category: "users" },
    { label: "Active Users", value: "active-users", icon: <UserCheck className="h-4 w-4" />, category: "users" },

    // Sprach-bezogene Tags
    { label: "All Languages", value: "all-languages", icon: <Languages className="h-4 w-4" />, category: "languages" },
    {
      label: "German Content",
      value: "german-content",
      icon: <Languages className="h-4 w-4" />,
      category: "languages",
    },
    {
      label: "English Content",
      value: "english-content",
      icon: <Languages className="h-4 w-4" />,
      category: "languages",
    },
    {
      label: "French Content",
      value: "french-content",
      icon: <Languages className="h-4 w-4" />,
      category: "languages",
    },
    {
      label: "Spanish Content",
      value: "spanish-content",
      icon: <Languages className="h-4 w-4" />,
      category: "languages",
    },
    {
      label: "Russian Content",
      value: "russian-content",
      icon: <Languages className="h-4 w-4" />,
      category: "languages",
    },

    // Seiten-bezogene Tags
    { label: "All Pages", value: "all-pages", icon: <Home className="h-4 w-4" />, category: "pages" },
    { label: "Main Pages", value: "main-pages", icon: <Home className="h-4 w-4" />, category: "pages" },
    { label: "Info Pages", value: "info-pages", icon: <Info className="h-4 w-4" />, category: "pages" },
    { label: "Shop Pages", value: "shop-pages", icon: <ShoppingCart className="h-4 w-4" />, category: "pages" },
    {
      label: "Community Pages",
      value: "community-pages",
      icon: <MessageSquare className="h-4 w-4" />,
      category: "pages",
    },

    // Zahlungs-bezogene Tags
    {
      label: "All Payment Methods",
      value: "all-payment-methods",
      icon: <CreditCard className="h-4 w-4" />,
      category: "payments",
    },
    { label: "Crypto Payments", value: "crypto-payments", icon: <Bitcoin className="h-4 w-4" />, category: "payments" },
    { label: "Card Payments", value: "card-payments", icon: <CreditCard className="h-4 w-4" />, category: "payments" },
    {
      label: "PayPal Payments",
      value: "paypal-payments",
      icon: <DollarSign className="h-4 w-4" />,
      category: "payments",
    },

    // Geräte-bezogene Tags
    { label: "All Devices", value: "all-devices", icon: <Monitor className="h-4 w-4" />, category: "devices" },
    { label: "Mobile Devices", value: "mobile-devices", icon: <Smartphone className="h-4 w-4" />, category: "devices" },
    { label: "Desktop Devices", value: "desktop-devices", icon: <Monitor className="h-4 w-4" />, category: "devices" },
    { label: "Tablet Devices", value: "tablet-devices", icon: <Tablet className="h-4 w-4" />, category: "devices" },

    // Region-bezogene Tags
    { label: "All Regions", value: "all-regions", icon: <MapPin className="h-4 w-4" />, category: "regions" },
    { label: "EU Region", value: "eu-region", icon: <MapPin className="h-4 w-4" />, category: "regions" },
    { label: "NA Region", value: "na-region", icon: <MapPin className="h-4 w-4" />, category: "regions" },
    { label: "Asia Region", value: "asia-region", icon: <MapPin className="h-4 w-4" />, category: "regions" },

    // Feature-bezogene Tags
    { label: "All Features", value: "all-features", icon: <Crosshair className="h-4 w-4" />, category: "features" },
    {
      label: "Aimbot Features",
      value: "aimbot-features",
      icon: <Crosshair className="h-4 w-4" />,
      category: "features",
    },
    { label: "ESP Features", value: "esp-features", icon: <Eye className="h-4 w-4" />, category: "features" },
    { label: "Radar Features", value: "radar-features", icon: <Radio className="h-4 w-4" />, category: "features" },
    {
      label: "Spoofer Features",
      value: "spoofer-features",
      icon: <Shield className="h-4 w-4" />,
      category: "features",
    },
  ]

  // Lade verfügbare Tag-Gruppen beim Laden der Komponente
  useEffect(() => {
    async function fetchTagGroups() {
      try {
        const response = await fetch("/api/revalidate")
        if (response.ok) {
          const data = await response.json()
          if (data.tagGroups) {
            setTagGroups(data.tagGroups)
          }
        }
      } catch (error) {
        console.error("Error fetching tag groups:", error)
      }
    }

    fetchTagGroups()
  }, [])

  // Revalidiere einen Tag
  const revalidateTag = async (tag: string) => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "",
        },
        body: JSON.stringify({
          type: "tag",
          tag,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: `Successfully revalidated tag: ${tag}` })
      } else {
        setResult({ success: false, message: data.error || "Failed to revalidate tag" })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred during revalidation" })
    } finally {
      setIsLoading(false)
    }
  }

  // Revalidiere einen Pfad
  const revalidatePath = async (path: string) => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "",
        },
        body: JSON.stringify({
          type: "path",
          path,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: `Successfully revalidated path: ${path}` })
      } else {
        setResult({ success: false, message: data.error || "Failed to revalidate path" })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred during revalidation" })
    } finally {
      setIsLoading(false)
    }
  }

  // Revalidiere eine Gruppe
  const revalidateGroup = async (group: string) => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "",
        },
        body: JSON.stringify({
          type: "group",
          group,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: `Successfully revalidated group: ${group}` })
      } else {
        setResult({ success: false, message: data.error || "Failed to revalidate group" })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred during revalidation" })
    } finally {
      setIsLoading(false)
    }
  }

  // Revalidiere mehrere Tags
  const revalidateMultipleTags = async () => {
    if (selectedTags.length === 0) {
      setResult({ success: false, message: "Please select at least one tag" })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const promises = selectedTags.map((tag) =>
        fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "",
          },
          body: JSON.stringify({
            type: "tag",
            tag,
          }),
        }),
      )

      const results = await Promise.all(promises)
      const allSuccessful = results.every((res) => res.ok)

      if (allSuccessful) {
        setResult({ success: true, message: `Successfully revalidated ${selectedTags.length} tags` })
      } else {
        setResult({ success: false, message: "Failed to revalidate some tags" })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred during revalidation" })
    } finally {
      setIsLoading(false)
    }
  }

  // Revalidiere mehrere Pfade
  const revalidateMultiplePaths = async () => {
    if (selectedPaths.length === 0) {
      setResult({ success: false, message: "Please select at least one path" })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const promises = selectedPaths.map((path) =>
        fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "",
          },
          body: JSON.stringify({
            type: "path",
            path,
          }),
        }),
      )

      const results = await Promise.all(promises)
      const allSuccessful = results.every((res) => res.ok)

      if (allSuccessful) {
        setResult({ success: true, message: `Successfully revalidated ${selectedPaths.length} paths` })
      } else {
        setResult({ success: false, message: "Failed to revalidate some paths" })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred during revalidation" })
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle Tag-Auswahl
  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Toggle Pfad-Auswahl
  const togglePathSelection = (path: string) => {
    setSelectedPaths((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]))
  }

  // Filtere Tags basierend auf Suchbegriff und Kategorie
  const filteredTags = predefinedTags.filter((tag) => {
    const matchesSearch =
      searchQuery === "" ||
      tag.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.value.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === null || tag.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Filtere Pfade basierend auf Suchbegriff und Kategorie
  const filteredPaths = predefinedPaths.filter((path) => {
    const matchesSearch =
      searchQuery === "" ||
      path.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.value.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === null || path.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cache Tag Manager</CardTitle>
        <CardDescription>Manage and revalidate cache tags and paths for precise cache control</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="tags">Cache Tags</TabsTrigger>
            <TabsTrigger value="paths">Cache Paths</TabsTrigger>
            <TabsTrigger value="groups">Tag Groups</TabsTrigger>
            <TabsTrigger value="batch">Batch Operations</TabsTrigger>
          </TabsList>

          {/* Gemeinsame Suchleiste und Kategoriefilter */}
          <div className="mb-4 space-y-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Badge>
              {selectedTab === "tags"
                ? tagCategories.map((category) => (
                    <Badge
                      key={category.value}
                      variant={selectedCategory === category.value ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.label}
                    </Badge>
                  ))
                : ["main", "shop", "community", "info", "account"].map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>
                  ))}
            </div>
          </div>

          {/* Tag Tab */}
          <TabsContent value="tags">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="custom-tag">Custom Tag</Label>
                <div className="flex space-x-2">
                  <Input
                    id="custom-tag"
                    placeholder="Enter a custom tag (e.g., product-123)"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                  />
                  <Button onClick={() => revalidateTag(customTag)} disabled={!customTag || isLoading}>
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Revalidate
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>Predefined Tags</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {filteredTags.map((tag) => (
                    <Button
                      key={tag.value}
                      variant="outline"
                      className="justify-start"
                      onClick={() => revalidateTag(tag.value)}
                    >
                      {tag.icon}
                      <span className="ml-2">{tag.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Path Tab */}
          <TabsContent value="paths">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="custom-path">Custom Path</Label>
                <div className="flex space-x-2">
                  <Input
                    id="custom-path"
                    placeholder="Enter a custom path (e.g., /products/123)"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                  />
                  <Button onClick={() => revalidatePath(customPath)} disabled={!customPath || isLoading}>
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Revalidate
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>Predefined Paths</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {filteredPaths.map((path) => (
                    <Button
                      key={path.value}
                      variant="outline"
                      className="justify-start"
                      onClick={() => revalidatePath(path.value)}
                    >
                      <Home className="h-4 w-4" />
                      <span className="ml-2">{path.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="tag-group">Tag Group</Label>
                <div className="flex space-x-2">
                  <Select value={selectedTagGroup} onValueChange={setSelectedTagGroup}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a tag group" />
                    </SelectTrigger>
                    <SelectContent>
                      {tagGroups
                        .filter(
                          (group) => searchQuery === "" || group.toLowerCase().includes(searchQuery.toLowerCase()),
                        )
                        .map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => revalidateGroup(selectedTagGroup)} disabled={!selectedTagGroup || isLoading}>
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Revalidate
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>Available Tag Groups</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {tagGroups
                    .filter((group) => searchQuery === "" || group.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((group) => (
                      <div key={group} className="flex items-center justify-between p-2 border rounded-md">
                        <Badge variant="outline">{group}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => revalidateGroup(group)}>
                          Revalidate
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Batch Operations Tab */}
          <TabsContent value="batch">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Select Tags to Revalidate</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                  {filteredTags.map((tag) => (
                    <div key={tag.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.value}`}
                        checked={selectedTags.includes(tag.value)}
                        onCheckedChange={() => toggleTagSelection(tag.value)}
                      />
                      <Label htmlFor={`tag-${tag.value}`} className="flex items-center cursor-pointer">
                        {tag.icon}
                        <span className="ml-2">{tag.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={revalidateMultipleTags}
                  disabled={selectedTags.length === 0 || isLoading}
                  className="w-full"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                  Revalidate {selectedTags.length} Tags
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <Label>Select Paths to Revalidate</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                  {filteredPaths.map((path) => (
                    <div key={path.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`path-${path.value}`}
                        checked={selectedPaths.includes(path.value)}
                        onCheckedChange={() => togglePathSelection(path.value)}
                      />
                      <Label htmlFor={`path-${path.value}`} className="cursor-pointer">
                        {path.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={revalidateMultiplePaths}
                  disabled={selectedPaths.length === 0 || isLoading}
                  className="w-full"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                  Revalidate {selectedPaths.length} Paths
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {result && (
          <Alert className={`mt-4 ${result.success ? "bg-green-50" : "bg-red-50"}`}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setResult(null)}>
          Clear Result
        </Button>
        <Button onClick={() => revalidateTag("all")} disabled={isLoading}>
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
          Revalidate All
        </Button>
      </CardFooter>
    </Card>
  )
}
