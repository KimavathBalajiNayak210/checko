"use client"

import { useState } from "react"
import { Clock, User, Phone, MapPin, ChevronDown, ChevronUp, Check, X, Bike, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSellerStore } from "@/lib/seller-store"
import type { SellerOrder } from "@/lib/seller-data"

interface OrderCardProps {
  order: SellerOrder
}

const statusColors: Record<string, string> = {
  pending: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  confirmed: "bg-primary/10 text-primary border-primary/20",
  preparing: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  out_for_delivery: "bg-accent/10 text-accent border-accent/20",
  delivered: "bg-accent text-accent-foreground",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusLabels: Record<string, string> = {
  pending: "New Order",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [riderType, setRiderType] = useState<"own" | "api">("own")
  const [selectedRider, setSelectedRider] = useState("")

  const { acceptOrder, rejectOrder, updateOrderStatus, assignRider, verifyPayment, riders } = useSellerStore()

  const availableRiders = riders.filter((r) => r.status === "available")
  const timeAgo = getTimeAgo(new Date(order.createdAt))

  const handleAccept = () => {
    acceptOrder(order.id)
  }

  const handleReject = () => {
    rejectOrder(order.id)
  }

  const handleAssignRider = () => {
    if (riderType === "own" && selectedRider) {
      const rider = riders.find((r) => r.id === selectedRider)
      assignRider(order.id, "own", rider?.name)
    } else if (riderType === "api") {
      assignRider(order.id, "api", "Dunzo Partner")
    }
    setAssignDialogOpen(false)
    updateOrderStatus(order.id, "preparing")
  }

  const handleMarkReady = () => {
    updateOrderStatus(order.id, "out_for_delivery")
  }

  const handleVerifyPayment = () => {
    verifyPayment(order.id)
  }

  return (
    <Card className={order.status === "pending" ? "border-chart-4/50 shadow-md" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">#{order.id.slice(-6)}</span>
              <Badge variant="outline" className={statusColors[order.status]}>
                {statusLabels[order.status]}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo}
            </div>
          </div>
          <span className="text-lg font-bold text-foreground">₹{order.total}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Customer Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="text-foreground">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span className="text-foreground">{order.customerPhone}</span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="rounded-lg bg-secondary p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
            <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          {expanded && (
            <div className="mt-2 space-y-1 border-t border-border pt-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-foreground">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delivery Address */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">{order.deliveryAddress}</span>
        </div>

        {/* Rider Info */}
        {order.riderType && (
          <div className="flex items-center gap-2 rounded-lg bg-accent/10 p-2 text-sm">
            {order.riderType === "own" ? (
              <Bike className="h-4 w-4 text-accent" />
            ) : (
              <Truck className="h-4 w-4 text-accent" />
            )}
            <span className="text-foreground">
              {order.riderType === "own" ? "Own Rider" : "API Partner"}: {order.riderName}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {order.status === "pending" && (
            <>
              <Button onClick={handleAccept} className="flex-1">
                <Check className="mr-1.5 h-4 w-4" />
                Accept
              </Button>
              <Button onClick={handleReject} variant="outline" className="flex-1 bg-transparent">
                <X className="mr-1.5 h-4 w-4" />
                Reject
              </Button>
            </>
          )}

          {order.status === "confirmed" && !order.riderType && (
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <Bike className="mr-1.5 h-4 w-4" />
                  Assign Rider
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Delivery</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <RadioGroup value={riderType} onValueChange={(v) => setRiderType(v as "own" | "api")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="own" id="own" />
                      <Label htmlFor="own">Own Rider</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="api" id="api" />
                      <Label htmlFor="api">API Partner (Dunzo)</Label>
                    </div>
                  </RadioGroup>

                  {riderType === "own" && (
                    <Select value={selectedRider} onValueChange={setSelectedRider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rider" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRiders.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No riders available
                          </SelectItem>
                        ) : (
                          availableRiders.map((rider) => (
                            <SelectItem key={rider.id} value={rider.id}>
                              {rider.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}

                  {riderType === "api" && (
                    <p className="text-sm text-muted-foreground">
                      Delivery fee of ₹40-60 will be added to tonight's settlement.
                    </p>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleAssignRider}
                    disabled={riderType === "own" && !selectedRider}
                  >
                    Confirm Assignment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {(order.status === "confirmed" || order.status === "preparing") && order.riderType && (
            <Button onClick={handleMarkReady} className="flex-1">
              Mark Ready for Pickup
            </Button>
          )}

          {order.status === "out_for_delivery" && !order.paymentVerified && (
            <Button onClick={handleVerifyPayment} className="flex-1 bg-accent hover:bg-accent/90">
              <Check className="mr-1.5 h-4 w-4" />
              Verify Payment Received
            </Button>
          )}

          {order.status === "delivered" && (
            <div className="flex-1 rounded-lg bg-accent/10 p-3 text-center">
              <Check className="mx-auto h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-accent">Payment Verified & Delivered</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  return date.toLocaleDateString()
}
