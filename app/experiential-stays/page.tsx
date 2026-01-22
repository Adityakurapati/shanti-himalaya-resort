"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Sparkles,
    Star,
    Home,
    MapPin,
    Calendar,
    ArrowRight,
    Loader2,
    Phone,
    Mail
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const CATEGORIES = [
    "All",
    "Luxury",
    "Boutique",
    "Jungle Lodge",
    "Homestay",
    "Experience",
    "Peace & Relaxation",
    "Family Holiday",
    "Experiential",
    "Nature"
] as const;

export default function ExperientialStays() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [stays, setStays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStays();
    }, []);

    const fetchStays = async () => {
        try {
            // First fetch stays
            const { data: staysData, error: staysError } = await supabase
                .from("experiential_stays")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false });

            if (staysError) throw staysError;

            // Then fetch images for each stay
            const staysWithImages = await Promise.all(
                (staysData || []).map(async (stay) => {
                    const { data: imagesData } = await supabase
                        .from("stay_images")
                        .select("*")
                        .eq("stay_id", stay.id)
                        .order("image_order", { ascending: true });

                    const categories = parseJSON(stay.categories, []);

                    // Get featured image or first image
                    const featuredImage = imagesData?.find(img => img.is_featured)?.image_url ||
                        imagesData?.[0]?.image_url;

                    return {
                        ...stay,
                        categories,
                        featuredImage,
                        imageCount: imagesData?.length || 0
                    };
                })
            );

            setStays(staysWithImages);
            console.log("Fetched stays:", staysWithImages); // Debug log
        } catch (error) {
            console.error("Error fetching stays:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStays = selectedCategory === "All"
        ? stays
        : stays.filter(stay => stay.categories?.includes(selectedCategory));

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="pt-32 pb-16 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading stays...</p>
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
Curated Himalayan Retreats                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                            Experiential
                            <span className="block text-luxury">Stays</span>
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                        Immerse yourself in authentic Himalayan experiences through our carefully curated stays. From luxury eco-lodges to traditional mountain retreats, each offers unique cultural immersion.
                        </p>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white/50 backdrop-blur-sm border-y">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        {CATEGORIES.map((category) => (
                            <Button
                                key={category}
                                variant={category === selectedCategory ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className={`gap-2 transition-all duration-300 ${category === selectedCategory
                                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                                    : "hover:border-primary/50 hover:text-primary"
                                    }`}
                            >
                                {category === "All" ? <Sparkles className="w-4 h-4" /> : null}
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Stays */}
            <section className="py-20 bg-gradient-to-b from-white to-muted/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-foreground">
                            Discover <span className="text-primary">All Stays</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Choose from our diverse range of carefully curated accommodations,
                            each designed to offer unique perspectives of Himalayan hospitality.
                        </p>
                    </div>

                    {filteredStays.length === 0 ? (
                        <div className="text-center py-12">
                            <Home className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No stays found</h3>
                            <p className="text-muted-foreground mb-6">
                                {stays.length === 0
                                    ? "No stays have been added yet. Please add stays through the admin panel."
                                    : "Try selecting a different category"}
                            </p>
                            {stays.length === 0 ? (
                                <Button asChild>
                                    <Link href="/admin">Go to Admin Panel</Link>
                                </Button>
                            ) : (
                                <Button onClick={() => setSelectedCategory("All")}>
                                    View All Stays
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredStays.map((stay) => (
                                <Card key={stay.id} className="group overflow-hidden border hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                                    <div className="relative h-64 overflow-hidden">
                                        {stay.featuredImage ? (
                                            <img
                                                src={stay.featuredImage}
                                                alt={stay.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                                <Home className="w-12 h-12 text-primary/30" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-gradient-to-r from-primary/90 to-primary text-white border-0 shadow-sm">
                                                {stay.badge}
                                            </Badge>
                                        </div>
                                        {stay.categories?.[0] && (
                                            <div className="absolute top-4 right-4">
                                                <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                                                    {stay.categories[0]}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{stay.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="line-clamp-1">{stay.location || "Location not specified"}</span>
                                                </div>
                                                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                                                    {stay.overview || stay.description || "Experience the beauty of the Himalayas"}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {stay.categories?.slice(0, 2).map((category: string, index: number) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {category}
                                                    </Badge>
                                                ))}
                                                {stay.categories?.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{stay.categories.length - 2} more
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div>
                                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {stay.duration || "Custom duration"}
                                                    </span>
                                                </div>
                                                <Link href={`/experiential-stays/${stay.id}`}>
                                                    <Button variant="outline" className="border-primary/20 hover:bg-primary hover:text-white transition-colors">
                                                        View Details
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="relative inline-block mb-6">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-30"></div>
                            <Badge className="relative bg-white text-primary border-primary/20 px-6 py-2">
                                <Star className="w-4 h-4 mr-2 fill-current" />
                                Expert Guidance
                            </Badge>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                            Need Help Choosing?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Let our hospitality experts help you find the perfect stay tailored to your
                            preferences, comfort level, and schedule. Every accommodation is carefully selected
                            for comfort, authenticity, and memorable experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 shadow-lg">
                                <a href="tel:+919910775078" className="flex items-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Speak to an Expert
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
                                <a href="mailto:shantihimalaya@gmail.com" className="flex items-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    Send Inquiry
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}