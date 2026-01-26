"use client";

import Image from "next/image";
import type { Tables } from "@/integrations/supabase/types";
import { generateJSONLD, generateBreadcrumbJSONLD } from "@/lib/seo-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumps";
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
  ChevronRight,
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
  duration: string | null;
  accommodation: string | null;
  meals: string | null;
};

const ActivityItem = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);

const DetailItem = ({ icon: Icon, title, value, color }: { icon: any; title: string; value: string; color: string }) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
};

const DayCard = ({
  day,
  isExpanded,
  onToggle,
  index,
}: {
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
      <Card
        className={`overflow-hidden border-2 transition-all duration-300 ${
          isExpanded ? "border-primary shadow-xl scale-[1.02]" : "border-border hover:border-primary/50"
        }`}
      >
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
                  <h3 className="text-xl font-bold text-foreground truncate">{day.title || `Day ${day.day_number}`}</h3>
                  {day.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{day.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 flex-shrink-0">
                {day.image_url && <Camera className="w-5 h-5 text-primary" />}
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
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
                <div className="p-6">
                  {/* GRID LAYOUT */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN */}
                    {day.image_url ? (
                      <div className="lg:col-span-5 flex flex-col">
                        {/* Image */}
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="rounded-lg overflow-hidden h-fit shadow-lg mb-0"
                        >
                          <div className="h-fit">
                            <img
                              src={day.image_url || "/placeholder.svg"}
                              alt={`Day ${day.day_number}`}
                              className="w-full h-fit object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        </motion.div>

                        {/* Details below image */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="flex flex-col gap-6 pt-6 mt-6 border-t"
                        >
                          <DetailItem icon={Clock} title="Duration" value={day.duration || "6–7 hours"} color="blue" />
                          <DetailItem icon={Home} title="Accommodation" value={day.accommodation || "Teahouse / Lodge"} color="purple" />
                          <DetailItem icon={Utensils} title="Meals" value={day.meals || "Breakfast, Lunch, Dinner"} color="orange" />
                        </motion.div>
                      </div>
                    ) : (
                      // When no image
                      <div className="lg:col-span-12">
                        {/* Title & Description when no image */}
                        <div className="space-y-4 mb-6">
                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold text-foreground"
                          >
                            {day.title || `Day ${day.day_number}`}
                          </motion.h3>

                          {day.description && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="text-muted-foreground leading-relaxed whitespace-pre-line"
                            >
                              {day.description}
                            </motion.p>
                          )}
                        </div>

                        {/* Details when no image */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex flex-wrap gap-6 pt-6 border-t"
                        >
                          <DetailItem icon={Clock} title="Duration" value={day.duration || "6–7 hours"} color="blue" />
                          <DetailItem icon={Home} title="Accommodation" value={day.accommodation || "Teahouse / Lodge"} color="purple" />
                          <DetailItem icon={Utensils} title="Meals" value={day.meals || "Breakfast, Lunch, Dinner"} color="orange" />
                        </motion.div>
                      </div>
                    )}

                    {/* RIGHT COLUMN (only when image exists) */}
                    {day.image_url && (
                      <div className="lg:col-span-7">
                        {/* Title & Description */}
                        <div className="space-y-4">
                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold text-foreground"
                          >
                            {day.title || `Day ${day.day_number}`}
                          </motion.h3>

                          {day.description && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="text-muted-foreground leading-relaxed whitespace-pre-line"
                            >
                              {day.description}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EnquiryModal = ({
  journey,
  isOpen,
  onClose,
}: {
  journey: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("enquiries").insert([
        {
          journey_id: journey.id,
          journey_title: journey.title,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          status: "new",
        },
      ]);

      if (error) throw error;

      setFormData({ name: "", email: "", message: "" });
      onClose();
      alert("Thank you for your enquiry! We will get back to you soon.");
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("There was an error submitting your enquiry. Please try again.");
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
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
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

export const JourneyDetail = () => {
  const params = useParams();
  const slug = Array.isArray(params.id) ? params.id[0] : params.id;
  const [journey, setJourney] = React.useState<Tables<"journeys"> | null>(null);
  const [days, setDays] = React.useState<DaySchedule[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [daysLoading, setDaysLoading] = React.useState(true);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);
  const [expandedDay, setExpandedDay] = React.useState<number | null>(null);

  const [highlightIndex, setHighlightIndex] = React.useState(0);
  const HIGHLIGHTS_PER_PAGE = 4;

  const currentHighlights = days.slice(
    highlightIndex * HIGHLIGHTS_PER_PAGE,
    highlightIndex * HIGHLIGHTS_PER_PAGE + HIGHLIGHTS_PER_PAGE
  );

  React.useEffect(() => {
    if (slug) {
      fetchJourney();
    }
  }, [slug]);

  React.useEffect(() => {
    if (journey?.id) {
      fetchDays();
    }
  }, [journey?.id]);

  const fetchJourney = async () => {
    try {
      const { data, error } = await supabase
        .from("journeys")
        .select("*")
        .eq("slug", slug as string)
        .maybeSingle();

      if (error) throw error;
      setJourney(data);
    } catch (error) {
      console.error("Error fetching journey:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDays = async () => {
    if (!journey?.id) return;
    try {
      const { data, error } = await supabase
        .from("journey_days")
        .select("*")
        .eq("journey_id", journey.id)
        .order("day_number", { ascending: true });

      if (error) throw error;
      setDays(data || []);
    } catch (error) {
      console.error("Error fetching days:", error);
    } finally {
      setDaysLoading(false);
    }
  };

  const toggleDay = (dayNumber: number) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
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

  // JSON-LD structured data for the journey
  const journeyStructuredData = generateJSONLD(journey, "Journey");
  const breadcrumbStructuredData = generateBreadcrumbJSONLD([
    { name: 'Home', url: '/' },
    { name: 'Journeys', url: '/journeys' },
    { name: journey.title, url: `/journeys/${journey.slug}` }
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(journeyStructuredData) }}
      />
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <div className="min-h-screen bg-background">
        <Header />
        <Breadcrumbs />

        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          {journey.image_url ? (
            <div className="absolute inset-0">
              <img src={journey.image_url || "/placeholder.svg"} alt={journey.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 hero-gradient"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </>
          )}

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/journeys"
                className="inline-flex items-center mb-6 transition-colors group text-white/80 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Journeys
              </Link>

              <div className="flex items-center space-x-4 mb-6">
                <Badge className="bg-white/20 text-white border-white/30">
                  {journey.difficulty}
                </Badge>
                <Badge className="bg-gold text-white">{journey.category}</Badge>
              </div>

              <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 text-white">
                {journey.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl p-4 shadow-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">Duration</p>
                      <p className="font-semibold text-white">{journey.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl p-4 shadow-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mountain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">Difficulty</p>
                      <p className="font-semibold text-white">{journey.difficulty}</p>
                    </div>
                  </div>
                </div>

               
              </div>

              <Button size="lg" className="bg-white text-black hover:bg-white/90" onClick={() => setIsEnquiryModalOpen(true)}>
                Enquire Now
              </Button>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">About this Journey</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{journey.description}</p>

              {journey.activities && journey.activities.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Key Activities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {journey.activities.map((activity: string, idx: number) => (
                      <ActivityItem
                        key={idx}
                        icon={CheckCircle}
                        title={activity}
                        desc="Experience the best of this journey"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Itinerary Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Day-by-Day Itinerary</h2>

              {!daysLoading && days.length > 0 ? (
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
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">Itinerary Coming Soon</h3>
                    <p className="text-muted-foreground">Detailed day-by-day schedule will be available soon.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        <EnquiryModal journey={journey} isOpen={isEnquiryModalOpen} onClose={() => setIsEnquiryModalOpen(false)} />
        <Footer />
      </div>
    </>
  );
};
