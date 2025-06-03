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
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 flex flex-col items-center justify-center text-center">
            <Skeleton className="mb-6 h-20 w-20 rounded-full" />
            <Skeleton className="mb-4 h-12 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Skeleton className="mt-1 h-2 w-2 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="mb-4 h-16 w-full" />
              <Skeleton className="h-10 w-full rounded-md" />
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
