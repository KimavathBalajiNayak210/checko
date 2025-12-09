"use client"

import { Truck, CheckCircle2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"

const riderPartners = [
  {
    id: "dunzo",
    name: "Dunzo",
    logo: "🚀",
    status: "active",
    deliveriesThisMonth: 1250,
    avgCost: 45,
    avgTime: "22 min",
  },
  {
    id: "porter",
    name: "Porter",
    logo: "📦",
    status: "inactive",
    deliveriesThisMonth: 0,
    avgCost: 50,
    avgTime: "25 min",
  },
  {
    id: "shadowfax",
    name: "Shadowfax",
    logo: "⚡",
    status: "pending",
    deliveriesThisMonth: 0,
    avgCost: 42,
    avgTime: "20 min",
  },
]

export default function AdminRidersPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-4 backdrop-blur-sm md:px-6">
          <h1 className="text-xl font-bold text-foreground md:text-2xl">Rider API Partners</h1>
          <p className="text-sm text-muted-foreground">Manage third-party delivery integrations</p>
        </header>

        <div className="p-4 md:p-6 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-xs text-muted-foreground">Active Partners</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">1,250</p>
                <p className="text-xs text-muted-foreground">API Deliveries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">₹45</p>
                <p className="text-xs text-muted-foreground">Avg. Cost</p>
              </CardContent>
            </Card>
          </div>

          {/* Partners */}
          <div className="space-y-3">
            {riderPartners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-2xl">
                        {partner.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{partner.name}</h3>
                          <Badge
                            className={
                              partner.status === "active"
                                ? "bg-accent/10 text-accent"
                                : partner.status === "pending"
                                  ? "bg-chart-4/10 text-chart-4"
                                  : "bg-muted text-muted-foreground"
                            }
                          >
                            {partner.status}
                          </Badge>
                        </div>
                        {partner.status === "active" && (
                          <p className="text-sm text-muted-foreground">
                            {partner.deliveriesThisMonth} deliveries • Avg ₹{partner.avgCost} • {partner.avgTime}
                          </p>
                        )}
                        {partner.status === "pending" && (
                          <p className="text-sm text-chart-4">Integration pending approval</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {partner.status === "active" && <Switch defaultChecked />}
                      {partner.status === "inactive" && <Switch />}
                      {partner.status === "pending" && (
                        <Button size="sm">
                          <CheckCircle2 className="mr-1.5 h-4 w-4" />
                          Approve
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Partner */}
          <Card className="border-dashed">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <Truck className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-semibold text-foreground">Add New Partner</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Integrate with more delivery partners to expand coverage
                </p>
                <Button variant="outline" className="bg-transparent">
                  Request Integration
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Info */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">API Delivery Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                When sellers use API delivery partners, the cost is added to their nightly settlement:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-foreground">Dunzo: ₹40-60 per delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-foreground">Porter: ₹45-65 per delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-foreground">Shadowfax: ₹38-55 per delivery</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <AdminMobileNav />
    </div>
  )
}
