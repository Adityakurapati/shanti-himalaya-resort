"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Utensils, Clock } from "lucide-react"

interface MealPlan {
  id: string
  name: string
  price: string
  description: string
  breakfast: string[]
  lunch: string[]
  dinner: string[]
  badge: string
}

interface DiningSchedule {
  id: string
  meal_type: string
  time: string
  description: string
}

export const MenuMealsAdmin = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [schedules, setSchedules] = useState<DiningSchedule[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<DiningSchedule | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    breakfast: "",
    lunch: "",
    dinner: "",
    badge: "",
  })
  const [scheduleForm, setScheduleForm] = useState({ meal_type: "", time: "", description: "" })
  const { toast } = useToast()

  useEffect(() => {
    fetchMealPlans()
    fetchSchedules()
  }, [])

  const fetchMealPlans = async () => {
    const { data, error } = await supabase.from("meal_plans").select("*").order("created_at", { ascending: false })

    if (error) {
      toast({
        title: "Error fetching meal plans",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setMealPlans(data || [])
    }
  }

  const fetchSchedules = async () => {
    const { data, error } = await supabase.from("dining_schedule").select("*").order("meal_type", { ascending: true })

    if (error) {
      toast({ title: "Error fetching schedule", description: error.message, variant: "destructive" })
    } else {
      setSchedules(data || [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const planData = {
      name: formData.name,
      price: formData.price,
      description: formData.description,
      breakfast: formData.breakfast.split("\n").filter((item) => item.trim()),
      lunch: formData.lunch.split("\n").filter((item) => item.trim()),
      dinner: formData.dinner.split("\n").filter((item) => item.trim()),
      badge: formData.badge,
    }

    if (editingPlan) {
      const { error } = await supabase.from("meal_plans").update(planData).eq("id", editingPlan.id)

      if (error) {
        toast({
          title: "Error updating meal plan",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({ title: "Meal plan updated successfully!" })
        fetchMealPlans()
        resetForm()
      }
    } else {
      const { error } = await supabase.from("meal_plans").insert([planData])

      if (error) {
        toast({
          title: "Error creating meal plan",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({ title: "Meal plan created successfully!" })
        fetchMealPlans()
        resetForm()
      }
    }
  }

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...scheduleForm }

    if (editingSchedule) {
      const { error } = await supabase.from("dining_schedule").update(payload).eq("id", editingSchedule.id)
      if (error) {
        toast({ title: "Error updating schedule", description: error.message, variant: "destructive" })
      } else {
        toast({ title: "Schedule updated!" })
        fetchSchedules()
        resetScheduleForm()
      }
    } else {
      const { error } = await supabase.from("dining_schedule").insert([payload])
      if (error) {
        toast({ title: "Error creating schedule", description: error.message, variant: "destructive" })
      } else {
        toast({ title: "Schedule added!" })
        fetchSchedules()
        resetScheduleForm()
      }
    }
  }

  const handleEdit = (plan: MealPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      price: plan.price,
      description: plan.description,
      breakfast: plan.breakfast.join("\n"),
      lunch: plan.lunch.join("\n"),
      dinner: plan.dinner.join("\n"),
      badge: plan.badge,
    })
    setIsDialogOpen(true)
  }

  const handleScheduleEdit = (item: DiningSchedule) => {
    setEditingSchedule(item)
    setScheduleForm({ meal_type: item.meal_type, time: item.time, description: item.description })
    setIsScheduleDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this meal plan?")) {
      const { error } = await supabase.from("meal_plans").delete().eq("id", id)

      if (error) {
        toast({
          title: "Error deleting meal plan",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({ title: "Meal plan deleted successfully!" })
        fetchMealPlans()
      }
    }
  }

  const handleScheduleDelete = async (id: string) => {
    if (confirm("Delete this schedule entry?")) {
      const { error } = await supabase.from("dining_schedule").delete().eq("id", id)
      if (error) {
        toast({ title: "Error deleting schedule", description: error.message, variant: "destructive" })
      } else {
        toast({ title: "Schedule deleted!" })
        fetchSchedules()
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      breakfast: "",
      lunch: "",
      dinner: "",
      badge: "",
    })
    setEditingPlan(null)
    setIsDialogOpen(false)
  }

  const resetScheduleForm = () => {
    setScheduleForm({ meal_type: "", time: "", description: "" })
    setEditingSchedule(null)
    setIsScheduleDialogOpen(false)
  }

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Utensils className="w-6 h-6" />
            Menu & Meals Management
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Meal Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPlan ? "Edit Meal Plan" : "Add New Meal Plan"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="breakfast">Breakfast Items (one per line)</Label>
                  <Textarea
                    id="breakfast"
                    value={formData.breakfast}
                    onChange={(e) => setFormData({ ...formData, breakfast: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lunch">Lunch Items (one per line)</Label>
                  <Textarea
                    id="lunch"
                    value={formData.lunch}
                    onChange={(e) => setFormData({ ...formData, lunch: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dinner">Dinner Items (one per line)</Label>
                  <Textarea
                    id="dinner"
                    value={formData.dinner}
                    onChange={(e) => setFormData({ ...formData, dinner: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="badge">Badge (e.g., Popular, Premium)</Label>
                  <Input
                    id="badge"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingPlan ? "Update" : "Create"} Meal Plan
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  <span className="text-sm font-normal text-primary">{plan.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong>Breakfast:</strong> {plan.breakfast.join(", ")}
                  </div>
                  <div>
                    <strong>Lunch:</strong> {plan.lunch.join(", ")}
                  </div>
                  <div>
                    <strong>Dinner:</strong> {plan.dinner.join(", ")}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(plan)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(plan.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Dining Schedule
          </h2>
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetScheduleForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="meal_type">Meal Type (Breakfast/Lunch/Dinner)</Label>
                  <Input
                    id="meal_type"
                    value={scheduleForm.meal_type}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, meal_type: e.target.value })}
                    placeholder="Breakfast"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    placeholder="8:00 AM - 10:00 AM"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={scheduleForm.description}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingSchedule ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetScheduleForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schedules.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{s.meal_type}</span>
                  <span className="text-sm text-primary">{s.time}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleScheduleEdit(s)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleScheduleDelete(s.id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {schedules.length === 0 && (
            <div className="col-span-1 md:col-span-3 text-sm text-muted-foreground">No schedule entries yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
