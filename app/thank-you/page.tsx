import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, ArrowLeft, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="lvlup Logo" width={180} height={50} className="h-14 w-auto" />
            </Link>
            <Navigation />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Search..."
                className="w-[200px] rounded-full border-purple-200 bg-purple-50 pl-8 focus-visible:ring-purple-500"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hidden border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-900 md:flex"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="hidden bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 md:flex"
            >
              Activate
            </Button>
            <button className="flex md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 flex flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-purple-800 md:text-5xl">
              Thank You for Your Submission!
            </h1>
            <p className="text-lg text-purple-700">
              We've received your message and appreciate you taking the time to reach out to us.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2">
                  <Clock className="h-6 w-6 text-purple-700" />
                </div>
                <h2 className="text-xl font-semibold text-purple-800">What Happens Next?</h2>
              </div>
              <ul className="space-y-3 text-purple-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-amber-500">•</span>
                  <span>Our team will review your submission within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-amber-500">•</span>
                  <span>You'll receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-amber-500">•</span>
                  <span>A support representative will contact you if needed</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 127.14 96.36"
                    fill="#8b5cf6"
                    className="h-6 w-6"
                  >
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-purple-800">Need Immediate Help?</h2>
              </div>
              <p className="mb-4 text-purple-700">
                For urgent matters, you can join our Discord community for real-time support from our team and other
                users.
              </p>
              <Button asChild className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                <Link href="https://discord.gg/vantacheats" target="_blank" rel="noopener noreferrer">
                  Join Our Discord
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" className="gap-2 border-purple-200 text-purple-700">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Homepage</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="mt-12 bg-purple-900 py-12 text-white">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Image src="/logo-white.png" alt="lvlup Logo" width={180} height={180} className="mb-4 h-14 w-auto" />
              <p className="text-sm text-purple-200">
                Level up your gaming experience with our premium products and services.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-purple-200 transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-purple-200 transition-colors hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/info" className="text-purple-200 transition-colors hover:text-white">
                    Info
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="text-purple-200 transition-colors hover:text-white">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-purple-200 transition-colors hover:text-white">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-purple-200 transition-colors hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-purple-200 transition-colors hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-purple-200 transition-colors hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-purple-200 transition-colors hover:text-white">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Connect With Us</h3>
              <div className="mb-4 flex space-x-4">
                <Link href="#" className="text-purple-200 transition-colors hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>
                <Link href="#" className="text-purple-200 transition-colors hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Link>
                <Link href="#" className="text-purple-200 transition-colors hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
                <Link href="#" className="text-purple-200 transition-colors hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 127.14 96.36"
                    fill="currentColor"
                  >
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                </Link>
              </div>
              <p className="text-sm text-purple-200">Email: support@lvlup.com</p>
            </div>
          </div>
          <div className="mt-8 border-t border-purple-800 pt-8 text-center text-sm text-purple-300">
            <p>© 2025 lvlup. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
