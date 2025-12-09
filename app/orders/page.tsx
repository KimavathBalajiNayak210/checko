"use client"

import Link from "next/link"
import { ArrowLeft, Package, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"
import { useSharedStore } from "@/lib/shared-store"
import { useUserStore } from "@/lib/store"

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-primary/10 text-primary",
  preparing: "bg-chart-4/10 text-chart-4",
  rider_assigned: "bg-purple-500/10 text-purple-600",
  out_for_delivery: "bg-accent/10 text-accent",
  arrived: "bg-teal-500/10 text-teal-600",
  delivered: "bg-accent text-accent-foreground",
  cancelled: "bg-destructive/10 text-destructive",
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  rider_assigned: "Rider Assigned",
  out_for_delivery: "On the Way",
  arrived: "Arrived",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

export default function OrdersPage() {
  const { orders } = useSharedStore()
  const { phone } = useUserStore()

  // Filter orders for current user (by phone) or show all if no phone set
  const userOrders = phone ? orders.filter((o) => o.customerPhone === phone) : orders

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/">
          <Button size="icon" variant="ghost" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Your Orders</h1>
      </header>

      <div className="p-4 space-y-3">
        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">No orders yet</h2>
            <p className="mb-6 text-muted-foreground">Your orders will appear here</p>
            <Link href="/">
              <Button>Browse Restaurants</Button>
            </Link>
          </div>
        ) : (
          userOrders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{order.restaurantName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""} • ₹{order.total}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {order.riderName && order.status !== "delivered" && order.status !== "cancelled" && (
                        <p className="text-xs text-accent">Rider: {order.riderName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}
