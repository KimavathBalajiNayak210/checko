import type React from "react"
import type { Metadata } from "next"
import { RiderProvider } from "@/lib/rider-store"

export const metadata: Metadata = {
  title: "Rider App - QuickBite",
  description: "Deliver food and earn with QuickBite",
}

export default function RiderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RiderProvider>{children}</RiderProvider>
}
