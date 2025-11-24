"use client";

import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
        Heart,
        Sparkles,
        Utensils,
        Camera,
        Users,
        Mountain,
        TreePine,
        Clock,
        Star,
        ArrowRight,
        MapPin
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { supabase } from "@/integrations/supabase/client";

const Experiences = () => {
        const [selectedCategory, setSelectedCategory] = React.useState("All");
        const [experiences, setExperiences] = React.useState<Tables<"experiences">[]>([]);
        const [loading, setLoading] = React.useState(true);
        const [categories, setCategories] = React.useState<string[]>([]);

        React.useEffect(() => {
                fetchCategories();
                fetchExperiences();

                const channel = supabase
                        .channel('experiences-changes')
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'experiences' }, () => {
                                fetchExperiences();
                        })
                        .subscribe();

                return () => {
                        supabase.removeChannel(channel);
                };
        }, []);

        const fetchCategories = async () => {
                try {
                        const { data, error } = await supabase
                                .from('categories')
                                .select('name')
                                .order('name', { ascending: true })

                        if (error && error.code !== 'PGRST116') {
                                throw error
                        }

                        if (data) {
                                setCategories(["All", ...data.map((item: any) => item.name)])
                        } else {
                                // Fallback categories if no categories table exists
                                setCategories(["All", "Wellness", "Cultural", "Adventure", "Wildlife", "Culinary", "Luxury"])
                        }
                } catch (error) {
                        console.error("Error fetching categories:", error)
                        // Fallback categories
                        setCategories(["All", "Wellness", "Cultural", "Adventure", "Wildlife", "Culinary", "Luxury"])
                }
        }

        const fetchExperiences = async () => {
                try {
                        const { data, error } = await supabase
                                .from('experiences')
                                .select('*')
                                .order('created_at', { ascending: false });

                        if (error) throw error;

                        setExperiences(data || []);
                } catch (error) {
                        console.error('Error fetching experiences:', error);
                } finally {
                        setLoading(false);
                }
        };

        const getCategoryIcon = (category: string) => {
                switch (category?.toLowerCase()) {
                        case 'wellness': return <Sparkles className="w-6 h-6" />;
                        case 'cultural': return <Heart className="w-6 h-6" />;
                        case 'adventure': return <Mountain className="w-6 h-6" />;
                        case 'wildlife': return <TreePine className="w-6 h-6" />;
                        case 'culinary': return <Utensils className="w-6 h-6" />;
                        default: return <Star className="w-6 h-6" />;
                }
        };

        const shortenDescription = (description: string, wordLimit = 25) => {
                const words = description.split(' ');
                if (words.length <= wordLimit) return description;
                return words.slice(0, wordLimit).join(' ') + '...';
        };

        if (loading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Header />
                                <div className="pt-32 pb-16 text-center">
                                        <p className="text-lg text-muted-foreground">Loading experiences...</p>
                                </div>
                                <Footer />
                        </div>
                );
        }

        const featuredExperiences = experiences.filter((exp: any) => exp.featured);
        const filteredExperiences = selectedCategory === "All"
                ? experiences
                : experiences.filter((exp: any) => exp.category === selectedCategory);

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Hero Section */}
                        <section className="pt-32 pb-20 hero-gradient text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/30"></div>
                                <div className="container mx-auto px-4 relative z-10">
                                        <div className="max-w-4xl mx-auto text-center">
                                                <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                                        Curated Memories
                                                </Badge>
                                                <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                                                        Beyond Accommodation
                                                        <span className="block text-luxury">Extraordinary Experiences</span>
                                                </h1>
                                                <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                                                        From starlit dinners to wellness journeys and local adventures –
                                                        craft unforgettable moments with our carefully curated experiences in the heart of Nepal.
                                                </p>
                                        </div>
                                </div>
                        </section>

                        {/* Featured Experiences */}
                        {featuredExperiences.length > 0 && (
                                <section className="py-20 bg-background">
                                        <div className="container mx-auto px-4">
                                                <div className="text-center mb-16">
                                                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                                Signature Experiences
                                                        </h2>
                                                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                                Our most sought-after journeys that showcase the very best of what Nepal has to offer.
                                                        </p>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                                                        {featuredExperiences.map((experience: any) => (
                                                                <Card key={experience.id} className="shadow-card hover-lift overflow-hidden group">
                                                                        <div className="relative h-64 overflow-hidden">
                                                                                <img
                                                                                        src={experience.image_url}
                                                                                        alt={experience.title}
                                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                                />
                                                                                <div className="absolute inset-0 bg-black/20"></div>
                                                                                <Badge className="absolute top-4 left-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                                                                        {experience.category}
                                                                                </Badge>
                                                                                <Badge className="absolute top-4 right-4 bg-gold text-white">
                                                                                        Featured
                                                                                </Badge>
                                                                        </div>

                                                                        <CardContent className="p-6">
                                                                                <h3 className="text-xl font-display font-semibold mb-3">
                                                                                        {experience.title}
                                                                                </h3>
                                                                                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                                                                                        {shortenDescription(experience.description)}
                                                                                </p>

                                                                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                                                        <div className="flex items-center space-x-2">
                                                                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                                                                <span>{experience.duration}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                                                                <span>{experience.group_size}</span>
                                                                                        </div>
                                                                                </div>

                                                                                {experience.highlights && (
                                                                                        <div className="space-y-2 mb-4">
                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                        {experience.highlights.slice(0, 3).map((highlight: any, index: number) => (
                                                                                                                <Badge key={index} variant="secondary" className="text-xs">
                                                                                                                        {highlight}
                                                                                                                </Badge>
                                                                                                        ))}
                                                                                                </div>
                                                                                        </div>
                                                                                )}

                                                                                <div className="flex items-center justify-between">
                                                                                        <span className="font-semibold text-primary text-lg">
                                                                                                {experience.price}
                                                                                        </span>
                                                                                        <Link href={`/experiences/${experience.id}`}>
                                                                                                <Button className="hero-gradient hover-glow">
                                                                                                        View Experience
                                                                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                                                                </Button>
                                                                                        </Link>
                                                                                </div>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                </div>
                                        </div>
                                </section>
                        )}

                        {/* Experiences by Category */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        Discover by Category
                                                </h2>

                                                {/* Category Filter */}
                                                <div className="flex flex-wrap justify-center gap-2 mb-12">
                                                        {categories.map((category: any) => (
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
                                        </div>

                                        {/* Experiences Grid */}
                                        {filteredExperiences.length === 0 ? (
                                                <div className="text-center py-12">
                                                        <p className="text-muted-foreground">No experiences found in this category.</p>
                                                </div>
                                        ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {filteredExperiences.map((experience: any) => (
                                                                <Card key={experience.id} className="shadow-card hover-lift bg-white overflow-hidden group">
                                                                        <div className="relative h-48 overflow-hidden">
                                                                                <img
                                                                                        src={experience.image_url}
                                                                                        alt={experience.title}
                                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                                />
                                                                                <div className="absolute inset-0 bg-black/10"></div>
                                                                                {experience.featured && (
                                                                                        <Badge className="absolute top-3 right-3 bg-gold text-white text-xs">
                                                                                                Popular
                                                                                        </Badge>
                                                                                )}
                                                                        </div>

                                                                        <CardContent className="p-4">
                                                                                <div className="flex items-start justify-between mb-2">
                                                                                        <Badge variant="outline" className="text-xs">
                                                                                                {experience.category}
                                                                                        </Badge>
                                                                                        <span className="text-primary font-semibold text-sm">
                                                                                                {experience.price}
                                                                                        </span>
                                                                                </div>

                                                                                <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2">
                                                                                        {experience.title}
                                                                                </h3>

                                                                                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                                                        {shortenDescription(experience.description, 20)}
                                                                                </p>

                                                                                {experience.highlights && (
                                                                                        <div className="space-y-1 mb-3">
                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                        {experience.highlights.slice(0, 2).map((highlight: any, index: number) => (
                                                                                                                <Badge key={index} variant="secondary" className="text-xs">
                                                                                                                        {highlight}
                                                                                                                </Badge>
                                                                                                        ))}
                                                                                                </div>
                                                                                        </div>
                                                                                )}

                                                                                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                                                                                        <div className="flex items-center space-x-1">
                                                                                                <Clock className="w-3 h-3" />
                                                                                                <span>{experience.duration}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-1">
                                                                                                <Users className="w-3 h-3" />
                                                                                                <span>{experience.group_size}</span>
                                                                                        </div>
                                                                                </div>

                                                                                <Link href={`/experiences/${experience.id}`}>
                                                                                        <Button variant="outline" size="sm" className="w-full text-xs">
                                                                                                View Details
                                                                                        </Button>
                                                                                </Link>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                </div>
                                        )}
                                </div>
                        </section>

                        {/* Booking CTA */}
                        <section className="py-20 hero-gradient text-white">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-2xl mx-auto text-center">
                                                <h2 className="text-3xl font-display font-bold mb-6">
                                                        Create Your Perfect Experience
                                                </h2>
                                                <p className="text-white/90 mb-8 leading-relaxed">
                                                        Let our experience coordinators help you craft a personalized itinerary
                                                        that matches your interests and creates lasting memories.
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover-glow">
                                                                Design My Experience
                                                        </Button>
                                                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                                                                Speak to a Specialist
                                                        </Button>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <Footer />
                </div>
        );
};

export default Experiences;