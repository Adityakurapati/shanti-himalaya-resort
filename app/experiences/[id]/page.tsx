"use client";

import type { Tables } from "@/integrations/supabase/types";
import { useParams } from "next/navigation";
import Link from "next/link";
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
        Heart,
        TreePine,
        Utensils
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

const ExperienceDetail = () => {
        const params = useParams();
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
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

        const generateWhatToExpect = (experience: any) => {
                const category = experience.category?.toLowerCase();
                const highlights = experience.highlights || [];

                if (category === 'wellness') {
                        return `Immerse yourself in a journey of rejuvenation where ancient healing traditions meet serene Himalayan landscapes. ${highlights.join(', ')} await to restore your balance and inner peace.`;
                } else if (category === 'adventure') {
                        return `Embrace the thrill of the Himalayas as you ${highlights[0]?.toLowerCase() || 'explore'} through breathtaking landscapes. Each moment is crafted to awaken your adventurous spirit.`;
                } else if (category === 'cultural') {
                        return `Step into the living heritage of Nepal, where ancient traditions come alive. ${highlights.join(' and ')} offer authentic connections with local culture and warm hospitality.`;
                } else if (category === 'wildlife') {
                        return `Venture into nature's sanctuary where wild encounters and pristine ecosystems create unforgettable moments. ${highlights[0] || 'Discover'} the untamed beauty of Nepal's wilderness.`;
                } else {
                        return `Experience the perfect blend of luxury and authenticity as you ${highlights[0]?.toLowerCase() || 'discover'} the hidden treasures of Nepal through carefully curated moments.`;
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

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Hero Section */}
                        <section className="pt-32 pb-16 text-white relative overflow-hidden">
                                <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${experience.image_url})` }}
                                >
                                        <div className="absolute inset-0 bg-black/50"></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
                                </div>

                                <div className="container mx-auto px-4 relative z-10">
                                        <div className="max-w-4xl mx-auto">
                                                <Link href="/experiences" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors group">
                                                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                                        Back to Experiences
                                                </Link>

                                                <div className="flex items-center space-x-4 mb-6">
                                                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                                                <div className="flex items-center space-x-2">
                                                                        {getCategoryIcon(experience.category)}
                                                                        <span>{experience.category}</span>
                                                                </div>
                                                        </Badge>
                                                        {experience.featured && (
                                                                <Badge className="bg-gold text-white border-0">
                                                                        Featured Experience
                                                                </Badge>
                                                        )}
                                                </div>

                                                <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 leading-tight">
                                                        {experience.title}
                                                </h1>
                                                {/* <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-2xl">
                                                        {experience.description}
                                                </p> */}

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                                                <Clock className="w-6 h-6 text-white/80" />
                                                                <div>
                                                                        <p className="text-sm text-white/80">Duration</p>
                                                                        <p className="font-semibold">{experience.duration}</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                                                <Users className="w-6 h-6 text-white/80" />
                                                                <div>
                                                                        <p className="text-sm text-white/80">Group Size</p>
                                                                        <p className="font-semibold">{experience.group_size}</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                                                <MapPin className="w-6 h-6 text-white/80" />
                                                                <div>
                                                                        <p className="text-sm text-white/80">Price</p>
                                                                        <p className="font-semibold text-gold">{experience.price || 'Contact for pricing'}</p>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* Experience Overview */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-6xl mx-auto">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                                        <div className="lg:col-span-2 space-y-8">
                                                                <div>
                                                                        <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
                                                                                About This Experience
                                                                        </h2>
                                                                        <div className="prose prose-lg max-w-none">
                                                                                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                                                                        {experience.description}
                                                                                </p>
                                                                                <p className="text-lg text-muted-foreground leading-relaxed">
                                                                                        {generateWhatToExpect(experience)}
                                                                                </p>
                                                                        </div>
                                                                </div>

                                                                {experience.highlights && experience.highlights.length > 0 && (
                                                                        <div>
                                                                                <h3 className="text-2xl font-display font-bold mb-6 text-foreground flex items-center">
                                                                                        <Star className="w-6 h-6 text-gold mr-3" />
                                                                                        Experience Highlights
                                                                                </h3>
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                        {experience.highlights.map((highlight: any, index: number) => (
                                                                                                <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-xl border">
                                                                                                        <div className="p-2 bg-primary rounded-lg flex-shrink-0">
                                                                                                                <Star className="w-4 h-4 text-white" />
                                                                                                        </div>
                                                                                                        <span className="text-foreground font-medium">{highlight}</span>
                                                                                                </div>
                                                                                        ))}
                                                                                </div>
                                                                        </div>
                                                                )}
                                                        </div>

                                                        {/* Quick Facts Sidebar */}
                                                        <div className="space-y-6">
                                                                {/* <Card className="shadow-card border-0">
                                                                        <CardContent className="p-6">
                                                                                <h3 className="text-2xl font-display font-bold mb-6 text-foreground">
                                                                                        Quick Facts
                                                                                </h3>

                                                                                <div className="space-y-4">
                                                                                        <div className="flex justify-between items-center py-3 border-b">
                                                                                                <span className="text-muted-foreground">Duration</span>
                                                                                                <span className="font-semibold text-foreground">{experience.duration}</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between items-center py-3 border-b">
                                                                                                <span className="text-muted-foreground">Group Size</span>
                                                                                                <span className="font-semibold text-foreground">{experience.group_size}</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between items-center py-3 border-b">
                                                                                                <span className="text-muted-foreground">Category</span>
                                                                                                <Badge variant="outline" className="font-semibold">
                                                                                                        {experience.category}
                                                                                                </Badge>
                                                                                        </div>
                                                                                        <div className="flex justify-between items-center py-3">
                                                                                                <span className="text-muted-foreground">Price</span>
                                                                                                <span className="font-semibold text-primary text-lg">{experience.price}</span>
                                                                                        </div>
                                                                                </div>

                                                                        </CardContent>
                                                                </Card> */}

                                                                {/* What to Expect Card */}
                                                                <Card className="shadow-card border-0 bg-gradient-to-br from-primary/5 to-accent/5">
                                                                        <CardContent className="p-6">
                                                                                <h3 className="text-xl font-display font-bold mb-4 text-foreground">
                                                                                        What to Expect
                                                                                </h3>
                                                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                                                        {generateWhatToExpect(experience)}
                                                                                </p>
                                                                        </CardContent>
                                                                </Card>
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
                                                        Ready to Create Lasting Memories?
                                                </h2>
                                                <p className="text-white/90 mb-8 leading-relaxed text-lg">
                                                        Contact us to customize this experience according to your preferences,
                                                        schedule, and create your perfect Himalayan journey.
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover-glow text-lg px-8">
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