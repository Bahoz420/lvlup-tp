import bcrypt from "bcryptjs"
// MODIFIED: Changed from 'import * as jwt from "jsonwebtoken"' to named imports
import { sign, verify, type JwtPayload } from "jsonwebtoken"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { db } from "./supabase-database"
import { env, validateEnvironment } from "./env"

// Ensure environment is validated when this module is loaded server-side
if (typeof window === "undefined") {
  validateEnvironment()
}

export interface AuthUser {
  id: string
  email: string
  role: string
  subscription_expires_at?: string
}

// Interface for the decoded token payload, extending JwtPayload
export interface AuthTokenPayload extends JwtPayload {
  id: string
  email: string
  role: string
}

type DemoUser = {
  id: string
  email: string | undefined
  created_at: string
  email_confirmed_at: string | null
  app_metadata: Record<string, any>
  user_metadata: Record<string, any>
  aud: string
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function createToken(user: AuthUser): string {
  const secret = env.SUPABASE_JWT_SECRET
  if (!secret) {
    console.error("CRITICAL: SUPABASE_JWT_SECRET is not defined. Cannot create token.")
    throw new Error("JWT secret is not configured. Token creation failed.")
  }
  // MODIFIED: Use 'sign' directly
  return sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): AuthUser | null {
  const secret = env.SUPABASE_JWT_SECRET
  if (!secret) {
    console.error("CRITICAL: SUPABASE_JWT_SECRET is not defined. Cannot verify token.")
    return null
  }
  try {
    // MODIFIED: Use 'verify' directly and cast the decoded type
    const decoded = verify(token, secret) as AuthTokenPayload
    // Ensure the decoded object has the expected AuthUser fields
    if (
      decoded &&
      typeof decoded.id === "string" &&
      typeof decoded.email === "string" &&
      typeof decoded.role === "string"
    ) {
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        // subscription_expires_at can be added if it's part of the token, otherwise it's not available here
      }
    }
    console.error("Token verification failed: Decoded token is not of expected AuthUser type.", decoded)
    return null
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<{ user: User | null; session: any }> {
  try {
    const supabase = createClient()
    const {
      data: { user, session }, // MODIFIED: Destructure session from data object
    } = await supabase.auth.getUser()
    return { user, session }
  } catch (error) {
    console.error("Error getting current user:", error)
    return { user: null, session: null }
  }
}

export async function requireAuth(allowDemo = false): Promise<User> {
  const { user } = await getCurrentUser()

  if (!user) {
    if (allowDemo) {
      return {
        id: "demo-user",
        email: "demo@example.com",
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        app_metadata: { provider: "email", providers: ["email"] },
        user_metadata: { name: "Demo User" },
        aud: "authenticated",
      } as DemoUser as User // Cast to DemoUser then User
    }
    redirect("/login")
  }
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  const userRole = user.app_metadata?.role || user.user_metadata?.role
  if (userRole !== "admin") {
    console.warn(`Admin access denied for user: ${user.email}. Role: ${userRole}`)
    redirect(env.NEXT_PUBLIC_SITE_URL || "/")
  }
  return user
}

export async function registerUser(
  email: string,
  password: string,
  activationCode: string,
  firstName?: string,
  lastName?: string,
): Promise<{ success: boolean; user?: AuthUser; error?: string; softwareCredentials?: any }> {
  try {
    const { data: existingUser } = await db.getUserByEmail(email)
    if (existingUser) {
      return { success: false, error: "User already exists" }
    }

    const { data: activationData, error: codeError } = await db.getActivationCode(activationCode)
    if (codeError || !activationData) {
      return { success: false, error: "Invalid or expired activation code" }
    }

    if (activationData.customer_email && activationData.customer_email !== email) {
      return { success: false, error: "Email does not match activation code" }
    }

    const hashedPassword = await hashPassword(password)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (activationData.products?.subscription_duration_days || 30))

    const { data: newUser, error: userError } = await db.createUser({
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      subscription_expires_at: expiresAt.toISOString(),
      role: "customer",
      is_active: true,
    })

    if (userError || !newUser) {
      return { success: false, error: userError?.message || "Failed to create user" }
    }

    const softwareUsername = `user_${newUser.id.slice(0, 8)}`
    const softwarePassword = Math.random().toString(36).slice(-12)

    await db.markActivationCodeAsUsed(activationData.id, newUser.id)

    await db.createUserProduct({
      user_id: newUser.id,
      product_id: activationData.product_id,
      activation_code_id: activationData.id,
      expires_at: expiresAt.toISOString(),
      software_username: softwareUsername,
      software_password: softwarePassword,
      is_active: true,
    })

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role || "customer",
      subscription_expires_at: newUser.subscription_expires_at,
    }

    return {
      success: true,
      user: authUser,
      softwareCredentials: { username: softwareUsername, password: softwarePassword },
    }
  } catch (error) {
    console.error("Registration error:", error)
    const message = error instanceof Error ? error.message : "Internal server error during registration"
    return { success: false, error: message }
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const { data: user, error: dbError } = await db.getUserByEmail(email)
    if (dbError || !user) {
      return { success: false, error: "Invalid credentials" }
    }

    if (!user.is_active) {
      return { success: false, error: "Account is deactivated" }
    }

    if (!user.password_hash) {
      console.error(`User ${email} has no password hash set.`)
      return { success: false, error: "Account configuration issue. Please contact support." }
    }
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" }
    }

    await db.updateUser(user.id, { last_login_at: new Date().toISOString() })

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role || "customer",
      subscription_expires_at: user.subscription_expires_at,
    }

    return { success: true, user: authUser }
  } catch (error) {
    console.error("Login error:", error)
    const message = error instanceof Error ? error.message : "Internal server error during login"
    return { success: false, error: message }
  }
}

type UserProfile = {
  id: string
  first_name?: string | null
  username?: string | null
  membership_type?: string | null
} | null

export async function getUserProfile(userId: string): Promise<UserProfile> {
  if (userId === "demo-user") {
    return { id: "demo-user", first_name: "Demo", username: "demouser", membership_type: "Demo Access" }
  }

  const supabase = createClient()
  const { data: profile, error } = await supabase
    .from("users")
    .select("id, first_name, username, membership_type")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error fetching profile:", error.message)
    return null
  }
  return profile
}

export async function getSession() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
