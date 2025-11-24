"use client"

import Image from "next/image";
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
import { Plus, Edit, Trash2, Package } from "lucide-react"
import ImageUploader from "./ImageUploader"
import type { Tables } from "@/integrations/supabase/types";

type ResortPackage = Tables<"resort_packages">

export const ResortPackagesAdmin = () => {
        const [packages, setPackages] = useState<ResortPackage[]>([])
        const [loading, setLoading] = useState(true)
        const [isDialogOpen, setIsDialogOpen] = useState(false)
        const [editingPackage, setEditingPackage] = useState<ResortPackage | null>(null)
        const { toast } = useToast()

        const [formData, setFormData] = useState({
                name: "",
                duration: "",
                price: "",
                original_price: "",
                description: "",
                includes: "",
                features: "",
                badge: "",
                image_url: "",
        })

        useEffect(() => {
                fetchPackages()
        }, [])

        const fetchPackages = async () => {
                try {
                        const { data, error } = await supabase.from("resort_packages").select("*").order("created_at", { ascending: false })

                        if (error) {
                                toast({
                                        title: "Error fetching packages",
                                        description: error.message,
                                        variant: "destructive",
                                })
                        } else {
                                setPackages(data || [])
                        }
                } catch (error: any) {
                        toast({
                                title: "Error fetching packages",
                                description: error.message,
                                variant: "destructive",
                        })
                } finally {
                        setLoading(false)
                }
        }

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()

                const packageData = {
                        name: formData.name,
                        duration: formData.duration,
                        price: formData.price,
                        original_price: formData.original_price,
                        description: formData.description,
                        includes: formData.includes.split("\n").filter((item: any) => item.trim()),
                        features: formData.features.split("\n").filter((item: any) => item.trim()),
                        badge: formData.badge,
                        image_url: formData.image_url || null,
                }

                try {
                        if (editingPackage) {
                                const { error } = await supabase.from("resort_packages").update(packageData).eq("id", editingPackage.id)

                                if (error) {
                                        toast({
                                                title: "Error updating package",
                                                description: error.message,
                                                variant: "destructive",
                                        })
                                } else {
                                        toast({ title: "Package updated successfully!" })
                                        fetchPackages()
                                        resetForm()
                                }
                        } else {
                                const { error } = await supabase.from("resort_packages").insert([packageData])

                                if (error) {
                                        toast({
                                                title: "Error creating package",
                                                description: error.message,
                                                variant: "destructive",
                                        })
                                } else {
                                        toast({ title: "Package created successfully!" })
                                        fetchPackages()
                                        resetForm()
                                }
                        }
                } catch (error: any) {
                        toast({
                                title: "Error saving package",
                                description: error.message,
                                variant: "destructive",
                        })
                }
        }

        const handleEdit = (pkg: ResortPackage) => {
                setEditingPackage(pkg)
                setFormData({
                        name: pkg.name,
                        duration: pkg.duration,
                        price: pkg.price,
                        original_price: pkg.original_price,
                        description: pkg.description,
                        includes: pkg.includes.join("\n"),
                        features: pkg.features.join("\n"),
                        badge: pkg.badge,
                        image_url: pkg.image_url || "",
                })
                setIsDialogOpen(true)
        }

        const handleDelete = async (id: string) => {
                if (confirm("Are you sure you want to delete this package?")) {
                        try {
                                const { error } = await supabase.from("resort_packages").delete().eq("id", id)

                                if (error) {
                                        toast({
                                                title: "Error deleting package",
                                                description: error.message,
                                                variant: "destructive",
                                        })
                                } else {
                                        toast({ title: "Package deleted successfully!" })
                                        fetchPackages()
                                }
                        } catch (error: any) {
                                toast({
                                        title: "Error deleting package",
                                        description: error.message,
                                        variant: "destructive",
                                })
                        }
                }
        }

        const resetForm = () => {
                setFormData({
                        name: "",
                        duration: "",
                        price: "",
                        original_price: "",
                        description: "",
                        includes: "",
                        features: "",
                        badge: "",
                        image_url: "",
                })
                setEditingPackage(null)
                setIsDialogOpen(false)
        }

        if (loading) {
                return (
                        <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold">Resort Packages</h2>
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
                                        <h2 className="text-2xl font-bold">Resort Packages</h2>
                                        <p className="text-muted-foreground">
                                                Manage all resort packages ({packages.length} total)
                                        </p>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                                <Button onClick={() => resetForm()}>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add Package
                                                </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                        <DialogTitle>{editingPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                        <div>
                                                                <Label htmlFor="name">Package Name</Label>
                                                                <Input
                                                                        id="name"
                                                                        value={formData.name}
                                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                        required
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="duration">Duration</Label>
                                                                <Input
                                                                        id="duration"
                                                                        value={formData.duration}
                                                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                                        placeholder="e.g., 2 Days / 1 Night"
                                                                        required
                                                                />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                        <Label htmlFor="price">Price</Label>
                                                                        <Input
                                                                                id="price"
                                                                                value={formData.price}
                                                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                                                placeholder="e.g., ₹8,999"
                                                                                required
                                                                        />
                                                                </div>
                                                                <div>
                                                                        <Label htmlFor="original_price">Original Price</Label>
                                                                        <Input
                                                                                id="original_price"
                                                                                value={formData.original_price}
                                                                                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                                                                placeholder="e.g., ₹12,999"
                                                                                required
                                                                        />
                                                                </div>
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="description">Description</Label>
                                                                <Textarea
                                                                        id="description"
                                                                        value={formData.description}
                                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                                        rows={3}
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
                                                        <div>
                                                                <Label htmlFor="includes">Includes (one per line)</Label>
                                                                <Textarea
                                                                        id="includes"
                                                                        value={formData.includes}
                                                                        onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                                                                        rows={4}
                                                                        placeholder="Accommodation&#10;All Meals&#10;Activities"
                                                                        required
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="features">Features (one per line)</Label>
                                                                <Textarea
                                                                        id="features"
                                                                        value={formData.features}
                                                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                                                        rows={4}
                                                                        placeholder="Adventure Package&#10;Nature Walks&#10;Wellness Included"
                                                                        required
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="badge">Badge</Label>
                                                                <Input
                                                                        id="badge"
                                                                        value={formData.badge}
                                                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                                                        placeholder="e.g., Popular, Exclusive, Festival Special"
                                                                        required
                                                                />
                                                        </div>
                                                        <div className="flex gap-2">
                                                                <Button type="submit" className="flex-1">
                                                                        {editingPackage ? "Update" : "Create"} Package
                                                                </Button>
                                                                <Button type="button" variant="outline" onClick={resetForm}>
                                                                        Cancel
                                                                </Button>
                                                        </div>
                                                </form>
                                        </DialogContent>
                                </Dialog>
                        </div>

                        {packages.length === 0 ? (
                                <Card>
                                        <CardContent className="text-center py-12">
                                                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold mb-2">No packages yet</h3>
                                                <p className="text-muted-foreground mb-4">
                                                        Get started by creating your first resort package.
                                                </p>
                                                <Button onClick={resetForm}>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Create First Package
                                                </Button>
                                        </CardContent>
                                </Card>
                        ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {packages.map((pkg: any) => (
                                                <Card key={pkg.id} className="overflow-hidden">
                                                        <div className="relative">
                                                                {pkg.image_url ? (
                                                                        <img
                                                                                src={pkg.image_url}
                                                                                alt={pkg.name}
                                                                                className="w-full h-48 object-cover"
                                                                        />
                                                                ) : (
                                                                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                                                                                <Package className="w-12 h-12 text-muted-foreground" />
                                                                        </div>
                                                                )}
                                                                {pkg.badge && (
                                                                        <div className="absolute top-2 right-2">
                                                                                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                                                                                        {pkg.badge}
                                                                                </span>
                                                                        </div>
                                                                )}
                                                        </div>

                                                        <CardContent className="p-4">
                                                                <div className="flex items-start justify-between mb-2">
                                                                        <h3 className="font-semibold text-lg leading-tight">
                                                                                {pkg.name}
                                                                        </h3>
                                                                </div>

                                                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                                        {pkg.description}
                                                                </p>

                                                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                                                        <span className="text-primary font-semibold">{pkg.duration}</span>
                                                                        <div className="flex gap-1">
                                                                                <span className="font-bold text-lg">{pkg.price}</span>
                                                                                <span className="text-muted-foreground line-through text-sm self-end">
                                                                                        {pkg.original_price}
                                                                                </span>
                                                                        </div>
                                                                </div>

                                                                <div className="flex gap-2">
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="flex-1"
                                                                                onClick={() => handleEdit(pkg)}
                                                                        >
                                                                                <Edit className="h-3 w-3 mr-1" />
                                                                                Edit
                                                                        </Button>

                                                                        <Button
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() => handleDelete(pkg.id)}
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