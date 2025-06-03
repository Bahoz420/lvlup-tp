"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function validateDiscountCode(code: string, subtotal: number) {
  try {
    // Validiere Eingabeparameter
    if (!code || typeof code !== "string") {
      return {
        valid: false,
        message: "Bitte geben Sie einen gültigen Rabattcode ein",
      }
    }

    if (typeof subtotal !== "number" || isNaN(subtotal) || subtotal < 0) {
      return {
        valid: false,
        message: "Ungültiger Bestellbetrag",
      }
    }

    const supabase = createClient()
    if (!supabase) {
      console.error("Failed to create Supabase client")
      return {
        valid: false,
        message: "Datenbankverbindungsfehler",
      }
    }

    // Suche nach dem Rabattcode in der Datenbank
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error validating discount code:", error)

      // Spezifische Fehlermeldungen basierend auf dem Fehlertyp
      if (error.code === "PGRST116") {
        return {
          valid: false,
          message: "Rabattcode nicht gefunden",
        }
      } else if (error.code === "42P01") {
        return {
          valid: false,
          message: "Systemfehler: Rabattcode-Tabelle nicht gefunden",
        }
      }

      return {
        valid: false,
        message: "Bei der Überprüfung des Rabattcodes ist ein Fehler aufgetreten",
      }
    }

    if (!data) {
      return {
        valid: false,
        message: "Rabattcode nicht gefunden",
      }
    }

    // Überprüfe, ob der Rabattcode abgelaufen ist
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return {
        valid: false,
        message: "Rabattcode ist abgelaufen",
      }
    }

    // Überprüfe, ob der Rabattcode bereits aktiv ist
    if (data.starts_at && new Date(data.starts_at) > new Date()) {
      return {
        valid: false,
        message: "Rabattcode ist noch nicht aktiv",
      }
    }

    // Überprüfe, ob die maximale Anzahl an Verwendungen erreicht ist
    if (data.max_uses && data.current_uses >= data.max_uses) {
      return {
        valid: false,
        message: "Rabattcode wurde bereits zu oft verwendet",
      }
    }

    // Überprüfe, ob der Mindestbestellwert erreicht ist
    if (data.min_order_amount && subtotal < data.min_order_amount) {
      return {
        valid: false,
        message: `Mindestbestellwert von ${data.min_order_amount.toFixed(2)}€ nicht erreicht`,
      }
    }

    // Berechne den Rabatt
    let discountAmount = 0

    if (data.discount_percent) {
      discountAmount = (subtotal * data.discount_percent) / 100
    } else if (data.discount_amount) {
      discountAmount = data.discount_amount
    }

    // Stelle sicher, dass der Rabattbetrag nicht größer als der Bestellbetrag ist
    discountAmount = Math.min(discountAmount, subtotal)

    return {
      valid: true,
      discountCode: data,
      discountAmount,
    }
  } catch (error) {
    console.error("Error validating discount code:", error)
    return {
      valid: false,
      message: "Bei der Überprüfung des Rabattcodes ist ein unerwarteter Fehler aufgetreten",
    }
  }
}

export async function incrementDiscountCodeUsage(code: string) {
  try {
    // Validiere Eingabeparameter
    if (!code || typeof code !== "string") {
      console.error("Invalid discount code provided")
      return false
    }

    const supabase = createClient()
    if (!supabase) {
      console.error("Failed to create Supabase client")
      return false
    }

    // Prüfe, ob die RPC-Funktion existiert
    try {
      // Erhöhe die Anzahl der Verwendungen des Rabattcodes
      const { error } = await supabase.rpc("increment_discount_code_usage", { code_param: code })

      if (error) {
        console.error("Error incrementing discount code usage:", error)

        // Fallback-Methode, wenn die RPC-Funktion nicht existiert
        if (error.code === "42883") {
          // Funktion existiert nicht
          console.warn("RPC function not found, using fallback method")

          // Hole aktuelle Verwendungszahl
          const { data: currentData, error: fetchError } = await supabase
            .from("discount_codes")
            .select("current_uses")
            .eq("code", code)
            .single()

          if (fetchError || !currentData) {
            console.error("Error fetching current usage:", fetchError)
            return false
          }

          // Erhöhe die Verwendungszahl um 1
          const { error: updateError } = await supabase
            .from("discount_codes")
            .update({ current_uses: (currentData.current_uses || 0) + 1 })
            .eq("code", code)

          if (updateError) {
            console.error("Error updating discount code usage:", updateError)
            return false
          }
        } else {
          return false
        }
      }

      // Revalidiere die Rabattcode-Seiten
      revalidatePath("/admin/discount-codes")

      return true
    } catch (rpcError) {
      console.error("Error calling RPC function:", rpcError)

      // Fallback-Methode bei allgemeinen Fehlern
      try {
        // Hole aktuelle Verwendungszahl
        const { data: currentData, error: fetchError } = await supabase
          .from("discount_codes")
          .select("current_uses")
          .eq("code", code)
          .single()

        if (fetchError || !currentData) {
          console.error("Error fetching current usage:", fetchError)
          return false
        }

        // Erhöhe die Verwendungszahl um 1
        const { error: updateError } = await supabase
          .from("discount_codes")
          .update({ current_uses: (currentData.current_uses || 0) + 1 })
          .eq("code", code)

        if (updateError) {
          console.error("Error updating discount code usage:", updateError)
          return false
        }

        return true
      } catch (fallbackError) {
        console.error("Fallback method failed:", fallbackError)
        return false
      }
    }
  } catch (error) {
    console.error("Unexpected error incrementing discount code usage:", error)
    return false
  }
}
