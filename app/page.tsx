"use client"

import { useState } from "react"
import { Search, MapPin, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"
import { RestaurantCard } from "@/components/restaurant-card"
import { restaurants, categories } from "@/lib/data"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedCategory === "all") return matchesSearch

    const cuisineMap: Record<string, string[]> = {
      biryani: ["biryani"],
      pizza: ["pizza", "italian"],
      chinese: ["chinese", "asian"],
      burger: ["burger", "american"],
      "south-indian": ["south indian", "dosa"],
    }

    const matchesCuisine = cuisineMap[selectedCategory]?.some((c) => r.cuisine.toLowerCase().includes(c))

    return matchesSearch && matchesCuisine
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Deliver to</p>
              <p className="text-muted-foreground">HSR Layout, Bangalore</p>
            </div>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search restaurants or dishes..."
              className="pl-9 pr-10 bg-secondary border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 py-3">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              className="cursor-pointer whitespace-nowrap px-3 py-1.5 text-sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Pay at Delivery Banner */}
      <div className="mx-4 mb-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <span className="text-2xl">💳</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Pay at Delivery</h3>
            <p className="text-sm text-muted-foreground">No upfront payment. Pay via UPI when your food arrives!</p>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="px-4">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {selectedCategory === "all"
            ? "All Restaurants"
            : `${categories.find((c) => c.id === selectedCategory)?.name} Restaurants`}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
        {filteredRestaurants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl mb-2">🍽️</span>
            <p className="text-muted-foreground">No restaurants found</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
