import type React from "react"
import type { Metadata } from "next"
import { SellerProvider } from "@/lib/seller-store"

export const metadata: Metadata = {
  title: "Seller Dashboard - QuickBite",
  description: "Manage your restaurant orders, menu, and payments",
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SellerProvider>{children}</SellerProvider>
}
