"use client"

import React from "react"
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
    Home,
    Calendar,
    User,
    Eye,
    Clock,
    BookOpen,
    ArrowRight,
} from "lucide-react"
import Link from "next/link";
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import activitiesImage from "@/assets/activities.jpg"
import type { Json } from "@/integrations/supabase/types"
import { destinationsImages, experiencesImages, heroImages, journeysImages, resortImages } from "@/app/images";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateJSONLD } from "@/lib/seo-utils";

const Index = () => {
    const [experientialStays, setExperientialStays] = useState<{
        slug: any
        id: string;
        name: string;
        duration: string | null;
        description: string | null;
        badge: string | null;
        location: string | null;
        categories: string[] | null;
        address: string | null;
        overview: string | null;
        connectivity: Json | null;
        restaurant_description: string | null;
        is_active: boolean | null;
        created_at: string | null;
        updated_at: string | null;
        featuredImage?: string;
        imageCount?: number;
        images: {
            image_url: string;
            is_featured: boolean | null;
            caption?: string | null;
            id?: string;
            image_order?: number | null;
            stay_id?: string;
            created_at?: string | null;
        }[];
    }[]>([]);
    const [currentStayIndex, setCurrentStayIndex] = useState(0)

    // State for all carousels
    const [currentIndices, setCurrentIndices] = useState({
        hero: 0,
        resort: 0,
        journeys: 0,
        destinations: 0,
        experiences: 0
    });

    const [autoSlideEnabled, setAutoSlideEnabled] = useState({
        hero: true,
        resort: true,
        journeys: true,
        destinations: true,
        experiences: true
    });

    // State for blogs
    const [blogPosts, setBlogPosts] = useState<any[]>([])
    const [blogsLoading, setBlogsLoading] = useState(true)

    // Helper function to get image path
    const getImagePath = (folder: string, filename: string) => {
        const basePath = process.env.NEXT_PUBLIC_IMAGE_PATH || 'https://cdn.jsdelivr.net/gh/Adityakurapati/assets__@main'

        // For Resort images, they're in "Exterior" folder
        if (folder === "Resort") {
            return `${basePath}/Exterior/${encodeURIComponent(filename)}`
        }

        // For other sections, they're in "HERO/[folder]" structure
        return `${basePath}/HERO/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`
    }

    // Carousel navigation functions for Experiential Stays
    const nextStay = () => {
        const maxIndex = Math.ceil(experientialStays.length / 3) - 1
        setCurrentStayIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }

    const prevStay = () => {
        const maxIndex = Math.ceil(experientialStays.length / 3) - 1
        setCurrentStayIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    }

    // Load experiential stays
    useEffect(() => {
        let isMounted = true

        const loadExperientialStays = async () => {
            try {
                const { data: staysData, error } = await supabase
                    .from("experiential_stays")
                    .select("*")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(5)

                if (error) throw error

                if (!staysData || staysData.length === 0) {
                    setExperientialStays([])
                    return
                }

                const staysWithImages = await Promise.all(
                    staysData.map(async (stay) => {
                        const { data: imagesData } = await supabase
                            .from("stay_images")
                            .select("*")
                            .eq("stay_id", stay.id)
                            .order("image_order", { ascending: true })

                        const categories = parseJSON(stay.categories, [])

                        const featuredImage = imagesData?.find(img => img.is_featured)?.image_url ||
                            imagesData?.[0]?.image_url

                        return {
                            ...stay,
                            categories,
                            images: imagesData || [],
                            featuredImage,
                            imageCount: imagesData?.length || 0
                        }
                    })
                )

                if (isMounted) {
                    setExperientialStays(staysWithImages)
                }
            } catch (error) {
                console.error("Error loading experiential stays:", error)
                if (isMounted) {
                    setExperientialStays([])
                }
            }
        }

        loadExperientialStays()

        const channel = supabase
            .channel("experiential_stays_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "experiential_stays"
                },
                () => {
                    loadExperientialStays()
                }
            )
            .subscribe()

        return () => {
            isMounted = false
            supabase.removeChannel(channel)
        }
    }, [])

    // Load blog posts (limit to 5 for home page)
    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                setBlogsLoading(true)
                const { data, error } = await supabase
                    .from('packages')
                    .select('*')
                    .order('published_date', { ascending: false })
                    .limit(5)

                if (error) throw error

                setBlogPosts(data || [])
            } catch (error) {
                console.error('Error fetching blog posts:', error)
                setBlogPosts([])
            } finally {
                setBlogsLoading(false)
            }
        }

        fetchBlogPosts()

        // Subscribe to real-time updates
        const channel = supabase
            .channel('packages-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, () => {
                fetchBlogPosts()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Helper function to parse JSON
    const parseJSON = (data: any, defaultValue: any = null) => {
        if (!data) return defaultValue;
        try {
            if (typeof data === 'string') {
                return JSON.parse(data);
            }
            return data;
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return defaultValue;
        }
    };

    // Auto slide effects for all carousels
    useEffect(() => {
        const intervals: NodeJS.Timeout[] = []

        // Hero carousel
        if (autoSlideEnabled.hero) {
            intervals.push(setInterval(() => {
                setCurrentIndices(prev => ({
                    ...prev,
                    hero: (prev.hero + 1) % heroImages.length
                }))
            }, 6000))
        }

        // Resort carousel
        if (autoSlideEnabled.resort) {
            intervals.push(setInterval(() => {
                setCurrentIndices(prev => ({
                    ...prev,
                    resort: (prev.resort + 1) % resortImages.length
                }))
            }, 5000))
        }

        // Journeys carousel
        if (autoSlideEnabled.journeys) {
            intervals.push(setInterval(() => {
                setCurrentIndices(prev => ({
                    ...prev,
                    journeys: (prev.journeys + 1) % journeysImages.length
                }))
            }, 4500))
        }

        // Destinations carousel
        if (autoSlideEnabled.destinations) {
            intervals.push(setInterval(() => {
                setCurrentIndices(prev => ({
                    ...prev,
                    destinations: (prev.destinations + 1) % destinationsImages.length
                }))
            }, 4000))
        }

        // Experiences carousel
        if (autoSlideEnabled.experiences) {
            intervals.push(setInterval(() => {
                setCurrentIndices(prev => ({
                    ...prev,
                    experiences: (prev.experiences + 1) % experiencesImages.length
                }))
            }, 3500))
        }

        return () => intervals.forEach(clearInterval)
    }, [autoSlideEnabled])

    // Navigation functions for carousels
    const nextImage = (carousel: keyof typeof currentIndices, images: string[]) => {
        setCurrentIndices(prev => ({
            ...prev,
            [carousel]: (prev[carousel] + 1) % images.length
        }))

        // Pause auto-slide for 3 seconds after user interaction
        setAutoSlideEnabled(prev => ({ ...prev, [carousel]: false }))
        setTimeout(() => {
            setAutoSlideEnabled(prev => ({ ...prev, [carousel]: true }))
        }, 3000)
    }

    const prevImage = (carousel: keyof typeof currentIndices, images: string[]) => {
        setCurrentIndices(prev => ({
            ...prev,
            [carousel]: (prev[carousel] - 1 + images.length) % images.length
        }))

        // Pause auto-slide for 3 seconds after user interaction
        setAutoSlideEnabled(prev => ({ ...prev, [carousel]: false }))
        setTimeout(() => {
            setAutoSlideEnabled(prev => ({ ...prev, [carousel]: true }))
        }, 3000)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Organization Schema */}
            <StructuredData
                data={generateJSONLD(
                    {
                        name: "Shanti Himalaya",
                        url: "https://shantihimalaya.com"
                    },
                    "Organization"
                )}
                type="Organization"
            />

            <Header />

            {/* Hero Section with Carousel - UPDATED */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {heroImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                index === currentIndices.hero ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <img
                                src={getImagePath("HERO", image)}
                                alt="Shanti Himalaya - Himalayan Adventure"
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'center 30%' }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
                        </div>
                    ))}
                </div>

                {/* Hero Carousel Navigation */}
                <div className="absolute top-1/2 left-4 right-4 z-20 flex justify-between transform -translate-y-1/2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => prevImage('hero', heroImages)}
                        className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => nextImage('hero', heroImages)}
                        className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>

                {/* Hero Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentIndices(prev => ({ ...prev, hero: index }))
                                setAutoSlideEnabled(prev => ({ ...prev, hero: false }))
                                setTimeout(() => {
                                    setAutoSlideEnabled(prev => ({ ...prev, hero: true }))
                                }, 3000)
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentIndices.hero 
                                    ? 'w-8 bg-white' 
                                    : 'w-2 bg-white/50 hover:bg-white/70'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <div className="relative z-10 text-center text-white pt-6 px-4 max-w-4xl mx-auto">
                    <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                        <p className="text-lg">Discover Your Next Himalayan Adventure</p>
                    </Badge>
                    <h1 className="text-5xl md:text-5xl font-display font-bold mb-16 leading-tight">
                        Welcome to Shanti Himalaya
                        <span className="text-3xl md:text-3xl block text-luxury leading-tight">
                            Meaningful Journeys & Experiential Stays through the Himalayas.
                        </span>
                    </h1>
                    <span className="block mb-5 text-2xl">
                        HIMALAYAS - INDIA | NEPAL | BHUTAN | TIBET
                    </span>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-24">
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

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="animate-bounce">
                        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Resort Section with Carousel - UPDATED */}
            <section className="py-10 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Shanti Himalaya Resort</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            <b className="text-2xl">'Shanti'</b> Means Peace.<br /><b className="text-2xl">'Shanti'</b> is about peace in the Mind, body & the Soul.<br />
                            <b className="text-2xl">'Shanti'</b> is about peace of past, present & future.
                        </p>
                        <p className="text-xl mt-4 text-gray-500 md:text-md mb-8 max-w-5xl mx-auto leading-relaxed">
                            Experience tranquility and luxury in the heart of the majestic Himalayas near Corbett National Park. Where serenity meets adventure with exclusive glamping, guided nature walks and cultural interactions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 px-4 lg:px-24 items-center gap-12">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-display font-semibold mb-6">An Offbeat Wilderness Experience </h3>
                                <div className="space-y-4">
                                    {[
                                        "4 exclusive glamping tents with panoramic mountain views",
                                        "Secluded location, far from conventional routes",
                                        "Exclusive 4 Camps set amid untouched Himalayan landscapes",
                                        "Quiet luxury defined by space, simplicity, and comfort",
                                        "Thoughtful, personalized service throughout your stay",
                                        "Slow, immersive experiences rooted in nature and place",
                                        "Unhurried days, starlit nights, and profound stillness",
                                        "A retreat designed for presence, privacy, and perspective"
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                                index === 0 || index === 3 || index === 4 ? 'bg-primary' :
                                                index === 1 ? 'bg-accent' : 'bg-gold'
                                            }`}></div>
                                            <span className="text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/our-resort">
                                    <Button className="mt-8 hero-gradient hover-glow">Discover Our Resort</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Resort Carousel - UPDATED */}
                        <div className="relative">
                            <div className="relative h-96 rounded-2xl shadow-card overflow-hidden">
                                <div className="relative w-full h-full">
                                    {resortImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                                index === currentIndices.resort ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        >
                                            <img
                                                src={getImagePath("Resort", image)}
                                                alt={`Resort view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => prevImage('resort', resortImages)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={() => nextImage('resort', resortImages)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Resort Carousel Indicators */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                                    {resortImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setCurrentIndices(prev => ({ ...prev, resort: index }))
                                                setAutoSlideEnabled(prev => ({ ...prev, resort: false }))
                                                setTimeout(() => {
                                                    setAutoSlideEnabled(prev => ({ ...prev, resort: true }))
                                                }, 3000)
                                            }}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                index === currentIndices.resort 
                                                    ? 'w-6 bg-white' 
                                                    : 'w-2 bg-white/50 hover:bg-white/70'
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Epic Journeys Section with Carousel - UPDATED */}
            <section className="py-20 mountain-gradient">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Epic Journeys</h2>
                        <p className="text-md text-muted-foreground max-w-5xl mx-auto">
                            Experience our immersive Himalayan journeys, thoughtfully curated around your interests and comfort. With deep local expertise and seamless service, we create meaningful travel experiences that go beyond the expected.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Journeys Carousel - UPDATED */}
                        <div className="relative">
                            <div className="relative h-96 rounded-2xl shadow-card overflow-hidden">
                                <div className="relative w-full h-full">
                                    {journeysImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                                index === currentIndices.journeys ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        >
                                            <img
                                                src={getImagePath("Epic Journeys", image)}
                                                alt={`Epic journey ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => prevImage('journeys', journeysImages)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={() => nextImage('journeys', journeysImages)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Journeys Carousel Indicators */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                                    {journeysImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setCurrentIndices(prev => ({ ...prev, journeys: index }))
                                                setAutoSlideEnabled(prev => ({ ...prev, journeys: false }))
                                                setTimeout(() => {
                                                    setAutoSlideEnabled(prev => ({ ...prev, journeys: true }))
                                                }, 3000)
                                            }}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                index === currentIndices.journeys 
                                                    ? 'w-6 bg-white' 
                                                    : 'w-2 bg-white/50 hover:bg-white/70'
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Journey Details */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-display font-semibold mb-6">Discover Legendary Treks</h3>
                                <div className="space-y-4">
                                    {[
                                        "Ladakh: Vast high-altitude deserts and timeless monasteries.",
                                        "Kashmir: Serene valleys and alpine tranquility.",
                                        "Himachal: Hidden villages and forested mountain trails.",
                                        "Garhwal: Sacred rivers and spiritually rooted landscapes.",
                                        "Nepal: Majestic peaks and culturally rich treks.",
                                        "Bhutan: where the Himalayas remain untouched for mindful travel.",
                                        "North East India: Lush hills and untouched traditions."
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                                index === 0 || index === 3 || index === 4 ? 'bg-primary' :
                                                index === 1 ? 'bg-accent' : 'bg-gold'
                                            }`}></div>
                                            <span className="text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/journeys">
                                    <Button className="mt-8 hero-gradient hover-glow">Explore All Journeys</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experiential Stays Carousel Section - Keep existing code */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Experiential Stays</h2>
                        <p className="text-md text-muted-foreground max-w-3xl mx-auto">
                            Boutique Himalayan retreats offering calm, comfort, and serene moments—crafted for the discerning traveler seeking peace and connection with the mountains.
                        </p>
                    </div>

                    {experientialStays.length > 0 ? (
                        <div className="relative px-8">
                            {experientialStays.length > 1 && (
                                <>
                                    <button
                                        onClick={prevStay}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-primary p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all z-10"
                                        aria-label="Previous stay"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextStay}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-primary p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all z-10"
                                        aria-label="Next stay"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            <div className="overflow-hidden">
                                <div
                                    className="flex gap-8 transition-transform duration-500 ease-in-out"
                                    style={{
                                        transform: `translateX(-${currentStayIndex * (100 / Math.min(3, experientialStays.length))}%)`
                                    }}
                                >
                                    {experientialStays.map((stay) => (
                                        <Card
                                            key={stay.id}
                                            className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-2"
                                        >
                                            <div className="h-56 relative overflow-hidden">
                                                <img
                                                    src={stay.featuredImage || "/placeholder.svg"}
                                                    alt={stay.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                    }}
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white text-primary">{stay.badge}</Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-semibold">{stay.name}</h3>
                                                </div>
                                                <div className="text-sm text-muted-foreground mb-2">{stay.duration || "Flexible Duration"}</div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {stay.overview || stay.description || "Experience the beauty of the Himalayas"}
                                                </p>

                                                {stay.categories && stay.categories.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {stay.categories.slice(0, 2).map((category: string, index: number) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {category}
                                                            </Badge>
                                                        ))}
                                                        {stay.categories.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{stay.categories.length - 2} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-4">
                                                    <span className="text-sm text-muted-foreground">
                                                        {stay.imageCount || 0} photos
                                                    </span>
                                                    <Link href={`/experiential-stays/${stay.slug}`}>
                                                        <Button size="sm" variant="outline" className="bg-transparent">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center items-center gap-2 mt-8">
                                {Array.from({ length: Math.ceil(experientialStays.length / Math.min(3, experientialStays.length)) }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentStayIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${index === currentStayIndex ? "bg-primary" : "bg-muted"}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12">
                            <Home className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p className="text-lg">No experiential stays available at the moment. Please check back later.</p>
                            <Link href="/admin" className="mt-4 inline-block">
                                <Button variant="outline" className="mt-4 bg-transparent">
                                    Go to Admin Panel
                                </Button>
                            </Link>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link href="/experiential-stays">
                            <Button size="lg" variant="outline" className="px-8 bg-transparent">
                                View All Stays
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Amazing Destinations Section with Carousel - UPDATED */}
            <section className="py-20 mountain-gradient">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Amazing Destinations</h2>
                        <p className="text-md text-muted-foreground max-w-5xl mx-auto">
                            The Himalayas are a land of awe and discovery, from towering peaks and serene valleys to hidden monasteries and secret trails. Beyond the well-known vistas lie remote villages, pristine lakes, and untouched landscapes—each a hidden wonder waiting to be explored.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Destination Details */}
                        <div className="space-y-8 mx-auto ">
                            <div>
                                <h3 className="text-2xl font-display font-semibold mb-6">Iconic Mountain Destinations</h3>
                                <div className="space-y-4">
                                    {[
                                        "Ladakh - High altitude desert landscapes and pristine lakes",
                                        "Kashmir Valley - Paradise on earth with Dal Lake and gardens",
                                        "Corbett National Park - Wildlife sanctuary and tiger reserve",
                                        "Everest and Annapurna regions - World's highest peaks"
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                                index === 0 || index === 3 ? 'bg-primary' :
                                                index === 1 ? 'bg-accent' : 'bg-gold'
                                            }`}></div>
                                            <span className="text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/destinations">
                                    <Button className="mt-8 hero-gradient hover-glow">Discover All Destinations</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Destinations Carousel - UPDATED */}
                        <div className="relative">
                            <div className="relative h-96 rounded-2xl shadow-card overflow-hidden">
                                <div className="relative w-full h-full">
                                    {destinationsImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                                index === currentIndices.destinations ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        >
                                            <img
                                                src={getImagePath("Amazing Destinations", image)}
                                                alt={`Destination ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => prevImage('destinations', destinationsImages)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={() => nextImage('destinations', destinationsImages)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Destinations Carousel Indicators */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                                    {destinationsImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setCurrentIndices(prev => ({ ...prev, destinations: index }))
                                                setAutoSlideEnabled(prev => ({ ...prev, destinations: false }))
                                                setTimeout(() => {
                                                    setAutoSlideEnabled(prev => ({ ...prev, destinations: true }))
                                                }, 3000)
                                            }}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                index === currentIndices.destinations 
                                                    ? 'w-6 bg-white' 
                                                    : 'w-2 bg-white/50 hover:bg-white/70'
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Unique Experiences Section with Carousel - UPDATED */}
            <section className="py-20 mountain-gradient">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Unique Experiences</h2>
                        <p className="text-md text-muted-foreground max-w-5xl mx-auto">
                            Experience the Himalayas beyond the usual path—meet local people, walk through remote villages, celebrate vibrant festivals, savor authentic cuisine, hear timeless stories, and embrace adventurous moments that stay with you forever.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Experiences Carousel - UPDATED */}
                        <div className="relative">
                            <div className="relative h-96 rounded-2xl shadow-card overflow-hidden">
                                <div className="relative w-full h-full">
                                    {experiencesImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                                index === currentIndices.experiences ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        >
                                            <img
                                                src={getImagePath("Experiences", image)}
                                                alt={`Experience ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => prevImage('experiences', experiencesImages)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={() => nextImage('experiences', experiencesImages)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Experiences Carousel Indicators */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                                    {experiencesImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setCurrentIndices(prev => ({ ...prev, experiences: index }))
                                                setAutoSlideEnabled(prev => ({ ...prev, experiences: false }))
                                                setTimeout(() => {
                                                    setAutoSlideEnabled(prev => ({ ...prev, experiences: true }))
                                                }, 3000)
                                            }}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                index === currentIndices.experiences 
                                                    ? 'w-6 bg-white' 
                                                    : 'w-2 bg-white/50 hover:bg-white/70'
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Experience Details */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-display font-semibold mb-6">Transformative Experiences</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {[
                                        {
                                            icon: Heart,
                                            title: "Himalayan Yoga Retreat",
                                            description: "7-day wellness journey with daily meditation and mountain views",
                                            gradient: "from-primary to-accent"
                                        },
                                        {
                                            icon: Users,
                                            title: "Village Cultural Immersion",
                                            description: "Authentic homestay experience with traditional crafts and local cuisine",
                                            gradient: "from-accent to-gold"
                                        },
                                        {
                                            icon: Camera,
                                            title: "Wildlife Photography Safari",
                                            description: "Expert-guided photography tours for capturing Himalayan wildlife",
                                            gradient: "from-gold to-primary"
                                        }
                                    ].map((experience, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${experience.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                <experience.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1">{experience.title}</h4>
                                                <p className="text-muted-foreground text-sm">
                                                    {experience.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/experiences">
                                    <Button className="mt-8 hero-gradient hover-glow">Discover All Experiences</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Section - Keep existing code */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Latest from Our Blog</h2>
                        <p className="text-md text-muted-foreground max-w-5xl mx-auto">
                            <b>Discover the Himalayas through </b>stories, experiences and local encounters from hidden corners of the Himalayas. <b>Told by experienced Himalayan guides & locals, these tales bring the mountains to life.</b>
                        </p>
                    </div>

                    {blogsLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : blogPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {blogPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                    <Card className="shadow-card hover-lift overflow-hidden h-full">
                                        <div className="h-48 relative overflow-hidden">
                                            {post.image_url ? (
                                                <img
                                                    src={post.image_url || "/placeholder.svg"}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                                                    <BookOpen className="w-16 h-16 text-white/30 group-hover:scale-110 transition-transform" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-white text-primary">{post.category}</Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(post.published_date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{post.read_time}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    <span>{post.views || 0}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="w-3 h-3 text-primary" />
                                                    </div>
                                                    <span className="text-xs font-medium">{post.author}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-primary text-sm font-medium">
                                                    Read more
                                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                            <p className="text-lg text-muted-foreground">No blog posts available yet. Check back soon!</p>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link href="/blog">
                            <Button size="lg" variant="outline" className="px-8 bg-transparent">
                                Read All Posts
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Our Story Section - Keep existing code */}
            <section className="pb-10 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Image
                                src={activitiesImage || "/placeholder.svg"}
                                alt="Founders of Shanti Himalaya sketching plans in a Himalayan teahouse"
                                className="rounded-2xl shadow-card hover-lift"
                                width={800}
                                height={600}
                            />
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-4xl font-display font-bold text-foreground">Our Story: Peaks to Paradise</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                For a decade, we chased the wild heart of the Himalayas—from Ladakh's icy spires to Sikkim's rhododendron trails, guiding trekkers where maps dared not go. During a quiet moment in a Uttarakhand teahouse, inspiration struck. We sketched a vision on a foggy napkin: to share the magic we knew so intimately.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Drawing on our knowledge of hidden valleys, we claimed an offbeat gem at 4,500 feet near Corbett National Park. Here, under skies blanketed with stars like spilled diamonds, "Shanti Himalaya" was born—a glamping haven born from yak butter tea dreams, now drawing soul-seekers from Silicon Valley to São Paulo who crave the Himalayas' raw pulse.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Heart className="w-5 h-5 text-primary" />
                                    <span className="text-foreground">A decade of Himalayan exploration before our first tent</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Shield className="w-5 h-5 text-primary" />
                                    <span className="text-foreground">Expert-guided, bespoke journeys far from tourist trails</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Users className="w-5 h-5 text-primary" />
                                    <span className="text-foreground">Crafting transformative experiences for global adventurers</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <TreePine className="w-5 h-5 text-primary" />
                                    <span className="text-foreground">Guardians of pristine meadows and star-filled skies</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/about-us-team" className="flex-1">
                                    <Button size="lg" className="hero-gradient hover-glow">
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