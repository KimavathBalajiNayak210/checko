"use client"

import { useState } from "react"
import { Search, Filter, MoreVertical, Star, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { useAdminStore } from "@/lib/admin-store"

const statusColors: Record<string, string> = {
  active: "bg-accent/10 text-accent",
  pending: "bg-chart-4/10 text-chart-4",
  suspended: "bg-destructive/10 text-destructive",
}

const kycColors: Record<string, string> = {
  verified: "bg-accent text-accent-foreground",
  pending: "bg-chart-4/10 text-chart-4",
  rejected: "bg-destructive text-destructive-foreground",
}

export default function AdminSellersPage() {
  const { sellers, approveSeller, suspendSeller, activateSeller } = useAdminStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredSellers = sellers
    .filter((s) => {
      if (activeTab === "all") return true
      return s.status === activeTab
    })
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-4 backdrop-blur-sm md:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">Sellers</h1>
              <p className="text-sm text-muted-foreground">{sellers.length} registered sellers</p>
            </div>
            <Button size="sm">
              <Filter className="mr-1.5 h-4 w-4" />
              Export
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sellers..."
              className="pl-9 bg-secondary border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="all">All ({sellers.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({sellers.filter((s) => s.status === "active").length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({sellers.filter((s) => s.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="suspended">
                Suspended ({sellers.filter((s) => s.status === "suspended").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-3">
              {filteredSellers.map((seller) => (
                <Card key={seller.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{seller.name}</h3>
                          <Badge className={statusColors[seller.status]}>{seller.status}</Badge>
                          <Badge className={kycColors[seller.kycStatus]}>KYC: {seller.kycStatus}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{seller.email}</p>
                        <p className="text-sm text-muted-foreground">{seller.phone}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-primary fill-primary" />
                            <span className="font-medium text-foreground">{seller.rating || "N/A"}</span>
                          </div>
                          <span className="text-muted-foreground">{seller.totalOrders} orders</span>
                          <span className="text-muted-foreground">
                            ₹{(seller.totalRevenue / 1000).toFixed(0)}K revenue
                          </span>
                          <Badge variant="outline" className="bg-transparent">
                            {seller.subscription}
                          </Badge>
                        </div>

                        {seller.pendingSettlement > 0 && (
                          <p className="mt-2 text-sm text-chart-4">Pending settlement: ₹{seller.pendingSettlement}</p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          {seller.status === "pending" && (
                            <DropdownMenuItem onClick={() => approveSeller(seller.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-accent" />
                              Approve Seller
                            </DropdownMenuItem>
                          )}
                          {seller.status === "active" && (
                            <DropdownMenuItem onClick={() => suspendSeller(seller.id)} className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />
                              Suspend Seller
                            </DropdownMenuItem>
                          )}
                          {seller.status === "suspended" && (
                            <DropdownMenuItem onClick={() => activateSeller(seller.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-accent" />
                              Reactivate Seller
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredSellers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No sellers found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AdminMobileNav />
    </div>
  )
}
