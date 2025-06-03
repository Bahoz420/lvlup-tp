export function ProductsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-purple-800/50 to-indigo-900/50"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>

      <div className="container py-8 relative z-10">
        {/* Breadcrumb skeleton */}
        <div className="mb-6">
          <div className="h-8 w-32 bg-white/10 rounded-full animate-pulse"></div>
        </div>

        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="h-16 w-96 bg-gradient-to-r from-white/20 to-white/10 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400/50 to-purple-400/50 mx-auto mb-6 rounded-full"></div>
          <div className="h-6 w-3/4 bg-white/10 rounded mx-auto animate-pulse"></div>
        </div>

        {/* Search and controls skeleton */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-12 bg-white/10 rounded-xl animate-pulse"></div>
            <div className="flex gap-3">
              <div className="w-20 h-12 bg-white/10 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Layout skeleton */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-6">
              <div className="h-6 w-24 bg-white/20 rounded animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-4 w-32 bg-white/15 rounded animate-pulse"></div>
                <div className="h-3 w-full bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-white/15 rounded animate-pulse"></div>
                <div className="h-3 w-full bg-white/10 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-white/10 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Products grid skeleton */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="h-8 w-48 bg-white/10 rounded-full animate-pulse"></div>
            </div>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                  {/* Image skeleton */}
                  <div className="aspect-video bg-white/10 animate-pulse"></div>

                  {/* Content skeleton */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="h-6 w-32 bg-white/15 rounded animate-pulse"></div>
                      <div className="h-6 w-16 bg-green-500/20 rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="h-4 w-4 bg-amber-400/30 rounded animate-pulse"></div>
                      ))}
                      <div className="h-4 w-16 bg-white/10 rounded animate-pulse ml-2"></div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse"></div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse"></div>
                      <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="h-8 w-20 bg-amber-400/30 rounded animate-pulse"></div>
                      <div className="h-10 w-24 bg-amber-400/20 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
