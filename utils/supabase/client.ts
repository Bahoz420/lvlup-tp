import { createBrowserClient } from "@supabase/ssr"
import { env } from "@/lib/env"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Return existing client if already created (singleton pattern)
  if (client) {
    return client
  }

  // Create new client
  client = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

  return client
}
