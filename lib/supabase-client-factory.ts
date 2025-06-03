import { createClient } from "@supabase/supabase-js"
import { env } from "./env"

let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      throw new Error("Supabase configuration is missing")
    }

    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "x-application-name": "lvlup-website",
        },
      },
    })
  }

  return supabaseClient
}

export function getSupabaseServerClient() {
  // For server-side operations
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase server configuration is missing")
  }

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Test function to verify connections
export async function testSupabaseConnection() {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.from("products").select("count").limit(1)

    if (error) {
      return { success: false, error: error.message, type: "query_error" }
    }

    return { success: true, message: "Supabase client connection successful" }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      type: "connection_error",
    }
  }
}

export async function testSupabaseServerConnection() {
  try {
    const client = getSupabaseServerClient()
    const { data, error } = await client.from("products").select("count").limit(1)

    if (error) {
      return { success: false, error: error.message, type: "query_error" }
    }

    return { success: true, message: "Supabase server connection successful" }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      type: "connection_error",
    }
  }
}
