"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import { RestaurantCard } from "@/components/restaurant-card"
import { restaurants, menuItems } from "@/lib/data"

export default function SearchPage() {
  const [query, setQuery] = useState("")

  const filteredRestaurants =
    query.length > 0
      ? restaurants.filter(
          (r) =>
            r.name.toLowerCase().includes(query.toLowerCase()) || r.cuisine.toLowerCase().includes(query.toLowerCase()),
        )
      : []

  const allMenuItems = Object.entries(menuItems).flatMap(([restaurantId, items]) =>
    items.map((item) => ({
      ...item,
      restaurantId,
      restaurantName: restaurants.find((r) => r.id === restaurantId)?.name || "",
    })),
  )

  const filteredDishes =
    query.length > 0
      ? allMenuItems.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()),
        )
      : []

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search restaurants or dishes..."
              className="pl-9 pr-9 bg-secondary border-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="p-4">
        {query.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl mb-2 block">🔍</span>
            <p className="text-muted-foreground">Search for restaurants or dishes</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRestaurants.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Restaurants
                </h2>
                <div className="grid gap-4">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              </div>
            )}

            {filteredDishes.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Dishes</h2>
                <div className="space-y-2">
                  {filteredDishes.slice(0, 10).map((dish) => (
                    <Link key={`${dish.restaurantId}-${dish.id}`} href={`/restaurant/${dish.restaurantId}`}>
                      <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-secondary transition-colors">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{dish.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {dish.restaurantName} • ₹{dish.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredRestaurants.length === 0 && filteredDishes.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl mb-2 block">😕</span>
                <p className="text-muted-foreground">No results found for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
