"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Save, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { toast } from "@/components/ui/use-toast"
import { updateProfile, uploadProfilePicture } from "../actions"
import { createClient } from "@/utils/supabase/client"
import type { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js" // Import SupabaseUser type

export default function EditProfilePage() {
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null) // Use SupabaseUser type
  const [userProfile, setUserProfile] = useState<any>(null) // Replace 'any' with a specific profile type if available
  const [profileImage, setProfileImage] = useState<string>("")
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (!supabase) return // Wait for supabase client to be initialized

    async function getUserData() {
      const {
        data: { user: authUser }, // Renamed to avoid conflict with state variable 'user'
      } = await supabase.auth.getUser()
      setUser(authUser)

      if (authUser) {
        const { data: profile } = await supabase.from("users").select("*").eq("id", authUser.id).single()
        setUserProfile(profile)
        setProfileImage(profile?.profile_picture_url || "/placeholder.svg?height=160&width=160") // Use placeholder
      }
    }

    getUserData()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const result = await updateProfile(formData)

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append("profilePicture", file)

    const result = await uploadProfilePicture(formData)

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
      if (result.imageUrl) {
        setProfileImage(result.imageUrl)
      }
    }

    setIsUploading(false)
  }

  if (!supabase || !user || !userProfile) {
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
          <span className="font-medium text-purple-800">Edit</span>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-purple-900">Edit Profile</h2>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                <Link href="/profile">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Link>
              </Button>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="text-center">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <div className="rounded-full overflow-hidden h-full w-full relative">
                      <Image
                        src={profileImage || "/placeholder.svg?height=160&width=160&query=profile+avatar"}
                        alt="Profile Picture"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <label
                      htmlFor="profilePicture"
                      className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 cursor-pointer"
                    >
                      {isUploading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </label>
                    <input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>

                  <p className="text-xs text-purple-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>

                  <div className="text-sm text-purple-600 mt-4">
                    <p className="font-medium">{user.email}</p>
                    <p>Member since {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-purple-800 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={userProfile.first_name || ""}
                          className="border-purple-200 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={userProfile.last_name || ""}
                          className="border-purple-200 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          defaultValue={user.user_metadata?.username || user.email?.split("@")[0]}
                          className="border-purple-200 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          className="border-purple-200 focus:ring-purple-500 bg-gray-50"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-800 mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select name="country" defaultValue={userProfile.country || ""}>
                          <SelectTrigger className="border-purple-200">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select name="language" defaultValue={userProfile.language || "en"}>
                          <SelectTrigger className="border-purple-200">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="ru">Russian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Tell us about yourself"
                          className="border-purple-200 focus:ring-purple-500 min-h-[100px]"
                          defaultValue={userProfile.bio || ""}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-800 mb-4">Social Profiles</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="discord">Discord</Label>
                        <Input
                          id="discord"
                          name="discord"
                          placeholder="Your Discord username"
                          defaultValue={userProfile.discord || ""}
                          className="border-purple-200 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          placeholder="Your Twitter handle"
                          defaultValue={userProfile.twitter || ""}
                          className="border-purple-200 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitch">Twitch</Label>
                        <Input
                          id="twitch"
                          name="twitch"
                          placeholder="Your Twitch username"
                          defaultValue={userProfile.twitch || ""}
                          className="border-purple-200 focus:ring-purple-500"
                        />
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
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
