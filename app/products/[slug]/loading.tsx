import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailLoading() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="aspect-video w-full rounded-lg" />

          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>

          <div className="space-y-4 rounded-lg p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <Skeleton className="h-6 w-32 mt-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24 ml-2" />
            </div>

            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />

            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            <Skeleton className="h-px w-full mb-6" />

            <Skeleton className="h-6 w-40 mb-6" />

            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="flex items-center mb-2">
                  <Skeleton className="h-4 w-4 rounded-full mr-1" />
                  <Skeleton className="h-4 w-4 rounded-full mr-1" />
                  <Skeleton className="h-4 w-4 rounded-full mr-1" />
                  <Skeleton className="h-4 w-4 rounded-full mr-1" />
                  <Skeleton className="h-4 w-4 rounded-full mr-1" />
                  <Skeleton className="h-4 w-16 ml-2" />
                </div>
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-28 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
