"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { RiderDelivery, RiderStats } from "./rider-data"
import { demoDeliveries, riderStats as initialStats } from "./rider-data"

interface RiderState {
  deliveries: RiderDelivery[]
  stats: RiderStats
  isOnline: boolean
}

interface RiderContextType extends RiderState {
  acceptDelivery: (deliveryId: string) => void
  markPickedUp: (deliveryId: string) => void
  markDelivered: (deliveryId: string) => void
  toggleOnline: () => void
  getActiveDelivery: () => RiderDelivery | undefined
}

const RiderContext = createContext<RiderContextType | null>(null)

export function RiderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RiderState>({
    deliveries: demoDeliveries,
    stats: initialStats,
    isOnline: true,
  })

  const acceptDelivery = useCallback((deliveryId: string) => {
    setState((prev) => ({
      ...prev,
      deliveries: prev.deliveries.map((d) => (d.id === deliveryId ? { ...d, status: "accepted" as const } : d)),
    }))
  }, [])

  const markPickedUp = useCallback((deliveryId: string) => {
    setState((prev) => ({
      ...prev,
      deliveries: prev.deliveries.map((d) => (d.id === deliveryId ? { ...d, status: "picked_up" as const } : d)),
    }))
  }, [])

  const markDelivered = useCallback((deliveryId: string) => {
    setState((prev) => {
      const delivery = prev.deliveries.find((d) => d.id === deliveryId)
      return {
        ...prev,
        deliveries: prev.deliveries.map((d) => (d.id === deliveryId ? { ...d, status: "delivered" as const } : d)),
        stats: {
          ...prev.stats,
          todayDeliveries: prev.stats.todayDeliveries + 1,
          todayEarnings: prev.stats.todayEarnings + (delivery?.earnings || 0),
          totalDeliveries: prev.stats.totalDeliveries + 1,
        },
      }
    })
  }, [])

  const toggleOnline = useCallback(() => {
    setState((prev) => ({ ...prev, isOnline: !prev.isOnline }))
  }, [])

  const getActiveDelivery = useCallback(() => {
    return state.deliveries.find((d) => d.status === "accepted" || d.status === "picked_up")
  }, [state.deliveries])

  return (
    <RiderContext.Provider
      value={{ ...state, acceptDelivery, markPickedUp, markDelivered, toggleOnline, getActiveDelivery }}
    >
      {children}
    </RiderContext.Provider>
  )
}

export function useRiderStore() {
  const context = useContext(RiderContext)
  if (!context) throw new Error("useRiderStore must be used within RiderProvider")
  return context
}
