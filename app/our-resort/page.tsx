"use client"

import type { Tables } from "@/integrations/supabase/types";
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
        Mountain,
        MapPin,
        TreePine,
        Utensils,
        Camera,
        Bed,
        Calendar,
        Users,
        Star,
        Wifi,
        Car,
        Coffee,
        Shield,
        ChevronLeft,
        ChevronRight,
        Phone,
        Mail,
        MessageCircle,
        ChevronDown,
        ChevronUp,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client"

const OurResort = () => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0)
        const [selectedThumbnail, setSelectedThumbnail] = useState(0)
        const [expandedActivity, setExpandedActivity] = useState<Tables<"packages"> | null>(null)

        const [gallery, setGallery] = React.useState<
                Array<{ id: string; image_url: string; title: string | null; description: string | null }>
        >([])
        const [activitiesDb, setActivitiesDb] = React.useState<
                Array<{ id: string; title: string; description: string; full_description: string; icon: string }>
        >([])
        const [packagesDb, setPackagesDb] = React.useState<
                Array<{
                        id: string
                        name: string
                        duration: string
                        price: string
                        original_price: string
                        description: string
                        includes: string[]
                        features: string[]
                        badge: string
                }>
        >([])
        const [featuredExperiences, setFeaturedExperiences] = React.useState<
                Array<{
                        id: string
                        title: string
                        description: string
                        category: string
                        duration: string
                        group_size: string
                        highlights: string[]
                        price: string | null
                        featured: boolean | null
                }>
        >([])

        const galleryImages = gallery.map((g: any) => g.image_url)
        const thumbnails = gallery.map((g: any) => g.image_url)

        const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                Mountain,
                TreePine,
                Utensils,
                Coffee,
                MapPin,
                Camera,
                Bed,
                Calendar,
                Users,
                Star,
                Wifi,
                Car,
                Shield,
                Phone,
                Mail,
                MessageCircle,
                ChevronDown,
                ChevronUp,
                ChevronLeft,
                ChevronRight,
        }

        React.useEffect(() => {
                const load = async () => {
                        const [{ data: gal }, { data: acts }, { data: pkgs }, { data: exps }] = await Promise.all([
                                supabase.from("resort_gallery").select("*").order("display_order", { ascending: true }),
                                supabase.from("resort_activities").select("*").order("created_at", { ascending: false }),
                                supabase.from("resort_packages").select("*").order("created_at", { ascending: false }),
                                supabase
                                        .from("experiences")
                                        .select("*")
                                        .eq("featured", true)
                                        .order("created_at", { ascending: false })
                                        .limit(3),
                        ])
                        setGallery(gal || [])
                        setActivitiesDb(acts || [])
                        setPackagesDb(pkgs || [])
                        setFeaturedExperiences(exps || [])
                }
                load()

                const chGallery = supabase
                        .channel("resort_gallery_changes")
                        .on("postgres_changes", { event: "*", schema: "public", table: "resort_gallery" }, load)
                        .subscribe()
                const chActivities = supabase
                        .channel("resort_activities_changes")
                        .on("postgres_changes", { event: "*", schema: "public", table: "resort_activities" }, load)
                        .subscribe()
                const chPackages = supabase
                        .channel("resort_packages_changes")
                        .on("postgres_changes", { event: "*", schema: "public", table: "resort_packages" }, load)
                        .subscribe()
                const chExperiences = supabase
                        .channel("experiences_changes_for_resort")
                        .on("postgres_changes", { event: "*", schema: "public", table: "experiences" }, load)
                        .subscribe()

                return () => {
                        supabase.removeChannel(chGallery)
                        supabase.removeChannel(chActivities)
                        supabase.removeChannel(chPackages)
                        supabase.removeChannel(chExperiences)
                }
        }, [])

        const nextImage = () => {
                setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
        }

        const prevImage = () => {
                setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
        }

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Top Ribbon Banner - Only for Our Resort Page */}
                        <div className="bg-primary text-white py-3 sticky top-0 z-40 border-b border-primary-foreground/20">
                                <div className="container mx-auto px-4">
                                        <nav className="flex items-center justify-center space-x-8 text-sm font-medium">
                                                <a href="#our-resort" className="hover:text-luxury transition-colors">
                                                        Our Resort
                                                </a>
                                                <a href="#accommodation" className="hover:text-luxury transition-colors">
                                                        Accommodation
                                                </a>
                                                <a href="#packages" className="hover:text-luxury transition-colors">
                                                        Packages
                                                </a>
                                                <a href="#location" className="hover:text-luxury transition-colors">
                                                        Location
                                                </a>
                                                <Link href="/gallery" className="hover:text-luxury transition-colors">
                                                        Gallery
                                                </Link>
                                                <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-white text-white hover:bg-white hover:text-primary ml-4 bg-transparent"
                                                >
                                                        <MessageCircle className="w-4 h-4 mr-2" />
                                                        Enquire Now
                                                </Button>
                                                <a href="tel:9910775073" className="hover:text-luxury transition-colors ml-4 flex items-center">
                                                        <Phone className="w-4 h-4 mr-1" />
                                                        9910775073
                                                </a>
                                        </nav>
                                </div>
                        </div>

                        {/* Hero Section */}
                        <section id="our-resort" className="pt-32 pb-16 hero-gradient text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="container mx-auto px-4 relative z-10">
                                        <div className="max-w-4xl mx-auto text-center">
                                                <Badge className="mb-6 bg-white/20 text-white border-white/30 text-lg px-6 py-2">
                                                        <Mountain className="w-5 h-5 mr-2" />
                                                        Shanti Himalaya Resort
                                                </Badge>
                                                <h1 className="text-6xl md:text-7xl font-display font-bold mb-6">
                                                        Stay to
                                                        <span className="block text-luxury">Celebrate Life</span>
                                                </h1>
                                                <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
                                                        "Shanti Himalaya" Beyond Corbett - Where peace, spirituality, serenity and bounty of nature still exists.
                                                        Experience wilderness glamping in the lap of Mother Nature.
                                                </p>
                                                <div className="flex justify-center">
                                                        <Button
                                                                size="lg"
                                                                variant="outline"
                                                                className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 bg-transparent"
                                                        >
                                                                <MessageCircle className="w-5 h-5 mr-2" />
                                                                Enquire Now
                                                        </Button>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Accommodation Section */}
                        <section id="accommodation" className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        <Bed className="w-12 h-12 text-primary mx-auto mb-4" />
                                                        Accommodation
                                                </h2>
                                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                                        The exclusive four Glamps carry intriguing charm and comfort coupled with views of the pristine valley.
                                                        Spacious, comfortable, and cosy rooms with scenic valley views.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                                <div className="space-y-6">
                                                        <Card className="shadow-card">
                                                                <CardHeader>
                                                                        <CardTitle className="flex items-center text-xl">
                                                                                <TreePine className="w-6 h-6 text-primary mr-3" />
                                                                                Wilderness Glamps
                                                                        </CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <p className="text-muted-foreground">
                                                                                4 individual bedrooms complete with attached washrooms and modern amenities. Each room accommodates
                                                                                2 guests with provision for an extra adult & child.
                                                                        </p>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Wifi className="w-5 h-5 text-accent" />
                                                                                        <span className="text-sm">Free WiFi</span>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Car className="w-5 h-5 text-accent" />
                                                                                        <span className="text-sm">Parking</span>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Coffee className="w-5 h-5 text-accent" />
                                                                                        <span className="text-sm">Tea/Coffee</span>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Shield className="w-5 h-5 text-accent" />
                                                                                        <span className="text-sm">24/7 Security</span>
                                                                                </div>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                                {[1, 2, 3, 4, 5].map((star: number) => (
                                                                                        <Star key={star} className="w-4 h-4 fill-gold text-gold" />
                                                                                ))}
                                                                                <span className="text-sm text-muted-foreground ml-2">Luxury Experience</span>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                </div>

                                                <div className="relative">
                                                        <div className="h-80 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                                                <Camera className="w-20 h-20 text-white/30" />
                                                        </div>
                                                        <Badge className="absolute top-4 right-4 bg-gold text-white">Only 4 Glamps Available</Badge>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Dining Section */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
                                                        Dining Experience
                                                </h2>
                                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                                        The kitchen serves some of the best delicacies in the area. Locally produced ingredients add to the
                                                        flavour and nutrition. All packages include set menu breakfast, lunch and dinner.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <Card className="shadow-card hover-lift bg-white overflow-hidden">
                                                        <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                                                <Coffee className="w-16 h-16 text-white/30" />
                                                        </div>
                                                        <CardContent className="p-6 text-center">
                                                                <h3 className="text-xl font-semibold mb-3">Local Cuisine</h3>
                                                                <p className="text-muted-foreground text-sm">
                                                                        Experience authentic local flavors prepared with fresh, locally sourced ingredients from nearby
                                                                        village farms.
                                                                </p>
                                                        </CardContent>
                                                </Card>

                                                <Card className="shadow-card hover-lift bg-white overflow-hidden">
                                                        <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                                                                <Utensils className="w-16 h-16 text-white/30" />
                                                        </div>
                                                        <CardContent className="p-6 text-center">
                                                                <h3 className="text-xl font-semibold mb-3">Set Menu Meals</h3>
                                                                <p className="text-muted-foreground text-sm mb-4">
                                                                        All meals included - breakfast, lunch, and dinner prepared fresh daily with vegetarian and
                                                                        non-vegetarian options.
                                                                </p>
                                                                <Link href="/our-resort/set-menu-meals">
                                                                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                                                                View Menu Details
                                                                        </Button>
                                                                </Link>
                                                        </CardContent>
                                                </Card>

                                                <Card className="shadow-card hover-lift bg-white overflow-hidden">
                                                        <div className="h-48 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                                                <Mountain className="w-16 h-16 text-white/30" />
                                                        </div>
                                                        <CardContent className="p-6 text-center">
                                                                <h3 className="text-xl font-semibold mb-3">Special Tea</h3>
                                                                <p className="text-muted-foreground text-sm">
                                                                        Don't miss our signature milky Chai - a perfect companion while gazing at the breathtaking Himalayan
                                                                        views.
                                                                </p>
                                                        </CardContent>
                                                </Card>
                                        </div>
                                </div>
                        </section>

                        {/* Packages Section */}
                        <section id="packages" className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                                                        Curated Packages
                                                </h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Choose from our carefully curated packages designed to provide the perfect getaway experience.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {packagesDb.map((pkg: any) => (
                                                        <Card key={pkg.id} className="shadow-card hover-lift overflow-hidden relative">
                                                                <div className="absolute top-4 right-4">
                                                                        <Badge
                                                                                className={`${pkg.badge === "Festival Special" ? "bg-red-500" : pkg.badge === "Popular" ? "bg-green-500" : "bg-gold"} text-white`}
                                                                        >
                                                                                {pkg.badge}
                                                                        </Badge>
                                                                </div>
                                                                <div className="h-48 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                                                        <Camera className="w-16 h-16 text-white/30" />
                                                                </div>
                                                                <CardHeader>
                                                                        <CardTitle className="text-xl font-display">{pkg.name}</CardTitle>
                                                                        <div className="flex items-center space-x-2">
                                                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                                                <span className="text-sm text-muted-foreground">{pkg.duration}</span>
                                                                        </div>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>
                                                                        <div className="flex items-center space-x-3">
                                                                                <span className="text-3xl font-bold text-primary">{pkg.price}</span>
                                                                                <span className="text-lg text-muted-foreground line-through">{pkg.original_price}</span>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                                <h4 className="font-semibold text-sm">Package Includes:</h4>
                                                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                                                        {pkg.includes.map((item: string, index: number) => (
                                                                                                <li key={index} className="flex items-center space-x-2">
                                                                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                                                                        <span>{item}</span>
                                                                                                </li>
                                                                                        ))}
                                                                                </ul>
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-1">
                                                                                {pkg.features.map((feature: string, index: number) => (
                                                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                                                                {feature}
                                                                                        </Badge>
                                                                                ))}
                                                                        </div>
                                                                        <Button className="w-full mt-4 hero-gradient hover-glow">Book This Package</Button>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* Gallery Section */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
                                                        Gallery
                                                </h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Experience the beauty of Shanti Himalaya through our curated collection of images.
                                                </p>
                                        </div>

                                        <div className="relative max-w-4xl mx-auto">
                                                <div className="relative h-96 rounded-lg overflow-hidden shadow-card mb-8">
                                                        <div className="h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center relative group">
                                                                {galleryImages.length > 0 ? (
                                                                        <img
                                                                                src={galleryImages[currentImageIndex] || "/placeholder.svg"}
                                                                                alt={gallery[currentImageIndex]?.title || "Gallery image"}
                                                                                className="w-full h-full object-cover"
                                                                        />
                                                                ) : (
                                                                        <Camera className="w-20 h-20 text-white/30" />
                                                                )}
                                                                {galleryImages.length > 0 && (
                                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                                                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 max-w-sm text-center">
                                                                                        <h3 className="font-semibold text-foreground mb-2">
                                                                                                {gallery[currentImageIndex]?.title || "Resort Image"}
                                                                                        </h3>
                                                                                        {gallery[currentImageIndex]?.description && (
                                                                                                <p className="text-sm text-muted-foreground">{gallery[currentImageIndex]?.description}</p>
                                                                                        )}
                                                                                </div>
                                                                        </div>
                                                                )}
                                                        </div>
                                                        <button
                                                                onClick={prevImage}
                                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
                                                        >
                                                                <ChevronLeft className="w-6 h-6" />
                                                        </button>
                                                        <button
                                                                onClick={nextImage}
                                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
                                                        >
                                                                <ChevronRight className="w-6 h-6" />
                                                        </button>
                                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                                {galleryImages.map((_, index) => (
                                                                        <button
                                                                                key={index}
                                                                                onClick={() => setCurrentImageIndex(index)}
                                                                                className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                                                                                        }`}
                                                                        />
                                                                ))}
                                                        </div>
                                                </div>

                                                {/* Thumbnail Gallery */}
                                                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                                        {gallery.map((g, index) => (
                                                                <button
                                                                        key={g.id}
                                                                        onClick={() => {
                                                                                setSelectedThumbnail(index)
                                                                                setCurrentImageIndex(index % (galleryImages.length || 1))
                                                                        }}
                                                                        className={`relative h-16 rounded-lg overflow-hidden transition-all group ${selectedThumbnail === index ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"}`}
                                                                >
                                                                        <img
                                                                                src={g.image_url || "/placeholder.svg"}
                                                                                alt={g.title || `Gallery ${index + 1}`}
                                                                                className="w-full h-full object-cover"
                                                                        />
                                                                        {(g.title || g.description) && (
                                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-1">
                                                                                        <div className="bg-white/95 backdrop-blur-sm p-2 rounded transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-center">
                                                                                                {g.title && <h4 className="font-semibold text-xs text-foreground mb-1">{g.title}</h4>}
                                                                                                {g.description && (
                                                                                                        <p className="text-xs text-muted-foreground leading-tight">{g.description}</p>
                                                                                                )}
                                                                                        </div>
                                                                                </div>
                                                                        )}
                                                                </button>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Activities & Experiences Section */}
                        <section id="activities" className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        <TreePine className="w-12 h-12 text-primary mx-auto mb-4" />
                                                        Activities & Experiences
                                                </h2>
                                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                                        From guided treks to cultural experiences, discover the many ways to connect with nature and local
                                                        culture.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {activitiesDb.map((activity, index) => {
                                                        const Icon = iconMap[activity.icon] || Mountain
                                                        return (
                                                                <Card key={activity.id} className="shadow-card hover-lift bg-white overflow-hidden">
                                                                        <div className="h-48 bg-gradient-to-br from-primary to-accent flex items-center justify-center relative">
                                                                                <Icon className="w-16 h-16 text-white/30" />
                                                                        </div>
                                                                        <CardContent className="p-6">
                                                                                <div className="text-center mb-4">
                                                                                        <h3 className="text-lg font-semibold mb-3">{activity.title}</h3>
                                                                                        <p className="text-muted-foreground text-sm">{activity.description}</p>
                                                                                </div>
                                                                                {expandedActivity === index && (
                                                                                        <div className="mt-4 p-4 bg-muted rounded-lg">
                                                                                                <p className="text-sm text-foreground leading-relaxed">{activity.full_description}</p>
                                                                                        </div>
                                                                                )}
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="w-full mt-4 bg-transparent"
                                                                                        onClick={() => setExpandedActivity(expandedActivity === index ? null : index)}
                                                                                >
                                                                                        {expandedActivity === index ? (
                                                                                                <>
                                                                                                        Show Less <ChevronUp className="w-4 h-4 ml-2" />
                                                                                                </>
                                                                                        ) : (
                                                                                                <>
                                                                                                        Show More <ChevronDown className="w-4 h-4 ml-2" />
                                                                                                </>
                                                                                        )}
                                                                                </Button>
                                                                        </CardContent>
                                                                </Card>
                                                        )
                                                })}
                                        </div>

                                        {featuredExperiences.length > 0 && (
                                                <div className="mt-16">
                                                        <h3 className="text-2xl font-display font-bold mb-6 text-foreground text-center">Featured Experiences</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                {featuredExperiences.map((exp: any) => (
                                                                        <Card key={exp.id} className="shadow-card hover-lift bg-white">
                                                                                <div className="relative h-32 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                                                                        <Badge className="absolute top-2 left-2 bg-white/20 text-foreground border-white/30">
                                                                                                {exp.category}
                                                                                        </Badge>
                                                                                        <span className="absolute bottom-2 right-2 text-primary font-semibold text-sm">
                                                                                                {exp.price || "Contact"}
                                                                                        </span>
                                                                                        <Camera className="w-8 h-8 text-primary/30" />
                                                                                </div>
                                                                                <CardContent className="p-4">
                                                                                        <h4 className="font-display font-semibold text-sm mb-2">{exp.title}</h4>
                                                                                        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{exp.description}</p>
                                                                                        <Link href={`/experience/${exp.id}`}>
                                                                                                <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                                                                                                        View Details
                                                                                                </Button>
                                                                                        </Link>
                                                                                </CardContent>
                                                                        </Card>
                                                                ))}
                                                        </div>
                                                </div>
                                        )}
                                </div>
                        </section>

                        {/* Perfect Location for Adventure - Moved from Home */}
                        <section id="location" className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                                <div>
                                                        <div className="h-80 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-card flex items-center justify-center">
                                                                <Mountain className="w-20 h-20 text-white/30" />
                                                        </div>
                                                </div>

                                                <div className="space-y-6">
                                                        <h2 className="text-4xl font-display font-bold text-foreground">Perfect Location for Adventure</h2>
                                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                                                Strategically located beyond Corbett National Park in pristine Digolikhal Village, our resort provides
                                                                convenient access to wildlife experiences, trekking routes, and cultural sites while maintaining a
                                                                serene mountain retreat atmosphere. Experience the best of both wilderness adventure and luxury comfort.
                                                        </p>

                                                        <div className="space-y-4">
                                                                <div className="flex items-center space-x-3">
                                                                        <MapPin className="w-5 h-5 text-primary" />
                                                                        <span className="text-foreground">Located in pristine Digolikhal Village, Uttarakhand</span>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                        <Car className="w-5 h-5 text-primary" />
                                                                        <span className="text-foreground">280 km from Delhi - 6-7 hours scenic drive</span>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                        <TreePine className="w-5 h-5 text-primary" />
                                                                        <span className="text-foreground">Gateway to Corbett National Park and Himalayan foothills</span>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                        <Mountain className="w-5 h-5 text-primary" />
                                                                        <span className="text-foreground">
                                                                                Base for trekking to Gujrugarhi hilltop and Manila Devi temple
                                                                        </span>
                                                                </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                                                <div className="space-y-2">
                                                                        <h4 className="font-semibold text-foreground">Travel Options:</h4>
                                                                        <div className="space-y-1">
                                                                                <Badge variant="outline" className="block w-fit">
                                                                                        By Road - Most Convenient
                                                                                </Badge>
                                                                                <Badge variant="outline" className="block w-fit">
                                                                                        By Train + Road
                                                                                </Badge>
                                                                                <Badge variant="outline" className="block w-fit">
                                                                                        By Air + Road
                                                                                </Badge>
                                                                        </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <Link href="/our-resort/how-to-reach">
                                                                                <Button className="w-full bg-transparent" variant="outline">
                                                                                        View Detailed Directions
                                                                                </Button>
                                                                        </Link>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Enquire Section */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-2xl mx-auto text-center">
                                                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
                                                        Ready to Experience Shanti Himalaya?
                                                </h2>
                                                <p className="text-muted-foreground mb-8 leading-relaxed">
                                                        Contact us to book your perfect escape to the Himalayas. Our team is ready to help you plan an
                                                        unforgettable experience in the lap of nature.
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                        <Button size="lg" className="hero-gradient hover-glow" asChild>
                                                                <a href="tel:919910775073">
                                                                        <Phone className="w-5 h-5 mr-2" />
                                                                        Call Now: +91 99107 75073
                                                                </a>
                                                        </Button>
                                                        <Button size="lg" variant="outline">
                                                                <Mail className="w-5 h-5 mr-2" />
                                                                Email Enquiry
                                                        </Button>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <Footer />
                </div>
        )
}

export default OurResort
