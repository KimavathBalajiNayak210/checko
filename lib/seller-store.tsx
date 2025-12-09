"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { SellerOrder, Rider, Settlement, SellerMenuItem } from "./seller-data"
import { demoSellerOrders, demoRiders, demoSettlements, demoSellerMenuItems } from "./seller-data"

interface SellerState {
  orders: SellerOrder[]
  riders: Rider[]
  settlements: Settlement[]
  menuItems: SellerMenuItem[]
  upiId: string
  restaurantName: string
}

interface SellerContextType extends SellerState {
  updateOrderStatus: (orderId: string, status: SellerOrder["status"]) => void
  assignRider: (orderId: string, riderType: "own" | "api", riderName?: string, riderPhone?: string) => void
  verifyPayment: (orderId: string) => void
  acceptOrder: (orderId: string) => void
  rejectOrder: (orderId: string) => void
  addMenuItem: (item: Omit<SellerMenuItem, "id">) => void
  updateMenuItem: (itemId: string, updates: Partial<SellerMenuItem>) => void
  deleteMenuItem: (itemId: string) => void
  toggleItemAvailability: (itemId: string) => void
  updateUpiId: (upiId: string) => void
  handleComplaint: (orderId: string, action: "accept_replace" | "reject") => void
  getStats: () => {
    todayOrders: number
    todayRevenue: number
    pendingOrders: number
    preparingOrders: number
    outForDelivery: number
    completed: number
  }
}

const SellerContext = createContext<SellerContextType | null>(null)

export function SellerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SellerState>({
    orders: demoSellerOrders,
    riders: demoRiders,
    settlements: demoSettlements,
    menuItems: demoSellerMenuItems,
    upiId: "biryaniblues@upi",
    restaurantName: "Biryani Blues",
  })

  const updateOrderStatus = useCallback((orderId: string, status: SellerOrder["status"]) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }))
  }, [])

  const assignRider = useCallback(
    (orderId: string, riderType: "own" | "api", riderName?: string, riderPhone?: string) => {
      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                riderType,
                riderName: riderName || (riderType === "api" ? "Dunzo Partner" : undefined),
                riderPhone: riderPhone || (riderType === "api" ? "API Partner" : undefined),
                status: "rider_assigned" as const,
              }
            : o,
        ),
        riders: prev.riders.map((r) =>
          r.name === riderName ? { ...r, status: "busy" as const, currentOrderId: orderId } : r,
        ),
      }))
    },
    [],
  )

  const verifyPayment = useCallback((orderId: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, paymentVerified: true, status: "delivered" as const } : o,
      ),
    }))
  }, [])

  const acceptOrder = useCallback((orderId: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status: "confirmed" as const } : o)),
    }))
  }, [])

  const rejectOrder = useCallback((orderId: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status: "cancelled" as const } : o)),
    }))
  }, [])

  const addMenuItem = useCallback((item: Omit<SellerMenuItem, "id">) => {
    const newItem: SellerMenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
    }
    setState((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, newItem],
    }))
  }, [])

  const updateMenuItem = useCallback((itemId: string, updates: Partial<SellerMenuItem>) => {
    setState((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    }))
  }, [])

  const deleteMenuItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      menuItems: prev.menuItems.filter((item) => item.id !== itemId),
    }))
  }, [])

  const toggleItemAvailability = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item,
      ),
    }))
  }, [])

  const updateUpiId = useCallback((upiId: string) => {
    setState((prev) => ({ ...prev, upiId }))
  }, [])

  const handleComplaint = useCallback((orderId: string, action: "accept_replace" | "reject") => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId && o.complaint
          ? {
              ...o,
              complaint: {
                ...o.complaint,
                status: action === "accept_replace" ? ("replaced" as const) : ("rejected" as const),
              },
            }
          : o,
      ),
    }))
  }, [])

  const getStats = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayOrders = state.orders.filter((o) => new Date(o.createdAt) >= today)

    return {
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0),
      pendingOrders: state.orders.filter((o) => o.status === "pending").length,
      preparingOrders: state.orders.filter((o) => o.status === "confirmed" || o.status === "preparing").length,
      outForDelivery: state.orders.filter((o) => o.status === "out_for_delivery").length,
      completed: state.orders.filter((o) => o.status === "delivered").length,
    }
  }, [state.orders])

  return (
    <SellerContext.Provider
      value={{
        ...state,
        updateOrderStatus,
        assignRider,
        verifyPayment,
        acceptOrder,
        rejectOrder,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        updateUpiId,
        handleComplaint,
        getStats,
      }}
    >
      {children}
    </SellerContext.Provider>
  )
}

export function useSellerStore() {
  const context = useContext(SellerContext)
  if (!context) throw new Error("useSellerStore must be used within SellerProvider")
  return context
}
