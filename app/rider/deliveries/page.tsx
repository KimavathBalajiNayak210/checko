"use client"

import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiderNav } from "@/components/rider/rider-nav"
import { DeliveryCard } from "@/components/rider/delivery-card"
import { useRiderStore } from "@/lib/rider-store"

export default function RiderDeliveriesPage() {
  const { deliveries } = useRiderStore()

  const activeDeliveries = deliveries.filter((d) => d.status === "accepted" || d.status === "picked_up")
  const completedDeliveries = deliveries.filter((d) => d.status === "delivered")

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/rider">
          <Button size="icon" variant="ghost" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-foreground">My Deliveries</h1>
      </header>

      <div className="p-4">
        <Tabs defaultValue="active">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">
              Active ({activeDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Completed ({completedDeliveries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4 space-y-3">
            {activeDeliveries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No active deliveries</p>
              </div>
            ) : (
              activeDeliveries.map((delivery) => <DeliveryCard key={delivery.id} delivery={delivery} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-3">
            {completedDeliveries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No completed deliveries yet</p>
              </div>
            ) : (
              completedDeliveries.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} showActions={false} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <RiderNav />
    </div>
  )
}
