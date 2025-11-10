"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        Compass,
        Clock,
        Star,
        ArrowRight
} from "lucide-react";
import Link from "next/link";;
import React from "react";
import { supabase } from "@/integrations/supabase/client";

const Experiences = () => {
        const [selectedCategory, setSelectedCategory] = React.useState("All");
        const [experiences, setExperiences] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [categories, setCategories] = React.useState(["All"]);

        React.useEffect(() => {
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

        const fetchExperiences = async () => {
                try {
                        const { data, error } = await supabase
                                .from('experiences')
                                .select('*')
                                .order('created_at', { ascending: false });

                        if (error) throw error;

                        setExperiences(data || []);

                        // Extract unique categories
                        const uniqueCategories = ["All", ...new Set(data?.map(exp => exp.category) || [])];
                        setCategories(uniqueCategories);
                } catch (error) {
                        console.error('Error fetching experiences:', error);
                } finally {
                        setLoading(false);
                }
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

        const experiences_old = [
                {
                        id: "luxury-spa",
                        title: "Himalayan Spa Retreat",
                        description: "Rejuvenate with traditional Ayurvedic treatments and modern wellness therapies",
                        category: "Wellness",
                        duration: "2-4 hours",
                        groupSize: "1-2 people",
                        highlights: ["Ayurvedic Massage", "Herbal Steam", "Meditation", "Yoga Sessions"],
                        featured: true,
                        price: "$120-280"
                },
                {
                        id: "cultural-immersion",
                        title: "Cultural Village Experience",
                        description: "Live with local families and learn traditional Nepalese crafts and customs",
                        category: "Culture",
                        duration: "1-3 days",
                        groupSize: "2-8 people",
                        highlights: ["Home Stays", "Cooking Classes", "Traditional Crafts", "Local Festivals"],
                        featured: true,
                        price: "$80-150"
                },
                {
                        id: "adventure-sports",
                        title: "Ultimate Adventure Package",
                        description: "Adrenaline-pumping activities from paragliding to white-water rafting",
                        category: "Adventure",
                        duration: "3-7 days",
                        groupSize: "4-12 people",
                        highlights: ["Paragliding", "Bungee Jumping", "River Rafting", "Rock Climbing"],
                        featured: true,
                        price: "$200-450"
                },
                {
                        id: "photography-workshop",
                        title: "Photography Masterclass",
                        description: "Capture stunning landscapes with professional photography guidance",
                        category: "Creative",
                        duration: "5-10 days",
                        groupSize: "4-8 people",
                        highlights: ["Sunrise Shoots", "Portrait Sessions", "Landscape Techniques", "Post-Processing"],
                        featured: false,
                        price: "$300-600"
                },
                {
                        id: "culinary-journey",
                        title: "Nepalese Culinary Adventure",
                        description: "Master authentic Nepalese cuisine with renowned local chefs",
                        category: "Culinary",
                        duration: "3-5 hours",
                        groupSize: "2-10 people",
                        highlights: ["Market Tours", "Cooking Classes", "Spice Workshops", "Traditional Recipes"],
                        featured: false,
                        price: "$60-120"
                },
                {
                        id: "meditation-retreat",
                        title: "Mindfulness & Meditation",
                        description: "Find inner peace through guided meditation in serene mountain settings",
                        category: "Wellness",
                        duration: "3-21 days",
                        groupSize: "1-15 people",
                        highlights: ["Guided Meditation", "Mindfulness Training", "Silent Retreats", "Buddhist Philosophy"],
                        featured: false,
                        price: "$150-400"
                },
                {
                        id: "wildlife-expedition",
                        title: "Wildlife Photography Safari",
                        description: "Encounter and photograph Nepal's incredible wildlife in their natural habitat",
                        category: "Wildlife",
                        duration: "2-7 days",
                        groupSize: "3-8 people",
                        highlights: ["Game Drives", "Bird Watching", "Photography Hides", "Night Safaris"],
                        featured: false,
                        price: "$180-350"
                },
                {
                        id: "helicopter-tour",
                        title: "Everest Helicopter Experience",
                        description: "Breathtaking aerial views of the world's highest peaks including Mount Everest",
                        category: "Luxury",
                        duration: "3-5 hours",
                        groupSize: "1-5 people",
                        highlights: ["Everest Views", "Kala Patthar Landing", "Champagne Breakfast", "Professional Photos"],
                        featured: true,
                        price: "$1200-2000"
                }
        ];

        const featuredExperiences = experiences.filter(exp => exp.featured);
        const filteredExperiences = selectedCategory === "All"
                ? experiences
                : experiences.filter(exp => exp.category === selectedCategory);

        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Hero Section */}
                        <section className="pt-32 pb-16 hero-gradient text-white">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-4xl mx-auto text-center">
                                                <Badge className="mb-6 bg-white/20 text-white border-white/30">
                                                        Unforgettable Memories
                                                </Badge>
                                                <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                                                        Unique
                                                        <span className="block text-luxury">Experiences</span>
                                                </h1>
                                                <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                                                        Immerse yourself in authentic Nepalese culture, adventure, and wellness.
                                                        Each experience is carefully crafted to create lasting memories.
                                                </p>
                                        </div>
                                </div>
                        </section>

                        {/* Featured Experiences */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        Signature Experiences
                                                </h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Our most sought-after experiences that showcase the very best of
                                                        what Nepal has to offer, from luxury to adventure.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {featuredExperiences.map((experience) => (
                                                        <Card key={experience.id} className="shadow-card hover-lift overflow-hidden">
                                                                <div className="relative h-48 bg-gradient-to-br from-primary via-accent to-gold">
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                                {experience.category === 'Wellness' && <Sparkles className="w-16 h-16 text-white/20" />}
                                                                                {experience.category === 'Culture' && <Heart className="w-16 h-16 text-white/20" />}
                                                                                {experience.category === 'Adventure' && <Mountain className="w-16 h-16 text-white/20" />}
                                                                                {experience.category === 'Luxury' && <Star className="w-16 h-16 text-white/20" />}
                                                                        </div>
                                                                        <Badge className="absolute top-4 left-4 bg-white/20 text-white border-white/30">
                                                                                {experience.category}
                                                                        </Badge>
                                                                        <Badge className="absolute top-4 right-4 bg-gold text-white">
                                                                                Featured
                                                                        </Badge>
                                                                        <div className="absolute bottom-4 right-4 text-white font-bold text-lg">
                                                                                {experience.price}
                                                                        </div>
                                                                </div>

                                                                <CardContent className="p-6">
                                                                        <h3 className="text-xl font-display font-semibold mb-2">
                                                                                {experience.title}
                                                                        </h3>
                                                                        <p className="text-muted-foreground text-sm mb-4">
                                                                                {experience.description}
                                                                        </p>

                                                                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                                                        <span>{experience.duration}</span>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Users className="w-4 h-4 text-muted-foreground" />
                                                                                        <span>{experience.groupSize}</span>
                                                                                </div>
                                                                        </div>

                                                                        <div className="space-y-2 mb-4">
                                                                                <h4 className="font-semibold text-sm">Includes:</h4>
                                                                                <div className="flex flex-wrap gap-1">
                                                                                        {experience.highlights.slice(0, 3).map((highlight) => (
                                                                                                <Badge key={highlight} variant="secondary" className="text-xs">
                                                                                                        {highlight}
                                                                                                </Badge>
                                                                                        ))}
                                                                                        {experience.highlights.length > 3 && (
                                                                                                <Badge variant="secondary" className="text-xs">
                                                                                                        +{experience.highlights.length - 3} more
                                                                                                </Badge>
                                                                                        )}
                                                                                </div>
                                                                        </div>

                                                                        <Link href={`/experience/${experience.id}`}>
                                                                                <Button className="w-full hero-gradient hover-glow">
                                                                                        Book Experience
                                                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                                                </Button>
                                                                        </Link>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* All Experiences by Category */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
                                                        All Experiences
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
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {filteredExperiences.map((experience) => (
                                                        <Card key={experience.id} className="shadow-card hover-lift bg-white">
                                                                <div className="relative h-32 bg-gradient-to-br from-primary/10 to-accent/10">
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                                {experience.category === 'Wellness' && <Sparkles className="w-8 h-8 text-primary/30" />}
                                                                                {experience.category === 'Culture' && <Heart className="w-8 h-8 text-accent/30" />}
                                                                                {experience.category === 'Adventure' && <Mountain className="w-8 h-8 text-gold/30" />}
                                                                                {experience.category === 'Creative' && <Camera className="w-8 h-8 text-primary/30" />}
                                                                                {experience.category === 'Culinary' && <Utensils className="w-8 h-8 text-accent/30" />}
                                                                                {experience.category === 'Wildlife' && <TreePine className="w-8 h-8 text-gold/30" />}
                                                                                {experience.category === 'Luxury' && <Star className="w-8 h-8 text-primary/30" />}
                                                                        </div>
                                                                        {experience.featured && (
                                                                                <Badge className="absolute top-2 right-2 bg-gold text-white text-xs">
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

                                                                        <h3 className="font-display font-semibold text-sm mb-2">
                                                                                {experience.title}
                                                                        </h3>

                                                                        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                                                                                {experience.description}
                                                                        </p>

                                                                        <div className="space-y-1 text-xs text-muted-foreground mb-3">
                                                                                <div>Duration: {experience.duration}</div>
                                                                                <div>Group: {experience.groupSize}</div>
                                                                        </div>

                                                                        <Link href={`/experience/${experience.id}`}>
                                                                                <Button variant="outline" size="sm" className="w-full text-xs">
                                                                                        View Details
                                                                                </Button>
                                                                        </Link>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* Experience Categories Overview */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
                                                        Types of Experiences
                                                </h2>
                                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                                        Whether you seek adventure, tranquility, culture, or luxury,
                                                        our diverse range of experiences caters to every traveler's passion.
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                                {[
                                                        {
                                                                icon: <Sparkles className="w-8 h-8" />,
                                                                title: "Wellness & Spa",
                                                                description: "Rejuvenate your mind and body with traditional healing practices",
                                                                count: "8 Experiences"
                                                        },
                                                        {
                                                                icon: <Mountain className="w-8 h-8" />,
                                                                title: "Adventure Sports",
                                                                description: "Thrilling activities for adrenaline seekers and outdoor enthusiasts",
                                                                count: "12 Experiences"
                                                        },
                                                        {
                                                                icon: <Heart className="w-8 h-8" />,
                                                                title: "Cultural Immersion",
                                                                description: "Deep dive into authentic Nepalese traditions and local life",
                                                                count: "6 Experiences"
                                                        },
                                                        {
                                                                icon: <Utensils className="w-8 h-8" />,
                                                                title: "Culinary Journey",
                                                                description: "Discover the rich flavors and cooking traditions of Nepal",
                                                                count: "4 Experiences"
                                                        }
                                                ].map((category, index) => (
                                                        <Card key={index} className="text-center shadow-card hover-lift">
                                                                <CardContent className="p-6">
                                                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                                                                                {category.icon}
                                                                        </div>
                                                                        <h3 className="font-display font-semibold text-lg mb-3">
                                                                                {category.title}
                                                                        </h3>
                                                                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                                                                {category.description}
                                                                        </p>
                                                                        <Badge variant="secondary" className="text-xs">
                                                                                {category.count}
                                                                        </Badge>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
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
                                                        Let our experience coordinators help you combine multiple activities
                                                        into a personalized itinerary that matches your interests and schedule.
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
