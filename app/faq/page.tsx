import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ShoppingBag, LayoutDashboard, HelpCircle, Search, Plus, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PerformanceAwareBackground } from "@/components/performance-aware-background"
import { MobileOptimizedCard } from "@/components/mobile-optimized-card"

export const revalidate = 86400 // Revalidiere die FAQ-Seite einmal täglich

export default function FAQPage() {
  return (
    <PerformanceAwareBackground className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-purple-300">
          <Link href="/" className="hover:text-amber-400">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-amber-400">FAQ</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-purple-200 max-w-3xl">
            Find answers to the most common questions about our products, services, and account management. If you can't
            find what you're looking for, please contact our support team.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
            <Input
              type="search"
              placeholder="Search for answers..."
              className="pl-10 py-3 bg-gray-800/50 border-purple-400/30 text-white placeholder:text-purple-300 focus-visible:ring-amber-500 rounded-full"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <MobileOptimizedCard className="p-6 text-center group cursor-pointer">
            <div className="bg-white/10 group-hover:bg-white/20 transition-colors h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">Products</h3>
            <p className="text-sm text-purple-300 mt-1">Questions about our cheats and features</p>
          </MobileOptimizedCard>

          <MobileOptimizedCard className="p-6 text-center group cursor-pointer">
            <div className="bg-white/10 group-hover:bg-white/20 transition-colors h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <LayoutDashboard className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">Account</h3>
            <p className="text-sm text-purple-300 mt-1">Account management and settings</p>
          </MobileOptimizedCard>

          <MobileOptimizedCard className="p-6 text-center group cursor-pointer">
            <div className="bg-white/10 group-hover:bg-white/20 transition-colors h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">Support</h3>
            <p className="text-sm text-purple-300 mt-1">Technical support and troubleshooting</p>
          </MobileOptimizedCard>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8 mb-12">
          {/* Product Questions */}
          <MobileOptimizedCard className="overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">Product Questions</h2>
            </div>
            <div className="divide-y divide-white/20">
              {/* FAQ Item 1 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    How do I install the cheats?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p className="mb-3">
                    After purchasing, you'll receive an email with download instructions. Follow these steps:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Download the installer from your dashboard</li>
                    <li>Disable your antivirus temporarily (our software may trigger false positives)</li>
                    <li>Run the installer as administrator</li>
                    <li>Follow the on-screen instructions</li>
                    <li>Launch the game after installation is complete</li>
                  </ol>
                  <p className="mt-3">
                    For detailed instructions, please check the installation guide in your dashboard.
                  </p>
                </div>
              </details>

              {/* FAQ Item 2 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    Are your cheats undetected?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p>
                    Yes, our cheats are designed to be undetected by anti-cheat systems. We continuously update our
                    products to stay ahead of detection methods. However, no cheat can guarantee 100% undetectability
                    forever. We recommend following our safety guidelines and checking the status page regularly for
                    updates on detection risk.
                  </p>
                </div>
              </details>

              {/* FAQ Item 3 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    What features are included in your cheats?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p className="mb-3">
                    Our cheats include a variety of features depending on the game. Common features include:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Aimbot with customizable settings (smoothness, FOV, etc.)</li>
                    <li>ESP/Wallhack (see enemies through walls)</li>
                    <li>Radar hacks</li>
                    <li>No recoil</li>
                    <li>Rapid fire</li>
                    <li>HWID spoofer (for additional security)</li>
                  </ul>
                  <p className="mt-3">
                    For a complete list of features for a specific game, please check the product page.
                  </p>
                </div>
              </details>

              {/* FAQ Item 4 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    How often are your cheats updated?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p>
                    We update our cheats regularly to ensure compatibility with the latest game versions and to improve
                    security. Most products receive updates at least once a week, with critical updates being deployed
                    as needed. You can check the status page for information about recent and upcoming updates.
                  </p>
                </div>
              </details>
            </div>
          </MobileOptimizedCard>

          {/* Account Questions */}
          <MobileOptimizedCard className="overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">Account Questions</h2>
            </div>
            <div className="divide-y divide-white/20">
              {/* FAQ Item 1 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    How do I reset my password?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p>
                    To reset your password, click on the "Forgot Password" link on the sign-in page. Enter your email
                    address, and we'll send you a password reset link. Follow the instructions in the email to create a
                    new password. If you don't receive the email, please check your spam folder or contact support.
                  </p>
                </div>
              </details>

              {/* FAQ Item 2 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    Can I use my license on multiple computers?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p>
                    No, each license is tied to a single computer's hardware ID (HWID). If you need to use the cheat on
                    a different computer, you'll need to reset your HWID in your dashboard. You can reset your HWID once
                    every 24 hours. If you need more frequent resets, please contact support.
                  </p>
                </div>
              </details>

              {/* FAQ Item 3 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    How long are licenses valid for?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p>
                    We offer different subscription periods for our products, typically 1 day, 7 days, 30 days, and
                    lifetime options. The validity period begins from the moment of purchase. You can check your license
                    expiration date in your dashboard. We also send email reminders before your subscription expires.
                  </p>
                </div>
              </details>
            </div>
          </MobileOptimizedCard>

          {/* Payment Questions */}
          <MobileOptimizedCard className="overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">Payment Questions</h2>
            </div>
            <div className="divide-y divide-white/20">
              {/* FAQ Item 1 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    What payment methods do you accept?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p className="mb-3">We accept the following payment methods:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Credit/Debit Cards (Visa, Mastercard, American Express)</li>
                    <li>PayPal</li>
                    <li>Cryptocurrency (Bitcoin, Ethereum, and others)</li>
                    <li>Bank Transfer (for select countries)</li>
                  </ul>
                  <p className="mt-3">
                    All transactions are processed securely, and we do not store your payment information.
                  </p>
                </div>
              </details>

              {/* FAQ Item 2 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    Do you offer refunds?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p>
                    Due to the digital nature of our products, we generally do not offer refunds once the product has
                    been delivered. However, if you encounter technical issues that our support team cannot resolve, we
                    may offer a refund or replacement at our discretion. Please contact support within 24 hours of
                    purchase if you experience any issues.
                  </p>
                </div>
              </details>

              {/* FAQ Item 3 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    Is my payment information secure?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p>
                    Yes, we take security seriously. We use industry-standard encryption and secure payment processors.
                    We do not store your full credit card information on our servers. All transactions are processed
                    through secure, PCI-compliant payment gateways. For additional privacy, we recommend using
                    cryptocurrency payments.
                  </p>
                </div>
              </details>
            </div>
          </MobileOptimizedCard>

          {/* Technical Questions */}
          <MobileOptimizedCard className="overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">Technical Questions</h2>
            </div>
            <div className="divide-y divide-white/20">
              {/* FAQ Item 1 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    My antivirus flags your software. Is it safe?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p>
                    Yes, our software is safe to use. Antivirus programs often flag cheat software as potentially
                    unwanted programs (PUPs) because they modify game memory. This is a false positive. To install our
                    software, you'll need to temporarily disable your antivirus or add an exception. After installation,
                    you can re-enable your antivirus.
                  </p>
                </div>
              </details>

              {/* FAQ Item 2 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    The cheat isn't working after a game update. What should I do?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p>
                    When games update, our cheats may need to be updated as well. Check our status page to see if we're
                    aware of the issue and working on an update. If the status page shows the cheat is online but it's
                    still not working for you, try reinstalling the cheat. If the problem persists, please contact our
                    support team.
                  </p>
                </div>
              </details>

              {/* FAQ Item 3 */}
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                    How do I configure the cheat settings?
                  </h3>
                  <div className="ml-2 flex-shrink-0 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300 group-open:text-amber-400" />
                    <Minus className="h-5 w-5 text-purple-300 group-open:text-amber-400 hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-purple-300">
                  <p className="mb-3">
                    Each cheat has its own configuration menu that can be accessed in-game. The default key to open the
                    menu is INSERT, but this can be changed in the settings. In the menu, you can:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Adjust aimbot settings (smoothness, FOV, target bone)</li>
                    <li>Configure ESP options (boxes, health bars, distance)</li>
                    <li>Change keybinds</li>
                    <li>Save and load profiles</li>
                  </ul>
                  <p className="mt-3">For detailed instructions, please refer to the user manual in your dashboard.</p>
                </div>
              </details>
            </div>
          </MobileOptimizedCard>
        </div>

        {/* Still Need Help Section */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-lg p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-purple-100 mb-6">
              If you couldn't find the answer to your question, our support team is ready to help you. Join our Discord
              for real-time assistance or contact us through our support page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white rounded-full px-8 py-3 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-amber-500/25"
              >
                <Link href="https://discord.gg/CN8XS9Eb" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-purple-700/30">
                <Link href="/support">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

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
                {/* Add other social icons here if needed, similar structure */}
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
