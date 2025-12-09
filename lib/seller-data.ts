import type { Order } from "./data"

export interface SellerOrder extends Order {
  customerName: string
  customerPhone: string
  riderType: "own" | "api" | null
  riderName?: string
  riderPhone?: string
  paymentVerified: boolean
  complaint?: {
    id: string
    type: "bad_food" | "missing_item" | "late_delivery" | "other"
    description: string
    images: string[]
    status: "pending" | "accepted" | "rejected" | "replaced"
    createdAt: Date
  }
}

export interface Rider {
  id: string
  name: string
  phone: string
  status: "available" | "busy" | "offline"
  currentOrderId?: string
  totalDeliveries: number
  rating: number
  joinedDate: Date
  vehicleType: "bike" | "scooter"
  vehicleNumber: string
}

export interface Settlement {
  id: string
  date: Date
  deliveryApiCost: number
  platformFee: number
  penalties: number
  subscriptionDue: number
  totalDue: number
  status: "pending" | "paid"
  apiOrdersCount: number
  totalOrdersCount: number
  totalRevenue: number
}

export interface SellerStats {
  todayOrders: number
  todayRevenue: number
  pendingOrders: number
  completedOrders: number
}

export interface SellerMenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isVeg: boolean
  isBestseller?: boolean
  isAvailable: boolean
}

export const demoSellerMenuItems: SellerMenuItem[] = [
  {
    id: "1-1",
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
    name: "Veg Biryani",
    description: "Mixed vegetables in flavorful rice",
    price: 199,
    image: "/veg-biryani.jpg",
    category: "Biryani",
    isVeg: true,
    isAvailable: true,
  },
  {
    id: "1-4",
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
    name: "Mirchi Ka Salan",
    description: "Spicy peanut curry",
    price: 129,
    image: "/mirchi-salan.jpg",
    category: "Sides",
    isVeg: true,
    isBestseller: true,
    isAvailable: false,
  },
]

// Demo data for seller dashboard
export const demoSellerOrders: SellerOrder[] = [
  {
    id: "ORD-001",
    restaurantId: "1",
    restaurantName: "Biryani Blues",
    items: [
      {
        id: "1-1",
        name: "Hyderabadi Chicken Biryani",
        description: "Aromatic basmati rice",
        price: 299,
        image: "/flavorful-chicken-biryani.png",
        category: "Biryani",
        isVeg: false,
        quantity: 2,
      },
      {
        id: "1-4",
        name: "Raita",
        description: "Yogurt with cucumber",
        price: 49,
        image: "/raita-yogurt.jpg",
        category: "Sides",
        isVeg: true,
        quantity: 2,
      },
    ],
    total: 696,
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    upiId: "biryaniblues@upi",
    deliveryAddress: "123 HSR Layout, Sector 2, Bangalore 560102",
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    riderType: null,
    paymentVerified: false,
  },
  {
    id: "ORD-002",
    restaurantId: "1",
    restaurantName: "Biryani Blues",
    items: [
      {
        id: "1-3",
        name: "Veg Biryani",
        description: "Mixed vegetables",
        price: 199,
        image: "/veg-biryani.jpg",
        category: "Biryani",
        isVeg: true,
        quantity: 1,
      },
    ],
    total: 199,
    status: "confirmed",
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    upiId: "biryaniblues@upi",
    deliveryAddress: "456 Koramangala, 5th Block, Bangalore",
    customerName: "Priya Patel",
    customerPhone: "9123456789",
    riderType: "own",
    riderName: "Suresh Kumar",
    riderPhone: "9111222333",
    paymentVerified: false,
  },
  {
    id: "ORD-003",
    restaurantId: "1",
    restaurantName: "Biryani Blues",
    items: [
      {
        id: "1-2",
        name: "Mutton Biryani",
        description: "Slow-cooked mutton",
        price: 399,
        image: "/flavorful-mutton-biryani.png",
        category: "Biryani",
        isVeg: false,
        quantity: 1,
      },
      {
        id: "1-5",
        name: "Mirchi Ka Salan",
        description: "Spicy peanut curry",
        price: 129,
        image: "/mirchi-salan.jpg",
        category: "Sides",
        isVeg: true,
        quantity: 1,
      },
    ],
    total: 528,
    status: "out_for_delivery",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    upiId: "biryaniblues@upi",
    deliveryAddress: "789 Indiranagar, 100ft Road, Bangalore",
    customerName: "Amit Singh",
    customerPhone: "9988776655",
    riderType: "api",
    riderName: "Dunzo Partner",
    riderPhone: "API Partner",
    paymentVerified: false,
  },
]

export const demoRiders: Rider[] = [
  {
    id: "r1",
    name: "Suresh Kumar",
    phone: "9111222333",
    status: "available",
    totalDeliveries: 342,
    rating: 4.8,
    joinedDate: new Date("2024-03-15"),
    vehicleType: "bike",
    vehicleNumber: "KA-01-AB-1234",
  },
  {
    id: "r2",
    name: "Rajesh Yadav",
    phone: "9444555666",
    status: "busy",
    currentOrderId: "ORD-002",
    totalDeliveries: 256,
    rating: 4.6,
    joinedDate: new Date("2024-05-20"),
    vehicleType: "scooter",
    vehicleNumber: "KA-01-CD-5678",
  },
  {
    id: "r3",
    name: "Venkat Reddy",
    phone: "9777888999",
    status: "offline",
    totalDeliveries: 189,
    rating: 4.5,
    joinedDate: new Date("2024-07-01"),
    vehicleType: "bike",
    vehicleNumber: "KA-01-EF-9012",
  },
]

export const demoSettlements: Settlement[] = [
  {
    id: "SET-001",
    date: new Date(),
    deliveryApiCost: 450,
    platformFee: 320,
    penalties: 0,
    subscriptionDue: 0,
    totalDue: 770,
    status: "pending",
    apiOrdersCount: 3,
    totalOrdersCount: 12,
    totalRevenue: 6400,
  },
  {
    id: "SET-002",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    deliveryApiCost: 380,
    platformFee: 280,
    penalties: 100,
    subscriptionDue: 0,
    totalDue: 760,
    status: "paid",
    apiOrdersCount: 2,
    totalOrdersCount: 10,
    totalRevenue: 5600,
  },
]
