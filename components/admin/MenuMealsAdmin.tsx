"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Utensils, Coffee, Sun, Moon, Check, Filter } from "lucide-react"
import type { Tables } from "@/integrations/supabase/types"
import { AIButton } from "@/components/admin/AIButton"

type MealItem = Tables<"meal_items">
type MealTimeFilter = 'all' | 'breakfast' | 'lunch' | 'dinner'

export const MenuMealsAdmin = () => {
  const [mealItems, setMealItems] = useState<MealItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MealItem | null>(null)
  const [activeFilter, setActiveFilter] = useState<MealTimeFilter>('all')
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "main",
    is_breakfast: false,
    is_lunch: false,
    is_dinner: false,
    is_vegetarian: true,
    spice_level: "medium",
  })

  useEffect(() => {
    fetchMealItems()
  }, [])

  const fetchMealItems = async () => {
    try {
      const { data, error } = await supabase
        .from("meal_items")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        toast({
          title: "Error fetching meal items",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setMealItems(data || [])
      }
    } catch (error: any) {
      toast({
        title: "Error fetching meal items",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const itemData = {
      name: formData.name,
      price: formData.price,
      description: formData.description,
      category: formData.category,
      is_breakfast: formData.is_breakfast,
      is_lunch: formData.is_lunch,
      is_dinner: formData.is_dinner,
      is_vegetarian: formData.is_vegetarian,
      spice_level: formData.spice_level,
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("meal_items")
          .update(itemData)
          .eq("id", editingItem.id)

        if (error) throw error
        toast({ title: "Meal item updated successfully!" })
      } else {
        const { error } = await supabase
          .from("meal_items")
          .insert([itemData])

        if (error) throw error
        toast({ title: "Meal item created successfully!" })
      }

      fetchMealItems()
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error saving meal item",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: MealItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description || "",
      category: item.category || "main",
      is_breakfast: item.is_breakfast || false,
      is_lunch: item.is_lunch || false,
      is_dinner: item.is_dinner || false,
      is_vegetarian: item.is_vegetarian ?? true,
      spice_level: item.spice_level || "medium",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meal item?")) return

    try {
      const { error } = await supabase
        .from("meal_items")
        .delete()
        .eq("id", id)

      if (error) throw error
      toast({ title: "Meal item deleted successfully!" })
      fetchMealItems()
    } catch (error: any) {
      toast({
        title: "Error deleting meal item",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "main",
      is_breakfast: false,
      is_lunch: false,
      is_dinner: false,
      is_vegetarian: true,
      spice_level: "medium",
    })
    setEditingItem(null)
    setIsDialogOpen(false)
  }

  const toggleMealTime = (time: 'breakfast' | 'lunch' | 'dinner') => {
    setFormData(prev => ({
      ...prev,
      is_breakfast: time === 'breakfast' ? !prev.is_breakfast : prev.is_breakfast,
      is_lunch: time === 'lunch' ? !prev.is_lunch : prev.is_lunch,
      is_dinner: time === 'dinner' ? !prev.is_dinner : prev.is_dinner,
    }))
  }

  const getMealTimeBadges = (item: MealItem) => {
    const badges = []
    if (item.is_breakfast) badges.push("Breakfast")
    if (item.is_lunch) badges.push("Lunch")
    if (item.is_dinner) badges.push("Dinner")
    return badges
  }

  const filterMealItems = (items: MealItem[], filter: MealTimeFilter) => {
    if (filter === 'all') return items
    if (filter === 'breakfast') return items.filter(item => item.is_breakfast)
    if (filter === 'lunch') return items.filter(item => item.is_lunch)
    if (filter === 'dinner') return items.filter(item => item.is_dinner)
    return items
  }

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'main': return 'Main Course'
      case 'starter': return 'Starter'
      case 'dessert': return 'Dessert'
      case 'beverage': return 'Beverage'
      case 'snack': return 'Snack'
      default: return category
    }
  }

  const filteredItems = filterMealItems(mealItems, activeFilter)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Menu & Meals Management</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Menu & Meals Management</h2>
          <p className="text-muted-foreground">
            Manage all meal items ({mealItems.length} total)
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Meal Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Meal Item" : "Add New Meal Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="name">Dish Name</Label>
                  <AIButton
                    title={formData.name}
                    contentType="mealPlan"
                    onContentGenerated={(aiContent) => {
                      setFormData(prev => ({
                        ...prev,
                        description: aiContent.description || prev.description,
                        price: aiContent.price || prev.price,
                        category: aiContent.category || prev.category,
                        spice_level: aiContent.spice_level || prev.spice_level,
                        is_vegetarian: aiContent.is_vegetarian ?? prev.is_vegetarian,
                        is_breakfast: aiContent.meal_times?.includes('breakfast') || prev.is_breakfast,
                        is_lunch: aiContent.meal_times?.includes('lunch') || prev.is_lunch,
                        is_dinner: aiContent.meal_times?.includes('dinner') || prev.is_dinner,
                      }))
                    }}
                  />
                </div>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chole Bhature"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 120"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Masala special chole bhature with pickle"
                  rows={3}
                />
              </div>

              <div>
                <Label className="mb-2 block">Meal Times</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={formData.is_breakfast ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMealTime('breakfast')}
                    className="gap-2"
                  >
                    <Coffee className="h-4 w-4" />
                    Breakfast
                  </Button>
                  <Button
                    type="button"
                    variant={formData.is_lunch ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMealTime('lunch')}
                    className="gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Lunch
                  </Button>
                  <Button
                    type="button"
                    variant={formData.is_dinner ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMealTime('dinner')}
                    className="gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Dinner
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Select when this dish is typically served
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="main">Main Course</option>
                    <option value="starter">Starter</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="spice_level">Spice Level</Label>
                  <select
                    id="spice_level"
                    value={formData.spice_level}
                    onChange={(e) => setFormData({ ...formData, spice_level: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="spicy">Spicy</option>
                    <option value="very_spicy">Very Spicy</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_vegetarian"
                  checked={formData.is_vegetarian}
                  onChange={(e) => setFormData({ ...formData, is_vegetarian: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="is_vegetarian" className="text-sm">
                  Vegetarian
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingItem ? "Update" : "Create"} Meal Item
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by meal time:</span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              All Items ({mealItems.length})
            </Button>
            <Button
              variant={activeFilter === 'breakfast' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('breakfast')}
              className="gap-2"
            >
              <Coffee className="w-4 h-4" />
              Breakfast ({mealItems.filter(item => item.is_breakfast).length})
            </Button>
            <Button
              variant={activeFilter === 'lunch' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('lunch')}
              className="gap-2"
            >
              <Sun className="w-4 h-4" />
              Lunch ({mealItems.filter(item => item.is_lunch).length})
            </Button>
            <Button
              variant={activeFilter === 'dinner' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('dinner')}
              className="gap-2"
            >
              <Moon className="w-4 h-4" />
              Dinner ({mealItems.filter(item => item.is_dinner).length})
            </Button>
          </div>
        </div>

      </div>

      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {activeFilter === 'all' ? 'No meal items yet' : `No items found for ${activeFilter}`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeFilter === 'all' 
                ? 'Get started by creating your first meal item.'
                : 'Try selecting a different filter or create a new item.'}
            </p>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              {activeFilter === 'all' ? 'Create First Meal Item' : 'Create New Item'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {getCategoryName(item.category)}
                      </span>
                      {item.is_vegetarian && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          <Check className="w-3 h-3 inline mr-1" /> Veg
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-primary text-lg">₹{item.price}</span>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mb-3">
                  {getMealTimeBadges(item).map((badge) => (
                    <span
                      key={badge}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                    >
                      {badge}
                    </span>
                  ))}
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded capitalize">
                    {item.spice_level}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}