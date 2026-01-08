"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import ImageUploader from "./ImageUploader"
import { useToast } from "@/hooks/use-toast"
import { AIButton } from "./AIButton"

// Import the correct type from Supabase
import type { Tables } from "@/integrations/supabase/types"

// Use the Supabase-generated type instead
type DayItem = Tables<"journey_days">

export const DayScheduleEditor: React.FC<{ journeyId: string }> = ({ journeyId }) => {
  const [days, setDays] = useState<DayItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<DayItem | null>(null)
  const { toast } = useToast()
  const [journeyInfo, setJourneyInfo] = useState<{ title: string } | null>(null)
  
  // Make sure form matches the actual database schema
  const [form, setForm] = useState({
    day_number: 1,
    title: "",
    description: "",
    image_url: "",
    duration: "",
    accommodation: "",
    meals: "",
  })

  const fetchDays = async () => {
    try {
      const { data, error } = await supabase
        .from("journey_days")
        .select("*")
        .eq("journey_id", journeyId)
        .order("day_number", { ascending: true })
      
      if (error) {
        toast({ 
          title: "Error fetching days", 
          description: error.message, 
          variant: "destructive" 
        })
      } else {
        // Cast the data to DayItem type
        setDays(data as DayItem[] || [])
      }
    } catch (error) {
      console.error("Error fetching days:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchJourneyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("journeys")
        .select("title")
        .eq("id", journeyId)
        .single()

      if (!error && data) {
        setJourneyInfo(data)
      }
    } catch (error) {
      console.error("Error fetching journey info:", error)
    }
  }

  useEffect(() => {
    fetchDays()
    fetchJourneyInfo()

    const daysChannel = supabase
      .channel(`journey-days-${journeyId}`)
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "journey_days", 
          filter: `journey_id=eq.${journeyId}` 
        },
        fetchDays
      )
      .subscribe()

    return () => {
      supabase.removeChannel(daysChannel)
    }
  }, [journeyId])

  const resetForm = () => {
    const lastDayNumber = days.length > 0 
      ? days[days.length - 1]?.day_number || 0 
      : 0
    
    setForm({
      day_number: lastDayNumber + 1,
      title: "",
      description: "",
      image_url: "",
      duration: "",
      accommodation: "",
      meals: "",
    })
    setEditing(null)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!form.day_number || form.day_number < 1) {
      toast({
        title: "Validation Error",
        description: "Day number must be at least 1",
        variant: "destructive"
      })
      return
    }

    const payload = {
      journey_id: journeyId,
      day_number: Number(form.day_number),
      title: form.title.trim() || null,
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      duration: form.duration.trim() || null,
      accommodation: form.accommodation.trim() || null,
      meals: form.meals.trim() || null,
    }

    try {
      if (editing) {
        const { error } = await supabase
          .from("journey_days")
          .update(payload)
          .eq("id", editing.id)
        
        if (error) throw error
        
        toast({ 
          title: "Success", 
          description: "Day updated successfully" 
        })
      } else {
        const { error } = await supabase
          .from("journey_days")
          .insert([payload])
        
        if (error) throw error
        
        toast({ 
          title: "Success", 
          description: "Day added successfully" 
        })
      }
      
      resetForm()
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "An error occurred", 
        variant: "destructive" 
      })
    }
  }

  const editDay = (day: DayItem) => {
    setEditing(day)
    setForm({
      day_number: day.day_number,
      title: day.title || "",
      description: day.description || "",
      image_url: day.image_url || "",
      duration: day.duration || "",
      accommodation: day.accommodation || "",
      meals: day.meals || "",
    })
  }

  const deleteDay = async (id: string) => {
    if (!confirm("Are you sure you want to delete this day?")) return
    
    try {
      const { error } = await supabase
        .from("journey_days")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      toast({ 
        title: "Success", 
        description: "Day deleted successfully" 
      })
    } catch (error: any) {
      toast({ 
        title: "Error deleting day", 
        description: error.message, 
        variant: "destructive" 
      })
    }
  }

  const handleAIContentGenerated = (aiContent: Record<string, any>) => {
    setForm(prev => ({
      ...prev,
      title: aiContent.title || prev.title,
      description: aiContent.description || prev.description,
      duration: aiContent.duration || prev.duration,
      accommodation: aiContent.accommodation || prev.accommodation,
      meals: aiContent.meals || prev.meals,
    }))

    // If AI provides image_prompt, you could use it to suggest an image
    if (aiContent.image_prompt) {
      toast({
        title: "Image suggestion",
        description: `AI suggests: "${aiContent.image_prompt}" for the day's image`,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-sm text-muted-foreground">Loading days...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editing ? `Edit Day ${editing.day_number}` : "Add New Day"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day_number">Day Number *</Label>
                <Input
                  id="day_number"
                  type="number"
                  min="1"
                  value={form.day_number}
                  onChange={(e) => setForm({ ...form, day_number: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title">Day Title</Label>
                  <AIButton
                    title={form.title || journeyInfo?.title || `Day ${form.day_number}`}
                    contentType="daySchedule"
                    onContentGenerated={handleAIContentGenerated}
                    disabled={!form.title.trim() && !journeyInfo?.title}
                    className="h-7 text-xs"
                  />
                </div>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Example: Kathmandu to Pokhara"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Describe the activities for this day..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="6-7 hours"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accommodation">Accommodation</Label>
                <Input
                  id="accommodation"
                  value={form.accommodation}
                  onChange={(e) => setForm({ ...form, accommodation: e.target.value })}
                  placeholder="Teahouse / Lodge / Hotel"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meals">Meals</Label>
                <Input
                  id="meals"
                  value={form.meals}
                  onChange={(e) => setForm({ ...form, meals: e.target.value })}
                  placeholder="Breakfast, Lunch, Dinner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Day Photo</Label>
              <ImageUploader
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">
                {editing ? "Update Day" : "Add Day"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
              >
                Clear
              </Button>
              {editing && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setEditing(null)}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Days List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Days ({days.length})</h3>
        
        {days.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-muted-foreground">No days added yet. Add your first day above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {days.map((day) => (
              <Card key={day.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Day {day.day_number}: {day.title || "Untitled Day"}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editDay(day)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteDay(day.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {day.image_url && (
                    <div className="rounded-md overflow-hidden">
                      <img
                        src={day.image_url || "/placeholder.svg"}
                        alt={`Day ${day.day_number}`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                      <p className="text-sm">{day.duration || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Accommodation</Label>
                      <p className="text-sm">{day.accommodation || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Meals</Label>
                      <p className="text-sm">{day.meals || "Not specified"}</p>
                    </div>
                  </div>
                  
                  {day.description && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                      <p className="text-sm whitespace-pre-line">{day.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DayScheduleEditor