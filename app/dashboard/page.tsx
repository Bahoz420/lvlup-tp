export const dynamic = "force-dynamic"

import { requireAuth, getUserProfile } from "@/lib/auth-supabase"
import Image from "next/image"
import { Download, Clock, User, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

async function getUserOrders(userId: string) {
  // Always return demo orders for now
  return [
    {
      id: "demo-order-1",
      user_id: userId,
      status: "completed",
      total_amount: "29.99",
      currency: "EUR",
      payment_method: "Credit Card",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      order_items: [
        {
          id: "demo-item-1",
          subscription_type: "monthly",
          products: {
            name: "CS2 Premium Cheats",
            description: "Advanced aimbot and wallhack features",
            image_url: "/cs2.png",
          },
        },
      ],
    },
    {
      id: "demo-order-2",
      user_id: userId,
      status: "completed",
      total_amount: "49.99",
      currency: "EUR",
      payment_method: "PayPal",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      order_items: [
        {
          id: "demo-item-2",
          subscription_type: "lifetime",
          products: {
            name: "Valorant Hack Suite",
            description: "Complete Valorant cheat package",
            image_url: "/valorant.png",
          },
        },
      ],
    },
  ]
}

export default async function DashboardPage() {
  try {
    // Always allow demo mode
    const user = await requireAuth(true)
    const userProfile = await getUserProfile(user.id)
    const orders = await getUserOrders(user.id)

    // Separate active and expired orders
    const activeOrders = orders.filter((order) => order.status === "completed")
    const expiredOrders = orders.filter((order) => order.status === "expired" || order.status === "refunded")

    return (
      <>
        {/* Demo Mode Banner */}
        <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-lg">
          <p className="text-amber-800 text-sm">
            🚧 <strong>Demo Mode:</strong> You're viewing the dashboard in demo mode.
            <a href="/login" className="underline ml-1">
              Login
            </a>{" "}
            to see your actual data.
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Welcome back, {userProfile?.first_name || user.email?.split("@")[0]}!
            </CardTitle>
            <CardDescription>Manage your account and products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-600" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Member since {new Date(user.created_at || "").toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                  {user.email_confirmed_at ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Products</CardTitle>
            <CardDescription>
              {orders.length > 0
                ? `You have ${activeOrders.length} active product${activeOrders.length !== 1 ? "s" : ""}`
                : "No products purchased yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't purchased any products yet.</p>
                <Button asChild>
                  <a href="/products">Browse Products</a>
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="active">Active Products ({activeOrders.length})</TabsTrigger>
                  <TabsTrigger value="expired">Order History ({expiredOrders.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-0">
                  {activeOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No active products</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeOrders.map((order) =>
                        order.order_items?.map((item) => (
                          <div
                            key={`${order.id}-${item.id}`}
                            className="rounded-lg border border-purple-100 overflow-hidden"
                          >
                            <div className="flex flex-col">
                              <div className="h-32 w-full relative">
                                <Image
                                  src={item.products?.image_url || "/placeholder.svg?height=200&width=300"}
                                  alt={item.products?.name || "Product"}
                                  width={300}
                                  height={200}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-3 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-purple-800">{item.products?.name}</h3>
                                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                                  </div>
                                  <p className="mt-1 text-xs text-purple-600">{item.products?.description}</p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Purchased: {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center text-xs text-purple-600">
                                    <Clock className="mr-1 h-3 w-3" />
                                    <span>
                                      {item.subscription_type === "lifetime" ? "Lifetime" : item.subscription_type}
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="outline" className="border-purple-200 text-xs py-1 h-7">
                                      <Download className="mr-1 h-3 w-3" />
                                      Download
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white text-xs py-1 h-7"
                                    >
                                      Extend
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )),
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="expired" className="mt-0">
                  {expiredOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No order history</p>
                  ) : (
                    <div className="space-y-4">
                      {expiredOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">Order #{order.id.slice(0, 8)}</h4>
                              <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm">
                            Total: {order.currency} {order.total_amount}
                          </p>
                          <p className="text-sm text-gray-600">Payment: {order.payment_method}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Recent Updates Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Latest updates for your products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image src="/abstract-geometric-shapes.png" alt="Update" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-purple-800">System Update</h4>
                  <p className="text-xs text-purple-600 mt-1">
                    All products have been updated for compatibility with the latest game patches.
                  </p>
                  <p className="text-xs text-purple-500 mt-2">2 days ago</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image src="/abstract-geometric-shapes.png" alt="Update" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-purple-800">New Features Available</h4>
                  <p className="text-xs text-purple-600 mt-1">
                    Check out the new features in your downloaded products.
                  </p>
                  <p className="text-xs text-purple-500 mt-2">5 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    )
  } catch (error) {
    console.error("Dashboard error:", error)

    // Fallback to demo mode if there's any error
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Loading...</h1>
          <p className="text-gray-600 mb-4">Setting up your demo dashboard</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    )
  }
}
