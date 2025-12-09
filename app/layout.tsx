import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { StoreProvider } from "@/lib/store"
import { SharedProvider } from "@/lib/shared-store"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuickBite - Pay at Delivery",
  description: "Order food from your favorite restaurants. Pay only at delivery via UPI.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#e85d04",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <SharedProvider>
          <StoreProvider>{children}</StoreProvider>
        </SharedProvider>
        <Analytics />
      </body>
    </html>
  )
}
