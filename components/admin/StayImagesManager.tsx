"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Trash2, Upload, Move, Star, StarOff, Loader2, Image as ImageIcon, Plus, ExternalLink, Badge, Pencil, Save, X } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import ImageUploader from "./ImageUploader"

interface StayImagesManagerProps {
  stayId: string
  stayName: string
  onUpdate?: () => void
}

export default function StayImagesManager({ stayId, stayName, onUpdate }: StayImagesManagerProps) {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState("")
  const [caption, setCaption] = useState("")
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null)
  const [captionEdit, setCaptionEdit] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (stayId) {
      fetchImages()
    }
  }, [stayId])

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("stay_images")
        .select("*")
        .eq("stay_id", stayId)
        .order("image_order", { ascending: true })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error("Error fetching images:", error)
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddImage = async () => {
    if (!selectedImageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please add an image first",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const maxOrder = images.length > 0 
        ? Math.max(...images.map(img => img.image_order)) 
        : -1

      const { error } = await supabase
        .from("stay_images")
        .insert([{
          stay_id: stayId,
          image_url: selectedImageUrl.trim(),
          caption: caption.trim(),
          image_order: maxOrder + 1,
          is_featured: images.length === 0
        }])

      if (error) throw error

      toast({
        title: "Success",
        description: "Image added successfully",
      })
      setSelectedImageUrl("")
      setCaption("")
      setUploadDialogOpen(false)
      fetchImages()
      onUpdate?.()
    } catch (error) {
      console.error("Error adding image:", error)
      toast({
        title: "Error",
        description: "Failed to add image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const { error } = await supabase
        .from("stay_images")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Image deleted successfully",
      })
      fetchImages()
      onUpdate?.()
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      })
    }
  }

  const handleSetFeatured = async (id: string) => {
    try {
      await supabase
        .from("stay_images")
        .update({ is_featured: false })
        .eq("stay_id", stayId)

      const { error } = await supabase
        .from("stay_images")
        .update({ is_featured: true })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Featured image updated",
      })
      fetchImages()
      onUpdate?.()
    } catch (error) {
      console.error("Error setting featured image:", error)
      toast({
        title: "Error",
        description: "Failed to update featured image",
        variant: "destructive",
      })
    }
  }

  const handleStartEditCaption = (imageId: string, currentCaption: string) => {
    setEditingCaptionId(imageId)
    setCaptionEdit(currentCaption || "")
  }

  const handleSaveCaption = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("stay_images")
        .update({ caption: captionEdit.trim() })
        .eq("id", imageId)

      if (error) throw error

      // Update local state
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, caption: captionEdit.trim() } : img
      ))
      
      toast({
        title: "Success",
        description: "Caption updated successfully",
      })
      
      setEditingCaptionId(null)
      setCaptionEdit("")
    } catch (error) {
      console.error("Error saving caption:", error)
      toast({
        title: "Error",
        description: "Failed to update caption",
        variant: "destructive",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingCaptionId(null)
    setCaptionEdit("")
  }

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setImages(items)

    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        image_order: index
      }))

      for (const update of updates) {
        await supabase
          .from("stay_images")
          .update({ image_order: update.image_order })
          .eq("id", update.id)
      }

      toast({
        title: "Success",
        description: "Image order updated",
      })
      onUpdate?.()
    } catch (error) {
      console.error("Error updating image order:", error)
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive",
      })
      fetchImages()
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
          <h3 className="text-lg font-semibold">Stay Images: {stayName}</h3>
          <p className="text-sm text-muted-foreground">
            Upload and manage images for this experiential stay
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload New Image</DialogTitle>
            <DialogDescription>
              Upload an image for {stayName}. The first image added will be set as featured.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <ImageUploader
              value={selectedImageUrl}
              onChange={setSelectedImageUrl}
              label="Stay Image"
            />
            
            <div className="space-y-2">
              <Label htmlFor="caption">Image Caption</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="E.g., Property exterior view, Dining area, Mountain view..."
              />
              <p className="text-xs text-muted-foreground">
                This caption will be displayed below the image on the website.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadDialogOpen(false)
                  setSelectedImageUrl("")
                  setCaption("")
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddImage}
                disabled={uploading || !selectedImageUrl}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drag and Drop Table View */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Caption</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="images">
              {(provided) => (
                <TableBody
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {images.map((image, index) => (
                    <Draggable key={image.id} draggableId={image.id} index={index}>
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
                            <div className="w-20 h-12 rounded overflow-hidden">
                              <img
                                src={image.image_url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <a
                                href={image.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                              >
                                {image.image_url.substring(0, 40)}...
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>
                            {editingCaptionId === image.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={captionEdit}
                                  onChange={(e) => setCaptionEdit(e.target.value)}
                                  className="h-8 text-sm"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveCaption(image.id)
                                    if (e.key === 'Escape') handleCancelEdit()
                                  }}
                                />
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => handleSaveCaption(image.id)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between group">
                                <span className="text-sm truncate max-w-[200px]" title={image.caption || "No caption"}>
                                  {image.caption || "No caption"}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleStartEditCaption(image.id, image.caption || "")}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {image.is_featured ? (
                              <Badge className="bg-amber-100 text-amber-800">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Featured
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSetFeatured(image.id)}
                              >
                                Set Featured
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteImage(image.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Images Yet</h3>
          <p className="text-muted-foreground mb-4">
            Add images to showcase this experiential stay
          </p>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Image
          </Button>
        </div>
      )}
    </div>
  )
}