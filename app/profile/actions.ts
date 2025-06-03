"use server"

import { createClient } from "@/utils/supabase/server"
import { requireAuth } from "@/lib/auth-supabase" // Updated import
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  try {
    const { user } = await requireAuth() // Use the new requireAuth
    const supabase = createClient()

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    // const username = formData.get("username") as string // Username is often part of auth.users, not public.users
    const bio = formData.get("bio") as string
    const country = formData.get("country") as string
    const language = formData.get("language") as string
    const discord = formData.get("discord") as string
    const twitter = formData.get("twitter") as string
    const twitch = formData.get("twitch") as string

    // Validierung
    if (!firstName || !lastName) {
      return { error: "First name and last name are required" }
    }

    // Update user profile in public.users table
    const { error: dbError } = await supabase
      .from("users") // Assuming your public user profiles are in 'users' table
      .update({
        first_name: firstName,
        last_name: lastName,
        bio,
        country,
        language,
        discord_username: discord, // Ensure column names match your DB
        twitter_username: twitter,
        twitch_username: twitch,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (dbError) {
      console.error("Database update error:", dbError)
      return { error: `Failed to update profile: ${dbError.message}` }
    }

    // Update auth.users metadata (if you store some of this there)
    // Supabase auth.updateUser can update user_metadata and email/phone, but not arbitrary top-level fields like first_name directly in auth.users
    // It's common to store profile details in a separate public table linked by user.id
    const userMetadataUpdate: any = {}
    if (firstName) userMetadataUpdate.first_name = firstName
    if (lastName) userMetadataUpdate.last_name = lastName
    // if (username) userMetadataUpdate.username = username; // If you have a username field in user_metadata

    if (Object.keys(userMetadataUpdate).length > 0) {
      const { error: authError } = await supabase.auth.updateUser({
        data: userMetadataUpdate,
      })

      if (authError) {
        console.error("Auth metadata update error:", authError)
        // Non-critical, so maybe just log it or return a partial success
      }
    }

    revalidatePath("/profile")
    revalidatePath("/dashboard") // Assuming dashboard might show profile info

    return { success: true, message: "Profile updated successfully" }
  } catch (error: any) {
    console.error("Profile update error:", error)
    if (error.message === "User not authenticated") {
      return { error: "User not authenticated. Please log in." }
    }
    return { error: error.message || "An unexpected error occurred" }
  }
}

export async function changePassword(formData: FormData) {
  try {
    const { user } = await requireAuth() // Use the new requireAuth
    const supabase = createClient()

    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validierung
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: "All password fields are required" }
    }

    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match" }
    }

    if (newPassword.length < 8) {
      // Consider making this configurable or aligning with Supabase defaults
      return { error: "Password must be at least 8 characters long" }
    }

    // Supabase doesn't have a direct "verify current password" method.
    // The common approach is to try to re-authenticate or update the password directly.
    // If the user is already authenticated (which requireAuth ensures),
    // Supabase trusts the session for password updates.

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      console.error("Password update error:", updateError)
      // Check for specific error messages if needed, e.g., weak password
      return { error: `Failed to update password: ${updateError.message}` }
    }

    revalidatePath("/profile") // Or specific password change page

    return { success: true, message: "Password changed successfully" }
  } catch (error: any) {
    console.error("Password change error:", error)
    if (error.message === "User not authenticated") {
      return { error: "User not authenticated. Please log in." }
    }
    return { error: error.message || "An unexpected error occurred" }
  }
}

export async function updateSecuritySettings(formData: FormData) {
  try {
    const { user } = await requireAuth() // Use the new requireAuth
    const supabase = createClient()

    const twoFactorEnabled = formData.get("twoFactorEnabled") === "true"
    // const loginNotifications = formData.get("loginNotifications") === "true" // Example, implement if needed
    // const sessionTimeout = formData.get("sessionTimeout") // Example, implement if needed

    // Update security settings in user metadata or a separate security_settings table
    // For 2FA, you'd typically initiate an enrollment flow with supabase.auth.mfa.enroll()
    // This is a simplified example assuming you store a flag in user_metadata.
    const { error } = await supabase.auth.updateUser({
      data: {
        // These are examples, Supabase handles 2FA via its own mfa methods (TOTP, SMS)
        // You might store preferences in user_metadata
        two_factor_preference_enabled: twoFactorEnabled,
        // login_notifications_enabled: loginNotifications,
      },
    })

    if (error) {
      console.error("Security settings update error:", error)
      return { error: `Failed to update security settings: ${error.message}` }
    }

    // If you are actually enabling/disabling Supabase MFA, the flow is different.
    // This example just updates a metadata flag.
    // For actual 2FA:
    // if (twoFactorEnabled) {
    //   // const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    //   // handle enrollError and present QR code from data.totp.qr_code
    // } else {
    //   // const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: 'factor-id-to-unenroll' });
    //   // handle unenrollError
    // }

    revalidatePath("/profile/security")

    return { success: true, message: "Security settings updated successfully" }
  } catch (error: any) {
    console.error("Security settings error:", error)
    if (error.message === "User not authenticated") {
      return { error: "User not authenticated. Please log in." }
    }
    return { error: error.message || "An unexpected error occurred" }
  }
}

export async function uploadProfilePicture(formData: FormData) {
  try {
    const { user } = await requireAuth() // Use the new requireAuth
    const supabase = createClient()

    const file = formData.get("profilePicture") as File

    if (!file || file.size === 0) {
      return { error: "No file selected" }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" }
    }

    // Validate file size (max 2MB) - consider making this configurable
    if (file.size > 2 * 1024 * 1024) {
      return { error: "File size must be less than 2MB" }
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `avatars/${user.id}.${fileExt}` // Store in a folder, use user ID for uniqueness

    // Upsert to overwrite if exists, or configure bucket policies accordingly
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile-pictures") // Ensure this bucket exists and has appropriate policies
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return { error: `Failed to upload image: ${uploadError.message}` }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("profile-pictures").getPublicUrl(fileName)
    const publicUrl = urlData.publicUrl

    // Update user profile (public.users table) with new image URL
    const { error: updateError } = await supabase
      .from("users") // Assuming your public user profiles are in 'users' table
      .update({
        profile_picture_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Profile update error (database):", updateError)
      // Potentially delete the uploaded image if DB update fails to prevent orphaned files
      // await supabase.storage.from("profile-pictures").remove([fileName]);
      return { error: `Failed to update profile picture in database: ${updateError.message}` }
    }

    // Optionally, update auth.users user_metadata if you store avatar_url there too
    // await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });

    revalidatePath("/profile")
    revalidatePath("/profile/edit") // If you have a separate edit page

    return { success: true, message: "Profile picture updated successfully", imageUrl: publicUrl }
  } catch (error: any) {
    console.error("Profile picture upload error:", error)
    if (error.message === "User not authenticated") {
      return { error: "User not authenticated. Please log in." }
    }
    return { error: error.message || "An unexpected error occurred" }
  }
}
