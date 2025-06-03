import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-6">
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-purple-100 overflow-hidden">
            <Skeleton className="h-32 w-full" />
            <div className="p-3">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-3 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-1">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-100 overflow-hidden">
            <Skeleton className="h-32 w-full" />
            <div className="p-3">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-3 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-1">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
