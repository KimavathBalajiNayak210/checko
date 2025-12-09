"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"

export function CartSummary() {
  const { items, getTotal, getItemCount } = useCartStore()

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2">
      <Link href="/cart">
        <Button className="w-full h-14 justify-between px-4 shadow-lg">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <span className="font-semibold">
              {getItemCount()} item{getItemCount() > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">₹{getTotal()}</span>
            <span className="text-sm">View Cart</span>
          </div>
        </Button>
      </Link>
    </div>
  )
}
