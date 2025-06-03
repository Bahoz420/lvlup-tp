import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header Skeleton */}
      <header className="border-b border-purple-900/40 bg-black/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32 bg-gray-800" />
          <div className="hidden md:flex items-center space-x-8">
            <Skeleton className="h-4 w-20 bg-gray-800" />
            <Skeleton className="h-4 w-20 bg-gray-800" />
            <Skeleton className="h-4 w-20 bg-gray-800" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-20 bg-gray-800" />
            <Skeleton className="h-10 w-24 bg-gray-800" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Skeleton className="h-4 w-32 bg-gray-800 mb-4" />
          <Skeleton className="h-10 w-64 bg-gray-800 mb-2" />
          <Skeleton className="h-4 w-80 bg-gray-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discord Support Card Skeleton */}
          <div className="col-span-1 lg:col-span-2 bg-gray-900 border border-purple-900/50 rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-6 w-6 bg-gray-800 mr-3 rounded-full" />
                    <Skeleton className="h-8 w-48 bg-gray-800" />
                  </div>
                  <Skeleton className="h-4 w-full bg-gray-800 mb-2" />
                  <Skeleton className="h-4 w-5/6 bg-gray-800 mb-6" />

                  <div className="space-y-4 mb-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start">
                        <Skeleton className="h-8 w-8 bg-gray-800 rounded-full" />
                        <div className="ml-4 flex-1">
                          <Skeleton className="h-5 w-32 bg-gray-800 mb-1" />
                          <Skeleton className="h-4 w-48 bg-gray-800" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-10 w-32 bg-gray-800" />
                    <Skeleton className="h-10 w-40 bg-gray-800" />
                  </div>
                </div>

                <div className="hidden md:block">
                  <Skeleton className="h-48 w-48 bg-gray-800 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Card Skeleton */}
          <div className="bg-gray-900 border border-purple-900/50 rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-4">
                <Skeleton className="h-6 w-6 bg-gray-800 mr-3 rounded-full" />
                <Skeleton className="h-8 w-32 bg-gray-800" />
              </div>

              <div className="space-y-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Skeleton className="h-5 w-40 bg-gray-800 mb-1" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-10 w-full bg-gray-800" />
            </div>
          </div>
        </div>

        {/* Contact Options Skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-64 bg-gray-800 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 border border-purple-900/50 p-6 rounded-lg">
                <Skeleton className="h-12 w-12 bg-gray-800 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 bg-gray-800 mb-2" />
                <Skeleton className="h-4 w-full bg-gray-800 mb-1" />
                <Skeleton className="h-4 w-5/6 bg-gray-800 mb-4" />
                <Skeleton className="h-10 w-full bg-gray-800" />
              </div>
            ))}
          </div>
        </div>

        {/* Special Discount Banner Skeleton */}
        <div className="mt-12 bg-gray-900 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 bg-gray-800 mb-2" />
              <Skeleton className="h-5 w-64 bg-gray-800" />
            </div>
            <Skeleton className="h-10 w-32 bg-gray-800 mt-4 md:mt-0" />
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="bg-black/60 border-t border-purple-900/40 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Skeleton className="h-8 w-32 bg-gray-800" />
              <Skeleton className="h-4 w-48 bg-gray-800 mt-2" />
            </div>

            <div className="flex space-x-6">
              <Skeleton className="h-4 w-16 bg-gray-800" />
              <Skeleton className="h-4 w-16 bg-gray-800" />
              <Skeleton className="h-4 w-16 bg-gray-800" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
