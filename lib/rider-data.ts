export interface RiderDelivery {
  id: string
  orderId: string
  restaurantName: string
  restaurantAddress: string
  restaurantPhone: string
  customerName: string
  customerAddress: string
  customerPhone: string
  items: { name: string; quantity: number }[]
  total: number
  upiId: string
  status: "pending" | "accepted" | "picked_up" | "delivered"
  distance: string
  estimatedTime: string
  earnings: number
  createdAt: Date
}

export interface RiderStats {
  todayDeliveries: number
  todayEarnings: number
  totalDeliveries: number
  rating: number
}

export const demoDeliveries: RiderDelivery[] = [
  {
    id: "DEL-001",
    orderId: "ORD-001",
    restaurantName: "Biryani Blues",
    restaurantAddress: "45 Brigade Road, Bangalore",
    restaurantPhone: "9876543210",
    customerName: "Rahul Sharma",
    customerAddress: "123 HSR Layout, Sector 2, Bangalore 560102",
    customerPhone: "9876543210",
    items: [
      { name: "Hyderabadi Chicken Biryani", quantity: 2 },
      { name: "Raita", quantity: 2 },
    ],
    total: 696,
    upiId: "biryaniblues@upi",
    status: "pending",
    distance: "3.2 km",
    estimatedTime: "15 min",
    earnings: 45,
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "DEL-002",
    orderId: "ORD-004",
    restaurantName: "Pizza Paradise",
    restaurantAddress: "78 MG Road, Bangalore",
    restaurantPhone: "9123456789",
    customerName: "Priya Patel",
    customerAddress: "456 Koramangala, 5th Block, Bangalore",
    customerPhone: "9123456789",
    items: [
      { name: "Margherita Pizza", quantity: 1 },
      { name: "Garlic Bread", quantity: 1 },
    ],
    total: 348,
    upiId: "pizzaparadise@upi",
    status: "accepted",
    distance: "2.5 km",
    estimatedTime: "12 min",
    earnings: 40,
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "DEL-003",
    orderId: "ORD-005",
    restaurantName: "Dragon Wok",
    restaurantAddress: "22 Indiranagar, Bangalore",
    restaurantPhone: "9988776655",
    customerName: "Amit Singh",
    customerAddress: "789 Indiranagar, 100ft Road, Bangalore",
    customerPhone: "9988776655",
    items: [
      { name: "Hakka Noodles", quantity: 2 },
      { name: "Spring Rolls", quantity: 1 },
    ],
    total: 487,
    upiId: "dragonwok@upi",
    status: "picked_up",
    distance: "1.8 km",
    estimatedTime: "8 min",
    earnings: 35,
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
  },
]

export const riderStats: RiderStats = {
  todayDeliveries: 8,
  todayEarnings: 420,
  totalDeliveries: 156,
  rating: 4.8,
}
