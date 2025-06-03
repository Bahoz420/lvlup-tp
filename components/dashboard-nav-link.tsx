"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardNavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  activeClassName?: string
  defaultClassName?: string
}

export function DashboardNavLink({
  href,
  children,
  className,
  activeClassName = "bg-purple-100 text-purple-900", // Example active classes
  defaultClassName = "text-purple-700 hover:bg-purple-50 hover:text-purple-900",
}: DashboardNavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={cn(defaultClassName, isActive && activeClassName, className)}>
      {children}
    </Link>
  )
}
