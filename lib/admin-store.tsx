"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { AdminSeller, AdminOrder, Complaint, AdminSettlement, AdminStats } from "./admin-data"
import {
  demoAdminSellers,
  demoAdminOrders,
  demoComplaints,
  demoAdminSettlements,
  adminStats as initialStats,
} from "./admin-data"

interface AdminState {
  sellers: AdminSeller[]
  orders: AdminOrder[]
  complaints: Complaint[]
  settlements: AdminSettlement[]
  stats: AdminStats
}

interface AdminContextType extends AdminState {
  approveSeller: (sellerId: string) => void
  suspendSeller: (sellerId: string) => void
  activateSeller: (sellerId: string) => void
  resolveComplaint: (complaintId: string) => void
  applyPenalty: (complaintId: string, amount: number) => void
  markSettlementPaid: (settlementId: string) => void
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>({
    sellers: demoAdminSellers,
    orders: demoAdminOrders,
    complaints: demoComplaints,
    settlements: demoAdminSettlements,
    stats: initialStats,
  })

  const approveSeller = useCallback((sellerId: string) => {
    setState((prev) => ({
      ...prev,
      sellers: prev.sellers.map((s) =>
        s.id === sellerId ? { ...s, status: "active" as const, kycStatus: "verified" as const } : s,
      ),
    }))
  }, [])

  const suspendSeller = useCallback((sellerId: string) => {
    setState((prev) => ({
      ...prev,
      sellers: prev.sellers.map((s) => (s.id === sellerId ? { ...s, status: "suspended" as const } : s)),
    }))
  }, [])

  const activateSeller = useCallback((sellerId: string) => {
    setState((prev) => ({
      ...prev,
      sellers: prev.sellers.map((s) => (s.id === sellerId ? { ...s, status: "active" as const } : s)),
    }))
  }, [])

  const resolveComplaint = useCallback((complaintId: string) => {
    setState((prev) => ({
      ...prev,
      complaints: prev.complaints.map((c) => (c.id === complaintId ? { ...c, status: "resolved" as const } : c)),
    }))
  }, [])

  const applyPenalty = useCallback((complaintId: string, amount: number) => {
    setState((prev) => ({
      ...prev,
      complaints: prev.complaints.map((c) =>
        c.id === complaintId ? { ...c, status: "resolved" as const, penalty: amount } : c,
      ),
    }))
  }, [])

  const markSettlementPaid = useCallback((settlementId: string) => {
    setState((prev) => ({
      ...prev,
      settlements: prev.settlements.map((s) => (s.id === settlementId ? { ...s, status: "paid" as const } : s)),
    }))
  }, [])

  return (
    <AdminContext.Provider
      value={{
        ...state,
        approveSeller,
        suspendSeller,
        activateSeller,
        resolveComplaint,
        applyPenalty,
        markSettlementPaid,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdminStore() {
  const context = useContext(AdminContext)
  if (!context) throw new Error("useAdminStore must be used within AdminProvider")
  return context
}
