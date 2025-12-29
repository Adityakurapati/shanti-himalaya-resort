"use client";

import Image from "next/image";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
        Mountain,
        Clock,
        Users,
        Star,
        ArrowLeft,
        Phone,
        Mail,
        CheckCircle,
        Calendar,
        MapPin,
        Camera,
        Utensils,
        Home,
        TrendingUp,
        ChevronDown,
        ChevronUp,
        Play,
        ChevronLeft,
        ChevronRight
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type DaySchedule = {
        id: string;
        day_number: number;
        title: string | null;
        description: string | null;
        image_url: string | null;
};



const DayCard = ({ day, isExpanded, onToggle, index }: {
        day: DaySchedule;
        isExpanded: boolean;
        onToggle: () => void;
        index: number;
}) => {
        return (
                <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-4 sm:px-0"
                >
                        <Card className={`overflow-hidden border-2 transition-all duration-300 ${isExpanded ? 'border-primary shadow-xl scale-[1.02]' : 'border-border hover:border-primary/50'
                                }`}>
                                <CardContent className="p-0">
                                        {/* Day Header */}
                                        <div
                                                className="p-6 cursor-pointer bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all relative z-10"
                                                onClick={onToggle}
                                        >
                                                <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                                <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-lg flex-shrink-0 relative z-20">
                                                                        {day.day_number}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                        <h3 className="text-xl font-bold text-foreground truncate">
                                                                                {day.title || `Day ${day.day_number}`}
                                                                        </h3>
                                                                        {day.description && (
                                                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                                                        {day.description}
                                                                                </p>
                                                                        )}
                                                                </div>
                                                        </div>

                                                        <div className="flex items-center space-x-3 flex-shrink-0">
                                                                {day.image_url && (
                                                                        <Camera className="w-5 h-5 text-primary" />
                                                                )}
                                                                <motion.div
                                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                >
                                                                        <ChevronDown className="w-6 h-6 text-muted-foreground" />
                                                                </motion.div>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Expandable Content */}
                                        <AnimatePresence>
                                                {isExpanded && (
                                                        <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden relative z-0"
                                                        >
                                                                <div className="p-6 space-y-4 bg-background">
                                                                        {day.image_url && (
                                                                                <motion.div
                                                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                                        transition={{ delay: 0.2 }}
                                                                                        className="rounded-lg overflow-hidden shadow-lg"
                                                                                >
                                                                                        <img
                                                                                                src={day.image_url}
                                                                                                alt={`Day ${day.day_number}`}
                                                                                                className="w-full h-48 object-cover transition-transform hover:scale-105 duration-500"
                                                                                        />
                                                                                </motion.div>
                                                                        )}

                                                                        {day.description && (
                                                                                <motion.p
                                                                                        initial={{ opacity: 0, y: 10 }}
                                                                                        animate={{ opacity: 1, y: 0 }}
                                                                                        transition={{ delay: 0.3 }}
                                                                                        className="text-muted-foreground leading-relaxed"
                                                                                >
                                                                                        {day.description}
                                                                                </motion.p>
                                                                        )}

                                                                        {/* Activity Icons */}
                                                                        <motion.div
                                                                                initial={{ opacity: 0 }}
                                                                                animate={{ opacity: 1 }}
                                                                                transition={{ delay: 0.4 }}
                                                                                className="flex items-center space-x-4 pt-4 border-t"
                                                                        >
                                                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                                                        <TrendingUp className="w-4 h-4" />
                                                                                        <span>Trekking</span>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                                                        <Home className="w-4 h-4" />
                                                                                        <span>Lodge Stay</span>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                                                        <Utensils className="w-4 h-4" />
                                                                                        <span>Meals</span>
                                                                                </div>
                                                                        </motion.div>
                                                                </div>
                                                        </motion.div>
                                                )}
                                        </AnimatePresence>
                                </CardContent>
                        </Card>
                </motion.div>
        );
};

const EnquiryModal = ({ journey, isOpen, onClose }: { journey: any, isOpen: boolean, onClose: () => void }) => {
        const [formData, setFormData] = React.useState({
                name: '',
                email: '',
                message: ''
        });
        const [isSubmitting, setIsSubmitting] = React.useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                setIsSubmitting(true);

                try {
                        const { error } = await supabase
                                .from('enquiries')
                                .insert([
                                        {
                                                journey_id: journey.id,
                                                journey_title: journey.title,
                                                name: formData.name,
                                                email: formData.email,
                                                message: formData.message,
                                                status: 'new'
                                        }
                                ]);

                        if (error) throw error;

                        // Reset form and close modal
                        setFormData({ name: '', email: '', message: '' });
                        onClose();
                        alert('Thank you for your enquiry! We will get back to you soon.');
                } catch (error) {
                        console.error('Error submitting enquiry:', error);
                        alert('There was an error submitting your enquiry. Please try again.');
                } finally {
                        setIsSubmitting(false);
                }
        };

        if (!isOpen) return null;

        return (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-background rounded-lg max-w-md w-full p-6"
                        >
                                <h3 className="text-2xl font-bold mb-4">Enquire About {journey.title}</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                                <label className="text-sm font-medium mb-2 block">Name</label>
                                                <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full p-2 border rounded-md"
                                                        placeholder="Your name"
                                                />
                                        </div>
                                        <div>
                                                <label className="text-sm font-medium mb-2 block">Email</label>
                                                <input
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full p-2 border rounded-md"
                                                        placeholder="Your email"
                                                />
                                        </div>
                                        <div>
                                                <label className="text-sm font-medium mb-2 block">Message</label>
                                                <textarea
                                                        value={formData.message}
                                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                        className="w-full p-2 border rounded-md h-24"
                                                        placeholder="Any specific requirements or questions?"
                                                />
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                                        {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                                                </Button>
                                                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                                        Cancel
                                                </Button>
                                        </div>
                                </form>
                        </motion.div>
                </div>
        );
};

// REMOVED JourneyTimeline component since we're handling it directly in the main component

const JourneyDetail = () => {
        const params = useParams();
        const id = Array.isArray(params.id) ? params.id[0] : params.id;;
        const [journey, setJourney] = React.useState<Tables<"journeys"> | null>(null);
        const [days, setDays] = React.useState<DaySchedule[]>([]);
        const [loading, setLoading] = React.useState(true);
        const [daysLoading, setDaysLoading] = React.useState(true);
        const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);
        const [expandedDay, setExpandedDay] = React.useState<number | null>(null); // MOVED HERE

        React.useEffect(() => {
                if (id) {
                        fetchJourney();
                        fetchDays();
                }
        }, [id]);

        // Add this state near your other states
        const [highlightIndex, setHighlightIndex] = React.useState(0);
        const HIGHLIGHTS_PER_PAGE = 4;

        // Calculate current highlights
        const currentHighlights = days.slice(
                highlightIndex * HIGHLIGHTS_PER_PAGE,
                highlightIndex * HIGHLIGHTS_PER_PAGE + HIGHLIGHTS_PER_PAGE
        );

        const fetchJourney = async () => {
                try {
                        const { data, error } = await supabase
                                .from('journeys')
                                .select('*')
                                .eq("id", id as string)
                                .maybeSingle();

                        if (error) throw error;
                        setJourney(data);
                } catch (error) {
                        console.error('Error fetching journey:', error);
                } finally {
                        setLoading(false);
                }
        };

        const fetchDays = async () => {
                try {
                        const { data, error } = await supabase
                                .from('journey_days')
                                .select('*')
                                .eq('journey_id', id)
                                .order('day_number', { ascending: true });

                        if (error) throw error;
                        setDays(data || []);
                } catch (error) {
                        console.error('Error fetching days:', error);
                } finally {
                        setDaysLoading(false);
                }
        };

        const toggleDay = (dayNumber: number) => {
                setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
        };

        const handleEnquireNow = () => {
                if (journey) {
                        window.location.href = `mailto:shantihimalaya@gmail.com?subject=Enquiry about ${encodeURIComponent(journey.title)}&body=Hi, I would like to know more about ${encodeURIComponent(journey.title)}.`;
                }
        };

        if (loading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Header />
                                <div className="pt-32 pb-16 text-center">
                                        <p className="text-lg text-muted-foreground">Loading journey...</p>
                                </div>
                                <Footer />
                        </div>
                );
        }

        if (!journey) {
                return (
                        <div className="min-h-screen bg-background">
                                <Header />
                                <div className="pt-32 pb-16 text-center">
                                        <h1 className="text-4xl font-bold text-foreground mb-4">Journey Not Found</h1>
                                        <Link href="/journeys">
                                                <Button>Back to Journeys</Button>
                                        </Link>
                                </div>
                                <Footer />
                        </div>
                );
        }

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Hero Section */}
                        <section className="pt-32 pb-16 hero-gradient text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="container mx-auto px-4 relative z-10">
                                        <div className="max-w-4xl mx-auto">
                                                <Link href="/journeys" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                                        Back to Journeys
                                                </Link>

                                                <div className="flex items-center space-x-4 mb-6">
                                                        <Badge className="bg-white/20 text-white border-white/30">
                                                                {journey.difficulty}
                                                        </Badge>
                                                        <Badge className="bg-gold text-white">
                                                                {journey.category}
                                                        </Badge>
                                                </div>

                                                <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                                                        {journey.title}
                                                </h1>
                                                <p className="text-xl text-white/90 leading-relaxed mb-8">
                                                        {journey.description}
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                        <div className="flex items-center space-x-3">
                                                                <Clock className="w-6 h-6 text-white/80" />
                                                                <div>
                                                                        <p className="text-sm text-white/80">Duration</p>
                                                                        <p className="font-semibold">{journey.duration}</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                                <Mountain className="w-6 h-6 text-white/80" />
                                                                <div>
                                                                        <p className="text-sm text-white/80">Difficulty</p>
                                                                        <p className="font-semibold">{journey.difficulty}</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                                <Users className="w-6 h-6 text-white/80" />
                                                                <div>
                                                                        <p className="text-sm text-white/80">Category</p>
                                                                        <p className="font-semibold">{journey.category}</p>
                                                                </div>
                                                        </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-4">
                                                        <Button
                                                                size="lg"
                                                                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4"
                                                                onClick={handleEnquireNow}
                                                        >
                                                                <Mail className="w-5 h-5 mr-2" />
                                                                Enquire Now
                                                        </Button>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Main Content */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-6xl mx-auto">
                                                <div className="lg:col-span-2 space-y-8">
                                                        <div>
                                                                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">About This Journey</h2>

                                                                {/* Journey Banner Image with Description side-by-side */}
                                                                {journey.image_url && (
                                                                        <div className="mb-8">
                                                                                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                                                                                        {/* Image on left */}
                                                                                        <div className="lg:w-1/2">
                                                                                                <div className="rounded-2xl overflow-hidden shadow-xl">
                                                                                                        <img
                                                                                                                src={journey.image_url}
                                                                                                                alt={journey.title}
                                                                                                                className="w-full h-64 md:h-80 lg:h-96 object-cover"
                                                                                                        />
                                                                                                </div>
                                                                                        </div>

                                                                                        {/* Description and Activities on right */}
                                                                                        <div className="lg:w-1/2 space-y-6">
                                                                                                <div>
                                                                                                        <h3 className="text-xl font-bold mb-4 text-foreground">Overview</h3>
                                                                                                        <p className="text-muted-foreground leading-relaxed">
                                                                                                                {journey.description}
                                                                                                        </p>
                                                                                                </div>

                                                                                                <div>
                                                                                                        <h3 className="text-xl font-bold mb-4 text-foreground">Activities</h3>
                                                                                                        <div className="space-y-3">
                                                                                                                {journey.activities && journey.activities.map((activity: any, index: number) => (
                                                                                                                        <div key={index} className="flex items-start space-x-3">
                                                                                                                                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                                                                                                                <span className="text-muted-foreground">{activity}</span>
                                                                                                                        </div>
                                                                                                                ))}
                                                                                                        </div>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                )}

                                                                {/* Highlights as Tags Section */}
                                                                <div className="mt-8">
                                                                        <div className="flex items-center justify-between mb-4">
                                                                                <h3 className="text-2xl font-display font-bold text-foreground flex items-center">
                                                                                        <Star className="w-6 h-6 text-yellow-500 mr-2" />
                                                                                        Journey Highlights
                                                                                </h3>
                                                                                {days.length > HIGHLIGHTS_PER_PAGE && (
                                                                                        <div className="flex items-center space-x-2">
                                                                                                <Button
                                                                                                        size="icon"
                                                                                                        variant="outline"
                                                                                                        className="h-8 w-8"
                                                                                                        onClick={() => {
                                                                                                                const prevIndex = highlightIndex - 1;
                                                                                                                setHighlightIndex(prevIndex < 0 ? Math.ceil(days.length / HIGHLIGHTS_PER_PAGE) - 1 : prevIndex);
                                                                                                        }}
                                                                                                >
                                                                                                        <ChevronLeft className="h-4 w-4" />
                                                                                                </Button>
                                                                                                <Button
                                                                                                        size="icon"
                                                                                                        variant="outline"
                                                                                                        className="h-8 w-8"
                                                                                                        onClick={() => {
                                                                                                                const nextIndex = highlightIndex + 1;
                                                                                                                const totalPages = Math.ceil(days.length / HIGHLIGHTS_PER_PAGE);
                                                                                                                setHighlightIndex(nextIndex >= totalPages ? 0 : nextIndex);
                                                                                                        }}
                                                                                                >
                                                                                                        <ChevronRight className="h-4 w-4" />
                                                                                                </Button>
                                                                                        </div>
                                                                                )}
                                                                        </div>

                                                                        {/* Highlights as Tags */}
                                                                        <div className="flex flex-wrap gap-3">
                                                                                {currentHighlights.map((day) => (
                                                                                        <Badge
                                                                                                key={day.id}
                                                                                                variant="outline"
                                                                                                className="px-4 py-2 border-primary/30 text-foreground hover:bg-primary/10 transition-colors"
                                                                                        >
                                                                                                <div className="flex items-center space-x-2">
                                                                                                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                                                                                                                {day.day_number}
                                                                                                        </div>
                                                                                                        <span>{day.title || `Day ${day.day_number}`}</span>
                                                                                                </div>
                                                                                        </Badge>
                                                                                ))}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>

                                        </div>
                                </div>
                        </section>


                        {/* Day-wise Schedule Section */}
                        <div className="pt-8 mx-auto max-w-6xl px-4 mb-20">
                                <div className="flex items-center space-x-3 mb-8">
                                        <Calendar className="w-8 h-8 text-primary" />
                                        <h2 className="text-3xl font-display font-bold text-foreground">
                                                Daily Itinerary
                                        </h2>
                                </div>

                                {daysLoading ? (
                                        <div className="text-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                                <p className="text-muted-foreground">Loading itinerary...</p>
                                        </div>
                                ) : days.length > 0 ? (
                                        <div className="space-y-4 -mx-4 sm:mx-0">
                                                {days.map((day: any, index: number) => (
                                                        <DayCard
                                                                key={day.id}
                                                                day={day}
                                                                isExpanded={expandedDay === day.day_number}
                                                                onToggle={() => toggleDay(day.day_number)}
                                                                index={index}
                                                        />
                                                ))}
                                        </div>
                                ) : (
                                        <Card className="text-center py-12 border-dashed">
                                                <CardContent>
                                                        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                                        <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                                                                Itinerary Coming Soon
                                                        </h3>
                                                        <p className="text-muted-foreground">
                                                                Detailed day-by-day schedule will be available soon.
                                                        </p>
                                                </CardContent>
                                        </Card>
                                )}
                        </div>
                        <EnquiryModal
                                journey={journey}
                                isOpen={isEnquiryModalOpen}
                                onClose={() => setIsEnquiryModalOpen(false)}
                        />

                        <Footer />
                </div>
        );
};

export default JourneyDetail;