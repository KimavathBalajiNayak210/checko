"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { CartItem, Order } from "./data"

// Cart Store
interface CartState {
  items: CartItem[]
  restaurantId: string | null
}

interface CartContextType extends CartState {
  addItem: (item: CartItem, restaurantId: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [], restaurantId: null })

  const addItem = useCallback((item: CartItem, restaurantId: string) => {
    setState((prev) => {
      if (prev.restaurantId && prev.restaurantId !== restaurantId) {
        return { items: [{ ...item, quantity: 1 }], restaurantId }
      }
      const existingItem = prev.items.find((i) => i.id === item.id)
      if (existingItem) {
        return {
          items: prev.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
          restaurantId,
        }
      }
      return { items: [...prev.items, { ...item, quantity: 1 }], restaurantId }
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setState((prev) => {
      const newItems = prev.items.filter((i) => i.id !== itemId)
      return { items: newItems, restaurantId: newItems.length > 0 ? prev.restaurantId : null }
    })
  }, [])

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId)
        return
      }
      setState((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
      }))
    },
    [removeItem],
  )

  const clearCart = useCallback(() => setState({ items: [], restaurantId: null }), [])

  const getTotal = useCallback(() => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [state.items])

  const getItemCount = useCallback(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }, [state.items])

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartStore() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCartStore must be used within CartProvider")
  return context
}

// Order Store
interface OrderState {
  orders: Order[]
  currentOrder: Order | null
}

interface OrderContextType extends OrderState {
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  setCurrentOrder: (order: Order | null) => void
  assignRider: (orderId: string, riderName: string, riderPhone: string) => void
  sendRiderMessage: (orderId: string, message: string) => void
  completePayment: (orderId: string) => void
  submitComplaint: (orderId: string, complaint: Order["complaint"]) => void
  updateComplaintStatus: (orderId: string, status: "accepted" | "rejected" | "replaced") => void
}

const OrderContext = createContext<OrderContextType | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrderState>({ orders: [], currentOrder: null })

  const addOrder = useCallback((order: Order) => {
    setState((prev) => ({ orders: [order, ...prev.orders], currentOrder: order }))
  }, [])

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setState((prev) => ({
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
      currentOrder: prev.currentOrder?.id === orderId ? { ...prev.currentOrder, status } : prev.currentOrder,
    }))
  }, [])

  const setCurrentOrder = useCallback((order: Order | null) => {
    setState((prev) => ({ ...prev, currentOrder: order }))
  }, [])

  const assignRider = useCallback((orderId: string, riderName: string, riderPhone: string) => {
    setState((prev) => ({
      orders: prev.orders.map((o) =>
        o.id === orderId
          ? { ...o, riderName, riderPhone, riderAssignedAt: new Date(), status: "rider_assigned" as const }
          : o,
      ),
      currentOrder:
        prev.currentOrder?.id === orderId
          ? {
              ...prev.currentOrder,
              riderName,
              riderPhone,
              riderAssignedAt: new Date(),
              status: "rider_assigned" as const,
            }
          : prev.currentOrder,
    }))
  }, [])

  const sendRiderMessage = useCallback((orderId: string, message: string) => {
    setState((prev) => ({
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, riderMessage: message } : o)),
      currentOrder:
        prev.currentOrder?.id === orderId ? { ...prev.currentOrder, riderMessage: message } : prev.currentOrder,
    }))
  }, [])

  const completePayment = useCallback((orderId: string) => {
    setState((prev) => ({
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, paymentCompleted: true, status: "delivered" as const } : o,
      ),
      currentOrder:
        prev.currentOrder?.id === orderId
          ? { ...prev.currentOrder, paymentCompleted: true, status: "delivered" as const }
          : prev.currentOrder,
    }))
  }, [])

  const submitComplaint = useCallback((orderId: string, complaint: Order["complaint"]) => {
    setState((prev) => ({
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, complaint } : o)),
      currentOrder: prev.currentOrder?.id === orderId ? { ...prev.currentOrder, complaint } : prev.currentOrder,
    }))
  }, [])

  const updateComplaintStatus = useCallback((orderId: string, status: "accepted" | "rejected" | "replaced") => {
    setState((prev) => ({
      orders: prev.orders.map((o) =>
        o.id === orderId && o.complaint ? { ...o, complaint: { ...o.complaint, status } } : o,
      ),
      currentOrder:
        prev.currentOrder?.id === orderId && prev.currentOrder.complaint
          ? { ...prev.currentOrder, complaint: { ...prev.currentOrder.complaint, status } }
          : prev.currentOrder,
    }))
  }, [])

  return (
    <OrderContext.Provider
      value={{
        ...state,
        addOrder,
        updateOrderStatus,
        setCurrentOrder,
        assignRider,
        sendRiderMessage,
        completePayment,
        submitComplaint,
        updateComplaintStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrderStore() {
  const context = useContext(OrderContext)
  if (!context) throw new Error("useOrderStore must be used within OrderProvider")
  return context
}

// ... existing code (UserStore and StoreProvider) ...
// User Store
interface UserState {
  address: string
  phone: string
  name: string
}

interface UserContextType extends UserState {
  setAddress: (address: string) => void
  setPhone: (phone: string) => void
  setName: (name: string) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>({ address: "", phone: "", name: "" })

  const setAddress = useCallback((address: string) => setState((prev) => ({ ...prev, address })), [])
  const setPhone = useCallback((phone: string) => setState((prev) => ({ ...prev, phone })), [])
  const setName = useCallback((name: string) => setState((prev) => ({ ...prev, name })), [])

  return <UserContext.Provider value={{ ...state, setAddress, setPhone, setName }}>{children}</UserContext.Provider>
}

export function useUserStore() {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUserStore must be used within UserProvider")
  return context
}

// Combined Provider
export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <OrderProvider>
        <UserProvider>{children}</UserProvider>
      </OrderProvider>
    </CartProvider>
  )
}
