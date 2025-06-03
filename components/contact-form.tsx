"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { submitContactForm } from "@/app/contact/actions"

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await submitContactForm(formData)

      if (result.success) {
        toast({
          title: "Message sent",
          description: result.message,
        })
        // Reset the form
        const form = document.getElementById("contact-form") as HTMLFormElement
        form?.reset()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form id="contact-form" action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-purple-200">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            className="bg-white/5 border-white/20 focus-visible:ring-amber-500 text-white placeholder-purple-300"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-purple-200">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            required
            className="bg-white/5 border-white/20 focus-visible:ring-amber-500 text-white placeholder-purple-300"
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-purple-200">
          Subject
        </Label>
        <Input
          id="subject"
          name="subject"
          placeholder="What is this regarding?"
          required
          className="bg-white/5 border-white/20 focus-visible:ring-amber-500 text-white placeholder-purple-300"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-purple-200">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message..."
          rows={5}
          required
          className="bg-white/5 border-white/20 focus-visible:ring-amber-500 text-white placeholder-purple-300"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
