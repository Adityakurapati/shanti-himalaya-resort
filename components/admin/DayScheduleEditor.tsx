"use client"

import Image from "next/image";
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
import type { Tables } from "@/integrations/supabase/types";

type DayItem = {
  id: string
  journey_id: string
  day_number: number
  title: string | null
  description: string | null
  image_url: string | null
}

export const DayScheduleEditor: React.FC<{ journeyId: string }> = ({ journeyId }) => {
  const [days, setDays] = useState<DayItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<DayItem | null>(null)
  const { toast } = useToast()
  const [form, setForm] = useState({
    day_number: 1,
    title: "",
    description: "",
    image_url: "",
  })

  const fetchDays = async () => {
    const { data, error } = await supabase
      .from("journey_days")
      .select("*")
      .eq("journey_id", journeyId)
      .order("day_number", { ascending: true })
    if (error) {
      toast({ title: "Error fetching days", description: error.message, variant: "destructive" })
    } else {
      setDays(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDays()
    // subscribe to changes
    const channel = supabase
      .channel(`journey-days-${journeyId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "journey_days", filter: `journey_id=eq.${journeyId}` },
        fetchDays,
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [journeyId])

  const resetForm = () => {
    setForm({ day_number: (days[days.length - 1]?.day_number || 0) + 1, title: "", description: "", image_url: "" })
    setEditing(null)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      journey_id: journeyId,
      day_number: Number(form.day_number),
      title: form.title || null,
      description: form.description || null,
      image_url: form.image_url || null,
    }
    if (editing) {
      const { error } = await supabase.from("journey_days").update(payload).eq("id", editing.id)
      if (error) return toast({ title: "Error updating day", description: error.message, variant: "destructive" })
      toast({ title: "Day updated" })
    } else {
      const { error } = await supabase.from("journey_days").insert([payload])
      if (error) return toast({ title: "Error adding day", description: error.message, variant: "destructive" })
      toast({ title: "Day added" })
    }
    resetForm()
  }

  const editDay = (d: DayItem) => {
    setEditing(d)
    setForm({
      day_number: d.day_number,
      title: d.title || "",
      description: d.description || "",
      image_url: d.image_url || "",
    })
  }

  const del = async (id: string) => {
    if (!confirm("Delete this day?")) return
    const { error } = await supabase.from("journey_days").delete().eq("id", id)
    if (error) return toast({ title: "Error deleting day", description: error.message, variant: "destructive" })
    toast({ title: "Day deleted" })
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading days…</div>

  return (
    <div className="space-y-4">
      <form onSubmit={save} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="day_number">Day Number</Label>
            <Input
              id="day_number"
              type="number"
              min={1}
              value={form.day_number}
              onChange={(e) => setForm({ ...form, day_number: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="title">Day Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Day 1: Arrive Kathmandu"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Brief Description</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>
        <ImageUploader
          label="Day Photo"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
          aspect={16 / 9}
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {editing ? "Update Day" : "Add Day"}
          </Button>
          <Button type="button" variant="outline" onClick={resetForm}>
            Clear
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {days.map((d: any) => (
          <Card key={d.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Day {d.day_number}
                  {d.title ? ` — ${d.title}` : ""}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => editDay(d)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => del(d.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {d.image_url && (
                <div className="h-32 rounded overflow-hidden mb-2">
                  <img
                    src={d.image_url || "/placeholder.svg"}
                    alt={`Day ${d.day_number}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {d.description && <p className="text-sm text-muted-foreground">{d.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default DayScheduleEditor
