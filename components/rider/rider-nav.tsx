"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Wallet, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/rider", label: "Home", icon: Home },
  { href: "/rider/deliveries", label: "Deliveries", icon: Package },
  { href: "/rider/earnings", label: "Earnings", icon: Wallet },
  { href: "/rider/profile", label: "Profile", icon: User },
]

export function RiderNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/rider" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
