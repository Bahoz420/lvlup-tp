"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Save, X, Shield, Smartphone, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Navigation } from "@/components/navigation"
import { toast } from "@/components/ui/use-toast"
import { updateSecuritySettings } from "../actions"
import { createClient } from "@/utils/supabase/client"
import type { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js"

export default function SecuritySettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginNotificationsEnabled, setLoginNotificationsEnabled] = useState(true)
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useState(true)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (!supabase) return // Wait for supabase client

    async function getUserData() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setUser(authUser)

      if (authUser?.user_metadata) {
        setTwoFactorEnabled(authUser.user_metadata.two_factor_enabled || false)
        setLoginNotificationsEnabled(authUser.user_metadata.login_notifications !== false) // Assuming these exist
        setSessionTimeoutEnabled(authUser.user_metadata.session_timeout !== false) // Assuming these exist
      }
    }

    getUserData()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData()
    formData.append("twoFactorEnabled", twoFactorEnabled.toString())
    formData.append("loginNotifications", loginNotificationsEnabled.toString())
    formData.append("sessionTimeout", sessionTimeoutEnabled.toString())

    const result = await updateSecuritySettings(formData)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: result.message,
      })
    }

    setIsSaving(false)
  }

  if (!supabase || !user) {
    // Add !supabase check
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
        <Navigation />
        <div className="container py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navigation />

      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-purple-600">
          <Link href="/" className="hover:text-purple-800">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/dashboard" className="hover:text-purple-800">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/profile" className="hover:text-purple-800">
            Profile
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-purple-800">Security Settings</span>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-purple-900">Security Settings</h2>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                  <Link href="/profile">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Link>
                </Button>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Smartphone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-purple-800">Two-Factor Authentication</h3>
                        <p className="text-sm text-purple-600">
                          Add an extra layer of security to your account by requiring a verification code in addition to
                          your password.
                        </p>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>

                    {twoFactorEnabled && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-sm text-purple-700 mb-3">
                          Two-factor authentication is not yet set up. Complete the setup to secure your account.
                        </p>
                        <Button type="button" className="bg-purple-600 hover:bg-purple-700 text-white">
                          Set Up Two-Factor Authentication
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-purple-800">Login Notifications</h3>
                        <p className="text-sm text-purple-600">
                          Receive email notifications when someone logs into your account from a new device or location.
                        </p>
                      </div>
                      <Switch
                        checked={loginNotificationsEnabled}
                        onCheckedChange={setLoginNotificationsEnabled}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Lock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-purple-800">Session Timeout</h3>
                        <p className="text-sm text-purple-600">
                          Automatically log out after 30 minutes of inactivity for enhanced security.
                        </p>
                      </div>
                      <Switch
                        checked={sessionTimeoutEnabled}
                        onCheckedChange={setSessionTimeoutEnabled}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium text-purple-800 mb-4">Recent Login Activity</h3>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg border border-purple-100 bg-purple-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-purple-800">Current Session</p>
                        <p className="text-sm text-purple-600">Browser - {navigator.userAgent.split(" ")[0]}</p>
                        <p className="text-xs text-purple-500 mt-1">
                          {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="bg-green-100 px-2 py-1 rounded text-xs font-medium text-green-800">Active</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
