"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Plus, Trash2, RefreshCw } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import ImageUploader from "@/components/admin/ImageUploader"
import { useParams, useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"

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
        places_to_visit: { [key: string]: any }
        things_to_do: { [key: string]: any }
        how_to_reach: any
        best_time_details: any
        where_to_stay: any
        itinerary: { [key: string]: any }
        travel_tips: string[]
        faqs: { [key: string]: any }
        slug?: string
}
import { useRouter } from "next/navigation"

const AdminDestinationEdit = () => {
        const { id } = useParams<{ id: string }>()
        const router = useRouter()
        const { toast } = useToast()
        const [loading, setLoading] = useState(true)
        const [saving, setSaving] = useState(false)
        const [refreshing, setRefreshing] = useState(false)
        const [activeTab, setActiveTab] = useState("basic")

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
                slug: "",
                overview: "",
                places_to_visit: {} as { [key: string]: any },
                things_to_do: {} as { [key: string]: any },
                how_to_reach: {
                        air: { title: "By Air", details: [] as string[] },
                        train: { title: "By Train", details: [] as string[] },
                        road: { title: "By Road", details: [] as string[] }
                },
                best_time_details: {
                        winter: { season: "", weather: "", why_visit: "", events: "", challenges: "" },
                        summer: { season: "", weather: "", why_visit: "", events: "", challenges: "" },
                        monsoon: { season: "", weather: "", why_visit: "", events: "", challenges: "" }
                },
                where_to_stay: {
                        budget: { category: "budget", description: "", options: [] as string[] },
                        midrange: { category: "midrange", description: "", options: [] as string[] },
                        luxury: { category: "luxury", description: "", options: [] as string[] }
                },
                itinerary: {} as { [key: string]: any },
                travel_tips: [] as string[],
                faqs: {} as { [key: string]: any }
        })

        useEffect(() => {
                if (id) {
                        fetchDestination()
                }
        }, [id])

        const [categories, setCategories] = useState<string[]>([])

        // Add this useEffect to fetch categories
        useEffect(() => {
                fetchCategories()
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
                                setCategories(data.map(item => item.name))
                        } else {
                                // Fallback to default categories
                                setCategories(["Trekking", "Wildlife", "Culture", "Adventure", "Pilgrimage", "Nature"])
                        }
                } catch (error) {
                        console.error("Error fetching categories:", error)
                        setCategories(["Trekking", "Wildlife", "Culture", "Adventure", "Pilgrimage", "Nature"])
                }
        }

        // Generate unique IDs for objects
        const generateId = () => {
                return Date.now().toString() + Math.random().toString(36).substr(2, 9)
        }

        // Enhanced JSON parsing that handles objects instead of arrays
        const parseDatabaseJson = (data: any, fallback: any, fieldName: string = '') => {
                console.log(`🔍 Parsing ${fieldName}:`, { data, type: typeof data })

                // If data is null or undefined, return fallback
                if (data === null || data === undefined) {
                        console.log(`📭 ${fieldName} is null/undefined, returning fallback`)
                        return fallback
                }

                // If it's already the correct type (object), return it directly
                if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                        console.log(`✅ ${fieldName} is already object, returning as-is`)
                        return data
                }

                // If it's an array, convert it to object format
                if (Array.isArray(data)) {
                        console.log(`🔄 ${fieldName} is array, converting to object format`)
                        const obj: { [key: string]: any } = {}
                        data.forEach((item, index) => {
                                const key = item.id || `item_${index}`
                                obj[key] = item
                        })
                        console.log(`✅ ${fieldName} converted to object:`, obj)
                        return obj
                }

                // Handle string data
                if (typeof data === 'string') {
                        // Handle empty strings or malformed JSON strings
                        if (data.trim() === '' || data === '""' || data === "''" || data === 'null' || data === 'undefined') {
                                console.log(`📭 ${fieldName} is empty string, returning fallback`)
                                return fallback
                        }

                        try {
                                const parsed = JSON.parse(data)
                                console.log(`✅ ${fieldName} parsed successfully:`, parsed)

                                // If parsed result is array, convert to object
                                if (Array.isArray(parsed)) {
                                        const obj: { [key: string]: any } = {}
                                        parsed.forEach((item, index) => {
                                                const key = item.id || `item_${index}`
                                                obj[key] = item
                                        })
                                        return obj
                                }

                                return parsed || fallback
                        } catch (e) {
                                console.error(`❌ Error parsing ${fieldName}:`, e, 'Raw data:', data)
                                return fallback
                        }
                }

                console.log(`❓ ${fieldName} unknown type, returning fallback`)
                return fallback
        }

        const fetchDestination = async () => {
                try {
                        console.log("🔄 Fetching destination with ID:", id)

                        const { data, error } = await supabase
                                .from("destinations")
                                .select("*")
                                .eq("id", id)
                                .single()

                        if (error) {
                                console.error("❌ Supabase fetch error:", error)
                                throw error
                        }

                        if (data) {
                                console.log("📦 Raw database data received:", data)

                                // Parse each field individually with object format
                                const places_to_visit = parseDatabaseJson(data.places_to_visit, {}, "places_to_visit")
                                const things_to_do = parseDatabaseJson(data.things_to_do, {}, "things_to_do")
                                const how_to_reach = parseDatabaseJson(data.how_to_reach, {
                                        air: { title: "By Air", details: [] },
                                        train: { title: "By Train", details: [] },
                                        road: { title: "By Road", details: [] }
                                }, "how_to_reach")
                                const best_time_details = parseDatabaseJson(data.best_time_details, {
                                        winter: { season: "", weather: "", why_visit: "", events: "", challenges: "" },
                                        summer: { season: "", weather: "", why_visit: "", events: "", challenges: "" },
                                        monsoon: { season: "", weather: "", why_visit: "", events: "", challenges: "" }
                                }, "best_time_details")
                                const where_to_stay = parseDatabaseJson(data.where_to_stay, {
                                        budget: { category: "budget", description: "", options: [] },
                                        midrange: { category: "midrange", description: "", options: [] },
                                        luxury: { category: "luxury", description: "", options: [] }
                                }, "where_to_stay")
                                const itinerary = parseDatabaseJson(data.itinerary, {}, "itinerary")
                                const faqs = parseDatabaseJson(data.faqs, {}, "faqs")
                                const travel_tips = Array.isArray(data.travel_tips) ? data.travel_tips : []
                                const highlights = Array.isArray(data.highlights) ? data.highlights : []

                                console.log("✅ Parsed data summary (Object format):")
                                console.log("📍 Places to visit keys:", Object.keys(places_to_visit))
                                console.log("🎯 Things to do keys:", Object.keys(things_to_do))
                                console.log("🗓️ Itinerary keys:", Object.keys(itinerary))
                                console.log("❓ FAQs keys:", Object.keys(faqs))

                                setFormData({
                                        name: data.name || "",
                                        description: data.description || "",
                                        highlights: highlights?.join(", ") || "",
                                        duration: data.duration || "",
                                        difficulty: data.difficulty || "",
                                        best_time: data.best_time || "",
                                        altitude: data.altitude || "",
                                        featured: data.featured || false,
                                        category: data.category || "",
                                        image_url: data.image_url || "",
                                        slug: data.slug || "",
                                        overview: data.overview || "",
                                        places_to_visit: places_to_visit,
                                        things_to_do: things_to_do,
                                        how_to_reach: how_to_reach,
                                        best_time_details: best_time_details,
                                        where_to_stay: where_to_stay,
                                        itinerary: itinerary,
                                        travel_tips: travel_tips,
                                        faqs: faqs
                                })

                                console.log("🎉 Form data set successfully with object format")
                        }
                } catch (error: any) {
                        console.error("❌ Error fetching destination:", error)
                        toast({
                                title: "Error fetching destination",
                                description: error.message,
                                variant: "destructive",
                        })
                } finally {
                        setLoading(false)
                }
        }

        const generateSlug = (name: string) => {
                return name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim()
        }

        useEffect(() => {
                if (formData.name && !formData.slug) {
                        const generatedSlug = generateSlug(formData.name)
                        setFormData(prev => ({ ...prev, slug: generatedSlug }))
                }
        }, [formData.name])

        // Fixed slug validation function
        const checkSlugExists = async (slug: string, excludeId: string): Promise<boolean> => {
                try {
                        const { data, error } = await supabase
                                .from("destinations")
                                .select("id")
                                .eq("slug", slug)
                                .neq("id", excludeId)

                        if (error) {
                                console.error("Error checking slug:", error)
                                // If there's an error, assume slug doesn't exist to avoid blocking saves
                                return false
                        }

                        return data && data.length > 0
                } catch (error) {
                        console.error("Exception checking slug:", error)
                        return false
                }
        }

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()
                setSaving(true)

                try {
                        // Validate required fields
                        if (!formData.name || !formData.description || !formData.duration || !formData.difficulty || !formData.best_time || !formData.category) {
                                toast({
                                        title: "Missing required fields",
                                        description: "Please fill in all required fields marked with *",
                                        variant: "destructive",
                                })
                                setSaving(false)
                                return
                        }

                        let finalSlug = formData.slug
                        if (!finalSlug) {
                                finalSlug = generateSlug(formData.name)
                        }

                        // Check for duplicate slug with proper error handling
                        if (id) {
                                const slugExists = await checkSlugExists(finalSlug, id)
                                if (slugExists) {
                                        toast({
                                                title: "Slug already exists",
                                                description: "Please choose a different slug",
                                                variant: "destructive",
                                        })
                                        setSaving(false)
                                        return
                                }
                        }

                        // Prepare data for database - using object format
                        const destinationData = {
                                name: formData.name,
                                description: formData.description,
                                highlights: formData.highlights.split(",").map(h => h.trim()).filter(Boolean),
                                duration: formData.duration,
                                difficulty: formData.difficulty,
                                best_time: formData.best_time,
                                altitude: formData.altitude || null,
                                featured: formData.featured,
                                category: formData.category,
                                image_url: formData.image_url || null,
                                slug: finalSlug || null,
                                overview: formData.overview || "",
                                places_to_visit: formData.places_to_visit,
                                things_to_do: formData.things_to_do,
                                how_to_reach: formData.how_to_reach,
                                best_time_details: formData.best_time_details,
                                where_to_stay: formData.where_to_stay,
                                itinerary: formData.itinerary,
                                travel_tips: formData.travel_tips,
                                faqs: formData.faqs,
                                updated_at: new Date().toISOString()
                        }

                        console.log("💾 Saving data to database (Object format):", {
                                ...destinationData,
                                places_to_visit_count: Object.keys(destinationData.places_to_visit).length,
                                things_to_do_count: Object.keys(destinationData.things_to_do).length,
                                itinerary_count: Object.keys(destinationData.itinerary).length,
                                faqs_count: Object.keys(destinationData.faqs).length
                        })

                        const { data, error } = await supabase
                                .from("destinations")
                                .update(destinationData)
                                .eq("id", id)
                                .select()

                        if (error) {
                                console.error("❌ Supabase update error:", error)
                                if (error.code === '23505') {
                                        toast({
                                                title: "Slug already exists",
                                                description: "Please choose a different slug for this destination",
                                                variant: "destructive",
                                        })
                                } else {
                                        throw error
                                }
                        } else {
                                console.log("✅ Update successful, returned data:", data)
                                toast({
                                        title: "Destination updated successfully",
                                        description: "All changes have been saved to the database."
                                })

                                // Force refresh to show updated data
                                setTimeout(() => {
                                        fetchDestination()
                                }, 500)
                        }
                } catch (error: any) {
                        console.error("❌ Error saving destination:", error)
                        toast({
                                title: "Error saving destination",
                                description: error.message,
                                variant: "destructive",
                        })
                } finally {
                        setSaving(false)
                }
        }

        const handleRefresh = async () => {
                setRefreshing(true)
                await fetchDestination()
                setRefreshing(false)
                toast({
                        title: "Data refreshed",
                        description: "Latest data loaded from database."
                })
        }

        // Object-based handlers
        const handleAddPlace = (place: any) => {
                const id = generateId()
                const updated = {
                        ...formData.places_to_visit,
                        [id]: {
                                id,
                                ...place
                        }
                }
                setFormData({ ...formData, places_to_visit: updated })
                console.log("➕ Added place:", place, "Total places:", Object.keys(updated).length)
        }

        const handleDeletePlace = (key: string) => {
                const updated = { ...formData.places_to_visit }
                delete updated[key]
                setFormData({ ...formData, places_to_visit: updated })
        }

        const handleAddActivity = (activity: any) => {
                const id = generateId()
                const updated = {
                        ...formData.things_to_do,
                        [id]: {
                                id,
                                ...activity
                        }
                }
                setFormData({ ...formData, things_to_do: updated })
                console.log("➕ Added activity:", activity, "Total activities:", Object.keys(updated).length)
        }

        const handleDeleteActivity = (key: string) => {
                const updated = { ...formData.things_to_do }
                delete updated[key]
                setFormData({ ...formData, things_to_do: updated })
        }

        const handleAddDay = (day: any) => {
                const id = generateId()
                const updated = {
                        ...formData.itinerary,
                        [id]: {
                                id,
                                ...day
                        }
                }
                setFormData({ ...formData, itinerary: updated })
                console.log("➕ Added itinerary day:", day, "Total days:", Object.keys(updated).length)
        }

        const handleDeleteDay = (key: string) => {
                const updated = { ...formData.itinerary }
                delete updated[key]
                setFormData({ ...formData, itinerary: updated })
        }

        const handleAddFAQ = (faq: any) => {
                const id = generateId()
                const updated = {
                        ...formData.faqs,
                        [id]: {
                                id,
                                ...faq
                        }
                }
                setFormData({ ...formData, faqs: updated })
                console.log("➕ Added FAQ:", faq, "Total FAQs:", Object.keys(updated).length)
        }

        const handleDeleteFAQ = (key: string) => {
                const updated = { ...formData.faqs }
                delete updated[key]
                setFormData({ ...formData, faqs: updated })
        }

        const tabs = [
                { id: "basic", label: "Basic Info" },
                { id: "overview", label: "Overview" },
                { id: "places", label: "Places to Visit" },
                { id: "activities", label: "Things to Do" },
                { id: "reach", label: "How to Reach" },
                { id: "besttime", label: "Best Time" },
                { id: "stay", label: "Where to Stay" },
                { id: "itinerary", label: "Itinerary" },
                { id: "tips", label: "Travel Tips" },
                { id: "faqs", label: "FAQs" },
        ]

        if (loading) {
                return <div className="text-center py-8">Loading destination...</div>
        }

        return (
                <div className="container mx-auto px-4 py-8">
                        <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                        <Button variant="outline" onClick={() => router.push("/admin")}>
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to Admin
                                        </Button>
                                        <h1 className="text-3xl font-bold">Edit Destination: {formData.name}</h1>
                                </div>
                                <div className="flex gap-2">
                                        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                                                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                                Refresh
                                        </Button>
                                        <Button onClick={handleSubmit} disabled={saving}>
                                                <Save className="mr-2 h-4 w-4" />
                                                {saving ? "Saving..." : "Save Changes"}
                                        </Button>
                                </div>
                        </div>

                        {/* Debug Info */}
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="font-semibold mb-2 text-blue-900">Data Status (Object Format - Manual Save):</h3>
                                <div className="text-sm text-blue-800 grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <div>Places to Visit: <strong>{Object.keys(formData.places_to_visit).length}</strong></div>
                                        <div>Things to Do: <strong>{Object.keys(formData.things_to_do).length}</strong></div>
                                        <div>Itinerary Days: <strong>{Object.keys(formData.itinerary).length}</strong></div>
                                        <div>FAQs: <strong>{Object.keys(formData.faqs).length}</strong></div>
                                </div>
                                <p className="text-xs text-blue-600 mt-2">
                                        Data stored as objects. Use Save Changes to persist your changes.
                                </p>
                        </div>

                        {/* REMOVED the main form wrapper and moved it to only wrap the actual form content */}
                        <div>
                                <div className="flex flex-wrap gap-1 border-b mb-6">
                                        {tabs.map((tab) => (
                                                <button
                                                        key={tab.id}
                                                        type="button"
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`px-3 py-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                                                ? "border-b-2 border-primary text-primary"
                                                                : "text-muted-foreground hover:text-foreground"
                                                                }`}
                                                >
                                                        {tab.label}
                                                </button>
                                        ))}
                                </div>

                                {/* Basic Info Tab */}
                                {activeTab === "basic" && (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
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
                                                                <Label htmlFor="slug">Slug (URL-friendly name)</Label>
                                                                <Input
                                                                        id="slug"
                                                                        value={formData.slug}
                                                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                                        placeholder="Auto-generated from name"
                                                                />
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                        This will be used in the URL. Leave empty to auto-generate.
                                                                </p>
                                                        </div>
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
                                                                <Label htmlFor="duration">Duration *</Label>
                                                                <Input
                                                                        id="duration"
                                                                        value={formData.duration}
                                                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                                        required
                                                                />
                                                        </div>
                                                        <div>
                                                                <Label htmlFor="difficulty">Difficulty *</Label>
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
                                                                <Label htmlFor="best_time">Best Time *</Label>
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
                                                        <Label htmlFor="category">Category *</Label>
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
                                                        <Label htmlFor="featured">Featured Destination</Label>
                                                </div>
                                        </form>
                                )}

                                {/* Overview Tab */}
                                {activeTab === "overview" && (
                                        <form onSubmit={handleSubmit}>
                                                <Label htmlFor="overview">Detailed Overview</Label>
                                                <Textarea
                                                        id="overview"
                                                        value={formData.overview}
                                                        onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                                                        rows={8}
                                                        placeholder="Provide a comprehensive overview of the destination..."
                                                />
                                        </form>
                                )}

                                {/* Places to Visit Tab */}
                                {activeTab === "places" && (
                                        <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold">Places to Visit ({Object.keys(formData.places_to_visit).length})</h3>
                                                        <Dialog>
                                                                <DialogTrigger asChild>
                                                                        <Button size="sm">
                                                                                <Plus className="w-4 h-4 mr-2" />
                                                                                Add Place
                                                                        </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                        <DialogHeader>
                                                                                <DialogTitle>Add Place to Visit</DialogTitle>
                                                                                <DialogDescription>
                                                                                        Add a new place that visitors should see at this destination.
                                                                                </DialogDescription>
                                                                        </DialogHeader>
                                                                        <PlaceForm onSubmit={handleAddPlace} />
                                                                </DialogContent>
                                                        </Dialog>
                                                </div>

                                                <div className="space-y-3">
                                                        {Object.entries(formData.places_to_visit).map(([key, place]) => (
                                                                <Card key={key}>
                                                                        <CardContent className="p-4">
                                                                                <div className="flex justify-between items-start">
                                                                                        <div className="flex-1">
                                                                                                <h4 className="font-semibold">{place.name}</h4>
                                                                                                <p className="text-sm text-muted-foreground mt-1">{place.description}</p>
                                                                                                {place.highlights && place.highlights.length > 0 && (
                                                                                                        <div className="mt-2 text-xs">
                                                                                                                <p className="font-medium">Highlights:</p>
                                                                                                                <ul className="list-disc list-inside">
                                                                                                                        {place.highlights.map((h: string, i: number) => (
                                                                                                                                <li key={i}>{h}</li>
                                                                                                                        ))}
                                                                                                                </ul>
                                                                                                        </div>
                                                                                                )}
                                                                                        </div>
                                                                                        <Button variant="destructive" size="sm" onClick={() => handleDeletePlace(key)}>
                                                                                                <Trash2 className="w-4 h-4" />
                                                                                        </Button>
                                                                                </div>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                        {Object.keys(formData.places_to_visit).length === 0 && (
                                                                <p className="text-sm text-muted-foreground text-center py-4">No places added yet.</p>
                                                        )}
                                                </div>
                                        </div>
                                )}

                                {/* Things to Do Tab */}
                                {activeTab === "activities" && (
                                        <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold">Things to Do ({Object.keys(formData.things_to_do).length})</h3>
                                                        <Dialog>
                                                                <DialogTrigger asChild>
                                                                        <Button size="sm">
                                                                                <Plus className="w-4 h-4 mr-2" />
                                                                                Add Activity
                                                                        </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                        <DialogHeader>
                                                                                <DialogTitle>Add Activity</DialogTitle>
                                                                                <DialogDescription>
                                                                                        Add a new activity that visitors can enjoy at this destination.
                                                                                </DialogDescription>
                                                                        </DialogHeader>
                                                                        <ActivityForm onSubmit={handleAddActivity} />
                                                                </DialogContent>
                                                        </Dialog>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {Object.entries(formData.things_to_do).map(([key, activity]) => (
                                                                <Card key={key}>
                                                                        <CardContent className="p-4">
                                                                                <div className="flex justify-between items-start">
                                                                                        <div className="flex-1">
                                                                                                <h4 className="font-semibold text-sm">{activity.title}</h4>
                                                                                                <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                                                                                        </div>
                                                                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteActivity(key)}>
                                                                                                <Trash2 className="w-4 h-4" />
                                                                                        </Button>
                                                                                </div>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                        {Object.keys(formData.things_to_do).length === 0 && (
                                                                <p className="text-sm text-muted-foreground text-center py-4">No activities added yet.</p>
                                                        )}
                                                </div>
                                        </div>
                                )}

                                {/* How to Reach Tab */}
                                {activeTab === "reach" && (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {["air", "train", "road"].map((method) => (
                                                                <div key={method}>
                                                                        <Label htmlFor={`reach-${method}`} className="capitalize">
                                                                                By {method}
                                                                        </Label>
                                                                        <Textarea
                                                                                id={`reach-${method}`}
                                                                                value={formData.how_to_reach[method as keyof typeof formData.how_to_reach]?.details?.join("\n") || ""}
                                                                                onChange={(e) => {
                                                                                        const details = e.target.value.split("\n").filter((d) => d.trim())
                                                                                        setFormData({
                                                                                                ...formData,
                                                                                                how_to_reach: {
                                                                                                        ...formData.how_to_reach,
                                                                                                        [method]: {
                                                                                                                ...formData.how_to_reach[method as keyof typeof formData.how_to_reach],
                                                                                                                details,
                                                                                                        },
                                                                                                },
                                                                                        })
                                                                                }}
                                                                                placeholder={`Enter ${method} details (one per line)`}
                                                                                rows={4}
                                                                        />
                                                                </div>
                                                        ))}
                                                </div>
                                        </form>
                                )}

                                {/* Best Time Tab */}
                                {activeTab === "besttime" && (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {["winter", "summer", "monsoon"].map((season) => (
                                                                <div key={season}>
                                                                        <Label className="capitalize font-semibold mb-2 block">{season}</Label>
                                                                        <div className="space-y-2">
                                                                                <Input
                                                                                        placeholder="Season dates"
                                                                                        value={formData.best_time_details[season as keyof typeof formData.best_time_details]?.season || ""}
                                                                                        onChange={(e) => {
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        best_time_details: {
                                                                                                                ...formData.best_time_details,
                                                                                                                [season]: {
                                                                                                                        ...formData.best_time_details[season as keyof typeof formData.best_time_details],
                                                                                                                        season: e.target.value,
                                                                                                                },
                                                                                                        },
                                                                                                })
                                                                                        }}
                                                                                />
                                                                                <Textarea
                                                                                        placeholder="Weather"
                                                                                        value={formData.best_time_details[season as keyof typeof formData.best_time_details]?.weather || ""}
                                                                                        onChange={(e) => {
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        best_time_details: {
                                                                                                                ...formData.best_time_details,
                                                                                                                [season]: {
                                                                                                                        ...formData.best_time_details[season as keyof typeof formData.best_time_details],
                                                                                                                        weather: e.target.value,
                                                                                                                },
                                                                                                        },
                                                                                                })
                                                                                        }}
                                                                                        rows={2}
                                                                                />
                                                                                <Textarea
                                                                                        placeholder="Why visit"
                                                                                        value={formData.best_time_details[season as keyof typeof formData.best_time_details]?.why_visit || ""}
                                                                                        onChange={(e) => {
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        best_time_details: {
                                                                                                                ...formData.best_time_details,
                                                                                                                [season]: {
                                                                                                                        ...formData.best_time_details[season as keyof typeof formData.best_time_details],
                                                                                                                        why_visit: e.target.value,
                                                                                                                },
                                                                                                        },
                                                                                                })
                                                                                        }}
                                                                                        rows={2}
                                                                                />
                                                                                <Textarea
                                                                                        placeholder="Events"
                                                                                        value={formData.best_time_details[season as keyof typeof formData.best_time_details]?.events || ""}
                                                                                        onChange={(e) => {
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        best_time_details: {
                                                                                                                ...formData.best_time_details,
                                                                                                                [season]: {
                                                                                                                        ...formData.best_time_details[season as keyof typeof formData.best_time_details],
                                                                                                                        events: e.target.value,
                                                                                                                },
                                                                                                        },
                                                                                                })
                                                                                        }}
                                                                                        rows={2}
                                                                                />
                                                                                <Textarea
                                                                                        placeholder="Challenges"
                                                                                        value={formData.best_time_details[season as keyof typeof formData.best_time_details]?.challenges || ""}
                                                                                        onChange={(e) => {
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        best_time_details: {
                                                                                                                ...formData.best_time_details,
                                                                                                                [season]: {
                                                                                                                        ...formData.best_time_details[season as keyof typeof formData.best_time_details],
                                                                                                                        challenges: e.target.value,
                                                                                                                },
                                                                                                        },
                                                                                                })
                                                                                        }}
                                                                                        rows={2}
                                                                                />
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </form>
                                )}

                                {/* Where to Stay Tab */}
                                {activeTab === "stay" && (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {["budget", "midrange", "luxury"].map((category) => (
                                                                <div key={category}>
                                                                        <Label className="capitalize font-semibold mb-2 block">{category}</Label>
                                                                        <Textarea
                                                                                placeholder={`${category} description`}
                                                                                value={formData.where_to_stay[category as keyof typeof formData.where_to_stay]?.description || ""}
                                                                                onChange={(e) => {
                                                                                        setFormData({
                                                                                                ...formData,
                                                                                                where_to_stay: {
                                                                                                        ...formData.where_to_stay,
                                                                                                        [category]: {
                                                                                                                ...formData.where_to_stay[category as keyof typeof formData.where_to_stay],
                                                                                                                description: e.target.value,
                                                                                                        },
                                                                                                },
                                                                                        })
                                                                                }}
                                                                                rows={3}
                                                                        />
                                                                        <Textarea
                                                                                placeholder="Options (one per line)"
                                                                                value={formData.where_to_stay[category as keyof typeof formData.where_to_stay]?.options?.join("\n") || ""}
                                                                                onChange={(e) => {
                                                                                        const options = e.target.value.split("\n").filter((o) => o.trim())
                                                                                        setFormData({
                                                                                                ...formData,
                                                                                                where_to_stay: {
                                                                                                        ...formData.where_to_stay,
                                                                                                        [category]: {
                                                                                                                ...formData.where_to_stay[category as keyof typeof formData.where_to_stay],
                                                                                                                options,
                                                                                                        },
                                                                                                },
                                                                                        })
                                                                                }}
                                                                                rows={3}
                                                                                className="mt-2"
                                                                        />
                                                                </div>
                                                        ))}
                                                </div>
                                        </form>
                                )}

                                {/* Itinerary Tab */}
                                {activeTab === "itinerary" && (
                                        <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold">Itinerary ({Object.keys(formData.itinerary).length} days)</h3>
                                                        <Dialog>
                                                                <DialogTrigger asChild>
                                                                        <Button size="sm">
                                                                                <Plus className="w-4 h-4 mr-2" />
                                                                                Add Day
                                                                        </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                        <DialogHeader>
                                                                                <DialogTitle>Add Itinerary Day</DialogTitle>
                                                                                <DialogDescription>
                                                                                        Add a new day to the travel itinerary for this destination.
                                                                                </DialogDescription>
                                                                        </DialogHeader>
                                                                        <ItineraryForm onSubmit={handleAddDay} />
                                                                </DialogContent>
                                                        </Dialog>
                                                </div>

                                                <div className="space-y-3">
                                                        {Object.entries(formData.itinerary).map(([key, day]) => (
                                                                <Card key={key}>
                                                                        <CardContent className="p-4">
                                                                                <div className="flex justify-between items-start">
                                                                                        <div className="flex-1">
                                                                                                <h4 className="font-semibold">
                                                                                                        Day {day.day}: {day.title}
                                                                                                </h4>
                                                                                                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                                                                                                        {day.activities?.map((activity: string, i: number) => (
                                                                                                                <li key={i}>• {activity}</li>
                                                                                                        ))}
                                                                                                </ul>
                                                                                        </div>
                                                                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteDay(key)}>
                                                                                                <Trash2 className="w-4 h-4" />
                                                                                        </Button>
                                                                                </div>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                        {Object.keys(formData.itinerary).length === 0 && (
                                                                <p className="text-sm text-muted-foreground text-center py-4">No itinerary days added yet.</p>
                                                        )}
                                                </div>
                                        </div>
                                )}

                                {/* Travel Tips Tab */}
                                {activeTab === "tips" && (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                                <div>
                                                        <Label htmlFor="tips">Travel Tips (one per line)</Label>
                                                        <Textarea
                                                                id="tips"
                                                                value={formData.travel_tips.join("\n")}
                                                                onChange={(e) => {
                                                                        const tips = e.target.value.split("\n").filter((t) => t.trim())
                                                                        setFormData({ ...formData, travel_tips: tips })
                                                                }}
                                                                placeholder="Enter travel tips, one per line"
                                                                rows={8}
                                                        />
                                                </div>
                                        </form>
                                )}

                                {/* FAQs Tab */}
                                {activeTab === "faqs" && (
                                        <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold">Frequently Asked Questions ({Object.keys(formData.faqs).length})</h3>
                                                        <Dialog>
                                                                <DialogTrigger asChild>
                                                                        <Button size="sm">
                                                                                <Plus className="w-4 h-4 mr-2" />
                                                                                Add FAQ
                                                                        </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                        <DialogHeader>
                                                                                <DialogTitle>Add FAQ</DialogTitle>
                                                                                <DialogDescription>
                                                                                        Add a new frequently asked question and its answer.
                                                                                </DialogDescription>
                                                                        </DialogHeader>
                                                                        <FAQForm onSubmit={handleAddFAQ} />
                                                                </DialogContent>
                                                        </Dialog>
                                                </div>

                                                <div className="space-y-3">
                                                        {Object.entries(formData.faqs).map(([key, faq]) => (
                                                                <Card key={key}>
                                                                        <CardContent className="p-4">
                                                                                <div className="flex justify-between items-start">
                                                                                        <div className="flex-1">
                                                                                                <h4 className="font-semibold text-sm">{faq.question}</h4>
                                                                                                <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
                                                                                        </div>
                                                                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteFAQ(key)}>
                                                                                                <Trash2 className="w-4 h-4" />
                                                                                        </Button>
                                                                                </div>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                        {Object.keys(formData.faqs).length === 0 && (
                                                                <p className="text-sm text-muted-foreground text-center py-4">No FAQs added yet.</p>
                                                        )}
                                                </div>
                                        </div>
                                )}
                        </div>
                </div>
        )
}

// Sub-components for forms
function PlaceForm({ onSubmit }: { onSubmit: (place: any) => void }) {
        const [formData, setFormData] = useState({
                name: "",
                description: "",
                highlights: "",
        })

        const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault()
                const placeData = {
                        name: formData.name,
                        description: formData.description,
                        highlights: formData.highlights.split("\n").filter((h) => h.trim()),
                }
                console.log("🎯 Submitting place:", placeData)
                onSubmit(placeData)
                setFormData({ name: "", description: "", highlights: "" })
        }

        return (
                <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                                <Label htmlFor="place-name">Place Name</Label>
                                <Input
                                        id="place-name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                />
                        </div>
                        <div>
                                <Label htmlFor="place-desc">Description</Label>
                                <Textarea
                                        id="place-desc"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                />
                        </div>
                        <div>
                                <Label htmlFor="place-highlights">Highlights (one per line)</Label>
                                <Textarea
                                        id="place-highlights"
                                        value={formData.highlights}
                                        onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                                        placeholder="Enter highlights, one per line"
                                        rows={3}
                                />
                        </div>
                        <Button type="submit" className="w-full">
                                Add Place
                        </Button>
                </form>
        )
}

function ActivityForm({ onSubmit }: { onSubmit: (activity: any) => void }) {
        const [formData, setFormData] = useState({
                title: "",
                description: "",
        })

        const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault()
                const activityData = {
                        title: formData.title,
                        description: formData.description,
                }
                console.log("🎯 Submitting activity:", activityData)
                onSubmit(activityData)
                setFormData({ title: "", description: "" })
        }

        return (
                <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                                <Label htmlFor="activity-title">Activity Title</Label>
                                <Input
                                        id="activity-title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                />
                        </div>
                        <div>
                                <Label htmlFor="activity-desc">Description</Label>
                                <Textarea
                                        id="activity-desc"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                />
                        </div>
                        <Button type="submit" className="w-full">
                                Add Activity
                        </Button>
                </form>
        )
}

function ItineraryForm({ onSubmit }: { onSubmit: (day: any) => void }) {
        const [formData, setFormData] = useState({
                day: 1,
                title: "",
                activities: "",
        })

        const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault()
                const dayData = {
                        day: formData.day,
                        title: formData.title,
                        activities: formData.activities.split("\n").filter((a) => a.trim()),
                }
                console.log("🎯 Submitting itinerary day:", dayData)
                onSubmit(dayData)
                setFormData({ day: formData.day + 1, title: "", activities: "" })
        }

        return (
                <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                                <Label htmlFor="day-num">Day Number</Label>
                                <Input
                                        id="day-num"
                                        type="number"
                                        value={formData.day}
                                        onChange={(e) => setFormData({ ...formData, day: Number.parseInt(e.target.value) })}
                                        required
                                />
                        </div>
                        <div>
                                <Label htmlFor="day-title">Day Title</Label>
                                <Input
                                        id="day-title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                />
                        </div>
                        <div>
                                <Label htmlFor="day-activities">Activities (one per line)</Label>
                                <Textarea
                                        id="day-activities"
                                        value={formData.activities}
                                        onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                                        placeholder="Enter activities, one per line"
                                        rows={4}
                                        required
                                />
                        </div>
                        <Button type="submit" className="w-full">
                                Add Day
                        </Button>
                </form>
        )
}

function FAQForm({ onSubmit }: { onSubmit: (faq: any) => void }) {
        const [formData, setFormData] = useState({
                question: "",
                answer: "",
        })

        const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault()
                const faqData = {
                        question: formData.question,
                        answer: formData.answer,
                }
                console.log("🎯 Submitting FAQ:", faqData)
                onSubmit(faqData)
                setFormData({ question: "", answer: "" })
        }

        return (
                <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                                <Label htmlFor="faq-question">Question</Label>
                                <Input
                                        id="faq-question"
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        required
                                />
                        </div>
                        <div>
                                <Label htmlFor="faq-answer">Answer</Label>
                                <Textarea
                                        id="faq-answer"
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        required
                                />
                        </div>
                        <Button type="submit" className="w-full">
                                Add FAQ
                        </Button>
                </form>
        )
}

export default AdminDestinationEdit