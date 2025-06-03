import type { Metadata } from "next"
import LoginPageClient from "./login-page-client"

export const metadata: Metadata = {
  title: "Login | LvlUp Gaming",
  description: "Login to your LvlUp Gaming account",
}

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { redirectTo?: string }
}) {
  return <LoginPageClient searchParams={searchParams} />
}
