"use client";

import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Plus, Trash2, RefreshCw, Edit, Wand2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploader from "@/components/admin/ImageUploader";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import CategoriesManager from "@/components/admin/CategoriesManager";
import { useDestinationAIDetail } from "@/hooks/useDestinationAiDetail";

type Destination = {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  duration: string;
  difficulty: string;
  best_time: string;
  altitude?: string;
  featured: boolean;
  category: string;
  image_url?: string;
  overview?: string;
  overview_image_url?: string;
  places_image_url?: string;
  activities_image_url?: string;
  itinerary_image_url?: string;
  places_to_visit: { [key: string]: any };
  things_to_do: { [key: string]: any };
  how_to_reach: any;
  best_time_details: any;
  where_to_stay: any;
  itinerary: { [key: string]: any };
  travel_tips: string[];
  faqs: { [key: string]: any };
  slug?: string;
};

const AdminDestinationEdit = () => {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [categories, setCategories] = useState<string[]>([]);
  const [durationForItinerary, setDurationForItinerary] = useState("");

  // AI Hook
  const {
    loading: aiLoading,
    generateBasicInfo,
    generateOverview,
    generatePlaces,
    generateActivities,
    generateItinerary,
    generateFAQs,
    generateTravelInfo,
    generateSeasonInfo,
    generateAccommodation,
    generateTravelTips,
  } = useDestinationAIDetail();

  // Modal state management
  const [placesModalOpen, setPlacesModalOpen] = useState(false);
  const [activitiesModalOpen, setActivitiesModalOpen] = useState(false);
  const [itineraryModalOpen, setItineraryModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingItemKey, setEditingItemKey] = useState<string | null>(null);
  const [editingItemType, setEditingItemType] = useState<string | null>(null);

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
    if (id) {
      fetchDestination();
      fetchCategories();
    }
  }, [id]);

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

  const parseDatabaseJson = (
    data: any,
    fallback: any,
    fieldName: string = ""
  ) => {
    console.log(`🔍 Parsing ${fieldName}:`, { data, type: typeof data });

    if (data === null || data === undefined) {
      return fallback;
    }

    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data)) {
      const obj: { [key: string]: any } = {};
      data.forEach((item, index) => {
        const key = item.id || `item_${index}`;
        obj[key] = item;
      });
      return obj;
    }

    if (typeof data === "string") {
      if (
        data.trim() === "" ||
        data === '""' ||
        data === "''" ||
        data === "null" ||
        data === "undefined"
      ) {
        return fallback;
      }

      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          const obj: { [key: string]: any } = {};
          parsed.forEach((item, index) => {
            const key = item.id || `item_${index}`;
            obj[key] = item;
          });
          return obj;
        }
        return parsed || fallback;
      } catch (e) {
        console.error(`❌ Error parsing ${fieldName}:`, e, "Raw data:", data);
        return fallback;
      }
    }

    return fallback;
  };

  const fetchDestination = async () => {
    try {
      console.log("🔄 Fetching destination with ID:", id);

      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Supabase fetch error:", error);
        throw error;
      }

      if (data) {
        console.log("📦 Raw database data received:", data);

        const places_to_visit = parseDatabaseJson(
          data.places_to_visit,
          {},
          "places_to_visit"
        );
        const things_to_do = parseDatabaseJson(
          data.things_to_do,
          {},
          "things_to_do"
        );
        const how_to_reach = parseDatabaseJson(
          data.how_to_reach,
          {
            air: { title: "By Air", details: [] },
            train: { title: "By Train", details: [] },
            road: { title: "By Road", details: [] },
          },
          "how_to_reach"
        );
        const best_time_details = parseDatabaseJson(
          data.best_time_details,
          {
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
          "best_time_details"
        );
        const where_to_stay = parseDatabaseJson(
          data.where_to_stay,
          {
            budget: { category: "budget", description: "", options: [] },
            midrange: { category: "midrange", description: "", options: [] },
            luxury: { category: "luxury", description: "", options: [] },
          },
          "where_to_stay"
        );
        const itinerary = parseDatabaseJson(data.itinerary, {}, "itinerary");
        const faqs = parseDatabaseJson(data.faqs, {}, "faqs");
        const travel_tips = Array.isArray(data.travel_tips)
          ? data.travel_tips
          : [];
        const highlights = Array.isArray(data.highlights)
          ? data.highlights
          : [];

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
          overview_image_url: data.overview_image_url || "",
          places_image_url: data.places_image_url || "",
          activities_image_url: data.activities_image_url || "",
          itinerary_image_url: data.itinerary_image_url || "",
          places_to_visit: places_to_visit,
          things_to_do: things_to_do,
          how_to_reach: how_to_reach,
          best_time_details: best_time_details,
          where_to_stay: where_to_stay,
          itinerary: itinerary,
          travel_tips: travel_tips,
          faqs: faqs,
        });
      }
    } catch (error: any) {
      console.error("❌ Error fetching destination:", error);
      toast({
        title: "Error fetching destination",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // AI Generation Functions
  const handleGenerateBasicInfo = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Destination name required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const basicInfo = await generateBasicInfo(formData.name);
    if (basicInfo) {
      setFormData(prev => ({
        ...prev,
        description: basicInfo.description || prev.description,
        duration: basicInfo.duration || prev.duration,
        difficulty: basicInfo.difficulty || prev.difficulty,
        best_time: basicInfo.best_time || prev.best_time,
        altitude: basicInfo.altitude || prev.altitude,
        highlights: basicInfo.highlights?.join(", ") || prev.highlights,
      }));
    }
  };

  const handleGenerateOverview = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Destination name required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const overview = await generateOverview(formData.name);
    if (overview) {
      setFormData(prev => ({
        ...prev,
        overview: overview || prev.overview,
      }));
    }
  };

  const handleGeneratePlaces = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Destination name required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const places = await generatePlaces(formData.name, 5);
    if (places) {
      const updatedPlaces = { ...formData.places_to_visit };
      places.forEach((place: any) => {
        const id = generateId();
        updatedPlaces[id] = {
          id,
          name: place.name || place.title,
          description: place.description,
          highlights: place.highlights || [],
          image_url: place.image_url || "",
        };
      });
      setFormData(prev => ({
        ...prev,
        places_to_visit: updatedPlaces,
      }));
    }
  };

  const handleGenerateActivities = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Destination name required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const activities = await generateActivities(formData.name, 5);
    if (activities) {
      const updatedActivities = { ...formData.things_to_do };
      activities.forEach((activity: any, index: number) => {
        const id = generateId();
        updatedActivities[id] = {
          id,
          title: activity.title || `Activity ${index + 1}`,
          description: activity.description,
          image_url: activity.image_url || "",
        };
      });
      setFormData(prev => ({
        ...prev,
        things_to_do: updatedActivities,
      }));
    }
  };

  const handleGenerateItinerary = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Destination name required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const duration = durationForItinerary || formData.duration || "3 days";
    const itinerary = await generateItinerary(formData.name, duration);
    if (itinerary) {
      const updatedItinerary = { ...formData.itinerary };
      itinerary.forEach((day: any, index: number) => {
        const id = generateId();
        updatedItinerary[id] = {
          id,
          day: index + 1,
          title: day.title || `Day ${index + 1}`,
          activities: day.activities || [],
          image_url: day.image_url || "",
        };
      });
      setFormData(prev => ({
        ...prev,
        itinerary: updatedItinerary,
      }));
    }
  };

  const handleGenerateFAQs = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Destination name required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const faqs = await generateFAQs(formData.name, 5);
    if (faqs) {
      const updatedFAQs = { ...formData.faqs };
      faqs.forEach((faq: any) => {
        const id = generateId();
        updatedFAQs[id] = {
          id,
          question: faq.question,
          answer: faq.answer,
        };
      });
      setFormData(prev => ({
        ...prev,
        faqs: updatedFAQs,
      }));
    }
  };

  const handleGenerateTravelInfo = async (type: 'air' | 'train' | 'road') => {
    if (!formData.name.trim()) {
      toast({
        title: "Destination name required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const travelInfo = await generateTravelInfo(formData.name, type);
    if (travelInfo && Array.isArray(travelInfo)) {
      setFormData(prev => ({
        ...prev,
        how_to_reach: {
          ...prev.how_to_reach,
          [type]: {
            ...prev.how_to_reach[type],
            details: travelInfo.map((item: any) => item.detail || item.description || item),
          },
        },
      }));
    }
  };

  const handleGenerateSeasonInfo = async (season: 'winter' | 'summer' | 'monsoon') => {
    if (!formData.name.trim()) {
      toast({
        title: "Destination name required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const seasonInfo = await generateSeasonInfo(formData.name, season);
    if (seasonInfo) {
      setFormData(prev => ({
        ...prev,
        best_time_details: {
          ...prev.best_time_details,
          [season]: {
            season: seasonInfo.season || `${season} season`,
            weather: seasonInfo.weather || seasonInfo.description,
            why_visit: seasonInfo.why_visit || seasonInfo.highlights?.join("\n"),
            events: seasonInfo.events || seasonInfo.festivals?.join("\n"),
            challenges: seasonInfo.challenges || seasonInfo.considerations?.join("\n"),
          },
        },
      }));
    }
  };

  const handleGenerateAccommodation = async (type: 'budget' | 'midrange' | 'luxury') => {
    if (!formData.name.trim()) {
      toast({
        title: "Destination name required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const accommodation = await generateAccommodation(formData.name, type);
    if (accommodation) {
      setFormData(prev => ({
        ...prev,
        where_to_stay: {
          ...prev.where_to_stay,
          [type]: {
            category: type,
            description: accommodation.description || accommodation.overview,
            options: accommodation.options || accommodation.recommendations || [],
          },
        },
      }));
    }
  };

  const handleGenerateTravelTips = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Destination name required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return;
    }

    const tips = await generateTravelTips(formData.name);
    if (tips && Array.isArray(tips)) {
      setFormData(prev => ({
        ...prev,
        travel_tips: tips.map((tip: any) => tip.tip || tip.description || tip),
      }));
    }
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

  const checkSlugExists = async (
    slug: string,
    excludeId: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("destinations")
        .select("id")
        .eq("slug", slug)
        .neq("id", excludeId);

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

      if (id) {
        const slugExists = await checkSlugExists(finalSlug, id);
        if (slugExists) {
          toast({
            title: "Slug already exists",
            description: "Please choose a different slug",
            variant: "destructive",
          });
          setSaving(false);
          return;
        }
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
        updated_at: new Date().toISOString(),
      };

      console.log("💾 Saving data to database:", {
        ...destinationData,
        places_to_visit_count: Object.keys(destinationData.places_to_visit)
          .length,
        things_to_do_count: Object.keys(destinationData.things_to_do).length,
        itinerary_count: Object.keys(destinationData.itinerary).length,
        faqs_count: Object.keys(destinationData.faqs).length,
      });

      const { data, error } = await supabase
        .from("destinations")
        .update(destinationData)
        .eq("id", id)
        .select();

      if (error) {
        console.error("❌ Supabase update error:", error);
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
        console.log("✅ Update successful, returned data:", data);
        toast({
          title: "Destination updated successfully",
          description: "All changes have been saved to the database.",
        });

        setTimeout(() => {
          fetchDestination();
        }, 500);
      }
    } catch (error: any) {
      console.error("❌ Error saving destination:", error);
      toast({
        title: "Error saving destination",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDestination();
    setRefreshing(false);
    toast({
      title: "Data refreshed",
      description: "Latest data loaded from database.",
    });
  };

  // Enhanced handlers with modal management
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
    setPlacesModalOpen(false);
    toast({
      title: "Place added",
      description: "New place has been added successfully.",
    });
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
    setEditingItemKey(null);
    setEditingItemType(null);
    toast({
      title: "Place updated",
      description: "Place has been updated successfully.",
    });
  };

  const handleDeletePlace = (key: string) => {
    const updated = { ...formData.places_to_visit };
    delete updated[key];
    setFormData({ ...formData, places_to_visit: updated });
    toast({
      title: "Place deleted",
      description: "Place has been removed.",
    });
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
    setActivitiesModalOpen(false);
    toast({
      title: "Activity added",
      description: "New activity has been added successfully.",
    });
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
    setEditingItemKey(null);
    setEditingItemType(null);
    toast({
      title: "Activity updated",
      description: "Activity has been updated successfully.",
    });
  };

  const handleDeleteActivity = (key: string) => {
    const updated = { ...formData.things_to_do };
    delete updated[key];
    setFormData({ ...formData, things_to_do: updated });
    toast({
      title: "Activity deleted",
      description: "Activity has been removed.",
    });
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
    setItineraryModalOpen(false);
    toast({
      title: "Itinerary day added",
      description: "New itinerary day has been added successfully.",
    });
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
    setEditingItemKey(null);
    setEditingItemType(null);
    toast({
      title: "Itinerary day updated",
      description: "Itinerary day has been updated successfully.",
    });
  };

  const handleDeleteDay = (key: string) => {
    const updated = { ...formData.itinerary };
    delete updated[key];
    setFormData({ ...formData, itinerary: updated });
    toast({
      title: "Itinerary day deleted",
      description: "Itinerary day has been removed.",
    });
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
    setFaqModalOpen(false);
    toast({
      title: "FAQ added",
      description: "New FAQ has been added successfully.",
    });
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
    setEditingItemKey(null);
    setEditingItemType(null);
    toast({
      title: "FAQ updated",
      description: "FAQ has been updated successfully.",
    });
  };

  const handleDeleteFAQ = (key: string) => {
    const updated = { ...formData.faqs };
    delete updated[key];
    setFormData({ ...formData, faqs: updated });
    toast({
      title: "FAQ deleted",
      description: "FAQ has been removed.",
    });
  };

  // Handler to open edit modal
  const handleEditItem = (key: string, type: string) => {
    setEditingItemKey(key);
    setEditingItemType(type);
  };

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
  ];

  if (loading) {
    return <div className="text-center py-8">Loading destination...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold">
            Edit Destination: {formData.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-1 border-b mb-6">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
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
          <div className="space-y-4">
            <div className="flex justify-end mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateBasicInfo}
                disabled={aiLoading.basic || !formData.name.trim()}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {aiLoading.basic ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
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

              {/* Category Selection */}
              <div>
                <Label className="mb-2 block">Category *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {categories.map((category: any) => (
                    <div
                      key={category}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.category === category
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setFormData({ ...formData, category })}
                    >
                      <span className="text-sm font-medium">{category}</span>
                      {formData.category === category && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  ))}
                </div>
                {!formData.category && (
                  <p className="text-sm text-destructive">
                    Please select a category
                  </p>
                )}
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
            <div className="flex justify-end mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateOverview}
                disabled={aiLoading.overview || !formData.name.trim()}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {aiLoading.overview ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
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
              <h3 className="font-semibold">
                Places to Visit ({Object.keys(formData.places_to_visit).length})
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGeneratePlaces}
                  disabled={aiLoading.places || !formData.name.trim()}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {aiLoading.places ? "Generating..." : "Generate with AI"}
                </Button>
                <Dialog open={placesModalOpen} onOpenChange={setPlacesModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Place
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Place to Visit</DialogTitle>
                      <DialogDescription>
                        Add a new place that visitors should see at this
                        destination.
                      </DialogDescription>
                    </DialogHeader>
                    <PlaceForm
                      onSubmit={handleAddPlace}
                      onClose={() => setPlacesModalOpen(false)}
                    />
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(key, "place")}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
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
                                      (h: any, i: number) => (
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
                <p className="text-sm text-muted-foreground text-center py-4">
                  No places added yet.
                </p>
              )}
            </div>

            {/* Edit Place Dialog */}
            <Dialog
              open={editingItemType === "place" && editingItemKey !== null}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingItemKey(null);
                  setEditingItemType(null);
                }
              }}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    Edit Place:{" "}
                    {editingItemKey &&
                      formData.places_to_visit[editingItemKey]?.name}
                  </DialogTitle>
                </DialogHeader>
                {editingItemKey && (
                  <PlaceForm
                    initialData={formData.places_to_visit[editingItemKey]}
                    onSubmit={(updatedPlace) =>
                      handleUpdatePlace(editingItemKey!, updatedPlace)
                    }
                    isEdit={true}
                    onClose={() => {
                      setEditingItemKey(null);
                      setEditingItemType(null);
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Things to Do Tab */}
        {activeTab === "activities" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">
                Things to Do ({Object.keys(formData.things_to_do).length})
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateActivities}
                  disabled={aiLoading.activities || !formData.name.trim()}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {aiLoading.activities ? "Generating..." : "Generate with AI"}
                </Button>
                <Dialog
                  open={activitiesModalOpen}
                  onOpenChange={setActivitiesModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Activity</DialogTitle>
                      <DialogDescription>
                        Add a new activity that visitors can enjoy at this
                        destination.
                      </DialogDescription>
                    </DialogHeader>
                    <ActivityForm
                      onSubmit={handleAddActivity}
                      onClose={() => setActivitiesModalOpen(false)}
                    />
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
                  <Card key={key} className="flex flex-col">
                    <CardContent className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm flex-1">
                          {activity.title}
                        </h4>
                        <div className="flex gap-1 ml-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(key, "activity")}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
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
                              <div className="h-24 rounded-lg overflow-hidden flex-shrink-0">
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
                <p className="text-sm text-muted-foreground text-center py-4 col-span-2">
                  No activities added yet.
                </p>
              )}
            </div>

            {/* Edit Activity Dialog */}
            <Dialog
              open={editingItemType === "activity" && editingItemKey !== null}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingItemKey(null);
                  setEditingItemType(null);
                }
              }}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    Edit Activity:{" "}
                    {editingItemKey &&
                      formData.things_to_do[editingItemKey]?.title}
                  </DialogTitle>
                </DialogHeader>
                {editingItemKey && (
                  <ActivityForm
                    initialData={formData.things_to_do[editingItemKey]}
                    onSubmit={(updatedActivity) =>
                      handleUpdateActivity(editingItemKey!, updatedActivity)
                    }
                    isEdit={true}
                    onClose={() => {
                      setEditingItemKey(null);
                      setEditingItemType(null);
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* How to Reach Tab */}
        {activeTab === "reach" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["air", "train", "road"].map((method: any) => (
                <div key={method} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`reach-${method}`} className="capitalize">
                      By {method}
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateTravelInfo(method as 'air' | 'train' | 'road')}
                      disabled={aiLoading.reach || !formData.name.trim()}
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      Generate
                    </Button>
                  </div>
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
                        .filter((d: string) => d.trim());
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
                    rows={6}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Time Tab */}
        {activeTab === "besttime" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["winter", "summer", "monsoon"].map((season: any) => (
                <div key={season} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="capitalize font-semibold mb-2 block">
                      {season}
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateSeasonInfo(season as 'winter' | 'summer' | 'monsoon')}
                      disabled={aiLoading.besttime || !formData.name.trim()}
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      Generate
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Season dates"
                      value={
                        formData.best_time_details[
                          season as keyof typeof formData.best_time_details
                        ]?.season || ""
                      }
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          best_time_details: {
                            ...formData.best_time_details,
                            [season]: {
                              ...formData.best_time_details[
                                season as keyof typeof formData.best_time_details
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
                          season as keyof typeof formData.best_time_details
                        ]?.weather || ""
                      }
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          best_time_details: {
                            ...formData.best_time_details,
                            [season]: {
                              ...formData.best_time_details[
                                season as keyof typeof formData.best_time_details
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
                          season as keyof typeof formData.best_time_details
                        ]?.why_visit || ""
                      }
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          best_time_details: {
                            ...formData.best_time_details,
                            [season]: {
                              ...formData.best_time_details[
                                season as keyof typeof formData.best_time_details
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
                          season as keyof typeof formData.best_time_details
                        ]?.events || ""
                      }
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          best_time_details: {
                            ...formData.best_time_details,
                            [season]: {
                              ...formData.best_time_details[
                                season as keyof typeof formData.best_time_details
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
                          season as keyof typeof formData.best_time_details
                        ]?.challenges || ""
                      }
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          best_time_details: {
                            ...formData.best_time_details,
                            [season]: {
                              ...formData.best_time_details[
                                season as keyof typeof formData.best_time_details
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
          </div>
        )}

        {/* Where to Stay Tab */}
        {activeTab === "stay" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["budget", "midrange", "luxury"].map((category: any) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="capitalize font-semibold mb-2 block">
                      {category}
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateAccommodation(category as 'budget' | 'midrange' | 'luxury')}
                      disabled={aiLoading.stay || !formData.name.trim()}
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      Generate
                    </Button>
                  </div>
                  <Textarea
                    placeholder={`${category} description`}
                    value={
                      formData.where_to_stay[
                        category as keyof typeof formData.where_to_stay
                      ]?.description || ""
                    }
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        where_to_stay: {
                          ...formData.where_to_stay,
                          [category]: {
                            ...formData.where_to_stay[
                              category as keyof typeof formData.where_to_stay
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
                        category as keyof typeof formData.where_to_stay
                      ]?.options?.join("\n") || ""
                    }
                    onChange={(e) => {
                      const options = e.target.value
                        .split("\n")
                        .filter((o: string) => o.trim());
                      setFormData({
                        ...formData,
                        where_to_stay: {
                          ...formData.where_to_stay,
                          [category]: {
                            ...formData.where_to_stay[
                              category as keyof typeof formData.where_to_stay
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
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === "itinerary" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  Itinerary ({Object.keys(formData.itinerary).length} days)
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Label htmlFor="duration-input">Duration for Itinerary:</Label>
                  <Input
                    id="duration-input"
                    className="w-32"
                    placeholder="e.g., 3 days"
                    value={durationForItinerary}
                    onChange={(e) => setDurationForItinerary(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateItinerary}
                  disabled={aiLoading.itinerary || !formData.name.trim()}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {aiLoading.itinerary ? "Generating..." : "Generate with AI"}
                </Button>
                <Dialog
                  open={itineraryModalOpen}
                  onOpenChange={setItineraryModalOpen}
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
                        Add a new day to the travel itinerary for this
                        destination.
                      </DialogDescription>
                    </DialogHeader>
                    <ItineraryForm
                      onSubmit={handleAddDay}
                      onClose={() => setItineraryModalOpen(false)}
                    />
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditItem(key, "itinerary")}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
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
                          {day.activities?.map((activity: any, i: number) => (
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
                <p className="text-sm text-muted-foreground text-center py-4">
                  No itinerary days added yet.
                </p>
              )}
            </div>

            {/* Edit Itinerary Dialog */}
            <Dialog
              open={editingItemType === "itinerary" && editingItemKey !== null}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingItemKey(null);
                  setEditingItemType(null);
                }
              }}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    Edit Day{" "}
                    {editingItemKey &&
                      formData.itinerary[editingItemKey]?.day}
                    :{" "}
                    {editingItemKey &&
                      formData.itinerary[editingItemKey]?.title}
                  </DialogTitle>
                </DialogHeader>
                {editingItemKey && (
                  <ItineraryForm
                    initialData={formData.itinerary[editingItemKey]}
                    onSubmit={(updatedDay) =>
                      handleUpdateDay(editingItemKey!, updatedDay)
                    }
                    isEdit={true}
                    onClose={() => {
                      setEditingItemKey(null);
                      setEditingItemType(null);
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Travel Tips Tab */}
        {activeTab === "tips" && (
          <div className="space-y-4">
            <div className="flex justify-end mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateTravelTips}
                disabled={aiLoading.tips || !formData.name.trim()}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {aiLoading.tips ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="tips">Travel Tips (one per line)</Label>
                <Textarea
                  id="tips"
                  value={formData.travel_tips.join("\n")}
                  onChange={(e) => {
                    const tips = e.target.value
                      .split("\n")
                      .filter((t: string) => t.trim());
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
              <h3 className="font-semibold">
                Frequently Asked Questions ({Object.keys(formData.faqs).length})
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateFAQs}
                  disabled={aiLoading.faqs || !formData.name.trim()}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {aiLoading.faqs ? "Generating..." : "Generate with AI"}
                </Button>
                <Dialog open={faqModalOpen} onOpenChange={setFaqModalOpen}>
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
                    <FAQForm
                      onSubmit={handleAddFAQ}
                      onClose={() => setFaqModalOpen(false)}
                    />
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditItem(key, "faq")}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
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
                <p className="text-sm text-muted-foreground text-center py-4">
                  No FAQs added yet.
                </p>
              )}
            </div>

            {/* Edit FAQ Dialog */}
            <Dialog
              open={editingItemType === "faq" && editingItemKey !== null}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingItemKey(null);
                  setEditingItemType(null);
                }
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Edit FAQ:{" "}
                    {editingItemKey &&
                      formData.faqs[editingItemKey]?.question}
                  </DialogTitle>
                </DialogHeader>
                {editingItemKey && (
                  <FAQForm
                    initialData={formData.faqs[editingItemKey]}
                    onSubmit={(updatedFAQ) =>
                      handleUpdateFAQ(editingItemKey!, updatedFAQ)
                    }
                    isEdit={true}
                    onClose={() => {
                      setEditingItemKey(null);
                      setEditingItemType(null);
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced sub-components with onClose prop
function PlaceForm({
  onSubmit,
  onClose,
  initialData,
  isEdit = false,
}: {
  onSubmit: (place: any) => void;
  onClose?: () => void;
  initialData?: any;
  isEdit?: boolean;
}) {
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
    onClose?.();
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
        <Button type="submit" className="flex-1">
          {isEdit ? "Update Place" : "Add Place"}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function ActivityForm({
  onSubmit,
  onClose,
  initialData,
  isEdit = false,
}: {
  onSubmit: (activity: any) => void;
  onClose?: () => void;
  initialData?: any;
  isEdit?: boolean;
}) {
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
    onClose?.();
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
        <Button type="submit" className="flex-1">
          {isEdit ? "Update Activity" : "Add Activity"}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function ItineraryForm({
  onSubmit,
  onClose,
  initialData,
  isEdit = false,
}: {
  onSubmit: (day: any) => void;
  onClose?: () => void;
  initialData?: any;
  isEdit?: boolean;
}) {
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
    onClose?.();
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
        <Button type="submit" className="flex-1">
          {isEdit ? "Update Day" : "Add Day"}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function FAQForm({
  onSubmit,
  onClose,
  initialData,
  isEdit = false,
}: {
  onSubmit: (faq: any) => void;
  onClose?: () => void;
  initialData?: any;
  isEdit?: boolean;
}) {
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
    onClose?.();
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
        <Button type="submit" className="flex-1">
          {isEdit ? "Update FAQ" : "Add FAQ"}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default AdminDestinationEdit;