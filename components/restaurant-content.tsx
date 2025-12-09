"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Clock, MapPin, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNav } from "@/components/bottom-nav"
import { MenuItemCard } from "@/components/menu-item-card"
import { CartSummary } from "@/components/cart-summary"
import type { Restaurant, MenuItem } from "@/lib/data"

interface RestaurantContentProps {
  restaurant: Restaurant
  menu: MenuItem[]
  id: string
}

export function RestaurantContent({ restaurant, menu, id }: RestaurantContentProps) {
  const categories = [...new Set(menu.map((item) => item.category))]
  const [activeCategory, setActiveCategory] = useState(categories[0] || "")

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Image */}
      <div className="relative h-48">
        <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <Link href="/">
          <Button size="icon" variant="secondary" className="absolute left-4 top-4 h-9 w-9 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Restaurant Info */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="rounded-xl bg-card p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">{restaurant.name}</h1>
              <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
            </div>
            <Badge className="bg-accent text-accent-foreground">
              <Star className="mr-1 h-3 w-3 fill-current" />
              {restaurant.rating}
            </Badge>
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {restaurant.deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {restaurant.distance}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/10 p-2 text-xs">
            <Info className="h-4 w-4 text-primary" />
            <span className="text-foreground">
              <strong>Pay at Delivery:</strong> Scan QR code when your order arrives
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="mt-4 px-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="shrink-0">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              {menu
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuItemCard key={item.id} item={item} restaurantId={id} />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <CartSummary />
      <BottomNav />
    </div>
  )
}
