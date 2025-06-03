import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100 p-4">
      <div className="text-center max-w-md">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <Image src="/logo.png" alt="lvlup Logo" fill className="object-contain" />
        </div>
        <h1 className="text-4xl font-bold text-purple-800 mb-4">404 - Page Not Found</h1>
        <p className="text-purple-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Button
          asChild
          className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
        >
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
