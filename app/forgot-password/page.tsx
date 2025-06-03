import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="lvlup Logo" width={200} height={50} className="h-16 w-auto" />
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-purple-800 mb-2 text-center">Reset Your Password</h1>
        <p className="text-purple-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border-purple-200 focus:ring-purple-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
          >
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-purple-600">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-purple-800 hover:text-purple-900">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
