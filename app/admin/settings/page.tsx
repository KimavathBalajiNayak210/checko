"use client"

import { Settings, Percent, IndianRupee, Bell, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-4 backdrop-blur-sm md:px-6">
          <h1 className="text-xl font-bold text-foreground md:text-2xl">Platform Settings</h1>
          <p className="text-sm text-muted-foreground">Configure platform-wide settings</p>
        </header>

        <div className="p-4 md:p-6 space-y-4">
          {/* Platform Fees */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Percent className="h-5 w-5 text-primary" />
                Platform Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platformFee">Platform Fee (%)</Label>
                  <Input id="platformFee" type="number" defaultValue="5" />
                  <p className="text-xs text-muted-foreground">Percentage charged on each order</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minFee">Minimum Fee (₹)</Label>
                  <Input id="minFee" type="number" defaultValue="10" />
                  <p className="text-xs text-muted-foreground">Minimum fee per order</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plans */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <IndianRupee className="h-5 w-5 text-primary" />
                Subscription Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold text-foreground">Free</h4>
                  <p className="text-2xl font-bold text-foreground mt-1">₹0</p>
                  <p className="text-sm text-muted-foreground">10% platform fee</p>
                </div>
                <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
                  <h4 className="font-semibold text-foreground">Pro</h4>
                  <p className="text-2xl font-bold text-foreground mt-1">₹999/mo</p>
                  <p className="text-sm text-muted-foreground">5% platform fee</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold text-foreground">Enterprise</h4>
                  <p className="text-2xl font-bold text-foreground mt-1">₹2999/mo</p>
                  <p className="text-sm text-muted-foreground">3% platform fee</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settlement Settings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-5 w-5 text-primary" />
                Settlement Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-deduct at 11 PM</p>
                  <p className="text-sm text-muted-foreground">Automatically collect pending settlements</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Send payment reminders</p>
                  <p className="text-sm text-muted-foreground">Notify sellers about pending payments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settlementTime">Settlement Time</Label>
                <Input id="settlementTime" type="time" defaultValue="23:00" />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-primary" />
                Admin Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">New seller registrations</p>
                  <p className="text-sm text-muted-foreground">Get notified when sellers sign up</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">New complaints</p>
                  <p className="text-sm text-muted-foreground">Instant alerts for customer issues</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Overdue settlements</p>
                  <p className="text-sm text-muted-foreground">Alert when payments are overdue</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-primary" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Two-factor authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button variant="outline" className="bg-transparent">
                Change Admin Password
              </Button>
            </CardContent>
          </Card>

          <Button className="w-full md:w-auto">Save All Settings</Button>
        </div>
      </main>

      <AdminMobileNav />
    </div>
  )
}
