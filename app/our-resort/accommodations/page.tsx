"use client"

import React, { useEffect, useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mountain,
  Bed,
  Users,
  TreePine,
  Star,
  Wifi,
  Coffee,
  Shield,
  Phone,
  Mail,
  MapPin,
  Check,
  Flame,
  Ban,
  Calendar,
  Clock,
  Utensils,
  Droplets,
  Wind,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/integrations/supabase/client"

const AccommodationsPage = () => {
  const [accommodationImages, setAccommodationImages] = useState<{ id: string; image_url: string; title: string; description: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Fetch accommodation images from gallery
  useEffect(() => {
    fetchAccommodationImages()
  }, [])

  const fetchAccommodationImages = async () => {
    try {
      const { data, error } = await supabase
        .from("resort_gallery")
        .select("*")
        .order("display_order", { ascending: true })

      if (error) throw error

      // Filter images that start with "acc:" prefix and clean the URLs
      const accImages = data
        ?.filter(item => item.image_url?.startsWith("acc:"))
        ?.map(item => ({
          id: item.id,
          image_url: item.image_url.replace(/^acc:/, ""), // Remove "acc:" prefix
          title: item.title || "Premium Glamp",
          description: item.description || ""
        })) || []

      setAccommodationImages(accImages)
    } catch (error) {
      console.error("Error fetching accommodation images:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === accommodationImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? accommodationImages.length - 1 : prevIndex - 1
    )
  }

  const openFullscreen = (index: number) => {
    setSelectedImageIndex(index)
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
    setSelectedImageIndex(null)
  }

  const amenities = [
    { icon: <Bed className="w-5 h-5" />, label: "Large Plush Bedding", description: "Comfortable bedding for 2-3 adults" },
    { icon: <Droplets className="w-5 h-5" />, label: "Hot & Cold Water", description: "Attached bathroom with running water" },
    { icon: <Coffee className="w-5 h-5" />, label: "Coffee Table", description: "With chairs in each room" },
    { icon: <Eye className="w-5 h-5" />, label: "Valley View", description: "Overlooking the mountains" },
    { icon: <Wifi className="w-5 h-5" />, label: "Free WiFi", description: "Stay connected" },
    { icon: <Shield className="w-5 h-5" />, label: "24/7 Security", description: "Safe and secure environment" },
    { icon: <Wind className="w-5 h-5" />, label: "Open Almirah", description: "Spacious storage" },
    { icon: <TreePine className="w-5 h-5" />, label: "Private Courtyard", description: "Personal outdoor space" },
  ]

  const tariffPlans = [
    {
      name: "European Plan",
      description: "Stay Without Meal",
      price: "₹4,800",
      features: ["Room accommodation only"]
    },
    {
      name: "Continental Plan",
      description: "Stay + Breakfast",
      price: "₹5,200",
      features: ["Room + Breakfast"]
    },
    {
      name: "Half Board",
      description: "Stay + Breakfast + Veg Lunch OR Veg/Non-veg Dinner",
      price: "₹6,200",
      features: ["Two meals included", "Vegetarian/Non-vegetarian options"]
    },
    {
      name: "Full Board",
      description: "Stay + Breakfast + Veg Lunch + Veg/Non-veg Dinner",
      price: "₹7,400",
      features: ["All meals included", "Full dining experience"]
    }
  ]

  const additionalInfo = [
    { label: "Child (6-12 yrs) Without Bed", value: "25% of Tariff as per plan" },
    { label: "Extra Person with Extra Bed", value: "35% of Room Tariff as per plan" },
    { label: "Child up to 5 yrs without Bed", value: "Complimentary" },
    { label: "Special Offer", value: "25% Discount for Offseason Period" },
  ]

  const terms = [
    { title: "Check-in/Check-out", content: "Check-in: 1:00 PM | Check-out: 11:00 AM", icon: <Clock className="w-4 h-4" /> },
    { title: "Restaurant Timings", content: "Breakfast: 8:30 AM - 10:00 AM | Lunch: 1:00 PM - 3:00 PM | Dinner: 8:00 PM - 10:30 PM", icon: <Utensils className="w-4 h-4" /> },
    { title: "Meal Service", content: "All meals provided at restaurant only. No meals served at Camps except water, tea & coffee.", icon: <Ban className="w-4 h-4" /> },
    { title: "Water Policy", content: "We provide filtered water from nearby mountain stream instead of bottled mineral water.", icon: <Droplets className="w-4 h-4" /> },
    { title: "Smoking Policy", content: "STRICTLY PROHIBITED inside the Camps. Violators will be asked to Check out without any Refund.", icon: <Flame className="w-4 h-4" /> },
    { title: "Bon Fire", content: "Available @ ₹500/hour (Wood purchased from local communities to support livelihood)", icon: <Flame className="w-4 h-4" /> },
  ]

  const seasons = {
    "Season & Mid-Season": [
      "15 April 2024 To 30 June",
      "01 Oct 2024 To 20 Nov",
      "20 Dec 2024 To 5 Jan"
    ],
    "Off Season": [
      "05 Jan 2024 To 15 April",
      "01 July 2024 To 30 Sep",
      "20 Nov 2024 to 20 Dec 2024"
    ]
  }

  const cancellationPolicy = [
    { period: "15 days or more before check-in", charge: "No Cancellation Charge" },
    { period: "14 - 7 days before check-in", charge: "10% Cancellation Charge" },
    { period: "6 - 3 days before check-in", charge: "50% Cancellation Charge" },
    { period: "Less than 2 days before check-in", charge: "No Refund" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 text-lg px-6 py-2">
              <Bed className="w-5 h-5 mr-2" />
              Premium Accommodation
            </Badge>
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6">
              Premium Glamps at
              <span className="block text-luxury">Shanti Himalaya</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
              Discover the charm of our Premium Glamps with valley view, set amidst the Himalayan serenity. 
              Unwind in our Premium Glamps, offering a perfect blend of comfort and adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Accommodation Details */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold mb-4 text-foreground">
                  <TreePine className="w-8 h-8 inline mr-3 text-primary" />
                  Wilderness Glamping Experience
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Each Glamp room is well appointed with a Large Bed having plush bedding while the room 
                  space is enough to accommodate 2~3 adults. Each Glamp room is furnished with an open 
                  almirah, Coffee table with chairs and opens into a courtyard overlooking the mountains.
                </p>
              </div>

              <div className="bg-muted/30 rounded-xl p-6 border border-muted">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Bed className="w-5 h-5 mr-2 text-primary" />
                  Room Features
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Attached bathroom with running hot and cold water</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Spacious layout for 2-3 adults</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Private courtyard with mountain views</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Open almirah for storage</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm border">
                      <div className="flex justify-center mb-2 text-primary">
                        {amenity.icon}
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{amenity.label}</h4>
                      <p className="text-xs text-muted-foreground">{amenity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Card className="shadow-card border-muted overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle className="flex items-center">
                    <Star className="w-6 h-6 mr-3 text-gold" />
                    <span className="text-2xl">Premium Glamps</span>
                    <Badge className="ml-auto bg-gold text-white">Only 4 Available</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Image Carousel Section */}
                  <div className="relative">
                    {loading ? (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : accommodationImages.length > 0 ? (
                      <>
                        {/* Main Carousel */}
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                          <div className="relative w-full h-full">
                            <img
                              src={accommodationImages[currentImageIndex]?.image_url || "/placeholder.svg"}
                              alt={accommodationImages[currentImageIndex]?.title}
                              className="w-full h-full object-cover transition-transform duration-500"
                              onClick={() => openFullscreen(currentImageIndex)}
                            />
                            
                            {/* Navigation Arrows */}
                            {accommodationImages.length > 1 && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                                  onClick={prevImage}
                                >
                                  <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                                  onClick={nextImage}
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </Button>
                              </>
                            )}
                            
                            {/* Image Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                              <h3 className="font-semibold text-lg">
                                {accommodationImages[currentImageIndex]?.title}
                              </h3>
                              {accommodationImages[currentImageIndex]?.description && (
                                <p className="text-sm text-white/80 line-clamp-1">
                                  {accommodationImages[currentImageIndex]?.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                                  {currentImageIndex + 1} / {accommodationImages.length}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-white hover:bg-white/20"
                                  onClick={() => openFullscreen(currentImageIndex)}
                                >
                                  <Maximize2 className="w-4 h-4 mr-1" />
                                  View Full
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Thumbnail Strip */}
                        {accommodationImages.length > 1 && (
                          <div className="flex gap-2 p-4 bg-muted/20 overflow-x-auto">
                            {accommodationImages.map((image, index) => (
                              <button
                                key={image.id}
                                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                  index === currentImageIndex 
                                    ? 'border-primary ring-2 ring-primary/30' 
                                    : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                              >
                                <img
                                  src={image.image_url}
                                  alt={image.title}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-8">
                        <Bed className="w-16 h-16 text-primary/30 mb-4" />
                        <p className="text-muted-foreground text-center">
                          Accommodation images will be added soon
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Room Details Below Carousel */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="font-semibold">2-3 Adults</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Room Type</span>
                        <span className="font-semibold">Premium Glamp</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">View</span>
                        <span className="font-semibold flex items-center">
                          <Eye className="w-4 h-4 mr-2 text-primary" />
                          Valley & Mountain
                        </span>
                      </div>
                    </div>

                    <div className="bg-luxury/10 p-4 rounded-lg border border-luxury/20">
                      <p className="text-sm italic text-center">
                        "Book your stay to embrace tranquillity, adventure, and the luxury of personal attention under the stars. 
                        Nature's embrace awaits your arrival!"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tariff Section */}
      <section className="py-20 mountain-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              Tariff at Shanti Himalaya
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose from our flexible stay plans designed for every type of traveler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tariffPlans.map((plan, index) => (
              <Card key={index} className="shadow-card hover-lift bg-white">
                <CardContent className="p-6">
                  <Badge className="mb-4 bg-primary text-white">{plan.name}</Badge>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.price}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="tel:919910775073">Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-12">
            <h3 className="text-xl font-semibold mb-6 text-center">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalInfo.map((info, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">{info.label}</span>
                  <Badge variant="outline" className="font-semibold">{info.value}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-10 text-center">Terms & Conditions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {terms.map((term, index) => (
                <Card key={index} className="shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {term.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{term.title}</h4>
                        <p className="text-sm text-muted-foreground">{term.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Seasonality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {Object.entries(seasons).map(([season, dates]) => (
                <Card key={season} className="shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardTitle className="text-lg">{season}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {dates.map((date, idx) => (
                        <li key={idx} className="flex items-center">
                          <Calendar className="w-4 h-4 mr-3 text-primary" />
                          <span className="text-muted-foreground">{date}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cancellation Policy */}
            <Card className="shadow-card mb-12">
              <CardHeader className="bg-gradient-to-r from-red-500/10 to-red-500/5">
                <CardTitle className="text-xl">Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {cancellationPolicy.map((policy, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">{policy.period}</span>
                      <Badge variant={policy.charge.includes("No") ? "default" : "destructive"}>
                        {policy.charge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
              <h3 className="text-xl font-semibold mb-4 text-amber-800">Important Notes</h3>
              <ul className="space-y-3 text-amber-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span>
                  <span>The above Tariff is valid for limited period only and is subject to change at any time without prior notice until confirmed.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span>
                  <span className="font-semibold">The Management reserves the right to cancel/refuse any booking at any given point of time. Full Refund shall be facilitated in case any payment received for such cases.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span>
                  <span>Rates & Offers are not valid on Long Weekends/Government Holiday, Festival dates, Christmas and New Year period.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span>
                  <span>Taxes additional as applicable.</span>
                </li>
              </ul>
            </div>

            {/* Payment Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-primary" />
                  Booking & Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Payment Terms</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                      <span>25% payment at the time of booking</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3" />
                      <span>Balance payment 7 days before Check In</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Bank Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-semibold">SHANTI HIMALAYA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">A/C No:</span>
                      <span className="font-semibold">40741065717</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-semibold">STATE BANK OF INDIA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IFSC:</span>
                      <span className="font-semibold">SBIN0011414</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {isFullscreen && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh]">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={closeFullscreen}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation in fullscreen */}
            {accommodationImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
                  onClick={() => {
                    const newIndex = selectedImageIndex === 0 
                      ? accommodationImages.length - 1 
                      : selectedImageIndex - 1
                    setSelectedImageIndex(newIndex)
                  }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
                  onClick={() => {
                    const newIndex = selectedImageIndex === accommodationImages.length - 1 
                      ? 0 
                      : selectedImageIndex + 1
                    setSelectedImageIndex(newIndex)
                  }}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Fullscreen Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={accommodationImages[selectedImageIndex]?.image_url}
                alt={accommodationImages[selectedImageIndex]?.title}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              {/* Image info in fullscreen */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
                <h3 className="text-xl font-semibold">
                  {accommodationImages[selectedImageIndex]?.title}
                </h3>
                {accommodationImages[selectedImageIndex]?.description && (
                  <p className="text-white/80 mt-2">
                    {accommodationImages[selectedImageIndex]?.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4">
                  <Badge variant="outline" className="bg-white/20 border-white/30">
                    {selectedImageIndex + 1} / {accommodationImages.length}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                      asChild
                    >
                      <a 
                        href={accommodationImages[selectedImageIndex]?.image_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        download
                      >
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnails in fullscreen */}
            {accommodationImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto justify-center p-2">
                {accommodationImages.map((image, index) => (
                  <button
                    key={image.id}
                    className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex 
                        ? 'border-white ring-2 ring-white/50' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-6">
              Ready to Experience Luxury Glamping?
            </h2>
            <p className="text-white/90 mb-8 leading-relaxed">
              Contact us now to book your stay in our Premium Glamps. Experience the perfect 
              blend of adventure and comfort in the Himalayas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Phone className="w-5 h-5 mr-2" />
                Call Now: +91 99107 75073
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AccommodationsPage