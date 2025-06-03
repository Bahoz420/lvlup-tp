"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { createAdminUser } from "@/app/admin/create-admin/actions"

export function CreateAdminUserForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Erstelle den Admin-Benutzer über die Server-Action
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const result = await createAdminUser(formData)

      if (result.error) {
        toast({
          title: "Error creating admin user",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      // Melde den Benutzer an
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        toast({
          title: "Error signing in",
          description: signInError.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Admin user created",
        description: "You have successfully created an admin user and are now signed in.",
      })

      // Leite zum Admin-Dashboard weiter
      router.push("/admin")
    } catch (error: any) {
      console.error("Error in form submission:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Admin User"}
      </Button>
    </form>
  )
}
