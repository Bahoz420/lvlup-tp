import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function OrdersLoading() {
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
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex flex-col items-start md:items-end">
                <Skeleton className="h-5 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-100 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex flex-col items-start md:items-end">
                <Skeleton className="h-5 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-100 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex flex-col items-start md:items-end">
                <Skeleton className="h-5 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
