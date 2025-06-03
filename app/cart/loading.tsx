import { Skeleton } from "@/components/ui/skeleton"
import { Navigation } from "@/components/navigation"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navigation />
      <main className="container py-12">
        <Skeleton className="h-10 w-48 mb-8" />

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <Skeleton className="h-16 w-16 rounded-full mb-4" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-md mb-2" />
            <Skeleton className="h-4 w-full max-w-md mb-8" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </main>
    </div>
  )
}
