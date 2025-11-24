"use client"

import Image from "next/image";
import type { Tables } from "@/integrations/supabase/types";
import { useParams } from "next/navigation"
import Link from "next/link"
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
        Shield
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import React from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const DestinationDetail = () => {
        const params = useParams();
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const [destination, setDestination] = React.useState<Tables<"destinations"> | null>(null)
        const [loading, setLoading] = React.useState(true)
        const [activeTab, setActiveTab] = React.useState("overview")

        console.log("URL ID:", id)
        console.log("Loading state:", loading)
        console.log("Destination data:", destination)

        React.useEffect(() => {
                console.log("useEffect triggered with id:", id)
                if (id) {
                        fetchDestination()
                } else {
                        console.log("No ID found in URL")
                        setLoading(false)
                }
        }, [id])


        const fetchDestination = async () => {
                try {
                        console.log("Fetching destination with ID:", id)

                        const { data, error, status } = await supabase
                                .from("destinations")
                                .select("*")
                                .eq("id", id as string)
                                .single() // Use single() instead of maybeSingle()

                        console.log("Supabase response:", { data, error, status })

                        if (error) {
                                console.error("Supabase error:", error)
                                throw error
                        }

                        if (data) {
                                console.log("Destination found:", data)
                                setDestination(data)
                        } else {
                                console.log("No destination found with ID:", id)
                                setDestination(null)
                        }
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

        // Get things to do as array
        const getThingsToDo = () => {
                const thingsData = parseJSONData(destination?.things_to_do);
                return Object.values(thingsData);
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
                                <div className="pt-32 pb-16 text-center">
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
                                <div className="pt-32 pb-16 text-center">
                                        <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                        >
                                                <h1 className="text-4xl font-bold text-foreground mb-4">Destination Not Found</h1>
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

        return (
                <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50/30">
                        <Header />

                        {/* Animated Hero Section */}
                        <section className="pt-32 pb-20 relative overflow-hidden hero-gradient">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/20 to-cyan-500/20"></div>
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>

                                <div className="container mx-auto px-4 relative z-10">
                                        <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="max-w-6xl mx-auto"
                                        >
                                                <Link
                                                        href="/destinations"
                                                        className="inline-flex items-center text-foreground/70 hover:text-foreground mb-8 transition-all duration-300 group"
                                                >
                                                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                                        Back to Destinations
                                                </Link>

                                                <div className="flex flex-wrap gap-3 mb-6">
                                                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 text-sm">
                                                                {destination.category}
                                                        </Badge>

                                                        {destination.featured && (
                                                                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 px-3 py-1 text-sm">
                                                                        Featured
                                                                </Badge>
                                                        )}
                                                </div>

                                                <motion.h1
                                                        className="text-5xl md:text-7xl font-bold mb-6 text-luxury"
                                                        initial={{ opacity: 0, y: 40 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.8, delay: 0.2 }}
                                                >
                                                        {destination.name}
                                                </motion.h1>

                                                <motion.p
                                                        className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl"
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.8, delay: 0.4 }}
                                                >
                                                        {destination.description}
                                                </motion.p>

                                                {/* Stats Grid */}
                                                <motion.div
                                                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.8, delay: 0.6 }}
                                                >
                                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                                                                <div className="flex items-center space-x-3">
                                                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                                                                <Clock className="w-5 h-5 text-emerald-600" />
                                                                        </div>
                                                                        <div>
                                                                                <p className="text-sm text-muted-foreground">Duration</p>
                                                                                <p className="font-semibold text-foreground">{destination.duration}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                                                                <div className="flex items-center space-x-3">
                                                                        <div className="p-2 bg-amber-100 rounded-lg">
                                                                                <Mountain className="w-5 h-5 text-amber-600" />
                                                                        </div>
                                                                        <div>
                                                                                <p className="text-sm text-muted-foreground">Difficulty</p>
                                                                                <p className="font-semibold text-foreground">{destination.difficulty}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                                                                <div className="flex items-center space-x-3">
                                                                        <div className="p-2 bg-teal-100 rounded-lg">
                                                                                <Thermometer className="w-5 h-5 text-teal-600" />
                                                                        </div>
                                                                        <div>
                                                                                <p className="text-sm text-muted-foreground">Best Time</p>
                                                                                <p className="font-semibold text-foreground">{destination.best_time}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                                                                <div className="flex items-center space-x-3">
                                                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                                                                <Compass className="w-5 h-5 text-cyan-600" />
                                                                        </div>
                                                                        <div>
                                                                                <p className="text-sm text-muted-foreground">Altitude</p>
                                                                                <p className="font-semibold text-foreground">{destination.altitude}</p>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </motion.div>

                                                <motion.div
                                                        className="flex flex-col sm:flex-row gap-4"
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.8, delay: 0.8 }}
                                                >
                                                        <Button
                                                                size="lg"
                                                                className="hero-gradient text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                                                                onClick={() => {
                                                                        window.location.href = `mailto:shantihimalaya@gmail.com?subject=Enquiry about ${encodeURIComponent(destination.name)}&body=Hi, I would like to know more about ${encodeURIComponent(destination.name)}.`;
                                                                }}
                                                        >
                                                                Enquire Now
                                                        </Button>
                                                </motion.div>
                                        </motion.div>
                                </div>
                        </section>

                        {/* Destination Banner Image */}
                        {destination.image_url && (
                                <section className="py-8 bg-transparent">
                                        <div className="container mx-auto px-4">
                                                <div className="max-w-6xl mx-auto">
                                                        <motion.div
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.6 }}
                                                                className="rounded-2xl overflow-hidden shadow-2xl"
                                                        >
                                                                <img
                                                                        src={destination.image_url}
                                                                        alt={destination.name}
                                                                        className="w-full h-48 md:h-64 lg:h-80 object-cover"
                                                                />
                                                        </motion.div>
                                                </div>
                                        </div>
                                </section>
                        )}

                        {/* Interactive Tabs Section */}
                        <section className="py-16 bg-transparent">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-6xl mx-auto">
                                                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                                                        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-2 bg-background/50 backdrop-blur-sm p-1 rounded-2xl border">
                                                                <TabsTrigger value="overview" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white">
                                                                        Overview
                                                                </TabsTrigger>
                                                                <TabsTrigger value="places" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white">
                                                                        Places
                                                                </TabsTrigger>
                                                                <TabsTrigger value="activities" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white">
                                                                        Activities
                                                                </TabsTrigger>
                                                                <TabsTrigger value="itinerary" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white">
                                                                        Itinerary
                                                                </TabsTrigger>
                                                                <TabsTrigger value="transport" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white">
                                                                        Transport
                                                                </TabsTrigger>
                                                                <TabsTrigger value="besttime" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white">
                                                                        Best Time to Visit
                                                                </TabsTrigger>
                                                                <TabsTrigger value="accommodation" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white">
                                                                        Stay
                                                                </TabsTrigger>
                                                                <TabsTrigger value="faqs" className="rounded-xl data-[state=active]:hero-gradient data-[state=active]:text-white">
                                                                        FAQs
                                                                </TabsTrigger>
                                                        </TabsList>

                                                        {/* Overview Tab */}
                                                        <TabsContent value="overview" className="space-y-8">
                                                                <FadeInSection>
                                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                                                <div className="lg:col-span-2 space-y-6">
                                                                                        {destination.overview_image_url && (
                                                                                                <div className="rounded-2xl overflow-hidden shadow-lg">
                                                                                                        <img
                                                                                                                src={destination.overview_image_url}
                                                                                                                alt={`${destination.name} Overview`}
                                                                                                                className="w-full h-64 object-cover"
                                                                                                        />
                                                                                                </div>
                                                                                        )}
                                                                                        <div>
                                                                                                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                                                                                        About {destination.name}
                                                                                                </h2>
                                                                                                <p className="text-lg text-muted-foreground leading-relaxed">
                                                                                                        {destination.overview || destination.description}
                                                                                                </p>
                                                                                        </div>

                                                                                        {destination.highlights && destination.highlights.length > 0 && (
                                                                                                <div>
                                                                                                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                                                                                                                <Star className="w-6 h-6 text-amber-500 mr-2" />
                                                                                                                Key Highlights
                                                                                                        </h3>
                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                                                {destination.highlights.map((highlight: any, index: number) => (
                                                                                                                        <motion.div
                                                                                                                                key={index}
                                                                                                                                className="flex items-start space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-shadow duration-300"
                                                                                                                                whileHover={{ scale: 1.02 }}
                                                                                                                                transition={{ type: "spring", stiffness: 300 }}
                                                                                                                        >
                                                                                                                                <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg">
                                                                                                                                        <Star className="w-4 h-4 text-white" />
                                                                                                                                </div>
                                                                                                                                <span className="text-foreground font-medium">{highlight}</span>
                                                                                                                        </motion.div>
                                                                                                                ))}
                                                                                                        </div>
                                                                                                </div>
                                                                                        )}
                                                                                </div>

                                                                                {/* Quick Facts Sidebar */}
                                                                                <div className="space-y-6">
                                                                                        <Card className="bg-gradient-to-br from-white to-emerald-50/50 backdrop-blur-sm border-emerald-100 shadow-lg">
                                                                                                <CardContent className="p-6">
                                                                                                        <h3 className="text-xl font-bold mb-4 text-foreground">Quick Facts</h3>
                                                                                                        <div className="space-y-4">
                                                                                                                <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                                                                                                                        <span className="text-sm text-muted-foreground">Duration</span>
                                                                                                                        <span className="font-semibold text-foreground">{destination.duration}</span>
                                                                                                                </div>
                                                                                                                <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                                                                                                                        <span className="text-sm text-muted-foreground">Difficulty</span>
                                                                                                                        <Badge className="bg-amber-100 text-amber-700">{destination.difficulty}</Badge>
                                                                                                                </div>
                                                                                                                <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                                                                                                                        <span className="text-sm text-muted-foreground">Best Season</span>
                                                                                                                        <span className="font-semibold text-foreground">{destination.best_time}</span>
                                                                                                                </div>
                                                                                                                <div className="flex justify-between items-center py-2">
                                                                                                                        <span className="text-sm text-muted-foreground">Max Altitude</span>
                                                                                                                        <span className="font-semibold text-foreground">{destination.altitude}</span>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </CardContent>
                                                                                        </Card>

                                                                                        {destination.travel_tips && destination.travel_tips.length > 0 && (
                                                                                                <Card className="bg-gradient-to-br from-white to-teal-50/50 backdrop-blur-sm border-teal-100 shadow-lg">
                                                                                                        <CardContent className="p-6">
                                                                                                                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center">
                                                                                                                        <Lightbulb className="w-5 h-5 text-teal-600 mr-2" />
                                                                                                                        Quick Tips
                                                                                                                </h3>
                                                                                                                <ul className="space-y-2">
                                                                                                                        {destination.travel_tips.slice(0, 3).map((tip: any, index: number) => (
                                                                                                                                <li key={index} className="flex items-start space-x-2 text-sm">
                                                                                                                                        <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
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

                                                        {/* Places to Visit Tab */}
                                                        <TabsContent value="places">
                                                                {destination.places_image_url && (
                                                                        <FadeInSection>
                                                                                <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
                                                                                        <img
                                                                                                src={destination.places_image_url}
                                                                                                alt={`${destination.name} Places to Visit`}
                                                                                                className="w-full h-64 object-cover"
                                                                                        />
                                                                                </div>
                                                                        </FadeInSection>
                                                                )}
                                                                {getPlacesToVisit().length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                                {getPlacesToVisit().map((place: any, index: number) => (
                                                                                        <FadeInSection key={place.id || index} delay={index * 0.1}>
                                                                                                <motion.div
                                                                                                        whileHover={{ y: -5 }}
                                                                                                        transition={{ type: "spring", stiffness: 300 }}
                                                                                                >
                                                                                                        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                                                                                                <CardContent className="p-6">
                                                                                                                        <div className="flex items-start space-x-3 mb-3">
                                                                                                                                <div className="p-2 hero-gradient rounded-lg group-hover:scale-110 transition-transform duration-300">
                                                                                                                                        <MapPin className="w-5 h-5 text-white" />
                                                                                                                                </div>
                                                                                                                                <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors duration-300">
                                                                                                                                        {place.name}
                                                                                                                                </h3>
                                                                                                                        </div>
                                                                                                                        {place.image_url && (
                                                                                                                                <div className="mb-4 rounded-lg overflow-hidden">
                                                                                                                                        <img
                                                                                                                                                src={place.image_url}
                                                                                                                                                alt={place.name}
                                                                                                                                                className="w-full h-40 object-cover"
                                                                                                                                        />
                                                                                                                                </div>
                                                                                                                        )}
                                                                                                                        <p className="text-muted-foreground mb-4 leading-relaxed">{place.description}</p>
                                                                                                                        {place.highlights && place.highlights.length > 0 && (
                                                                                                                                <div className="space-y-2">
                                                                                                                                        <p className="text-sm font-semibold text-foreground">Highlights:</p>
                                                                                                                                        <ul className="space-y-1">
                                                                                                                                                {place.highlights.map((highlight: any, idx: number) => (
                                                                                                                                                        <li key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                                                                                                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                                                                                                                                <span>{highlight}</span>
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
                                                                        <div className="text-center py-12">
                                                                                <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                <p className="text-muted-foreground">No places information available yet.</p>
                                                                        </div>
                                                                )}
                                                        </TabsContent>

                                                        {/* Things to Do Tab */}
                                                        <TabsContent value="activities">
                                                                {destination.activities_image_url && (
                                                                        <FadeInSection>
                                                                                <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
                                                                                        <img
                                                                                                src={destination.activities_image_url}
                                                                                                alt={`${destination.name} Things to Do`}
                                                                                                className="w-full h-64 object-cover"
                                                                                        />
                                                                                </div>
                                                                        </FadeInSection>
                                                                )}
                                                                {getThingsToDo().length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                {getThingsToDo().map((activity: any, index: number) => (
                                                                                        <SlideInSection key={activity.id || index} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                                                                                                <motion.div
                                                                                                        whileHover={{ scale: 1.02 }}
                                                                                                        transition={{ type: "spring", stiffness: 300 }}
                                                                                                >
                                                                                                        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                                                                                                <CardContent className="p-6">
                                                                                                                        <div className="flex items-center space-x-3 mb-3">
                                                                                                                                <div className="p-2 hero-gradient rounded-lg">
                                                                                                                                        <Activity className="w-5 h-5 text-white" />
                                                                                                                                </div>
                                                                                                                                <h3 className="text-lg font-bold text-foreground">{activity.title}</h3>
                                                                                                                        </div>
                                                                                                                        {activity.image_url && (
                                                                                                                                <div className="mb-4 rounded-lg overflow-hidden">
                                                                                                                                        <img
                                                                                                                                                src={activity.image_url}
                                                                                                                                                alt={activity.title}
                                                                                                                                                className="w-full h-40 object-cover"
                                                                                                                                        />
                                                                                                                                </div>
                                                                                                                        )}
                                                                                                                        <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
                                                                                                                </CardContent>
                                                                                                        </Card>
                                                                                                </motion.div>
                                                                                        </SlideInSection>
                                                                                ))}
                                                                        </div>
                                                                ) : (
                                                                        <div className="text-center py-12">
                                                                                <Activity className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                <p className="text-muted-foreground">No activities information available yet.</p>
                                                                        </div>
                                                                )}
                                                        </TabsContent>

                                                        {/* Itinerary Tab */}
                                                        {/* Itinerary Tab - Alternative Design */}
                                                        <TabsContent value="itinerary">
                                                                {getItinerary().length > 0 ? (
                                                                        <div className="space-y-8">
                                                                                {getItinerary().map((day: any, index: number) => (
                                                                                        <FadeInSection key={day.id || index} delay={index * 0.1}>
                                                                                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                                                                                                        {/* Left Content - Day Info */}
                                                                                                        <div className="lg:col-span-2">
                                                                                                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl h-full shadow-lg">
                                                                                                                        <Badge className="bg-white/20 text-white border-0 mb-3">Day {day.day}</Badge>
                                                                                                                        <h3 className="text-xl font-bold mb-4">{day.title}</h3>
                                                                                                                        <div className="flex items-center space-x-2 text-white/80">
                                                                                                                                <Calendar className="w-4 h-4" />
                                                                                                                                <span className="text-sm">Full Day Experience</span>
                                                                                                                        </div>
                                                                                                                </div>
                                                                                                        </div>

                                                                                                        {/* Right Content - Activities & Image */}
                                                                                                        <div className="lg:col-span-3">
                                                                                                                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                                                                                                        <CardContent className="p-6">
                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                                                                        {/* Activities List */}
                                                                                                                                        <div className="md:col-span-2">
                                                                                                                                                <h4 className="font-semibold text-foreground mb-3 flex items-center">
                                                                                                                                                        <Activity className="w-4 h-4 text-emerald-500 mr-2" />
                                                                                                                                                        Activities
                                                                                                                                                </h4>
                                                                                                                                                <ul className="space-y-2">
                                                                                                                                                        {day.activities && day.activities.map((activity: any, idx: number) => (
                                                                                                                                                                <li key={idx} className="flex items-start space-x-2 text-sm text-muted-foreground">
                                                                                                                                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                                                                                                                                                        <span>{activity}</span>
                                                                                                                                                                </li>
                                                                                                                                                        ))}
                                                                                                                                                </ul>
                                                                                                                                        </div>

                                                                                                                                        {/* Image */}
                                                                                                                                        <div className="md:col-span-1">
                                                                                                                                                {day.image_url ? (
                                                                                                                                                        <div className="rounded-lg overflow-hidden h-32 md:h-full">
                                                                                                                                                                <img
                                                                                                                                                                        src={day.image_url}
                                                                                                                                                                        alt={`Day ${day.day}`}
                                                                                                                                                                        className="w-full h-full object-cover"
                                                                                                                                                                />
                                                                                                                                                        </div>
                                                                                                                                                ) : (
                                                                                                                                                        <div className="rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 h-32 md:h-full flex items-center justify-center">
                                                                                                                                                                <Calendar className="w-8 h-8 text-gray-400" />
                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                                        </div>
                                                                                                                                </div>
                                                                                                                        </CardContent>
                                                                                                                </Card>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </FadeInSection>
                                                                                ))}
                                                                        </div>
                                                                ) : (
                                                                        <div className="text-center py-12">
                                                                                <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                <p className="text-muted-foreground">No itinerary information available yet.</p>
                                                                        </div>
                                                                )}
                                                        </TabsContent>

                                                        {/* Transport Tab */}
                                                        <TabsContent value="transport">
                                                                {transportData && Object.keys(transportData).length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                {Object.entries(transportData).map(([key, value]: [string, any], index) => (
                                                                                        <SlideInSection key={key} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                                                                                                <motion.div
                                                                                                        whileHover={{ y: -5 }}
                                                                                                        transition={{ type: "spring", stiffness: 300 }}
                                                                                                >
                                                                                                        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                                                                                                <CardContent className="p-6">
                                                                                                                        <div className="flex items-center space-x-3 mb-4">
                                                                                                                                <div className={`p-3 rounded-xl ${key === 'air' ? 'bg-emerald-100' :
                                                                                                                                        key === 'train' ? 'bg-teal-100' : 'bg-amber-100'
                                                                                                                                        }`}>
                                                                                                                                        {key === 'air' && <Plane className="w-6 h-6 text-emerald-600" />}
                                                                                                                                        {key === 'train' && <Train className="w-6 h-6 text-teal-600" />}
                                                                                                                                        {key === 'road' && <Car className="w-6 h-6 text-amber-600" />}
                                                                                                                                </div>
                                                                                                                                <h3 className="text-lg font-bold text-foreground">{value.title}</h3>
                                                                                                                        </div>
                                                                                                                        <ul className="space-y-2">
                                                                                                                                {value.details && value.details.map((detail: any, idx: number) => (
                                                                                                                                        <li key={idx} className="flex items-start space-x-2 text-sm text-muted-foreground">
                                                                                                                                                <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                                                                                                                <span>{detail}</span>
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
                                                                        <div className="text-center py-12">
                                                                                <Car className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                <p className="text-muted-foreground">No transport information available yet.</p>
                                                                        </div>
                                                                )}
                                                        </TabsContent>

                                                        {/* Best Time to Visit Tab */}
                                                        <TabsContent value="besttime">
                                                                {seasonData && Object.keys(seasonData).length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                                {Object.entries(seasonData).map(([season, details]: [string, any], index) => (
                                                                                        <FadeInSection key={season} delay={index * 0.1}>
                                                                                                <motion.div
                                                                                                        whileHover={{ scale: 1.05, y: -5 }}
                                                                                                        transition={{ type: "spring", stiffness: 300 }}
                                                                                                >
                                                                                                        <Card className="h-full bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                                                                                                                {/* Season Header with Gradient */}
                                                                                                                <div className={`p-6 text-white relative overflow-hidden ${season === 'winter' ? 'bg-gradient-to-r from-cyan-500 to-blue-600' :
                                                                                                                        season === 'summer' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                                                                                                                                'bg-gradient-to-r from-emerald-500 to-teal-600'
                                                                                                                        }`}>
                                                                                                                        <div className="absolute inset-0 bg-black/10"></div>
                                                                                                                        <div className="relative z-10">
                                                                                                                                <Badge className={`text-sm capitalize mb-2 ${season === 'winter' ? 'bg-cyan-700' :
                                                                                                                                        season === 'summer' ? 'bg-amber-700' :
                                                                                                                                                'bg-emerald-700'
                                                                                                                                        }`}>
                                                                                                                                        {season}
                                                                                                                                </Badge>
                                                                                                                                <h3 className="text-xl font-bold">{details.season}</h3>
                                                                                                                        </div>
                                                                                                                </div>

                                                                                                                <CardContent className="p-6">
                                                                                                                        <div className="space-y-4">
                                                                                                                                {details.weather && (
                                                                                                                                        <div className="flex items-start space-x-3">
                                                                                                                                                <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                                                                                                                                                        <Thermometer className="w-4 h-4 text-slate-600" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                        <p className="font-semibold text-foreground text-sm">Weather</p>
                                                                                                                                                        <p className="text-muted-foreground text-sm">{details.weather}</p>
                                                                                                                                                </div>
                                                                                                                                        </div>
                                                                                                                                )}

                                                                                                                                {details.why_visit && (
                                                                                                                                        <div className="flex items-start space-x-3">
                                                                                                                                                <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                                                                                                                                                        <Star className="w-4 h-4 text-slate-600" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                        <p className="font-semibold text-foreground text-sm">Why Visit</p>
                                                                                                                                                        <p className="text-muted-foreground text-sm">{details.why_visit}</p>
                                                                                                                                                </div>
                                                                                                                                        </div>
                                                                                                                                )}

                                                                                                                                {details.events && (
                                                                                                                                        <div className="flex items-start space-x-3">
                                                                                                                                                <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                                                                                                                                                        <Calendar className="w-4 h-4 text-slate-600" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                        <p className="font-semibold text-foreground text-sm">Events & Festivals</p>
                                                                                                                                                        <p className="text-muted-foreground text-sm">{details.events}</p>
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
                                                                        <div className="text-center py-12">
                                                                                <Thermometer className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                <p className="text-muted-foreground">No seasonal information available yet.</p>
                                                                        </div>
                                                                )}
                                                        </TabsContent>

                                                        {/* Accommodation Tab */}
                                                        <TabsContent value="accommodation">
                                                                {accommodationData && Object.keys(accommodationData).length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                {Object.entries(accommodationData).map(([category, details]: [string, any], index) => (
                                                                                        <SlideInSection key={category} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                                                                                                <motion.div
                                                                                                        whileHover={{ y: -5 }}
                                                                                                        transition={{ type: "spring", stiffness: 300 }}
                                                                                                >
                                                                                                        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                                                                                                <CardContent className="p-6">
                                                                                                                        <div className="flex items-center space-x-3 mb-4">
                                                                                                                                <div className="p-2 bg-teal-100 rounded-lg">
                                                                                                                                        <Hotel className="w-5 h-5 text-teal-600" />
                                                                                                                                </div>
                                                                                                                                <h3 className="text-lg font-bold text-foreground capitalize">{category}</h3>
                                                                                                                        </div>

                                                                                                                        <p className="text-muted-foreground mb-4 text-sm">{details.description}</p>

                                                                                                                        {details.options && details.options.length > 0 && (
                                                                                                                                <div>
                                                                                                                                        <p className="font-semibold text-foreground text-sm mb-2">Options:</p>
                                                                                                                                        <ul className="space-y-1">
                                                                                                                                                {details.options.map((option: any, idx: number) => (
                                                                                                                                                        <li key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                                                                                                                                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                                                                                                                                                                <span>{option}</span>
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
                                                                        <div className="text-center py-12">
                                                                                <Hotel className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                <p className="text-muted-foreground">No accommodation information available yet.</p>
                                                                        </div>
                                                                )}
                                                        </TabsContent>

                                                        {/* FAQs Tab */}
                                                        <TabsContent value="faqs">
                                                                {getFAQs().length > 0 ? (
                                                                        <Accordion type="single" collapsible className="space-y-4">
                                                                                {getFAQs().map((faq: any, index: number) => (
                                                                                        <FadeInSection key={faq.id || index} delay={index * 0.1}>
                                                                                                <AccordionItem value={`faq-${faq.id || index}`} className="bg-white/80 backdrop-blur-sm rounded-xl border-0 shadow-lg px-6">
                                                                                                        <AccordionTrigger className="hover:no-underline [&[data-state=open]]:text-emerald-600">
                                                                                                                <div className="flex items-center space-x-3 text-left">
                                                                                                                        <HelpCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                                                                                        <span className="font-semibold">{faq.question}</span>
                                                                                                                </div>
                                                                                                        </AccordionTrigger>
                                                                                                        <AccordionContent className="text-muted-foreground pt-2 pb-4">
                                                                                                                {faq.answer}
                                                                                                        </AccordionContent>
                                                                                                </AccordionItem>
                                                                                        </FadeInSection>
                                                                                ))}
                                                                        </Accordion>
                                                                ) : (
                                                                        <div className="text-center py-12">
                                                                                <HelpCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                                                                <p className="text-muted-foreground">No FAQs available yet.</p>
                                                                        </div>
                                                                )}
                                                        </TabsContent>
                                                </Tabs>
                                        </div>
                                </div>
                        </section>

                        {/* Enhanced CTA Section */}
                        <FadeInSection>
                                <section className="py-20 hero-gradient text-white relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
                                        <div className="container mx-auto px-4 relative z-10">
                                                <div className="max-w-4xl mx-auto text-center">
                                                        <motion.h2
                                                                className="text-4xl font-bold mb-6"
                                                                initial={{ opacity: 0, y: 30 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.6 }}
                                                        >
                                                                Ready to Explore {destination.name}?
                                                        </motion.h2>
                                                        <motion.p
                                                                className="text-xl text-white/90 mb-8 leading-relaxed"
                                                                initial={{ opacity: 0, y: 30 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.6, delay: 0.2 }}
                                                        >
                                                                Contact us for personalized travel planning and expert guidance for your perfect journey.
                                                        </motion.p>
                                                        <motion.div
                                                                className="flex flex-col sm:flex-row gap-4 justify-center"
                                                                initial={{ opacity: 0, y: 30 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.6, delay: 0.4 }}
                                                        >
                                                                <Button
                                                                        size="lg"
                                                                        className="bg-white text-emerald-600 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl text-lg px-8 py-4"
                                                                >
                                                                        Enquire Now
                                                                </Button>
                                                        </motion.div>

                                                        <motion.div
                                                                className="mt-8 flex flex-wrap justify-center gap-6 text-white/80"
                                                                initial={{ opacity: 0 }}
                                                                whileInView={{ opacity: 1 }}
                                                                transition={{ duration: 0.6, delay: 0.6 }}
                                                        >
                                                                <div className="flex items-center space-x-2">
                                                                        <Shield className="w-5 h-5" />
                                                                        <span>100% Safe & Secure</span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                        <Users className="w-5 h-5" />
                                                                        <span>Expert Guides</span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                        <Star className="w-5 h-5" />
                                                                        <span>5-Star Rated</span>
                                                                </div>
                                                        </motion.div>
                                                </div>
                                        </div>
                                </section>
                        </FadeInSection>

                        <Footer />
                </div>
        )
}

export default DestinationDetail