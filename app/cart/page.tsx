"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BottomNav } from "@/components/bottom-nav"
import { useCartStore } from "@/lib/store"
import { restaurants } from "@/lib/data"

export default function CartPage() {
  const { items, restaurantId, updateQuantity, removeItem, clearCart, getTotal } = useCartStore()
  const restaurant = restaurants.find((r) => r.id === restaurantId)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
          <Link href="/">
            <Button size="icon" variant="ghost" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Your Cart</h1>
        </header>

        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">Add items from a restaurant to get started</p>
          <Link href="/">
            <Button>Browse Restaurants</Button>
          </Link>
        </div>

        <BottomNav />
      </div>
    )
  }

  const deliveryFee = 0 // Free delivery!
  const total = getTotal()
  const grandTotal = total + deliveryFee

  return (
    <div className="min-h-screen bg-background pb-40">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href={`/restaurant/${restaurantId}`}>
            <Button size="icon" variant="ghost" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Your Cart</h1>
            <p className="text-sm text-muted-foreground">{restaurant?.name}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
          <Trash2 className="mr-1 h-4 w-4" />
          Clear
        </Button>
      </header>

      <div className="p-4 space-y-4">
        {/* Cart Items */}
        <Card>
          <CardContent className="p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 bg-transparent"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center font-medium text-foreground">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 bg-transparent"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bill Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground">Bill Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Item Total</span>
              <span className="text-foreground">₹{total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="text-accent font-medium">FREE</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">To Pay</span>
              <span className="text-foreground">₹{grandTotal}</span>
            </div>
          </CardContent>
        </Card>

        {/* Pay at Delivery Info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <h3 className="font-semibold text-foreground">Pay at Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  No payment needed now. Pay ₹{grandTotal} via UPI when your order arrives.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border p-4">
        <Link href="/checkout">
          <Button className="w-full h-12 text-base font-semibold">Place Order (Pay ₹{grandTotal} at Delivery)</Button>
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
