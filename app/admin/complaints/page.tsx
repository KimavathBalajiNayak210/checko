"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, Clock, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { useAdminStore } from "@/lib/admin-store"

const statusColors: Record<string, string> = {
  open: "bg-destructive/10 text-destructive",
  in_progress: "bg-chart-4/10 text-chart-4",
  resolved: "bg-accent/10 text-accent",
}

const typeIcons: Record<string, typeof AlertTriangle> = {
  bad_food: Ban,
  late_delivery: Clock,
  wrong_order: AlertTriangle,
  other: AlertTriangle,
}

export default function AdminComplaintsPage() {
  const { complaints, resolveComplaint, applyPenalty } = useAdminStore()
  const [activeTab, setActiveTab] = useState("open")
  const [penaltyAmount, setPenaltyAmount] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null)

  const filteredComplaints = complaints.filter((c) => {
    if (activeTab === "all") return true
    return c.status === activeTab
  })

  const handleApplyPenalty = (complaintId: string) => {
    const amount = Number.parseInt(penaltyAmount)
    if (amount > 0) {
      applyPenalty(complaintId, amount)
      setPenaltyAmount("")
      setSelectedComplaint(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-4 backdrop-blur-sm md:px-6">
          <h1 className="text-xl font-bold text-foreground md:text-2xl">Complaints</h1>
          <p className="text-sm text-muted-foreground">Manage customer issues and apply penalties</p>
        </header>

        <div className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="all">All ({complaints.length})</TabsTrigger>
              <TabsTrigger value="open">Open ({complaints.filter((c) => c.status === "open").length})</TabsTrigger>
              <TabsTrigger value="in_progress">
                In Progress ({complaints.filter((c) => c.status === "in_progress").length})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved ({complaints.filter((c) => c.status === "resolved").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredComplaints.map((complaint) => {
                const TypeIcon = typeIcons[complaint.type] || AlertTriangle

                return (
                  <Card key={complaint.id} className={complaint.status === "open" ? "border-destructive/50" : ""}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-5 w-5 text-destructive" />
                          <span className="capitalize text-foreground">{complaint.type.replace("_", " ")}</span>
                        </div>
                        <Badge className={statusColors[complaint.status]}>{complaint.status.replace("_", " ")}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Order</p>
                          <p className="font-medium text-foreground">{complaint.orderId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Seller</p>
                          <p className="font-medium text-foreground">{complaint.sellerName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium text-foreground">{complaint.customerName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reported</p>
                          <p className="font-medium text-foreground">
                            {new Date(complaint.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg bg-secondary p-3">
                        <p className="text-sm text-foreground">{complaint.description}</p>
                      </div>

                      {complaint.penalty && (
                        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3">
                          <Ban className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-foreground">Penalty applied: ₹{complaint.penalty}</span>
                        </div>
                      )}

                      {complaint.status !== "resolved" && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => resolveComplaint(complaint.id)}
                          >
                            <CheckCircle2 className="mr-1.5 h-4 w-4" />
                            Mark Resolved
                          </Button>

                          <Dialog
                            open={selectedComplaint === complaint.id}
                            onOpenChange={(open) => setSelectedComplaint(open ? complaint.id : null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="destructive" className="flex-1">
                                <Ban className="mr-1.5 h-4 w-4" />
                                Apply Penalty
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Apply Penalty to {complaint.sellerName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                  <Label htmlFor="penalty">Penalty Amount (₹)</Label>
                                  <Input
                                    id="penalty"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={penaltyAmount}
                                    onChange={(e) => setPenaltyAmount(e.target.value)}
                                  />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  This amount will be added to the seller's nightly settlement.
                                </p>
                                <Button
                                  className="w-full"
                                  onClick={() => handleApplyPenalty(complaint.id)}
                                  disabled={!penaltyAmount || Number.parseInt(penaltyAmount) <= 0}
                                >
                                  Confirm Penalty
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}

              {filteredComplaints.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-accent mb-4" />
                  <p className="text-muted-foreground">No complaints in this category</p>
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
