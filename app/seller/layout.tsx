import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Seller Dashboard - QuickBite",
  description: "Manage your restaurant orders, menu, and payments",
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
