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
import { Plus, Edit, Trash2, ImageIcon, ListOrdered, Bed, Home, Building, MapPin } from "lucide-react"
import ImageUploader from "./ImageUploader"
import type { Tables } from "@/integrations/supabase/types";
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type GalleryItem = Tables<"resort_gallery">

type GallerySection = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  prefix: string;
}

const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "gallery",
    name: "Gallery",
    icon: <ImageIcon className="w-4 h-4" />,
    description: "General resort images without any specific category",
    prefix: "",
  },
  {
    id: "accommodation",
    name: "Accommodation",
    icon: <Bed className="w-4 h-4" />,
    description: "Room, suite, and accommodation photos",
    prefix: "acc:",
  }, 
];

export const ResortGalleryAdmin = () => {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    image_url: "",
    title: "",
    description: "",
    display_order: 0,
    section: "gallery",
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

  const getSectionFromImageUrl = (imageUrl: string | null): GallerySection => {
    if (!imageUrl) return GALLERY_SECTIONS[0];
    
    for (const section of GALLERY_SECTIONS) {
      if (section.prefix && imageUrl.startsWith(section.prefix)) {
        return section;
      }
    }
    
    return GALLERY_SECTIONS[0]; // Default to gallery
  }

  const getCleanImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) return "";
    
    for (const section of GALLERY_SECTIONS) {
      if (section.prefix && imageUrl.startsWith(section.prefix)) {
        return imageUrl.replace(section.prefix, "");
      }
    }
    
    return imageUrl;
  }

  const getSectionItems = (sectionPrefix: string): GalleryItem[] => {
    if (sectionPrefix === "all") {
      return items;
    }
    
    const section = GALLERY_SECTIONS.find(s => s.id === sectionPrefix);
    if (!section) return [];
    
    if (section.prefix === "") {
      // Gallery images (no prefix)
      return items.filter(item => {
        const hasNoPrefix = !GALLERY_SECTIONS.some(s => 
          s.prefix !== "" && item.image_url?.startsWith(s.prefix)
        );
        return hasNoPrefix;
      });
    }
    
    return items.filter(item => item.image_url?.startsWith(section.prefix));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Process the image URL: add prefix based on selected section
    const selectedSection = GALLERY_SECTIONS.find(s => s.id === formData.section);
    let processedImageUrl = formData.image_url;
    
    if (selectedSection?.prefix && !formData.image_url.startsWith(selectedSection.prefix)) {
      processedImageUrl = `${selectedSection.prefix}${formData.image_url}`;
    }

    const payload = {
      image_url: processedImageUrl,
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
    const section = getSectionFromImageUrl(item.image_url);
    const cleanImageUrl = getCleanImageUrl(item.image_url);

    setEditing(item)
    setFormData({
      image_url: cleanImageUrl,
      title: item.title || "",
      description: item.description || "",
      display_order: item.display_order || 0,
      section: section.id,
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
    setFormData({ 
      image_url: "", 
      title: "", 
      description: "", 
      display_order: 0,
      section: "gallery"
    })
    setEditing(null)
    setIsDialogOpen(false)
  }

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, image_url: url })
  }

  const getSectionIcon = (sectionId: string) => {
    const section = GALLERY_SECTIONS.find(s => s.id === sectionId);
    return section?.icon || <ImageIcon className="w-4 h-4" />;
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
                  onChange={handleImageUpload}
                />
              </div>
              
              <div>
                <Label htmlFor="section">Image Category</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {GALLERY_SECTIONS.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        <div className="flex items-center gap-2">
                          {section.icon}
                          <span>{section.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {GALLERY_SECTIONS.find(s => s.id === formData.section)?.description}
                </p>
              </div>

              <div>
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Image title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Image description"
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

              {/* Preview of the final URL */}
              {formData.image_url && (
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="font-medium mb-1">Image URL will be saved as:</p>
                  <code className="text-xs break-all bg-background p-2 rounded block">
                    {formData.section === "gallery" 
                      ? formData.image_url 
                      : `${GALLERY_SECTIONS.find(s => s.id === formData.section)?.prefix}${formData.image_url}`
                    }
                  </code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Category: {GALLERY_SECTIONS.find(s => s.id === formData.section)?.name}
                  </p>
                </div>
              )}

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

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            All Images
          </TabsTrigger>
          {GALLERY_SECTIONS.map((section) => (
            <TabsTrigger 
              key={section.id} 
              value={section.id}
              className="flex items-center gap-2"
            >
              {section.icon}
              {section.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {["all", ...GALLERY_SECTIONS.map(s => s.id)].map((tabId) => {
          const sectionItems = getSectionItems(tabId);
          const sectionInfo = tabId === "all" 
            ? { name: "All Images", icon: <ImageIcon className="w-5 h-5" /> }
            : GALLERY_SECTIONS.find(s => s.id === tabId);
          
          return (
            <TabsContent key={tabId} value={tabId} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {sectionInfo?.icon}
                  {sectionInfo?.name} 
                  <span className="text-sm font-normal text-muted-foreground">
                    ({sectionItems.length} items)
                  </span>
                </h3>
              </div>
              
              {sectionItems.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No images in this category yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        if (tabId !== "all") {
                          setFormData(prev => ({ ...prev, section: tabId }));
                        }
                        setIsDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add {tabId === "all" ? "Image" : sectionInfo?.name} Image
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sectionItems.map((item) => {
                    const section = getSectionFromImageUrl(item.image_url);
                    const cleanImageUrl = getCleanImageUrl(item.image_url);
                    
                    return (
                      <Card key={item.id} className="relative">
                        <div className="absolute top-2 left-2 z-10">
                          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                            section.id === "gallery" 
                              ? "bg-muted text-muted-foreground" 
                              : "bg-primary/90 text-primary-foreground"
                          }`}>
                            {section.icon}
                            <span>{section.name}</span>
                          </div>
                        </div>
                        
                        <CardHeader>
                          <CardTitle className="text-lg truncate">
                            {item.title || "Untitled"}
                            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-2">
                              <ListOrdered className="w-3 h-3" /> {item.display_order ?? 0}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-32 rounded overflow-hidden mb-3 bg-muted flex items-center justify-center relative">
                            {cleanImageUrl ? (
                              <img
                                src={cleanImageUrl || "/placeholder.svg"}
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
                    )
                  })}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  )
}

export default ResortGalleryAdmin