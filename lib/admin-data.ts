export interface AdminSeller {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: "active" | "pending" | "suspended"
  kycStatus: "verified" | "pending" | "rejected"
  subscription: "free" | "pro" | "enterprise"
  totalOrders: number
  totalRevenue: number
  rating: number
  joinedAt: Date
  pendingSettlement: number
}

export interface AdminOrder {
  id: string
  sellerName: string
  customerName: string
  riderName: string
  total: number
  platformFee: number
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"
  createdAt: Date
}

export interface Complaint {
  id: string
  orderId: string
  type: "bad_food" | "late_delivery" | "wrong_order" | "other"
  description: string
  status: "open" | "in_progress" | "resolved"
  sellerName: string
  customerName: string
  createdAt: Date
  penalty?: number
}

export interface AdminSettlement {
  id: string
  sellerId: string
  sellerName: string
  date: Date
  deliveryApiCost: number
  platformFee: number
  penalties: number
  subscriptionDue: number
  totalDue: number
  status: "pending" | "paid" | "overdue"
}

export interface AdminStats {
  totalSellers: number
  activeSellers: number
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
  pendingComplaints: number
  pendingSettlements: number
}

export const demoAdminSellers: AdminSeller[] = [
  {
    id: "s1",
    name: "Biryani Blues",
    email: "contact@biryaniblues.com",
    phone: "9876543210",
    address: "45 Brigade Road, Bangalore",
    status: "active",
    kycStatus: "verified",
    subscription: "pro",
    totalOrders: 1250,
    totalRevenue: 425000,
    rating: 4.5,
    joinedAt: new Date("2024-06-15"),
    pendingSettlement: 770,
  },
  {
    id: "s2",
    name: "Pizza Paradise",
    email: "hello@pizzaparadise.com",
    phone: "9123456789",
    address: "78 MG Road, Bangalore",
    status: "active",
    kycStatus: "verified",
    subscription: "pro",
    totalOrders: 980,
    totalRevenue: 352000,
    rating: 4.3,
    joinedAt: new Date("2024-07-20"),
    pendingSettlement: 650,
  },
  {
    id: "s3",
    name: "Dragon Wok",
    email: "info@dragonwok.com",
    phone: "9988776655",
    address: "22 Indiranagar, Bangalore",
    status: "active",
    kycStatus: "verified",
    subscription: "free",
    totalOrders: 560,
    totalRevenue: 168000,
    rating: 4.1,
    joinedAt: new Date("2024-08-10"),
    pendingSettlement: 420,
  },
  {
    id: "s4",
    name: "Burger Barn",
    email: "orders@burgerbarn.com",
    phone: "9444555666",
    address: "100 Whitefield, Bangalore",
    status: "pending",
    kycStatus: "pending",
    subscription: "free",
    totalOrders: 0,
    totalRevenue: 0,
    rating: 0,
    joinedAt: new Date("2024-12-01"),
    pendingSettlement: 0,
  },
  {
    id: "s5",
    name: "South Spice",
    email: "hello@southspice.com",
    phone: "9777888999",
    address: "55 JP Nagar, Bangalore",
    status: "suspended",
    kycStatus: "verified",
    subscription: "pro",
    totalOrders: 320,
    totalRevenue: 96000,
    rating: 3.2,
    joinedAt: new Date("2024-09-05"),
    pendingSettlement: 1500,
  },
]

export const demoAdminOrders: AdminOrder[] = [
  {
    id: "ORD-001",
    sellerName: "Biryani Blues",
    customerName: "Rahul Sharma",
    riderName: "Suresh Kumar",
    total: 696,
    platformFee: 35,
    status: "delivered",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "ORD-002",
    sellerName: "Pizza Paradise",
    customerName: "Priya Patel",
    riderName: "Rajesh Yadav",
    total: 348,
    platformFee: 17,
    status: "out_for_delivery",
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "ORD-003",
    sellerName: "Dragon Wok",
    customerName: "Amit Singh",
    riderName: "Dunzo API",
    total: 487,
    platformFee: 24,
    status: "preparing",
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "ORD-004",
    sellerName: "Biryani Blues",
    customerName: "Neha Gupta",
    riderName: "Pending",
    total: 528,
    platformFee: 26,
    status: "confirmed",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
]

export const demoComplaints: Complaint[] = [
  {
    id: "CMP-001",
    orderId: "ORD-098",
    type: "bad_food",
    description: "Biryani was stale and had a bad smell. Customer requested full refund.",
    status: "open",
    sellerName: "Biryani Blues",
    customerName: "Vikram Reddy",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    penalty: 299,
  },
  {
    id: "CMP-002",
    orderId: "ORD-095",
    type: "wrong_order",
    description: "Customer received vegetarian biryani instead of chicken biryani.",
    status: "in_progress",
    sellerName: "South Spice",
    customerName: "Meera Sharma",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "CMP-003",
    orderId: "ORD-090",
    type: "late_delivery",
    description: "Order arrived 45 minutes late. Food was cold.",
    status: "resolved",
    sellerName: "Pizza Paradise",
    customerName: "Arjun Kumar",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

export const demoAdminSettlements: AdminSettlement[] = [
  {
    id: "SET-001",
    sellerId: "s1",
    sellerName: "Biryani Blues",
    date: new Date(),
    deliveryApiCost: 450,
    platformFee: 320,
    penalties: 0,
    subscriptionDue: 0,
    totalDue: 770,
    status: "pending",
  },
  {
    id: "SET-002",
    sellerId: "s2",
    sellerName: "Pizza Paradise",
    date: new Date(),
    deliveryApiCost: 380,
    platformFee: 270,
    penalties: 0,
    subscriptionDue: 0,
    totalDue: 650,
    status: "pending",
  },
  {
    id: "SET-003",
    sellerId: "s5",
    sellerName: "South Spice",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    deliveryApiCost: 200,
    platformFee: 150,
    penalties: 500,
    subscriptionDue: 999,
    totalDue: 1849,
    status: "overdue",
  },
]

export const adminStats: AdminStats = {
  totalSellers: 156,
  activeSellers: 142,
  totalOrders: 45680,
  todayOrders: 328,
  totalRevenue: 12500000,
  todayRevenue: 98500,
  pendingComplaints: 12,
  pendingSettlements: 8,
}
