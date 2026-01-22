"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Pencil, Trash2, Plus, Save, X, Loader2, Image as ImageIcon, Users, Move } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"

interface AccommodationManagerProps {
  stayId: string
  stayName: string
  onUpdate?: () => void
}

// Helper function to parse features
const parseFeatures = (featuresData: any): string[] => {
  if (!featuresData) return [];
  
  try {
    if (typeof featuresData === 'string') {
      // If it's a JSON array
      if (featuresData.startsWith('[') && featuresData.endsWith(']')) {
        return JSON.parse(featuresData);
      } else {
        // If it's a comma-separated string
        return featuresData.split(',').map((f: string) => f.trim()).filter(Boolean);
      }
    } else if (Array.isArray(featuresData)) {
      return featuresData;
    }
  } catch (error) {
    console.error("Error parsing features:", error);
  }
  
  return [];
};

// Helper function to stringify features
const stringifyFeatures = (features: string[]): string => {
  return JSON.stringify(features);
};

export default function AccommodationManager({ stayId, stayName, onUpdate }: AccommodationManagerProps) {
  const [accommodations, setAccommodations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAccommodation, setEditingAccommodation] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    capacity: "",
    features: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (stayId) {
      fetchAccommodations()
    }
  }, [stayId])

  const fetchAccommodations = async () => {
    try {
      const { data, error } = await supabase
        .from("accommodation_options")
        .select("*")
        .eq("stay_id", stayId)
        .order("sort_order", { ascending: true })

      if (error) throw error
      setAccommodations(data || [])
    } catch (error) {
      console.error("Error fetching accommodations:", error)
      toast({
        title: "Error",
        description: "Failed to load accommodation options",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEdit = (accommodation: any) => {
    setEditingAccommodation(accommodation.id)
    setIsCreating(false)
    
    const features = parseFeatures(accommodation.features).join("\n");
    
    setFormData({
      name: accommodation.name || "",
      image_url: accommodation.image_url || "",
      capacity: accommodation.capacity || "",
      features: features,
    })
  }

  const handleCancelEdit = () => {
    setEditingAccommodation(null)
    setIsCreating(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      image_url: "",
      capacity: "",
      features: "",
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const featuresArray = formData.features.split("\n").filter(f => f.trim());
      
      const accommodationData = {
        stay_id: stayId,
        name: formData.name,
        image_url: formData.image_url,
        capacity: formData.capacity,
        features: stringifyFeatures(featuresArray),
        sort_order: accommodations.length
      }

      if (editingAccommodation) {
        // Update existing accommodation
        const { error } = await supabase
          .from("accommodation_options")
          .update(accommodationData)
          .eq("id", editingAccommodation)

        if (error) throw error

        toast({
          title: "Success",
          description: "Accommodation updated successfully",
        })
      } else {
        // Create new accommodation
        const { error } = await supabase
          .from("accommodation_options")
          .insert([accommodationData])

        if (error) throw error

        toast({
          title: "Success",
          description: "Accommodation created successfully",
        })
      }

      fetchAccommodations()
      handleCancelEdit()
    } catch (error: any) {
      console.error("Error saving accommodation:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save accommodation",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this accommodation option?")) return

    try {
      const { error } = await supabase
        .from("accommodation_options")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Accommodation deleted successfully",
      })
      fetchAccommodations()
    } catch (error) {
      console.error("Error deleting accommodation:", error)
      toast({
        title: "Error",
        description: "Failed to delete accommodation",
        variant: "destructive",
      })
    }
  }

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(accommodations)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setAccommodations(items)

    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        sort_order: index
      }))

      for (const update of updates) {
        await supabase
          .from("accommodation_options")
          .update({ sort_order: update.sort_order })
          .eq("id", update.id)
      }

      toast({
        title: "Success",
        description: "Accommodation order updated",
      })
      onUpdate?.()
    } catch (error) {
      console.error("Error updating accommodation order:", error)
      toast({
        title: "Error",
        description: "Failed to update accommodation order",
        variant: "destructive",
      })
      fetchAccommodations()
    }
  }

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
          <h3 className="text-lg font-semibold">Accommodation Options: {stayName}</h3>
          <p className="text-sm text-muted-foreground">
            Manage accommodation options for this experiential stay
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Accommodation
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingAccommodation) && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">
              {editingAccommodation ? "Edit Accommodation" : "Add New Accommodation"}
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Deluxe Room"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="2 Adults + 1 Child"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line or comma separated)</Label>
                <Textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Queen/King bed\nEnsuite bathroom\nMountain/garden views\nTraditional Kashmiri decor\nModern amenities\nComplimentary Wi-Fi\nTea/coffee maker"
                  rows={5}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingAccommodation ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accommodations List */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Features</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="accommodations">
              {(provided) => (
                <TableBody
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {accommodations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No accommodation options found. Add your first one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    accommodations.map((accommodation, index) => {
                      const features = parseFeatures(accommodation.features);
                      
                      return (
                        <Draggable key={accommodation.id} draggableId={accommodation.id} index={index}>
                          {(provided) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="hover:bg-muted/50"
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div {...provided.dragHandleProps}>
                                    <Move className="h-4 w-4 text-muted-foreground cursor-move" />
                                  </div>
                                  <span className="font-mono">{index + 1}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{accommodation.name}</div>
                                {accommodation.image_url && (
                                  <div className="w-16 h-12 mt-1 rounded overflow-hidden">
                                    <img
                                      src={accommodation.image_url}
                                      alt={accommodation.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder.svg"
                                      }}
                                    />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Users className="h-3 w-3 mr-1" />
                                  {accommodation.capacity || "-"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-xs">
                                  {features.length > 0 && (
                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                      {features.slice(0, 2).join(", ")}
                                      {features.length > 2 && "..."}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(accommodation)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(accommodation.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      )
                    })
                  )}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </div>
    </div>
  )
}