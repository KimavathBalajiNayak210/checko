"use client"

import { useState } from "react"
import { Check, X, Bike, Phone, Clock, MapPin, User, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSharedStore, type SharedOrder } from "@/lib/shared-store"

// Demo riders for assignment
const demoRiders = [
  { id: "r1", name: "Suresh Kumar", phone: "9111222333", status: "available" },
  { id: "r2", name: "Rajesh Yadav", phone: "9444555666", status: "available" },
  { id: "r3", name: "Venkat Reddy", phone: "9777888999", status: "offline" },
]

interface SellerOrderCardProps {
  order: SharedOrder
}

export function SellerOrderCard({ order }: SellerOrderCardProps) {
  const { acceptOrder, rejectOrder, assignRider, updateOrderStatus, completePayment } = useSharedStore()
  const [expanded, setExpanded] = useState(false)
  const [selectedRider, setSelectedRider] = useState("")

  const statusColors: Record<string, string> = {
    pending: "bg-chart-4 text-chart-4-foreground",
    confirmed: "bg-blue-500 text-white",
    preparing: "bg-chart-3 text-chart-3-foreground",
    rider_assigned: "bg-purple-500 text-white",
    out_for_delivery: "bg-accent text-accent-foreground",
    arrived: "bg-teal-500 text-white",
    delivered: "bg-accent text-accent-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  }

  const statusLabels: Record<string, string> = {
    pending: "New Order",
    confirmed: "Confirmed",
    preparing: "Preparing",
    rider_assigned: "Rider Assigned",
    out_for_delivery: "Out for Delivery",
    arrived: "Rider Arrived",
    delivered: "Delivered",
    cancelled: "Cancelled",
  }

  const handleAssignRider = (riderType: "own" | "api") => {
    if (riderType === "own" && selectedRider) {
      const rider = demoRiders.find((r) => r.id === selectedRider)
      if (rider) {
        assignRider(order.id, "own", rider.name, rider.phone)
      }
    } else if (riderType === "api") {
      assignRider(order.id, "api")
    }
  }

  const handleMarkReady = () => {
    updateOrderStatus(order.id, "out_for_delivery")
  }

  const handleVerifyPayment = () => {
    completePayment(order.id)
  }

  const timeAgo = (date: Date) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`
  }

  return (
    <Card className={order.status === "pending" ? "border-chart-4/50 bg-chart-4/5" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">{order.id}</span>
              <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo(order.createdAt)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{order.customerName}</span>
              <span>•</span>
              <Phone className="h-3 w-3" />
              <span>{order.customerPhone}</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-foreground">₹{order.total}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            {/* Order Items */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Items</h4>
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-foreground">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Delivery Address
              </h4>
              <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
            </div>

            {/* Rider Info */}
            {order.riderName && (
              <div className="p-3 bg-secondary rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                  <Bike className="h-4 w-4" />
                  Rider Assigned
                </h4>
                <p className="text-sm text-muted-foreground">
                  {order.riderName} • {order.riderPhone}
                  {order.riderType === "api" && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      API Partner
                    </Badge>
                  )}
                </p>
              </div>
            )}

            {/* Actions based on status */}
            <div className="flex flex-wrap gap-2">
              {order.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => acceptOrder(order.id)}>
                    <Check className="mr-1 h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive bg-transparent"
                    onClick={() => rejectOrder(order.id)}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}

              {order.status === "confirmed" && !order.riderName && (
                <div className="w-full space-y-2">
                  <div className="flex gap-2">
                    <Select value={selectedRider} onValueChange={setSelectedRider}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select your rider" />
                      </SelectTrigger>
                      <SelectContent>
                        {demoRiders
                          .filter((r) => r.status === "available")
                          .map((rider) => (
                            <SelectItem key={rider.id} value={rider.id}>
                              {rider.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => handleAssignRider("own")} disabled={!selectedRider}>
                      Assign
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleAssignRider("api")}
                  >
                    <Bike className="mr-1 h-4 w-4" />
                    Request Dunzo (₹150)
                  </Button>
                </div>
              )}

              {(order.status === "confirmed" || order.status === "preparing" || order.status === "rider_assigned") &&
                order.riderName && (
                  <Button size="sm" onClick={handleMarkReady}>
                    <Check className="mr-1 h-4 w-4" />
                    Mark Ready for Pickup
                  </Button>
                )}

              {(order.status === "out_for_delivery" || order.status === "arrived") && !order.paymentCompleted && (
                <Button size="sm" onClick={handleVerifyPayment}>
                  <Check className="mr-1 h-4 w-4" />
                  Verify Payment Received
                </Button>
              )}

              {order.paymentCompleted && (
                <Badge className="bg-accent text-accent-foreground">
                  <Check className="mr-1 h-3 w-3" />
                  Payment Verified
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
