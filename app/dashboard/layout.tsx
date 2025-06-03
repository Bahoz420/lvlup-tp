import type React from "react"
// import Link from "next/link" // Link will be used via DashboardNavLink
import { ChevronRight, Download, CreditCard, ShoppingCart, User, Settings, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthCheck } from "@/components/auth-check"
import { createClient } from "@/utils/supabase/server" // UPDATED
import { DashboardNavLink } from "@/components/dashboard-nav-link"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient() // UPDATED

  const {
    data: { user }, // UPDATED to get user directly
  } = await supabase.auth.getUser()

  let userName = "Member"
  let membershipType = "Premium Member"
  const userEmail = user?.email || "demo@example.com" // Fallback for demo or if email is not set

  if (user) {
    const { data: userProfile } = await supabase
      .from("users")
      .select("username, first_name, membership_type")
      .eq("id", user.id)
      .single()
    userName = userProfile?.first_name || userProfile?.username || user.email?.split("@")[0] || "Member"
    membershipType = userProfile?.membership_type || "Premium Member"
  } else {
    // Handle demo user display if needed, or rely on AuthCheck/page logic
    userName = "Demo User"
    membershipType = "Demo Access"
  }

  return (
    <>
      {/* Client-side Authentifizierungsprüfung, ensure this handles demo mode or is appropriate */}
      <AuthCheck redirectTo="/login" />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
        <div className="container py-8">
          <div className="flex items-center gap-2 mb-6 text-sm text-purple-600">
            <DashboardNavLink href="/" className="hover:text-purple-800">
              Home
            </DashboardNavLink>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-purple-800">Dashboard</span>
          </div>

          <div className="grid md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{userName}</CardTitle>
                      <CardDescription>{membershipType}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <nav className="space-y-1">
                    <DashboardNavLink
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-md px-3 py-2"
                      activeClassName="bg-purple-100 text-purple-900 font-medium"
                      defaultClassName="text-purple-700 hover:bg-purple-50 hover:text-purple-900"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>My Products</span>
                    </DashboardNavLink>
                    <DashboardNavLink
                      href="/dashboard/orders"
                      className="flex items-center gap-3 rounded-md px-3 py-2"
                      activeClassName="bg-purple-100 text-purple-900 font-medium"
                      defaultClassName="text-purple-700 hover:bg-purple-50 hover:text-purple-900"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Order History</span>
                    </DashboardNavLink>
                    <DashboardNavLink
                      href="/dashboard/downloads"
                      className="flex items-center gap-3 rounded-md px-3 py-2"
                      activeClassName="bg-purple-100 text-purple-900 font-medium"
                      defaultClassName="text-purple-700 hover:bg-purple-50 hover:text-purple-900"
                    >
                      <Download className="h-5 w-5" />
                      <span>Downloads</span>
                    </DashboardNavLink>
                    <DashboardNavLink
                      href="/dashboard/settings"
                      className="flex items-center gap-3 rounded-md px-3 py-2"
                      activeClassName="bg-purple-100 text-purple-900 font-medium"
                      defaultClassName="text-purple-700 hover:bg-purple-50 hover:text-purple-900"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </DashboardNavLink>
                    {/* Sign out is a form post, not a typical nav link */}
                    <form action="/api/auth/signout" method="post">
                      <button
                        type="submit"
                        className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </form>
                  </nav>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                  <CardDescription>Our support team is here for you</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-purple-600 mb-4">
                    If you have any questions or issues with your products, our support team is available 24/7.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
                  >
                    <DashboardNavLink href="/support">Contact Support</DashboardNavLink>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}
