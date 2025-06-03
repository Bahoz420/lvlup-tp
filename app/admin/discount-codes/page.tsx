export const dynamic = "force_dynamic"

// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs" // OLD
// import { cookies } from "next/headers" // OLD, createClient from utils/supabase/server handles cookies
import { createClient } from "@/utils/supabase/server" // NEW
import { DiscountCodeList } from "@/components/admin/discount-code-list"
import type { DiscountCode } from "@/types/discount"
import { requireAdminAuth } from "@/lib/auth-supabase"

export default async function DiscountCodesPage() {
  await requireAdminAuth() // Ensure admin access
  const supabase = createClient() // Use the standardized server client

  // Alle Rabattcodes abrufen
  const { data: discountCodes, error } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching discount codes:", error)
    // Optionally, render an error state or throw the error
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rabattcode-Verwaltung</h1>
        <p className="text-muted-foreground mt-2">Erstellen und verwalten Sie Rabattcodes für Ihre Kunden</p>
      </div>

      <DiscountCodeList discountCodes={discountCodes as DiscountCode[] | null} />
    </div>
  )
}
