"use client";

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
        Play
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

const JourneyTimeline = ({ days }: { days: DaySchedule[] }) => {
        const [expandedDay, setExpandedDay] = React.useState<number | null>(null);

        const toggleDay = (dayNumber: number) => {
                setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
        };

        return (
                <div className="space-y-4">
                        {days.map((day, index) => (
                                <DayCard
                                        key={day.id}
                                        day={day}
                                        isExpanded={expandedDay === day.day_number}
                                        onToggle={() => toggleDay(day.day_number)}
                                        index={index}
                                />
                        ))}
                </div>
        );
};

const JourneyDetail = () => {
        const params = useParams();
        const id = Array.isArray(params.id) ? params.id[0] : params.id;;
        const [journey, setJourney] = React.useState<any>(null);
        const [days, setDays] = React.useState<DaySchedule[]>([]);
        const [loading, setLoading] = React.useState(true);
        const [daysLoading, setDaysLoading] = React.useState(true);
        const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);

        React.useEffect(() => {
                if (id) {
                        fetchJourney();
                        fetchDays();
                }
        }, [id]);

        const fetchJourney = async () => {
                try {
                        const { data, error } = await supabase
                                .from('journeys')
                                .select('*')
                                .eq('id', id)
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

        const handleEnquireNow = () => {
                if (journey) {
                        window.location.href = `mailto:info@example.com?subject=Enquiry about ${journey.title}&body=Hello, I would like to get more information about the ${journey.title} journey.`;
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
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                                        <div className="lg:col-span-2 space-y-8">
                                                                <div>
                                                                        <h2 className="text-3xl font-display font-bold mb-6 text-foreground">About This Journey</h2>
                                                                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                                                                {journey.description}
                                                                        </p>

                                                                        <h3 className="text-2xl font-display font-bold mb-4 text-foreground">Activities</h3>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                {journey.activities && journey.activities.map((activity: string, index: number) => (
                                                                                        <div key={index} className="flex items-start space-x-3">
                                                                                                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                                                                                <span className="text-muted-foreground">{activity}</span>
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                </div>

                                                                {/* Day-wise Schedule Section */}
                                                                <div className="pt-8">
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
                                                                                <JourneyTimeline days={days} />
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
                                                        </div>

                                                        <div className="space-y-6">
                                                                <Card className="shadow-card">
                                                                        <CardContent className="p-6 space-y-4">
                                                                                <div>
                                                                                        <h3 className="text-2xl font-bold text-foreground mb-2">Quick Info</h3>
                                                                                        <p className="text-sm text-muted-foreground">Essential details</p>
                                                                                </div>

                                                                                <div className="space-y-3 border-t pt-4">
                                                                                        <div className="flex justify-between py-2">
                                                                                                <span className="text-sm text-muted-foreground">Duration</span>
                                                                                                <span className="font-semibold">{journey.duration}</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between py-2">
                                                                                                <span className="text-sm text-muted-foreground">Difficulty</span>
                                                                                                <span className="font-semibold">{journey.difficulty}</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between py-2">
                                                                                                <span className="text-sm text-muted-foreground">Category</span>
                                                                                                <span className="font-semibold">{journey.category}</span>
                                                                                        </div>
                                                                                </div>

                                                                                <Button
                                                                                        className="w-full hero-gradient hover-glow mt-4"
                                                                                        onClick={() => setIsEnquiryModalOpen(true)}
                                                                                >
                                                                                        Enquire Now
                                                                                </Button>
                                                                        </CardContent>
                                                                </Card>

                                                                {/* Journey Highlights Card */}
                                                                <Card className="shadow-card border-primary/20">
                                                                        <CardContent className="p-6">
                                                                                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                                                                                        <Star className="w-5 h-5 text-yellow-500 mr-2" />
                                                                                        Journey Highlights
                                                                                </h3>
                                                                                <div className="space-y-3">
                                                                                        {days.map((day: any) => (
                                                                                                <div key={day.id} className="flex items-start space-x-3">
                                                                                                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold mt-0.5 flex-shrink-0">
                                                                                                                {day.day_number}
                                                                                                        </div>
                                                                                                        <span className="text-sm text-muted-foreground">
                                                                                                                {day.title || `Day ${day.day_number}`}
                                                                                                        </span>
                                                                                                </div>
                                                                                        ))}
                                                                                </div>
                                                                        </CardContent>
                                                                </Card>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

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