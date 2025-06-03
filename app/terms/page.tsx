import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navigation />

      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-purple-600">
          <Link href="/" className="hover:text-purple-800">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-purple-800">Terms of Service</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-8">
            <Image src="/logo.png" alt="lvlup Logo" width={150} height={40} className="h-12 w-auto" />
            <h1 className="text-3xl font-bold text-purple-800 ml-4">Terms of Service</h1>
          </div>

          <div className="prose prose-purple max-w-none">
            <p>Last updated: May 15, 2025</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the lvlup website and services, you agree to be bound by these Terms of Service. If
              you do not agree to all the terms and conditions, you must not access or use our services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              lvlup provides gaming enhancement software and tools designed to improve gaming performance and
              experience. Our services are intended for educational and entertainment purposes only.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of our service, you may be required to register for an account. You are
              responsible for maintaining the confidentiality of your account information and for all activities that
              occur under your account.
            </p>

            <h2>4. User Conduct</h2>
            <p>
              You agree not to use our services for any purpose that is unlawful or prohibited by these Terms. You may
              not use our services in any manner that could damage, disable, overburden, or impair our servers or
              networks.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of our services, including but not limited to text, graphics,
              logos, icons, images, audio clips, digital downloads, and software, are the exclusive property of lvlup
              and are protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h2>6. Payment Terms</h2>
            <p>
              Certain services offered by lvlup may require payment. By purchasing our services, you agree to pay all
              fees and charges associated with your account on a timely basis. All payments are non-refundable unless
              otherwise specified in our Refund Policy.
            </p>

            <h2>7. Disclaimer of Warranties</h2>
            <p>
              Our services are provided "as is" and "as available" without any warranties of any kind, either express or
              implied, including but not limited to the implied warranties of merchantability, fitness for a particular
              purpose, or non-infringement.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall lvlup be liable for any indirect, incidental, special, consequential, or punitive
              damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
              resulting from your access to or use of or inability to access or use our services.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of [Jurisdiction], without regard
              to its conflict of law provisions.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. It is your responsibility to review
              these Terms periodically for changes. Your continued use of our services following the posting of any
              changes constitutes acceptance of those changes.
            </p>

            <h2>11. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at support@lvlup.com.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
