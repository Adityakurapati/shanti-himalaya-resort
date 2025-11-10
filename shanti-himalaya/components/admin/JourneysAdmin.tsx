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
import DayScheduleEditor from "./DayScheduleEditor"

type Journey = {
        id: string
        title: string
        description: string
        duration: string
        difficulty: string
        activities: string[]
        featured: boolean
        category: string
        image_url?: string
}

const JourneysAdmin = () => {
        const [journeys, setJourneys] = useState<Journey[]>([])
        const [loading, setLoading] = useState(true)
        const [editingJourney, setEditingJourney] = useState<Journey | null>(null)
        const [isDialogOpen, setIsDialogOpen] = useState(false)
        const { toast } = useToast()

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
                                .map((a) => a.trim())
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
                        featured: journey.featured,
                        category: journey.category,
                        image_url: journey.image_url || "",
                })
                setIsDialogOpen(true)
        }

        const handleDelete = async (id: string) => {
                if (!confirm("Are you sure you want to delete this journey?")) return

                try {
                        const { error } = await supabase.from("journeys").delete().eq("id", id)

                        if (error) throw error
                        toast({ title: "Journey deleted successfully" })
                } catch (error: any) {
                        toast({
                                title: "Error deleting journey",
                                description: error.message,
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
                return <div className="text-center py-8">Loading journeys...</div>
        }

        return (
                <div className="space-y-6">
                        <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Manage Journeys</h2>
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
                                                                <Label htmlFor="title">Title</Label>
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
                                                                <Label htmlFor="category">Category</Label>
                                                                <Input
                                                                        id="category"
                                                                        value={formData.category}
                                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                                        required
                                                                />
                                                        </div>
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

                        <div className="grid gap-4">
                                {journeys.map((journey) => (
                                        <Card key={journey.id}>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center justify-between">
                                                                <span>{journey.title}</span>
                                                                <div className="flex gap-2">
                                                                        <Dialog>
                                                                                <DialogTrigger asChild>
                                                                                        <Button variant="secondary" size="sm">
                                                                                                <Plus className="h-4 w-4 mr-1" /> Manage Days
                                                                                        </Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                                                                                        <DialogHeader>
                                                                                                <DialogTitle>Manage Day-wise Schedule — {journey.title}</DialogTitle>
                                                                                        </DialogHeader>
                                                                                        <DayScheduleEditor journeyId={journey.id} />
                                                                                </DialogContent>
                                                                        </Dialog>
                                                                        <Button variant="outline" size="sm" onClick={() => handleEdit(journey)}>
                                                                                <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(journey.id)}>
                                                                                <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                </div>
                                                        </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                        <p className="text-sm text-muted-foreground mb-2">{journey.description}</p>
                                                        <div className="flex flex-wrap gap-2 text-sm">
                                                                <span className="bg-primary/10 px-2 py-1 rounded">{journey.category}</span>
                                                                <span className="bg-secondary/50 px-2 py-1 rounded">{journey.duration}</span>
                                                                <span className="bg-accent/50 px-2 py-1 rounded">{journey.difficulty}</span>
                                                                {journey.featured && <span className="bg-yellow-500/20 px-2 py-1 rounded">Featured</span>}
                                                        </div>
                                                </CardContent>
                                        </Card>
                                ))}
                        </div>
                </div>
        )
}

export default JourneysAdmin
