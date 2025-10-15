"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import ImageUploader from "./ImageUploader"

type Destination = {
  id: string
  name: string
  description: string
  highlights: string[]
  duration: string
  difficulty: string
  best_time: string
  altitude?: string
  featured: boolean
  category: string
  image_url?: string
}

const DestinationsAdmin = () => {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    highlights: "",
    duration: "",
    difficulty: "",
    best_time: "",
    altitude: "",
    featured: false,
    category: "",
    image_url: "",
  })

  useEffect(() => {
    fetchDestinations()

    const channel = supabase
      .channel("destinations-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "destinations" }, () => {
        fetchDestinations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase.from("destinations").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setDestinations(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching destinations",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const destinationData = {
      ...formData,
      highlights: formData.highlights
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
    }

    try {
      if (editingDestination) {
        const { error } = await supabase.from("destinations").update(destinationData).eq("id", editingDestination.id)

        if (error) throw error
        toast({ title: "Destination updated successfully" })
      } else {
        const { error } = await supabase.from("destinations").insert([destinationData])

        if (error) throw error
        toast({ title: "Destination created successfully" })
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error saving destination",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination)
    setFormData({
      name: destination.name,
      description: destination.description,
      highlights: destination.highlights.join(", "),
      duration: destination.duration,
      difficulty: destination.difficulty,
      best_time: destination.best_time,
      altitude: destination.altitude || "",
      featured: destination.featured,
      category: destination.category,
      image_url: destination.image_url || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return

    try {
      const { error } = await supabase.from("destinations").delete().eq("id", id)

      if (error) throw error
      toast({ title: "Destination deleted successfully" })
    } catch (error: any) {
      toast({
        title: "Error deleting destination",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      highlights: "",
      duration: "",
      difficulty: "",
      best_time: "",
      altitude: "",
      featured: false,
      category: "",
      image_url: "",
    })
    setEditingDestination(null)
  }

  if (loading) {
    return <div className="text-center py-8">Loading destinations...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Destinations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Destination
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDestination ? "Edit Destination" : "Add New Destination"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <Label htmlFor="highlights">Highlights (comma-separated)</Label>
                <Textarea
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Sunrise views, Ancient temples, Local culture"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Input
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="best_time">Best Time</Label>
                  <Input
                    id="best_time"
                    value={formData.best_time}
                    onChange={(e) => setFormData({ ...formData, best_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="altitude">Altitude</Label>
                  <Input
                    id="altitude"
                    value={formData.altitude}
                    onChange={(e) => setFormData({ ...formData, altitude: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image</Label>
                <ImageUploader
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingDestination ? "Update Destination" : "Create Destination"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {destinations.map((destination) => (
          <Card key={destination.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{destination.name}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(destination)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(destination.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{destination.description}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-primary/10 px-2 py-1 rounded">{destination.category}</span>
                <span className="bg-secondary/50 px-2 py-1 rounded">{destination.duration}</span>
                <span className="bg-accent/50 px-2 py-1 rounded">{destination.difficulty}</span>
                {destination.featured && <span className="bg-yellow-500/20 px-2 py-1 rounded">Featured</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default DestinationsAdmin
