"use client"

import { Check, ChefHat, Bike, MapPin, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Order } from "@/lib/data"

interface OrderTrackerProps {
  status: Order["status"]
}

const steps = [
  { id: "confirmed", label: "Confirmed", icon: Check },
  { id: "preparing", label: "Preparing", icon: ChefHat },
  { id: "rider_assigned", label: "Rider Assigned", icon: User },
  { id: "out_for_delivery", label: "On the Way", icon: Bike },
  { id: "arrived", label: "Arrived", icon: Bell },
  { id: "delivered", label: "Delivered", icon: MapPin },
]

const statusIndex: Record<Order["status"], number> = {
  pending: -1,
  confirmed: 0,
  preparing: 1,
  rider_assigned: 2,
  out_for_delivery: 3,
  arrived: 4,
  delivered: 5,
  cancelled: -1,
}

export function OrderTracker({ status }: OrderTrackerProps) {
  const currentIndex = statusIndex[status]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-1">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-muted text-muted-foreground",
                  isCurrent && "ring-4 ring-primary/20",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  "text-[10px] text-center leading-tight",
                  isCompleted ? "text-foreground font-medium" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
          style={{ width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%` }}
        />
      </div>
    </div>
  )
}
