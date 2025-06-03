import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Search, Filter, Clock, Info, CheckCircle2 } from "lucide-react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function DownloadsPage() {
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
          <span className="font-medium text-purple-800">Downloads</span>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Downloads</CardTitle>
                <CardDescription>Access and download your purchased products</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-500" />
                  <Input
                    type="search"
                    placeholder="Search downloads..."
                    className="w-full sm:w-[240px] pl-9 bg-white border-purple-100 focus-visible:ring-purple-500"
                  />
                </div>
                <Button variant="outline" size="icon" className="border-purple-100">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All Files</TabsTrigger>
                <TabsTrigger value="software">Software</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0 space-y-6">
                {/* Software Category */}
                <div>
                  <h3 className="text-lg font-medium text-purple-800 mb-4">Software</h3>
                  <div className="space-y-4">
                    {/* Fortnite Download */}
                    <div className="rounded-lg border border-purple-100 overflow-hidden bg-white">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/5 max-w-[200px]">
                          <Image
                            src="/fortnite.png"
                            alt="Fortnite"
                            width={200}
                            height={150}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4 sm:w-4/5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-purple-800">lvlup Fortnite</h3>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Latest</Badge>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-purple-600">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Updated 2 days ago</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-2">
                              <div className="text-sm text-purple-600">
                                <span className="font-medium">Version:</span> 2.4.1
                              </div>
                              <div className="text-sm text-purple-600">
                                <span className="font-medium">Size:</span> 24.5 MB
                              </div>
                              <div className="text-sm text-purple-600">
                                <span className="font-medium">OS:</span> Windows 10/11
                              </div>
                            </div>
                            <p className="text-sm text-purple-600 mb-4">
                              Premium Fortnite cheat with aimbot, ESP and more features. This version includes fixes for
                              the latest game update and improved anti-detection.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Undetected</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>HWID Spoofer</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Auto-Update</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Download
                              </Button>
                              <Button size="sm" variant="outline" className="border-purple-200">
                                <Info className="mr-1 h-4 w-4" />
                                Instructions
                              </Button>
                            </div>
                            <Link href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                              View previous versions
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Valorant Download */}
                    <div className="rounded-lg border border-purple-100 overflow-hidden bg-white">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/5 max-w-[200px]">
                          <Image
                            src="/valorant.png"
                            alt="Valorant"
                            width={200}
                            height={150}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4 sm:w-4/5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-purple-800">lvlup Valorant</h3>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Latest</Badge>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-purple-600">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Updated 5 days ago</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-2">
                              <div className="text-sm text-purple-600">
                                <span className="font-medium">Version:</span> 3.1.0
                              </div>
                              <div className="text-sm text-purple-600">
                                <span className="font-medium">Size:</span> 18.2 MB
                              </div>
                              <div className="text-sm text-purple-600">
                                <span className="font-medium">OS:</span> Windows 10/11
                              </div>
                            </div>
                            <p className="text-sm text-purple-600 mb-4">
                              Premium Valorant cheat with advanced features including aimbot, ESP, and radar. This
                              version includes improved stability and new features.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Undetected</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>HWID Spoofer</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Auto-Update</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Download
                              </Button>
                              <Button size="sm" variant="outline" className="border-purple-200">
                                <Info className="mr-1 h-4 w-4" />
                                Instructions
                              </Button>
                            </div>
                            <Link href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                              View previous versions
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tools Category */}
                <div>
                  <h3 className="text-lg font-medium text-purple-800 mb-4">Tools</h3>
                  <div className="space-y-4">
                    {/* HWID Spoofer */}
                    <div className="rounded-lg border border-purple-100 overflow-hidden bg-white">
                      <div className="p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-purple-800">HWID Spoofer</h3>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Latest</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-purple-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Updated 1 week ago</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mb-2">
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">Version:</span> 1.5.2
                            </div>
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">Size:</span> 8.7 MB
                            </div>
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">OS:</span> Windows 10/11
                            </div>
                          </div>
                          <p className="text-sm text-purple-600 mb-4">
                            Advanced HWID spoofer to prevent hardware bans. This tool changes your hardware identifiers
                            to avoid detection and bans.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline" className="border-purple-200">
                              <Info className="mr-1 h-4 w-4" />
                              Instructions
                            </Button>
                          </div>
                          <Link href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                            View previous versions
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Cleaner Tool */}
                    <div className="rounded-lg border border-purple-100 overflow-hidden bg-white">
                      <div className="p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-purple-800">Trace Cleaner</h3>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Latest</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-purple-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Updated 2 weeks ago</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mb-2">
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">Version:</span> 2.0.1
                            </div>
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">Size:</span> 5.3 MB
                            </div>
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">OS:</span> Windows 10/11
                            </div>
                          </div>
                          <p className="text-sm text-purple-600 mb-4">
                            System cleaner that removes all traces of cheat usage from your computer. Helps prevent
                            detection by anti-cheat systems.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline" className="border-purple-200">
                              <Info className="mr-1 h-4 w-4" />
                              Instructions
                            </Button>
                          </div>
                          <Link href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                            View previous versions
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="software" className="mt-0">
                <div className="space-y-4">
                  {/* Fortnite Download */}
                  <div className="rounded-lg border border-purple-100 overflow-hidden bg-white">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/5 max-w-[200px]">
                        <Image
                          src="/fortnite.png"
                          alt="Fortnite"
                          width={200}
                          height={150}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4 sm:w-4/5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-purple-800">lvlup Fortnite</h3>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Latest</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-purple-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Updated 2 days ago</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mb-2">
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">Version:</span> 2.4.1
                            </div>
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">Size:</span> 24.5 MB
                            </div>
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">OS:</span> Windows 10/11
                            </div>
                          </div>
                          <p className="text-sm text-purple-600 mb-4">
                            Premium Fortnite cheat with aimbot, ESP and more features. This version includes fixes for
                            the latest game update and improved anti-detection.
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Undetected</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>HWID Spoofer</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Auto-Update</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline" className="border-purple-200">
                              <Info className="mr-1 h-4 w-4" />
                              Instructions
                            </Button>
                          </div>
                          <Link href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                            View previous versions
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Valorant Download */}
                  <div className="rounded-lg border border-purple-100 overflow-hidden bg-white">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/5 max-w-[200px]">
                        <Image
                          src="/valorant.png"
                          alt="Valorant"
                          width={200}
                          height={150}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4 sm:w-4/5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-purple-800">lvlup Valorant</h3>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Latest</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-purple-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Updated 5 days ago</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mb-2">
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">Version:</span> 3.1.0
                            </div>
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">Size:</span> 18.2 MB
                            </div>
                            <div className="text-sm text-purple-600">
                              <span className="font-medium">OS:</span> Windows 10/11
                            </div>
                          </div>
                          <p className="text-sm text-purple-600 mb-4">
                            Premium Valorant cheat with advanced features including aimbot, ESP, and radar. This version
                            includes improved stability and new features.
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Undetected</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>HWID Spoofer</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Auto-Update</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline" className="border-purple-200">
                              <Info className="mr-1 h-4 w-4" />
                              Instructions
                            </Button>
                          </div>
                          <Link href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                            View previous versions
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="updates" className="mt-0">
                <div className="rounded-lg border border-purple-100 p-6 bg-white text-center">
                  <h3 className="text-lg font-medium text-purple-800 mb-2">All Updates Installed</h3>
                  <p className="text-sm text-purple-600 mb-4">
                    You have all the latest updates for your products. Check back later for new updates.
                  </p>
                  <Button
                    variant="outline"
                    className="border-purple-200 text-purple-700 hover:text-purple-900 hover:bg-purple-50"
                  >
                    Check for Updates
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="mt-0">
                <div className="space-y-4">
                  {/* HWID Spoofer */}
                  <div className="rounded-lg border border-purple-100 overflow-hidden bg-white">
                    <div className="p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-purple-800">HWID Spoofer</h3>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Latest</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-purple-600">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Updated 1 week ago</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mb-2">
                          <div className="text-sm text-purple-600">
                            <span className="font-medium">Version:</span> 1.5.2
                          </div>
                          <div className="text-sm text-purple-600">
                            <span className="font-medium">Size:</span> 8.7 MB
                          </div>
                          <div className="text-sm text-purple-600">
                            <span className="font-medium">OS:</span> Windows 10/11
                          </div>
                        </div>
                        <p className="text-sm text-purple-600 mb-4">
                          Advanced HWID spoofer to prevent hardware bans. This tool changes your hardware identifiers to
                          avoid detection and bans.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" className="border-purple-200">
                            <Info className="mr-1 h-4 w-4" />
                            Instructions
                          </Button>
                        </div>
                        <Link href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                          View previous versions
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Cleaner Tool */}
                  <div className="rounded-lg border border-purple-100 overflow-hidden bg-white">
                    <div className="p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-purple-800">Trace Cleaner</h3>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Latest</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-purple-600">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Updated 2 weeks ago</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mb-2">
                          <div className="text-sm text-purple-600">
                            <span className="font-medium">Version:</span> 2.0.1
                          </div>
                          <div className="text-sm text-purple-600">
                            <span className="font-medium">Size:</span> 5.3 MB
                          </div>
                          <div className="text-sm text-purple-600">
                            <span className="font-medium">OS:</span> Windows 10/11
                          </div>
                        </div>
                        <p className="text-sm text-purple-600 mb-4">
                          System cleaner that removes all traces of cheat usage from your computer. Helps prevent
                          detection by anti-cheat systems.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" className="border-purple-200">
                            <Info className="mr-1 h-4 w-4" />
                            Instructions
                          </Button>
                        </div>
                        <Link href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                          View previous versions
                        </Link>
                      </div>
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
