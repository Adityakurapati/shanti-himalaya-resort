"use client";

import type { Tables } from "@/integrations/supabase/types";
import { useParams } from "next/navigation"; import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
        Sparkles,
        Users,
        Mountain,
        Star,
        Clock,
        ArrowRight,
        ArrowLeft,
        MapPin,
        Heart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

const ExperienceDetail = () => {
        const params = useParams();
        const id = Array.isArray(params.id) ? params.id[0] : params.id;;
        const [experience, setExperience] = React.useState<Tables<"experiences"> | null>(null);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
                if (id) {
                        fetchExperience();
                }
        }, [id]);

        const fetchExperience = async () => {
                try {
                        const { data, error } = await supabase
                                .from('experiences')
                                .select('*')
                                .eq("id", id as string)
                                .maybeSingle();

                        if (error) throw error;
                        setExperience(data);
                } catch (error) {
                        console.error('Error fetching experience:', error);
                } finally {
                        setLoading(false);
                }
        };

        if (loading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Header />
                                <div className="pt-32 pb-16 text-center">
                                        <p className="text-lg text-muted-foreground">Loading experience...</p>
                                </div>
                                <Footer />
                        </div>
                );
        }

        if (!experience) {
                return (
                        <div className="min-h-screen bg-background">
                                <Header />
                                <div className="pt-32 pb-16 text-center">
                                        <h1 className="text-4xl font-bold text-foreground mb-4">Experience Not Found</h1>
                                        <Link href="/experiences">
                                                <Button>Back to Experiences</Button>
                                        </Link>
                                </div>
                                <Footer />
                        </div>
                );
        }

        const getCategoryIcon = (category: string) => {
                switch (category?.toLowerCase()) {
                        case 'wellness': return <Sparkles className="w-16 h-16 text-white/20" />;
                        case 'culture': return <Heart className="w-16 h-16 text-white/20" />;
                        case 'adventure': return <Mountain className="w-16 h-16 text-white/20" />;
                        case 'luxury': return <Star className="w-16 h-16 text-white/20" />;
                        default: return <Star className="w-16 h-16 text-white/20" />;
                }
        };

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Hero Section */}
                        <section className="pt-32 pb-16 hero-gradient text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="container mx-auto px-4 relative z-10">
                                        <div className="max-w-4xl mx-auto">
                                                <Link href="/experiences" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                                        Back to Experiences
                                                </Link>

                                                <div className="flex items-center space-x-4 mb-6">
                                                        <Badge className="bg-white/20 text-white border-white/30">
                                                                {experience.category}
                                                        </Badge>
                                                </div>

                                                <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                                                        {experience.title}
                                                </h1>
                                                <p className="text-xl text-white/90 leading-relaxed mb-8">
                                                        {experience.description}
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                        <div className="flex items-center space-x-3">
                                                                <Clock className="w-6 h-6 text-white/80" />
                                                                <div>
                                                                        <p className="text-sm text-white/80">Duration</p>
                                                                        <p className="font-semibold">{experience.duration}</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                                <Users className="w-6 h-6 text-white/80" />
                                                                <div>
                                                                        <p className="text-sm text-white/80">Group Size</p>
                                                                        <p className="font-semibold">{experience.group_size}</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                                <MapPin className="w-6 h-6 text-white/80" />
                                                                <div>
                                                                        <p className="text-sm text-white/80">Price</p>
                                                                        <p className="font-semibold">{experience.price || 'Contact for pricing'}</p>
                                                                </div>
                                                        </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-4">
                                                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
                                                                Book Experience
                                                        </Button>
                                                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
                                                                Get More Info
                                                        </Button>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Experience Gallery */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                <div className="lg:col-span-2">
                                                        <div className="relative h-96 bg-gradient-to-br from-primary via-accent to-gold rounded-2xl mb-6 overflow-hidden">
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                        {getCategoryIcon(experience.category)}
                                                                </div>
                                                        </div>
                                                </div>

                                                <div className="space-y-6">
                                                        <Card className="shadow-card">
                                                                <CardContent className="p-6 space-y-4">
                                                                        <div>
                                                                                <h3 className="text-2xl font-bold text-foreground mb-2">Quick Info</h3>
                                                                                <p className="text-sm text-muted-foreground">Everything you need to know</p>
                                                                        </div>

                                                                        <div className="space-y-3 border-t pt-4">
                                                                                <div className="flex justify-between py-2">
                                                                                        <span className="text-sm text-muted-foreground">Duration</span>
                                                                                        <span className="font-semibold">{experience.duration}</span>
                                                                                </div>
                                                                                <div className="flex justify-between py-2">
                                                                                        <span className="text-sm text-muted-foreground">Group Size</span>
                                                                                        <span className="font-semibold">{experience.group_size || 'Flexible'}</span>
                                                                                </div>
                                                                                <div className="flex justify-between py-2">
                                                                                        <span className="text-sm text-muted-foreground">Price</span>
                                                                                        <span className="font-semibold text-primary">{experience.price || 'Contact us'}</span>
                                                                                </div>
                                                                        </div>

                                                                        <Button className="w-full hero-gradient hover-glow mt-4">
                                                                                Book Now
                                                                        </Button>
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Main Content */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-6xl mx-auto">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                                        <div className="lg:col-span-2 space-y-8">
                                                                <div>
                                                                        <h2 className="text-3xl font-display font-bold mb-6 text-foreground">About This Experience</h2>
                                                                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                                                                {experience.description}
                                                                        </p>

                                                                        <h3 className="text-2xl font-display font-bold mb-4 text-foreground">Experience Highlights</h3>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                {experience.highlights && experience.highlights.map((highlight: any, index: number) => (
                                                                                        <div key={index} className="flex items-start space-x-3">
                                                                                                <Star className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                                                                                                <span className="text-muted-foreground">{highlight}</span>
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* CTA Section */}
                        <section className="py-20 hero-gradient text-white">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-2xl mx-auto text-center">
                                                <h2 className="text-3xl font-display font-bold mb-6">
                                                        Ready to Book Your Experience?
                                                </h2>
                                                <p className="text-white/90 mb-8 leading-relaxed">
                                                        Contact us to customize this experience according to your preferences and schedule.
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover-glow">
                                                                Book Now
                                                        </Button>
                                                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                                                                Call Us: +977 9876543210
                                                        </Button>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <Footer />
                </div>
        );
};

export default ExperienceDetail;
