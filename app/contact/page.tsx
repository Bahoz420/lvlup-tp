import Link from "next/link"
import Image from "next/image"
import { HeadsetIcon, Mail, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"
import { PerformanceAwareBackground } from "@/components/performance-aware-background"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"

// Füge revalidate-Export am Anfang der Datei hinzu
export const revalidate = 86400 // Revalidiere die Kontakt-Seite einmal täglich

export default function ContactPage() {
  return (
    <PerformanceAwareBackground className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent mb-4">
              Contact <span className="text-amber-500">lvlup</span>
            </h1>
            <p className="text-lg text-purple-100/90 max-w-2xl mx-auto">
              Have questions or need assistance? Reach out to our team directly or join our Discord community for
              real-time support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <MobileOptimizedCard className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
                <p className="text-purple-200">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <ContactForm />
            </MobileOptimizedCard>

            {/* Discord and Additional Info */}
            <div className="space-y-8">
              <MobileOptimizedCard className="p-6 sm:p-8 overflow-hidden">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-4 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 127.14 96.36"
                      fill="#fff"
                      alt="Discord Logo"
                    >
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Join Our Discord</h2>
                </div>
                <p className="text-purple-200 mb-6">
                  Get real-time support, connect with other users, and stay updated on the latest news and updates.
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-red-500 text-white rounded-full px-6 py-3 hover:scale-105 transition-all duration-300"
                >
                  <Link href="https://discord.gg/CN8XS9Eb" target="_blank" rel="noopener noreferrer">
                    Join Discord Server
                  </Link>
                </Button>
              </MobileOptimizedCard>

              <MobileOptimizedCard className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/10 backdrop-blur-md p-2">
                      <Mail className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Email</h3>
                      <p className="text-purple-200">support@vantacheats.io</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/10 backdrop-blur-md p-2">
                      <HeadsetIcon className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Support Hours</h3>
                      <p className="text-purple-200">Monday - Friday: 9AM - 6PM EST</p>
                      <p className="text-purple-200">Weekend: 10AM - 4PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/10 backdrop-blur-md p-2">
                      <MessageSquare className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Response Time</h3>
                      <p className="text-purple-200">We aim to respond to all inquiries within 24 hours.</p>
                    </div>
                  </div>
                </div>
              </MobileOptimizedCard>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-purple-200">
              Looking for answers to common questions? Check out our{" "}
              <Link href="/faq" className="text-amber-400 hover:underline font-medium">
                FAQ page
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 animate-pulse"></div>

        <div className="container relative z-10">
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
                ].map((link, index) => (
                  <li key={index}>
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
                ].map((link, index) => (
                  <li key={index}>
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
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-110 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 127.14 96.36"
                      fill="#fff"
                      className="h-6 w-6"
                    >
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                </Link>
                {/* Add other social media icons here if needed, styled similarly */}
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
