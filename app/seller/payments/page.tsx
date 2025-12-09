"use client"

import { useState } from "react"
import { CreditCard, CheckCircle2, AlertTriangle, QrCode, Truck, Building, Save, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { SellerNav } from "@/components/seller/seller-nav"
import { useSharedStore } from "@/lib/shared-store"

const RESTAURANT_ID = "1"

export default function SellerPaymentsPage() {
  const { orders, upiId, updateUpiId } = useSharedStore()
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false)
  const [newUpiId, setNewUpiId] = useState(upiId)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Calculate settlement from orders
  const restaurantOrders = orders.filter((o) => o.restaurantId === RESTAURANT_ID)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayOrders = restaurantOrders.filter((o) => new Date(o.createdAt) >= todayStart)
  const completedTodayOrders = todayOrders.filter((o) => o.status === "delivered")

  const apiOrders = todayOrders.filter((o) => o.riderType === "api")
  const totalRevenue = completedTodayOrders.reduce((sum, o) => sum + o.total, 0)
  const deliveryApiCost = apiOrders.length * 150
  const platformFee = Math.round(totalRevenue * 0.05)
  const totalDue = deliveryApiCost + platformFee

  // Payment history (simulated)
  const paidSettlements = [
    {
      id: "SET-001",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      deliveryApiCost: 300,
      platformFee: 280,
      totalDue: 580,
      totalOrdersCount: 10,
      apiOrdersCount: 2,
      totalRevenue: 5600,
    },
    {
      id: "SET-002",
      date: new Date(Date.now() - 48 * 60 * 60 * 1000),
      deliveryApiCost: 450,
      platformFee: 320,
      totalDue: 770,
      totalOrdersCount: 12,
      apiOrdersCount: 3,
      totalRevenue: 6400,
    },
  ]

  const handleUpdateUpi = () => {
    if (newUpiId.trim()) {
      updateUpiId(newUpiId.trim())
      setSaveSuccess(true)
      setTimeout(() => {
        setIsUpiModalOpen(false)
        setSaveSuccess(false)
      }, 1500)
    }
  }

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
          <h1 className="text-lg font-semibold text-foreground md:text-2xl">Payments & Settlements</h1>
          <p className="text-sm text-muted-foreground">Manage your payment QR and view settlement details</p>
        </header>

        <div className="p-4 space-y-6 md:p-6">
          {/* UPI QR Management */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <QrCode className="h-5 w-5 text-primary" />
                Your Payment QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                This UPI ID is shown to customers at delivery time for payment.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-lg bg-secondary flex items-center justify-center border-2 border-dashed border-border">
                  <QrCode className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-lg">{upiId}</p>
                  <p className="text-sm text-muted-foreground">Biryani Blues</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-sm text-accent">Active</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 bg-transparent"
                    onClick={() => {
                      setNewUpiId(upiId)
                      setIsUpiModalOpen(true)
                    }}
                  >
                    Update UPI ID
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tonight's Settlement */}
          <Card className="border-chart-4/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-chart-4" />
                  Tonight's Settlement
                </span>
                <Badge className="bg-chart-4/10 text-chart-4">Due at 11 PM</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Partner Costs */}
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold text-foreground">Delivery API Costs</span>
                </div>
                <div className="space-y-2 pl-7">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dunzo Orders ({apiOrders.length} deliveries)</span>
                    <span className="font-medium text-foreground">₹{deliveryApiCost}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">₹150 per delivery via API partners</p>
                </div>
              </div>

              {/* Platform Fee */}
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Platform Fee (5%)</span>
                </div>
                <div className="space-y-2 pl-7">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">5% of ₹{totalRevenue} revenue</span>
                    <span className="font-medium text-foreground">₹{platformFee}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    From {completedTodayOrders.length} completed orders today
                  </p>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center py-2">
                <div>
                  <span className="font-bold text-foreground text-lg">Total Due</span>
                  <p className="text-xs text-muted-foreground">Auto-deducted at 11 PM</p>
                </div>
                <span className="font-bold text-2xl text-primary">₹{totalDue}</span>
              </div>

              <Button className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now via UPI
              </Button>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Your earnings (₹{totalRevenue}) are collected directly via customer UPI payments. Settlement covers
                  platform fees and API delivery costs only.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Payment History</h2>
            <div className="space-y-3">
              {paidSettlements.map((settlement) => (
                <Card key={settlement.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {new Date(settlement.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                          Paid
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹{settlement.totalDue}</p>
                        <p className="text-xs text-muted-foreground">{settlement.totalOrdersCount} orders</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Truck className="h-3 w-3" /> API Costs
                        </span>
                        <span className="text-foreground font-medium">₹{settlement.deliveryApiCost}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" /> Platform Fee
                        </span>
                        <span className="text-foreground font-medium">₹{settlement.platformFee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="md:hidden">
        <SellerNav />
      </div>

      {/* Update UPI Modal */}
      <Dialog open={isUpiModalOpen} onOpenChange={setIsUpiModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update UPI ID</DialogTitle>
          </DialogHeader>
          {saveSuccess ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-3" />
              <p className="font-medium text-foreground">UPI ID Updated!</p>
              <p className="text-sm text-muted-foreground">Your new UPI ID is now active</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@upi"
                  value={newUpiId}
                  onChange={(e) => setNewUpiId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This UPI ID will be shown to customers for payment at delivery
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUpiModalOpen(false)} className="bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleUpdateUpi}>
                  <Save className="mr-1.5 h-4 w-4" />
                  Save UPI ID
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
