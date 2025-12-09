import type React from "react"
import type { Metadata } from "next"
import { AdminProvider } from "@/lib/admin-store"

export const metadata: Metadata = {
  title: "Admin Panel - QuickBite",
  description: "Platform administration for QuickBite",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminProvider>{children}</AdminProvider>
}
