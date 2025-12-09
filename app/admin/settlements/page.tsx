"use client"

import { useState } from "react"
import { CreditCard, CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { useAdminStore } from "@/lib/admin-store"

const statusColors: Record<string, string> = {
  pending: "bg-chart-4/10 text-chart-4",
  paid: "bg-accent/10 text-accent",
  overdue: "bg-destructive text-destructive-foreground",
}

export default function AdminSettlementsPage() {
  const { settlements, markSettlementPaid } = useAdminStore()
  const [activeTab, setActiveTab] = useState("pending")

  const filteredSettlements = settlements.filter((s) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return s.status === "pending" || s.status === "overdue"
    return s.status === activeTab
  })

  const totalPending = settlements
    .filter((s) => s.status === "pending" || s.status === "overdue")
    .reduce((sum, s) => sum + s.totalDue, 0)

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-4 backdrop-blur-sm md:px-6">
          <h1 className="text-xl font-bold text-foreground md:text-2xl">Settlements</h1>
          <p className="text-sm text-muted-foreground">Nightly payments from sellers</p>
        </header>

        <div className="p-4 md:p-6 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-primary/50" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">₹{totalPending.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Pending Collection</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-chart-4/50" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {settlements.filter((s) => s.status === "pending").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Due Tonight</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-destructive/50" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {settlements.filter((s) => s.status === "overdue").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-accent/50" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {settlements.filter((s) => s.status === "paid").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Paid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settlements List */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="pending">
                Pending ({settlements.filter((s) => s.status === "pending" || s.status === "overdue").length})
              </TabsTrigger>
              <TabsTrigger value="paid">Paid ({settlements.filter((s) => s.status === "paid").length})</TabsTrigger>
              <TabsTrigger value="all">All ({settlements.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-3">
              {filteredSettlements.map((settlement) => (
                <Card key={settlement.id} className={settlement.status === "overdue" ? "border-destructive/50" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="text-foreground">{settlement.sellerName}</span>
                      <Badge className={statusColors[settlement.status]}>{settlement.status}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground">Delivery API</p>
                        <p className="font-medium text-foreground">₹{settlement.deliveryApiCost}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Platform Fee</p>
                        <p className="font-medium text-foreground">₹{settlement.platformFee}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Penalties</p>
                        <p
                          className={`font-medium ${settlement.penalties > 0 ? "text-destructive" : "text-foreground"}`}
                        >
                          ₹{settlement.penalties}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Subscription</p>
                        <p className="font-medium text-foreground">₹{settlement.subscriptionDue}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Due</p>
                        <p className="text-xl font-bold text-foreground">₹{settlement.totalDue}</p>
                      </div>
                      {settlement.status !== "paid" && (
                        <Button onClick={() => markSettlementPaid(settlement.id)}>
                          <CheckCircle2 className="mr-1.5 h-4 w-4" />
                          Mark as Paid
                        </Button>
                      )}
                      {settlement.status === "paid" && (
                        <div className="flex items-center gap-2 text-accent">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">Paid</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredSettlements.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-accent mb-4" />
                  <p className="text-muted-foreground">No settlements in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AdminMobileNav />
    </div>
  )
}
