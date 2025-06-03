export const dynamic = "force-dynamic"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, User, Mail, Calendar, Edit, Key, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { requireAuth, getUserProfile } from "@/lib/auth-supabase"
import { createClient } from "@/utils/supabase/server"
import { Badge } from "@/components/ui/badge"

async function getUserOrders(userId: string) {
  const supabase = createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return orders || []
}

async function getUserActivity(userId: string) {
  const supabase = createClient()

  // Get recent activity from various tables
  const activities = []

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3)

  if (recentOrders) {
    activities.push(
      ...recentOrders.map((order) => ({
        type: "order",
        title: "Order Placed",
        description: `Order #${order.id.slice(0, 8)} for ${order.currency} ${order.total_amount}`,
        date: order.created_at,
        icon: "shopping",
      })),
    )
  }

  // Sort by date
  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return activities.slice(0, 5)
}

export default async function ProfilePage() {
  const user = await requireAuth()
  const userProfile = await getUserProfile(user.id)
  const orders = await getUserOrders(user.id)
  const activities = await getUserActivity(user.id)

  const completedOrders = orders.filter((order) => order.status === "completed")
  const memberSince = new Date(user.created_at || "").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navigation />

      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-purple-600">
          <Link href="/" className="hover:text-purple-800">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/dashboard" className="hover:text-purple-800">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-purple-800">Profile</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 text-center border-b border-gray-200">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="rounded-full overflow-hidden h-full w-full relative">
                    <Image
                      src={userProfile?.profile_picture_url || "/abstract-geometric-shapes.png"}
                      alt="Profile Picture"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Link
                    href="/profile/edit"
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </div>
                <h2 className="text-xl font-bold text-purple-800">
                  {userProfile?.first_name && userProfile?.last_name
                    ? `${userProfile.first_name} ${userProfile.last_name}`
                    : user.email?.split("@")[0]}
                </h2>
                <p className="text-purple-600">{userProfile?.role === "admin" ? "Administrator" : "Premium Member"}</p>
                <p className="text-sm text-purple-500 mt-1">Member since {memberSince}</p>
              </div>

              <div className="p-6">
                <h3 className="font-medium text-purple-800 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-purple-500">Email</p>
                      <p className="font-medium text-purple-800">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-purple-500">Status</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                          {user.email_confirmed_at ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-purple-500">Orders</p>
                      <p className="font-medium text-purple-800">{completedOrders.length} completed</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Link href="/profile/edit">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Link href="/profile/change-password">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Link href="/profile/security">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Settings
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-purple-900">Profile Details</h2>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-purple-800 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-purple-500">Full Name</p>
                        <p className="font-medium text-purple-800">
                          {userProfile?.first_name && userProfile?.last_name
                            ? `${userProfile.first_name} ${userProfile.last_name}`
                            : "Not set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-500">Country</p>
                        <p className="font-medium text-purple-800">{userProfile?.country || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-500">Language</p>
                        <p className="font-medium text-purple-800">{userProfile?.language || "English"}</p>
                      </div>
                      {userProfile?.bio && (
                        <div>
                          <p className="text-sm text-purple-500">Bio</p>
                          <p className="font-medium text-purple-800">{userProfile.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-purple-800 mb-4">Account Statistics</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-purple-500">Total Orders</p>
                        <p className="font-medium text-purple-800">{orders.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-500">Active Products</p>
                        <p className="font-medium text-purple-800">{completedOrders.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-500">Account Type</p>
                        <div className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          <p className="font-medium text-purple-800">
                            {userProfile?.role === "admin" ? "Administrator" : "Premium"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-medium text-purple-800 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {activities.length === 0 ? (
                      <p className="text-gray-500 text-sm">No recent activity</p>
                    ) : (
                      activities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg border border-purple-100 bg-purple-50"
                        >
                          <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                            <Shield className="h-5 w-5 text-purple-700" />
                          </div>
                          <div>
                            <p className="font-medium text-purple-800">{activity.title}</p>
                            <p className="text-sm text-purple-600">{activity.description}</p>
                            <p className="text-xs text-purple-500 mt-1">
                              {new Date(activity.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
