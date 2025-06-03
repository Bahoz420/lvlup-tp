import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes, adminRoutes } from "@/lib/routes" // Updated import path
import { getCurrentUser } from "@/lib/auth-supabase"

export async function middleware(request: NextRequest) {
  const { nextUrl } = request
  const { user, session } = await getCurrentUser() // Get user and session
  const isLoggedIn = !!session // User is logged in if there's a session

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.includes(":slug") || route.includes(":id")) {
      const baseRoute = route.substring(0, route.indexOf("/:"))
      return nextUrl.pathname.startsWith(baseRoute)
    }
    return nextUrl.pathname === route
  })
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isAdminRoute = adminRoutes.some((route) => {
    if (route.includes(":slug") || route.includes(":id")) {
      const baseRoute = route.substring(0, route.indexOf("/:"))
      return nextUrl.pathname.startsWith(baseRoute)
    }
    return nextUrl.pathname === route
  })

  if (isApiAuthRoute) {
    return null
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl))
    }
    // Check if the user has an admin role
    // This assumes your `getCurrentUser` or a related function can provide role information
    // For example, if user.app_metadata.role contains 'admin'
    const userIsAdmin = user?.app_metadata?.role === "admin" || user?.user_metadata?.role === "admin"
    if (!userIsAdmin) {
      // Redirect to a 'not authorized' page or homepage if not admin
      console.warn(`User ${user?.email} attempted to access admin route ${nextUrl.pathname} without admin privileges.`)
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
  }

  return null
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
