"use client"

import Link from "next/link"
import { ArrowLeft, User, MapPin, Phone, HelpCircle, FileText, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { BottomNav } from "@/components/bottom-nav"
import { useUserStore } from "@/lib/store"

const menuItems = [
  { icon: MapPin, label: "Saved Addresses", href: "#" },
  { icon: Phone, label: "Contact Preferences", href: "#" },
  { icon: HelpCircle, label: "Help & Support", href: "#" },
  { icon: FileText, label: "Terms & Conditions", href: "#" },
]

export default function ProfilePage() {
  const { name, phone } = useUserStore()

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/">
          <Button size="icon" variant="ghost" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {name ? name[0].toUpperCase() : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{name || "Guest User"}</h2>
                <p className="text-sm text-muted-foreground">{phone || "Add phone number"}</p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between p-4 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button variant="outline" className="w-full text-destructive hover:text-destructive bg-transparent">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>QuickBite v1.0.0</p>
          <p>Pay at Delivery - Food Ordering</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
