"use client"

import { Power, IndianRupee, Package, Star, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { RiderNav } from "@/components/rider/rider-nav"
import { DeliveryCard } from "@/components/rider/delivery-card"
import { useRiderStore } from "@/lib/rider-store"
import { cn } from "@/lib/utils"

export default function RiderHomePage() {
  const { deliveries, stats, isOnline, toggleOnline, acceptDelivery, getActiveDelivery } = useRiderStore()

  const activeDelivery = getActiveDelivery()
  const pendingDeliveries = deliveries.filter((d) => d.status === "pending")

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">QuickBite Rider</h1>
            <p className="text-sm text-muted-foreground">Good evening, Suresh!</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("text-sm font-medium", isOnline ? "text-accent" : "text-muted-foreground")}>
              {isOnline ? "Online" : "Offline"}
            </span>
            <Switch checked={isOnline} onCheckedChange={toggleOnline} />
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Online Status Banner */}
        {!isOnline && (
          <Card className="border-chart-4/50 bg-chart-4/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Power className="h-8 w-8 text-chart-4" />
                <div>
                  <h3 className="font-semibold text-foreground">You're Offline</h3>
                  <p className="text-sm text-muted-foreground">Go online to receive delivery requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  <IndianRupee className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{stats.todayEarnings}</p>
                  <p className="text-xs text-muted-foreground">Today's Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.todayDeliveries}</p>
                  <p className="text-xs text-muted-foreground">Deliveries Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/20 p-2">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{stats.rating} Rating</p>
                  <p className="text-sm text-muted-foreground">{stats.totalDeliveries} total deliveries</p>
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
          </CardContent>
        </Card>

        {/* Active Delivery */}
        {activeDelivery && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent"></span>
              </span>
              Active Delivery
            </h2>
            <DeliveryCard delivery={activeDelivery} />
          </div>
        )}

        {/* New Delivery Requests */}
        {isOnline && pendingDeliveries.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">New Requests ({pendingDeliveries.length})</h2>
            <div className="space-y-3">
              {pendingDeliveries.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} onAccept={() => acceptDelivery(delivery.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {isOnline && !activeDelivery && pendingDeliveries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">No deliveries right now</h3>
            <p className="text-sm text-muted-foreground">New requests will appear here</p>
          </div>
        )}
      </div>

      <RiderNav />
    </div>
  )
}
