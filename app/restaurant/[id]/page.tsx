import { RestaurantContent } from "@/components/restaurant-content"
import { restaurants, menuItems } from "@/lib/data"

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const restaurant = restaurants.find((r) => r.id === id)
  const menu = menuItems[id] || []

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Restaurant not found</p>
      </div>
    )
  }

  return <RestaurantContent restaurant={restaurant} menu={menu} id={id} />
}
