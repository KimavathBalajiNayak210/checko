"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, Navigation, MapPin, Package, QrCode, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RiderNav } from "@/components/rider/rider-nav"
import { useRiderStore } from "@/lib/rider-store"
import { cn } from "@/lib/utils"

interface DeliveryDetailContentProps {
  id: string
}

export function DeliveryDetailContent({ id }: DeliveryDetailContentProps) {
  const router = useRouter()
  const { deliveries, markPickedUp, markDelivered } = useRiderStore()
  const [showQR, setShowQR] = useState(false)

  const delivery = deliveries.find((d) => d.id === id)

  if (!delivery) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Delivery not found</p>
      </div>
    )
  }

  const isAtRestaurant = delivery.status === "accepted"
  const isDelivering = delivery.status === "picked_up"

  const handlePickedUp = () => {
    markPickedUp(delivery.id)
  }

  const handleDelivered = () => {
    markDelivered(delivery.id)
    router.push("/rider")
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/rider">
          <Button size="icon" variant="ghost" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Delivery #{delivery.orderId.slice(-6)}</h1>
          <p className="text-sm text-muted-foreground">{delivery.restaurantName}</p>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Status Steps */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2",
                    delivery.status !== "pending"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-muted text-muted-foreground",
                  )}
                >
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-xs text-center">Accepted</span>
              </div>
              <div className="flex-1 h-0.5 bg-muted mx-2">
                <div
                  className={cn(
                    "h-full bg-primary transition-all",
                    isDelivering || delivery.status === "delivered" ? "w-full" : "w-0",
                  )}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2",
                    isDelivering || delivery.status === "delivered"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-muted text-muted-foreground",
                  )}
                >
                  <Package className="h-5 w-5" />
                </div>
                <span className="text-xs text-center">Picked Up</span>
              </div>
              <div className="flex-1 h-0.5 bg-muted mx-2">
                <div
                  className={cn("h-full bg-primary transition-all", delivery.status === "delivered" ? "w-full" : "w-0")}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2",
                    delivery.status === "delivered"
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-muted bg-muted text-muted-foreground",
                  )}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-xs text-center">Delivered</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Destination */}
        <Card className={isAtRestaurant ? "border-primary/50" : "border-accent/50"}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Navigation className={cn("h-5 w-5", isAtRestaurant ? "text-primary" : "text-accent")} />
              {isAtRestaurant ? "Go to Restaurant" : "Go to Customer"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-foreground">
                {isAtRestaurant ? delivery.restaurantName : delivery.customerName}
              </p>
              <p className="text-sm text-muted-foreground">
                {isAtRestaurant ? delivery.restaurantAddress : delivery.customerAddress}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Phone className="mr-1.5 h-4 w-4" />
                Call
              </Button>
              <Button className="flex-1">
                <Navigation className="mr-1.5 h-4 w-4" />
                Navigate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {delivery.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.quantity}x {item.name}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">Order Total</span>
              <span className="text-foreground">₹{delivery.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* QR Payment Section - Show when delivering */}
        {isDelivering && (
          <Card className="border-accent/50 bg-accent/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <QrCode className="h-5 w-5 text-accent" />
                Collect Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Show this QR code to the customer. Payment goes directly to the restaurant.
              </p>

              <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowQR(!showQR)}>
                {showQR ? "Hide QR Code" : "Show Restaurant QR Code"}
              </Button>

              {showQR && (
                <div className="flex flex-col items-center gap-3 rounded-lg bg-card p-4">
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-xl bg-secondary p-4">
                    <div className="grid grid-cols-5 grid-rows-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-7 w-7 rounded-sm",
                            Math.random() > 0.35 ? "bg-foreground" : "bg-transparent",
                          )}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-lg bg-card p-2">
                        <QrCode className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">₹{delivery.total}</p>
                    <p className="text-sm text-muted-foreground">UPI: {delivery.upiId}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 rounded-lg bg-chart-4/10 p-3 text-sm">
                <AlertTriangle className="h-4 w-4 text-chart-4 shrink-0 mt-0.5" />
                <span className="text-foreground">
                  Only mark as delivered after the customer has paid. The restaurant owner will verify payment.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Earnings */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Your Earnings</span>
              <span className="text-xl font-bold text-accent">+₹{delivery.earnings}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border p-4">
        {isAtRestaurant && (
          <Button className="w-full h-12 text-base font-semibold" onClick={handlePickedUp}>
            <Package className="mr-2 h-5 w-5" />
            Mark as Picked Up
          </Button>
        )}
        {isDelivering && (
          <Button
            className="w-full h-12 text-base font-semibold bg-accent hover:bg-accent/90"
            onClick={handleDelivered}
          >
            <Check className="mr-2 h-5 w-5" />
            Confirm Delivery & Payment Received
          </Button>
        )}
      </div>

      <RiderNav />
    </div>
  )
}
