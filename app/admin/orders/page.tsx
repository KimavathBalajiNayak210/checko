"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { useAdminStore } from "@/lib/admin-store"

const statusColors: Record<string, string> = {
  pending: "bg-chart-4/10 text-chart-4",
  confirmed: "bg-primary/10 text-primary",
  preparing: "bg-chart-3/10 text-chart-3",
  out_for_delivery: "bg-accent/10 text-accent",
  delivered: "bg-accent text-accent-foreground",
  cancelled: "bg-destructive/10 text-destructive",
}

export default function AdminOrdersPage() {
  const { orders } = useAdminStore() // Fixed: use destructuring instead of selector function
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-4 backdrop-blur-sm md:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">Orders</h1>
              <p className="text-sm text-muted-foreground">All platform orders</p>
            </div>
            <Button size="sm" variant="outline" className="bg-transparent">
              <Filter className="mr-1.5 h-4 w-4" />
              Filter
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-9 bg-secondary border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="p-4 md:p-6">
          {/* Desktop Table */}
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="p-4 text-left font-medium text-muted-foreground">Order ID</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Seller</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Customer</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Rider</th>
                      <th className="p-4 text-right font-medium text-muted-foreground">Amount</th>
                      <th className="p-4 text-right font-medium text-muted-foreground">Platform Fee</th>
                      <th className="p-4 text-center font-medium text-muted-foreground">Status</th>
                      <th className="p-4 text-right font-medium text-muted-foreground">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                        <td className="p-4 font-medium text-foreground">{order.id}</td>
                        <td className="p-4 text-foreground">{order.sellerName}</td>
                        <td className="p-4 text-muted-foreground">{order.customerName}</td>
                        <td className="p-4 text-muted-foreground">{order.riderName}</td>
                        <td className="p-4 text-right text-foreground">₹{order.total}</td>
                        <td className="p-4 text-right text-accent">₹{order.platformFee}</td>
                        <td className="p-4 text-center">
                          <Badge className={statusColors[order.status]}>{order.status.replace("_", " ")}</Badge>
                        </td>
                        <td className="p-4 text-right text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.sellerName}</p>
                    </div>
                    <Badge className={statusColors[order.status]}>{order.status.replace("_", " ")}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p className="text-foreground">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rider</p>
                      <p className="text-foreground">{order.riderName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="text-foreground font-medium">₹{order.total}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Platform Fee</p>
                      <p className="text-accent font-medium">₹{order.platformFee}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </div>
      </main>

      <AdminMobileNav />
    </div>
  )
}
