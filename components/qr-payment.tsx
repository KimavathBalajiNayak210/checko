"use client"

import { QrCode, Smartphone, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QRPaymentProps {
  upiId: string
  amount: number
  restaurantName: string
}

export function QRPayment({ upiId, amount, restaurantName }: QRPaymentProps) {
  // Generate UPI payment URL for QR
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(restaurantName)}&am=${amount}&cu=INR`

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground">Pay at Delivery</CardTitle>
          <Badge className="bg-accent text-accent-foreground">UPI Only</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="relative flex h-48 w-48 items-center justify-center rounded-xl bg-card p-4 shadow-inner">
            <div className="grid grid-cols-4 grid-rows-4 gap-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={cn("h-8 w-8 rounded-sm", Math.random() > 0.3 ? "bg-foreground" : "bg-transparent")}
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-lg bg-card p-2">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-2xl font-bold text-foreground">₹{amount}</p>
          <p className="text-sm text-muted-foreground">
            Pay to: <span className="font-medium text-foreground">{upiId}</span>
          </p>
        </div>

        <div className="space-y-2 rounded-lg bg-secondary p-3">
          <div className="flex items-center gap-2 text-sm">
            <Smartphone className="h-4 w-4 text-primary" />
            <span className="text-foreground">Scan with any UPI app</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span className="text-foreground">Same price as restaurant</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
