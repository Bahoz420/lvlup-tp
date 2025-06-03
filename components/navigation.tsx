import Link from "next/link"
import Image from "next/image"
import { Search, Home, ShoppingBag, Info, ImageIcon, LayoutDashboard, HeartHandshake, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, FileQuestion, MessageSquare, BarChart3, BookOpen } from "lucide-react"
import { CartButton } from "@/components/cart-button"
import { MobileNavigation } from "@/components/mobile-navigation"

export function Navigation() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-900/80 backdrop-blur-xl"
      data-testid="main-navigation"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" data-testid="logo-link">
            <Image src="/logo.png" alt="lvlup Logo" width={280} height={70} className="h-auto max-h-16 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-all duration-300 hover:text-white hover:scale-105"
              data-testid="home-link"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-all duration-300 hover:text-white hover:scale-105"
              data-testid="products-link"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </Link>

            {/* Info dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-all duration-300 hover:text-white hover:scale-105"
                data-testid="info-dropdown"
              >
                <Info className="h-4 w-4" />
                <span>Info</span>
                <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-gray-800/95 backdrop-blur-xl border-gray-700/50">
                <DropdownMenuItem asChild>
                  <Link
                    href="/info"
                    className="flex items-center gap-2 w-full text-gray-300 hover:text-white"
                    data-testid="status-link"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Status</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/info/setup-guide"
                    className="flex items-center gap-2 w-full text-gray-300 hover:text-white"
                    data-testid="setup-guide-link"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Setup Guide</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/gallery"
              className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-all duration-300 hover:text-white hover:scale-105"
              data-testid="gallery-link"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Gallery</span>
            </Link>
            <Link
              href="/community"
              className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-all duration-300 hover:text-white hover:scale-105"
              data-testid="community-link"
            >
              <Users className="h-4 w-4" />
              <span>Community</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-all duration-300 hover:text-white hover:scale-105"
              data-testid="dashboard-link"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-all duration-300 hover:text-white hover:scale-105"
                data-testid="more-dropdown"
              >
                <span>More</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800/95 backdrop-blur-xl border-gray-700/50">
                <DropdownMenuItem asChild>
                  <Link
                    href="/support"
                    className="flex items-center gap-2 w-full text-gray-300 hover:text-white"
                    data-testid="support-link"
                  >
                    <HeartHandshake className="h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/faq"
                    className="flex items-center gap-2 w-full text-gray-300 hover:text-white"
                    data-testid="faq-link"
                  >
                    <FileQuestion className="h-4 w-4" />
                    <span>FAQ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 w-full text-gray-300 hover:text-white"
                    data-testid="contact-link"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Contact</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <CartButton />
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full sm:w-56 md:w-64 pl-8 rounded-full bg-gray-800/50 border-purple-400/30 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
              data-testid="search-input"
            />
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex border-purple-400/30 text-gray-400 hover:bg-purple-500/20 hover:text-white hover:scale-105 transition-all duration-300"
              data-testid="login-button"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="hidden md:flex bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white hover:scale-105 transition-all duration-300"
              data-testid="register-button"
            >
              Activate
            </Button>
          </Link>
          <MobileNavigation isDark={true} />
        </div>
      </div>
    </header>
  )
}
