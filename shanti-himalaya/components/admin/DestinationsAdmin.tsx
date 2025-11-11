"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Eye, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Destination = {
        id: string
        name: string
        description: string
        category: string
        featured: boolean
        image_url?: string
        slug: string
        created_at: string
}

const DestinationsAdmin = () => {
        const [destinations, setDestinations] = useState<Destination[]>([])
        const [loading, setLoading] = useState(true)
        const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
        const { toast } = useToast()
        const router = useRouter()

        useEffect(() => {
                fetchDestinations()
        }, [])

        const fetchDestinations = async () => {
                try {
                        const { data, error } = await supabase
                                .from("destinations")
                                .select("*")
                                .order("created_at", { ascending: false })

                        if (error) throw error
                        setDestinations(data || [])
                } catch (error: any) {
                        console.error("Error fetching destinations:", error)
                        toast({
                                title: "Error fetching destinations",
                                description: error.message,
                                variant: "destructive",
                        })
                } finally {
                        setLoading(false)
                }
        }

        const handleDelete = async (id: string) => {
                setDeleteLoading(id)
                try {
                        const { error } = await supabase
                                .from("destinations")
                                .delete()
                                .eq("id", id)

                        if (error) throw error

                        toast({
                                title: "Destination deleted",
                                description: "The destination has been successfully deleted.",
                        })
                        fetchDestinations()
                } catch (error: any) {
                        console.error("Error deleting destination:", error)
                        toast({
                                title: "Error deleting destination",
                                description: error.message,
                                variant: "destructive",
                        })
                } finally {
                        setDeleteLoading(null)
                }
        }

        const handleView = (slug: string) => {
                window.open(`/destinations/${slug}`, '_blank')
        }

        const handleEdit = (id: string) => {
                router.push(`/admin/destination/edit/${id}`)
        }

        const handleCreateNew = () => {
                router.push('/admin/destination/new')
        }

        if (loading) {
                return (
                        <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold">Destinations</h2>
                                        <Button disabled>
                                                <Plus className="w-4 h-4 mr-2" />
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
                        <div className="flex justify-between items-center">
                                <div>
                                        <h2 className="text-2xl font-bold">Destinations</h2>
                                        <p className="text-muted-foreground">
                                                Manage all travel destinations ({destinations.length} total)
                                        </p>
                                </div>
                                <Button onClick={handleCreateNew}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Destination
                                </Button>
                        </div>

                        {destinations.length === 0 ? (
                                <Card>
                                        <CardContent className="text-center py-12">
                                                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold mb-2">No destinations yet</h3>
                                                <p className="text-muted-foreground mb-4">
                                                        Get started by creating your first destination.
                                                </p>
                                                <Button onClick={handleCreateNew}>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Create First Destination
                                                </Button>
                                        </CardContent>
                                </Card>
                        ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {destinations.map((destination) => (
                                                <Card key={destination.id} className="overflow-hidden">
                                                        <div className="relative">
                                                                {destination.image_url ? (
                                                                        <img
                                                                                src={destination.image_url}
                                                                                alt={destination.name}
                                                                                className="w-full h-48 object-cover"
                                                                        />
                                                                ) : (
                                                                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                                                                                <MapPin className="w-12 h-12 text-muted-foreground" />
                                                                        </div>
                                                                )}
                                                                {destination.featured && (
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
                                                                                {destination.name}
                                                                        </h3>
                                                                </div>

                                                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                                        {destination.description}
                                                                </p>

                                                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                                                                {destination.category}
                                                                        </span>
                                                                        <span>
                                                                                {new Date(destination.created_at).toLocaleDateString()}
                                                                        </span>
                                                                </div>

                                                                <div className="flex gap-2">
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="flex-1"
                                                                                onClick={() => handleView(destination.slug)}
                                                                        >
                                                                                <Eye className="w-3 h-3 mr-1" />
                                                                                View
                                                                        </Button>

                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="flex-1"
                                                                                onClick={() => handleEdit(destination.id)}
                                                                        >
                                                                                <Edit className="w-3 h-3 mr-1" />
                                                                                Edit
                                                                        </Button>

                                                                        <Dialog>
                                                                                <DialogTrigger asChild>
                                                                                        <Button variant="destructive" size="sm">
                                                                                                <Trash2 className="w-3 h-3" />
                                                                                        </Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent>
                                                                                        <DialogHeader>
                                                                                                <DialogTitle>Delete Destination</DialogTitle>
                                                                                                <DialogDescription>
                                                                                                        Are you sure you want to delete "{destination.name}"? This action cannot be undone.
                                                                                                </DialogDescription>
                                                                                        </DialogHeader>
                                                                                        <div className="flex gap-2 justify-end">
                                                                                                <Button variant="outline">Cancel</Button>
                                                                                                <Button
                                                                                                        variant="destructive"
                                                                                                        onClick={() => handleDelete(destination.id)}
                                                                                                        disabled={deleteLoading === destination.id}
                                                                                                >
                                                                                                        {deleteLoading === destination.id ? "Deleting..." : "Delete"}
                                                                                                </Button>
                                                                                        </div>
                                                                                </DialogContent>
                                                                        </Dialog>
                                                                </div>
                                                        </CardContent>
                                                </Card>
                                        ))}
                                </div>
                        )}
                </div>
        )
}

export default DestinationsAdmin