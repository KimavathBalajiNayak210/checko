"use client"

import Image from "next/image"
import { Plus, Minus, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/store"
import type { MenuItem } from "@/lib/data"

interface MenuItemCardProps {
  item: MenuItem
  restaurantId: string
}

export function MenuItemCard({ item, restaurantId }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCartStore()
  const cartItem = items.find((i) => i.id === item.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem(item, restaurantId)
  }

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1)
  }

  const handleDecrement = () => {
    updateQuantity(item.id, quantity - 1)
  }

  return (
    <div className="flex gap-3 border-b border-border py-4 last:border-0">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          {item.isVeg ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-accent">
              <Leaf className="h-2.5 w-2.5 text-accent" />
            </span>
          ) : (
            <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-destructive">
              <span className="h-2 w-2 rounded-full bg-destructive" />
            </span>
          )}
          <h4 className="font-medium text-foreground">{item.name}</h4>
          {item.isBestseller && <Badge className="bg-primary/10 text-primary text-xs">Bestseller</Badge>}
        </div>
        <p className="text-sm font-semibold text-foreground">₹{item.price}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="relative h-20 w-20 overflow-hidden rounded-lg">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        </div>
        {quantity === 0 ? (
          <Button size="sm" onClick={handleAdd} className="h-8 w-20 font-semibold">
            ADD
          </Button>
        ) : (
          <div className="flex h-8 w-20 items-center justify-between rounded-md bg-primary px-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleDecrement}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-semibold text-primary-foreground">{quantity}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
