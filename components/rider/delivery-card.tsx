"use client"

import { MapPin, Clock, IndianRupee, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RiderDelivery } from "@/lib/rider-data"
import Link from "next/link"

interface DeliveryCardProps {
  delivery: RiderDelivery
  showActions?: boolean
  onAccept?: () => void
}

const statusColors: Record<string, string> = {
  pending: "bg-chart-4/10 text-chart-4",
  accepted: "bg-primary/10 text-primary",
  picked_up: "bg-accent/10 text-accent",
  delivered: "bg-accent text-accent-foreground",
}

const statusLabels: Record<string, string> = {
  pending: "New Request",
  accepted: "Go to Restaurant",
  picked_up: "Deliver to Customer",
  delivered: "Completed",
}

export function DeliveryCard({ delivery, showActions = true, onAccept }: DeliveryCardProps) {
  const isPending = delivery.status === "pending"

  return (
    <Card className={isPending ? "border-chart-4/50 shadow-md" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{delivery.restaurantName}</span>
              <Badge className={statusColors[delivery.status]}>{statusLabels[delivery.status]}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Order #{delivery.orderId.slice(-6)}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-accent">+₹{delivery.earnings}</p>
            <p className="text-xs text-muted-foreground">{delivery.distance}</p>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">PICKUP</p>
              <p className="text-sm text-foreground truncate">{delivery.restaurantAddress}</p>
            </div>
          </div>
          <div className="ml-1 border-l-2 border-dashed border-border h-4" />
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">DROP</p>
              <p className="text-sm text-foreground truncate">{delivery.customerAddress}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-lg bg-secondary p-2 mb-3">
          <p className="text-xs text-muted-foreground mb-1">
            {delivery.items.reduce((sum, i) => sum + i.quantity, 0)} items
          </p>
          <p className="text-sm text-foreground truncate">
            {delivery.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm mb-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{delivery.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{delivery.distance}</span>
          </div>
          <div className="flex items-center gap-1 text-foreground font-medium">
            <IndianRupee className="h-4 w-4" />
            <span>{delivery.total}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            {isPending ? (
              <Button onClick={onAccept} className="flex-1">
                Accept Delivery
              </Button>
            ) : delivery.status !== "delivered" ? (
              <Link href={`/rider/delivery/${delivery.id}`} className="flex-1">
                <Button className="w-full">
                  <Navigation className="mr-1.5 h-4 w-4" />
                  {delivery.status === "accepted" ? "Navigate to Restaurant" : "Navigate to Customer"}
                </Button>
              </Link>
            ) : (
              <div className="flex-1 rounded-lg bg-accent/10 p-3 text-center">
                <span className="text-sm font-medium text-accent">Delivery Completed</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
