"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ClipboardList, UtensilsCrossed, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/orders", label: "Orders", icon: ClipboardList },
  { href: "/seller/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/seller/riders", label: "Riders", icon: Users },
  { href: "/seller/payments", label: "Payments", icon: CreditCard },
]

export function SellerNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm md:static md:border-r md:border-t-0">
      <div className="mx-auto flex max-w-md items-center justify-around py-2 md:max-w-none md:flex-col md:items-stretch md:gap-1 md:p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/seller" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors md:flex-row md:gap-3 md:rounded-lg md:px-3 md:py-2.5 md:text-sm",
                isActive
                  ? "text-primary md:bg-primary/10"
                  : "text-muted-foreground hover:text-foreground md:hover:bg-secondary",
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
