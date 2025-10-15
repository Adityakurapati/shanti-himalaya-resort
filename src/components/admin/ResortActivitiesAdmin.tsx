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
import ImageUploader from "./ImageUploader"
import {
        Plus,
        Edit,
        Trash2,
        Mountain,
        Tent,
        Trees,
        MapPin,
        Compass,
        Route,
        Camera,
        Coffee,
        Utensils,
        Bike,
        Binary as Binoculars,
        Sailboat,
        Sun,
        Star,
} from "lucide-react"

interface Activity {
        id: string
        title: string
        description: string
        full_description: string
        icon: string
        image_url?: string
}

export const ResortActivitiesAdmin = () => {
        const [activities, setActivities] = useState<Activity[]>([])
        const [isDialogOpen, setIsDialogOpen] = useState(false)
        const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
        const { toast } = useToast()

        const [formData, setFormData] = useState({
                title: "",
                description: "",
                full_description: "",
                icon: "Mountain",
                image_url: "",
        })

        const travelIconOptions = [
                { name: "Mountain", Icon: Mountain },
                { name: "Tent", Icon: Tent },
                { name: "Trees", Icon: Trees },
                { name: "MapPin", Icon: MapPin },
                { name: "Compass", Icon: Compass },
                { name: "Route", Icon: Route },
                { name: "Camera", Icon: Camera },
                { name: "Coffee", Icon: Coffee },
                { name: "Utensils", Icon: Utensils },
                { name: "Bike", Icon: Bike },
                { name: "Binoculars", Icon: Binoculars },
                { name: "Sailboat", Icon: Sailboat },
                { name: "Sun", Icon: Sun },
                { name: "Star", Icon: Star },
        ]

        useEffect(() => {
                fetchActivities()
        }, [])

        const fetchActivities = async () => {
                const { data, error } = await supabase
                        .from("resort_activities")
                        .select("*")
                        .order("created_at", { ascending: false })

                if (error) {
                        toast({
                                title: "Error fetching activities",
                                description: error.message,
                                variant: "destructive",
                        })
                } else {
                        setActivities(data || [])
                }
        }

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()

                if (editingActivity) {
                        const { error } = await supabase.from("resort_activities").update(formData).eq("id", editingActivity.id)

                        if (error) {
                                toast({
                                        title: "Error updating activity",
                                        description: error.message,
                                        variant: "destructive",
                                })
                        } else {
                                toast({ title: "Activity updated successfully!" })
                                fetchActivities()
                                resetForm()
                        }
                } else {
                        const { error } = await supabase.from("resort_activities").insert([formData])

                        if (error) {
                                toast({
                                        title: "Error creating activity",
                                        description: error.message,
                                        variant: "destructive",
                                })
                        } else {
                                toast({ title: "Activity created successfully!" })
                                fetchActivities()
                                resetForm()
                        }
                }
        }

        const handleEdit = (activity: Activity) => {
                setEditingActivity(activity)
                setFormData({
                        title: activity.title,
                        description: activity.description,
                        full_description: activity.full_description,
                        icon: activity.icon,
                        image_url: activity.image_url || "",
                })
                setIsDialogOpen(true)
        }

        const handleDelete = async (id: string) => {
                if (confirm("Are you sure you want to delete this activity?")) {
                        const { error } = await supabase.from("resort_activities").delete().eq("id", id)

                        if (error) {
                                toast({
                                        title: "Error deleting activity",
                                        description: error.message,
                                        variant: "destructive",
                                })
                        } else {
                                toast({ title: "Activity deleted successfully!" })
                                fetchActivities()
                        }
                }
        }

        const resetForm = () => {
                setFormData({
                        title: "",
                        description: "",
                        full_description: "",
                        icon: "Mountain",
                        image_url: "",
                })
                setEditingActivity(null)
                setIsDialogOpen(false)
        }

        return (
                <div className="space-y-6">
                        <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Mountain className="w-6 h-6" />
                                        Resort Activities Management
                                </h2>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                                <Button onClick={() => resetForm()}>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add Activity
                                                </Button>
                                        </DialogTrigger>

                                        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none p-6 overflow-y-auto">                                                <DialogHeader>
                                                <DialogTitle>{editingActivity ? "Edit Activity" : "Add New Activity"}</DialogTitle>
                                        </DialogHeader>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                        <div>
                                                                <Label htmlFor="title">Activity Title</Label>
                                                                <Input
                                                                        id="title"
                                                                        value={formData.title}
                                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                                        required
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="description">Short Description</Label>
                                                                <Textarea
                                                                        id="description"
                                                                        value={formData.description}
                                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                                        rows={2}
                                                                        required
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="full_description">Full Description</Label>
                                                                <Textarea
                                                                        id="full_description"
                                                                        value={formData.full_description}
                                                                        onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                                                        rows={6}
                                                                        required
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="icon">Icon</Label>
                                                                <div role="list" className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-2">
                                                                        {travelIconOptions.map(({ name, Icon }) => {
                                                                                const selected = formData.icon === name
                                                                                return (
                                                                                        <button
                                                                                                key={name}
                                                                                                type="button"
                                                                                                role="listitem"
                                                                                                aria-pressed={selected}
                                                                                                onClick={() => setFormData({ ...formData, icon: name })}
                                                                                                className={[
                                                                                                        "flex flex-col items-center justify-center gap-1 rounded-md border p-3 text-xs",
                                                                                                        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                                                                                        selected ? "bg-muted border-primary" : "hover:bg-muted",
                                                                                                ].join(" ")}
                                                                                                title={name}
                                                                                        >
                                                                                                <Icon className="h-5 w-5" aria-hidden="true" />
                                                                                                <span className="text-foreground">{name}</span>
                                                                                        </button>
                                                                                )
                                                                        })}
                                                                </div>
                                                                <p className="text-xs text-muted-foreground mt-2">
                                                                        Pick a travel-themed icon. This will be displayed with the activity on the site.
                                                                </p>
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="image_url">Image (optional)</Label>
                                                                <ImageUploader
                                                                        value={formData.image_url}
                                                                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                                                                />
                                                        </div>
                                                        <div className="flex gap-2">
                                                                <Button type="submit" className="flex-1">
                                                                        {editingActivity ? "Update" : "Create"} Activity
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
                                {activities.map((activity) => (
                                        <Card key={activity.id}>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                                <span>{activity.title}</span>
                                                        </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{activity.full_description}</p>
                                                        <div className="flex gap-2">
                                                                <Button size="sm" variant="outline" onClick={() => handleEdit(activity)}>
                                                                        <Edit className="w-4 h-4 mr-1" />
                                                                        Edit
                                                                </Button>
                                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(activity.id)}>
                                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                                        Delete
                                                                </Button>
                                                        </div>
                                                </CardContent>
                                        </Card>
                                ))}
                        </div>
                </div>
        )
}
