"use client"

import { useEffect, useState } from "react"
import { getDiscountCodeStatsAction } from "@/app/admin/discount-codes/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatPrice } from "@/utils/price-formatter"
import type { DiscountCodeStats } from "@/types/discount"

interface DiscountCodeStatsProps {
  codeId: string
  codeName: string
}

export function DiscountCodeStatsComponent({ codeId, codeName }: DiscountCodeStatsProps) {
  const [stats, setStats] = useState<DiscountCodeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const result = await getDiscountCodeStatsAction(codeId)

        if (result.success && result.data) {
          setStats(result.data)
        } else {
          setError(result.error || "Fehler beim Laden der Statistiken")
        }
      } catch (err) {
        console.error("Error fetching discount code stats:", err)
        setError("Ein unerwarteter Fehler ist aufgetreten")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [codeId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiken für {codeName}</CardTitle>
          <CardDescription>Lade Nutzungsstatistiken...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
            </div>
            <Skeleton className="h-[200px] rounded-md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiken für {codeName}</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Die Statistiken konnten nicht geladen werden. Bitte versuchen Sie es später erneut.</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiken für {codeName}</CardTitle>
          <CardDescription>Keine Daten verfügbar</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Für diesen Rabattcode sind noch keine Statistiken verfügbar.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiken für {codeName}</CardTitle>
        <CardDescription>Nutzungsstatistiken und Auswirkungen des Rabattcodes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Gesamtnutzungen</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">{stats.total_uses}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Gesamtrabatt</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">{formatPrice(stats.total_discount_amount)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Durchschnittlicher Rabatt</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">{formatPrice(stats.average_discount)}</p>
              </CardContent>
            </Card>
          </div>

          {stats.most_used_with_product && (
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Am häufigsten mit Produkt</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="font-medium">{stats.most_used_with_product.product_name}</p>
                <p className="text-sm text-muted-foreground">{stats.most_used_with_product.count} Verwendungen</p>
              </CardContent>
            </Card>
          )}

          {stats.usage_by_date.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Nutzungsverlauf</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.usage_by_date} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-45} textAnchor="end" tick={{ fontSize: 12 }} height={60} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "count") return [`${value} Verwendungen`, "Anzahl"]
                        if (name === "amount") return [formatPrice(value as number), "Rabattbetrag"]
                        return [value, name]
                      }}
                    />
                    <Bar yAxisId="left" dataKey="count" name="count" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="amount" name="amount" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
