export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  deliveryTime: string
  distance: string
  image: string
  isOpen: boolean
  upiId: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isVeg: boolean
  isBestseller?: boolean
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface Order {
  id: string
  restaurantId: string
  restaurantName: string
  items: CartItem[]
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
  upiId: string
  deliveryAddress: string
  riderName?: string
  riderPhone?: string
  estimatedDelivery?: string
  riderAssignedAt?: Date
  paymentCompleted?: boolean
  riderMessage?: string
  complaint?: {
    id: string
    type: "bad_food" | "missing_item" | "late_delivery" | "other"
    description: string
    images: string[]
    status: "pending" | "accepted" | "rejected" | "replaced"
    createdAt: Date
  }
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Biryani Blues",
    cuisine: "North Indian • Biryani",
    rating: 4.5,
    deliveryTime: "30-35 min",
    distance: "2.1 km",
    image: "/biryani-indian-restaurant-food.jpg",
    isOpen: true,
    upiId: "biryaniblues@upi",
  },
  {
    id: "2",
    name: "Pizza Paradise",
    cuisine: "Italian • Pizza",
    rating: 4.3,
    deliveryTime: "25-30 min",
    distance: "1.5 km",
    image: "/pizza-italian-restaurant.jpg",
    isOpen: true,
    upiId: "pizzaparadise@upi",
  },
  {
    id: "3",
    name: "Dragon Wok",
    cuisine: "Chinese • Asian",
    rating: 4.1,
    deliveryTime: "35-40 min",
    distance: "3.2 km",
    image: "/chinese-food-noodles-restaurant.jpg",
    isOpen: true,
    upiId: "dragonwok@upi",
  },
  {
    id: "4",
    name: "Burger Barn",
    cuisine: "American • Burgers",
    rating: 4.4,
    deliveryTime: "20-25 min",
    distance: "1.8 km",
    image: "/burger-american-restaurant.jpg",
    isOpen: true,
    upiId: "burgerbarn@upi",
  },
  {
    id: "5",
    name: "South Spice",
    cuisine: "South Indian • Dosa",
    rating: 4.6,
    deliveryTime: "25-30 min",
    distance: "2.5 km",
    image: "/south-indian-dosa-idli-restaurant.jpg",
    isOpen: false,
    upiId: "southspice@upi",
  },
  {
    id: "6",
    name: "Tandoori Nights",
    cuisine: "North Indian • Tandoor",
    rating: 4.2,
    deliveryTime: "35-40 min",
    distance: "4.0 km",
    image: "/tandoori-indian-restaurant-kebab.jpg",
    isOpen: true,
    upiId: "tandoorinights@upi",
  },
]

export const menuItems: Record<string, MenuItem[]> = {
  "1": [
    {
      id: "1-1",
      name: "Hyderabadi Chicken Biryani",
      description: "Aromatic basmati rice with tender chicken pieces",
      price: 299,
      image: "/flavorful-chicken-biryani.png",
      category: "Biryani",
      isVeg: false,
      isBestseller: true,
    },
    {
      id: "1-2",
      name: "Mutton Biryani",
      description: "Slow-cooked mutton with fragrant spices",
      price: 399,
      image: "/flavorful-mutton-biryani.png",
      category: "Biryani",
      isVeg: false,
    },
    {
      id: "1-3",
      name: "Veg Biryani",
      description: "Mixed vegetables in flavorful rice",
      price: 199,
      image: "/veg-biryani.jpg",
      category: "Biryani",
      isVeg: true,
    },
    {
      id: "1-4",
      name: "Raita",
      description: "Yogurt with cucumber and spices",
      price: 49,
      image: "/raita-yogurt.jpg",
      category: "Sides",
      isVeg: true,
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
    },
    {
      id: "1-6",
      name: "Gulab Jamun",
      description: "Sweet milk dumplings",
      price: 79,
      image: "/gulab-jamun-dessert.png",
      category: "Desserts",
      isVeg: true,
    },
  ],
  "2": [
    {
      id: "2-1",
      name: "Margherita Pizza",
      description: "Classic tomato, mozzarella, and basil",
      price: 249,
      image: "/margherita-pizza.png",
      category: "Pizza",
      isVeg: true,
      isBestseller: true,
    },
    {
      id: "2-2",
      name: "Pepperoni Pizza",
      description: "Loaded with spicy pepperoni",
      price: 349,
      image: "/pepperoni-pizza.png",
      category: "Pizza",
      isVeg: false,
    },
    {
      id: "2-3",
      name: "BBQ Chicken Pizza",
      description: "Smoky BBQ sauce with grilled chicken",
      price: 379,
      image: "/bbq-chicken-pizza.png",
      category: "Pizza",
      isVeg: false,
    },
    {
      id: "2-4",
      name: "Garlic Bread",
      description: "Crispy bread with garlic butter",
      price: 99,
      image: "/garlic-bread.png",
      category: "Sides",
      isVeg: true,
    },
    {
      id: "2-5",
      name: "Pasta Alfredo",
      description: "Creamy white sauce pasta",
      price: 229,
      image: "/pasta-alfredo.png",
      category: "Pasta",
      isVeg: true,
    },
  ],
  "3": [
    {
      id: "3-1",
      name: "Hakka Noodles",
      description: "Stir-fried noodles with vegetables",
      price: 179,
      image: "/hakka-noodles.png",
      category: "Noodles",
      isVeg: true,
      isBestseller: true,
    },
    {
      id: "3-2",
      name: "Chicken Manchurian",
      description: "Crispy chicken in tangy sauce",
      price: 249,
      image: "/chicken-manchurian.jpg",
      category: "Main Course",
      isVeg: false,
    },
    {
      id: "3-3",
      name: "Fried Rice",
      description: "Wok-tossed rice with veggies",
      price: 159,
      image: "/fried-rice.png",
      category: "Rice",
      isVeg: true,
    },
    {
      id: "3-4",
      name: "Spring Rolls",
      description: "Crispy rolls with veggie filling",
      price: 129,
      image: "/fresh-spring-rolls.png",
      category: "Starters",
      isVeg: true,
    },
  ],
  "4": [
    {
      id: "4-1",
      name: "Classic Beef Burger",
      description: "Juicy beef patty with fresh veggies",
      price: 199,
      image: "/beef-burger.png",
      category: "Burgers",
      isVeg: false,
      isBestseller: true,
    },
    {
      id: "4-2",
      name: "Chicken Burger",
      description: "Crispy chicken with special sauce",
      price: 179,
      image: "/delicious-chicken-burger.png",
      category: "Burgers",
      isVeg: false,
    },
    {
      id: "4-3",
      name: "Veggie Burger",
      description: "Garden fresh veggie patty",
      price: 149,
      image: "/veggie-burger.png",
      category: "Burgers",
      isVeg: true,
    },
    {
      id: "4-4",
      name: "French Fries",
      description: "Crispy golden fries",
      price: 99,
      image: "/crispy-french-fries.png",
      category: "Sides",
      isVeg: true,
    },
  ],
}

export const categories = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "biryani", name: "Biryani", icon: "🍚" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "chinese", name: "Chinese", icon: "🥡" },
  { id: "burger", name: "Burgers", icon: "🍔" },
  { id: "south-indian", name: "South Indian", icon: "🥘" },
]
