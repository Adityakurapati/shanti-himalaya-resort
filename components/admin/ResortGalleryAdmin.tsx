"use client"

import Image from "next/image";
import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, ImageIcon, ListOrdered } from "lucide-react"
import ImageUploader from "./ImageUploader"
import type { Tables } from "@/integrations/supabase/types";

type GalleryItem = Tables<"resort_gallery">

export const ResortGalleryAdmin = () => {
        const [items, setItems] = useState<GalleryItem[]>([])
        const [isDialogOpen, setIsDialogOpen] = useState(false)
        const [editing, setEditing] = useState<GalleryItem | null>(null)
        const { toast } = useToast()

        const [formData, setFormData] = useState({
                image_url: "",
                title: "",
                description: "",
                display_order: 0,
        })

        useEffect(() => {
                fetchItems()
        }, [])

        const fetchItems = async () => {
                const { data, error } = await supabase
                        .from("resort_gallery")
                        .select("*")
                        .order("display_order", { ascending: true })
                        .order("created_at", { ascending: true })

                if (error) {
                        toast({ title: "Error fetching gallery", description: error.message, variant: "destructive" })
                } else {
                        setItems(data || [])
                }
        }

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()

                const payload = {
                        image_url: formData.image_url,
                        title: formData.title || null,
                        description: formData.description || null,
                        display_order: Number(formData.display_order) || 0,
                }

                if (editing) {
                        const { error } = await supabase.from("resort_gallery").update(payload).eq("id", editing.id)
                        if (error) {
                                toast({ title: "Error updating item", description: error.message, variant: "destructive" })
                        } else {
                                toast({ title: "Gallery item updated!" })
                                fetchItems()
                                resetForm()
                        }
                } else {
                        const { error } = await supabase.from("resort_gallery").insert([payload])
                        if (error) {
                                toast({ title: "Error creating item", description: error.message, variant: "destructive" })
                        } else {
                                toast({ title: "Gallery item created!" })
                                fetchItems()
                                resetForm()
                        }
                }
        }

        const handleEdit = (item: GalleryItem) => {
                setEditing(item)
                setFormData({
                        image_url: item.image_url,
                        title: item.title || "",
                        description: item.description || "",
                        display_order: item.display_order || 0,
                })
                setIsDialogOpen(true)
        }

        const handleDelete = async (id: string) => {
                if (confirm("Delete this gallery item?")) {
                        const { error } = await supabase.from("resort_gallery").delete().eq("id", id)
                        if (error) {
                                toast({ title: "Error deleting item", description: error.message, variant: "destructive" })
                        } else {
                                toast({ title: "Gallery item deleted!" })
                                fetchItems()
                        }
                }
        }

        const resetForm = () => {
                setFormData({ image_url: "", title: "", description: "", display_order: 0 })
                setEditing(null)
                setIsDialogOpen(false)
        }

        return (
                <div className="space-y-6">
                        <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <ImageIcon className="w-6 h-6" />
                                        Resort Gallery Management
                                </h2>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                                <Button onClick={() => resetForm()}>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add Image
                                                </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                        <DialogTitle>{editing ? "Edit Image" : "Add New Image"}</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                        <div>
                                                                <Label htmlFor="image_url">Image</Label>
                                                                <ImageUploader
                                                                        value={formData.image_url}
                                                                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="title">Title (optional)</Label>
                                                                <Input
                                                                        id="title"
                                                                        value={formData.title}
                                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="description">Description (optional)</Label>
                                                                <Textarea
                                                                        id="description"
                                                                        value={formData.description}
                                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                                        rows={3}
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="display_order">Display Order</Label>
                                                                <Input
                                                                        id="display_order"
                                                                        type="number"
                                                                        value={formData.display_order}
                                                                        onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                                                                />
                                                        </div>
                                                        <div className="flex gap-2">
                                                                <Button type="submit" className="flex-1">
                                                                        {editing ? "Update" : "Create"} Item
                                                                </Button>
                                                                <Button type="button" variant="outline" onClick={resetForm}>
                                                                        Cancel
                                                                </Button>
                                                        </div>
                                                </form>
                                        </DialogContent>
                                </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {items.map((item: any) => (
                                        <Card key={item.id}>
                                                <CardHeader>
                                                        <CardTitle className="text-lg flex items-center justify-between">
                                                                <span className="truncate">{item.title || "Untitled"}</span>
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                        <ListOrdered className="w-3 h-3" /> {item.display_order ?? 0}
                                                                </span>
                                                        </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="h-32 rounded overflow-hidden mb-3 bg-muted flex items-center justify-center">
                                                                {item.image_url ? (
                                                                        <img
                                                                                src={item.image_url || "/placeholder.svg"}
                                                                                alt={item.title || "Gallery"}
                                                                                className="w-full h-full object-cover"
                                                                        />
                                                                ) : (
                                                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                                                )}
                                                        </div>
                                                        {item.description && (
                                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                                                        )}
                                                        <div className="flex gap-2">
                                                                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                                                                        <Edit className="w-4 h-4 mr-1" />
                                                                        Edit
                                                                </Button>
                                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
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

export default ResortGalleryAdmin
