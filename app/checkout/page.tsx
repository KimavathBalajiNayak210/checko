"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Phone, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BottomNav } from "@/components/bottom-nav"
import { useCartStore, useUserStore } from "@/lib/store"
import { useSharedStore } from "@/lib/shared-store"
import { restaurants } from "@/lib/data"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, restaurantId, getTotal, clearCart } = useCartStore()
  const { createOrder } = useSharedStore()
  const { name, phone, address, setName, setPhone, setAddress } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)

  const restaurant = restaurants.find((r) => r.id === restaurantId)
  const total = getTotal()

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address) {
      alert("Please fill in all delivery details")
      return
    }

    if (!restaurant || !restaurantId) {
      alert("Restaurant not found")
      return
    }

    setIsLoading(true)

    // Simulate order placement
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const order = createOrder({
      restaurantId: restaurantId,
      restaurantName: restaurant.name,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isVeg: item.isVeg,
      })),
      total,
      customerName: name,
      customerPhone: phone,
      deliveryAddress: address,
      upiId: restaurant.upiId || "restaurant@upi",
    })

    clearCart()
    setIsLoading(false)
    router.push(`/orders/${order.id}`)
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/cart">
          <Button size="icon" variant="ghost" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Checkout</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Delivery Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground">Delivery Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery Address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter complete address with landmarks"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{restaurant?.name}</span>
                <span className="text-foreground">{items.length} items</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-foreground">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">₹{total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <h3 className="font-semibold text-foreground">Pay at Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  You'll pay ₹{total} via UPI QR code when the rider delivers your order. The restaurant will confirm
                  payment before completing delivery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border p-4">
        <Button className="w-full h-12 text-base font-semibold" onClick={handlePlaceOrder} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Placing Order...
            </>
          ) : (
            `Place Order (Pay ₹${total} at Delivery)`
          )}
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
