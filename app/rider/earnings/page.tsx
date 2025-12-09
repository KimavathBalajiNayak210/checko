"use client"

import Link from "next/link"
import { ArrowLeft, IndianRupee, TrendingUp, Calendar, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RiderNav } from "@/components/rider/rider-nav"
import { useRiderStore } from "@/lib/rider-store"

export default function RiderEarningsPage() {
  const { stats } = useRiderStore()

  const weeklyEarnings = [
    { day: "Mon", amount: 380 },
    { day: "Tue", amount: 420 },
    { day: "Wed", amount: 350 },
    { day: "Thu", amount: 480 },
    { day: "Fri", amount: 520 },
    { day: "Sat", amount: 610 },
    { day: "Sun", amount: stats.todayEarnings },
  ]

  const maxEarning = Math.max(...weeklyEarnings.map((e) => e.amount))

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/rider">
          <Button size="icon" variant="ghost" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Earnings</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Today's Earnings */}
        <Card className="border-accent/50 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Earnings</p>
                <p className="text-4xl font-bold text-foreground">₹{stats.todayEarnings}</p>
                <p className="text-sm text-muted-foreground mt-1">{stats.todayDeliveries} deliveries</p>
              </div>
              <div className="rounded-full bg-accent/20 p-4">
                <IndianRupee className="h-8 w-8 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-primary" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyEarnings.map((day, idx) => (
                <div key={day.day} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-full rounded-t-md transition-all ${idx === weeklyEarnings.length - 1 ? "bg-accent" : "bg-primary/60"}`}
                    style={{ height: `${(day.amount / maxEarning) * 100}%`, minHeight: "8px" }}
                  />
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Weekly Total</span>
              <span className="font-semibold text-foreground">
                ₹{weeklyEarnings.reduce((sum, d) => sum + d.amount, 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stats.totalDeliveries}</p>
                  <p className="text-xs text-muted-foreground">Total Deliveries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  <Wallet className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">₹52/del</p>
                  <p className="text-xs text-muted-foreground">Avg. Earning</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Withdraw Button */}
        <Button className="w-full h-12">
          <Wallet className="mr-2 h-5 w-5" />
          Withdraw Earnings
        </Button>
      </div>

      <RiderNav />
    </div>
  )
}
