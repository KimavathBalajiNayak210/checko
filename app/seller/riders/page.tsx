"use client"
import { Plus, Phone, MoreVertical, Star, Calendar, Bike, MapPin, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SellerNav } from "@/components/seller/seller-nav"
import { useSellerStore } from "@/lib/seller-store"

const statusColors: Record<string, string> = {
  available: "bg-accent text-accent-foreground",
  busy: "bg-chart-4/10 text-chart-4",
  offline: "bg-muted text-muted-foreground",
}

const statusLabels: Record<string, string> = {
  available: "Ready for Pickup",
  busy: "On Delivery",
  offline: "Offline",
}

export default function SellerRidersPage() {
  const { riders, orders } = useSellerStore()

  const totalDeliveriesToday = riders.reduce((sum, r) => {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    return sum + (r.status === "busy" ? 1 : 0)
  }, 0)

  const avgRating = riders.length > 0 ? (riders.reduce((sum, r) => sum + r.rating, 0) / riders.length).toFixed(1) : "0"

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 md:block">
        <div className="sticky top-0 p-4">
          <h1 className="mb-6 text-xl font-bold text-foreground">QuickBite Seller</h1>
          <SellerNav />
        </div>
      </aside>

      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground md:text-2xl">My Riders</h1>
              <p className="text-sm text-muted-foreground">{riders.length} riders registered</p>
            </div>
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Rider
            </Button>
          </div>
        </header>

        <div className="p-4 space-y-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-accent">
                  {riders.filter((r) => r.status === "available").length}
                </p>
                <p className="text-sm text-muted-foreground">Available Now</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-chart-4">{riders.filter((r) => r.status === "busy").length}</p>
                <p className="text-sm text-muted-foreground">On Delivery</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-muted-foreground">
                  {riders.filter((r) => r.status === "offline").length}
                </p>
                <p className="text-sm text-muted-foreground">Offline</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 text-chart-4 fill-chart-4" />
                  <p className="text-2xl font-bold text-foreground">{avgRating}</p>
                </div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Your Riders</h2>
            {riders.map((rider) => {
              const currentOrder = rider.currentOrderId ? orders.find((o) => o.id === rider.currentOrderId) : null

              return (
                <Card key={rider.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {rider.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{rider.name}</h3>
                            <Badge className={statusColors[rider.status]}>{statusLabels[rider.status]}</Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Call Rider
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Delivery History</DropdownMenuItem>
                              <DropdownMenuItem>Edit Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Remove Rider</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{rider.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Bike className="h-3.5 w-3.5" />
                            <span className="capitalize">
                              {rider.vehicleType} • {rider.vehicleNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>{rider.totalDeliveries} deliveries</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 text-chart-4 fill-chart-4" />
                            <span className="text-foreground font-medium">{rider.rating}</span>
                            <span className="text-muted-foreground">rating</span>
                          </div>
                        </div>

                        {/* Current delivery info */}
                        {currentOrder && (
                          <div className="mt-3 p-2 rounded-lg bg-chart-4/10 border border-chart-4/20">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-3.5 w-3.5 text-chart-4" />
                              <span className="text-chart-4 font-medium">
                                Delivering Order #{currentOrder.id.slice(-6)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 pl-5">
                              To: {currentOrder.customerName} • {currentOrder.deliveryAddress.substring(0, 30)}...
                            </p>
                          </div>
                        )}

                        {/* Joined date */}
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Joined{" "}
                            {new Date(rider.joinedDate).toLocaleDateString("en-IN", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* API Partner Info - More detailed */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">API Delivery Partners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                When your own riders are unavailable, orders can be fulfilled through API partners. Costs are added to
                your nightly settlement.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-card">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-accent/20 flex items-center justify-center">
                      <span className="text-sm">🛵</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Dunzo</p>
                      <p className="text-xs text-muted-foreground">₹50-80 per delivery</p>
                    </div>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">Connected</Badge>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-card">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      <span className="text-sm">📦</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Porter</p>
                      <p className="text-xs text-muted-foreground">₹40-70 per delivery</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="md:hidden">
        <SellerNav />
      </div>
    </div>
  )
}
