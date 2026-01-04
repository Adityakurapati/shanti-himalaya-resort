"use client"

import Image from "next/image";
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
        Droplets,
        Eye,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client"

const OurResort = () => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0)
        const [selectedThumbnail, setSelectedThumbnail] = useState(0)
        const [expandedActivity, setExpandedActivity] = useState<number | null>(null)
        const [currentPackageIndex, setCurrentPackageIndex] = useState(0)
        const [currentActivityIndex, setCurrentActivityIndex] = useState(0)

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

        const nextPackage = () => {
                if (packagesDb.length <= 3) return
                setCurrentPackageIndex((prev) => (prev + 1) % packagesDb.length)
        }

        const prevPackage = () => {
                if (packagesDb.length <= 3) return
                setCurrentPackageIndex((prev) => (prev - 1 + packagesDb.length) % packagesDb.length)
        }

        const nextActivity = () => {
                if (activitiesDb.length <= 3) return
                setCurrentActivityIndex((prev) => (prev + 1) % activitiesDb.length)
        }

        const prevActivity = () => {
                if (activitiesDb.length <= 3) return
                setCurrentActivityIndex((prev) => (prev - 1 + activitiesDb.length) % activitiesDb.length)
        }

        // Get visible packages for carousel
        const getVisiblePackages = () => {
                if (packagesDb.length <= 3) return packagesDb

                const visible = []
                for (let i = 0; i < 3; i++) {
                        const index = (currentPackageIndex + i) % packagesDb.length
                        visible.push(packagesDb[index])
                }
                return visible
        }

        // Get visible activities for carousel
        const getVisibleActivities = () => {
                if (activitiesDb.length <= 3) return activitiesDb

                const visible = []
                for (let i = 0; i < 3; i++) {
                        const index = (currentActivityIndex + i) % activitiesDb.length
                        visible.push(activitiesDb[index])
                }
                return visible
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
                                        </div>
                                </div>
                        </section>
                        
                             {/* Accommodation Section */}

                        <section id="accommodation" className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground flex items-center justify-center gap-3">
                                                        <Bed className="w-10 h-10 text-primary" />
                                                        Accommodations: Premium Glamps at Shanti Himalaya
                                                </h2>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                                {/* Left Column: Description, Features, and Quote/Tariff */}
                                                <div className="space-y-6">
                                                        <Card className="shadow-card">
                                                                <CardHeader>
                                                                        <CardTitle className="flex items-center text-xl">
                                                                                <TreePine className="w-6 h-6 text-primary mr-3" />
                                                                                Premium Glamps with Valley View
                                                                        </CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="space-y-6">
                                                                        <p className="text-muted-foreground leading-relaxed">
                                                                                Each Glamp room is well appointed with a Large Bed having plush bedding while the room
                                                                                space is enough to accommodate 2~3 adults. Each Glamp room opens into a courtyard
                                                                                overlooking the majestic mountains.
                                                                        </p>

                                                                        <div className="space-y-4">
                                                                                <div className="flex items-start space-x-3">
                                                                                        <div className="mt-1">
                                                                                                <Droplets className="w-5 h-5 text-accent" />
                                                                                        </div>
                                                                                        <div>
                                                                                                <h4 className="font-semibold mb-1">Luxury Attached Bathroom</h4>
                                                                                                <p className="text-sm text-muted-foreground">
                                                                                                        All Glamp Rooms have attached bathroom that has running hot and cold water—a definite
                                                                                                        luxury in the offbeat location where the property is situated.
                                                                                                </p>
                                                                                        </div>
                                                                                </div>

                                                                                <div className="flex items-start space-x-3">
                                                                                        <div className="mt-1">
                                                                                                <Eye className="w-5 h-5 text-accent" />
                                                                                        </div>
                                                                                        <div>
                                                                                                <h4 className="font-semibold mb-1">Scenic Mountain Views</h4>
                                                                                                <p className="text-sm text-muted-foreground">
                                                                                                        Each room opens into a private courtyard overlooking the breathtaking Himalayan
                                                                                                        mountains, offering unparalleled tranquility.
                                                                                                </p>
                                                                                        </div>
                                                                                </div>

                                                                                <div className="flex items-start space-x-3">
                                                                                        <div className="mt-1">
                                                                                                <Coffee className="w-5 h-5 text-accent" />
                                                                                        </div>
                                                                                        <div>
                                                                                                <h4 className="font-semibold mb-1">In-room Amenities</h4>
                                                                                                <p className="text-sm text-muted-foreground">
                                                                                                        Each Glamp room is furnished with an open almirah, Coffee table with chairs for
                                                                                                        your comfort and convenience.
                                                                                                </p>
                                                                                        </div>
                                                                                </div>
                                                                        </div>

                                                                        {/* Star Rating and Quote Section */}
                                                                        <div className="pt-6 border-t">
                                                                                <div className="flex items-center space-x-1 mb-3">
                                                                                        {[1, 2, 3, 4, 5].map((star: number) => (
                                                                                                <Star key={star} className="w-5 h-5 fill-gold text-gold" />
                                                                                        ))}
                                                                                        <span className="text-sm text-muted-foreground ml-2 font-medium">Premium Luxury Experience</span>
                                                                                </div>
                                                                                <div className="bg-luxury/10 p-4 rounded-lg border border-luxury/20">
                                                                                        <p className="text-sm text-muted-foreground italic text-center">
                                                                                                "Book your stay to embrace tranquillity, adventure, and the luxury of personal attention under the stars."
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>

                                                        {/* Tariff Button - Left Column */}
                                                        <Button size="lg" variant="outline" className="w-full" asChild>
                                                                <Link href="/our-resort/accommodations">
                                                                        View Complete Tariff & Terms
                                                                        <ChevronRight className="w-4 h-4 ml-2" />
                                                                </Link>
                                                        </Button>
                                                </div>

                                                {/* Right Column: Image and Amenities Grid */}
                                                <div className="space-y-6">
                                                        {/* Image Section */}
                                                        <div className="relative">
                                                                <div className="h-96 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-card overflow-hidden flex items-center justify-center">
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                                                        <div className="relative z-10 text-center p-8">
                                                                                <Mountain className="w-24 h-24 text-white/40 mx-auto mb-6" />
                                                                                <h3 className="text-2xl font-display font-bold text-white mb-4">Nature's Embrace Awaits</h3>
                                                                                <p className="text-white/90 max-w-md mx-auto mb-6">
                                                                                        Experience wilderness glamping in the lap of Mother Nature.
                                                                                        Beyond Corbett - Where peace, spirituality, serenity and bounty of nature still exists.
                                                                                </p>
                                                                                <Button
                                                                                        variant="outline"
                                                                                        className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
                                                                                        asChild
                                                                                >
                                                                                        <Link href="/our-resort/accommodations">
                                                                                                View All Details
                                                                                        </Link>
                                                                                </Button>
                                                                        </div>
                                                                </div>
                                                                <Badge className="absolute top-6 right-6 bg-gold text-white text-sm px-4 py-2 shadow-lg">
                                                                        Only 4 Exclusive Glamps
                                                                </Badge>
                                                                <div className="absolute bottom-6 left-6">
                                                                        <Badge variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                                                                                <MapPin className="w-3 h-3 mr-2" />
                                                                                Himalayan Valley View
                                                                        </Badge>
                                                                </div>
                                                        </div>

                                                        {/* Amenities Grid Section */}
                                                        <Card className="shadow-card">
                                                                <CardContent className="p-6">
                                                                        <h3 className="text-lg font-semibold mb-4">Glamp Details</h3>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Users className="w-5 h-5 text-accent" />
                                                                                        <div>
                                                                                                <span className="text-sm font-medium block">Capacity</span>
                                                                                                <span className="text-xs text-muted-foreground">2-3 Adults</span>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Bed className="w-5 h-5 text-accent" />
                                                                                        <div>
                                                                                                <span className="text-sm font-medium block">Bed Type</span>
                                                                                                <span className="text-xs text-muted-foreground">Large Plush Bed</span>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Wifi className="w-5 h-5 text-accent" />
                                                                                        <div>
                                                                                                <span className="text-sm font-medium block">Connectivity</span>
                                                                                                <span className="text-xs text-muted-foreground">Free WiFi</span>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Shield className="w-5 h-5 text-accent" />
                                                                                        <div>
                                                                                                <span className="text-sm font-medium block">Security</span>
                                                                                                <span className="text-xs text-muted-foreground">24/7 Security</span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
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
                                                <Card className="shadow-card hover-lift bg-white overflow-hidden group">
                                                        <div className="h-48 relative overflow-hidden">
                                                                <Image
                                                                        src="/dining-experience1.jpg"
                                                                        alt="Local Cuisine"
                                                                        fill
                                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                                <div className="absolute top-4 left-4">
                                                                        <Badge className="bg-white/90 backdrop-blur-sm text-foreground border-white/30">
                                                                                Local Flavors
                                                                        </Badge>
                                                                </div>
                                                        </div>
                                                        <CardContent className="p-6 text-center">
                                                                <h3 className="text-xl font-semibold mb-3">Local Cuisine</h3>
                                                                <p className="text-muted-foreground text-sm">
                                                                        Experience authentic local flavors prepared with fresh, locally sourced ingredients from nearby
                                                                        village farms.
                                                                </p>
                                                        </CardContent>
                                                </Card>

                                                <Card className="shadow-card hover-lift bg-white overflow-hidden group">
                                                        <div className="h-48 relative overflow-hidden">
                                                                <Image
                                                                        src="/dining-experience2.jpg"
                                                                        alt="Set Menu Meals"
                                                                        fill
                                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                                <div className="absolute top-4 left-4">
                                                                        <Badge className="bg-white/90 backdrop-blur-sm text-foreground border-white/30">
                                                                                Daily Specials
                                                                        </Badge>
                                                                </div>
                                                        </div>
                                                        <CardContent className="p-6 text-center">
                                                                <h3 className="text-xl font-semibold mb-3">Menu Meals</h3>
                                                                <p className="text-muted-foreground text-sm mb-4">
                                                                        All meals included - breakfast, lunch, and dinner prepared fresh daily with vegetarian and
                                                                        non-vegetarian options.
                                                                </p>
                                                                <Link href="/our-resort/menu-meals">
                                                                        <Button variant="outline" size="sm" className="mt-2 bg-transparent group-hover:bg-primary/10">
                                                                                View Menu Details
                                                                        </Button>
                                                                </Link>
                                                        </CardContent>
                                                </Card>

                                                <Card className="shadow-card hover-lift bg-white overflow-hidden group">
                                                        <div className="h-48 relative overflow-hidden">
                                                                <Image
                                                                        src="/dining-experience3.jpg"
                                                                        alt="Special Tea"
                                                                        fill
                                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                                <div className="absolute top-4 left-4">
                                                                        <Badge className="bg-white/90 backdrop-blur-sm text-foreground border-white/30">
                                                                                Signature Drink
                                                                        </Badge>
                                                                </div>
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

                        {/* Packages Section with Carousel */}
                        <section id="packages" className="py-24 bg-background">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                        <div className="text-center mb-12">
                                                <div className="flex items-center justify-center space-x-4 mb-4">
                                                        <Calendar className="w-10 h-10 text-primary" />
                                                        <h2 className="text-3xl font-display font-bold text-foreground">
                                                                Curated Packages
                                                        </h2>
                                                </div>
                                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                                        Choose from our specially designed packages for an unforgettable stay
                                                </p>
                                        </div>

                                        <div className="relative">
                                                {/* Carousel Navigation for More than 3 Packages */}
                                                {packagesDb.length > 3 && (
                                                        <>
                                                                <button
                                                                        onClick={prevPackage}
                                                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                                                >
                                                                        <ChevronLeft className="w-6 h-6" />
                                                                </button>
                                                                <button
                                                                        onClick={nextPackage}
                                                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                                                >
                                                                        <ChevronRight className="w-6 h-6" />
                                                                </button>
                                                        </>
                                                )}

                                                {/* Packages Grid/Carousel */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {getVisiblePackages().map((pkg: any) => (
                                                                <Card key={pkg.id} className="shadow-card hover:shadow-xl transition-shadow duration-300 overflow-hidden relative flex flex-col h-full">
                                                                        <div className="absolute top-3 right-3 z-10">
                                                                                <Badge
                                                                                        className={`${pkg.badge === "Festival Special" ? "bg-red-500" : pkg.badge === "Popular" ? "bg-green-500" : "bg-gold"} text-white text-xs px-2 py-1`}
                                                                                >
                                                                                        {pkg.badge}
                                                                                </Badge>
                                                                        </div>
                                                                        <div className="h-40 relative">
                                                                                {/* Show package image if available */}
                                                                                {pkg.image_url ? (
                                                                                        <img
                                                                                                src={pkg.image_url}
                                                                                                alt={pkg.name}
                                                                                                className="w-full h-full object-cover"
                                                                                        />
                                                                                ) : (
                                                                                        <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                                                                                <Camera className="w-12 h-12 text-white/30" />
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                        <div className="p-5 flex-grow flex flex-col">
                                                                                <div className="mb-3 flex items-start justify-between">
                                                                                        <div>
                                                                                                <h3 className="text-lg font-semibold text-foreground mb-1">{pkg.name}</h3>
                                                                                                <div className="flex items-center text-sm text-muted-foreground">
                                                                                                        <Calendar className="w-3 h-3 mr-1" />
                                                                                                        <span>{pkg.duration}</span>
                                                                                                </div>
                                                                                        </div>
                                                                                        <div className="text-right">
                                                                                                <div className="text-2xl font-bold text-primary">{pkg.price}</div>
                                                                                                {pkg.original_price && pkg.original_price !== pkg.price && (
                                                                                                        <div className="text-sm text-muted-foreground line-through">{pkg.original_price}</div>
                                                                                                )}
                                                                                        </div>
                                                                                </div>

                                                                                <div className="mb-4">
                                                                                        <div className="mb-3">
                                                                                                <h4 className="font-semibold text-sm mb-2">Highlights:</h4>
                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                        {pkg.features.slice(0, 2).map((feature: any, index: number) => (
                                                                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                                                                        {feature}
                                                                                                                </Badge>
                                                                                                        ))}
                                                                                                        {pkg.features.length > 2 && (
                                                                                                                <Badge variant="outline" className="text-xs">
                                                                                                                        +{pkg.features.length - 2} more
                                                                                                                </Badge>
                                                                                                        )}
                                                                                                </div>
                                                                                        </div>
                                                                                </div>

                                                                                <div className="mt-auto space-y-3">
                                                                                        <Link href={`/our-resort/packages/${pkg.id}`} className="block">
                                                                                                <Button variant="outline" size="sm" className="w-full">
                                                                                                        View Details
                                                                                                </Button>
                                                                                        </Link>
                                                                                </div>
                                                                        </div>
                                                                </Card>
                                                        ))}
                                                </div>

                                                {/* Carousel Dots for More than 3 Packages */}
                                                {packagesDb.length > 3 && (
                                                        <div className="flex justify-center mt-8 space-x-2">
                                                                {Array.from({ length: packagesDb.length }).map((_, index) => (
                                                                        <button
                                                                                key={index}
                                                                                onClick={() => setCurrentPackageIndex(index)}
                                                                                className={`w-3 h-3 rounded-full transition-all ${index === currentPackageIndex ? "bg-primary" : "bg-primary/30"}`}
                                                                        />
                                                                ))}
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        </section>

                        {/* Gallery Section */}
                        <section id="gallery" className="py-24 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground flex items-center justify-center gap-3">
                                                        <Camera className="w-10 h-10 text-primary" />
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
                                                                {galleryImages.map((_: string, index: number) => (
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
                                                        {gallery.map((g: any, index: number) => (
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

                        {/* Activities Section with Carousel */}
                        <section id="activities" className="py-24 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground flex items-center justify-center gap-4">
                                                        <TreePine className="w-10 h-10 text-primary" />
                                                        Activities & Experiences
                                                </h2>
                                        </div>

                                        <div className="relative">
                                                {/* Carousel Navigation for More than 3 Activities */}
                                                {activitiesDb.length > 3 && (
                                                        <>
                                                                <button
                                                                        onClick={prevActivity}
                                                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                                                >
                                                                        <ChevronLeft className="w-6 h-6" />
                                                                </button>
                                                                <button
                                                                        onClick={nextActivity}
                                                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                                                >
                                                                        <ChevronRight className="w-6 h-6" />
                                                                </button>
                                                        </>
                                                )}

                                                {/* Activities Grid/Carousel */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                        {getVisibleActivities().map((activity: any) => {
                                                                const Icon = iconMap[activity.icon] || Mountain
                                                                return (
                                                                        <Link key={activity.id} href={`/our-resort/activities/${activity.id}`}>
                                                                                <Card className="shadow-card hover-lift bg-white overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
                                                                                        <div className="h-48 relative">
                                                                                                {/* Show activity image if available */}
                                                                                                {activity.image_url ? (
                                                                                                        <img
                                                                                                                src={activity.image_url}
                                                                                                                alt={activity.title}
                                                                                                                className="w-full h-full object-cover"
                                                                                                        />
                                                                                                ) : (
                                                                                                        <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                                                                                                <Icon className="w-16 h-16 text-white/30" />
                                                                                                        </div>
                                                                                                )}
                                                                                        </div>
                                                                                        <CardContent className="p-6">
                                                                                                <div className="text-center mb-4">
                                                                                                        <div className="flex items-center justify-center mb-3">
                                                                                                                <Icon className="w-6 h-6 text-primary mr-2" />
                                                                                                                <h3 className="text-lg font-semibold">{activity.title}</h3>
                                                                                                        </div>
                                                                                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                                                                                                {activity.description}
                                                                                                        </p>
                                                                                                </div>
                                                                                                <div className="flex justify-between items-center">
                                                                                                        <span className="text-sm text-primary font-medium">View Details</span>
                                                                                                        <span className="text-xs text-muted-foreground">Click to explore</span>
                                                                                                </div>
                                                                                        </CardContent>
                                                                                </Card>
                                                                        </Link>
                                                                )
                                                        })}
                                                </div>

                                                {/* Carousel Dots for More than 3 Activities */}
                                                {activitiesDb.length > 3 && (
                                                        <div className="flex justify-center mt-8 space-x-2">
                                                                {Array.from({ length: activitiesDb.length }).map((_, index) => (
                                                                        <button
                                                                                key={index}
                                                                                onClick={() => setCurrentActivityIndex(index)}
                                                                                className={`w-3 h-3 rounded-full transition-all ${index === currentActivityIndex ? "bg-primary" : "bg-primary/30"}`}
                                                                        />
                                                                ))}
                                                        </div>
                                                )}
                                        </div>

                                        {/* View All Activities Link */}
                                        <div className="text-center mt-12">
                                                <Link href="/our-resort/activities">
                                                        <Button variant="outline" size="lg">
                                                                View All Activities
                                                        </Button>
                                                </Link>
                                        </div>
                                </div>
                        </section>

                        {/* Perfect Location for Adventure */}
                        <section id="location" className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                {/* ROW 1 — LEFT : Image */}
                                                <div className="relative h-80 rounded-2xl overflow-hidden shadow-card group">
                                                        <Image
                                                                src="/location.png"
                                                                alt="Resort Location"
                                                                fill
                                                                priority
                                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20" />
                                                </div>

                                                {/* ROW 1 — RIGHT : Location Content */}
                                                <div className="space-y-6">
                                                        <h2 className="text-4xl font-display font-bold text-foreground">
                                                                Perfect Location for Adventure
                                                        </h2>

                                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                                                Strategically located beyond Corbett National Park in pristine Digolikhal Village,
                                                                our resort offers easy access to wildlife safaris, trekking routes, and cultural
                                                                landmarks while maintaining a serene mountain retreat atmosphere.
                                                        </p>

                                                        <div className="space-y-1">
                                                                <div className="flex items-center gap-3">
                                                                        <MapPin className="w-5 h-5 text-primary" />
                                                                        <span>Located in Digolikhal Village, Uttarakhand</span>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                        <Car className="w-5 h-5 text-primary" />
                                                                        <span>280 km from Delhi · 6–7 hours scenic drive</span>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                        <TreePine className="w-5 h-5 text-primary" />
                                                                        <span>Gateway to Corbett National Park & Himalayan foothills</span>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                        <Mountain className="w-5 h-5 text-primary" />
                                                                        <span>Base for trekking to Gujrugarhi Hilltop & Manila Devi Temple</span>
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* ROW 2 — LEFT : Travel Options */}
                                                <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
                                                        <h4 className="text-xl font-semibold text-foreground">
                                                                Travel Options
                                                        </h4>

                                                        <div className="flex flex-wrap gap-3">
                                                                <Badge variant="outline">By Road – Most Convenient</Badge>
                                                                <Badge variant="outline">By Train + Road</Badge>
                                                                <Badge variant="outline">By Air + Road</Badge>
                                                        </div>
                                                </div>

                                                {/* ROW 2 — RIGHT : Button */}
                                                <div className="flex items-center justify-start lg:justify-start">
                                                        <Link href="/our-resort/how-to-reach">
                                                                <Button
                                                                        variant="outline"
                                                                        className="w-full lg:w-auto px-8 py-6 text-base"
                                                                >
                                                                        View Detailed Directions
                                                                </Button>
                                                        </Link>
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
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <Footer />
                </div>
        )
}

export default OurResort