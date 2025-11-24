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
import { Plus, Edit, Trash2, Compass } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import ImageUploader from "./ImageUploader"
import type { Tables } from "@/integrations/supabase/types";

type Experience = Tables<"experiences">

const ExperiencesAdmin = () => {
        const [experiences, setExperiences] = useState<Experience[]>([])
        const [loading, setLoading] = useState(true)
        const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
        const [isDialogOpen, setIsDialogOpen] = useState(false)
        const { toast } = useToast()

        const [formData, setFormData] = useState({
                title: "",
                description: "",
                category: "",
                duration: "",
                group_size: "",
                highlights: "",
                price: "",
                featured: false,
                image_url: "",
        })

        useEffect(() => {
                fetchExperiences()

                const channel = supabase
                        .channel("experiences-changes")
                        .on("postgres_changes", { event: "*", schema: "public", table: "experiences" }, () => {
                                fetchExperiences()
                        })
                        .subscribe()

                return () => {
                        supabase.removeChannel(channel)
                }
        }, [])

        const fetchExperiences = async () => {
                try {
                        const { data, error } = await supabase.from("experiences").select("*").order("created_at", { ascending: false })

                        if (error) throw error
                        setExperiences(data || [])
                } catch (error: any) {
                        toast({
                                title: "Error fetching experiences",
                                description: error.message,
                                variant: "destructive",
                        })
                } finally {
                        setLoading(false)
                }
        }

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()

                const experienceData = {
                        ...formData,
                        highlights: formData.highlights
                                .split(",")
                                .map((h: any) => h.trim())
                                .filter(Boolean),
                }

                try {
                        if (editingExperience) {
                                const { error } = await supabase.from("experiences").update(experienceData).eq("id", editingExperience.id)

                                if (error) throw error
                                toast({ title: "Experience updated successfully" })
                        } else {
                                const { error } = await supabase.from("experiences").insert([experienceData])

                                if (error) throw error
                                toast({ title: "Experience created successfully" })
                        }

                        resetForm()
                        setIsDialogOpen(false)
                } catch (error: any) {
                        toast({
                                title: "Error saving experience",
                                description: error.message,
                                variant: "destructive",
                        })
                }
        }

        const handleEdit = (experience: Experience) => {
                setEditingExperience(experience)
                setFormData({
                        title: experience.title,
                        description: experience.description,
                        category: experience.category,
                        duration: experience.duration,
                        group_size: experience.group_size,
                        highlights: experience.highlights.join(", "),
                        price: experience.price,
                        featured: experience.featured ?? false,
                        image_url: experience.image_url || "",
                })
                setIsDialogOpen(true)
        }

        const handleDelete = async (id: string) => {
                if (!confirm("Are you sure you want to delete this experience?")) return

                try {
                        const { error } = await supabase.from("experiences").delete().eq("id", id)

                        if (error) throw error
                        toast({ title: "Experience deleted successfully" })
                } catch (error: any) {
                        toast({
                                title: "Error deleting experience",
                                description: error.message,
                                variant: "destructive",
                        })
                }
        }

        const resetForm = () => {
                setFormData({
                        title: "",
                        description: "",
                        category: "",
                        duration: "",
                        group_size: "",
                        highlights: "",
                        price: "",
                        featured: false,
                        image_url: "",
                })
                setEditingExperience(null)
        }

        if (loading) {
                return (
                        <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold">Manage Experiences</h2>
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
                                        <h2 className="text-2xl font-bold">Manage Experiences</h2>
                                        <p className="text-muted-foreground">
                                                Manage all travel experiences ({experiences.length} total)
                                        </p>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                                <Button onClick={resetForm}>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Experience
                                                </Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none p-6 overflow-y-auto">
                                                <DialogHeader>
                                                        <DialogTitle>{editingExperience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
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
                                                        <div>
                                                                <Label htmlFor="category">Category</Label>
                                                                <Input
                                                                        id="category"
                                                                        value={formData.category}
                                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                                                                        <Label htmlFor="group_size">Group Size</Label>
                                                                        <Input
                                                                                id="group_size"
                                                                                value={formData.group_size}
                                                                                onChange={(e) => setFormData({ ...formData, group_size: e.target.value })}
                                                                                required
                                                                        />
                                                                </div>
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
                                                                <Label htmlFor="highlights">Highlights (comma-separated)</Label>
                                                                <Textarea
                                                                        id="highlights"
                                                                        value={formData.highlights}
                                                                        onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                                                                        placeholder="Expert guide, Local cuisine, Photography"
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
                                                                {editingExperience ? "Update Experience" : "Create Experience"}
                                                        </Button>
                                                </form>
                                        </DialogContent>
                                </Dialog>
                        </div>

                        {experiences.length === 0 ? (
                                <Card>
                                        <CardContent className="text-center py-12">
                                                <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold mb-2">No experiences yet</h3>
                                                <p className="text-muted-foreground mb-4">
                                                        Get started by creating your first experience.
                                                </p>
                                                <Button onClick={resetForm}>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Create First Experience
                                                </Button>
                                        </CardContent>
                                </Card>
                        ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {experiences.map((experience: any) => (
                                                <Card key={experience.id} className="overflow-hidden">
                                                        <div className="relative">
                                                                {experience.image_url ? (
                                                                        <img
                                                                                src={experience.image_url}
                                                                                alt={experience.title}
                                                                                className="w-full h-48 object-cover"
                                                                        />
                                                                ) : (
                                                                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                                                                                <Compass className="w-12 h-12 text-muted-foreground" />
                                                                        </div>
                                                                )}
                                                                {experience.featured && (
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
                                                                                {experience.title}
                                                                        </h3>
                                                                </div>

                                                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                                        {experience.description}
                                                                </p>

                                                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                                                                {experience.category}
                                                                        </span>
                                                                        <div className="flex gap-1">
                                                                                <span className="bg-secondary/50 px-2 py-1 rounded">{experience.duration}</span>
                                                                                <span className="bg-accent/50 px-2 py-1 rounded">{experience.price}</span>
                                                                        </div>
                                                                </div>

                                                                <div className="flex gap-2">
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="flex-1"
                                                                                onClick={() => handleEdit(experience)}
                                                                        >
                                                                                <Edit className="h-3 w-3 mr-1" />
                                                                                Edit
                                                                        </Button>

                                                                        <Button
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() => handleDelete(experience.id)}
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

export default ExperiencesAdmin