import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Download, Search, Filter, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
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
          <span className="font-medium text-purple-800">Order History</span>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and manage your previous orders</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-500" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="pl-8 bg-white border-purple-100 w-full sm:w-[200px] h-9"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-purple-200">
                  <Filter className="mr-1 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="refunded">Refunded</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="rounded-md border border-purple-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-purple-50 text-left">
                          <th className="px-4 py-3 font-medium text-purple-800 flex items-center gap-1">
                            Order ID
                            <button className="ml-1">
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="px-4 py-3 font-medium text-purple-800">Product</th>
                          <th className="px-4 py-3 font-medium text-purple-800 flex items-center gap-1">
                            Date
                            <button className="ml-1">
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="px-4 py-3 font-medium text-purple-800">Amount</th>
                          <th className="px-4 py-3 font-medium text-purple-800">Status</th>
                          <th className="px-4 py-3 font-medium text-purple-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100">
                        {/* Order 1 */}
                        <tr className="bg-white hover:bg-purple-50">
                          <td className="px-4 py-3 text-purple-800">#ORD-7829</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src="/fortnite.png"
                                  alt="Fortnite"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-purple-800">lvlup Fortnite</div>
                                <div className="text-xs text-purple-600">1 Month Pack</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-purple-700">May 12, 2025</td>
                          <td className="px-4 py-3 font-medium text-purple-800">$24.99</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Completed
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-8 border-purple-200">
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-purple-200 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Order 2 */}
                        <tr className="bg-white hover:bg-purple-50">
                          <td className="px-4 py-3 text-purple-800">#ORD-7814</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src="/valorant.png"
                                  alt="Valorant"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-purple-800">lvlup Valorant</div>
                                <div className="text-xs text-purple-600">1 Month Pack</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-purple-700">May 2, 2025</td>
                          <td className="px-4 py-3 font-medium text-purple-800">$19.99</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Completed
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-8 border-purple-200">
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-purple-200 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Order 3 */}
                        <tr className="bg-white hover:bg-purple-50">
                          <td className="px-4 py-3 text-purple-800">#ORD-7798</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src="/apex.png"
                                  alt="Apex Legends"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-purple-800">lvlup Apex Legends</div>
                                <div className="text-xs text-purple-600">1 Week Pack</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-purple-700">April 25, 2025</td>
                          <td className="px-4 py-3 font-medium text-purple-800">$12.99</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Processing
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-8 border-purple-200">
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-purple-200 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Order 4 */}
                        <tr className="bg-white hover:bg-purple-50">
                          <td className="px-4 py-3 text-purple-800">#ORD-7765</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src="/warzone.png"
                                  alt="Warzone"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-purple-800">lvlup Warzone</div>
                                <div className="text-xs text-purple-600">Lifetime Pack</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-purple-700">April 15, 2025</td>
                          <td className="px-4 py-3 font-medium text-purple-800">$89.99</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              Refunded
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-8 border-purple-200">
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-purple-200 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Order 5 */}
                        <tr className="bg-white hover:bg-purple-50">
                          <td className="px-4 py-3 text-purple-800">#ORD-7742</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src="/pubg.png"
                                  alt="PUBG"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-purple-800">lvlup PUBG</div>
                                <div className="text-xs text-purple-600">1 Day Pack</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-purple-700">April 10, 2025</td>
                          <td className="px-4 py-3 font-medium text-purple-800">$7.99</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Completed
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-8 border-purple-200">
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-purple-200 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-purple-50 px-4 py-3 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-purple-700">Showing 5 of 24 orders</div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-purple-200 bg-white" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-purple-200 bg-white text-purple-800">
                        1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-purple-200 bg-white hover:bg-purple-50 hover:text-purple-900"
                      >
                        2
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-purple-200 bg-white hover:bg-purple-50 hover:text-purple-900"
                      >
                        3
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-purple-200 bg-white hover:bg-purple-50 hover:text-purple-900"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="rounded-md border border-purple-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-purple-50 text-left">
                          <th className="px-4 py-3 font-medium text-purple-800 flex items-center gap-1">
                            Order ID
                            <button className="ml-1">
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="px-4 py-3 font-medium text-purple-800">Product</th>
                          <th className="px-4 py-3 font-medium text-purple-800 flex items-center gap-1">
                            Date
                            <button className="ml-1">
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="px-4 py-3 font-medium text-purple-800">Amount</th>
                          <th className="px-4 py-3 font-medium text-purple-800">Status</th>
                          <th className="px-4 py-3 font-medium text-purple-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100">
                        {/* Order 1 */}
                        <tr className="bg-white hover:bg-purple-50">
                          <td className="px-4 py-3 text-purple-800">#ORD-7829</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src="/fortnite.png"
                                  alt="Fortnite"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-purple-800">lvlup Fortnite</div>
                                <div className="text-xs text-purple-600">1 Month Pack</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-purple-700">May 12, 2025</td>
                          <td className="px-4 py-3 font-medium text-purple-800">$24.99</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Completed
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-8 border-purple-200">
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-purple-200 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Order 2 */}
                        <tr className="bg-white hover:bg-purple-50">
                          <td className="px-4 py-3 text-purple-800">#ORD-7814</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src="/valorant.png"
                                  alt="Valorant"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-purple-800">lvlup Valorant</div>
                                <div className="text-xs text-purple-600">1 Month Pack</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-purple-700">May 2, 2025</td>
                          <td className="px-4 py-3 font-medium text-purple-800">$19.99</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Completed
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-8 border-purple-200">
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-purple-200 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Order 3 */}
                        <tr className="bg-white hover:bg-purple-50">
                          <td className="px-4 py-3 text-purple-800">#ORD-7742</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src="/pubg.png"
                                  alt="PUBG"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-purple-800">lvlup PUBG</div>
                                <div className="text-xs text-purple-600">1 Day Pack</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-purple-700">April 10, 2025</td>
                          <td className="px-4 py-3 font-medium text-purple-800">$7.99</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Completed
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-8 border-purple-200">
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-purple-200 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-purple-50 px-4 py-3 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-purple-700">Showing 3 of 18 orders</div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-purple-200 bg-white" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-purple-200 bg-white text-purple-800">
                        1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-purple-200 bg-white hover:bg-purple-50 hover:text-purple-900"
                      >
                        2
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-purple-200 bg-white hover:bg-purple-50 hover:text-purple-900"
                      >
                        3
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-purple-200 bg-white hover:bg-purple-50 hover:text-purple-900"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="processing" className="mt-0">
                <div className="rounded-md border border-purple-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-purple-50 text-left">
                          <th className="px-4 py-3 font-medium text-purple-800 flex items-center gap-1">
                            Order ID
                            <button className="ml-1">
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="px-4 py-3 font-medium text-purple-800">Product</th>
                          <th className="px-4 py-3 font-medium text-purple-800 flex items-center gap-1">
                            Date
                            <button className="ml-1">
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="px-4 py-3 font-medium text-purple-800">Amount</th>
                          <th className="px-4 py-3 font-medium text-purple-800">Status</th>
                          <th className="px-4 py-3 font-medium text-purple-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100">
                        {/* Order 1 */}
                        <tr className="bg-white hover:bg-purple-50">
                          <td className="px-4 py-3 text-purple-800">#ORD-7798</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src="/apex.png"
                                  alt="Apex Legends"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-purple-800">lvlup Apex Legends</div>
                                <div className="text-xs text-purple-600">1 Week Pack</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-purple-700">April 25, 2025</td>
                          <td className="px-4 py-3 font-medium text-purple-800">$12.99</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Processing
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-8 border-purple-200">
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-purple-200 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-purple-50 px-4 py-3 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-purple-700">Showing 1 of 1 orders</div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-purple-200 bg-white" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-purple-200 bg-white text-purple-800">
                        1
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-purple-200 bg-white" disabled>
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="refunded" className="mt-0">
                <div className="rounded-md border border-purple-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-purple-50 text-left">
                          <th className="px-4 py-3 font-medium text-purple-800 flex items-center gap-1">
                            Order ID
                            <button className="ml-1">
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="px-4 py-3 font-medium text-purple-800">Product</th>
                          <th className="px-4 py-3 font-medium text-purple-800 flex items-center gap-1">
                            Date
                            <button className="ml-1">
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="px-4 py-3 font-medium text-purple-800">Amount</th>
                          <th className="px-4 py-3 font-medium text-purple-800">Status</th>
                          <th className="px-4 py-3 font-medium text-purple-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100">
                        {/* Order 1 */}
                        <tr className="bg-white hover:bg-purple-50">
                          <td className="px-4 py-3 text-purple-800">#ORD-7765</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src="/warzone.png"
                                  alt="Warzone"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-purple-800">lvlup Warzone</div>
                                <div className="text-xs text-purple-600">Lifetime Pack</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-purple-700">April 15, 2025</td>
                          <td className="px-4 py-3 font-medium text-purple-800">$89.99</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              Refunded
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-8 border-purple-200">
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-purple-200 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Invoice
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-purple-50 px-4 py-3 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-purple-700">Showing 1 of 1 orders</div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-purple-200 bg-white" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-purple-200 bg-white text-purple-800">
                        1
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-purple-200 bg-white" disabled>
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
