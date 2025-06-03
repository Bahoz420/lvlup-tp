import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Skeleton className="h-10 w-32" />
            <div className="hidden md:flex items-center gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 flex flex-col items-center justify-center text-center">
            <Skeleton className="mb-6 h-20 w-20 rounded-full" />
            <Skeleton className="mb-4 h-12 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
          </div>

          {/* Order Summary Skeleton */}
          <div className="mb-8 rounded-xl border border-purple-100 bg-white p-6 shadow-md">
            <Skeleton className="mb-4 h-8 w-48" />
            <div className="mb-6 flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="mb-4">
                      <Skeleton className="mb-1 h-4 w-24" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  ))}
              </div>
              <div className="flex-1">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="mb-4">
                      <Skeleton className="mb-1 h-4 w-24" />
                      <Skeleton className="h-5 w-48" />
                    </div>
                  ))}
              </div>
            </div>
            <div className="border-t border-purple-100 pt-4">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          {/* Download and Access Skeleton */}
          <div className="mb-8 rounded-xl border border-purple-100 bg-white p-6 shadow-md">
            <Skeleton className="mb-4 h-8 w-64" />
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-purple-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="mb-4 h-16 w-full" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="mb-4 h-16 w-full" />
                <Skeleton className="mb-4 h-8 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="ml-6 space-y-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
              </div>
            </div>
          </div>

          {/* Additional Resources Skeleton */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-xl border border-purple-100 bg-white p-5 shadow-md">
                  <Skeleton className="mb-3 h-10 w-10 rounded-full" />
                  <Skeleton className="mb-2 h-6 w-32" />
                  <Skeleton className="mb-3 h-16 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
          </div>

          {/* Related Products Skeleton */}
          <div className="mb-8">
            <Skeleton className="mb-6 h-8 w-48" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-lg border border-purple-100 bg-white shadow-md"
                  >
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4">
                      <Skeleton className="mb-1 h-6 w-32" />
                      <Skeleton className="mb-3 h-4 w-full" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-24 rounded-md" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>
      </main>

      <footer className="mt-12 bg-purple-900 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="mb-4 h-8 w-32 bg-purple-800" />
                  <div className="space-y-2">
                    {Array(i === 0 ? 1 : 6)
                      .fill(0)
                      .map((_, j) => (
                        <Skeleton key={j} className="h-4 w-24 bg-purple-800" />
                      ))}
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-8 border-t border-purple-800 pt-8 text-center">
            <Skeleton className="mx-auto h-4 w-48 bg-purple-800" />
          </div>
        </div>
      </footer>
    </div>
  )
}
