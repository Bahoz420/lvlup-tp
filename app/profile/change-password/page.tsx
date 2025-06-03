"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Save, X, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { toast } from "@/components/ui/use-toast"
import { changePassword } from "../actions"

export default function ChangePasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const result = await changePassword(formData)

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
      // Reset form
      ;(e.target as HTMLFormElement).reset()
    }

    setIsSaving(false)
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
          <span className="font-medium text-purple-800">Change Password</span>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-purple-900">Change Password</h2>
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
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    required
                    className="border-purple-200 focus:ring-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500 hover:text-purple-700"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    required
                    className="border-purple-200 focus:ring-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500 hover:text-purple-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-purple-500 mt-1">
                  Password must be at least 8 characters long and include a mix of letters, numbers, and special
                  characters.
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    required
                    className="border-purple-200 focus:ring-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500 hover:text-purple-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-2">Password Requirements</h3>
                <ul className="space-y-1 text-sm text-purple-600">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    At least 8 characters long
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    At least one number
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    At least one special character
                  </li>
                </ul>
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
