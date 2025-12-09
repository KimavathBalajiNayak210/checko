"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Shared Order type used across all apps
export interface SharedOrder {
  id: string
  restaurantId: string
  restaurantName: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    isVeg: boolean
  }[]
  total: number
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "rider_assigned"
    | "out_for_delivery"
    | "arrived"
    | "delivered"
    | "cancelled"
  createdAt: Date
  customerName: string
  customerPhone: string
  deliveryAddress: string
  upiId: string
  // Rider info
  riderType?: "own" | "api" | null
  riderName?: string
  riderPhone?: string
  riderAssignedAt?: Date
  riderMessage?: string
  // Payment
  paymentCompleted: boolean
  // Complaint
  complaint?: {
    id: string
    type: "bad_food" | "missing_item" | "late_delivery" | "other"
    description: string
    images: string[]
    status: "pending" | "accepted" | "rejected" | "replaced"
    createdAt: Date
  }
}

export interface SharedMenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isVeg: boolean
  isBestseller?: boolean
  isAvailable: boolean
}

interface SharedState {
  orders: SharedOrder[]
  menuItems: SharedMenuItem[]
  upiId: string
}

interface SharedContextType extends SharedState {
  // Order actions
  createOrder: (order: Omit<SharedOrder, "id" | "status" | "createdAt" | "paymentCompleted">) => SharedOrder
  updateOrderStatus: (orderId: string, status: SharedOrder["status"]) => void
  acceptOrder: (orderId: string) => void
  rejectOrder: (orderId: string) => void
  assignRider: (orderId: string, riderType: "own" | "api", riderName?: string, riderPhone?: string) => void
  sendRiderMessage: (orderId: string, message: string) => void
  completePayment: (orderId: string) => void
  submitComplaint: (orderId: string, complaint: SharedOrder["complaint"]) => void
  handleComplaint: (orderId: string, action: "accept_replace" | "reject") => void
  // Menu actions
  addMenuItem: (item: Omit<SharedMenuItem, "id">) => void
  updateMenuItem: (itemId: string, updates: Partial<SharedMenuItem>) => void
  deleteMenuItem: (itemId: string) => void
  toggleItemAvailability: (itemId: string) => void
  // Settings
  updateUpiId: (upiId: string) => void
  // Queries
  getOrderById: (orderId: string) => SharedOrder | undefined
  getOrdersByRestaurant: (restaurantId: string) => SharedOrder[]
  getOrdersByCustomer: (customerPhone: string) => SharedOrder[]
  getMenuByRestaurant: (restaurantId: string) => SharedMenuItem[]
}

const SharedContext = createContext<SharedContextType | null>(null)

// Initial demo data
const initialOrders: SharedOrder[] = [
  {
    id: "ORD-DEMO-001",
    restaurantId: "1",
    restaurantName: "Biryani Blues",
    items: [
      { id: "1-1", name: "Hyderabadi Chicken Biryani", price: 299, quantity: 2, isVeg: false },
      { id: "1-4", name: "Raita", price: 49, quantity: 2, isVeg: true },
    ],
    total: 696,
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    deliveryAddress: "123 HSR Layout, Sector 2, Bangalore 560102",
    upiId: "biryaniblues@upi",
    paymentCompleted: false,
  },
]

const initialMenuItems: SharedMenuItem[] = [
  {
    id: "1-1",
    restaurantId: "1",
    name: "Hyderabadi Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken pieces",
    price: 299,
    image: "/flavorful-chicken-biryani.png",
    category: "Biryani",
    isVeg: false,
    isBestseller: true,
    isAvailable: true,
  },
  {
    id: "1-2",
    restaurantId: "1",
    name: "Mutton Biryani",
    description: "Slow-cooked mutton with fragrant spices",
    price: 399,
    image: "/flavorful-mutton-biryani.png",
    category: "Biryani",
    isVeg: false,
    isAvailable: true,
  },
  {
    id: "1-3",
    restaurantId: "1",
    name: "Veg Biryani",
    description: "Mixed vegetables in flavorful rice",
    price: 199,
    image: "/vegetable-biryani.png",
    category: "Biryani",
    isVeg: true,
    isAvailable: true,
  },
  {
    id: "1-4",
    restaurantId: "1",
    name: "Raita",
    description: "Yogurt with cucumber and spices",
    price: 49,
    image: "/raita-yogurt.jpg",
    category: "Sides",
    isVeg: true,
    isAvailable: true,
  },
  {
    id: "1-5",
    restaurantId: "1",
    name: "Mirchi Ka Salan",
    description: "Spicy peanut curry",
    price: 129,
    image: "/mirchi-salan-curry.jpg",
    category: "Sides",
    isVeg: true,
    isBestseller: true,
    isAvailable: false,
  },
]

export function SharedProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SharedState>({
    orders: initialOrders,
    menuItems: initialMenuItems,
    upiId: "biryaniblues@upi",
  })

  const createOrder = useCallback(
    (orderData: Omit<SharedOrder, "id" | "status" | "createdAt" | "paymentCompleted">): SharedOrder => {
      const newOrder: SharedOrder = {
        ...orderData,
        id: `ORD-${Date.now()}`,
        status: "pending",
        createdAt: new Date(),
        paymentCompleted: false,
      }
      setState((prev) => ({
        ...prev,
        orders: [newOrder, ...prev.orders],
      }))
      return newOrder
    },
    [],
  )

  const updateOrderStatus = useCallback((orderId: string, status: SharedOrder["status"]) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
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
                riderPhone: riderPhone || (riderType === "api" ? "Will be assigned" : undefined),
                riderAssignedAt: new Date(),
                status: "rider_assigned" as const,
              }
            : o,
        ),
      }))
    },
    [],
  )

  const sendRiderMessage = useCallback((orderId: string, message: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, riderMessage: message } : o)),
    }))
  }, [])

  const completePayment = useCallback((orderId: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, paymentCompleted: true, status: "delivered" as const } : o,
      ),
    }))
  }, [])

  const submitComplaint = useCallback((orderId: string, complaint: SharedOrder["complaint"]) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, complaint } : o)),
    }))
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

  const addMenuItem = useCallback((item: Omit<SharedMenuItem, "id">) => {
    const newId = `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newItem: SharedMenuItem = {
      ...item,
      id: newId,
    }
    setState((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, newItem],
    }))
  }, [])

  const updateMenuItem = useCallback((itemId: string, updates: Partial<SharedMenuItem>) => {
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

  // Query helpers
  const getOrderById = useCallback(
    (orderId: string) => {
      return state.orders.find((o) => o.id === orderId)
    },
    [state.orders],
  )

  const getOrdersByRestaurant = useCallback(
    (restaurantId: string) => {
      return state.orders.filter((o) => o.restaurantId === restaurantId)
    },
    [state.orders],
  )

  const getOrdersByCustomer = useCallback(
    (customerPhone: string) => {
      return state.orders.filter((o) => o.customerPhone === customerPhone)
    },
    [state.orders],
  )

  const getMenuByRestaurant = useCallback(
    (restaurantId: string) => {
      return state.menuItems.filter((item) => item.restaurantId === restaurantId)
    },
    [state.menuItems],
  )

  return (
    <SharedContext.Provider
      value={{
        ...state,
        createOrder,
        updateOrderStatus,
        acceptOrder,
        rejectOrder,
        assignRider,
        sendRiderMessage,
        completePayment,
        submitComplaint,
        handleComplaint,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        updateUpiId,
        getOrderById,
        getOrdersByRestaurant,
        getOrdersByCustomer,
        getMenuByRestaurant,
      }}
    >
      {children}
    </SharedContext.Provider>
  )
}

export function useSharedStore() {
  const context = useContext(SharedContext)
  if (!context) throw new Error("useSharedStore must be used within SharedProvider")
  return context
}
