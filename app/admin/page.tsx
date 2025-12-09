"use client"

import { Store, Package, IndianRupee, AlertTriangle, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { useAdminStore } from "@/lib/admin-store"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { stats, sellers, orders, complaints, settlements } = useAdminStore()

  const pendingSellers = sellers.filter((s) => s.status === "pending")
  const openComplaints = complaints.filter((c) => c.status === "open")
  const pendingSettlements = settlements.filter((s) => s.status === "pending" || s.status === "overdue")
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-4 backdrop-blur-sm md:px-6">
          <h1 className="text-xl font-bold text-foreground md:text-2xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Platform overview and quick actions</p>
        </header>

        <div className="p-4 space-y-6 md:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sellers</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalSellers}</p>
                    <p className="text-xs text-accent">{stats.activeSellers} active</p>
                  </div>
                  <Store className="h-8 w-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Orders</p>
                    <p className="text-2xl font-bold text-foreground">{stats.todayOrders}</p>
                    <p className="text-xs text-accent">+12% from yesterday</p>
                  </div>
                  <Package className="h-8 w-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Revenue</p>
                    <p className="text-2xl font-bold text-foreground">₹{(stats.todayRevenue / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-muted-foreground">Platform fees</p>
                  </div>
                  <IndianRupee className="h-8 w-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Issues</p>
                    <p className="text-2xl font-bold text-foreground">{stats.pendingComplaints}</p>
                    <p className="text-xs text-destructive">{openComplaints.length} need attention</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-chart-4/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Section */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Pending Sellers */}
            {pendingSellers.length > 0 && (
              <Card className="border-chart-4/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-chart-4" />
                      Pending Approvals
                    </span>
                    <Badge className="bg-chart-4/10 text-chart-4">{pendingSellers.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pendingSellers.slice(0, 3).map((seller) => (
                    <div key={seller.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                      <div>
                        <p className="font-medium text-foreground">{seller.name}</p>
                        <p className="text-sm text-muted-foreground">{seller.email}</p>
                      </div>
                      <Badge variant="outline" className="bg-transparent">
                        KYC Pending
                      </Badge>
                    </div>
                  ))}
                  <Link href="/admin/sellers" className="block text-sm text-primary hover:underline">
                    View all pending →
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Open Complaints */}
            {openComplaints.length > 0 && (
              <Card className="border-destructive/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Open Complaints
                    </span>
                    <Badge className="bg-destructive/10 text-destructive">{openComplaints.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {openComplaints.slice(0, 3).map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                      <div>
                        <p className="font-medium text-foreground">{complaint.sellerName}</p>
                        <p className="text-sm text-muted-foreground capitalize">{complaint.type.replace("_", " ")}</p>
                      </div>
                      <Badge className="bg-destructive/10 text-destructive">Open</Badge>
                    </div>
                  ))}
                  <Link href="/admin/complaints" className="block text-sm text-primary hover:underline">
                    View all complaints →
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pending Settlements */}
          {pendingSettlements.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    Tonight's Settlements
                  </span>
                  <Badge>{pendingSettlements.length} pending</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pendingSettlements.map((settlement) => (
                    <div key={settlement.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                      <div>
                        <p className="font-medium text-foreground">{settlement.sellerName}</p>
                        <p className="text-sm text-muted-foreground">Due: ₹{settlement.totalDue}</p>
                      </div>
                      <Badge className={settlement.status === "overdue" ? "bg-destructive/10 text-destructive" : ""}>
                        {settlement.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Link href="/admin/settlements" className="block mt-3 text-sm text-primary hover:underline">
                  Manage settlements →
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Recent Orders */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Recent Orders
                </span>
                <Link href="/admin/orders" className="text-sm text-primary hover:underline font-normal">
                  View all
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 text-left font-medium text-muted-foreground">Order</th>
                      <th className="pb-2 text-left font-medium text-muted-foreground">Seller</th>
                      <th className="pb-2 text-left font-medium text-muted-foreground">Customer</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">Amount</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0">
                        <td className="py-3 text-foreground">{order.id}</td>
                        <td className="py-3 text-foreground">{order.sellerName}</td>
                        <td className="py-3 text-muted-foreground">{order.customerName}</td>
                        <td className="py-3 text-right text-foreground">₹{order.total}</td>
                        <td className="py-3 text-right">
                          <Badge
                            variant="outline"
                            className={
                              order.status === "delivered"
                                ? "bg-accent/10 text-accent border-accent/20"
                                : order.status === "cancelled"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-transparent"
                            }
                          >
                            {order.status.replace("_", " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AdminMobileNav />
    </div>
  )
}
