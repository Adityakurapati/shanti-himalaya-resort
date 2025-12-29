"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Plus, Trash2, Edit, Sparkles, Loader2, MapPin, Mountain, Clock, Calendar, Users, Home, Route, HelpCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploader from "@/components/admin/ImageUploader";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import CategoriesManager from "@/components/admin/CategoriesManager";
import { useDestinationAI } from "@/hooks/useDestinationAI";

const AdminDestinationNew = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [categories, setCategories] = useState<string[]>([]);

  const { loading: aiLoading, generateAllDestinationContent } = useDestinationAI();

  const [openDialogs, setOpenDialogs] = useState({
    place: false,
    activity: false,
    itinerary: false,
    faq: false,
  });

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
    overview_image_url: "",
    places_image_url: "",
    activities_image_url: "",
    itinerary_image_url: "",
    places_to_visit: {} as { [key: string]: any },
    things_to_do: {} as { [key: string]: any },
    how_to_reach: {
      air: { title: "By Air", details: [] as string[] },
      train: { title: "By Train", details: [] as string[] },
      road: { title: "By Road", details: [] as string[] },
    },
    best_time_details: {
      winter: {
        season: "",
        weather: "",
        why_visit: "",
        events: "",
        challenges: "",
      },
      summer: {
        season: "",
        weather: "",
        why_visit: "",
        events: "",
        challenges: "",
      },
      monsoon: {
        season: "",
        weather: "",
        why_visit: "",
        events: "",
        challenges: "",
      },
    },
    where_to_stay: {
      budget: { category: "budget", description: "", options: [] as string[] },
      midrange: {
        category: "midrange",
        description: "",
        options: [] as string[],
      },
      luxury: { category: "luxury", description: "", options: [] as string[] },
    },
    itinerary: {} as { [key: string]: any },
    travel_tips: [] as string[],
    faqs: {} as { [key: string]: any },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .order("name", { ascending: true });

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setCategories(data.map((item: any) => item.name));
      } else {
        setCategories([
          "Trekking",
          "Wildlife",
          "Culture",
          "Adventure",
          "Pilgrimage",
          "Nature",
        ]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([
        "Trekking",
        "Wildlife",
        "Culture",
        "Adventure",
        "Pilgrimage",
        "Nature",
      ]);
    }
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  useEffect(() => {
    if (formData.name && !formData.slug) {
      const generatedSlug = generateSlug(formData.name);
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name]);

  const checkSlugExists = async (slug: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("destinations")
        .select("id")
        .eq("slug", slug);

      if (error) {
        console.error("Error checking slug:", error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error("Exception checking slug:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (
        !formData.name ||
        !formData.description ||
        !formData.duration ||
        !formData.difficulty ||
        !formData.best_time ||
        !formData.category
      ) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields marked with *",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      let finalSlug = formData.slug;
      if (!finalSlug) {
        finalSlug = generateSlug(formData.name);
      }

      const slugExists = await checkSlugExists(finalSlug);
      if (slugExists) {
        toast({
          title: "Slug already exists",
          description: "Please choose a different slug",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const destinationData = {
        name: formData.name,
        description: formData.description,
        highlights: formData.highlights
          .split(",")
          .map((h: any) => h.trim())
          .filter(Boolean),
        duration: formData.duration,
        difficulty: formData.difficulty,
        best_time: formData.best_time,
        altitude: formData.altitude || null,
        featured: formData.featured,
        category: formData.category,
        image_url: formData.image_url || null,
        slug: finalSlug || null,
        overview: formData.overview || "",
        overview_image_url: formData.overview_image_url || null,
        places_image_url: formData.places_image_url || null,
        activities_image_url: formData.activities_image_url || null,
        itinerary_image_url: formData.itinerary_image_url || null,
        places_to_visit: formData.places_to_visit,
        things_to_do: formData.things_to_do,
        how_to_reach: formData.how_to_reach,
        best_time_details: formData.best_time_details,
        where_to_stay: formData.where_to_stay,
        itinerary: formData.itinerary,
        travel_tips: formData.travel_tips,
        faqs: formData.faqs,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("💾 Creating new destination:", {
        ...destinationData,
        places_to_visit_count: Object.keys(destinationData.places_to_visit)
          .length,
        things_to_do_count: Object.keys(destinationData.things_to_do).length,
        itinerary_count: Object.keys(destinationData.itinerary).length,
        faqs_count: Object.keys(destinationData.faqs).length,
      });

      const { data, error } = await supabase
        .from("destinations")
        .insert(destinationData)
        .select();

      if (error) {
        console.error("❌ Supabase insert error:", error);
        if (error.code === "23505") {
          toast({
            title: "Slug already exists",
            description: "Please choose a different slug for this destination",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        console.log("✅ Creation successful, returned data:", data);
        toast({
          title: "Destination created successfully",
          description: "New destination has been added to the database.",
        });

        if (data && data[0]) {
          setTimeout(() => {
            router.push("/admin/destination/edit/" + data[0].id);
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error("❌ Error creating destination:", error);
      toast({
        title: "Error creating destination",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAllContent = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const allContent = await generateAllDestinationContent(formData.name);

    if (!allContent) {
      return;
    }

    // Update all form fields at once
    setFormData(prev => {
      const newFormData = { ...prev };

      // Basic Info
      if (allContent.basic) {
        newFormData.description = allContent.basic.description || prev.description;
        newFormData.duration = allContent.basic.duration || prev.duration;
        newFormData.difficulty = allContent.basic.difficulty || prev.difficulty;
        newFormData.best_time = allContent.basic.best_time || prev.best_time;
        newFormData.altitude = allContent.basic.altitude || prev.altitude;
        newFormData.category = allContent.basic.category || prev.category;
        newFormData.highlights = allContent.basic.highlights || prev.highlights;
      }

      // Overview
      if (allContent.overview) {
        newFormData.overview = allContent.overview;
      }

      // Places to Visit
      if (allContent.places && Array.isArray(allContent.places)) {
        const placesObj: { [key: string]: any } = {};
        allContent.places.forEach((place: any) => {
          const id = generateId();
          placesObj[id] = {
            id,
            name: place.name,
            description: place.description,
            highlights: place.highlights || [],
            image_url: "",
          };
        });
        newFormData.places_to_visit = placesObj;
      }

      // Activities
      if (allContent.activities && Array.isArray(allContent.activities)) {
        const activitiesObj: { [key: string]: any } = {};
        allContent.activities.forEach((activity: any) => {
          const id = generateId();
          activitiesObj[id] = {
            id,
            title: activity.title,
            description: activity.description,
            image_url: "",
          };
        });
        newFormData.things_to_do = activitiesObj;
      }

      // How to Reach
      if (allContent.howToReach) {
        newFormData.how_to_reach = {
          air: {
            title: "By Air",
            details: allContent.howToReach.air || []
          },
          train: {
            title: "By Train",
            details: allContent.howToReach.train || []
          },
          road: {
            title: "By Road",
            details: allContent.howToReach.road || []
          },
        };
      }

      // Best Time Details
      if (allContent.bestTime) {
        newFormData.best_time_details = {
          winter: allContent.bestTime.winter || prev.best_time_details.winter,
          summer: allContent.bestTime.summer || prev.best_time_details.summer,
          monsoon: allContent.bestTime.monsoon || prev.best_time_details.monsoon,
        };
      }

      // Where to Stay
      if (allContent.accommodation) {
        newFormData.where_to_stay = {
          budget: {
            category: "budget",
            description: allContent.accommodation.budget?.description || "",
            options: allContent.accommodation.budget?.options || [],
          },
          midrange: {
            category: "midrange",
            description: allContent.accommodation.midrange?.description || "",
            options: allContent.accommodation.midrange?.options || [],
          },
          luxury: {
            category: "luxury",
            description: allContent.accommodation.luxury?.description || "",
            options: allContent.accommodation.luxury?.options || [],
          },
        };
      }

      // Itinerary
      if (allContent.itinerary && Array.isArray(allContent.itinerary)) {
        const itineraryObj: { [key: string]: any } = {};
        allContent.itinerary.forEach((day: any) => {
          const id = generateId();
          itineraryObj[id] = {
            id,
            day: day.day,
            title: day.title,
            activities: day.activities || [],
            image_url: "",
          };
        });
        newFormData.itinerary = itineraryObj;
      }

      // Travel Tips
      if (allContent.travelTips && Array.isArray(allContent.travelTips)) {
        newFormData.travel_tips = allContent.travelTips;
      }

      // FAQs
      if (allContent.faqs && Array.isArray(allContent.faqs)) {
        const faqsObj: { [key: string]: any } = {};
        allContent.faqs.forEach((faq: any) => {
          const id = generateId();
          faqsObj[id] = {
            id,
            question: faq.question,
            answer: faq.answer,
          };
        });
        newFormData.faqs = faqsObj;
      }

      return newFormData;
    });
  };

  const handleAddPlace = (place: any) => {
    const id = generateId();
    const updated = {
      ...formData.places_to_visit,
      [id]: {
        id,
        ...place,
      },
    };
    setFormData({ ...formData, places_to_visit: updated });
    setOpenDialogs({ ...openDialogs, place: false });
  };

  const handleUpdatePlace = (key: string, updatedPlace: any) => {
    const updated = {
      ...formData.places_to_visit,
      [key]: {
        ...formData.places_to_visit[key],
        ...updatedPlace,
      },
    };
    setFormData({ ...formData, places_to_visit: updated });
    setOpenDialogs({ ...openDialogs, place: false });
  };

  const handleDeletePlace = (key: string) => {
    const updated = { ...formData.places_to_visit };
    delete updated[key];
    setFormData({ ...formData, places_to_visit: updated });
  };

  const handleAddActivity = (activity: any) => {
    const id = generateId();
    const updated = {
      ...formData.things_to_do,
      [id]: {
        id,
        ...activity,
      },
    };
    setFormData({ ...formData, things_to_do: updated });
    setOpenDialogs({ ...openDialogs, activity: false });
  };

  const handleUpdateActivity = (key: string, updatedActivity: any) => {
    const updated = {
      ...formData.things_to_do,
      [key]: {
        ...formData.things_to_do[key],
        ...updatedActivity,
      },
    };
    setFormData({ ...formData, things_to_do: updated });
    setOpenDialogs({ ...openDialogs, activity: false });
  };

  const handleDeleteActivity = (key: string) => {
    const updated = { ...formData.things_to_do };
    delete updated[key];
    setFormData({ ...formData, things_to_do: updated });
  };

  const handleAddDay = (day: any) => {
    const id = generateId();
    const updated = {
      ...formData.itinerary,
      [id]: {
        id,
        ...day,
      },
    };
    setFormData({ ...formData, itinerary: updated });
    setOpenDialogs({ ...openDialogs, itinerary: false });
  };

  const handleUpdateDay = (key: string, updatedDay: any) => {
    const updated = {
      ...formData.itinerary,
      [key]: {
        ...formData.itinerary[key],
        ...updatedDay,
      },
    };
    setFormData({ ...formData, itinerary: updated });
    setOpenDialogs({ ...openDialogs, itinerary: false });
  };

  const handleDeleteDay = (key: string) => {
    const updated = { ...formData.itinerary };
    delete updated[key];
    setFormData({ ...formData, itinerary: updated });
  };

  const handleAddFAQ = (faq: any) => {
    const id = generateId();
    const updated = {
      ...formData.faqs,
      [id]: {
        id,
        ...faq,
      },
    };
    setFormData({ ...formData, faqs: updated });
    setOpenDialogs({ ...openDialogs, faq: false });
  };

  const handleUpdateFAQ = (key: string, updatedFAQ: any) => {
    const updated = {
      ...formData.faqs,
      [key]: {
        ...formData.faqs[key],
        ...updatedFAQ,
      },
    };
    setFormData({ ...formData, faqs: updated });
    setOpenDialogs({ ...openDialogs, faq: false });
  };

  const handleDeleteFAQ = (key: string) => {
    const updated = { ...formData.faqs };
    delete updated[key];
    setFormData({ ...formData, faqs: updated });
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Mountain },
    { id: "overview", label: "Overview", icon: MapPin },
    { id: "places", label: "Places to Visit", icon: MapPin },
    { id: "activities", label: "Things to Do", icon: Route },
    { id: "reach", label: "How to Reach", icon: Route },
    { id: "besttime", label: "Best Time", icon: Calendar },
    { id: "stay", label: "Where to Stay", icon: Home },
    { id: "itinerary", label: "Itinerary", icon: Clock },
    { id: "tips", label: "Travel Tips", icon: Users },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
  ];

  const AIGenerateButton = ({
    onClick,
    loading,
    icon = Sparkles,
    label = "Generate with AI",
    size = "sm",
    variant = "outline"
  }: {
    onClick: () => void;
    loading: boolean;
    icon?: any;
    label?: string;
    size?: "sm" | "default";
    variant?: "default" | "outline";
  }) => {
    const Icon = icon;

    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={loading || !formData.name.trim()}
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
        {label}
      </Button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold">Create New Destination</h1>
        </div>
        <div className="flex gap-2">
          <AIGenerateButton
            onClick={handleGenerateAllContent}
            loading={aiLoading}
            label="✨ Generate All Content"
            size="default"
            variant="default"
          />
          <Button onClick={handleSubmit} disabled={saving || aiLoading}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Creating..." : "Create Destination"}
          </Button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-purple-900">
              ✨ AI Content Generator
            </h3>
            <p className="text-sm text-purple-700">
              Generate all destination content at once with AI. Enter a destination name above first.
            </p>
          </div>
          <AIGenerateButton
            onClick={handleGenerateAllContent}
            loading={aiLoading}
            label="Generate Everything"
            size="default"
          />
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2 text-blue-900">
          Data Status (Object Format - Manual Save):
        </h3>
        <div className="text-sm text-blue-800 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            Places to Visit:{" "}
            <strong>{Object.keys(formData.places_to_visit).length}</strong>
          </div>
          <div>
            Things to Do:{" "}
            <strong>{Object.keys(formData.things_to_do).length}</strong>
          </div>
          <div>
            Itinerary Days:{" "}
            <strong>{Object.keys(formData.itinerary).length}</strong>
          </div>
          <div>
            FAQs: <strong>{Object.keys(formData.faqs).length}</strong>
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Data stored as objects. Use Create Destination to save your new destination.
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1 border-b mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="name">Name *</Label>
                    <span className="text-xs text-muted-foreground">AI will use this</span>
                  </div>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL-friendly name)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
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
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="highlights">Highlights (comma-separated)</Label>
                <Textarea
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) =>
                    setFormData({ ...formData, highlights: e.target.value })
                  }
                  placeholder="Sunrise views, Ancient temples, Local culture"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Input
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, best_time: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="altitude">Altitude</Label>
                  <Input
                    id="altitude"
                    value={formData.altitude}
                    onChange={(e) =>
                      setFormData({ ...formData, altitude: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category: string) => (
  <option key={category} value={category}>
    {category}
  </option>
))}
                </select>
              </div>

              <CategoriesManager />
              <div>
                <Label htmlFor="image_url">Main Image</Label>
                <ImageUploader
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked as boolean })
                  }
                />
                <Label htmlFor="featured">Featured Destination</Label>
              </div>
            </form>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detailed Overview</h3>

            <form onSubmit={handleSubmit}>
              <Label htmlFor="overview">Detailed Overview</Label>
              <Textarea
                id="overview"
                value={formData.overview}
                onChange={(e) =>
                  setFormData({ ...formData, overview: e.target.value })
                }
                rows={8}
                placeholder="Provide a comprehensive overview of the destination..."
              />
            </form>
            <div>
              <Label htmlFor="overview_image_url">Overview Section Image</Label>
              <ImageUploader
                value={formData.overview_image_url}
                onChange={(url) =>
                  setFormData({ ...formData, overview_image_url: url })
                }
              />
            </div>
          </div>
        )}

        {/* Places to Visit Tab */}
        {activeTab === "places" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  Places to Visit ({Object.keys(formData.places_to_visit).length})
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add famous attractions and landmarks
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={openDialogs.place}
                  onOpenChange={(open) => setOpenDialogs({ ...openDialogs, place: open })}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Manually
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
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
            </div>

            <div>
              <Label htmlFor="places_image_url">Places Section Image</Label>
              <ImageUploader
                value={formData.places_image_url}
                onChange={(url) =>
                  setFormData({ ...formData, places_image_url: url })
                }
              />
            </div>

            <div className="space-y-3">
              {Object.entries(formData.places_to_visit).map(([key, place]) => (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg">
                            {place.name}
                          </h4>
                          <Dialog
                            open={openDialogs.place && key === place.id}
                            onOpenChange={(open) => setOpenDialogs({ ...openDialogs, place: open })}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Edit Place: {place.name}
                                </DialogTitle>
                              </DialogHeader>
                              <PlaceForm
                                initialData={place}
                                onSubmit={(updatedPlace) =>
                                  handleUpdatePlace(key, updatedPlace)
                                }
                                isEdit={true}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <p className="text-muted-foreground mb-3">
                              {place.description}
                            </p>
                            {place.highlights &&
                              place.highlights.length > 0 && (
                                <div className="mt-2">
                                  <p className="font-medium text-sm mb-1">
                                    Highlights:
                                  </p>
                                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {place.highlights.map(
                                      (h: string, i: number) => (
                                        <li key={i}>{h}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>

                          <div className="md:col-span-1">
                            {place.image_url ? (
                              <div className="h-32 rounded-lg overflow-hidden">
                                <img
                                  src={place.image_url}
                                  alt={place.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-32 rounded-lg bg-muted flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">
                                  No image
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePlace(key)}
                        className="ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {Object.keys(formData.places_to_visit).length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No places added yet. Use "Generate All Content" or add manually.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Things to Do Tab */}
        {activeTab === "activities" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  Things to Do ({Object.keys(formData.things_to_do).length})
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add activities and experiences
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={openDialogs.activity}
                  onOpenChange={(open) => setOpenDialogs({ ...openDialogs, activity: open })}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Manually
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
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
            </div>

            <div>
              <Label htmlFor="activities_image_url">
                Activities Section Image
              </Label>
              <ImageUploader
                value={formData.activities_image_url}
                onChange={(url) =>
                  setFormData({ ...formData, activities_image_url: url })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(formData.things_to_do)
                .sort(([keyA, activityA], [keyB, activityB]) => {
                  const extractNumber = (title: string | undefined): number => {
                    if (!title || typeof title !== "string") return Infinity;
                    const match = title.match(/^(\d+)[\.\)\s]*/);
                    return match ? parseInt(match[1], 10) : Infinity;
                  };

                  const numA = extractNumber(activityA.title);
                  const numB = extractNumber(activityB.title);

                  if (numA !== Infinity && numB !== Infinity) {
                    return numA - numB;
                  }

                  if (numA !== Infinity && numB === Infinity) return -1;
                  if (numA === Infinity && numB !== Infinity) return 1;

                  return keyA.localeCompare(keyB);
                })
                .map(([key, activity]) => (
                  <Card key={key} className="flex flex-col min-h-[200px]">
                    <CardContent className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2 flex-shrink-0">
                        <h4 className="font-semibold text-sm flex-1">
                          {activity.title}
                        </h4>
                        <div className="flex gap-1 ml-2 flex-shrink-0">
                          <Dialog
                            open={openDialogs.activity && key === activity.id}
                            onOpenChange={(open) => setOpenDialogs({ ...openDialogs, activity: open })}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Edit Activity: {activity.title}
                                </DialogTitle>
                              </DialogHeader>
                              <ActivityForm
                                initialData={activity}
                                onSubmit={(updatedActivity) =>
                                  handleUpdateActivity(key, updatedActivity)
                                }
                                isEdit={true}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteActivity(key)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex-grow overflow-hidden">
                        <div className="h-full overflow-y-auto pr-1">
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground leading-relaxed">
                              {activity.description}
                            </div>

                            {activity.image_url && (
                              <div className="h-24 rounded-lg overflow-hidden flex-shrink-0 mt-2">
                                <img
                                  src={activity.image_url}
                                  alt={activity.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {Object.keys(formData.things_to_do).length === 0 && (
                <div className="col-span-2 text-center py-8 border-2 border-dashed rounded-lg">
                  <Route className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No activities added yet. Use "Generate All Content" or add manually.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* How to Reach Tab */}
        {activeTab === "reach" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">How to Reach</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["air", "train", "road"].map((method) => (
                  <div key={method}>
                    <Label htmlFor={`reach-${method}`} className="capitalize">
                      <div className="flex items-center gap-2">
                        {method === "air" && "✈️"}
                        {method === "train" && "🚂"}
                        {method === "road" && "🚗"}
                        By {method}
                      </div>
                    </Label>
                    <Textarea
                      id={`reach-${method}`}
                      value={
                        formData.how_to_reach[
                          method as keyof typeof formData.how_to_reach
                        ]?.details?.join("\n") || ""
                      }
                      onChange={(e) => {
                        const details = e.target.value
                          .split("\n")
                          .filter((d) => d.trim());
                        setFormData({
                          ...formData,
                          how_to_reach: {
                            ...formData.how_to_reach,
                            [method]: {
                              ...formData.how_to_reach[
                              method as keyof typeof formData.how_to_reach
                              ],
                              details,
                            },
                          },
                        });
                      }}
                      placeholder={`Enter ${method} details (one per line)`}
                      rows={4}
                    />
                  </div>
                ))}
              </div>
            </form>
          </div>
        )}

        {/* Best Time Tab */}
        {activeTab === "besttime" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Best Time to Visit</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: "winter", label: "Winter", icon: "❄️" },
                  { key: "summer", label: "Summer", icon: "☀️" },
                  { key: "monsoon", label: "Monsoon", icon: "🌧️" }
                ].map(({ key, label, icon }) => (
                  <div key={key}>
                    <Label className="capitalize font-semibold mb-2 block flex items-center gap-2">
                      <span>{icon}</span> {label}
                    </Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Season dates"
                        value={
                          formData.best_time_details[
                            key as keyof typeof formData.best_time_details
                          ]?.season || ""
                        }
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            best_time_details: {
                              ...formData.best_time_details,
                              [key]: {
                                ...formData.best_time_details[
                                key as keyof typeof formData.best_time_details
                                ],
                                season: e.target.value,
                              },
                            },
                          });
                        }}
                      />
                      <Textarea
                        placeholder="Weather"
                        value={
                          formData.best_time_details[
                            key as keyof typeof formData.best_time_details
                          ]?.weather || ""
                        }
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            best_time_details: {
                              ...formData.best_time_details,
                              [key]: {
                                ...formData.best_time_details[
                                key as keyof typeof formData.best_time_details
                                ],
                                weather: e.target.value,
                              },
                            },
                          });
                        }}
                        rows={2}
                      />
                      <Textarea
                        placeholder="Why visit"
                        value={
                          formData.best_time_details[
                            key as keyof typeof formData.best_time_details
                          ]?.why_visit || ""
                        }
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            best_time_details: {
                              ...formData.best_time_details,
                              [key]: {
                                ...formData.best_time_details[
                                key as keyof typeof formData.best_time_details
                                ],
                                why_visit: e.target.value,
                              },
                            },
                          });
                        }}
                        rows={2}
                      />
                      <Textarea
                        placeholder="Events"
                        value={
                          formData.best_time_details[
                            key as keyof typeof formData.best_time_details
                          ]?.events || ""
                        }
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            best_time_details: {
                              ...formData.best_time_details,
                              [key]: {
                                ...formData.best_time_details[
                                key as keyof typeof formData.best_time_details
                                ],
                                events: e.target.value,
                              },
                            },
                          });
                        }}
                        rows={2}
                      />
                      <Textarea
                        placeholder="Challenges"
                        value={
                          formData.best_time_details[
                            key as keyof typeof formData.best_time_details
                          ]?.challenges || ""
                        }
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            best_time_details: {
                              ...formData.best_time_details,
                              [key]: {
                                ...formData.best_time_details[
                                key as keyof typeof formData.best_time_details
                                ],
                                challenges: e.target.value,
                              },
                            },
                          });
                        }}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
        )}

        {/* Where to Stay Tab */}
        {activeTab === "stay" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Where to Stay</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: "budget", label: "Budget", emoji: "💰" },
                  { key: "midrange", label: "Mid-range", emoji: "🏨" },
                  { key: "luxury", label: "Luxury", emoji: "✨" }
                ].map(({ key, label, emoji }) => (
                  <div key={key}>
                    <Label className="capitalize font-semibold mb-2 block flex items-center gap-2">
                      <span>{emoji}</span> {label}
                    </Label>
                    <Textarea
                      placeholder={`${label} description`}
                      value={
                        formData.where_to_stay[
                          key as keyof typeof formData.where_to_stay
                        ]?.description || ""
                      }
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          where_to_stay: {
                            ...formData.where_to_stay,
                            [key]: {
                              ...formData.where_to_stay[
                              key as keyof typeof formData.where_to_stay
                              ],
                              description: e.target.value,
                            },
                          },
                        });
                      }}
                      rows={3}
                    />
                    <Textarea
                      placeholder="Options (one per line)"
                      value={
                        formData.where_to_stay[
                          key as keyof typeof formData.where_to_stay
                        ]?.options?.join("\n") || ""
                      }
                      onChange={(e) => {
                        const options = e.target.value
                          .split("\n")
                          .filter((o) => o.trim());
                        setFormData({
                          ...formData,
                          where_to_stay: {
                            ...formData.where_to_stay,
                            [key]: {
                              ...formData.where_to_stay[
                              key as keyof typeof formData.where_to_stay
                              ],
                              options,
                            },
                          },
                        });
                      }}
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
            </form>
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === "itinerary" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  Itinerary ({Object.keys(formData.itinerary).length} days)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Plan daily activities and schedule
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={openDialogs.itinerary}
                  onOpenChange={(open) => setOpenDialogs({ ...openDialogs, itinerary: open })}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Day
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
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
            </div>

            <div>
              <Label htmlFor="itinerary_image_url">
                Itinerary Section Image
              </Label>
              <ImageUploader
                value={formData.itinerary_image_url}
                onChange={(url) =>
                  setFormData({ ...formData, itinerary_image_url: url })
                }
              />
            </div>

            <div className="space-y-3">
              {Object.entries(formData.itinerary).map(([key, day]) => (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          Day {day.day}: {day.title}
                        </h4>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Dialog
                          open={openDialogs.itinerary && key === day.id}
                          onOpenChange={(open) => setOpenDialogs({ ...openDialogs, itinerary: open })}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Edit Day {day.day}: {day.title}
                              </DialogTitle>
                            </DialogHeader>
                            <ItineraryForm
                              initialData={day}
                              onSubmit={(updatedDay) =>
                                handleUpdateDay(key, updatedDay)
                              }
                              isEdit={true}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteDay(key)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {day.activities?.map((activity: string, i: number) => (
  <li key={i}>• {activity}</li>
))}
                        </ul>
                      </div>

                      <div className="md:col-span-1">
                        {day.image_url ? (
                          <div className="h-32 rounded-lg overflow-hidden">
                            <img
                              src={day.image_url}
                              alt={`Day ${day.day}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-32 rounded-lg bg-muted flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                              No image
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {Object.keys(formData.itinerary).length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No itinerary days added yet. Use "Generate All Content" or add manually.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Travel Tips Tab */}
        {activeTab === "tips" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Travel Tips</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tips">Travel Tips (one per line)</Label>
                <Textarea
                  id="tips"
                  value={formData.travel_tips.join("\n")}
                  onChange={(e) => {
                    const tips = e.target.value
                      .split("\n")
                      .filter((t) => t.trim());
                    setFormData({ ...formData, travel_tips: tips });
                  }}
                  placeholder="Enter travel tips, one per line"
                  rows={8}
                />
              </div>
            </form>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === "faqs" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  Frequently Asked Questions ({Object.keys(formData.faqs).length})
                </h3>
                <p className="text-sm text-muted-foreground">
                  Common questions visitors ask
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={openDialogs.faq}
                  onOpenChange={(open) => setOpenDialogs({ ...openDialogs, faq: open })}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Manually
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
            </div>

            <div className="space-y-3">
              {Object.entries(formData.faqs).map(([key, faq]) => (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">
                          {faq.question}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Dialog
                          open={openDialogs.faq && key === faq.id}
                          onOpenChange={(open) => setOpenDialogs({ ...openDialogs, faq: open })}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit FAQ</DialogTitle>
                            </DialogHeader>
                            <FAQForm
                              initialData={faq}
                              onSubmit={(updatedFAQ) =>
                                handleUpdateFAQ(key, updatedFAQ)
                              }
                              isEdit={true}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteFAQ(key)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {Object.keys(formData.faqs).length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No FAQs added yet. Use "Generate All Content" or add manually.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components (PlaceForm, ActivityForm, ItineraryForm, FAQForm) remain exactly the same
// [Keep all the sub-component functions as they were in your original code]

function PlaceForm({ onSubmit, initialData, isEdit = false }: { onSubmit: (place: any) => void; initialData?: any; isEdit?: boolean }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    highlights: initialData?.highlights?.join("\n") || "",
    image_url: initialData?.image_url || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const placeData = {
      name: formData.name,
      description: formData.description,
      highlights: formData.highlights
        .split("\n")
        .filter((h: string) => h.trim()),
      image_url: formData.image_url,
    };
    console.log("🎯 Submitting place:", placeData);
    onSubmit(placeData);
    if (!isEdit) {
      setFormData({ name: "", description: "", highlights: "", image_url: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="place-name">Place Name *</Label>
        <Input
          id="place-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="place-desc">Description *</Label>
        <Textarea
          id="place-desc"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="place-image">Image</Label>
        <ImageUploader
          value={formData.image_url}
          onChange={(url) => setFormData({ ...formData, image_url: url })}
        />
      </div>
      <div>
        <Label htmlFor="place-highlights">Highlights (one per line)</Label>
        <Textarea
          id="place-highlights"
          value={formData.highlights}
          onChange={(e) =>
            setFormData({ ...formData, highlights: e.target.value })
          }
          placeholder="Enter highlights, one per line"
          rows={3}
        />
      </div>
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="flex-1">
          {isEdit ? "Update Place" : "Add Place"}
        </Button>
      </div>
    </form>
  );
}

function ActivityForm({ onSubmit, initialData, isEdit = false }: { onSubmit: (activity: any) => void; initialData?: any; isEdit?: boolean }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    image_url: initialData?.image_url || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activityData = {
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
    };
    console.log("🎯 Submitting activity:", activityData);
    onSubmit(activityData);
    if (!isEdit) {
      setFormData({ title: "", description: "", image_url: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="activity-title">Activity Title *</Label>
        <Input
          id="activity-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="activity-desc">Description *</Label>
        <Textarea
          id="activity-desc"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="activity-image">Image</Label>
        <ImageUploader
          value={formData.image_url}
          onChange={(url) => setFormData({ ...formData, image_url: url })}
        />
      </div>
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="flex-1">
          {isEdit ? "Update Activity" : "Add Activity"}
        </Button>
      </div>
    </form>
  );
}

function ItineraryForm({ onSubmit, initialData, isEdit = false }: { onSubmit: (day: any) => void; initialData?: any; isEdit?: boolean }) {
  const [formData, setFormData] = useState({
    day: initialData?.day || 1,
    title: initialData?.title || "",
    activities: initialData?.activities?.join("\n") || "",
    image_url: initialData?.image_url || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dayData = {
      day: formData.day,
      title: formData.title,
      activities: formData.activities
        .split("\n")
        .filter((a: string) => a.trim()),
      image_url: formData.image_url,
    };
    console.log("🎯 Submitting itinerary day:", dayData);
    onSubmit(dayData);
    if (!isEdit) {
      setFormData({
        day: formData.day + 1,
        title: "",
        activities: "",
        image_url: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="day-num">Day Number *</Label>
        <Input
          id="day-num"
          type="number"
          value={formData.day}
          onChange={(e) =>
            setFormData({ ...formData, day: Number.parseInt(e.target.value) })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="day-title">Day Title *</Label>
        <Input
          id="day-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="day-activities">Activities (one per line) *</Label>
        <Textarea
          id="day-activities"
          value={formData.activities}
          onChange={(e) =>
            setFormData({ ...formData, activities: e.target.value })
          }
          placeholder="Enter activities, one per line"
          rows={4}
          required
        />
      </div>
      <div>
        <Label htmlFor="day-image">Image</Label>
        <ImageUploader
          value={formData.image_url}
          onChange={(url) => setFormData({ ...formData, image_url: url })}
        />
      </div>
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="flex-1">
          {isEdit ? "Update Day" : "Add Day"}
        </Button>
      </div>
    </form>
  );
}

function FAQForm({ onSubmit, initialData, isEdit = false }: { onSubmit: (faq: any) => void; initialData?: any; isEdit?: boolean }) {
  const [formData, setFormData] = useState({
    question: initialData?.question || "",
    answer: initialData?.answer || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const faqData = {
      question: formData.question,
      answer: formData.answer,
    };
    console.log("🎯 Submitting FAQ:", faqData);
    onSubmit(faqData);
    if (!isEdit) {
      setFormData({ question: "", answer: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="faq-question">Question</Label>
        <Input
          id="faq-question"
          value={formData.question}
          onChange={(e) =>
            setFormData({ ...formData, question: e.target.value })
          }
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
      <div className="flex gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="flex-1">
          {isEdit ? "Update FAQ" : "Add FAQ"}
        </Button>
      </div>
    </form>
  );
}

export default AdminDestinationNew;