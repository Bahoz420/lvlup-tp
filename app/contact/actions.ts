"use server"

import { revalidatePath } from "next/cache"

export async function submitContactForm(formData: FormData) {
  // Simulate a delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Get form data
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  // Validate form data
  if (!name || !email || !subject || !message) {
    return {
      success: false,
      message: "All fields are required",
    }
  }

  try {
    // In a real application, you would send this data to your backend or email service
    console.log("Contact form submission:", { name, email, subject, message })

    // Revalidate the contact page
    revalidatePath("/contact")

    return {
      success: true,
      message: "Your message has been sent successfully!",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "There was an error sending your message. Please try again.",
    }
  }
}
