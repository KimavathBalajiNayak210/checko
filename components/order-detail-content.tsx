"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Send,
  X,
  MapPin,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { BottomNav } from "@/components/bottom-nav"
import { OrderTracker } from "@/components/order-tracker"
import { QRPayment } from "@/components/qr-payment"
import { useSharedStore } from "@/lib/shared-store"

interface OrderDetailContentProps {
  id: string
}

export function OrderDetailContent({ id }: OrderDetailContentProps) {
  const { orders, updateOrderStatus, assignRider, sendRiderMessage, completePayment, submitComplaint } =
    useSharedStore()
  const order = orders.find((o) => o.id === id)

  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [complaintData, setComplaintData] = useState({
    type: "bad_food" as "bad_food" | "missing_item" | "late_delivery" | "other",
    description: "",
    images: [] as string[],
  })

  // The order status updates come from the seller dashboard in real-time

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/orders">
          <Button variant="outline" className="bg-transparent">
            View All Orders
          </Button>
        </Link>
      </div>
    )
  }

  const showPaymentQR = order.status === "arrived" || order.status === "out_for_delivery"
  const showRiderInfo = order.riderName && ["rider_assigned", "out_for_delivery", "arrived"].includes(order.status)
  const showCompleteButton = order.status === "arrived" && !order.paymentCompleted

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send to the rider
      setMessage("")
      setIsMessageModalOpen(false)
    }
  }

  const handleSubmitComplaint = () => {
    if (!complaintData.description.trim()) return

    submitComplaint(id, {
      id: `COMP-${Date.now()}`,
      type: complaintData.type,
      description: complaintData.description,
      images: complaintData.images,
      status: "pending",
      createdAt: new Date(),
    })
    setIsComplaintModalOpen(false)
    setComplaintData({ type: "bad_food", description: "", images: [] })
  }

  const handlePaymentComplete = () => {
    completePayment(id)
  }

  const getStatusMessage = () => {
    switch (order.status) {
      case "pending":
        return "Waiting for restaurant to accept your order..."
      case "confirmed":
        return "Restaurant has accepted! Preparing your food..."
      case "preparing":
        return "Your delicious food is being prepared..."
      case "rider_assigned":
        return `Rider ${order.riderName} assigned! They will pick up your order soon.`
      case "out_for_delivery":
        return `${order.riderName} is on the way with your order!`
      case "arrived":
        return `${order.riderName} has arrived! Please pay and collect your order.`
      case "delivered":
        return "Order delivered successfully!"
      case "cancelled":
        return "Order was cancelled."
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/orders">
          <Button size="icon" variant="ghost" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">Order #{order.id.slice(-6)}</h1>
          <p className="text-sm text-muted-foreground">{order.restaurantName}</p>
        </div>
        {order.status === "delivered" && <Badge className="bg-accent text-accent-foreground">Completed</Badge>}
        {order.status === "cancelled" && (
          <Badge className="bg-destructive text-destructive-foreground">Cancelled</Badge>
        )}
      </header>

      <div className="p-4 space-y-4">
        {/* Status Banner */}
        <Card
          className={
            order.status === "cancelled" ? "border-destructive/20 bg-destructive/5" : "border-primary/20 bg-primary/5"
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${order.status === "delivered" ? "bg-accent/20" : order.status === "cancelled" ? "bg-destructive/20" : "bg-primary/20"}`}
              >
                {order.status === "delivered" ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : order.status === "cancelled" ? (
                  <X className="h-5 w-5 text-destructive" />
                ) : (
                  <Clock className="h-5 w-5 text-primary animate-pulse" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{getStatusMessage()}</p>
                {order.status !== "delivered" && order.status !== "cancelled" && (
                  <p className="text-sm text-muted-foreground">Updates appear here in real-time</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Tracker */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTracker status={order.status} />
          </CardContent>
        </Card>

        {/* Rider Info - Shows when rider is assigned */}
        {showRiderInfo && (
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    <span className="text-xl">🏍️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {order.status === "arrived"
                        ? "Rider Arrived!"
                        : order.status === "rider_assigned"
                          ? "Rider Assigned"
                          : "On the Way"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{order.riderName}</p>
                    {order.riderPhone && order.riderType !== "api" && (
                      <p className="text-xs text-muted-foreground">{order.riderPhone}</p>
                    )}
                    {order.riderType === "api" && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Dunzo Partner
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {order.riderPhone && order.riderType !== "api" && (
                    <Button size="icon" variant="outline" className="h-10 w-10 rounded-full bg-transparent" asChild>
                      <a href={`tel:${order.riderPhone}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-full bg-transparent"
                    onClick={() => setIsMessageModalOpen(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {order.riderMessage && (
                <div className="mt-3 p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Message from rider:</p>
                  <p className="text-sm text-foreground">"{order.riderMessage}"</p>
                </div>
              )}

              {order.status === "arrived" && (
                <div className="mt-3 flex items-center gap-2 text-sm text-accent">
                  <MapPin className="h-4 w-4" />
                  <span>Rider is waiting at your location</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment QR - Show when rider arrives or out for delivery */}
        {showPaymentQR && <QRPayment upiId={order.upiId} amount={order.total} restaurantName={order.restaurantName} />}

        {showCompleteButton && (
          <Button className="w-full h-12 text-base" onClick={handlePaymentComplete}>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Payment Done - Complete Order
          </Button>
        )}

        {/* Order Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-muted-foreground">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">₹{order.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground">Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
          </CardContent>
        </Card>

        {/* Report Issue Button - Only after delivery */}
        {order.status === "delivered" && !order.complaint && (
          <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsComplaintModalOpen(true)}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report an Issue
          </Button>
        )}

        {/* Complaint Status */}
        {order.complaint && (
          <Card className={order.complaint.status === "replaced" ? "border-accent/50" : "border-chart-4/50"}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`h-5 w-5 ${order.complaint.status === "replaced" ? "text-accent" : "text-chart-4"}`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">Issue Reported</h3>
                    <Badge
                      className={
                        order.complaint.status === "pending"
                          ? "bg-chart-4/10 text-chart-4"
                          : order.complaint.status === "replaced"
                            ? "bg-accent/10 text-accent"
                            : "bg-destructive/10 text-destructive"
                      }
                    >
                      {order.complaint.status === "replaced"
                        ? "Replacement Sent"
                        : order.complaint.status === "rejected"
                          ? "Rejected"
                          : "Under Review"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{order.complaint.description}</p>
                  {order.complaint.status === "replaced" && (
                    <p className="text-sm text-accent mt-2">A replacement order will be delivered to you shortly.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />

      {/* Message Rider Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Message Rider</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMessageModalOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="mr-1.5 h-4 w-4" />
                Send
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complaint Modal */}
      <Dialog open={isComplaintModalOpen} onOpenChange={setIsComplaintModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Issue Type</Label>
              <Select
                value={complaintData.type}
                onValueChange={(val: typeof complaintData.type) => setComplaintData({ ...complaintData, type: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bad_food">Bad/Spoiled Food</SelectItem>
                  <SelectItem value="missing_item">Missing Items</SelectItem>
                  <SelectItem value="late_delivery">Very Late Delivery</SelectItem>
                  <SelectItem value="other">Other Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Describe the Issue</Label>
              <Textarea
                placeholder="Please describe what went wrong..."
                value={complaintData.description}
                onChange={(e) => setComplaintData({ ...complaintData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Photos/Videos</Label>
              <p className="text-xs text-muted-foreground">
                Upload images or videos of the issue for faster resolution. Required for food quality complaints.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Camera className="mr-1.5 h-4 w-4" />
                  Add Photo/Video
                </Button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground font-medium">Resolution Policy</p>
              <p className="text-xs text-muted-foreground mt-1">
                If your complaint is valid, the restaurant will send a <strong>replacement order</strong> at no extra
                cost. No money refunds - only order replacement.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComplaintModalOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSubmitComplaint}>Submit Complaint</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
