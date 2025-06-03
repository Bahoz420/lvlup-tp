"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface ActiveLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  activeClassName?: string
  inactiveClassName?: string
  exact?: boolean
}

export function ActiveLink({
  children,
  activeClassName = "bg-purple-100 text-purple-900 font-medium",
  inactiveClassName = "text-purple-700 hover:bg-purple-50 hover:text-purple-900",
  className,
  exact = false,
  href,
  ...props
}: ActiveLinkProps) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href.toString())

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2",
        isActive ? activeClassName : inactiveClassName,
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
