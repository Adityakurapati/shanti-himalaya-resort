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
import { Plus, Edit, Trash2, Package } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import ImageUploader from "./ImageUploader"
import type { Tables } from "@/integrations/supabase/types";
import { AIButton } from "./AIButton";

type Package = Tables<"packages">

const PackagesAdmin = () => {
        const [packages, setPackages] = useState<Package[]>([])
        const [loading, setLoading] = useState(true)
        const [editingPackage, setEditingPackage] = useState<Package | null>(null)
        const [isDialogOpen, setIsDialogOpen] = useState(false)
        const { toast } = useToast()

        const [formData, setFormData] = useState({
                title: "",
                excerpt: "",
                content: "",
                category: "",
                author: "",
                author_bio: "",
                author_avatar: "",
                image_url: "",
                tags: "",
                featured: false,
                read_time: "5 min read",
        })

        useEffect(() => {
                fetchPackages()

                const channel = supabase
                        .channel("packages-changes")
                        .on("postgres_changes", { event: "*", schema: "public", table: "packages" }, () => {
                                fetchPackages()
                        })
                        .subscribe()

                return () => {
                        supabase.removeChannel(channel)
                }
        }, [])

        const fetchPackages = async () => {
                try {
                        const { data, error } = await supabase.from("packages").select("*").order("created_at", { ascending: false })

                        if (error) throw error
                        setPackages(data || [])
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
                        ...formData,
                        tags: formData.tags
                                .split(",")
                                .map((t: any) => t.trim())
                                .filter(Boolean),
                }

                try {
                        if (editingPackage) {
                                const { error } = await supabase.from("packages").update(packageData).eq("id", editingPackage.id)

                                if (error) throw error
                                toast({ title: "Package updated successfully" })
                        } else {
                                const { error } = await supabase.from("packages").insert([packageData])

                                if (error) throw error
                                toast({ title: "Package created successfully" })
                        }

                        resetForm()
                        setIsDialogOpen(false)
                } catch (error: any) {
                        toast({
                                title: "Error saving package",
                                description: error.message,
                                variant: "destructive",
                        })
                }
        }

        const handleEdit = (pkg: Package) => {
                setEditingPackage(pkg)
                setFormData({
                        title: pkg.title,
                        excerpt: pkg.excerpt,
                        content: pkg.content,
                        category: pkg.category,
                        author: pkg.author,
                        author_bio: pkg.author_bio || "",
                        author_avatar: pkg.author_avatar || "",
                        image_url: pkg.image_url || "",
                        tags: pkg.tags.join(", "),
                        featured: pkg.featured ?? false,
                        read_time: pkg.read_time || "5 min read",
                })
                setIsDialogOpen(true)
        }

        const handleDelete = async (id: string) => {
                if (!confirm("Are you sure you want to delete this package?")) return

                try {
                        const { error } = await supabase.from("packages").delete().eq("id", id)

                        if (error) throw error
                        toast({ title: "Package deleted successfully" })
                } catch (error: any) {
                        toast({
                                title: "Error deleting package",
                                description: error.message,
                                variant: "destructive",
                        })
                }
        }

        const resetForm = () => {
                setFormData({
                        title: "",
                        excerpt: "",
                        content: "",
                        category: "",
                        author: "",
                        author_bio: "",
                        author_avatar: "",
                        image_url: "",
                        tags: "",
                        featured: false,
                        read_time: "5 min read",
                })
                setEditingPackage(null)
        }

        if (loading) {
                return (
                        <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold">Manage Packages</h2>
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
                                        <h2 className="text-2xl font-bold">Manage Packages</h2>
                                        <p className="text-muted-foreground">
                                                Manage all packages ({packages.length} total)
                                        </p>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                                <Button onClick={resetForm}>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Package
                                                </Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none p-6 overflow-y-auto">
                                                <DialogHeader>
                                                        <DialogTitle>{editingPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                        <div>
  <div className="flex items-center gap-2 mb-2">
    <Label htmlFor="title">Title</Label>

    <AIButton
      title={formData.title}
      contentType="blog"
      onContentGenerated={(aiContent) => {
        setFormData((prev) => ({
          ...prev,
          excerpt: aiContent.excerpt || prev.excerpt,
          content: aiContent.content || prev.content,
          category: aiContent.category || prev.category,
          tags: aiContent.tags || prev.tags,
          read_time: aiContent.read_time || prev.read_time,
          image_url: aiContent.image_url || prev.image_url,
          author: aiContent.author || prev.author,
          author_bio: aiContent.author_bio || prev.author_bio,
          author_avatar: aiContent.author_avatar || prev.author_avatar,
        }));
      }}
    />
  </div>

  <Input
    id="title"
    value={formData.title}
    onChange={(e) =>
      setFormData({ ...formData, title: e.target.value })
    }
    required
  />
</div>

                                                        <div>
                                                                <Label htmlFor="excerpt">Excerpt</Label>
                                                                <Textarea
                                                                        id="excerpt"
                                                                        value={formData.excerpt}
                                                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                                                        required
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="content">Content</Label>
                                                                <Textarea
                                                                        id="content"
                                                                        value={formData.content}
                                                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                                        rows={10}
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
                                                                        <Label htmlFor="author">Author</Label>
                                                                        <Input
                                                                                id="author"
                                                                                value={formData.author}
                                                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                                                required
                                                                        />
                                                                </div>
                                                                <div>
                                                                        <Label htmlFor="read_time">Read Time</Label>
                                                                        <Input
                                                                                id="read_time"
                                                                                value={formData.read_time}
                                                                                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                                                                        />
                                                                </div>
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="author_bio">Author Bio</Label>
                                                                <Textarea
                                                                        id="author_bio"
                                                                        value={formData.author_bio}
                                                                        onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="author_avatar">Author Avatar</Label>
                                                                <ImageUploader
                                                                        value={formData.author_avatar}
                                                                        onChange={(url) => setFormData({ ...formData, author_avatar: url })}
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="image_url">Featured Image</Label>
                                                                <ImageUploader
                                                                        value={formData.image_url}
                                                                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="tags">Tags (comma-separated)</Label>
                                                                <Input
                                                                        id="tags"
                                                                        value={formData.tags}
                                                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                                        placeholder="Adventure, Travel, Nepal"
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
                                                                {editingPackage ? "Update Package" : "Create Package"}
                                                        </Button>
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
                                                        Get started by creating your first package.
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
                                                                                alt={pkg.title}
                                                                                className="w-full h-48 object-cover"
                                                                        />
                                                                ) : (
                                                                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                                                                                <Package className="w-12 h-12 text-muted-foreground" />
                                                                        </div>
                                                                )}
                                                                {pkg.featured && (
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
                                                                                {pkg.title}
                                                                        </h3>
                                                                </div>

                                                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                                        {pkg.excerpt}
                                                                </p>

                                                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                                                                {pkg.category}
                                                                        </span>
                                                                        <div className="flex gap-1">
                                                                                <span className="bg-secondary/50 px-2 py-1 rounded">By {pkg.author}</span>
                                                                                {pkg.read_time && (
                                                                                        <span className="bg-accent/50 px-2 py-1 rounded">{pkg.read_time}</span>
                                                                                )}
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

export default PackagesAdmin