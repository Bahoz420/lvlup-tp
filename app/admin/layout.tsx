"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Users, Tag, ShoppingBag, Settings, BarChart, Database, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-800">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/admin" className="hover:text-gray-800">
            Admin
          </Link>
          {/* Dynamischer Breadcrumb basierend auf dem aktuellen Pfad */}
          {pathname !== "/admin" && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-gray-800">{pathname.split("/").pop()?.replace(/-/g, " ")}</span>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-3">
                <nav className="space-y-1">
                  <Link
                    href="/admin"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50 hover:text-gray-900 ${
                      pathname === "/admin" ? "bg-gray-50 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    <BarChart className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/admin/users"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50 hover:text-gray-900 ${
                      pathname === "/admin/users" ? "bg-gray-50 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>Users</span>
                  </Link>

                  <Link
                    href="/admin/products"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50 hover:text-gray-900 ${
                      pathname === "/admin/products" ? "bg-gray-50 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    <Tag className="h-5 w-5" />
                    <span>Products</span>
                  </Link>

                  <Link
                    href="/admin/orders"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50 hover:text-gray-900 ${
                      pathname === "/admin/orders" ? "bg-gray-50 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>

                  <Link
                    href="/admin/discount-codes"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50 hover:text-gray-900 ${
                      pathname === "/admin/discount-codes" ? "bg-gray-50 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Discount Codes</span>
                  </Link>

                  <Link
                    href="/admin/cache"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50 hover:text-gray-900 ${
                      pathname === "/admin/cache" ? "bg-gray-50 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    <Database className="h-5 w-5" />
                    <span>Cache</span>
                  </Link>

                  <Link
                    href="/admin/settings"
                    className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50 hover:text-gray-900 ${
                      pathname === "/admin/settings" ? "bg-gray-50 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
