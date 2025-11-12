"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
        Mountain,
        Camera,
        TreePine,
        Compass,
        Clock,
        Users,
        ArrowRight
} from "lucide-react";
import Link from "next/link";;
import React from "react";
import { supabase } from "@/integrations/supabase/client";

const Journeys = () => {
        const [selectedCategory, setSelectedCategory] = React.useState("All");
        const [journeys, setJourneys] = React.useState<any[]>([]);
        const [categories, setCategories] = React.useState<string[]>(["All"]);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
                fetchJourneys();

                const channel = supabase
                        .channel('journeys-changes')
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'journeys' }, () => {
                                fetchJourneys();
                        })
                        .subscribe();

                return () => {
                        supabase.removeChannel(channel);
                };
        }, []);

        const fetchJourneys = async () => {
                try {
                        const { data, error } = await supabase
                                .from("journeys")
                                .select("*")
                                .order("created_at", { ascending: false });

                        if (error) throw error;

                        setJourneys(data || []);

                        // Extract unique categories
                        const uniqueCategories = Array.from(new Set((data || []).map((j: any) => j.category)));
                        setCategories(["All", ...uniqueCategories]);
                } catch (error) {
                        console.error("Error fetching journeys:", error);
                } finally {
                        setLoading(false);
                }
        };

        const featuredJourneys = journeys.filter(journey => journey.featured);
        const filteredJourneys = selectedCategory === "All"
                ? journeys
                : journeys.filter(journey => journey.category === selectedCategory);

        if (loading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Header />
                                <div className="pt-32 pb-16 text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                        <p className="mt-4 text-muted-foreground">Loading journeys...</p>
                                </div>
                                <Footer />
                        </div>
                );
        }

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Hero Section */}
                        <section className="pt-32 pb-16 hero-gradient text-white">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-4xl mx-auto text-center">
                                                <Badge className="mb-6 bg-white/20 text-white border-white/30">
                                                        Discover Your Adventure
                                                </Badge>
                                                <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                                                        Epic
                                                        <span className="block text-luxury">Journeys</span>
                                                </h1>
                                                <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                                                        From thrilling adventures to peaceful retreats, discover curated experiences
                                                        that showcase the best of Nepal's natural beauty and rich culture.
                                                </p>
                                        </div>
                                </div>
                        </section>

                        {/* Featured Journeys */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        Featured Journeys
                                                </h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Our most popular and highly recommended experiences,
                                                        carefully crafted for unforgettable memories.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                                {featuredJourneys.map((journey) => (
                                                        <Card key={journey.id} className="shadow-card hover-lift overflow-hidden">
                                                                <div className="relative h-48 bg-gradient-to-br from-primary to-accent">
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                                <Camera className="w-16 h-16 text-white/30" />
                                                                        </div>
                                                                        <Badge className="absolute top-4 right-4 bg-gold text-white">
                                                                                Featured
                                                                        </Badge>
                                                                </div>
                                                                <CardHeader>
                                                                        <CardTitle className="text-xl font-display">{journey.title}</CardTitle>
                                                                        <p className="text-muted-foreground text-sm">{journey.description}</p>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <div className="flex items-center justify-between text-sm">
                                                                                <div className="flex items-center space-x-1">
                                                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                                                        <span>{journey.duration}</span>
                                                                                </div>
                                                                                <div className="flex items-center space-x-1">
                                                                                        <Mountain className="w-4 h-4 text-muted-foreground" />
                                                                                        <span>{journey.difficulty}</span>
                                                                                </div>
                                                                        </div>

                                                                        <div className="flex flex-wrap gap-1">
                                                                                {journey.activities.slice(0, 3).map((activity) => (
                                                                                        <Badge key={activity} variant="secondary" className="text-xs">
                                                                                                {activity}
                                                                                        </Badge>
                                                                                ))}
                                                                                {journey.activities.length > 3 && (
                                                                                        <Badge variant="secondary" className="text-xs">
                                                                                                +{journey.activities.length - 3} more
                                                                                        </Badge>
                                                                                )}
                                                                        </div>

                                                                        <Link href={`/journeys/${journey.id}`}>
                                                                                <Button className="w-full mt-4 hero-gradient hover-glow">
                                                                                        Explore Journey
                                                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                                                </Button>
                                                                        </Link>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* All Journey Types */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        All Journey Types
                                                </h2>

                                                {/* Category Filter */}
                                                <div className="flex flex-wrap justify-center gap-2 mb-8">
                                                        {categories.map((category) => (
                                                                <Button
                                                                        key={category}
                                                                        variant={category === selectedCategory ? "default" : "outline"}
                                                                        size="sm"
                                                                        onClick={() => setSelectedCategory(category)}
                                                                        className={category === selectedCategory ? "hero-gradient" : ""}
                                                                >
                                                                        {category}
                                                                </Button>
                                                        ))}
                                                </div>

                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Choose from our diverse range of carefully curated experiences,
                                                        each designed to offer unique perspectives of Nepal's wonders.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {filteredJourneys.map((journey) => (
                                                        <Card key={journey.id} className="shadow-card hover-lift overflow-hidden bg-white">
                                                                <div className="relative h-32 bg-gradient-to-br from-primary/10 to-accent/10">
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                                {journey.id === 'adventure' && <Mountain className="w-12 h-12 text-primary/30" />}
                                                                                {journey.id === 'wildlife' && <TreePine className="w-12 h-12 text-accent/30" />}
                                                                                {journey.id === 'cultural' && <Compass className="w-12 h-12 text-gold/30" />}
                                                                                {journey.id === 'wellness' && <Users className="w-12 h-12 text-primary/30" />}
                                                                                {journey.id === 'photography' && <Camera className="w-12 h-12 text-accent/30" />}
                                                                                {journey.id === 'luxury' && <Mountain className="w-12 h-12 text-gold/30" />}
                                                                        </div>
                                                                        {journey.featured && (
                                                                                <Badge className="absolute top-3 right-3 bg-gold text-white text-xs">
                                                                                        Popular
                                                                                </Badge>
                                                                        )}
                                                                </div>

                                                                <CardContent className="p-6">
                                                                        <h3 className="font-display font-semibold text-lg mb-2">{journey.title}</h3>
                                                                        <p className="text-muted-foreground text-sm mb-4">{journey.description}</p>

                                                                        <div className="space-y-2 mb-4">
                                                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                                        <span>Duration: {journey.duration}</span>
                                                                                        <span>Level: {journey.difficulty}</span>
                                                                                </div>
                                                                        </div>

                                                                        <div className="flex flex-wrap gap-1 mb-4">
                                                                                {journey.activities.slice(0, 2).map((activity) => (
                                                                                        <Badge key={activity} variant="outline" className="text-xs">
                                                                                                {activity}
                                                                                        </Badge>
                                                                                ))}
                                                                        </div>

                                                                        <Link href={`/journeys/${journey.id}`}>
                                                                                <Button variant="outline" className="w-full">
                                                                                        View Details
                                                                                </Button>
                                                                        </Link>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* CTA Section */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-2xl mx-auto text-center">
                                                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
                                                        Ready for Your Next Adventure?
                                                </h2>
                                                <p className="text-muted-foreground mb-8 leading-relaxed">
                                                        Let our expert guides help you create the perfect journey tailored to your
                                                        interests, fitness level, and schedule. Every adventure is carefully planned
                                                        for safety, comfort, and maximum enjoyment.
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                        <Button size="lg" className="hero-gradient hover-glow">
                                                                Plan My Journey
                                                        </Button>
                                                        <Button size="lg" variant="outline">
                                                                Speak to an Expert
                                                        </Button>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <Footer />
                </div>
        );
};

export default Journeys;
