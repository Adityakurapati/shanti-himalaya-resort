"use client";

import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
        MapPin,
        Clock,
        Star,
        Mountain,
        TreePine,
        Camera,
        Plane,
        ArrowRight
} from "lucide-react";
import Link from "next/link";;
import React from "react";
import { supabase } from "@/integrations/supabase/client";

const Destinations = () => {
        const [selectedCategory, setSelectedCategory] = React.useState("All");
        const [destinations, setDestinations] = React.useState<Tables<"destinations">[]>([]);
        const [loading, setLoading] = React.useState(true);
        const [categories, setCategories] = React.useState<string[]>([]);

        React.useEffect(() => {
                fetchCategories();
                fetchDestinations();

                // Set up real-time subscription
                const channel = supabase
                        .channel('destinations-changes')
                        .on(
                                'postgres_changes',
                                {
                                        event: '*',
                                        schema: 'public',
                                        table: 'destinations'
                                },
                                () => {
                                        fetchDestinations();
                                }
                        )
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
                                setCategories(["All", "Trekking", "Wildlife", "Culture", "Adventure", "Pilgrimage", "Nature"])
                        }
                } catch (error) {
                        console.error("Error fetching categories:", error)
                        setCategories(["All", "Trekking", "Wildlife", "Culture", "Adventure", "Pilgrimage", "Nature"])
                }
        }

        const fetchDestinations = async () => {
                try {
                        const { data, error } = await supabase
                                .from('destinations')
                                .select('*')
                                .order('created_at', { ascending: false });

                        if (error) throw error;
                        setDestinations(data || []);
                } catch (error) {
                        console.error('Error fetching destinations:', error);
                } finally {
                        setLoading(false);
                }
        };

        const featuredDestinations = destinations.filter((dest: any) => dest.featured);
        const filteredDestinations = selectedCategory === "All"
                ? destinations
                : destinations.filter((dest: any) => dest.category === selectedCategory);

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Hero Section */}
                        <section className="pt-32 pb-16 hero-gradient text-white">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-4xl mx-auto text-center">
                                                <Badge className="mb-6 bg-white/20 text-white border-white/30">
                                                        Explore Nepal's Wonders
                                                </Badge>
                                                <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                                                        Amazing
                                                        <span className="block text-luxury">Destinations</span>
                                                </h1>
                                                <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                                                        From towering Himalayan peaks to lush jungles, ancient temples to pristine lakes.
                                                        Discover the diverse beauty that makes Nepal truly extraordinary.
                                                </p>
                                        </div>
                                </div>
                        </section>

                        {/* Featured Destinations */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        Must-Visit Destinations
                                                </h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Our top recommended destinations that showcase Nepal's incredible diversity,
                                                        from world-famous trekking routes to hidden cultural gems.
                                                </p>
                                        </div>

                                        {loading ? (
                                                <div className="text-center py-12">
                                                        <p className="text-muted-foreground">Loading destinations...</p>
                                                </div>
                                        ) : featuredDestinations.length === 0 ? (
                                                <div className="text-center py-12">
                                                        <p className="text-muted-foreground">No featured destinations available yet.</p>
                                                </div>
                                        ) : (
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                        {featuredDestinations.map((destination: any) => (
                                                                <Card key={destination.id} className="shadow-card hover-lift overflow-hidden">
                                                                        <div className="relative h-64 bg-gradient-to-br from-primary to-accent">
                                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                                        {destination.category === 'Trekking' && <Mountain className="w-20 h-20 text-white/20" />}
                                                                                        {destination.category === 'Wildlife' && <TreePine className="w-20 h-20 text-white/20" />}
                                                                                        {destination.category === 'Culture' && <Camera className="w-20 h-20 text-white/20" />}
                                                                                </div>
                                                                                <div className="absolute top-4 left-4">
                                                                                        <Badge className="bg-white/20 text-white border-white/30">
                                                                                                {destination.category}
                                                                                        </Badge>
                                                                                </div>
                                                                                <div className="absolute top-4 right-4">
                                                                                        <Badge className="bg-gold text-white">
                                                                                                Featured
                                                                                        </Badge>
                                                                                </div>
                                                                                <div className="absolute bottom-4 left-4 right-4">
                                                                                        <h3 className="text-2xl font-display font-bold text-white mb-2">
                                                                                                {destination.name}
                                                                                        </h3>
                                                                                        <p className="text-white/90 text-sm">
                                                                                                {destination.description}
                                                                                        </p>
                                                                                </div>
                                                                        </div>

                                                                        <CardContent className="p-6">
                                                                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                                                        <div className="flex items-center space-x-2">
                                                                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                                                                <span>{destination.duration}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                                <Mountain className="w-4 h-4 text-muted-foreground" />
                                                                                                <span>{destination.difficulty}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                                <Star className="w-4 h-4 text-muted-foreground" />
                                                                                                <span>{destination.best_time}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                                                                <span>{destination.altitude}</span>
                                                                                        </div>
                                                                                </div>

                                                                                <div className="space-y-2 mb-4">
                                                                                        <h4 className="font-semibold text-sm">Highlights:</h4>
                                                                                        <div className="flex flex-wrap gap-1">
                                                                                                {destination.highlights && destination.highlights.slice(0, 3).map((highlight: any, idx: number) => (
                                                                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                                                                                {highlight}
                                                                                                        </Badge>
                                                                                                ))}
                                                                                        </div>
                                                                                </div>

                                                                                <Link href={`/destinations/${destination.id}`}>
                                                                                        <Button className="w-full hero-gradient hover-glow">
                                                                                                Explore Destination
                                                                                                <ArrowRight className="w-4 h-4 ml-2" />
                                                                                        </Button>
                                                                                </Link>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                </div>
                                        )}
                                </div>
                        </section>

                        {/* All Destinations */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        All Destinations
                                                </h2>

                                                {/* Category Filter */}
                                                <div className="flex flex-wrap justify-center gap-2 mb-8">
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

                                        {loading ? (
                                                <div className="text-center py-12">
                                                        <p className="text-muted-foreground">Loading destinations...</p>
                                                </div>
                                        ) : filteredDestinations.length === 0 ? (
                                                <div className="text-center py-12">
                                                        <p className="text-muted-foreground">No destinations found in this category.</p>
                                                </div>
                                        ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                        {filteredDestinations.map((destination: any) => (
                                                                <Card key={destination.id} className="shadow-card hover-lift bg-white">
                                                                        <CardHeader className="pb-4">
                                                                                <div className="flex items-start justify-between">
                                                                                        <div>
                                                                                                <CardTitle className="text-xl font-display mb-1">
                                                                                                        {destination.name}
                                                                                                </CardTitle>
                                                                                                <Badge variant="outline" className="text-xs">
                                                                                                        {destination.category}
                                                                                                </Badge>
                                                                                        </div>
                                                                                        <div className="text-right text-sm text-muted-foreground">
                                                                                                <div className="flex items-center space-x-1">
                                                                                                        <Mountain className="w-3 h-3" />
                                                                                                        <span>{destination.altitude}</span>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </CardHeader>

                                                                        <CardContent className="space-y-4">
                                                                                <p className="text-muted-foreground text-sm">
                                                                                        {destination.description}
                                                                                </p>

                                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                                        <div>
                                                                                                <span className="font-medium">Duration:</span> {destination.duration}
                                                                                        </div>
                                                                                        <div>
                                                                                                <span className="font-medium">Level:</span> {destination.difficulty}
                                                                                        </div>
                                                                                        <div className="col-span-2">
                                                                                                <span className="font-medium">Best Time:</span> {destination.best_time}
                                                                                        </div>
                                                                                </div>

                                                                                <div>
                                                                                        <h4 className="text-xs font-medium mb-2">Top Highlights:</h4>
                                                                                        <div className="flex flex-wrap gap-1">
                                                                                                {destination.highlights && destination.highlights.slice(0, 2).map((highlight: any, idx: number) => (
                                                                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                                                                                {highlight}
                                                                                                        </Badge>
                                                                                                ))}
                                                                                        </div>
                                                                                </div>

                                                                                <Link href={`/destinations/${destination.id}`}>
                                                                                        <Button variant="outline" size="sm" className="w-full">
                                                                                                Learn More
                                                                                        </Button>
                                                                                </Link>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                </div>
                                        )}
                                </div>
                        </section>

                        {/* Planning Section */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-4xl mx-auto">
                                                <div className="text-center mb-12">
                                                        <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
                                                                Plan Your Perfect Trip
                                                        </h2>
                                                        <p className="text-muted-foreground leading-relaxed">
                                                                Our destination experts will help you choose the perfect locations based on
                                                                your interests, available time, and preferred adventure level.
                                                        </p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                        <Card className="text-center shadow-card hover-lift">
                                                                <CardContent className="p-6">
                                                                        <Plane className="w-12 h-12 text-primary mx-auto mb-4" />
                                                                        <h3 className="font-display font-semibold mb-2">Custom Itineraries</h3>
                                                                        <p className="text-muted-foreground text-sm">
                                                                                Tailored trips combining multiple destinations for the ultimate Nepal experience.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>

                                                        <Card className="text-center shadow-card hover-lift">
                                                                <CardContent className="p-6">
                                                                        <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
                                                                        <h3 className="font-display font-semibold mb-2">Expert Guidance</h3>
                                                                        <p className="text-muted-foreground text-sm">
                                                                                Local guides with deep knowledge of each region's culture and hidden gems.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>

                                                        <Card className="text-center shadow-card hover-lift">
                                                                <CardContent className="p-6">
                                                                        <Star className="w-12 h-12 text-gold mx-auto mb-4" />
                                                                        <h3 className="font-display font-semibold mb-2">Premium Service</h3>
                                                                        <p className="text-muted-foreground text-sm">
                                                                                Comfortable accommodations and seamless logistics for worry-free travel.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>
                                                </div>

                                                <div className="text-center mt-12">
                                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                                <Button size="lg" className="hero-gradient hover-glow">
                                                                        Start Planning
                                                                </Button>
                                                                <Button size="lg" variant="outline">
                                                                        Download Destination Guide
                                                                </Button>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <Footer />
                </div>
        );
};

export default Destinations;