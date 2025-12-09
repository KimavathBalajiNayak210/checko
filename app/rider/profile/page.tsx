"use client"

import Link from "next/link"
import { ArrowLeft, Star, Shield, HelpCircle, FileText, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RiderNav } from "@/components/rider/rider-nav"
import { useRiderStore } from "@/lib/rider-store"

const menuItems = [
  { icon: Shield, label: "Documents", href: "#" },
  { icon: HelpCircle, label: "Help & Support", href: "#" },
  { icon: FileText, label: "Terms & Conditions", href: "#" },
]

export default function RiderProfilePage() {
  const { stats } = useRiderStore()

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/rider">
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
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">SK</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">Suresh Kumar</h2>
                  <Badge className="bg-accent text-accent-foreground">Verified</Badge>
                </div>
                <p className="text-sm text-muted-foreground">+91 9111222333</p>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium text-foreground">{stats.rating}</span>
                  <span className="text-sm text-muted-foreground">({stats.totalDeliveries} deliveries)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-foreground">{stats.totalDeliveries}</p>
              <p className="text-xs text-muted-foreground">Deliveries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-foreground">{stats.rating}</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-foreground">98%</p>
              <p className="text-xs text-muted-foreground">Acceptance</p>
            </CardContent>
          </Card>
        </div>

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
          <p>QuickBite Rider v1.0.0</p>
        </div>
      </div>

      <RiderNav />
    </div>
  )
}
