import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navigation />

      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-purple-600">
          <Link href="/" className="hover:text-purple-800">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-purple-800">Refund Policy</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-8">
            <Image src="/logo.png" alt="lvlup Logo" width={150} height={40} className="h-12 w-auto" />
            <h1 className="text-3xl font-bold text-purple-800 ml-4">Refund Policy</h1>
          </div>

          <div className="prose prose-purple max-w-none">
            <p>Last updated: May 15, 2025</p>

            <h2>1. Overview</h2>
            <p>
              This Refund Policy outlines the terms and conditions for refunds on products and services purchased from
              lvlup. By purchasing our products or services, you agree to the terms of this policy.
            </p>

            <h2>2. Digital Products</h2>
            <p>
              Due to the nature of digital products, all sales are generally final. However, we offer a 24-hour
              money-back guarantee under the following conditions:
            </p>
            <ul>
              <li>The product does not function as described</li>
              <li>You experience technical issues that our support team cannot resolve</li>
              <li>The product is incompatible with your system despite meeting the stated requirements</li>
            </ul>

            <h2>3. Subscription Services</h2>
            <p>For subscription-based services:</p>
            <ul>
              <li>You may cancel your subscription at any time</li>
              <li>No refunds will be issued for partial subscription periods</li>
              <li>
                If you cancel before the end of your current billing cycle, you will retain access to the service until
                the end of that period
              </li>
            </ul>

            <h2>4. Refund Process</h2>
            <p>To request a refund:</p>
            <ol>
              <li>Contact our support team at support@lvlup.com within 24 hours of purchase</li>
              <li>Provide your order number and reason for the refund request</li>
              <li>Our team will review your request and respond within 48 hours</li>
              <li>If approved, refunds will be processed to the original payment method</li>
            </ol>

            <h2>5. Refund Timeframe</h2>
            <p>Once approved, refunds typically process as follows:</p>
            <ul>
              <li>Credit/debit card payments: 5-10 business days</li>
              <li>PayPal: 3-5 business days</li>
              <li>Cryptocurrency: 1-3 business days (subject to blockchain confirmation times)</li>
            </ul>

            <h2>6. Exceptions</h2>
            <p>We reserve the right to deny refund requests in the following cases:</p>
            <ul>
              <li>The refund request is made after the 24-hour guarantee period</li>
              <li>There is evidence of fraud or abuse</li>
              <li>The product has been used extensively</li>
              <li>The product has been shared with others or distributed</li>
            </ul>

            <h2>7. Chargebacks</h2>
            <p>
              If you file a chargeback with your payment provider instead of contacting us for a refund, your account
              may be suspended and you may be banned from future purchases.
            </p>

            <h2>8. Changes to Refund Policy</h2>
            <p>
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon
              posting on our website.
            </p>

            <h2>9. Contact Information</h2>
            <p>If you have any questions about this Refund Policy, please contact us at support@lvlup.com.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
