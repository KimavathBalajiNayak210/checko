"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Store, ClipboardList, AlertTriangle, CreditCard, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sellers", label: "Sellers", icon: Store },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/complaints", label: "Complaints", icon: AlertTriangle },
  { href: "/admin/settlements", label: "Settlements", icon: CreditCard },
  { href: "/admin/riders", label: "Rider Partners", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r border-border bg-card md:block">
      <div className="sticky top-0 p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">QuickBite</h1>
          <p className="text-sm text-muted-foreground">Admin Panel</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
