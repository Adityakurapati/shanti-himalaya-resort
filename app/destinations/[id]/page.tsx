"use client"

import { Metadata } from "next";
import Image from "next/image";
import type { Tables } from "@/integrations/supabase/types";
import { generateDestinationSEO, generateSEOMetadata, generateJSONLD, generateBreadcrumbJSONLD } from "@/lib/seo-utils";
import { useParams } from "next/navigation"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo/Breadcrumps"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
        Clock,
        Star,
        Mountain,
        ArrowLeft,
        Thermometer,
        Compass,
        MapPin,
        Activity,
        Train,
        Car,
        Plane,
        Hotel,
        Calendar,
        Lightbulb,
        HelpCircle,
        ChevronRight,
        Users,
        Shield,
        ChevronLeft,
        ChevronDown
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import React from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import EnquiryModal from "@/components/EnquiryModal";
import LocationMapEmbed from "@/components/admin/LocationMapEmbed";

const DestinationDetail = () => {
        const params = useParams();
        const slug = Array.isArray(params.id) ? params.id[0] : params.id;
        const [destination, setDestination] = React.useState<Tables<"destinations"> | null>(null)
        const [loading, setLoading] = React.useState(true)
        const [activeTab, setActiveTab] = React.useState("overview")
        const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false)
        const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

        React.useEffect(() => {
                if (slug) {
                        fetchDestination()
                } else {
                        setLoading(false)
                }
        }, [slug])


        const fetchDestination = async () => {
                try {
                        const { data, error } = await supabase
                                .from("destinations")
                                .select("*")
                                .eq("slug", slug as string)
                                .maybeSingle()

                        if (error) {
                                console.error("Supabase error:", error)
                                throw error
                        }

                        setDestination(data);
                } catch (error) {
                        console.error("Error fetching destination:", error)
                        setDestination(null)
                } finally {
                        setLoading(false)
                }
        }

        // Parse JSON data with error handling
        const parseJSONData = (data: string | any) => {
                if (typeof data === 'string') {
                        try {
                                return JSON.parse(data);
                        } catch (error) {
                                console.error('Error parsing JSON:', error);
                                return {};
                        }
                }
                return data || {};
        };

        // Get places to visit as array
        const getPlacesToVisit = () => {
                const placesData = parseJSONData(destination?.places_to_visit);
                return Object.values(placesData);
        };

        // Get things to do as array and sort by numerical prefix in title
        const getThingsToDo = () => {
                const thingsData = parseJSONData(destination?.things_to_do);
                const thingsArray = Object.values(thingsData);

                // Sort by extracting the number from the beginning of the title
                return thingsArray.sort((a: any, b: any) => {
                        // Helper function to extract number from title
                        const extractNumber = (str: string | undefined): number => {
                                if (!str || typeof str !== 'string') return Infinity;
                                const match = str.match(/^(\d+)[\.\)\s]*/);
                                return match ? parseInt(match[1], 10) : Infinity;
                        };

                        const numA = extractNumber(a.title);
                        const numB = extractNumber(b.title);

                        // If both have numbers, sort numerically
                        if (numA !== Infinity && numB !== Infinity) {
                                return numA - numB;
                        }

                        // If only one has number, put numbered items first
                        if (numA !== Infinity && numB === Infinity) return -1;
                        if (numA === Infinity && numB !== Infinity) return 1;

                        // If neither has number, sort alphabetically
                        return (a.title || '').localeCompare(b.title || '');
                });
        };

        // Get itinerary as array
        const getItinerary = () => {
                const itineraryData = parseJSONData(destination?.itinerary);
                return Object.values(itineraryData);
        };

        // Get FAQs as array
        const getFAQs = () => {
                const faqsData = parseJSONData(destination?.faqs);
                return Object.values(faqsData);
        };

        // Get transport data
        const getTransportData = () => {
                return parseJSONData(destination?.how_to_reach);
        };

        // Get season data
        const getSeasonData = () => {
                return parseJSONData(destination?.best_time_details);
        };

        // Get accommodation data
        const getAccommodationData = () => {
                return parseJSONData(destination?.where_to_stay);
        };

        const FadeInSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
                const [ref, inView] = useInView({
                        triggerOnce: true,
                        threshold: 0.1,
                })

                return (
                        <motion.div
                                ref={ref}
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay }}
                        >
                                {children}
                        </motion.div>
                )
        }

        const SlideInSection = ({ children, direction = "left", delay = 0 }: { children: React.ReactNode; direction?: "left" | "right"; delay?: number }) => {
                const [ref, inView] = useInView({
                        triggerOnce: true,
                        threshold: 0.1,
                })

                return (
                        <motion.div
                                ref={ref}
                                initial={{ opacity: 0, x: direction === "left" ? -50 : 50 }}
                                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: direction === "left" ? -50 : 50 }}
                                transition={{ duration: 0.6, delay }}
                        >
                                {children}
                        </motion.div>
                )
        }

        if (loading) {
                return (
                        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50/30">
                                <Header />
                                <div className="pt-32 pb-16 text-center px-4">
                                        <div className="animate-pulse">
                                                <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                                        </div>
                                </div>
                                <Footer />
                        </div>
                )
        }

        if (!destination) {
                return (
                        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50/30">
                                <Header />
                                <div className="pt-32 pb-16 text-center px-4">
                                        <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                        >
                                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Destination Not Found</h1>
                                                <Link href="/destinations">
                                                        <Button className="hero-gradient">
                                                                Back to Destinations
                                                        </Button>
                                                </Link>
                                        </motion.div>
                                </div>
                                <Footer />
                        </div>
                )
        }

        const transportData = getTransportData();
        const seasonData = getSeasonData();
        const accommodationData = getAccommodationData();

        // Structured data
        const destinationJSONLD = generateJSONLD(destination, 'Destination');
        const breadcrumbStructuredData = generateBreadcrumbJSONLD([
                { name: 'Home', url: '/' },
                { name: 'Destinations', url: '/destinations' },
                { name: destination.name, url: `/destinations/${destination.slug}` }
        ]);

        return (
                <>
                        <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationJSONLD) }}
                        />
                        <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
                        />
                        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50/30">
                                <Header />
                                <Breadcrumbs />

                                {/* Animated Hero Section - Mobile Optimized */}
                                <section className="pt-24 md:pt-32 pb-12 md:pb-20 relative overflow-hidden">
                                        {/* Conditional rendering for banner image or gradient */}
                                        {destination.image_url ? (
                                                <div className="absolute inset-0">
                                                        <img
                                                                src={destination.image_url || "/placeholder.svg"}
                                                                alt={destination.name}
                                                                className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"></div>
                                                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                                                </div>
                                        ) : (
                                                <>
                                                        <div className="absolute inset-0 hero-gradient"></div>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/20 to-cyan-500/20"></div>
                                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
                                                </>
                                        )}

                                        <div className="container mx-auto px-4 relative z-10">
                                                <motion.div
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.8 }}
                                                        className="max-w-6xl mx-auto"
                                                >
                                                        <Link
                                                                href="/destinations"
                                                                className={`inline-flex items-center mb-6 md:mb-8 transition-all duration-300 group text-sm md:text-base ${destination.image_url ? 'text-white/80 hover:text-white' : 'text-foreground/70 hover:text-foreground'}`}
                                                        >
                                                                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                                                Back to Destinations
                                                        </Link>

                                                        <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                                                                <Badge className={`px-2 md:px-3 py-1 text-xs md:text-sm ${destination.image_url ? 'bg-white/20 text-white backdrop-blur-sm border-white/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                                                                        {destination.category}
                                                                </Badge>

                                                                {destination.featured && (
                                                                        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 px-2 md:px-3 py-1 text-xs md:text-sm backdrop-blur-sm">
                                                                                Featured
                                                                        </Badge>
                                                                )}
                                                        </div>

                                                        <motion.h1
                                                                className={`text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 ${destination.image_url ? 'text-white' : 'text-luxury'}`}
                                                                initial={{ opacity: 0, y: 40 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.8, delay: 0.2 }}
                                                        >
                                                                {destination.name}
                                                        </motion.h1>

                                                        {/* Stats Grid - Mobile Optimized */}
                                                        <motion.div
                                                                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8"
                                                                initial={{ opacity: 0, y: 30 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.8, delay: 0.6 }}
                                                        >
                                                                <div className={`${destination.image_url ? 'bg-white/10 backdrop-blur-sm border-white/20' : 'bg-white/80 backdrop-blur-sm border-white/20'} rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border`}>
                                                                        <div className="flex items-center space-x-2 md:space-x-3">
                                                                                <div className="p-1.5 md:p-2 bg-emerald-100 rounded-lg">
                                                                                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                                                                                </div>
                                                                                <div className="min-w-0">
                                                                                        <p className={`text-xs md:text-sm ${destination.image_url ? 'text-white/80' : 'text-muted-foreground'}`}>Duration</p>
                                                                                        <p className={`text-sm md:text-base font-semibold truncate ${destination.image_url ? 'text-white' : 'text-foreground'}`}>{destination.duration}</p>
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                <div className={`${destination.image_url ? 'bg-white/10 backdrop-blur-sm border-white/20' : 'bg-white/80 backdrop-blur-sm border-white/20'} rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border`}>
                                                                        <div className="flex items-center space-x-2 md:space-x-3">
                                                                                <div className="p-1.5 md:p-2 bg-amber-100 rounded-lg">
                                                                                        <Mountain className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                                                                                </div>
                                                                                <div className="min-w-0">
                                                                                        <p className={`text-xs md:text-sm ${destination.image_url ? 'text-white/80' : 'text-muted-foreground'}`}>Difficulty</p>
                                                                                        <p className={`text-sm md:text-base font-semibold truncate ${destination.image_url ? 'text-white' : 'text-foreground'}`}>{destination.difficulty}</p>
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                <div className={`${destination.image_url ? 'bg-white/10 backdrop-blur-sm border-white/20' : 'bg-white/80 backdrop-blur-sm border-white/20'} rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border`}>
                                                                        <div className="flex items-center space-x-2 md:space-x-3">
                                                                                <div className="p-1.5 md:p-2 bg-teal-100 rounded-lg">
                                                                                        <Thermometer className="w-4 h-4 md:w-5 md:h-5 text-teal-600" />
                                                                                </div>
                                                                                <div className="min-w-0">
                                                                                        <p className={`text-xs md:text-sm ${destination.image_url ? 'text-white/80' : 'text-muted-foreground'}`}>Best Time</p>
                                                                                        <p className={`text-sm md:text-base font-semibold truncate ${destination.image_url ? 'text-white' : 'text-foreground'}`}>{destination.best_time}</p>
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                {/* <div className={`${destination.image_url ? 'bg-white/10 backdrop-blur-sm border-white/20' : 'bg-white/80 backdrop-blur-sm border-white/20'} rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border`}>
                <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-cyan-100 rounded-lg">
                <Compass className="w-4 h-4 md:w-5 md:h-5 text-cyan-600" />
                </div>
                <div className="min-w-0">
                <p className={`text-xs md:text-sm ${destination.image_url ? 'text-white/80' : 'text-muted-foreground'}`}>Altitude</p>
                <p className={`text-sm md:text-base font-semibold truncate ${destination.image_url ? 'text-white' : 'text-foreground'}`}>{destination.altitude}</p>
                </div>
                </div>
                </div> */}
                                                        </motion.div>

                                                        <motion.div
                                                                className="flex flex-col sm:flex-row gap-3 md:gap-4"
                                                                initial={{ opacity: 0, y: 30 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.8, delay: 0.8 }}
                                                        >
                                                                <Button
                                                                        size="lg"
                                                                        className={`text-base md:text-lg px-6 md:px-8 py-3 md:py-4 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto ${destination.image_url ? 'bg-white text-emerald-600 hover:bg-white/90' : 'hero-gradient text-white'}`}
                                                                        onClick={() => setIsEnquiryModalOpen(true)}
                                                                >
                                                                        Enquire Now
                                                                </Button>

                                                        </motion.div>
                                                </motion.div>
                                        </div>
                                </section>

                                <EnquiryModal
                                        item={{
                                                id: destination.id,
                                                title: destination.name,
                                                type: 'destination'
                                        }}
                                        isOpen={isEnquiryModalOpen}
                                        onClose={() => setIsEnquiryModalOpen(false)}
                                />

                                {/* Interactive Tabs Section - Mobile Optimized */}
                                <section className="py-8 md:py-16 bg-transparent">
                                        <div className="container mx-auto px-4">
                                                <div className="max-w-6xl mx-auto">
                                                        {/* Mobile Tab Selector */}
                                                        <div className="md:hidden mb-6">
                                                                <button
                                                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                                                        className="w-full flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-lg"
                                                                >
                                                                        <span className="font-semibold text-foreground">
                                                                                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                                                        </span>
                                                                        <ChevronDown className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                                                                </button>
                                                                {mobileMenuOpen && (
                                                                        <div className="absolute z-20 mt-2 w-full max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-200 py-2">
                                                                                {[
                                                                                        { value: "overview", label: "Overview" },
                                                                                        { value: "places", label: "Places" },
                                                                                        { value: "activities", label: "Activities" },
                                                                                        { value: "itinerary", label: "Itinerary" },
                                                                                        { value: "transport", label: "How To Reach" },
                                                                                        { value: "besttime", label: "Best Time" },
                                                                                        { value: "accommodation", label: "Stay" },
                                                                                        { value: "faqs", label: "FAQs" }
                                                                                ].map((tab) => (
                                                                                        <button
                                                                                                key={tab.value}
                                                                                                onClick={() => {
                                                                                                        setActiveTab(tab.value);
                                                                                                        setMobileMenuOpen(false);
                                                                                                }}
                                                                                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${activeTab === tab.value ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-foreground'
                                                                                                        }`}
                                                                                        >
                                                                                                {tab.label}
                                                                                        </button>
                                                                                ))}
                                                                        </div>
                                                                )}
                                                        </div>

                                                        {/* Desktop Tabs */}
                                                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
                                                                {/* Desktop Tabs - Fixed to prevent scrolling */}
                                                                <TabsList className="hidden md:flex flex-wrap lg:flex-nowrap justify-center gap-1 bg-background/50 backdrop-blur-sm py-6 rounded-2xl border">
                                                                        <TabsTrigger value="overview" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white whitespace-nowrap px-3 py-2 text-sm">
                                                                                Overview
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="places" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white whitespace-nowrap px-3 py-2 text-sm">
                                                                                Places
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="activities" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white whitespace-nowrap px-3 py-2 text-sm">
                                                                                Activities
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="itinerary" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white whitespace-nowrap px-3 py-2 text-sm">
                                                                                Itinerary
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="transport" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white whitespace-nowrap px-3 py-2 text-sm">
                                                                                How To Reach
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="besttime" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white whitespace-nowrap px-3 py-2 text-sm">
                                                                                Best Time
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="accommodation" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white whitespace-nowrap px-3 py-2 text-sm">
                                                                                Stay
                                                                        </TabsTrigger>
                                                                        <TabsTrigger value="faqs" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white whitespace-nowrap px-3 py-2 text-sm">
                                                                                FAQs
                                                                        </TabsTrigger>
                                                                </TabsList>

                                                                {/* Overview Tab - Mobile Optimized */}
                                                                <TabsContent value="overview" className="space-y-6 md:space-y-8">
                                                                        <FadeInSection>
                                                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                                                                        <div className="lg:col-span-2 space-y-4 md:space-y-6">
                                                                                                {destination.overview_image_url && (
                                                                                                        <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
                                                                                                                <img
                                                                                                                        src={destination.overview_image_url || "/placeholder.svg"}
                                                                                                                        alt={`${destination.name} Overview`}
                                                                                                                        className="w-full h-48 md:h-64 object-cover"
                                                                                                                />
                                                                                                        </div>
                                                                                                )}
                                                                                                <div>
                                                                                                        <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                                                                                                About {destination.name}
                                                                                                        </h2>
                                                                                                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                                                                                                {destination.overview || destination.description}
                                                                                                        </p>
                                                                                                </div>

                                                                                                {destination.highlights && destination.highlights.length > 0 && (
                                                                                                        <div>
                                                                                                                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center">
                                                                                                                        <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-500 mr-2" />
                                                                                                                        Key Highlights
                                                                                                                </h3>
                                                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                                                                                        {destination.highlights.map((highlight: any, index: number) => (
                                                                                                                                <motion.div
                                                                                                                                        key={index}
                                                                                                                                        className="flex items-start space-x-2 md:space-x-3 p-3 md:p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-shadow duration-300"
                                                                                                                                        whileHover={{ scale: 1.02 }}
                                                                                                                                        transition={{ type: "spring", stiffness: 300 }}
                                                                                                                                >
                                                                                                                                        <div className="p-1.5 md:p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex-shrink-0">
                                                                                                                                                <Star className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                                                                                                                        </div>
                                                                                                                                        <span className="text-sm md:text-base text-foreground font-medium">{highlight}</span>
                                                                                                                                </motion.div>
                                                                                                                        ))}
                                                                                                                </div>
                                                                                                        </div>
                                                                                                )}
                                                                                        </div>

                                                                                        {/* Quick Tips Sidebar - Mobile Optimized */}
                                                                                        <div className="space-y-4 md:space-y-6">
                                                                                                {destination.travel_tips && destination.travel_tips.length > 0 && (
                                                                                                        <Card className="bg-gradient-to-br from-white to-teal-50/50 backdrop-blur-sm border-teal-100 shadow-lg">
                                                                                                                <CardContent className="p-4 md:p-6">
                                                                                                                        <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground flex items-center">
                                                                                                                                <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-teal-600 mr-2" />
                                                                                                                                Quick Tips
                                                                                                                        </h3>
                                                                                                                        <ul className="space-y-2">
                                                                                                                                {destination.travel_tips.slice(0, 3).map((tip: any, index: number) => (
                                                                                                                                        <li key={index} className="flex items-start space-x-2 text-xs md:text-sm">
                                                                                                                                                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                                                                                                                <span className="text-muted-foreground">{tip}</span>
                                                                                                                                        </li>
                                                                                                                                ))}
                                                                                                                        </ul>
                                                                                                                </CardContent>
                                                                                                        </Card>
                                                                                                )}
                                                                                        </div>
                                                                                </div>
                                                                        </FadeInSection>
                                                                </TabsContent>

                                                                {/* Places to Visit Tab - Mobile Optimized */}
                                                                <TabsContent value="places">
                                                                        {destination.places_image_url && (
                                                                                <FadeInSection>
                                                                                        <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-lg mb-6 md:mb-8">
                                                                                                <img
                                                                                                        src={destination.places_image_url || "/placeholder.svg"}
                                                                                                        alt={`${destination.name} Places to Visit`}
                                                                                                        className="w-full h-48 md:h-64 object-cover"
                                                                                                />
                                                                                        </div>
                                                                                </FadeInSection>
                                                                        )}
                                                                        {getPlacesToVisit().length > 0 ? (
                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                                                                        {getPlacesToVisit().map((place: any, index: number) => (
                                                                                                <FadeInSection key={place.id || index} delay={index * 0.1}>
                                                                                                        <motion.div
                                                                                                                whileHover={{ y: -5 }}
                                                                                                                transition={{ type: "spring", stiffness: 300 }}
                                                                                                        >
                                                                                                                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                                                                                                        <CardContent className="p-4 md:p-6">
                                                                                                                                <div className="flex items-start space-x-2 md:space-x-3 mb-2 md:mb-3">
                                                                                                                                        <div className="p-1.5 md:p-2 hero-gradient rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                                                                                                                                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                                                                                                                        </div>
                                                                                                                                        <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors duration-300">
                                                                                                                                                {place.name}
                                                                                                                                        </h3>
                                                                                                                                </div>
                                                                                                                                {place.image_url && (
                                                                                                                                        <div className="mb-3 md:mb-4 rounded-lg overflow-hidden">
                                                                                                                                                <img
                                                                                                                                                        src={place.image_url || "/placeholder.svg"}
                                                                                                                                                        alt={place.name}
                                                                                                                                                        className="w-full h-32 md:h-40 object-cover"
                                                                                                                                                />
                                                                                                                                        </div>
                                                                                                                                )}
                                                                                                                                <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed line-clamp-3 md:line-clamp-none">{place.description}</p>
                                                                                                                                {place.highlights && place.highlights.length > 0 && (
                                                                                                                                        <div className="space-y-1 md:space-y-2">
                                                                                                                                                <p className="text-xs md:text-sm font-semibold text-foreground">Highlights:</p>
                                                                                                                                                <ul className="space-y-1">
                                                                                                                                                        {place.highlights.map((highlight: any, idx: number) => (
                                                                                                                                                                <li key={idx} className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-muted-foreground">
                                                                                                                                                                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></div>
                                                                                                                                                                        <span className="line-clamp-1 md:line-clamp-none">{highlight}</span>
                                                                                                                                                                </li>
                                                                                                                                                        ))}
                                                                                                                                                </ul>
                                                                                                                                        </div>
                                                                                                                                )}
                                                                                                                        </CardContent>
                                                                                                                </Card>
                                                                                                        </motion.div>
                                                                                                </FadeInSection>
                                                                                        ))}
                                                                                </div>
                                                                        ) : (
                                                                                <div className="text-center py-8 md:py-12">
                                                                                        <MapPin className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                        <p className="text-sm md:text-base text-muted-foreground">No places information available yet.</p>
                                                                                </div>
                                                                        )}
                                                                </TabsContent>

                                                                {/* Things to Do Tab - Mobile Optimized */}
                                                                <TabsContent value="activities">
                                                                        {destination.activities_image_url && (
                                                                                <FadeInSection>
                                                                                        <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-lg mb-6 md:mb-8">
                                                                                                <img
                                                                                                        src={destination.activities_image_url || "/placeholder.svg"}
                                                                                                        alt={`${destination.name} Things to Do`}
                                                                                                        className="w-full h-48 md:h-64 object-cover"
                                                                                                />
                                                                                        </div>
                                                                                </FadeInSection>
                                                                        )}
                                                                        {getThingsToDo().length > 0 ? (
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                                                        {getThingsToDo().map((activity: any, index: number) => (
                                                                                                <SlideInSection key={activity.id || index} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                                                                                                        <div className="h-full">
                                                                                                                <motion.div
                                                                                                                        whileHover={{ scale: 1.02 }}
                                                                                                                        transition={{ type: "spring", stiffness: 300 }}
                                                                                                                        className="h-full"
                                                                                                                >
                                                                                                                        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                                                                                                                <CardContent className="p-4 md:p-6 h-full flex flex-col">
                                                                                                                                        <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                                                                                                                                                <div className="p-1.5 md:p-2 hero-gradient rounded-lg flex-shrink-0">
                                                                                                                                                        <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                                                                                                                                </div>
                                                                                                                                                <h3 className="text-base md:text-lg font-bold text-foreground line-clamp-2">{activity.title}</h3>
                                                                                                                                        </div>
                                                                                                                                        {activity.image_url && (
                                                                                                                                                <div className="mb-3 md:mb-4 rounded-lg overflow-hidden flex-shrink-0">
                                                                                                                                                        <img
                                                                                                                                                                src={activity.image_url || "/placeholder.svg"}
                                                                                                                                                                alt={activity.title}
                                                                                                                                                                className="w-full h-32 md:h-40 object-cover"
                                                                                                                                                        />
                                                                                                                                                </div>
                                                                                                                                        )}
                                                                                                                                        <div className="flex-grow overflow-hidden">
                                                                                                                                                <div className="h-full overflow-y-auto pr-2">
                                                                                                                                                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-4 md:line-clamp-none">
                                                                                                                                                                {activity.description}
                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                        </div>
                                                                                                                                </CardContent>
                                                                                                                        </Card>
                                                                                                                </motion.div>
                                                                                                        </div>
                                                                                                </SlideInSection>
                                                                                        ))}
                                                                                </div>
                                                                        ) : (
                                                                                <div className="text-center py-8 md:py-12">
                                                                                        <Activity className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                        <p className="text-sm md:text-base text-muted-foreground">No activities information available yet.</p>
                                                                                </div>
                                                                        )}
                                                                </TabsContent>

                                                                {/* Itinerary Tab - Mobile Optimized */}
                                                                <TabsContent value="itinerary">
                                                                        {getItinerary().length > 0 ? (
                                                                                <div className="space-y-4 md:space-y-8">
                                                                                        {getItinerary().map((day: any, index: number) => (
                                                                                                <FadeInSection key={day.id || index} delay={index * 0.1}>
                                                                                                        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/20 overflow-hidden">
                                                                                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                                                                                                                        {/* Left Column - Day Info & Activities */}
                                                                                                                        <div className="lg:col-span-5 p-4 md:p-6">
                                                                                                                                <div className="h-full flex flex-col">
                                                                                                                                        {/* Day Header */}
                                                                                                                                        <div className="mb-4 md:mb-6">
                                                                                                                                                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 mb-2 md:mb-3 px-2 md:px-3 py-1 text-xs md:text-sm">
                                                                                                                                                        Day {day.day}
                                                                                                                                                </Badge>
                                                                                                                                                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{day.title}</h3>
                                                                                                                                        </div>

                                                                                                                                        {/* Activities Section */}
                                                                                                                                        <div className="flex-grow">
                                                                                                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4">
                                                                                                                                                        <h4 className="font-semibold text-foreground text-base md:text-lg flex items-center">
                                                                                                                                                                <Activity className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mr-2" />
                                                                                                                                                                Day Activities
                                                                                                                                                        </h4>
                                                                                                                                                        {day.meals && (
                                                                                                                                                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs md:text-sm mt-2 sm:mt-0">
                                                                                                                                                                        {day.meals}
                                                                                                                                                                </Badge>
                                                                                                                                                        )}
                                                                                                                                                </div>

                                                                                                                                                <div className="space-y-2 pr-2">
                                                                                                                                                        {day.activities && day.activities.map((activity: any, idx: number) => (
                                                                                                                                                                <motion.div
                                                                                                                                                                        key={idx}
                                                                                                                                                                        initial={{ opacity: 0, x: -10 }}
                                                                                                                                                                        animate={{ opacity: 1, x: 0 }}
                                                                                                                                                                        transition={{ delay: idx * 0.05 }}
                                                                                                                                                                        className="flex items-start space-x-2 md:space-x-3 group"
                                                                                                                                                                >
                                                                                                                                                                        <div className="flex-shrink-0 mt-1">
                                                                                                                                                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex-grow">
                                                                                                                                                                                <p className="text-xs md:text-sm text-foreground/90 leading-relaxed group-hover:text-emerald-600 transition-colors duration-300">
                                                                                                                                                                                        {activity}
                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                </motion.div>
                                                                                                                                                        ))}
                                                                                                                                                </div>

                                                                                                                                                {/* Additional Info */}
                                                                                                                                                {(day.highlights || day.tips) && (
                                                                                                                                                        <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
                                                                                                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                                                                                                                                        {day.highlights && (
                                                                                                                                                                                <div>
                                                                                                                                                                                        <h5 className="font-semibold text-foreground mb-1 md:mb-2 flex items-center text-xs md:text-sm">
                                                                                                                                                                                                <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-500 mr-1 md:mr-2" />
                                                                                                                                                                                                Key Highlights
                                                                                                                                                                                        </h5>
                                                                                                                                                                                        <p className="text-xs md:text-sm text-muted-foreground">{day.highlights}</p>
                                                                                                                                                                                </div>
                                                                                                                                                                        )}
                                                                                                                                                                        {day.tips && (
                                                                                                                                                                                <div>
                                                                                                                                                                                        <h5 className="font-semibold text-foreground mb-1 md:mb-2 flex items-center text-xs md:text-sm">
                                                                                                                                                                                                <Lightbulb className="w-3 h-3 md:w-4 md:h-4 text-teal-500 mr-1 md:mr-2" />
                                                                                                                                                                                                Travel Tips
                                                                                                                                                                                        </h5>
                                                                                                                                                                                        <p className="text-xs md:text-sm text-muted-foreground">{day.tips}</p>
                                                                                                                                                                                </div>
                                                                                                                                                                        )}
                                                                                                                                                                </div>
                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                                        </div>

                                                                                                                                        {/* Accomodation info if available */}
                                                                                                                                        {day.accommodation && (
                                                                                                                                                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                                                                                                                                                        <h5 className="font-semibold text-foreground mb-1 md:mb-2 flex items-center text-xs md:text-sm">
                                                                                                                                                                <Hotel className="w-3 h-3 md:w-4 md:h-4 text-teal-500 mr-1 md:mr-2" />
                                                                                                                                                                Accommodation
                                                                                                                                                        </h5>
                                                                                                                                                        <p className="text-xs md:text-sm text-muted-foreground">{day.accommodation}</p>
                                                                                                                                                </div>
                                                                                                                                        )}
                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Right Column - Image Gallery */}
                                                                                                                        <div className="lg:col-span-7 bg-gradient-to-br from-gray-50 to-gray-100/50 p-0">
                                                                                                                                {day.image_url ? (
                                                                                                                                        <div className="h-full relative overflow-hidden">
                                                                                                                                                {/* Main Image */}
                                                                                                                                                <div className="h-48 md:h-64 lg:h-full min-h-[200px] md:min-h-[300px] lg:min-h-full relative group">
                                                                                                                                                        <img
                                                                                                                                                                src={day.image_url || "/placeholder.svg"}
                                                                                                                                                                alt={`Day ${day.day} - ${day.title}`}
                                                                                                                                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                                                                                                                                        />
                                                                                                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                                                                                                                </div>

                                                                                                                                                {/* Additional Images Gallery */}
                                                                                                                                                {day.additional_images && day.additional_images.length > 0 && (
                                                                                                                                                        <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-2 md:p-3">
                                                                                                                                                                <p className="text-white text-xs md:text-sm mb-1 md:mb-2 font-medium">More Views</p>
                                                                                                                                                                <div className="flex gap-1 md:gap-2 overflow-x-auto max-w-[200px] md:max-w-[300px]">
                                                                                                                                                                        {day.additional_images.map((img: string, idx: number) => (
                                                                                                                                                                                <button
                                                                                                                                                                                        key={idx}
                                                                                                                                                                                        className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 rounded overflow-hidden border-2 border-white/30 hover:border-white transition-colors"
                                                                                                                                                                                        onClick={() => {
                                                                                                                                                                                                // You could implement a lightbox here
                                                                                                                                                                                                console.log('Open image:', img);
                                                                                                                                                                                        }}
                                                                                                                                                                                >
                                                                                                                                                                                        <img
                                                                                                                                                                                                src={img || "/placeholder.svg"}
                                                                                                                                                                                                alt={`View ${idx + 1}`}
                                                                                                                                                                                                className="w-full h-full object-cover"
                                                                                                                                                                                        />
                                                                                                                                                                                </button>
                                                                                                                                                                        ))}
                                                                                                                                                                </div>
                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                                        </div>
                                                                                                                                ) : (
                                                                                                                                        /* Fallback when no image */
                                                                                                                                        <div className="h-48 md:h-64 lg:h-full min-h-[200px] md:min-h-[300px] lg:min-h-full flex flex-col items-center justify-center p-4 md:p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                                                                                                                                                <Mountain className="w-8 h-8 md:w-12 md:h-12 text-gray-300 mb-2 md:mb-4" />
                                                                                                                                                <p className="text-xs md:text-sm text-gray-400">Image coming soon</p>
                                                                                                                                        </div>
                                                                                                                                )}
                                                                                                                        </div>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </FadeInSection>
                                                                                        ))}
                                                                                </div>
                                                                        ) : (
                                                                                <div className="text-center py-12 md:py-16 bg-white/50 rounded-2xl backdrop-blur-sm border border-white/20 px-4">
                                                                                        <Calendar className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4 md:mb-6" />
                                                                                        <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-2 md:mb-3">Itinerary Coming Soon</h3>
                                                                                        <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6 max-w-md mx-auto">
                                                                                                We're currently curating the perfect itinerary for {destination.name}.
                                                                                                Check back soon for detailed day-by-day planning.
                                                                                        </p>
                                                                                </div>
                                                                        )}
                                                                </TabsContent>

                                                                {/* Transport Tab - Mobile Optimized */}
                                                                <TabsContent value="transport">
                                                                        {transportData && Object.keys(transportData).length > 0 ? (
                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                                                                        {Object.entries(transportData).map(([key, value]: [string, any], index) => (
                                                                                                <SlideInSection key={key} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                                                                                                        <motion.div
                                                                                                                whileHover={{ y: -5 }}
                                                                                                                transition={{ type: "spring", stiffness: 300 }}
                                                                                                        >
                                                                                                                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                                                                                                        <CardContent className="p-4 md:p-6">
                                                                                                                                <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                                                                                                                                        <div className={`p-2 md:p-3 rounded-xl ${key === 'air' ? 'bg-emerald-100' :
                                                                                                                                                key === 'train' ? 'bg-teal-100' : 'bg-amber-100'
                                                                                                                                                }`}>
                                                                                                                                                {key === 'air' && <Plane className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />}
                                                                                                                                                {key === 'train' && <Train className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />}
                                                                                                                                                {key === 'road' && <Car className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />}
                                                                                                                                        </div>
                                                                                                                                        <h3 className="text-base md:text-lg font-bold text-foreground">{value.title}</h3>
                                                                                                                                </div>
                                                                                                                                <ul className="space-y-1 md:space-y-2">
                                                                                                                                        {value.details && value.details.map((detail: any, idx: number) => (
                                                                                                                                                <li key={idx} className="flex items-start space-x-1 md:space-x-2 text-xs md:text-sm text-muted-foreground">
                                                                                                                                                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                                                                                                                        <span className="line-clamp-2 md:line-clamp-none">{detail}</span>
                                                                                                                                                </li>
                                                                                                                                        ))}
                                                                                                                                </ul>
                                                                                                                        </CardContent>
                                                                                                                </Card>
                                                                                                        </motion.div>
                                                                                                </SlideInSection>
                                                                                        ))}
                                                                                </div>
                                                                        ) : (
                                                                                <div className="text-center py-8 md:py-12">
                                                                                        <Car className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                        <p className="text-sm md:text-base text-muted-foreground">No transport information available yet.</p>
                                                                                </div>
                                                                        )}
                                                                </TabsContent>

                                                                {/* Best Time to Visit Tab - Mobile Optimized */}
                                                                <TabsContent value="besttime">
                                                                        {seasonData && Object.keys(seasonData).length > 0 ? (
                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                                                                        {Object.entries(seasonData).map(([season, details]: [string, any], index) => (
                                                                                                <FadeInSection key={season} delay={index * 0.1}>
                                                                                                        <motion.div
                                                                                                                whileHover={{ scale: 1.05, y: -5 }}
                                                                                                                transition={{ type: "spring", stiffness: 300 }}
                                                                                                        >
                                                                                                                <Card className="h-full bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                                                                                                                        {/* Season Header with Gradient */}
                                                                                                                        <div className={`p-4 md:p-6 text-white relative overflow-hidden ${season === 'winter' ? 'bg-gradient-to-r from-cyan-500 to-blue-600' :
                                                                                                                                season === 'summer' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                                                                                                                                        'bg-gradient-to-r from-emerald-500 to-teal-600'
                                                                                                                                }`}>
                                                                                                                                <div className="absolute inset-0 bg-black/10"></div>
                                                                                                                                <div className="relative z-10">
                                                                                                                                        <Badge className={`text-xs md:text-sm capitalize mb-1 md:mb-2 ${season === 'winter' ? 'bg-cyan-700' :
                                                                                                                                                season === 'summer' ? 'bg-amber-700' :
                                                                                                                                                        'bg-emerald-700'
                                                                                                                                                }`}>
                                                                                                                                                {season}
                                                                                                                                        </Badge>
                                                                                                                                        <h3 className="text-lg md:text-xl font-bold">{details.season}</h3>
                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <CardContent className="p-4 md:p-6">
                                                                                                                                <div className="space-y-3 md:space-y-4">
                                                                                                                                        {details.weather && (
                                                                                                                                                <div className="flex items-start space-x-2 md:space-x-3">
                                                                                                                                                        <div className="p-1.5 md:p-2 bg-slate-100 rounded-lg flex-shrink-0">
                                                                                                                                                                <Thermometer className="w-3 h-3 md:w-4 md:h-4 text-slate-600" />
                                                                                                                                                        </div>
                                                                                                                                                        <div>
                                                                                                                                                                <p className="font-semibold text-foreground text-xs md:text-sm">Weather</p>
                                                                                                                                                                <p className="text-xs md:text-sm text-muted-foreground">{details.weather}</p>
                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                        )}

                                                                                                                                        {details.why_visit && (
                                                                                                                                                <div className="flex items-start space-x-2 md:space-x-3">
                                                                                                                                                        <div className="p-1.5 md:p-2 bg-slate-100 rounded-lg flex-shrink-0">
                                                                                                                                                                <Star className="w-3 h-3 md:w-4 md:h-4 text-slate-600" />
                                                                                                                                                        </div>
                                                                                                                                                        <div>
                                                                                                                                                                <p className="font-semibold text-foreground text-xs md:text-sm">Why Visit</p>
                                                                                                                                                                <p className="text-xs md:text-sm text-muted-foreground">{details.why_visit}</p>
                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                        )}

                                                                                                                                        {details.events && (
                                                                                                                                                <div className="flex items-start space-x-2 md:space-x-3">
                                                                                                                                                        <div className="p-1.5 md:p-2 bg-slate-100 rounded-lg flex-shrink-0">
                                                                                                                                                                <Calendar className="w-3 h-3 md:w-4 md:h-4 text-slate-600" />
                                                                                                                                                        </div>
                                                                                                                                                        <div>
                                                                                                                                                                <p className="font-semibold text-foreground text-xs md:text-sm">Events & Festivals</p>
                                                                                                                                                                <p className="text-xs md:text-sm text-muted-foreground">{details.events}</p>
                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                                        )}
                                                                                                                                </div>
                                                                                                                        </CardContent>
                                                                                                                </Card>
                                                                                                        </motion.div>
                                                                                                </FadeInSection>
                                                                                        ))}
                                                                                </div>
                                                                        ) : (
                                                                                <div className="text-center py-8 md:py-12">
                                                                                        <Thermometer className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                        <p className="text-sm md:text-base text-muted-foreground">No seasonal information available yet.</p>
                                                                                </div>
                                                                        )}
                                                                </TabsContent>

                                                                {/* Accommodation Tab - Mobile Optimized */}
                                                                <TabsContent value="accommodation">
                                                                        {accommodationData && Object.keys(accommodationData).length > 0 ? (
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                                                        {Object.entries(accommodationData).map(([category, details]: [string, any], index) => (
                                                                                                <SlideInSection key={category} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                                                                                                        <motion.div
                                                                                                                whileHover={{ y: -5 }}
                                                                                                                transition={{ type: "spring", stiffness: 300 }}
                                                                                                        >
                                                                                                                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                                                                                                        <CardContent className="p-4 md:p-6">
                                                                                                                                <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                                                                                                                                        <div className="p-1.5 md:p-2 bg-teal-100 rounded-lg">
                                                                                                                                                <Hotel className="w-4 h-4 md:w-5 md:h-5 text-teal-600" />
                                                                                                                                        </div>
                                                                                                                                        <h3 className="text-base md:text-lg font-bold text-foreground capitalize">{category}</h3>
                                                                                                                                </div>

                                                                                                                                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{details.description}</p>

                                                                                                                                {details.options && details.options.length > 0 && (
                                                                                                                                        <div>
                                                                                                                                                <p className="font-semibold text-foreground text-xs md:text-sm mb-1 md:mb-2">Options:</p>
                                                                                                                                                <ul className="space-y-1">
                                                                                                                                                        {details.options.map((option: any, idx: number) => (
                                                                                                                                                                <li key={idx} className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-muted-foreground">
                                                                                                                                                                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-teal-500 rounded-full flex-shrink-0"></div>
                                                                                                                                                                        <span className="line-clamp-1 md:line-clamp-none">{option}</span>
                                                                                                                                                                </li>
                                                                                                                                                        ))}
                                                                                                                                                </ul>
                                                                                                                                        </div>
                                                                                                                                )}
                                                                                                                        </CardContent>
                                                                                                                </Card>
                                                                                                        </motion.div>
                                                                                                </SlideInSection>
                                                                                        ))}
                                                                                </div>
                                                                        ) : (
                                                                                <div className="text-center py-8 md:py-12">
                                                                                        <Hotel className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                        <p className="text-sm md:text-base text-muted-foreground">No accommodation information available yet.</p>
                                                                                </div>
                                                                        )}
                                                                </TabsContent>

                                                                {/* FAQs Tab - Mobile Optimized */}
                                                                <TabsContent value="faqs">
                                                                        {getFAQs().length > 0 ? (
                                                                                <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
                                                                                        {getFAQs().map((faq: any, index: number) => (
                                                                                                <FadeInSection key={faq.id || index} delay={index * 0.1}>
                                                                                                        <AccordionItem value={`faq-${faq.id || index}`} className="bg-white/80 backdrop-blur-sm rounded-xl border-0 shadow-lg px-4 md:px-6">
                                                                                                                <AccordionTrigger className="hover:no-underline [&[data-state=open]]:text-emerald-600 py-3 md:py-4">
                                                                                                                        <div className="flex items-start space-x-2 md:space-x-3 text-left">
                                                                                                                                <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                                                                                                <span className="text-sm md:text-base font-semibold">{faq.question}</span>
                                                                                                                        </div>
                                                                                                                </AccordionTrigger>
                                                                                                                <AccordionContent className="text-xs md:text-sm text-muted-foreground pt-2 pb-3 md:pb-4">
                                                                                                                        {faq.answer}
                                                                                                                </AccordionContent>
                                                                                                        </AccordionItem>
                                                                                                </FadeInSection>
                                                                                        ))}
                                                                                </Accordion>
                                                                        ) : (
                                                                                <div className="text-center py-8 md:py-12">
                                                                                        <HelpCircle className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                        <p className="text-sm md:text-base text-muted-foreground">No FAQs available yet.</p>
                                                                                </div>
                                                                        )}
                                                                </TabsContent>
                                                        </Tabs>
                                                </div>
                                        </div>
                                </section>

                                <div className="my-12 md:my-16 max-w-3xl border-b mx-auto px-4 border-gray-200" />

                                <div className="px-4">
                                        {destination.map_url && (
                                                <LocationMapEmbed
                                                        mapUrl={destination.map_url}
                                                        height="400px"
                                                        showTitle={true}
                                                        showBadge={true}
                                                        showAddress={true}
                                                        showOpenButton={true}
                                                />
                                        )}
                                </div>


                                {/* Enhanced CTA Section - Mobile Optimized */}
                                <FadeInSection>
                                        <section className="py-12 md:py-20 hero-gradient text-white relative overflow-hidden">
                                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
                                                <div className="container mx-auto px-4 relative z-10">
                                                        <div className="max-w-4xl mx-auto text-center">
                                                                <motion.h2
                                                                        className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 px-4"
                                                                        initial={{ opacity: 0, y: 30 }}
                                                                        whileInView={{ opacity: 1, y: 0 }}
                                                                        transition={{ duration: 0.6 }}
                                                                >
                                                                        Ready to Explore {destination.name}?
                                                                </motion.h2>
                                                                <motion.p
                                                                        className="text-base md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed px-4"
                                                                        initial={{ opacity: 0, y: 30 }}
                                                                        whileInView={{ opacity: 1, y: 0 }}
                                                                        transition={{ duration: 0.6, delay: 0.2 }}
                                                                >
                                                                        Contact us for personalized travel planning and expert guidance for your perfect journey.
                                                                </motion.p>
                                                                <motion.div
                                                                        className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4"
                                                                        initial={{ opacity: 0, y: 30 }}
                                                                        whileInView={{ opacity: 1, y: 0 }}
                                                                        transition={{ duration: 0.6, delay: 0.4 }}
                                                                >
                                                                        <Button
                                                                                size="lg"
                                                                                className="bg-white text-emerald-600 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto"
                                                                                onClick={() => window.location.href = 'tel:919910775073'}
                                                                        >
                                                                                Call Now: +91 99107 75073
                                                                        </Button>
                                                                        <Button
                                                                                size="lg"
                                                                                variant="outline"
                                                                                className="border-white text-white hover:bg-white hover:text-emerald-600 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto bg-transparent"
                                                                                onClick={() => setIsEnquiryModalOpen(true)}
                                                                        >
                                                                                Enquire Now
                                                                        </Button>
                                                                </motion.div>
                                                        </div>
                                                </div>
                                        </section>
                                </FadeInSection>

                                <Footer />
                        </div>
                </>
        )
}

export default DestinationDetail