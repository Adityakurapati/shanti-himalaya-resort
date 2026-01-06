"use client"

import Image from "next/image";
import type React from "react"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Route } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import ImageUploader from "./ImageUploader"
import DayScheduleEditor from "./DayScheduleEditor"
import type { Tables } from "@/integrations/supabase/types";
import CategoriesManager from "@/components/admin/CategoriesManager"
import { AIButton } from "@/components/admin/AIButton";

type Journey = Tables<"journeys">

const JourneysAdmin = () => {
        const [journeys, setJourneys] = useState<Journey[]>([])
        const [loading, setLoading] = useState(true)
        const [editingJourney, setEditingJourney] = useState<Journey | null>(null)
        const [isDialogOpen, setIsDialogOpen] = useState(false)
        const { toast } = useToast()
        const [categories, setCategories] = useState<string[]>([])

        const [formData, setFormData] = useState({
                title: "",
                description: "",
                duration: "",
                difficulty: "",
                activities: "",
                featured: false,
                category: "",
                image_url: "",
        })

        useEffect(() => {
                fetchJourneys()
                fetchCategories()
                const channel = supabase
                        .channel("journeys-changes")
                        .on("postgres_changes", { event: "*", schema: "public", table: "journeys" }, () => {
                                fetchJourneys()
                        })
                        .subscribe()

                return () => {
                        supabase.removeChannel(channel)
                }
        }, [])

        const fetchCategories = async () => {
                try {
                        const { data, error } = await supabase
                                .from('categories')
                                .select('name')
                                .order('name', { ascending: true })

                        if (error && error.code !== 'PGRST116') {
                                throw error
                        }

                        if (data) {
                                setCategories(data.map((item: any) => item.name))
                        } else {
                                setCategories(["Trekking", "Wildlife", "Culture", "Adventure", "Pilgrimage", "Nature"])
                        }
                } catch (error) {
                        console.error("Error fetching categories:", error)
                        setCategories(["Trekking", "Wildlife", "Culture", "Adventure", "Pilgrimage", "Nature"])
                }
        }
        const fetchJourneys = async () => {
                try {
                        const { data, error } = await supabase.from("journeys").select("*").order("created_at", { ascending: false })

                        if (error) throw error
                        setJourneys(data || [])
                } catch (error: any) {
                        toast({
                                title: "Error fetching journeys",
                                description: error.message,
                                variant: "destructive",
                        })
                } finally {
                        setLoading(false)
                }
        }

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()

                const journeyData = {
                        ...formData,
                        activities: formData.activities
                                .split(",")
                                .map((a: any) => a.trim())
                                .filter(Boolean),
                }

                try {
                        if (editingJourney) {
                                const { error } = await supabase.from("journeys").update(journeyData).eq("id", editingJourney.id)

                                if (error) throw error
                                toast({ title: "Journey updated successfully" })
                        } else {
                                const { error } = await supabase.from("journeys").insert([journeyData])

                                if (error) throw error
                                toast({ title: "Journey created successfully" })
                        }

                        resetForm()
                        setIsDialogOpen(false)
                } catch (error: any) {
                        toast({
                                title: "Error saving journey",
                                description: error.message,
                                variant: "destructive",
                        })
                }
        }

        const handleEdit = (journey: Journey) => {
                setEditingJourney(journey)
                setFormData({
                        title: journey.title,
                        description: journey.description,
                        duration: journey.duration,
                        difficulty: journey.difficulty,
                        activities: journey.activities.join(", "),
                        featured: journey.featured ?? false,
                        category: journey.category,
                        image_url: journey.image_url || "",
                })
                setIsDialogOpen(true)
        }

        const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this journey?")) return

  try {
    // First, delete all enquiries related to this journey
    const { error: enquiriesError } = await supabase
      .from('enquiries')
      .delete()
      .eq('journey_id', id)
    
    if (enquiriesError) {
      console.error('Error deleting related enquiries:', enquiriesError)
      // If we can't delete enquiries, inform the user
      const shouldProceed = confirm(
        'This journey has associated enquiries. Deleting it will also delete all related enquiries. Continue?'
      )
      if (!shouldProceed) return
      
      // Try to delete again or show error
      throw new Error('Cannot delete journey with related enquiries. Please delete enquiries first.')
    }

    // Then delete the journey
    const { error } = await supabase.from("journeys").delete().eq("id", id)

    if (error) throw error
    toast({ 
      title: "Journey deleted successfully",
      description: "All related enquiries have also been removed."
    })
  } catch (error: any) {
    console.error('Delete error:', error)
    toast({
      title: "Error deleting journey",
      description: error.message || "This journey cannot be deleted because it has related enquiries.",
      variant: "destructive",
    })
  }
}

        const resetForm = () => {
                setFormData({
                        title: "",
                        description: "",
                        duration: "",
                        difficulty: "",
                        activities: "",
                        featured: false,
                        category: "",
                        image_url: "",
                })
                setEditingJourney(null)
        }

        if (loading) {
                return (
                        <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold">Manage Journeys</h2>
                                        <Button disabled>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Loading...
                                        </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[...Array(6)].map((_: string, i: number) => (
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
                        <div className="flex justify-between items-center">
                                <div>
                                        <h2 className="text-2xl font-bold">Manage Journeys</h2>
                                        <p className="text-muted-foreground">
                                                Manage all travel journeys ({journeys.length} total)
                                        </p>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                                <Button onClick={resetForm}>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Journey
                                                </Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none p-6 overflow-y-auto">
                                                <DialogHeader>
                                                        <DialogTitle>{editingJourney ? "Edit Journey" : "Add New Journey"}</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                        <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                        <Label htmlFor="title">Title</Label>
                                                                        <AIButton
                                                                                title={formData.title}
                                                                                contentType="journey"
                                                                                onContentGenerated={(aiContent) => {
                                                                                        setFormData(prev => ({
                                                                                                ...prev,
                                                                                                description: aiContent.description || prev.description,
                                                                                                duration: aiContent.duration || prev.duration,
                                                                                                difficulty: aiContent.difficulty || prev.difficulty,
                                                                                                activities: aiContent.activities || prev.activities,
                                                                                                category: aiContent.category || prev.category,
                                                                                                // Optionally use image_prompt to generate image
                                                                                        }));
                                                                                }}
                                                                        />
                                                                </div>
                                                                <Input
                                                                        id="title"
                                                                        value={formData.title}
                                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                                                        <div>
                                                                <Label className="mb-2 block">Category *</Label>
                                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                                                                        {categories.map((category: any) => (
                                                                                <div
                                                                                        key={category}
                                                                                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${formData.category === category
                                                                                                ? "border-primary bg-primary/10 text-primary"
                                                                                                : "border-border hover:border-primary/50"
                                                                                                }`}
                                                                                        onClick={() => setFormData({ ...formData, category })}
                                                                                >
                                                                                        <span className="text-sm font-medium">{category}</span>
                                                                                        {formData.category === category && (
                                                                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                                                        )}
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                                {!formData.category && (
                                                                        <p className="text-sm text-destructive">Please select a category</p>
                                                                )}
                                                        </div>
                                                        <CategoriesManager />
                                                        <div>
                                                                <Label htmlFor="activities">Activities (comma-separated)</Label>
                                                                <Input
                                                                        id="activities"
                                                                        value={formData.activities}
                                                                        onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                                                                        placeholder="Trekking, Photography, Culture"
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
                                                                {editingJourney ? "Update Journey" : "Create Journey"}
                                                        </Button>
                                                </form>
                                        </DialogContent>
                                </Dialog>
                        </div>

                        {journeys.length === 0 ? (
                                <Card>
                                        <CardContent className="text-center py-12">
                                                <Route className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold mb-2">No journeys yet</h3>
                                                <p className="text-muted-foreground mb-4">
                                                        Get started by creating your first journey.
                                                </p>
                                                <Button onClick={resetForm}>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Create First Journey
                                                </Button>
                                        </CardContent>
                                </Card>
                        ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {journeys.map((journey: any) => (
                                                <Card key={journey.id} className="overflow-hidden">
                                                        <div className="relative">
                                                                {journey.image_url ? (
                                                                        <img
                                                                                src={journey.image_url}
                                                                                alt={journey.title}
                                                                                className="w-full h-48 object-cover"
                                                                        />
                                                                ) : (
                                                                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                                                                                <Route className="w-12 h-12 text-muted-foreground" />
                                                                        </div>
                                                                )}
                                                                {journey.featured && (
                                                                        <div className="absolute top-2 left-2">
                                                                                <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                                                                                        Featured
                                                                                </span>
                                                                        </div>
                                                                )}
                                                        </div>

                                                        <CardContent className="p-4">
                                                                <div className="flex items-start justify-between mb-2">
                                                                        <h3 className="font-semibold text-lg leading-tight">
                                                                                {journey.title}
                                                                        </h3>
                                                                </div>

                                                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                                        {journey.description}
                                                                </p>

                                                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                                                                {journey.category}
                                                                        </span>
                                                                        <div className="flex gap-1">
                                                                                <span className="bg-secondary/50 px-2 py-1 rounded">{journey.duration}</span>
                                                                                <span className="bg-accent/50 px-2 py-1 rounded">{journey.difficulty}</span>
                                                                        </div>
                                                                </div>

                                                                <div className="flex gap-2">
                                                                        <Dialog>
                                                                                <DialogTrigger asChild>
                                                                                        <Button variant="outline" size="sm" className="flex-1">
                                                                                                <Plus className="h-3 w-3 mr-1" /> Days
                                                                                        </Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                                                                                        <DialogHeader>
                                                                                                <DialogTitle>Manage Day-wise Schedule — {journey.title}</DialogTitle>
                                                                                        </DialogHeader>
                                                                                        <DayScheduleEditor journeyId={journey.id} />
                                                                                </DialogContent>
                                                                        </Dialog>

                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="flex-1"
                                                                                onClick={() => handleEdit(journey)}
                                                                        >
                                                                                <Edit className="h-3 w-3 mr-1" />
                                                                                Edit
                                                                        </Button>

                                                                        <Button
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() => handleDelete(journey.id)}
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

export default JourneysAdmin