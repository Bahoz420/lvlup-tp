import type React from "react"
export default function CreateAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container py-8">{children}</div>
    </div>
  )
}
