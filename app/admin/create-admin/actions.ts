"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export async function createAdminUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createServerComponentClient({ cookies })

  try {
    // 1. Erstelle einen neuen Benutzer mit der Admin-API
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // E-Mail automatisch bestätigen
    })

    if (adminError) {
      console.error("Error creating user:", adminError)
      return { error: adminError.message }
    }

    if (!adminData.user) {
      return { error: "User could not be created" }
    }

    // 2. Füge die Admin-Rolle hinzu
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert([{ id: uuidv4(), user_id: adminData.user.id, role: "admin" }])

    if (roleError) {
      console.error("Error assigning role:", roleError)
      return { error: `User created but role assignment failed: ${roleError.message}` }
    }

    // 3. Füge Admin-Berechtigungen hinzu
    const { error: permissionsError } = await supabase.from("admin_permissions").insert([
      {
        id: uuidv4(),
        user_id: adminData.user.id,
        can_manage_users: true,
        can_manage_products: true,
        can_manage_orders: true,
        can_manage_discounts: true,
        can_manage_cache: true,
      },
    ])

    if (permissionsError) {
      console.error("Error assigning permissions:", permissionsError)
      return {
        error: `User and role created but permissions assignment failed: ${permissionsError.message}`,
      }
    }

    return { success: true, email }
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}
