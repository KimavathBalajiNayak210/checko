"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SellerNav } from "@/components/seller/seller-nav"
import { OrderCard } from "@/components/seller/order-card"
import { useSellerStore } from "@/lib/seller-store"

export default function SellerOrdersPage() {
  const { orders } = useSellerStore() // Fixed: use destructuring instead of selector function
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return order.status === "pending"
    if (activeTab === "active")
      return order.status === "confirmed" || order.status === "preparing" || order.status === "out_for_delivery"
    if (activeTab === "completed") return order.status === "delivered"
    if (activeTab === "cancelled") return order.status === "cancelled"
    return true
  })

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
            <h1 className="text-lg font-semibold text-foreground md:text-2xl">Orders</h1>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Filter className="mr-1.5 h-4 w-4" />
              Filter
            </Button>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4 space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              ) : (
                filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <div className="md:hidden">
        <SellerNav />
      </div>
    </div>
  )
}
