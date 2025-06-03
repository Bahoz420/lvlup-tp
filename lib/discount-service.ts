// import { getSupabaseServerClient } from "./supabase" // OLD and problematic
import { createClient } from "@/utils/supabase/server" // NEW: Use the standardized server client
import { db } from "@/lib/supabase-database"
import type {
  DiscountCode,
  DiscountCodeCreateInput,
  DiscountCodeUpdateInput,
  DiscountCodeUsageCreateInput,
  DiscountValidationResult,
  DiscountCodeStats,
  DiscountCodeFilter,
  BulkActionResult,
  DiscountCodeUsage, // Declare the DiscountCodeUsage variable
} from "@/types/database" // Assuming types/database.ts now reflects the user's schema
import { logger } from "./logger"
import { generateRandomCode } from "@/lib/utils"

/**
 * Validates a discount code against the user's database schema.
 */
export async function validateDiscountCode(
  code: string,
  orderAmount: number,
  // customerEmail?: string, // Not used for validation directly against discount_codes table structure provided
  // productIds?: string[], // Product-specific scope not supported by current user's discount_codes schema
): Promise<DiscountValidationResult> {
  if (!code) {
    return { valid: false, message: "Discount code cannot be empty." }
  }
  if (orderAmount < 0) {
    return { valid: false, message: "Order amount cannot be negative." }
  }

  const { data: discountCode, error: dbError } = await db.getDiscountCodeByCodeRaw(code.toUpperCase())

  if (dbError) {
    logger.error(`Error fetching discount code "${code}" from DB:`, dbError)
    return { valid: false, error: "Error validating discount code." }
  }

  if (!discountCode) {
    return { valid: false, message: `Discount code "${code}" not found.` }
  }

  if (!discountCode.is_active) {
    return { valid: false, message: `Discount code "${code}" is not active.`, discountCode }
  }

  if (discountCode.expires_at && new Date(discountCode.expires_at) < new Date()) {
    return { valid: false, message: `Discount code "${code}" has expired.`, discountCode }
  }

  if (discountCode.maximum_uses !== null && discountCode.current_uses >= discountCode.maximum_uses) {
    return { valid: false, message: `Discount code "${code}" has reached its maximum usage limit.`, discountCode }
  }

  if (discountCode.minimum_amount !== null && orderAmount < discountCode.minimum_amount) {
    return {
      valid: false,
      message: `Order subtotal does not meet the minimum purchase amount of ${discountCode.minimum_amount} for code "${code}".`,
      discountCode,
    }
  }

  // Calculate discount
  let calculatedDiscountAmount = 0
  if (discountCode.discount_type === "percentage") {
    calculatedDiscountAmount = (orderAmount * discountCode.discount_value) / 100
  } else if (discountCode.discount_type === "fixed_amount") {
    calculatedDiscountAmount = discountCode.discount_value
  } else {
    // Unknown discount type in DB, treat as invalid or handle as per business logic
    logger.warn(`Unknown discount type "${discountCode.discount_type}" for code "${code}".`)
    return { valid: false, message: `Invalid discount type for code "${code}".`, discountCode }
  }

  // Ensure discount doesn't exceed order amount
  calculatedDiscountAmount = Math.min(calculatedDiscountAmount, orderAmount)
  // Ensure discount is not negative
  calculatedDiscountAmount = Math.max(0, calculatedDiscountAmount)

  return {
    valid: true,
    message: `Discount code "${code}" applied successfully.`,
    discountCode,
    discountAmount: calculatedDiscountAmount,
  }
}

/**
 * Increments the usage count of a discount code and records its usage.
 * Adapts to the user's discount_code_usages table structure.
 */
export async function incrementDiscountCodeUsage(
  discountCodeId: string,
  orderId: string,
  discountedAmount: number, // The actual amount discounted by this code for this order
  customerEmail?: string | null,
): Promise<{ success: boolean; error?: string }> {
  if (!discountCodeId) {
    return { success: false, error: "Discount code ID is required." }
  }

  // Step 1: Increment current_uses in discount_codes table
  const { data: updatedCode, error: incrementError } = await db.incrementDiscountCodeUsage(discountCodeId)

  if (incrementError || !updatedCode) {
    logger.error(`Failed to increment usage for discount code ID ${discountCodeId}:`, incrementError)
    return { success: false, error: "Failed to update discount code usage count." }
  }

  // Step 2: Record the usage in discount_code_usages table
  const usageData: DiscountCodeUsageCreateInput = {
    discount_code_id: discountCodeId,
    order_id: orderId,
    customer_email: customerEmail,
    amount: discountedAmount, // Store the actual discounted amount
  }

  const { error: recordUsageError } = await db.recordDiscountCodeUsage(usageData)

  if (recordUsageError) {
    logger.error(`Failed to record usage for discount code ID ${discountCodeId} in order ${orderId}:`, recordUsageError)
    // Potentially needs a compensating transaction to decrement current_uses if this fails,
    // but for now, we'll log and report failure.
    return { success: false, error: "Failed to record discount code usage details." }
  }

  return { success: true }
}

/**
 * Holt Rabattcodes mit Filteroptionen
 */
export async function getDiscountCodes(filters?: DiscountCodeFilter) {
  try {
    const supabase = createClient() // UPDATED
    let query = supabase.from("discount_codes").select("*", { count: "exact" })

    if (filters) {
      if (filters.status) {
        const now = new Date().toISOString()
        switch (filters.status) {
          case "active":
            query = query
              .eq("is_active", true)
              .or(`expires_at.is.null,expires_at.gt.${now}`)
              .or(`starts_at.is.null,starts_at.lte.${now}`)
            break
          case "inactive":
            query = query.eq("is_active", false)
            break
          case "scheduled":
            query = query.eq("is_active", true).gt("starts_at", now)
            break
          case "expired":
            query = query.eq("is_active", true).lt("expires_at", now)
            break
          case "used_up":
            // This requires a way to compare current_uses with max_uses column directly
            // Using a raw filter or ensuring max_uses is not null for this condition
            query = query.eq("is_active", true).not("maximum_uses", "is", null).raw(`current_uses >= maximum_uses`) // Or .gte('current_uses', supabase.raw('max_uses')) if supported
            break
        }
      }
      if (filters.scope) query = query.eq("scope", filters.scope)
      if (filters.search) query = query.or(`code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      if (filters.startDate) query = query.gte("created_at", filters.startDate)
      if (filters.endDate) query = query.lte("created_at", filters.endDate)
      if (filters.minUses !== undefined) query = query.gte("current_uses", filters.minUses)
      if (filters.maxUses !== undefined) query = query.lte("current_uses", filters.maxUses)

      if (filters.sortBy) {
        query = query.order(filters.sortBy, { ascending: filters.sortDirection === "asc" })
      } else {
        query = query.order("created_at", { ascending: false })
      }

      if (filters.page !== undefined && filters.limit !== undefined) {
        const from = filters.page * filters.limit
        const to = from + filters.limit - 1
        query = query.range(from, to)
      }
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const { data, error, count } = await query
    if (error) {
      console.error("Error fetching discount codes:", error)
      return { success: false, error: "Fehler beim Abrufen der Rabattcodes: " + error.message }
    }
    return {
      success: true,
      data: data as DiscountCode[],
      count,
      pagination:
        filters && filters.page !== undefined && filters.limit !== undefined
          ? { page: filters.page, limit: filters.limit, total: count || 0 }
          : undefined,
    }
  } catch (error: any) {
    console.error("Unexpected error fetching discount codes:", error)
    return { success: false, error: "Unerwarteter Fehler beim Abrufen der Rabattcodes: " + error.message }
  }
}

/**
 * Holt einen einzelnen Rabattcode anhand seiner ID
 */
export async function getDiscountCodeById(id: string) {
  try {
    const supabase = createClient() // UPDATED
    const { data, error } = await supabase.from("discount_codes").select("*").eq("id", id).single()
    if (error) {
      console.error("Error fetching discount code by ID:", error)
      return { success: false, error: "Fehler beim Abrufen des Rabattcodes: " + error.message }
    }
    return { success: true, data: data as DiscountCode }
  } catch (error: any) {
    console.error("Unexpected error fetching discount code by ID:", error)
    return { success: false, error: "Unerwarteter Fehler beim Abrufen des Rabattcodes: " + error.message }
  }
}

/**
 * Holt die Nutzungsstatistiken für einen Rabattcode
 */
export async function getDiscountCodeStats(
  codeId: string, // Should be discount_code_id (UUID)
): Promise<{ success: boolean; data?: DiscountCodeStats; error?: string }> {
  try {
    const supabase = createClient() // UPDATED

    // Hole alle Nutzungen des Rabattcodes
    // Assuming 'discount_code_usages' has 'discount_code_id', 'amount_discounted', 'product_id', 'created_at'
    const { data: usages, error: usagesError } = await supabase
      .from("discount_code_usages")
      .select("amount, created_at") // Join with products if product_name is needed
      .eq("discount_code_id", codeId)

    if (usagesError) {
      console.error("Error fetching discount code usages:", usagesError)
      return { success: false, error: "Fehler beim Abrufen der Rabattcode-Nutzungen: " + usagesError.message }
    }

    if (!usages || usages.length === 0) {
      return {
        success: true,
        data: { total_uses: 0, total_discount_amount: 0, average_discount: 0, usage_by_date: [] },
      }
    }

    const totalUses = usages.length
    const totalDiscountAmount = usages.reduce((sum, usage) => sum + (usage.amount || 0), 0)
    const averageDiscount = totalUses > 0 ? totalDiscountAmount / totalUses : 0

    const usageByDate: Record<string, { count: number; amount: number }> = {}
    for (const usage of usages) {
      const date = new Date(usage.created_at).toISOString().split("T")[0]
      if (!usageByDate[date]) usageByDate[date] = { count: 0, amount: 0 }
      usageByDate[date].count++
      usageByDate[date].amount += usage.amount || 0
    }
    const usageByDateArray = Object.entries(usageByDate)
      .map(([date, data]) => ({ date, count: data.count, amount: data.amount }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return {
      success: true,
      data: {
        total_uses: totalUses,
        total_discount_amount: totalDiscountAmount,
        average_discount: averageDiscount,
        usage_by_date: usageByDateArray,
      },
    }
  } catch (error: any) {
    console.error("Unexpected error fetching discount code stats:", error)
    return { success: false, error: "Unerwarteter Fehler beim Abrufen der Rabattcode-Statistiken: " + error.message }
  }
}

/**
 * Holt die Nutzungshistorie für einen Rabattcode
 */
export async function getDiscountCodeUsageHistory(
  codeId: string, // Should be discount_code_id (UUID)
  page = 0,
  limit = 10,
): Promise<{ success: boolean; data?: DiscountCodeUsage[]; count?: number; error?: string }> {
  try {
    const supabase = createClient() // UPDATED
    const from = page * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from("discount_code_usages")
      .select("*, users(email), orders(id)", { count: "exact" }) // Example joins
      .eq("discount_code_id", codeId)
      .order("used_at", { ascending: false })
      .range(from, to)

    if (error) {
      console.error("Error fetching discount code usage history:", error)
      return { success: false, error: "Fehler beim Abrufen der Rabattcode-Nutzungshistorie: " + error.message }
    }
    return { success: true, data: data as DiscountCodeUsage[], count }
  } catch (error: any) {
    console.error("Unexpected error fetching discount code usage history:", error)
    return {
      success: false,
      error: "Unerwarteter Fehler beim Abrufen der Rabattcode-Nutzungshistorie: " + error.message,
    }
  }
}

/**
 * Creates a new discount code.
 * Ensure DiscountCodeCreateInput matches the user's discount_codes table.
 */
export async function createDiscountCode(
  input: DiscountCodeCreateInput,
): Promise<{ success: boolean; data?: DiscountCode; error?: string }> {
  const supabase = createClient()
  const codeToInsert = {
    ...input,
    code: input.code.toUpperCase(),
    current_uses: input.current_uses ?? 0,
    is_active: input.is_active ?? true,
    // created_at and updated_at are typically handled by DB defaults/triggers
  }

  const { data, error } = await supabase.from("discount_codes").insert(codeToInsert).select().single()

  if (error) {
    logger.error("Error creating discount code in service:", error)
    if (error.code === "23505") {
      // Unique constraint violation (e.g., code already exists)
      return { success: false, error: `A discount code with the code "${input.code}" already exists.` }
    }
    return { success: false, error: error.message || "Failed to create discount code." }
  }
  return { success: true, data: data as DiscountCode }
}

/**
 * Updates an existing discount code.
 */
export async function updateDiscountCode(
  id: string,
  updates: DiscountCodeUpdateInput,
): Promise<{ success: boolean; data?: DiscountCode; error?: string }> {
  const supabase = createClient()
  const { data, error } = await supabase.from("discount_codes").update(updates).eq("id", id).select().single()

  if (error) {
    logger.error(`Error updating discount code ${id} in service:`, error)
    return { success: false, error: error.message || "Failed to update discount code." }
  }
  return { success: true, data: data as DiscountCode }
}

/**
 * Löscht einen Rabattcode
 */
export async function deleteDiscountCode(id: string) {
  try {
    const supabase = createClient() // UPDATED

    const { count, error: countError } = await supabase
      .from("discount_code_usages")
      .select("*", { count: "exact", head: true })
      .eq("discount_code_id", id)

    if (countError) {
      console.error("Error checking discount code usages:", countError)
      return { success: false, error: "Fehler beim Prüfen der Rabattcode-Nutzungen: " + countError.message }
    }

    if (count && count > 0) {
      const { error: updateError } = await supabase.from("discount_codes").update({ is_active: false }).eq("id", id)
      if (updateError) {
        console.error("Error deactivating discount code:", updateError)
        return { success: false, error: "Fehler beim Deaktivieren des Rabattcodes: " + updateError.message }
      }
      return {
        success: true,
        message: "Der Rabattcode wurde deaktiviert, da er bereits verwendet wurde und nicht gelöscht werden kann.",
      }
    }

    const { error } = await supabase.from("discount_codes").delete().eq("id", id)
    if (error) {
      console.error("Error deleting discount code:", error)
      return { success: false, error: "Fehler beim Löschen des Rabattcodes: " + error.message }
    }
    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error deleting discount code:", error)
    return { success: false, error: "Unerwarteter Fehler beim Löschen des Rabattcodes: " + error.message }
  }
}

/**
 * Führt Massenaktionen für Rabattcodes durch
 */
export async function bulkActionDiscountCodes(
  action: "activate" | "deactivate" | "delete" | "extend",
  ids: string[],
  additionalData?: any,
): Promise<BulkActionResult> {
  // Return type updated in types/discount.ts
  const supabase = createClient() // UPDATED
  let successCount = 0
  let failureCount = 0
  const failedItems: string[] = []
  const messages: string[] = []

  if (!ids || ids.length === 0) {
    return { success: false, message: "Keine IDs angegeben.", successCount: 0, failureCount: 0, failedItems: [] }
  }

  switch (action) {
    case "activate":
    case "deactivate":
      const { error: toggleError, count: toggleCount } = await supabase
        .from("discount_codes")
        .update({ is_active: action === "activate" })
        .in("id", ids)
      if (toggleError) {
        messages.push(`Fehler beim ${action === "activate" ? "Aktivieren" : "Deaktivieren"}: ${toggleError.message}`)
        failureCount = ids.length
      } else {
        successCount = toggleCount || 0
        failureCount = ids.length - successCount
        messages.push(`${successCount} Code(s) ${action === "activate" ? "aktiviert" : "deaktiviert"}.`)
      }
      break

    case "delete":
      for (const id of ids) {
        const deleteResult = await deleteDiscountCode(id) // Uses the single delete logic (checks usage)
        if (deleteResult.success) {
          successCount++
          if (deleteResult.message) messages.push(`Code ${id}: ${deleteResult.message}`)
        } else {
          failureCount++
          failedItems.push(id)
          messages.push(`Fehler beim Löschen von Code ${id}: ${deleteResult.error}`)
        }
      }
      break

    case "extend":
      if (!additionalData || typeof additionalData.days !== "number") {
        return {
          success: false,
          message: "Ungültige Anzahl an Tagen für Verlängerung.",
          successCount: 0,
          failureCount: ids.length,
          failedItems: ids,
        }
      }
      const { data: codesToExtend, error: fetchError } = await supabase
        .from("discount_codes")
        .select("id, expires_at")
        .in("id", ids)

      if (fetchError) {
        return {
          success: false,
          message: `Fehler beim Abrufen der Codes: ${fetchError.message}`,
          successCount: 0,
          failureCount: ids.length,
          failedItems: ids,
        }
      }

      for (const code of codesToExtend) {
        const newExpiryDate = code.expires_at ? new Date(code.expires_at) : new Date()
        newExpiryDate.setDate(newExpiryDate.getDate() + additionalData.days)
        const { error: updateError } = await supabase
          .from("discount_codes")
          .update({ expires_at: newExpiryDate.toISOString() })
          .eq("id", code.id)
        if (updateError) {
          failureCount++
          failedItems.push(code.id)
          messages.push(`Fehler beim Verlängern von Code ${code.id}: ${updateError.message}`)
        } else {
          successCount++
        }
      }
      break
    default:
      return {
        success: false,
        message: "Ungültige Aktion.",
        successCount: 0,
        failureCount: ids.length,
        failedItems: ids,
      }
  }

  const overallSuccess = failureCount === 0
  return {
    success: overallSuccess,
    message: messages.join(" "),
    successCount,
    failureCount,
    failedItems,
  }
}

/**
 * Generiert automatisch Rabattcodes
 */
export async function generateDiscountCodes(
  count: number,
  template: Partial<DiscountCodeCreateInput>, // Use DiscountCodeCreateInput
  prefix?: string,
  length = 8,
): Promise<{ success: boolean; data?: DiscountCode[]; error?: string }> {
  try {
    if (count <= 0 || count > 1000) {
      // Increased limit
      return { success: false, error: "Die Anzahl der zu generierenden Rabattcodes muss zwischen 1 und 1000 liegen" }
    }
    const supabase = createClient() // UPDATED
    const codesToInsert: DiscountCodeCreateInput[] = []
    const generatedCodesSet = new Set<string>()

    for (let i = 0; i < count; i++) {
      let newCode: string
      let attempts = 0
      do {
        newCode = (
          prefix ? `${prefix}${generateRandomCode(length - (prefix?.length || 0))}` : generateRandomCode(length)
        ).toUpperCase()
        attempts++
        if (attempts > 20) {
          // Prevent infinite loop if length/prefix makes uniqueness hard
          return {
            success: false,
            error:
              "Konnte nicht genügend eindeutige Codes generieren. Versuchen Sie es mit einem längeren Code oder weniger Codes.",
          }
        }
      } while (generatedCodesSet.has(newCode))
      generatedCodesSet.add(newCode)

      codesToInsert.push({
        ...template,
        code: newCode,
        current_uses: template.current_uses ?? 0,
        is_active: template.is_active ?? true,
        // created_at will be set by DB
      })
    }

    const { data, error } = await supabase.from("discount_codes").insert(codesToInsert).select()
    if (error) {
      console.error("Error bulk generating discount codes:", error)
      if (error.code === "23505") {
        // Unique constraint violation
        return {
          success: false,
          error: "Einer der generierten Codes existiert bereits. Bitte versuchen Sie es erneut.",
        }
      }
      return { success: false, error: "Fehler beim Generieren der Rabattcodes: " + error.message }
    }
    return { success: true, data: data as DiscountCode[] }
  } catch (error: any) {
    console.error("Unexpected error generating discount codes:", error)
    return { success: false, error: "Unerwarteter Fehler beim Generieren der Rabattcodes: " + error.message }
  }
}

/**
 * Exportiert Rabattcodes als CSV
 */
export async function exportDiscountCodes(
  filters?: DiscountCodeFilter,
): Promise<{ success: boolean; data?: string; error?: string; filename?: string }> {
  try {
    // Fetch all codes based on filters, ignoring pagination for export
    const result = await getDiscountCodes({ ...filters, page: undefined, limit: undefined })

    if (!result.success || !result.data) {
      return { success: false, error: result.error || "Fehler beim Abrufen der Rabattcodes für den Export" }
    }
    const codes = result.data as DiscountCode[]
    if (codes.length === 0) {
      return {
        success: true,
        data: "",
        filename: "discount_codes_export.csv",
        error: "Keine Rabattcodes zum Exportieren gefunden.",
      }
    }

    const headers = Object.keys(codes[0]).join(",") // Dynamic headers based on actual fields
    const rows = codes.map((code) =>
      Object.values(code)
        .map((value) => {
          if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(","),
    )

    const csvData = [headers, ...rows].join("\n")
    return { success: true, data: csvData, filename: "discount_codes_export.csv" }
  } catch (error: any) {
    console.error("Unexpected error exporting discount codes:", error)
    return { success: false, error: "Unerwarteter Fehler beim Exportieren der Rabattcodes: " + error.message }
  }
}
