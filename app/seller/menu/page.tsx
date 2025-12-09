"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Leaf, Search, Save, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SellerNav } from "@/components/seller/seller-nav"
import { useSharedStore, type SharedMenuItem } from "@/lib/shared-store"

const RESTAURANT_ID = "1" // Current seller's restaurant ID

export default function SellerMenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability } = useSharedStore()

  // Filter menu items for this restaurant
  const restaurantMenuItems = menuItems.filter((item) => item.restaurantId === RESTAURANT_ID)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SharedMenuItem | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: true,
    isBestseller: false,
    image: "/generic-food-item.png",
  })

  const filteredMenu = restaurantMenuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const categories = [...new Set(restaurantMenuItems.map((item) => item.category))]

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      isVeg: true,
      isBestseller: false,
      image: "/generic-food-item.png",
    })
    setNewCategory("")
  }

  const handleAddItem = () => {
    const categoryToUse = formData.category === "__new__" ? newCategory : formData.category
    if (!formData.name || !formData.price || !categoryToUse) {
      alert("Please fill in Name, Price, and Category")
      return
    }

    addMenuItem({
      restaurantId: RESTAURANT_ID,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: categoryToUse,
      isVeg: formData.isVeg,
      isBestseller: formData.isBestseller,
      image: formData.image,
      isAvailable: true,
    })
    setIsAddModalOpen(false)
    resetForm()
  }

  const handleEditClick = (item: SharedMenuItem) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      isBestseller: item.isBestseller || false,
      image: item.image,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateItem = () => {
    const categoryToUse = formData.category === "__new__" ? newCategory : formData.category
    if (!selectedItem || !formData.name || !formData.price || !categoryToUse) {
      alert("Please fill in Name, Price, and Category")
      return
    }

    updateMenuItem(selectedItem.id, {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: categoryToUse,
      isVeg: formData.isVeg,
      isBestseller: formData.isBestseller,
      image: formData.image,
    })
    setIsEditModalOpen(false)
    setSelectedItem(null)
    resetForm()
  }

  const handleDeleteClick = (item: SharedMenuItem) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedItem) {
      deleteMenuItem(selectedItem.id)
    }
    setIsDeleteDialogOpen(false)
    setSelectedItem(null)
  }

  const MenuItemForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Chicken Biryani"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of the item"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            placeholder="299"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(val) => {
              setFormData({ ...formData, category: val })
              if (val !== "__new__") setNewCategory("")
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
              <SelectItem value="__new__">+ Add New Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {formData.category === "__new__" && (
        <div className="space-y-2">
          <Label htmlFor="newCategory">New Category Name *</Label>
          <Input
            id="newCategory"
            placeholder="e.g., Desserts, Beverages"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isVeg}
            onCheckedChange={(checked) => setFormData({ ...formData, isVeg: checked })}
          />
          <Label className="flex items-center gap-1">
            <Leaf className="h-4 w-4 text-accent" />
            Vegetarian
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isBestseller}
            onCheckedChange={(checked) => setFormData({ ...formData, isBestseller: checked })}
          />
          <Label>Bestseller</Label>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Item Image</Label>
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
            {formData.image ? (
              <Image
                src={formData.image || "/placeholder.svg"}
                alt="Preview"
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <Input
            type="text"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
            resetForm()
          }}
          className="bg-transparent"
        >
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          <Save className="mr-1.5 h-4 w-4" />
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 md:block">
        <div className="sticky top-0 p-4">
          <h1 className="mb-6 text-xl font-bold text-foreground">QuickBite Seller</h1>
          <SellerNav />
        </div>
      </aside>

      <main className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground md:text-2xl">Menu Management</h1>
              <p className="text-sm text-muted-foreground">
                {restaurantMenuItems.length} items • {restaurantMenuItems.filter((i) => i.isAvailable).length} available
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                resetForm()
                setIsAddModalOpen(true)
              }}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Item
            </Button>
          </div>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              className="pl-9 bg-secondary border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="p-4 space-y-6 md:p-6">
          {categories.map((category) => {
            const categoryItems = filteredMenu.filter((item) => item.category === category)
            if (categoryItems.length === 0) return null

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-foreground">{category}</h2>
                  <Badge variant="outline" className="bg-transparent">
                    {categoryItems.length} items
                  </Badge>
                </div>
                <div className="space-y-3">
                  {categoryItems.map((item) => (
                    <Card key={item.id} className={!item.isAvailable ? "opacity-60" : ""}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            {!item.isAvailable && (
                              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                <span className="text-xs font-medium text-muted-foreground">Unavailable</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  {item.isVeg ? (
                                    <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-accent">
                                      <Leaf className="h-2.5 w-2.5 text-accent" />
                                    </span>
                                  ) : (
                                    <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-destructive">
                                      <span className="h-2 w-2 rounded-full bg-destructive" />
                                    </span>
                                  )}
                                  <h3 className="font-medium text-foreground">{item.name}</h3>
                                  {item.isBestseller && (
                                    <Badge className="bg-primary/10 text-primary text-xs">Bestseller</Badge>
                                  )}
                                </div>
                                <p className="mt-1 text-sm font-semibold text-foreground">₹{item.price}</p>
                                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={item.isAvailable}
                                  onCheckedChange={() => toggleItemAvailability(item.id)}
                                />
                              </div>
                            </div>
                            <div className="mt-2 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 bg-transparent"
                                onClick={() => handleEditClick(item)}
                              >
                                <Pencil className="mr-1 h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-destructive hover:text-destructive bg-transparent"
                                onClick={() => handleDeleteClick(item)}
                              >
                                <Trash2 className="mr-1 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}

          {filteredMenu.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No menu items found</p>
              <Button
                className="mt-4"
                onClick={() => {
                  resetForm()
                  setIsAddModalOpen(true)
                }}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Your First Item
              </Button>
            </div>
          )}
        </div>
      </main>

      <div className="md:hidden">
        <SellerNav />
      </div>

      {/* Add Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <MenuItemForm onSubmit={handleAddItem} submitLabel="Add Item" />
        </DialogContent>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <MenuItemForm onSubmit={handleUpdateItem} submitLabel="Save Changes" />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
