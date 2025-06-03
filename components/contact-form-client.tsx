"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { motion } from "framer-motion"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export function ContactFormClient() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const [responseTime, setResponseTime] = useState("0s")

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    setResponseTime("5s") // Simulate response time
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Your name" {...form.register("name")} />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Your email" {...form.register("email")} />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl>
              <Input placeholder="Your message" {...form.register("message")} />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white"
          >
            Send Message
          </Button>
        </form>
      </Form>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-4 text-center"
      >
        <p className="text-purple-600">Response time: {responseTime}</p>
      </motion.div>
    </>
  )
}
