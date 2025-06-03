import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DownloadsLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border border-purple-100 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-3 w-32 mb-2" />
                <Skeleton className="h-3 w-56" />
              </div>
              <div>
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-100 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-3 w-32 mb-2" />
                <Skeleton className="h-3 w-56" />
              </div>
              <div>
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-100 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-3 w-32 mb-2" />
                <Skeleton className="h-3 w-56" />
              </div>
              <div>
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
