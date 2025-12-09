import Link from "next/link"
import Image from "next/image"
import { Star, Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Restaurant } from "@/lib/data"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          {!restaurant.isOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <Badge variant="secondary" className="text-sm">
                Currently Closed
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-foreground">{restaurant.name}</h3>
              <p className="truncate text-sm text-muted-foreground">{restaurant.cuisine}</p>
            </div>
            <Badge variant="secondary" className="flex shrink-0 items-center gap-1 bg-accent text-accent-foreground">
              <Star className="h-3 w-3 fill-current" />
              {restaurant.rating}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {restaurant.deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {restaurant.distance}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
