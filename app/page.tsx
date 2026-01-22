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

const Index = () => {
    const [currentHeroImage, setCurrentHeroImage] = useState(0)
    const [experientialStays, setExperientialStays] = useState<
        Array<{
            id: string;
            name: string;
            duration: string;
            price: string;
            description: string;
            badge: string;
            amenities: string;
            highlights: string;
            images: Array<{ image_url: string; is_featured: boolean }>
        }>
    >([])
    const [currentStayIndex, setCurrentStayIndex] = useState(0)

    // State for resort images carousel
    const [resortCurrentImage, setResortCurrentImage] = useState(0)
    const [resortAutoSlide, setResortAutoSlide] = useState(true)
    const resortImages = [
        "20220116_124349 - Copy.jpg",
        "20220116_124514 - Copy (2).jpg",
        "20220116_124521 - Copy (2).jpg",
        "20220116_125100 - Copy.jpg",
        "20220116_125114 - Copy (2).jpg",
        "Camp Ext 1.jpg",
        "Camp Ext 2.jpg",
        "Camp View Out.jpg",
        "IMG_20220107_105940_644.webp",
        "Resort Night View (2).jpg",
        "Resort Night View (3) - Copy.jpg",
        "Resort View.jpg",
        "View 6.jpg",
        "View Himalaya.jpg",
        "View Umbrella.jpg"
    ]

    // State for Epic Journeys carousel
    const [journeysCurrentImage, setJourneysCurrentImage] = useState(0)
    const [journeysAutoSlide, setJourneysAutoSlide] = useState(true)
    const journeysImages = [
        "DSC07594.JPG",
        "IMG_9743.JPG",
        "KakaoTalk_20240929_122150604_08.jpg",
        "KakaoTalk_20240929_122150604_15.jpg",
        "KGL People.jpg",
        "Ladakh Cycling 1.jpg",
        "Ladakh Cycling.jpg",
        "Nanda Devi Base Camp 1.jpg"
    ]

    // State for Amazing Destinations carousel
    const [destinationsCurrentImage, setDestinationsCurrentImage] = useState(0)
    const [destinationsAutoSlide, setDestinationsAutoSlide] = useState(true)
    const destinationsImages = [
        "7 Nanda Devi1.jpg",
        "9 KGL 1.jpg",
        "DSC04949.JPG",
        "Fishtail 1.jpg",
        "Indus Landscape.jpg",
        "Ladakh 10.jpg",
        "Ladakh Mountain.jpg",
        "Phewa Lake View.jpeg",
        "Rinpung Dzong Paro - Copy.jpg",
        "Rinpung Dzong Paro.jpg",
        "Terrace farming.jpg"
    ]

    // State for Experiences carousel
    const [experiencesCurrentImage, setExperiencesCurrentImage] = useState(0)
    const [experiencesAutoSlide, setExperiencesAutoSlide] = useState(true)
    const experiencesImages = [
        "4 Karmapa group.JPG",
        "Achithang Village Kids.jpg",
        "Cycle Lunch.JPG",
        "dharamshala01.jpg",
        "IMG_9731.JPG",
        "Indus Valley near Shey.jpg",
        "Kalka Shimla Toy Train.jpg",
        "Ladakh Cycle Monastry.jpg",
        "Ladakh Cycling 1.jpg",
        "Ladakh Cycling.jpg",
        "Mon (3).jpg",
        "Nubra Dine and Dance.jpg",
        "Nubra woman.jpg"
    ]

    // State for Hero carousel
    const [heroCurrentImage, setHeroCurrentImage] = useState(0)
    const [heroAutoSlide, setHeroAutoSlide] = useState(true)
    const heroImages = [
        "1 Thicksey.JPG",
        "3 Himachal House.JPG",
        "3 India Flag.jpg",
        "3 Ladakh woman.jpg",
        "4 Kashmir.jpg",
        "5 Gurung Lodge.jpg",
        "6 Naga Woman Ornaments.jpg",
        "Achithang Apricot Blossom.jpg",
        "Achithang People.jpg",
        "Australian Camp Treking Day Tour from Pokhara.jpg",
        "Bhutan Painting.JPG",
        "Budhist.jpg",
        "CyclingForiegn.jpg",
        "dharamshala12.jpg",
        "KGL People.jpg",
        "Ladakh Cycling.jpg",
        "Ladakh Girls.jpg",
        "Ladakh Trek Camping 6.jpg",
        "nepal-trek-himalayan-vulture.jpg",
        "P1000090.JPG",
        "SHam Trek Pic.jpg",
        "Temple Top.jpg",
        "Thamelk market landscape.jpg",
        "View Himalaya.jpg",
        "view on Trek.jpg",
        "Yangthang Local.JPG",
        "yangthang_village_1.jpg"
    ]

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

    // Auto slide effects for all carousels with user interaction pause
    useEffect(() => {
        const intervals: NodeJS.Timeout[] = []

        // Resort images interval
        if (resortAutoSlide) {
            intervals.push(setInterval(() => {
                setResortCurrentImage((prev) => (prev + 1) % resortImages.length)
            }, 5000))
        }

        // Journeys images interval
        if (journeysAutoSlide) {
            intervals.push(setInterval(() => {
                setJourneysCurrentImage((prev) => (prev + 1) % journeysImages.length)
            }, 4500))
        }

        // Destinations images interval
        if (destinationsAutoSlide) {
            intervals.push(setInterval(() => {
                setDestinationsCurrentImage((prev) => (prev + 1) % destinationsImages.length)
            }, 4000))
        }

        // Experiences images interval
        if (experiencesAutoSlide) {
            intervals.push(setInterval(() => {
                setExperiencesCurrentImage((prev) => (prev + 1) % experiencesImages.length)
            }, 3500))
        }

        // Hero images interval
        if (heroAutoSlide) {
            intervals.push(setInterval(() => {
                setHeroCurrentImage((prev) => (prev + 1) % heroImages.length)
            }, 6000))
        }

        return () => intervals.forEach(clearInterval)
    }, [resortAutoSlide, journeysAutoSlide, destinationsAutoSlide, experiencesAutoSlide, heroAutoSlide])

    // Navigation functions for all carousels with auto-slide pause
    const nextImage = (setter: React.Dispatch<React.SetStateAction<number>>, images: string[], setAutoSlide: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter((prev) => (prev + 1) % images.length)
        
        // Pause auto-slide for 3 seconds after user interaction
        setAutoSlide(false)
        setTimeout(() => {
            setAutoSlide(true)
        }, 3000)
    }

    const prevImage = (setter: React.Dispatch<React.SetStateAction<number>>, images: string[], setAutoSlide: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter((prev) => (prev - 1 + images.length) % images.length)
        
        // Pause auto-slide for 3 seconds after user interaction
        setAutoSlide(false)
        setTimeout(() => {
            setAutoSlide(true)
        }, 3000)
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section with Carousel */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="relative h-full w-full">
                        <img
                            src={getImagePath("HERO", heroImages[heroCurrentImage])}
                            alt="Shanti Himalaya - Himalayan Adventure"
                            className="w-full h-full object-cover transition-opacity duration-1000"
                           
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

                        {/* Hero Carousel Controls */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                            {heroImages.map((_, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setHeroCurrentImage(index)
                                        setHeroAutoSlide(false)
                                        setTimeout(() => setHeroAutoSlide(true), 3000)
                                    }}
                                    className={`w-3 h-3 rounded-full transition-all ${index === heroCurrentImage ? "bg-white" : "bg-white/50"}`}
                                />
                            ))}
                        </div>
                    </div>
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

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="animate-bounce">
                        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Resort Section with Carousel */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Shanti Himalaya Resort</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            "Shanti Himalaya" Beyond Corbett - Where peace, spirituality, serenity and bounty of nature still exists.
                            Experience wilderness glamping in the lap of Mother Nature.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 px-4 lg:px-24 items-center gap-12">
                        <div className="space-y-8">
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

                        {/* Resort Carousel */}
                        <div className="relative">
                            <div className="relative h-96 rounded-2xl shadow-card overflow-hidden">
                                <img
                                    src={getImagePath("Resort", resortImages[resortCurrentImage])}
                                    alt={`Resort view ${resortCurrentImage + 1}`}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                                <button
                                    onClick={() => prevImage(setResortCurrentImage, resortImages, setResortAutoSlide)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={() => nextImage(setResortCurrentImage, resortImages, setResortAutoSlide)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10">
                                    <span className="font-semibold">{resortCurrentImage + 1}</span> / <span className="text-white/80">{resortImages.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Epic Journeys Section with Carousel */}
            <section className="py-20 mountain-gradient">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Epic Journeys</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Discover curated adventures across the majestic Himalayas with immersive experiences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Journeys Carousel */}
                        <div className="relative">
                            <div className="relative h-96 rounded-2xl shadow-card overflow-hidden">
                                <img
                                    src={getImagePath("Epic Journeys", journeysImages[journeysCurrentImage])}
                                    alt={`Epic journey ${journeysCurrentImage + 1}`}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                                <button
                                    onClick={() => prevImage(setJourneysCurrentImage, journeysImages, setJourneysAutoSlide)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={() => nextImage(setJourneysCurrentImage, journeysImages, setJourneysAutoSlide)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10">
                                    <span className="font-semibold">{journeysCurrentImage + 1}</span> / <span className="text-white/80">{journeysImages.length}</span>
                                </div>
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

            {/* Blog Section - Updated with Database Fetching */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Latest from Our Blog</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Stay updated with travel insights, mountain stories, and adventure guides
                        </p>
                    </div>

                    {blogsLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : blogPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {blogPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.id}`} className="group">
                                    <Card className="shadow-card hover-lift overflow-hidden h-full">
                                        <div className="h-48 relative overflow-hidden">
                                            {post.image_url ? (
                                                <img
                                                    src={post.image_url}
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

            {/* Amazing Destinations Section with Carousel */}
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

                        {/* Destinations Carousel */}
                        <div className="relative">
                            <div className="relative h-96 rounded-2xl shadow-card overflow-hidden">
                                <img
                                    src={getImagePath("Amazing Destinations", destinationsImages[destinationsCurrentImage])}
                                    alt={`Destination ${destinationsCurrentImage + 1}`}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                                <button
                                    onClick={() => prevImage(setDestinationsCurrentImage, destinationsImages, setDestinationsAutoSlide)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={() => nextImage(setDestinationsCurrentImage, destinationsImages, setDestinationsAutoSlide)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10">
                                    <span className="font-semibold">{destinationsCurrentImage + 1}</span> / <span className="text-white/80">{destinationsImages.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experiential Stays Carousel Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Experiential Stays</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Immerse yourself in authentic Himalayan experiences through our carefully curated stays.
                        </p>
                    </div>

                    {experientialStays.length > 0 ? (
                        <div className="relative">
                            {/* Carousel Container */}
                            <div className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out gap-6"
                                    style={{ transform: `translateX(-${currentStayIndex * (100 / 3)}%)` }}
                                >
                                    {experientialStays.slice(0, 5).map((stay) => (
                                        <Card
                                            key={stay.id}
                                            className="min-w-full md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(33.333%-16px)] shadow-card hover-lift overflow-hidden flex-shrink-0"
                                        >
                                            <div className="h-56 relative overflow-hidden">
                                                <img
                                                    src={stay.featuredImage}
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
                                                    <span className="text-primary font-bold">{stay.price || "Custom Price"}</span>
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
                                                    <Link href={`/experiential-stays/${stay.id}`}>
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

                            {/* Navigation Arrows - Only show if we have more than 3 stays */}
                            {experientialStays.length > 3 && (
                                <>
                                    <button
                                        onClick={prevStay}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white text-primary p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all z-10"
                                        aria-label="Previous stay"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>

                                    <button
                                        onClick={nextStay}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white text-primary p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all z-10"
                                        aria-label="Next stay"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            {/* Carousel Indicators */}
                            <div className="flex justify-center items-center gap-2 mt-8">
                                {Array.from({ length: Math.ceil(Math.min(experientialStays.length, 5) / 3) }).map((_, index) => (
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
                                <Button variant="outline" className="mt-4">
                                    Go to Admin Panel
                                </Button>
                            </Link>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link href="/experiential-stays">
                            <Button size="lg" variant="outline" className="px-8">
                                View All Stays
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Unique Experiences Section with Carousel */}
            <section className="py-20 mountain-gradient">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Unique Experiences</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Immerse yourself in transformative experiences with cultural authenticity
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Experiences Carousel */}
                        <div className="relative">
                            <div className="relative h-96 rounded-2xl shadow-card overflow-hidden">
                                <img
                                    src={getImagePath("Experiences", experiencesImages[experiencesCurrentImage])}
                                    alt={`Experience ${experiencesCurrentImage + 1}`}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                                <button
                                    onClick={() => prevImage(setExperiencesCurrentImage, experiencesImages, setExperiencesAutoSlide)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button
                                    onClick={() => nextImage(setExperiencesCurrentImage, experiencesImages, setExperiencesAutoSlide)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10">
                                    <span className="font-semibold">{experiencesCurrentImage + 1}</span> / <span className="text-white/80">{experiencesImages.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Experience Details */}
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
                                <Link href="/our-resort#accommodation">
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