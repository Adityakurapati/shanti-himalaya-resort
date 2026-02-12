"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash2, Plus, Save, X, Loader2, Image as ImageIcon, Eye, MapPin, Home, Utensils, Star, Check, Users } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import StayImagesManager from "./StayImagesManager"
import RestaurantImagesManager from "./RestaurantImagesManager"
import { AIButton } from "./AIButton"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import ImageUploader from "./ImageUploader"
import MapPicker from "./MapPicker"

const CATEGORIES = ["Luxury", "Boutique", "Jungle Lodge", "Homestay", "Experience", "Peace & Relaxation", "Family Holiday", "Experiential", "Nature"] as const;

// Helper function to parse JSON data
const parseJSON = (data: any, defaultValue: any = null) => {
  if (!data) return defaultValue;
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
};

// Helper function to stringify features
const stringifyFeatures = (features: string[]): string => {
  return JSON.stringify(features);
};

interface AccommodationFormData {
  id?: string;
  name: string;
  image_url: string;
  capacity: string;
  features: string;
  sort_order: number;
}

interface FormTabsData {
  basic: {
    name: string;
    badge: string;
    duration: string;
    description: string;
    overview: string;
  };
  details: {
    location: string;
    address: string;
    connectivity_airport: string;
    connectivity_railway: string;
    connectivity_city: string;
  };
  restaurant: {
    restaurant_description: string;
  };
}

interface LocationData {
  map_url: string;
  latitude: number | null;
  longitude: number | null;
  zoom: number;
}

export default function ExperientialStaysAdmin() {
  const [stays, setStays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStay, setEditingStay] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false)
  const [selectedStay, setSelectedStay] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [accommodations, setAccommodations] = useState<AccommodationFormData[]>([])
  const [editingAccommodation, setEditingAccommodation] = useState<number | null>(null)
  const [isCreatingAccommodation, setIsCreatingAccommodation] = useState(false)
  const [accommodationFormData, setAccommodationFormData] = useState({
    name: "",
    image_url: "",
    capacity: "",
    features: "",
  })

  // Location data state - includes map_url and coordinates
  const [locationData, setLocationData] = useState<LocationData>({
    map_url: "",
    latitude: null,
    longitude: null,
    zoom: 13
  })

  const [formData, setFormData] = useState<FormTabsData>({
    basic: {
      name: "",
      badge: "Popular",
      duration: "",
      description: "",
      overview: "",
    },
    details: {
      location: "",
      address: "",
      connectivity_airport: "",
      connectivity_railway: "",
      connectivity_city: "",
    },
    restaurant: {
      restaurant_description: "",
    }
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchStays()
  }, [])

  // Fetch accommodations when editing a stay
  useEffect(() => {
    if (editingStay) {
      fetchAccommodations()
    }
  }, [editingStay])

  const fetchStays = async () => {
    try {
      const { data, error } = await supabase
        .from("experiential_stays")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setStays(data || [])
    } catch (error) {
      console.error("Error fetching stays:", error)
      toast({
        title: "Error",
        description: "Failed to load experiential stays",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAccommodations = async () => {
    if (!editingStay) return;

    try {
      const { data, error } = await supabase
        .from("accommodation_options")
        .select("*")
        .eq("stay_id", editingStay)
        .order("sort_order", { ascending: true })

      if (error) throw error

      const accommodationsWithParsedFeatures: AccommodationFormData[] = (data || []).map(acc => {
        let featuresText = "";

        try {
          const featuresArray = parseJSON(acc.features, []);
          if (Array.isArray(featuresArray)) {
            featuresText = featuresArray.join("\n");
          } else if (typeof featuresArray === 'string') {
            try {
              featuresText = JSON.parse(featuresArray).join("\n");
            } catch {
              featuresText = featuresArray;
            }
          }
        } catch (e) {
          console.error("Error parsing features:", e);
          featuresText = "";
        }

        return {
          id: acc.id,
          name: acc.name,
          image_url: acc.image_url || "",
          capacity: acc.capacity || "",
          sort_order: acc.sort_order || 0,
          features: featuresText
        };
      })

      setAccommodations(accommodationsWithParsedFeatures)
    } catch (error) {
      console.error("Error fetching accommodations:", error)
      toast({
        title: "Error",
        description: "Failed to load accommodation options",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    tab: keyof FormTabsData
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [name]: value
      }
    }));
  };

  const handleAccommodationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAccommodationFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEdit = (stay: any) => {
    setEditingStay(stay.id)
    setIsCreating(false)
    setSelectedStay(stay)

    const categories = parseJSON(stay.categories, []);
    setSelectedCategories(categories);

    const connectivity = parseJSON(stay.connectivity, {});

    // Set location data - including map_url and coordinates
    setLocationData({
      map_url: stay.map_url || "",
      latitude: stay.latitude || null,
      longitude: stay.longitude || null,
      zoom: stay.map_zoom_level || 13
    });

    setFormData({
      basic: {
        name: stay.name || "",
        badge: stay.badge || "Popular",
        duration: stay.duration || "",
        description: stay.description || "",
        overview: stay.overview || "",
      },
      details: {
        location: stay.location || "",
        address: stay.address || "",
        connectivity_airport: connectivity.airport || "",
        connectivity_railway: connectivity.railway || "",
        connectivity_city: connectivity.city || "",
      },
      restaurant: {
        restaurant_description: stay.restaurant_description || "",
      }
    })
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);
  }

  const handleManageImages = (stay: any) => {
    setSelectedStay(stay)
    setImagesDialogOpen(true)
  }

  const resetLocationData = () => {
    setLocationData({
      map_url: "",
      latitude: null,
      longitude: null,
      zoom: 13
    });
  }

  const handleCancelEdit = () => {
    setEditingStay(null)
    setIsCreating(false)
    setSelectedCategories([])
    setActiveTab("basic")
    setSelectedStay(null)
    setAccommodations([])
    resetForm()
    resetAccommodationForm()
    resetLocationData()
  }

  const resetForm = () => {
    setFormData({
      basic: {
        name: "",
        badge: "Popular",
        duration: "",
        description: "",
        overview: "",
      },
      details: {
        location: "",
        address: "",
        connectivity_airport: "",
        connectivity_railway: "",
        connectivity_city: "",
      },
      restaurant: {
        restaurant_description: "",
      }
    })
  }

  const resetAccommodationForm = () => {
    setAccommodationFormData({
      name: "",
      image_url: "",
      capacity: "",
      features: "",
    })
    setEditingAccommodation(null)
    setIsCreatingAccommodation(false)
  }

  const handleEditAccommodation = (index: number) => {
    const accommodation = accommodations[index]
    setEditingAccommodation(index)
    setIsCreatingAccommodation(false)

    let featuresForTextarea = "";
    if (Array.isArray(accommodation.features)) {
      featuresForTextarea = accommodation.features.join("\n");
    } else if (typeof accommodation.features === 'string') {
      try {
        const parsedFeatures = JSON.parse(accommodation.features);
        if (Array.isArray(parsedFeatures)) {
          featuresForTextarea = parsedFeatures.join("\n");
        } else {
          featuresForTextarea = accommodation.features;
        }
      } catch (error) {
        featuresForTextarea = accommodation.features;
      }
    }

    setAccommodationFormData({
      name: accommodation.name,
      image_url: accommodation.image_url || "",
      capacity: accommodation.capacity,
      features: featuresForTextarea,
    })
  }

  const handleSaveAccommodation = () => {
    if (!accommodationFormData.name.trim()) {
      toast({
        title: "Error",
        description: "Accommodation name is required",
        variant: "destructive",
      })
      return
    }

    const featuresArray = accommodationFormData.features
      .split("\n")
      .filter(f => f.trim())
      .map(f => f.trim());

    const featuresJson = JSON.stringify(featuresArray);

    if (editingAccommodation !== null) {
      const updatedAccommodations = [...accommodations]
      updatedAccommodations[editingAccommodation] = {
        ...updatedAccommodations[editingAccommodation],
        name: accommodationFormData.name,
        image_url: accommodationFormData.image_url,
        capacity: accommodationFormData.capacity,
        features: featuresJson,
      }
      setAccommodations(updatedAccommodations)
    } else {
      const newAccommodation: AccommodationFormData = {
        name: accommodationFormData.name,
        image_url: accommodationFormData.image_url,
        capacity: accommodationFormData.capacity,
        features: featuresJson,
        sort_order: accommodations.length
      }
      setAccommodations([...accommodations, newAccommodation])
    }

    resetAccommodationForm()
    toast({
      title: "Success",
      description: "Accommodation saved",
    })
  }

  const handleDeleteAccommodation = (index: number) => {
    if (!confirm("Are you sure you want to delete this accommodation?")) return

    const updatedAccommodations = accommodations.filter((_, i) => i !== index)
    const reorderedAccommodations = updatedAccommodations.map((acc, idx) => ({
      ...acc,
      sort_order: idx
    }))
    setAccommodations(reorderedAccommodations)

    toast({
      title: "Success",
      description: "Accommodation deleted",
    })
  }

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(accommodations)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const reorderedWithSortOrder = items.map((item, index) => ({
      ...item,
      sort_order: index
    }))

    setAccommodations(reorderedWithSortOrder)
  }

  const handleSave = async () => {
    if (!formData.basic.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }

    setSaving(true);
    try {
      // Generate slug from name
      const slug = formData.basic.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const stayData = {
        name: formData.basic.name,
        slug: slug,
        badge: formData.basic.badge,
        duration: formData.basic.duration,
        description: formData.basic.description,
        overview: formData.basic.overview,
        categories: selectedCategories,
        location: formData.details.location,
        address: formData.details.address,
        // IMPORTANT: Save the map_url
        map_url: locationData.map_url || null,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        map_zoom_level: locationData.zoom,
        connectivity: {
          airport: formData.details.connectivity_airport,
          railway: formData.details.connectivity_railway,
          city: formData.details.connectivity_city
        },
        restaurant_description: formData.restaurant.restaurant_description,
        updated_at: new Date().toISOString()
      }

      console.log("Saving stay with map_url:", stayData.map_url); // Debug log

      let savedStayId: string;

      if (editingStay) {
        const { data, error } = await supabase
          .from("experiential_stays")
          .update(stayData)
          .eq("id", editingStay)
          .select()
          .single()

        if (error) throw error

        savedStayId = data.id;
        setSelectedStay(data);
        await saveAccommodationsToDatabase(savedStayId);

        toast({
          title: "Success",
          description: "Stay updated successfully with accommodations",
        })
      } else {
        const { data, error } = await supabase
          .from("experiential_stays")
          .insert([stayData])  
          .select()
          .single();

        if (error) throw error

        savedStayId = data.id;
        setSelectedStay(data);
        setEditingStay(data.id);

        const accommodationsWithStayId = accommodations.map(acc => ({
          ...acc,
          stay_id: savedStayId
        }));
        setAccommodations(accommodationsWithStayId);
        await saveAccommodationsToDatabase(savedStayId);

        toast({
          title: "Success",
          description: "Stay created successfully with accommodations",
        })

        handleCancelEdit();
      }

      fetchStays();

      toast({
        title: "Stay Saved Successfully",
        description: `${formData.basic.name} has been saved with ${accommodations.length} accommodation options.`,
        duration: 3000,
      });

    } catch (error: any) {
      console.error("Error saving stay:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save stay",
        variant: "destructive",
      })
    } finally {
      setSaving(false);
    }
  }

  const saveAccommodationsToDatabase = async (stayId: string) => {
    if (!stayId) {
      console.error("No stay ID provided for saving accommodations");
      toast({
        title: "Error",
        description: "No stay ID found. Please save basic info first.",
        variant: "destructive",
      });
      return false;
    }

    if (accommodations.length === 0) {
      console.log("No accommodations to save");
      return true;
    }

    try {
      console.log(`Saving ${accommodations.length} accommodations for stay: ${stayId}`);

      const accommodationsToSave = accommodations.map((acc, index) => {
        let featuresJson;

        if (typeof acc.features === 'string') {
          try {
            JSON.parse(acc.features);
            featuresJson = acc.features;
          } catch {
            const featuresArray = acc.features.split("\n").filter(f => f.trim());
            featuresJson = stringifyFeatures(featuresArray);
          }
        } else {
          featuresJson = stringifyFeatures(acc.features);
        }

        return {
          stay_id: stayId,
          name: acc.name,
          image_url: acc.image_url || null,
          capacity: acc.capacity || "",
          features: featuresJson,
          sort_order: acc.sort_order !== undefined ? acc.sort_order : index
        };
      });

      const { error: deleteError } = await supabase
        .from("accommodation_options")
        .delete()
        .eq("stay_id", stayId);

      if (deleteError && deleteError.code !== 'PGRST116') {
        console.error("Error deleting accommodations:", deleteError);
        throw deleteError;
      }

      const { error: insertError } = await supabase
        .from("accommodation_options")
        .insert(accommodationsToSave);

      if (insertError) {
        console.error("Error inserting accommodations:", insertError);
        throw insertError;
      }

      console.log("Successfully saved accommodations");
      return true;

    } catch (error: any) {
      console.error("Error saving accommodations to database:", error);
      toast({
        title: "Error",
        description: `Failed to save accommodations: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleAIContentGenerated = async (content: Record<string, any>) => {
    console.log("AI Generated Content:", content);
    setAiLoading(true);

    try {
      if (content.basic) {
        setFormData(prev => ({
          basic: {
            ...prev.basic,
            badge: content.basic.badge || prev.basic.badge,
            duration: content.basic.duration || prev.basic.duration,
            overview: content.basic.overview || prev.basic.overview,
            description: content.basic.description || prev.basic.description,
          },
          details: {
            ...prev.details,
            location: content.details?.location || prev.details.location,
            address: content.details?.address || prev.details.address,
            connectivity_airport: content.details?.connectivity_airport || prev.details.connectivity_airport,
            connectivity_railway: content.details?.connectivity_railway || prev.details.connectivity_railway,
            connectivity_city: content.details?.connectivity_city || prev.details.connectivity_city,
          },
          restaurant: {
            restaurant_description: content.restaurant?.restaurant_description || prev.restaurant.restaurant_description,
          }
        }));

        if (content.basic.categories && Array.isArray(content.basic.categories)) {
          setSelectedCategories(content.basic.categories);
        }

        if (content.accommodations && Array.isArray(content.accommodations)) {
          const formattedAccommodations = content.accommodations.map((acc: any, index: number) => {
            const features = Array.isArray(acc.features) ? acc.features :
              (typeof acc.features === 'string' ? [acc.features] : []);

            return {
              name: acc.name || `Accommodation ${index + 1}`,
              image_url: acc.image_url || "",
              capacity: acc.capacity || "2 Adults",
              features: stringifyFeatures(features),
              sort_order: index
            }
          });

          setAccommodations(formattedAccommodations);

          toast({
            title: "Accommodations Generated",
            description: `${content.accommodations.length} accommodation options added`,
          });
        }

        // Handle AI-generated location data if available
        if (content.details?.map_url) {
          setLocationData(prev => ({
            ...prev,
            map_url: content.details.map_url
          }));
        }
        
        if (content.details?.latitude && content.details?.longitude) {
          setLocationData(prev => ({
            ...prev,
            latitude: content.details.latitude,
            longitude: content.details.longitude,
            zoom: content.details.zoom || 13
          }));
        }

        toast({
          title: "AI Content Loaded",
          description: "All fields have been populated with AI-generated content",
        });
      } else {
        console.warn("Unexpected AI content structure:", content);
      }
    } catch (error) {
      console.error("Error processing AI content:", error);
      toast({
        title: "Error",
        description: "Failed to process AI-generated content",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stay? This will also delete all associated images and accommodation options.")) return

    try {
      const { error } = await supabase
        .from("experiential_stays")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Stay deleted successfully",
      })
      fetchStays()
      if (editingStay === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Error deleting stay:", error)
      toast({
        title: "Error",
        description: "Failed to delete stay",
        variant: "destructive",
      })
    }
  }

  const badgeColors: Record<string, string> = {
    Popular: "bg-blue-100 text-blue-800",
    Featured: "bg-purple-100 text-purple-800",
    New: "bg-green-100 text-green-800",
    Luxury: "bg-amber-100 text-amber-800",
    Premium: "bg-pink-100 text-pink-800",
  }

  const calculateCompletion = () => {
    let totalFields = 0;
    let completedFields = 0;

    const basicFields = Object.values(formData.basic);
    totalFields += basicFields.length;
    completedFields += basicFields.filter(field => field && field.toString().trim() !== "").length;

    const detailsFields = Object.values(formData.details);
    totalFields += detailsFields.length;
    completedFields += detailsFields.filter(field => field && field.toString().trim() !== "").length;

    if (formData.restaurant.restaurant_description.trim() !== "") completedFields++;
    totalFields++;

    if (selectedCategories.length > 0) completedFields++;
    totalFields++;

    if (accommodations.length > 0) completedFields++;
    totalFields++;

    // Add map_url to completion calculation
    if (locationData.map_url) completedFields++;
    totalFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Experiential Stays</h2>
          <p className="text-muted-foreground">Manage your experiential stays and packages</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Stay
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingStay) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {editingStay ? `Edit Stay: ${formData.basic.name}` : "Create New Stay"}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-32 bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {completionPercentage}% complete
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AIButton
                  title={formData.basic.name}
                  contentType="experientialStay"
                  onContentGenerated={handleAIContentGenerated}
                  disabled={!formData.basic.name.trim() || aiLoading}
                />
                {aiLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="accommodation" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Accommodation
                </TabsTrigger>
                <TabsTrigger value="restaurant" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Restaurant
                </TabsTrigger>
              </TabsList>

              {/* BASIC TAB */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.basic.name}
                      onChange={(e) => handleInputChange(e, 'basic')}
                      placeholder="Jahaanuma Boutique"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge</Label>
                    <select
                      id="badge"
                      name="badge"
                      value={formData.basic.badge}
                      onChange={(e) => handleInputChange(e, 'basic')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Popular">Popular</option>
                      <option value="Featured">Featured</option>
                      <option value="New">New</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <Button
                        key={category}
                        type="button"
                        variant={selectedCategories.includes(category) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategoryToggle(category)}
                        className={cn(
                          "transition-all",
                          selectedCategories.includes(category) && "bg-primary text-primary-foreground"
                        )}
                      >
                        {selectedCategories.includes(category) && (
                          <Star className="mr-2 h-3 w-3" />
                        )}
                        {category}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {selectedCategories.join(", ") || "None"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.basic.duration}
                    onChange={(e) => handleInputChange(e, 'basic')}
                    placeholder="3 Days, 2 Nights"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    name="overview"
                    value={formData.basic.overview}
                    onChange={(e) => handleInputChange(e, 'basic')}
                    placeholder="Nestled in the serene landscapes of Srinagar..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.basic.description}
                    onChange={(e) => handleInputChange(e, 'basic')}
                    placeholder="Detailed description of the stay..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              {/* DETAILS TAB */}
              <TabsContent value="details" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.details.location}
                    onChange={(e) => handleInputChange(e, 'details')}
                    placeholder="Srinagar, Jammu Kashmir"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.details.address}
                    onChange={(e) => handleInputChange(e, 'details')}
                    placeholder="Full property address with landmark"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="connectivity_airport">Nearest Airport</Label>
                    <Input
                      id="connectivity_airport"
                      name="connectivity_airport"
                      value={formData.details.connectivity_airport}
                      onChange={(e) => handleInputChange(e, 'details')}
                      placeholder="Sheikh ul-Alam International Airport, Srinagar"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="connectivity_railway">Nearest Railhead</Label>
                    <Input
                      id="connectivity_railway"
                      name="connectivity_railway"
                      value={formData.details.connectivity_railway}
                      onChange={(e) => handleInputChange(e, 'details')}
                      placeholder="Jammu Tawi Railway Station"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="connectivity_city">Nearest City</Label>
                    <Input
                      id="connectivity_city"
                      name="connectivity_city"
                      value={formData.details.connectivity_city}
                      onChange={(e) => handleInputChange(e, 'details')}
                      placeholder="Srinagar City Center"
                    />
                  </div>
                </div>

                {/* Location Map Picker - NOW WITH map_url SUPPORT */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Location on Map</h4>
                      <p className="text-sm text-muted-foreground">
                        Set the exact location of your property on the map
                      </p>
                    </div>
                    {locationData.map_url && (
                      <Badge variant="outline" className="bg-green-50">
                        <Check className="h-3 w-3 mr-1 text-green-600" />
                        Map URL Set
                      </Badge>
                    )}
                  </div>
                  
                  <MapPicker
                    mapUrl={locationData.map_url}
                    latitude={locationData.latitude}
                    longitude={locationData.longitude}
                    zoom={locationData.zoom}
                    address={formData.details.address}
                    onMapUrlChange={(url) => {
                      console.log("Map URL updated:", url);
                      setLocationData(prev => ({
                        ...prev,
                        map_url: url
                      }));
                    }}
                    onLocationSelect={(lat, lng, zoom) => {
                      setLocationData(prev => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                        zoom: zoom
                      }));
                      
                      toast({
                        title: "Location Updated",
                        description: "Property location has been set on the map.",
                        duration: 2000,
                      });
                    }}
                  />
                </div>

                {/* Stay Images Manager Section */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Images Gallery</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage property images (main image, room views, etc.)
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentStay = stays.find(s => s.id === editingStay);
                        if (currentStay) {
                          handleManageImages(currentStay);
                        }
                      }}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Open Images Manager
                    </Button>
                  </div>

                  {editingStay && selectedStay && (
                    <div className="border rounded-lg p-4">
                      <StayImagesManager
                        stayId={editingStay}
                        stayName={selectedStay.name}
                        onUpdate={fetchStays}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ACCOMMODATION TAB */}
              <TabsContent value="accommodation" className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Accommodation Options</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage room categories (Deluxe, Luxury, Suite, Family Cottage).
                    These will be saved together with the stay.
                  </p>
                </div>

                {/* Accommodation Form */}
                {(isCreatingAccommodation || editingAccommodation !== null) && (
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-4">
                        {editingAccommodation !== null ? "Edit Accommodation" : "Add New Accommodation"}
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="acc-name">Name *</Label>
                          <Input
                            id="acc-name"
                            name="name"
                            value={accommodationFormData.name}
                            onChange={handleAccommodationInputChange}
                            placeholder="Deluxe Room"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Accommodation Image</Label>
                          <ImageUploader
                            label="Upload accommodation image"
                            value={accommodationFormData.image_url}
                            onChange={(url) => {
                              setAccommodationFormData(prev => ({
                                ...prev,
                                image_url: url
                              }))
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="acc-capacity">Capacity</Label>
                          <Input
                            id="acc-capacity"
                            name="capacity"
                            value={accommodationFormData.capacity}
                            onChange={handleAccommodationInputChange}
                            placeholder="2 Adults + 1 Child"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="acc-features">Features (one per line)</Label>
                          <Textarea
                            id="acc-features"
                            name="features"
                            value={accommodationFormData.features}
                            onChange={handleAccommodationInputChange}
                            placeholder="Queen/King bed\nEnsuite bathroom\nMountain views\nTraditional decor\nModern amenities"
                            rows={5}
                          />
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <Button variant="outline" onClick={resetAccommodationForm}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                          <Button onClick={handleSaveAccommodation}>
                            <Save className="mr-2 h-4 w-4" />
                            {editingAccommodation !== null ? "Update" : "Add"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Accommodations List */}
                <div className="border rounded-lg">
                  <div className="flex justify-between items-center p-4 border-b">
                    <div>
                      <h5 className="font-medium">Accommodations ({accommodations.length})</h5>
                      <p className="text-sm text-muted-foreground">
                        Drag to reorder • Click edit to modify
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsCreatingAccommodation(true)}
                      size="sm"
                      disabled={isCreatingAccommodation || editingAccommodation !== null}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Accommodation
                    </Button>
                  </div>

                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="accommodations">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="divide-y"
                        >
                          {accommodations.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No accommodation options added yet</p>
                              <p className="text-sm mt-2">Click "Add Accommodation" or use AI to generate options</p>
                            </div>
                          ) : (
                            accommodations.map((acc, index) => {
                              const features = parseJSON(acc.features, []);
                              return (
                                <Draggable key={index} draggableId={index.toString()} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="p-4 hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                          <div {...provided.dragHandleProps} className="pt-1">
                                            <div className="h-4 w-4 text-muted-foreground cursor-move">⋮⋮</div>
                                          </div>

                                          {acc.image_url && (
                                            <div className="flex-shrink-0">
                                              <div className="h-16 w-24 rounded-md overflow-hidden border">
                                                <img
                                                  src={acc.image_url}
                                                  alt={acc.name}
                                                  className="w-full h-full object-cover"
                                                />
                                              </div>
                                            </div>
                                          )}

                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                              <h6 className="font-medium">{acc.name}</h6>
                                              <span className="text-xs text-muted-foreground">#{index + 1}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                                              <Users className="h-3 w-3 mr-1" />
                                              {acc.capacity || "Capacity not set"}
                                            </div>
                                            {features.length > 0 && (
                                              <div className="text-sm text-muted-foreground">
                                                <div className="flex flex-wrap gap-1">
                                                  {features.slice(0, 3).map((feature: string, idx: number) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                      {String(feature)}
                                                    </Badge>
                                                  ))}
                                                  {features.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                      +{features.length - 3} more
                                                    </Badge>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditAccommodation(index)}
                                          >
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteAccommodation(index)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              )
                            })
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </TabsContent>

              {/* RESTAURANT TAB */}
              <TabsContent value="restaurant" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurant_description">Restaurant Description</Label>
                  <Textarea
                    id="restaurant_description"
                    name="restaurant_description"
                    value={formData.restaurant.restaurant_description}
                    onChange={(e) => handleInputChange(e, 'restaurant')}
                    placeholder="Describe the dining experience, cuisine, ambiance..."
                    rows={8}
                  />
                </div>

                {/* Restaurant Images Manager Section */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Restaurant Images Gallery</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage restaurant images (dining area, food, ambiance, etc.)
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentStay = stays.find(s => s.id === editingStay);
                        if (currentStay) {
                          setSelectedStay(currentStay);
                        }
                      }}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Manage Restaurant Images
                    </Button>
                  </div>

                  {editingStay && selectedStay && (
                    <div className="border rounded-lg p-4">
                      <RestaurantImagesManager
                        stayId={editingStay}
                        stayName={selectedStay.name}
                        onUpdate={fetchStays}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Single Save Button */}
            <div className="flex justify-between items-center pt-6 border-t mt-8">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleCancelEdit} disabled={saving || aiLoading}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving || aiLoading}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Stay
                    </>
                  )}
                </Button>
              </div>
              
              {/* Map URL Status Indicator */}
              {locationData.map_url && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span>Map URL saved</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stays List - Only show when not editing/creating */}
      {!(isCreating || editingStay) && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Map</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stays.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No experiential stays found. Create your first one!
                    </TableCell>
                  </TableRow>
                ) : (
                  stays.map((stay) => {
                    const categories = parseJSON(stay.categories, []);
                    
                    return (
                      <TableRow key={stay.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">{stay.name}</div>
                          {categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {categories.slice(0, 2).map((cat: string) => (
                                <Badge key={cat} variant="outline" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                              {categories.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{categories.length - 2} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {stay.location || "Not set"}
                          </div>
                        </TableCell>
                        <TableCell>{stay.duration || "-"}</TableCell>
                        <TableCell>
                          <Badge className={badgeColors[stay.badge] || "bg-gray-100 text-gray-800"}>
                            {stay.badge}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {stay.map_url ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Check className="h-3 w-3 mr-1" />
                              Map Set
                            </Badge>
                          ) : stay.latitude && stay.longitude ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <MapPin className="h-3 w-3 mr-1" />
                              Coordinates
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-500">
                              No map
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <Link href={`/experiential-stays/${stay.slug || stay.id}`} target="_blank">
                              <Button
                                size="sm"
                                variant="ghost"
                                title="View Live"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(stay)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(stay.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Images Management Dialog */}
      <Dialog open={imagesDialogOpen} onOpenChange={setImagesDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Stay Images</DialogTitle>
            <DialogDescription>
              Upload and manage images for {selectedStay?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedStay && (
            <StayImagesManager
              stayId={selectedStay.id}
              stayName={selectedStay.name}
              onUpdate={fetchStays}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}