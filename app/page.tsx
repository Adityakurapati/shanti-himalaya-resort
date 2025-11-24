"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Image from "next/image";
import {
        Mountain,
        TreePine,
        Sparkles,
        MapPin,
        Users,
        Heart,
        Shield,
        Camera,
        ChevronLeft,
        ChevronRight,
} from "lucide-react"
import Link from "next/link";
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import activitiesImage from "@/assets/activities.jpg"

const Index = () => {
        const [currentHeroImage, setCurrentHeroImage] = useState(0)
        const [experientialPackages, setExperientialPackages] = useState<
                Array<{ id: string; name: string; duration: string; price: string; description: string; badge: string }>
        >([])

        const himalayanImages = [
                "/api/placeholder/1920/800", // Mountain peaks
                "/api/placeholder/1920/800", // Valley view
                "/api/placeholder/1920/800", // Sunrise over mountains
                "/api/placeholder/1920/800", // Forest and peaks
                "/api/placeholder/1920/800", // Traditional villages
        ]

        const nextHeroImage = () => {
                setCurrentHeroImage((prev) => (prev + 1) % himalayanImages.length)
        }

        const prevHeroImage = () => {
                setCurrentHeroImage((prev) => (prev - 1 + himalayanImages.length) % himalayanImages.length)
        }

        useEffect(() => {
                let isMounted = true
                const load = async () => {
                        const { data, error } = await supabase
                                .from("resort_packages")
                                .select("id,name,duration,price,description,badge")
                                .order("created_at", { ascending: false })
                                .limit(3)
                        if (!error && isMounted) setExperientialPackages(data || [])
                }
                load()

                const ch = supabase
                        .channel("resort_packages_home_changes")
                        .on("postgres_changes", { event: "*", schema: "public", table: "resort_packages" }, load)
                        .subscribe()

                return () => {
                        isMounted = false
                        supabase.removeChannel(ch)
                }
        }, [])

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Hero Section with Scrolling Himalayan Images */}
                        <section className="relative h-screen flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0">
                                        <div className="h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center relative">
                                                <Mountain className="w-32 h-32 text-white/10" />

                                                {/* Navigation Controls */}
                                                <button
                                                        onClick={prevHeroImage}
                                                        className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
                                                >
                                                        <ChevronLeft className="w-6 h-6" />
                                                </button>

                                                <button
                                                        onClick={nextHeroImage}
                                                        className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
                                                >
                                                        <ChevronRight className="w-6 h-6" />
                                                </button>

                                                {/* Image indicators */}
                                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                        {himalayanImages.map((_: string, index: number) => (
                                                                <button
                                                                        key={index}
                                                                        onClick={() => setCurrentHeroImage(index)}
                                                                        className={`w-3 h-3 rounded-full transition-all ${index === currentHeroImage ? "bg-white" : "bg-white/50"
                                                                                }`}
                                                                />
                                                        ))}
                                                </div>
                                        </div>
                                        <div className="absolute inset-0 hero-gradient opacity-70" />
                                </div>

                                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                                        <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                                                Luxury Himalayan Resort & Spa
                                        </Badge>
                                        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                                                Welcome to
                                                <span className="block text-luxury">Shanti Himalaya</span>
                                        </h1>
                                        <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
                                                Experience tranquility and luxury in the heart of the majestic Himalayas. Where serenity meets adventure.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Link href="/our-resort">
                                                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover-glow text-lg px-8">
                                                                Explore Resort
                                                        </Button>
                                                </Link>
                                                <Link href="/journeys">
                                                        <Button
                                                                size="lg"
                                                                variant="outline"
                                                                className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 bg-transparent"
                                                        >
                                                                Explore Tours
                                                        </Button>
                                                </Link>
                                        </div>
                                </div>

                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                                        <div className="animate-bounce">
                                                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                                                        <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Our Resort Section */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Shanti Himalaya Resort</h2>
                                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                                        "Shanti Himalaya" Beyond Corbett - Where peace, spirituality, serenity and bounty of nature still exists.
                                                        Experience wilderness glamping in the lap of Mother Nature.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                                <div className="space-y-6">
                                                        <div>
                                                                <h3 className="text-2xl font-display font-semibold mb-6">Luxury Wilderness Experience</h3>
                                                                <div className="space-y-4">
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">
                                                                                        4 exclusive glamping tents with panoramic mountain views
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">All meals included with locally sourced ingredients</span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">Guided nature walks and adventure activities</span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">Cultural experiences and bonfire evenings</span>
                                                                        </div>
                                                                </div>
                                                                <Link href="/our-resort">
                                                                        <Button className="mt-8 hero-gradient hover-glow">Discover Our Resort</Button>
                                                                </Link>
                                                        </div>
                                                </div>

                                                <div className="relative">
                                                        <div className="h-96 bg-gradient-to-br from-primary via-accent to-gold rounded-2xl shadow-card overflow-hidden">
                                                                <div className="h-full flex items-center justify-center">
                                                                        <div className="text-center text-white">
                                                                                <Mountain className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                                                                <p className="text-lg font-semibold">Resort Gallery</p>
                                                                                <p className="text-sm opacity-80">Himalayan Luxury</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        {/* Resort Controls */}
                                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                                {[...Array(4)].map((_: string, index: number) => (
                                                                        <div
                                                                                key={index}
                                                                                className={`w-3 h-3 rounded-full transition-all ${index === 0 ? "bg-white" : "bg-white/50"}`}
                                                                        />
                                                                ))}
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Epic Journeys Section */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Epic Journeys</h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Discover curated adventures across the majestic Himalayas with scrolling visuals and immersive experiences
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                                {/* Scrolling Journey Images */}
                                                <div className="relative">
                                                        <div className="h-96 bg-gradient-to-br from-primary via-accent to-gold rounded-2xl shadow-card overflow-hidden">
                                                                <div className="h-full flex items-center justify-center">
                                                                        <div className="text-center text-white">
                                                                                <Mountain className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                                                                <p className="text-lg font-semibold">Epic Journey Gallery</p>
                                                                                <p className="text-sm opacity-80">Himalayan Adventures</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        {/* Journey Controls */}
                                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                                {[...Array(5)].map((_: string, index: number) => (
                                                                        <div
                                                                                key={index}
                                                                                className={`w-3 h-3 rounded-full transition-all ${index === 0 ? "bg-white" : "bg-white/50"}`}
                                                                        />
                                                                ))}
                                                        </div>
                                                </div>

                                                {/* Journey Details */}
                                                <div className="space-y-8">
                                                        <div>
                                                                <h3 className="text-2xl font-display font-semibold mb-6">Discover Legendary Treks</h3>
                                                                <div className="space-y-4">
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">
                                                                                        Everest Base Camp - The ultimate high-altitude adventure
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">Annapurna Circuit - Classic Himalayan circuit trek</span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">Manaslu Circuit - Remote wilderness expedition</span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">Cultural journeys through ancient mountain villages</span>
                                                                        </div>
                                                                </div>
                                                                <Link href="/journeys">
                                                                        <Button className="mt-8 hero-gradient hover-glow">Explore All Journeys</Button>
                                                                </Link>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Blog Section */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Latest from Our Blog</h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Stay updated with travel insights, mountain stories, and adventure guides
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                {[
                                                        {
                                                                title: "Best Time to Visit the Himalayas",
                                                                excerpt:
                                                                        "Discover the perfect seasons for your mountain adventure and what to expect during each period.",
                                                                date: "December 15, 2024",
                                                                category: "Travel Guide",
                                                                readTime: "5 min read",
                                                        },
                                                        {
                                                                title: "Essential Trekking Gear for High Altitude",
                                                                excerpt: "Complete checklist of equipment you'll need for safe and comfortable high-altitude trekking.",
                                                                date: "December 12, 2024",
                                                                category: "Adventure",
                                                                readTime: "8 min read",
                                                        },
                                                        {
                                                                title: "Cultural Etiquette in Mountain Villages",
                                                                excerpt:
                                                                        "Learn about local customs and traditions to ensure respectful interactions with mountain communities.",
                                                                date: "December 10, 2024",
                                                                category: "Culture",
                                                                readTime: "6 min read",
                                                        },
                                                ].map((post: any, index: number) => (
                                                        <Link key={index} href={`/blog/${index + 1}`} className="group">
                                                                <Card className="shadow-card hover-lift overflow-hidden">
                                                                        <div className="h-48 bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                                                                                <Camera className="w-16 h-16 text-white/30 group-hover:scale-110 transition-transform" />
                                                                        </div>
                                                                        <CardContent className="p-6">
                                                                                <Badge className="mb-3 bg-background text-foreground border">{post.category}</Badge>
                                                                                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                                                                                        {post.title}
                                                                                </h3>
                                                                                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{post.excerpt}</p>
                                                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                                        <span>{post.date}</span>
                                                                                        <span>{post.readTime}</span>
                                                                                </div>
                                                                        </CardContent>
                                                                </Card>
                                                        </Link>
                                                ))}
                                        </div>

                                        <div className="text-center mt-12">
                                                <Link href="/blog">
                                                        <Button size="lg" variant="outline" className="px-8 bg-transparent">
                                                                Read All Posts
                                                        </Button>
                                                </Link>
                                        </div>
                                </div>
                        </section>

                        {/* Amazing Destinations Section */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Amazing Destinations</h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Explore breathtaking destinations with immersive visuals and detailed experiences
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                                {/* Destination Details */}
                                                <div className="space-y-8">
                                                        <div>
                                                                <h3 className="text-2xl font-display font-semibold mb-6">Iconic Mountain Destinations</h3>
                                                                <div className="space-y-4">
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">
                                                                                        Ladakh - High altitude desert landscapes and pristine lakes
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">
                                                                                        Kashmir Valley - Paradise on earth with Dal Lake and gardens
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">
                                                                                        Corbett National Park - Wildlife sanctuary and tiger reserve
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">Everest and Annapurna regions - World's highest peaks</span>
                                                                        </div>
                                                                </div>
                                                                <Link href="/destinations">
                                                                        <Button className="mt-8 hero-gradient hover-glow">Discover All Destinations</Button>
                                                                </Link>
                                                        </div>
                                                </div>

                                                {/* Scrolling Destination Images */}
                                                <div className="relative">
                                                        <div className="h-96 bg-gradient-to-br from-accent via-primary to-gold rounded-2xl shadow-card overflow-hidden">
                                                                <div className="h-full flex items-center justify-center">
                                                                        <div className="text-center text-white">
                                                                                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                                                                <p className="text-lg font-semibold">Destination Gallery</p>
                                                                                <p className="text-sm opacity-80">Breathtaking Locations</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        {/* Destination Controls */}
                                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                                {[...Array(4)].map((_: string, index: number) => (
                                                                        <div
                                                                                key={index}
                                                                                className={`w-3 h-3 rounded-full transition-all ${index === 1 ? "bg-white" : "bg-white/50"}`}
                                                                        />
                                                                ))}
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Experiential Stays Section */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Experiential Stays</h2>
                                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                                        Immerse yourself in authentic Himalayan experiences through our carefully curated stays. From luxury
                                                        eco-lodges to traditional mountain retreats, each accommodation offers unique cultural immersion and
                                                        unforgettable memories.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                                {experientialPackages.map((pkg: any) => (
                                                        <Card key={pkg.id} className="shadow-card hover-lift overflow-hidden">
                                                                <div className="h-40 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                                                        <Camera className="w-12 h-12 text-white/30" />
                                                                </div>
                                                                <CardContent className="p-6">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                                <h3 className="text-xl font-semibold">{pkg.name}</h3>
                                                                                <Badge className="bg-gold text-white">{pkg.badge}</Badge>
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground mb-2">{pkg.duration}</div>
                                                                        <p className="text-sm text-muted-foreground line-clamp-3">{pkg.description}</p>
                                                                        <div className="flex items-center justify-between mt-4">
                                                                                <span className="text-primary font-bold text-lg">{pkg.price}</span>
                                                                                <Link href="/our-resort#packages">
                                                                                        <Button size="sm" variant="outline" className="bg-transparent">
                                                                                                View Package
                                                                                        </Button>
                                                                                </Link>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                                {experientialPackages.length === 0 && (
                                                        <div className="col-span-1 lg:col-span-3 text-center text-muted-foreground">
                                                                Packages coming soon. Please check back later.
                                                        </div>
                                                )}
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                                {/* Destination Details */}
                                                <div className="space-y-8">
                                                        <div>
                                                                <h3 className="text-2xl font-display font-semibold mb-6">Authentic Himalayan Experiences</h3>
                                                                <div className="space-y-4">
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">Luxury eco-lodges with panoramic mountain views</span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">Traditional homestays with local families</span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">Wellness retreats in serene natural settings</span>
                                                                        </div>
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                                                <span className="text-muted-foreground">Adventure base camps for trekking and exploration</span>
                                                                        </div>
                                                                </div>
                                                                <Link href="/our-resort">
                                                                        <Button className="mt-8 hero-gradient hover-glow">Explore our experiential accommodations</Button>
                                                                </Link>
                                                        </div>
                                                </div>

                                                {/* Image Carousel */}
                                                <div className="relative">
                                                        <div className="h-96 bg-gradient-to-br from-primary via-accent to-gold rounded-2xl shadow-card overflow-hidden">
                                                                <div className="h-full flex items-center justify-center">
                                                                        <div className="text-center text-white">
                                                                                <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                                                                <p className="text-lg font-semibold">Experience Gallery</p>
                                                                                <p className="text-sm opacity-80">Authentic Himalayan Stays</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        {/* Carousel Controls */}
                                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                                {[...Array(5)].map((_: string, index: number) => (
                                                                        <div
                                                                                key={index}
                                                                                className={`w-3 h-3 rounded-full transition-all ${index === 0 ? "bg-white" : "bg-white/50"}`}
                                                                        />
                                                                ))}
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Unique Experiences Section */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Unique Experiences</h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Immerse yourself in transformative experiences with scrolling visuals and cultural authenticity
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                                {/* Scrolling Experience Images */}
                                                <div className="relative">
                                                        <div className="h-96 bg-gradient-to-br from-gold via-primary to-accent rounded-2xl shadow-card overflow-hidden">
                                                                <div className="h-full flex items-center justify-center">
                                                                        <div className="text-center text-white">
                                                                                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                                                                <p className="text-lg font-semibold">Experience Gallery</p>
                                                                                <p className="text-sm opacity-80">Unique Adventures</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        {/* Experience Controls */}
                                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                                {[...Array(3)].map((_: string, index: number) => (
                                                                        <div
                                                                                key={index}
                                                                                className={`w-3 h-3 rounded-full transition-all ${index === 2 ? "bg-white" : "bg-white/50"}`}
                                                                        />
                                                                ))}
                                                        </div>
                                                </div>

                                                {/* Experience Details with Icons Only */}
                                                <div className="space-y-8">
                                                        <div>
                                                                <h3 className="text-2xl font-display font-semibold mb-6">Transformative Experiences</h3>
                                                                <div className="grid grid-cols-1 gap-6">
                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                                                                                        <Heart className="w-6 h-6 text-white" />
                                                                                </div>
                                                                                <div>
                                                                                        <h4 className="font-semibold mb-1">Himalayan Yoga Retreat</h4>
                                                                                        <p className="text-muted-foreground text-sm">
                                                                                                7-day wellness journey with daily meditation and mountain views
                                                                                        </p>
                                                                                </div>
                                                                        </div>

                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-12 h-12 bg-gradient-to-br from-accent to-gold rounded-xl flex items-center justify-center flex-shrink-0">
                                                                                        <Users className="w-6 h-6 text-white" />
                                                                                </div>
                                                                                <div>
                                                                                        <h4 className="font-semibold mb-1">Village Cultural Immersion</h4>
                                                                                        <p className="text-muted-foreground text-sm">
                                                                                                Authentic homestay experience with traditional crafts and local cuisine
                                                                                        </p>
                                                                                </div>
                                                                        </div>

                                                                        <div className="flex items-start space-x-4">
                                                                                <div className="w-12 h-12 bg-gradient-to-br from-gold to-primary rounded-xl flex items-center justify-center flex-shrink-0">
                                                                                        <Camera className="w-6 h-6 text-white" />
                                                                                </div>
                                                                                <div>
                                                                                        <h4 className="font-semibold mb-1">Wildlife Photography Safari</h4>
                                                                                        <p className="text-muted-foreground text-sm">
                                                                                                Expert-guided photography tours for capturing Himalayan wildlife
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                <Link href="/experiences">
                                                                        <Button className="mt-8 hero-gradient hover-glow">Discover All Experiences</Button>
                                                                </Link>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Our Story Section */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                                <div>
                                                        <Image
                                                                src={activitiesImage}
                                                                alt="Our story - Mountain heritage and hospitality"
                                                                className="rounded-2xl shadow-card hover-lift"
                                                                width={800}
                                                                height={600}
                                                        />
                                                </div>

                                                <div className="space-y-6">
                                                        <h2 className="text-4xl font-display font-bold text-foreground">Our Story</h2>
                                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                                                Born from a deep love for the Himalayas and a commitment to sustainable tourism, Shanti Himalaya Resort
                                                                represents more than just luxury accommodation. We are stewards of mountain culture, protectors of
                                                                pristine wilderness, and facilitators of transformative experiences.
                                                        </p>

                                                        <div className="space-y-4">
                                                                <div className="flex items-center space-x-3">
                                                                        <Heart className="w-5 h-5 text-primary" />
                                                                        <span className="text-foreground">Founded by mountain enthusiasts in 2015</span>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                        <Shield className="w-5 h-5 text-primary" />
                                                                        <span className="text-foreground">Committed to sustainable tourism practices</span>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                        <Users className="w-5 h-5 text-primary" />
                                                                        <span className="text-foreground">Supporting local communities and culture</span>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                        <TreePine className="w-5 h-5 text-primary" />
                                                                        <span className="text-foreground">Preserving natural wilderness for future generations</span>
                                                                </div>
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                                                <Button size="lg" className="hero-gradient hover-glow">
                                                                        Learn About Our Mission
                                                                </Button>
                                                                <Link href="/our-resort">
                                                                        <Button size="lg" variant="outline">
                                                                                Experience Our Vision
                                                                        </Button>
                                                                </Link>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <Footer />
                </div>
        )
}

export default Index
