"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
        overview?: string
        places_to_visit: any[]
        things_to_do: any[]
        how_to_reach: any
        best_time_details: any
        where_to_stay: any
        itinerary: any[]
        travel_tips: string[]
        faqs: any[]
        slug?: string
}

const DestinationsAdmin = () => {
        const [destinations, setDestinations] = useState<Destination[]>([])
        const [loading, setLoading] = useState(true)
        const { toast } = useToast()
        const navigate = useNavigate()

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

        const handleEdit = (destination: Destination) => {
                navigate(`/admin/destination/${destination.id}`)
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

        const handleAddDestination = async (destinationData: any) => {
                try {
                        // Generate slug if not provided
                        if (!destinationData.slug) {
                                destinationData.slug = destinationData.name
                                        .toLowerCase()
                                        .replace(/[^a-z0-9\s]/g, '')
                                        .replace(/\s+/g, '-')
                                        .replace(/-+/g, '-')
                                        .trim()
                        }

                        const { error } = await supabase.from("destinations").insert([destinationData])

                        if (error) {
                                if (error.code === '23505') {
                                        toast({
                                                title: "Slug already exists",
                                                description: "Please choose a different name or slug",
                                                variant: "destructive",
                                        })
                                } else {
                                        throw error
                                }
                        } else {
                                toast({ title: "Destination created successfully" })
                        }
                } catch (error: any) {
                        toast({
                                title: "Error creating destination",
                                description: error.message,
                                variant: "destructive",
                        })
                }
        }

        if (loading) {
                return <div className="text-center py-8">Loading destinations...</div>
        }

        return (
                <div className="space-y-6">
                        <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Manage Destinations</h2>
                                <Dialog>
                                        <DialogTrigger asChild>
                                                <Button>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Destination
                                                </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                        <DialogTitle>Add New Destination</DialogTitle>
                                                </DialogHeader>
                                                <AddDestinationForm onSubmit={handleAddDestination} />
                                        </DialogContent>
                                </Dialog>
                        </div>

                        {/* Destinations List */}
                        <div className="grid gap-4">
                                {destinations.map((destination) => (
                                        <Card key={destination.id}>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-2">
                                                                        <span>{destination.name}</span>
                                                                        {destination.slug && (
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                        /{destination.slug}
                                                                                </Badge>
                                                                        )}
                                                                        {destination.featured && (
                                                                                <Badge variant="default" className="bg-yellow-500 text-xs">
                                                                                        Featured
                                                                                </Badge>
                                                                        )}
                                                                </div>
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

                                                        <div className="flex flex-wrap gap-2 text-sm mb-3">
                                                                <span className="bg-primary/10 px-2 py-1 rounded">{destination.category}</span>
                                                                <span className="bg-secondary/50 px-2 py-1 rounded">{destination.duration}</span>
                                                                <span className="bg-accent/50 px-2 py-1 rounded">{destination.difficulty}</span>
                                                                {destination.altitude && (
                                                                        <span className="bg-blue-500/10 px-2 py-1 rounded">{destination.altitude}</span>
                                                                )}
                                                        </div>

                                                        {/* Extended Information Collapsible */}
                                                        <Collapsible>
                                                                <CollapsibleTrigger className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                                                                        <ChevronRight className="h-4 w-4 mr-1" />
                                                                        View Detailed Information
                                                                </CollapsibleTrigger>
                                                                <CollapsibleContent className="mt-2 space-y-2 text-sm">
                                                                        {destination.overview && (
                                                                                <div>
                                                                                        <strong>Overview:</strong>
                                                                                        <p className="mt-1 text-muted-foreground">{destination.overview.substring(0, 200)}...</p>
                                                                                </div>
                                                                        )}

                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                <div>
                                                                                        <strong>Places to Visit:</strong>
                                                                                        <span className="ml-2 text-muted-foreground">
                                                                                                {destination.places_to_visit?.length || 0} items
                                                                                        </span>
                                                                                </div>
                                                                                <div>
                                                                                        <strong>Things to Do:</strong>
                                                                                        <span className="ml-2 text-muted-foreground">
                                                                                                {destination.things_to_do?.length || 0} activities
                                                                                        </span>
                                                                                </div>
                                                                                <div>
                                                                                        <strong>Itinerary:</strong>
                                                                                        <span className="ml-2 text-muted-foreground">
                                                                                                {destination.itinerary?.length || 0} days
                                                                                        </span>
                                                                                </div>
                                                                                <div>
                                                                                        <strong>FAQs:</strong>
                                                                                        <span className="ml-2 text-muted-foreground">
                                                                                                {destination.faqs?.length || 0} questions
                                                                                        </span>
                                                                                </div>
                                                                        </div>
                                                                </CollapsibleContent>
                                                        </Collapsible>
                                                </CardContent>
                                        </Card>
                                ))}
                        </div>
                </div>
        )
}

function AddDestinationForm({ onSubmit }: { onSubmit: (data: any) => void }) {
        const [formData, setFormData] = useState({
                name: "",
                description: "",
                category: "",
                duration: "",
                difficulty: "",
                best_time: "",
                slug: "",
        })

        const generateSlug = (name: string) => {
                return name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim()
        }

        const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault()

                // Generate slug if empty
                const finalSlug = formData.slug || generateSlug(formData.name)

                onSubmit({
                        ...formData,
                        slug: finalSlug,
                        highlights: [],
                        places_to_visit: [],
                        things_to_do: [],
                        itinerary: [],
                        travel_tips: [],
                        faqs: [],
                        how_to_reach: {
                                air: { title: "By Air", details: [] },
                                train: { title: "By Train", details: [] },
                                road: { title: "By Road", details: [] }
                        },
                        best_time_details: {
                                winter: { season: "", weather: "", why_visit: "", events: "", challenges: "" },
                                summer: { season: "", weather: "", why_visit: "", events: "", challenges: "" },
                                monsoon: { season: "", weather: "", why_visit: "", events: "", challenges: "" }
                        },
                        where_to_stay: {
                                budget: { category: "budget", description: "", options: [] },
                                midrange: { category: "midrange", description: "", options: [] },
                                luxury: { category: "luxury", description: "", options: [] }
                        }
                })
                setFormData({ name: "", description: "", category: "", duration: "", difficulty: "", best_time: "", slug: "" })
        }

        return (
                <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                />
                        </div>
                        <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                                <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Input
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                required
                                        />
                                </div>
                                <div>
                                        <Label htmlFor="duration">Duration *</Label>
                                        <Input
                                                id="duration"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                required
                                        />
                                </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                                <div>
                                        <Label htmlFor="difficulty">Difficulty *</Label>
                                        <Input
                                                id="difficulty"
                                                value={formData.difficulty}
                                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                                required
                                        />
                                </div>
                                <div>
                                        <Label htmlFor="best_time">Best Time *</Label>
                                        <Input
                                                id="best_time"
                                                value={formData.best_time}
                                                onChange={(e) => setFormData({ ...formData, best_time: e.target.value })}
                                                required
                                        />
                                </div>
                        </div>
                        <div>
                                <Label htmlFor="slug">Slug (optional)</Label>
                                <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="Auto-generated from name"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                        URL-friendly version of the name. Leave empty to auto-generate.
                                </p>
                        </div>
                        <Button type="submit" className="w-full">
                                Create Destination
                        </Button>
                </form>
        )
}

export default DestinationsAdmin