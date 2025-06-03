"use client"

import Link from "next/link"
import Image from "next/image"
import {
  MessageCircle,
  Clock,
  Bell,
  Users,
  Copy,
  ArrowLeft,
  Headphones,
  Mail,
  FileQuestion,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactFormSimple } from "@/components/contact-form-simple"
import { PerformanceAwareBackground } from "@/components/performance-aware-background"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"

export const revalidate = 86400 // Revalidate the support page once daily

export default function SupportPage() {
  return (
    <PerformanceAwareBackground className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent">
            Support Center
          </h1>
          <p className="text-purple-200 mt-2 text-lg">Get help with your orders, products, and account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discord Support Card */}
          <MobileOptimizedCard className="col-span-1 lg:col-span-2 shadow-2xl group">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mr-3">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Join Our Discord</h2>
                  </div>
                  <p className="text-purple-200 mb-6">
                    Get instant support, stay updated on new products, and connect with our community by joining our
                    Discord server.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      {
                        icon: Clock,
                        title: "24/7 Live Support",
                        desc: "Our support team is available around the clock",
                        color: "text-blue-400",
                      },
                      {
                        icon: Bell,
                        title: "Exclusive Updates",
                        desc: "Be the first to know about new products and features",
                        color: "text-amber-400",
                      },
                      {
                        icon: Users,
                        title: "Community",
                        desc: "Connect with other users and share experiences",
                        color: "text-green-400",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="mt-1 bg-white/10 p-1.5 rounded-full">
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-white">{item.title}</h3>
                          <p className="text-sm text-purple-300">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full px-6 py-3 hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <Link href="https://discord.gg/CN8XS9Eb" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Join Discord
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-400/70 text-purple-300 hover:bg-purple-400/10 backdrop-blur-md rounded-full px-6 py-3 hover:scale-105 transition-all duration-300"
                      onClick={() => navigator.clipboard.writeText("https://discord.gg/CN8XS9Eb")}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Invite Link
                    </Button>
                  </div>
                </div>

                <div className="hidden md:block relative">
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/50 to-purple-600/50 flex items-center justify-center animate-pulse-slow">
                        <svg
                          className="w-16 h-16 text-white"
                          viewBox="0 0 71 55"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
                        </svg>
                      </div>
                      <div className="absolute top-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-purple-800 animate-ping"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-purple-800"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MobileOptimizedCard>

          {/* FAQ Card */}
          <MobileOptimizedCard className="shadow-2xl group">
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg mr-3">
                  <FileQuestion className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Quick Help</h2>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  { href: "/faq#activation", title: "Activation Guide", desc: "Learn how to activate your products" },
                  { href: "/faq#troubleshooting", title: "Troubleshooting", desc: "Common issues and their solutions" },
                  { href: "/faq#payment", title: "Payment Issues", desc: "Resolve payment-related problems" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300 group/item"
                  >
                    <h3 className="font-medium flex items-center text-white group-hover/item:text-amber-300 transition-colors">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      {item.title}
                    </h3>
                    <p className="text-sm text-purple-300 mt-1 ml-6">{item.desc}</p>
                  </Link>
                ))}
              </div>

              <Button
                asChild
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-red-500 text-white rounded-full px-6 py-3 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Link href="/faq">View All FAQs</Link>
              </Button>
            </div>
          </MobileOptimizedCard>
        </div>

        {/* Contact Options */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent">
            Other Ways to Get Support
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Headphones,
                title: "Live Chat",
                desc: "Chat with our support team in real-time for immediate assistance.",
                buttonText: "Start Chat",
                href: "#",
                color: "blue",
                available: true,
              },
              {
                icon: Mail,
                title: "Email Support",
                desc: "Send us an email and we'll get back to you within 24 hours.",
                buttonText: "Email Us",
                href: "/contact",
                color: "amber",
                available: true,
              },
              {
                icon: MessageCircle,
                title: "Community Forum",
                desc: "Browse our community forum for answers and discussions.",
                buttonText: "Visit Forum",
                href: "/forum",
                color: "purple",
                available: true,
              },
            ].map((item, idx) => (
              <MobileOptimizedCard key={idx} className="p-6 shadow-xl group text-center">
                <div
                  className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${
                    item.color === "blue"
                      ? "from-blue-500 to-cyan-500"
                      : item.color === "amber"
                        ? "from-amber-500 to-orange-500"
                        : "from-purple-500 to-pink-500"
                  } p-3 group-hover:scale-110 transition-transform duration-300 animate-pulse-slow`}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-purple-200 mb-4 text-sm">{item.desc}</p>
                <Button
                  asChild={item.href.startsWith("/")}
                  variant="outline"
                  className={`w-full rounded-full py-3 border-2 ${
                    item.color === "blue"
                      ? "border-blue-400/70 text-blue-300 hover:bg-blue-400/10"
                      : item.color === "amber"
                        ? "border-amber-400/70 text-amber-300 hover:bg-amber-400/10"
                        : "border-purple-400/70 text-purple-300 hover:bg-purple-400/10"
                  } backdrop-blur-md hover:scale-105 transition-all duration-300`}
                  disabled={!item.available}
                >
                  {item.href.startsWith("/") ? (
                    <Link href={item.href}>{item.buttonText}</Link>
                  ) : (
                    <a href={item.href}>{item.buttonText}</a>
                  )}
                </Button>
              </MobileOptimizedCard>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent">
            Contact Us Directly
          </h2>
          <MobileOptimizedCard className="p-6 md:p-8 shadow-2xl">
            <ContactFormSimple />
          </MobileOptimizedCard>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-16 relative overflow-hidden mt-16">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 animate-pulse"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <Image
                  src="/logo-white.png"
                  alt="lvlup Logo"
                  width={200}
                  height={50}
                  className="h-16 w-auto mb-6 relative z-10 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-purple-200 text-sm group-hover:text-purple-100 transition-colors">
                Level up your gaming experience with our premium products and services.
              </p>
            </div>

            <div className="group">
              <h3 className="text-lg font-bold mb-6 group-hover:text-amber-400 transition-colors">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/products", label: "Products" },
                  { href: "/info", label: "Info" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/community", label: "Community" },
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/faq", label: "FAQ" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group">
              <h3 className="text-lg font-bold mb-6 group-hover:text-amber-400 transition-colors">Legal</h3>
              <ul className="space-y-3">
                {[
                  { href: "/terms", label: "Terms of Service" },
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/refund", label: "Refund Policy" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group">
              <h3 className="text-lg font-bold mb-6 group-hover:text-amber-400 transition-colors">Connect With Us</h3>
              <div className="flex space-x-4 mb-6">
                <Link
                  href="https://discord.gg/CN8XS9Eb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social"
                  aria-label="Discord"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-110 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 127.14 96.36"
                      fill="currentColor"
                      className="h-6 w-6 text-white"
                    >
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                </Link>
              </div>
              <p className="text-sm text-purple-200 group-hover:text-purple-100 transition-colors">
                Email: support@lvlup.com
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-purple-700/50 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-purple-300">© 2025 lvlup. All rights reserved.</p>
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </PerformanceAwareBackground>
  )
}
