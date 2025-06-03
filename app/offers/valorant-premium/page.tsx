import Link from "next/link"
import Image from "next/image"
import { Check, Shield, Zap, HeadsetIcon, Star, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"

export default function ValoriantPremiumOfferPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navigation />

      <main className="container py-8 md:py-12">
        <Link href="/" className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-purple-100">
          <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="inline-block bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                Limited Time Offer
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">50% OFF Valorant Premium Package</h1>
              <p className="text-purple-200 text-lg max-w-3xl">
                Get our most advanced Valorant cheat with aimbot, ESP, radar hack, and our exclusive HWID spoofer at
                half price. This special offer is available for a limited time only.
              </p>
            </div>
          </div>

          {/* Product Preview Video */}
          <div className="p-6 md:p-8 bg-purple-50 border-b border-purple-100">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Product Preview</h2>
            <div className="aspect-video w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg relative">
              <Image
                src="/gaming-software-interface.png"
                alt="Valorant Premium Cheat Interface"
                fill
                className="object-cover"
                priority
              />
            </div>
            <p className="text-center text-sm text-purple-600 mt-3">
              Watch our Valorant Premium cheat in action - see the aimbot, ESP, and radar hack features
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-purple-800 mb-4">Offer Details</h2>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="text-amber-500 text-3xl font-bold">$12.49</div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 line-through text-sm">$24.99</span>
                      <span className="text-amber-500 font-semibold text-sm">Save 50%</span>
                    </div>
                  </div>

                  <div className="ml-4 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    Offer ends soon
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-bold text-purple-800">What's Included:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-0.5 flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Advanced Aimbot</span>
                        <p className="text-sm text-purple-600">
                          Customizable settings with smooth targeting and adjustable FOV
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-0.5 flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Full ESP Features</span>
                        <p className="text-sm text-purple-600">
                          Player boxes, health bars, distance, and more with customizable colors
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-0.5 flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Radar Hack</span>
                        <p className="text-sm text-purple-600">
                          See enemies on minimap at all times with position tracking
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-0.5 flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">HWID Spoofer</span>
                        <p className="text-sm text-purple-600">
                          Exclusive hardware ID protection system to prevent bans
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-0.5 flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Lifetime Updates</span>
                        <p className="text-sm text-purple-600">Free updates for the lifetime of the product</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white py-6 text-lg">
                    Purchase Now - $12.49
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    Secure payment via Credit Card, PayPal, or Cryptocurrency
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 mb-6">
                  <h3 className="font-bold text-purple-800 mb-3">Why Choose Our Valorant Cheat?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-purple-100 p-2 flex-shrink-0">
                        <Shield className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">100% Undetected</span>
                        <p className="text-sm text-purple-600">
                          Our cheat uses advanced technology to remain undetected by Riot's anti-cheat system
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-purple-100 p-2 flex-shrink-0">
                        <Zap className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Instant Delivery</span>
                        <p className="text-sm text-purple-600">Get access to your product immediately after purchase</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-purple-100 p-2 flex-shrink-0">
                        <HeadsetIcon className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">24/7 Support</span>
                        <p className="text-sm text-purple-600">
                          Our dedicated support team is available around the clock
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-purple-100">
                  <h3 className="font-bold text-purple-800 mb-3">Customer Reviews</h3>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-purple-800 font-bold">4.9/5.0</span>
                    <span className="text-purple-600 text-sm ml-2">(238 reviews)</span>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b border-purple-100 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                          <span className="text-xs font-bold text-purple-800">VP</span>
                        </div>
                        <div>
                          <div className="font-medium text-purple-800">ValPro</div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-purple-600">
                        "Valorant ESP is undetectable, amazing! Been using it for 3 months with no issues. The aimbot is
                        smooth and customizable."
                      </p>
                    </div>

                    <div className="border-b border-purple-100 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                          <span className="text-xs font-bold text-purple-800">RK</span>
                        </div>
                        <div>
                          <div className="font-medium text-purple-800">RankClimber</div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-purple-600">
                        "Worth every penny! The radar hack alone is game-changing. Support team helped me with setup
                        within minutes."
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                          <span className="text-xs font-bold text-purple-800">GG</span>
                        </div>
                        <div>
                          <div className="font-medium text-purple-800">GodGamer</div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-purple-600">
                        "The HWID spoofer is a game changer. I've tried other cheats before but this one is by far the
                        most reliable and feature-rich."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products Section */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-800">Top Products</h2>
            <p className="text-purple-600 mt-2">Check out our most popular gaming solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Apex Legends */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-purple-100 transition-transform hover:scale-105">
              <div className="relative h-48">
                <Image src="/apex.png" alt="Apex Legends Cheat" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs font-semibold bg-amber-500 px-2 py-0.5 rounded-full inline-block mb-1">
                    Popular
                  </div>
                  <h3 className="font-bold text-lg">Apex Legends</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-purple-600 mb-3">Advanced aimbot and ESP features for Apex Legends</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-500">$19.99</span>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
                  >
                    <Link href="/products/apex-legends">View Details</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Fortnite */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-purple-100 transition-transform hover:scale-105">
              <div className="relative h-48">
                <Image src="/fortnite.png" alt="Fortnite Cheat" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs font-semibold bg-red-500 px-2 py-0.5 rounded-full inline-block mb-1">Hot</div>
                  <h3 className="font-bold text-lg">Fortnite</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-purple-600 mb-3">Undetectable Fortnite cheat with building assistance</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-500">$24.99</span>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
                  >
                    <Link href="/products/fortnite">View Details</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Warzone */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-purple-100 transition-transform hover:scale-105">
              <div className="relative h-48">
                <Image src="/warzone.png" alt="Warzone Cheat" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-lg">Warzone</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-purple-600 mb-3">Complete Warzone solution with radar and weapon mods</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-500">$22.99</span>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
                  >
                    <Link href="/products/warzone">View Details</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* PUBG */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-purple-100 transition-transform hover:scale-105">
              <div className="relative h-48">
                <Image src="/pubg.png" alt="PUBG Cheat" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xs font-semibold bg-green-500 px-2 py-0.5 rounded-full inline-block mb-1">
                    New
                  </div>
                  <h3 className="font-bold text-lg">PUBG</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-purple-600 mb-3">
                  Premium PUBG cheat with recoil control and enemy detection
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-500">$21.99</span>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
                  >
                    <Link href="/products/pubg">View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-purple-900 text-white py-8 mt-12">
        <div className="container text-center">
          <p className="text-purple-200 text-sm">© 2025 lvlup. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
