import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-full max-w-3xl mb-2" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <div className="mb-10 max-w-2xl mx-auto">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>

      <div className="space-y-8 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden">
            <Skeleton className="h-16 w-full mb-4" />
            {[...Array(3)].map((_, j) => (
              <Skeleton key={j} className="h-20 w-full mb-2" />
            ))}
          </div>
        ))}
      </div>

      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  )
}
