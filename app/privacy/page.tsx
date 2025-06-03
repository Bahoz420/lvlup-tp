import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navigation />

      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-purple-600">
          <Link href="/" className="hover:text-purple-800">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-purple-800">Privacy Policy</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-8">
            <Image src="/logo.png" alt="lvlup Logo" width={150} height={40} className="h-12 w-auto" />
            <h1 className="text-3xl font-bold text-purple-800 ml-4">Privacy Policy</h1>
          </div>

          <div className="prose prose-purple max-w-none">
            <p>Last updated: May 15, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              At lvlup, we respect your privacy and are committed to protecting your personal data. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our website and
              services.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We may collect several types of information from and about users of our website, including:</p>
            <ul>
              <li>Personal identifiers such as name, email address, and payment information</li>
              <li>Usage data such as IP address, browser type, operating system, and pages visited</li>
              <li>Device information such as hardware model, operating system, and unique device identifiers</li>
            </ul>

            <h2>3. How We Collect Information</h2>
            <p>We collect information directly from you when you:</p>
            <ul>
              <li>Register for an account</li>
              <li>Purchase our products or services</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact our support team</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p>
              We also collect information automatically through cookies and similar technologies when you use our
              website.
            </p>

            <h2>4. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including:</p>
            <ul>
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and sending related information</li>
              <li>Responding to your inquiries and providing customer support</li>
              <li>Sending promotional communications</li>
              <li>Improving our website and services</li>
              <li>Protecting our rights and preventing fraud</li>
            </ul>

            <h2>5. Disclosure of Your Information</h2>
            <p>We may disclose your personal information to:</p>
            <ul>
              <li>Service providers who perform services on our behalf</li>
              <li>Business partners with whom we jointly offer products or services</li>
              <li>Law enforcement or government agencies when required by law</li>
              <li>Potential buyers in the event of a merger, acquisition, or sale of assets</li>
            </ul>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access,
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate or incomplete information</li>
              <li>The right to delete your personal information</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to data portability</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for children under the age of 16, and we do not knowingly collect personal
              information from children under 16. If we learn that we have collected personal information from a child
              under 16, we will take steps to delete such information.
            </p>

            <h2>9. Changes to Our Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>10. Contact Information</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@lvlup.com.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
