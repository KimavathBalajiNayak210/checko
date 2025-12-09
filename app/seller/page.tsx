"use client"

import { Package, IndianRupee, Clock, CheckCircle2, Bike, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SellerNav } from "@/components/seller/seller-nav"
import { StatsCard } from "@/components/seller/stats-card"
import { useSharedStore } from "@/lib/shared-store"
import { SellerOrderCard } from "@/components/seller/seller-order-card"

const RESTAURANT_ID = "1"

export default function SellerDashboard() {
  const { orders, upiId } = useSharedStore()

  // Filter orders for this restaurant
  const restaurantOrders = orders.filter((o) => o.restaurantId === RESTAURANT_ID)

  const pendingOrders = restaurantOrders.filter((o) => o.status === "pending")
  const activeOrders = restaurantOrders.filter(
    (o) =>
      o.status === "confirmed" ||
      o.status === "preparing" ||
      o.status === "rider_assigned" ||
      o.status === "out_for_delivery",
  )
  const completedOrders = restaurantOrders.filter((o) => o.status === "delivered")

  // Calculate stats
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayOrders = restaurantOrders.filter((o) => new Date(o.createdAt) >= todayStart)
  const todayRevenue = todayOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0)

  // Settlement calculation
  const apiOrders = todayOrders.filter((o) => o.riderType === "api")
  const deliveryApiCost = apiOrders.length * 150 // ₹150 per API delivery
  const platformFee = Math.round(todayRevenue * 0.05) // 5% platform fee
  const totalDue = deliveryApiCost + platformFee

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 md:block">
        <div className="sticky top-0 p-4">
          <h1 className="mb-6 text-xl font-bold text-foreground">QuickBite Seller</h1>
          <SellerNav />
        </div>
      </aside>

      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm md:px-6">
          <h1 className="text-lg font-semibold text-foreground md:hidden">Dashboard</h1>
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Biryani Blues</p>
          </div>
        </header>

        <div className="p-4 space-y-6 md:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <StatsCard title="Today's Orders" value={todayOrders.length} icon={Package} />
            <StatsCard title="Revenue" value={`₹${todayRevenue}`} icon={IndianRupee} />
            <StatsCard
              title="Pending"
              value={pendingOrders.length}
              icon={Clock}
              className={pendingOrders.length > 0 ? "border-chart-4/50" : ""}
            />
            <StatsCard title="Completed" value={completedOrders.length} icon={CheckCircle2} />
          </div>

          {/* Tonight's Settlement */}
          {totalDue > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  Tonight's Settlement
                  <span className="text-xs font-normal text-muted-foreground ml-auto">Due at 11 PM</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery API Costs ({apiOrders.length} orders)</span>
                    <span className="text-foreground">₹{deliveryApiCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (5% of ₹{todayRevenue})</span>
                    <span className="text-foreground">₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border font-semibold">
                    <span className="text-foreground">Total Due</span>
                    <span className="text-primary text-lg">₹{totalDue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Orders Alert */}
          {pendingOrders.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-4 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-chart-4"></span>
                </span>
                New Orders ({pendingOrders.length})
              </h2>
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <SellerOrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Bike className="h-5 w-5 text-accent" />
                Active Orders ({activeOrders.length})
              </h2>
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <SellerOrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {pendingOrders.length === 0 && activeOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">No active orders</h3>
              <p className="text-sm text-muted-foreground">New orders will appear here in real-time</p>
            </div>
          )}
        </div>
      </main>

      <div className="md:hidden">
        <SellerNav />
      </div>
    </div>
  )
}
