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
import EnquiryModal from "@/components/EnquiryModal";

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
    >
      <Card
        className={`overflow-hidden border-2 transition-all duration-300 mx-2 sm:mx-0 ${
          isExpanded
            ? "border-primary shadow-xl scale-[1.02]"
            : "border-border hover:border-primary/50"
        }`}
      >
        <CardContent className="p-0">

          {/* HEADER */}
          <div
            className="p-4 sm:p-6 cursor-pointer bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all"
            onClick={onToggle}
          >
            <div className="flex items-center">

              {/* LEFT */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">

                {/* DAY NUMBER */}
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full font-bold text-sm sm:text-lg flex-shrink-0">
                  {day.day_number}
                </div>

                {/* TITLE + DESC */}
                <div className="flex-1 min-w-0">

                  <h3 className="text-base sm:text-xl font-bold text-foreground truncate">
                    {day.title || `Day ${day.day_number}`}
                  </h3>

                  {day.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {day.description}
                    </p>
                  )}

                </div>

              </div>


              {/* RIGHT ICON */}
              <div className="flex items-center space-x-2 flex-shrink-0 ml-3">

                {day.image_url && (
                  <Camera className="w-5 h-5 text-primary" />
                )}

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>

              </div>

            </div>
          </div>



          {/* EXPANDED CONTENT */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 sm:p-6">

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


                    {/* IMAGE COLUMN */}
                    {day.image_url && (
                      <div className="lg:col-span-5">

                        <img
                          src={day.image_url}
                          alt=""
                          className="rounded-lg w-full object-cover"
                        />

                        {/* DETAILS BELOW IMAGE */}
                        <div className="flex flex-col gap-4 pt-4">

                          <DetailItem
                            icon={Clock}
                            title="Duration"
                            value={day.duration || "6–7 hours"}
                            color="blue"
                          />

                          <DetailItem
                            icon={Home}
                            title="Accommodation"
                            value={
                              day.accommodation ||
                              "Teahouse / Lodge"
                            }
                            color="purple"
                          />

                          <DetailItem
                            icon={Utensils}
                            title="Meals"
                            value={
                              day.meals ||
                              "Breakfast, Lunch, Dinner"
                            }
                            color="orange"
                          />

                        </div>

                      </div>
                    )}



                    {/* TEXT COLUMN */}
                    <div
                      className={
                        day.image_url
                          ? "lg:col-span-7"
                          : "lg:col-span-12"
                      }
                    >

                      <h3 className="text-xl font-bold mb-3">
                        {day.title}
                      </h3>

                      <p className="text-muted-foreground whitespace-pre-line">
                        {day.description}
                      </p>



                      {/* DETAILS WHEN NO IMAGE */}
                      {!day.image_url && (
                        <div className="flex flex-wrap gap-6 pt-6">

                          <DetailItem
                            icon={Clock}
                            title="Duration"
                            value={day.duration || "6–7 hours"}
                            color="blue"
                          />

                          <DetailItem
                            icon={Home}
                            title="Accommodation"
                            value={
                              day.accommodation ||
                              "Teahouse / Lodge"
                            }
                            color="purple"
                          />

                          <DetailItem
                            icon={Utensils}
                            title="Meals"
                            value={
                              day.meals ||
                              "Breakfast, Lunch, Dinner"
                            }
                            color="orange"
                          />

                        </div>
                      )}

                    </div>


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
        <EnquiryModal
          item={{
            id: journey.id,
            title: journey.title,
            type: 'journey'
          }}
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
        />
      </div>

      <Footer />
    </>
  );
};
