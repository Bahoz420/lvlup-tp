import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { CartProvider } from "@/contexts/cart-context"
import { PerformanceProvider } from "@/hooks/use-performance" // Import PerformanceProvider
import { Toaster } from "@/components/ui/toaster" // For react-toast
import { Navigation } from "@/components/navigation" // Import Navigation

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LvlUp - Premium Gaming Software",
  description: "Professional gaming software for CS2, Valorant, Fortnite and more",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <PerformanceProvider>
          <CartProvider>
            <Navigation /> {/* Add Navigation component here */}
            {children}
            <Toaster /> {/* Add Toaster for react-toast notifications */}
          </CartProvider>
        </PerformanceProvider>
      </body>
    </html>
  )
}
