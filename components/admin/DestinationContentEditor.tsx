"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface DestinationContentEditorProps {
        data: any
        onChange: (data: any) => void
        onSubDialogChange?: (isOpen: boolean) => void
}

export const DestinationContentEditor: React.FC<DestinationContentEditorProps> = ({
        data,
        onChange,
        onSubDialogChange
}) => {
        const [activeTab, setActiveTab] = useState("overview")
        const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({})

        // Notify parent when any sub-dialog opens or closes
        useEffect(() => {
                const isAnyDialogOpen = Object.values(openDialogs).some((isOpen: any) => isOpen)
                onSubDialogChange?.(isAnyDialogOpen)
        }, [openDialogs, onSubDialogChange])

        const handleAddPlace = (place: any) => {
                const updated = [...(data.places_to_visit || []), place]
                onChange({ ...data, places_to_visit: updated })
                setOpenDialogs({ ...openDialogs, addPlace: false })
        }

        const handleDeletePlace = (index: number) => {
                const updated = (data.places_to_visit || []).filter((_: any, i: number) => i !== index)
                onChange({ ...data, places_to_visit: updated })
        }

        const handleAddActivity = (activity: any) => {
                const updated = [...(data.things_to_do || []), activity]
                onChange({ ...data, things_to_do: updated })
                setOpenDialogs({ ...openDialogs, addActivity: false })
        }

        const handleDeleteActivity = (index: number) => {
                const updated = (data.things_to_do || []).filter((_: any, i: number) => i !== index)
                onChange({ ...data, things_to_do: updated })
        }

        const handleAddDay = (day: any) => {
                const updated = [...(data.itinerary || []), day]
                onChange({ ...data, itinerary: updated })
                setOpenDialogs({ ...openDialogs, addDay: false })
        }

        const handleDeleteDay = (index: number) => {
                const updated = (data.itinerary || []).filter((_: any, i: number) => i !== index)
                onChange({ ...data, itinerary: updated })
        }

        const handleAddFAQ = (faq: any) => {
                const updated = [...(data.faqs || []), faq]
                onChange({ ...data, faqs: updated })
                setOpenDialogs({ ...openDialogs, addFAQ: false })
        }

        const handleDeleteFAQ = (index: number) => {
                const updated = (data.faqs || []).filter((_: any, i: number) => i !== index)
                onChange({ ...data, faqs: updated })
        }

        const handleDialogOpenChange = (dialogKey: string, open: boolean) => {
                setOpenDialogs(prev => ({ ...prev, [dialogKey]: open }))
        }

        return (
                <div className="space-y-6">
                        {/* Tab Navigation */}
                        <div className="flex flex-wrap gap-2 border-b">
                                {[
                                        { id: "overview", label: "Overview" },
                                        { id: "places", label: "Places to Visit" },
                                        { id: "activities", label: "Things to Do" },
                                        { id: "reach", label: "How to Reach" },
                                        { id: "besttime", label: "Best Time" },
                                        { id: "stay", label: "Where to Stay" },
                                        { id: "itinerary", label: "Itinerary" },
                                        { id: "tips", label: "Travel Tips" },
                                        { id: "faqs", label: "FAQs" },
                                ].map((tab: any) => (
                                        <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                                        ? "border-b-2 border-primary text-primary"
                                                        : "text-muted-foreground hover:text-foreground"
                                                        }`}
                                        >
                                                {tab.label}
                                        </button>
                                ))}
                        </div>

                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                                <div className="space-y-4">
                                        <div>
                                                <Label htmlFor="overview">Destination Overview</Label>
                                                <Textarea
                                                        id="overview"
                                                        value={data.overview || ""}
                                                        onChange={(e) => onChange({ ...data, overview: e.target.value })}
                                                        placeholder="Provide a comprehensive overview of the destination..."
                                                        rows={6}
                                                />
                                        </div>
                                </div>
                        )}

                        {/* Places to Visit Tab */}
                        {activeTab === "places" && (
                                <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                                <h3 className="font-semibold">Places to Visit</h3>
                                                <Dialog
                                                        open={openDialogs.addPlace || false}
                                                        onOpenChange={(open) => handleDialogOpenChange("addPlace", open)}
                                                >
                                                        <DialogTrigger asChild>
                                                                <Button size="sm">
                                                                        <Plus className="w-4 h-4 mr-2" />
                                                                        Add Place
                                                                </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                                <DialogHeader>
                                                                        <DialogTitle>Add Place to Visit</DialogTitle>
                                                                </DialogHeader>
                                                                <PlaceForm
                                                                        onSubmit={(place) => {
                                                                                handleAddPlace(place)
                                                                        }}
                                                                />
                                                        </DialogContent>
                                                </Dialog>
                                        </div>

                                        <div className="space-y-3">
                                                {(data.places_to_visit || []).map((place: any, index: number) => (
                                                        <Card key={index}>
                                                                <CardContent className="p-4">
                                                                        <div className="flex justify-between items-start">
                                                                                <div className="flex-1">
                                                                                        <h4 className="font-semibold">{place.name}</h4>
                                                                                        <p className="text-sm text-muted-foreground mt-1">{place.description}</p>
                                                                                        {place.highlights && place.highlights.length > 0 && (
                                                                                                <div className="mt-2 text-xs">
                                                                                                        <p className="font-medium">Highlights:</p>
                                                                                                        <ul className="list-disc list-inside">
                                                                                                                {place.highlights.map((h: any, i: number) => (
                                                                                                                        <li key={i}>{h}</li>
                                                                                                                ))}
                                                                                                        </ul>
                                                                                                </div>
                                                                                        )}
                                                                                </div>
                                                                                <Button variant="destructive" size="sm" onClick={() => handleDeletePlace(index)}>
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        )}

                        {/* Things to Do Tab */}
                        {activeTab === "activities" && (
                                <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                                <h3 className="font-semibold">Things to Do</h3>
                                                <Dialog
                                                        open={openDialogs.addActivity || false}
                                                        onOpenChange={(open) => handleDialogOpenChange("addActivity", open)}
                                                >
                                                        <DialogTrigger asChild>
                                                                <Button size="sm">
                                                                        <Plus className="w-4 h-4 mr-2" />
                                                                        Add Activity
                                                                </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                                <DialogHeader>
                                                                        <DialogTitle>Add Activity</DialogTitle>
                                                                </DialogHeader>
                                                                <ActivityForm
                                                                        onSubmit={(activity) => {
                                                                                handleAddActivity(activity)
                                                                        }}
                                                                />
                                                        </DialogContent>
                                                </Dialog>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {(data.things_to_do || []).map((activity: any, index: number) => (
                                                        <Card key={index}>
                                                                <CardContent className="p-4">
                                                                        <div className="flex justify-between items-start">
                                                                                <div className="flex-1">
                                                                                        <h4 className="font-semibold text-sm">{activity.title}</h4>
                                                                                        <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                                                                                </div>
                                                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteActivity(index)}>
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        )}

                        {/* How to Reach Tab */}
                        {activeTab === "reach" && (
                                <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {["air", "train", "road"].map((method: any) => (
                                                        <div key={method}>
                                                                <Label htmlFor={`reach-${method}`} className="capitalize">
                                                                        {method}
                                                                </Label>
                                                                <Textarea
                                                                        id={`reach-${method}`}
                                                                        value={data.how_to_reach?.[method]?.details?.join("\n") || ""}
                                                                        onChange={(e) => {
                                                                                const details = e.target.value.split("\n").filter((d: any) => d.trim())
                                                                                onChange({
                                                                                        ...data,
                                                                                        how_to_reach: {
                                                                                                ...data.how_to_reach,
                                                                                                [method]: {
                                                                                                        title: method.charAt(0).toUpperCase() + method.slice(1),
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
                                </div>
                        )}

                        {/* Best Time Tab */}
                        {activeTab === "besttime" && (
                                <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {["winter", "summer", "monsoon"].map((season: any) => (
                                                        <div key={season}>
                                                                <Label className="capitalize font-semibold mb-2 block">{season}</Label>
                                                                <div className="space-y-2">
                                                                        <Input
                                                                                placeholder="Season dates"
                                                                                value={data.best_time_details?.[season]?.season || ""}
                                                                                onChange={(e) => {
                                                                                        onChange({
                                                                                                ...data,
                                                                                                best_time_details: {
                                                                                                        ...data.best_time_details,
                                                                                                        [season]: {
                                                                                                                ...data.best_time_details?.[season],
                                                                                                                season: e.target.value,
                                                                                                        },
                                                                                                },
                                                                                        })
                                                                                }}
                                                                        />
                                                                        <Textarea
                                                                                placeholder="Weather"
                                                                                value={data.best_time_details?.[season]?.weather || ""}
                                                                                onChange={(e) => {
                                                                                        onChange({
                                                                                                ...data,
                                                                                                best_time_details: {
                                                                                                        ...data.best_time_details,
                                                                                                        [season]: {
                                                                                                                ...data.best_time_details?.[season],
                                                                                                                weather: e.target.value,
                                                                                                        },
                                                                                                },
                                                                                        })
                                                                                }}
                                                                                rows={2}
                                                                        />
                                                                        <Textarea
                                                                                placeholder="Why visit"
                                                                                value={data.best_time_details?.[season]?.why_visit || ""}
                                                                                onChange={(e) => {
                                                                                        onChange({
                                                                                                ...data,
                                                                                                best_time_details: {
                                                                                                        ...data.best_time_details,
                                                                                                        [season]: {
                                                                                                                ...data.best_time_details?.[season],
                                                                                                                why_visit: e.target.value,
                                                                                                        },
                                                                                                },
                                                                                        })
                                                                                }}
                                                                                rows={2}
                                                                        />
                                                                        <Textarea
                                                                                placeholder="Events"
                                                                                value={data.best_time_details?.[season]?.events || ""}
                                                                                onChange={(e) => {
                                                                                        onChange({
                                                                                                ...data,
                                                                                                best_time_details: {
                                                                                                        ...data.best_time_details,
                                                                                                        [season]: {
                                                                                                                ...data.best_time_details?.[season],
                                                                                                                events: e.target.value,
                                                                                                        },
                                                                                                },
                                                                                        })
                                                                                }}
                                                                                rows={2}
                                                                        />
                                                                        <Textarea
                                                                                placeholder="Challenges"
                                                                                value={data.best_time_details?.[season]?.challenges || ""}
                                                                                onChange={(e) => {
                                                                                        onChange({
                                                                                                ...data,
                                                                                                best_time_details: {
                                                                                                        ...data.best_time_details,
                                                                                                        [season]: {
                                                                                                                ...data.best_time_details?.[season],
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
                                </div>
                        )}

                        {/* Where to Stay Tab */}
                        {activeTab === "stay" && (
                                <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {["budget", "midrange", "luxury"].map((category: any) => (
                                                        <div key={category}>
                                                                <Label className="capitalize font-semibold mb-2 block">{category}</Label>
                                                                <Textarea
                                                                        placeholder={`${category} description`}
                                                                        value={data.where_to_stay?.[category]?.description || ""}
                                                                        onChange={(e) => {
                                                                                onChange({
                                                                                        ...data,
                                                                                        where_to_stay: {
                                                                                                ...data.where_to_stay,
                                                                                                [category]: {
                                                                                                        ...data.where_to_stay?.[category],
                                                                                                        category,
                                                                                                        description: e.target.value,
                                                                                                },
                                                                                        },
                                                                                })
                                                                        }}
                                                                        rows={3}
                                                                />
                                                                <Textarea
                                                                        placeholder="Options (one per line)"
                                                                        value={data.where_to_stay?.[category]?.options?.join("\n") || ""}
                                                                        onChange={(e) => {
                                                                                const options = e.target.value.split("\n").filter((o: any) => o.trim())
                                                                                onChange({
                                                                                        ...data,
                                                                                        where_to_stay: {
                                                                                                ...data.where_to_stay,
                                                                                                [category]: {
                                                                                                        ...data.where_to_stay?.[category],
                                                                                                        category,
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
                                </div>
                        )}

                        {/* Itinerary Tab */}
                        {activeTab === "itinerary" && (
                                <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                                <h3 className="font-semibold">Itinerary</h3>
                                                <Dialog
                                                        open={openDialogs.addDay || false}
                                                        onOpenChange={(open) => handleDialogOpenChange("addDay", open)}
                                                >
                                                        <DialogTrigger asChild>
                                                                <Button size="sm">
                                                                        <Plus className="w-4 h-4 mr-2" />
                                                                        Add Day
                                                                </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                                <DialogHeader>
                                                                        <DialogTitle>Add Itinerary Day</DialogTitle>
                                                                </DialogHeader>
                                                                <ItineraryForm
                                                                        onSubmit={(day) => {
                                                                                handleAddDay(day)
                                                                        }}
                                                                />
                                                        </DialogContent>
                                                </Dialog>
                                        </div>

                                        <div className="space-y-3">
                                                {(data.itinerary || []).map((day: any, index: number) => (
                                                        <Card key={index}>
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
                                                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteDay(index)}>
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        )}

                        {/* Travel Tips Tab */}
                        {activeTab === "tips" && (
                                <div className="space-y-4">
                                        <div>
                                                <Label htmlFor="tips">Travel Tips (one per line)</Label>
                                                <Textarea
                                                        id="tips"
                                                        value={(data.travel_tips || []).join("\n")}
                                                        onChange={(e) => {
                                                                const tips = e.target.value.split("\n").filter((t: any) => t.trim())
                                                                onChange({ ...data, travel_tips: tips })
                                                        }}
                                                        placeholder="Enter travel tips, one per line"
                                                        rows={8}
                                                />
                                        </div>
                                </div>
                        )}

                        {/* FAQs Tab */}
                        {activeTab === "faqs" && (
                                <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                                <h3 className="font-semibold">Frequently Asked Questions</h3>
                                                <Dialog
                                                        open={openDialogs.addFAQ || false}
                                                        onOpenChange={(open) => handleDialogOpenChange("addFAQ", open)}
                                                >
                                                        <DialogTrigger asChild>
                                                                <Button size="sm">
                                                                        <Plus className="w-4 h-4 mr-2" />
                                                                        Add FAQ
                                                                </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                                <DialogHeader>
                                                                        <DialogTitle>Add FAQ</DialogTitle>
                                                                </DialogHeader>
                                                                <FAQForm
                                                                        onSubmit={(faq) => {
                                                                                handleAddFAQ(faq)
                                                                        }}
                                                                />
                                                        </DialogContent>
                                                </Dialog>
                                        </div>

                                        <div className="space-y-3">
                                                {(data.faqs || []).map((faq: any, index: number) => (
                                                        <Card key={index}>
                                                                <CardContent className="p-4">
                                                                        <div className="flex justify-between items-start">
                                                                                <div className="flex-1">
                                                                                        <h4 className="font-semibold text-sm">{faq.question}</h4>
                                                                                        <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
                                                                                </div>
                                                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteFAQ(index)}>
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        )}
                </div>
        )
}

function PlaceForm({ onSubmit }: { onSubmit: (place: any) => void }) {
        const [formData, setFormData] = useState({
                name: "",
                description: "",
                highlights: "",
        })

        const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault()
                onSubmit({
                        name: formData.name,
                        description: formData.description,
                        highlights: formData.highlights.split("\n").filter((h: any) => h.trim()),
                })
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
                onSubmit(formData)
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
                onSubmit({
                        day: formData.day,
                        title: formData.title,
                        activities: formData.activities.split("\n").filter((a: any) => a.trim()),
                })
                setFormData({ day: 1, title: "", activities: "" })
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
                onSubmit(formData)
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