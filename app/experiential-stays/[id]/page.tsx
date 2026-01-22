"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Home,
    MapPin,
    Star,
    ArrowLeft,
    CheckCircle,
    Users,
    Utensils,
    Phone,
    Mail,
    Plane,
    Train,
    Building,
    ChevronLeft,
    ChevronRight,
    Send,
    Check,
    Clock
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";

// Helper function to properly parse accommodation features
const parseAccommodationFeatures = (featuresData: any): string[] => {
    if (!featuresData) return [];
    
    console.log('Parsing features - raw data:', featuresData);
    console.log('Type of raw data:', typeof featuresData);
    
    // If it's already an array of strings, return it
    if (Array.isArray(featuresData)) {
        console.log('Is array, length:', featuresData.length);
        
        // Check if it's an array containing a JSON string as the first element
        if (featuresData.length > 0) {
            const firstElement = featuresData[0];
            console.log('First element:', firstElement, 'Type:', typeof firstElement);
            
            // If the first element is a string that looks like JSON
            if (typeof firstElement === 'string' && firstElement.trim().startsWith('[') && firstElement.trim().endsWith(']')) {
                try {
                    console.log('First element looks like JSON, trying to parse...');
                    const parsed = JSON.parse(firstElement);
                    console.log('Parsed from string in array:', parsed);
                    
                    if (Array.isArray(parsed)) {
                        return parsed;
                    }
                } catch (e) {
                    console.error('Failed to parse string in array:', e);
                    // If parsing fails, try to clean it up
                    try {
                        // Remove outer brackets and quotes
                        const cleaned = firstElement
                            .trim()
                            .slice(1, -1) // Remove outer brackets
                            .replace(/\\"/g, '"') // Replace \" with "
                            .replace(/"/g, '') // Remove remaining quotes
                            .split(',') // Split by comma
                            .map(item => item.trim())
                            .filter(item => item.length > 0);
                        
                        console.log('Cleaned features:', cleaned);
                        return cleaned;
                    } catch (cleanError) {
                        console.error('Failed to clean features:', cleanError);
                        return [];
                    }
                }
            }
            
            // Check if all elements are strings (what we want)
            if (featuresData.every(item => typeof item === 'string')) {
                console.log('All elements are strings, returning as is');
                return featuresData;
            }
        }
        return [];
    }
    
    // If it's a string, try to parse it
    if (typeof featuresData === 'string') {
        console.log('Is string, trying to parse as JSON');
        try {
            // First, try to parse it directly
            const parsed = JSON.parse(featuresData);
            console.log('Direct parse result:', parsed);
            
            if (Array.isArray(parsed)) {
                // Check if this array contains a JSON string
                if (parsed.length === 1 && typeof parsed[0] === 'string') {
                    try {
                        const innerParsed = JSON.parse(parsed[0]);
                        if (Array.isArray(innerParsed)) {
                            return innerParsed;
                        }
                    } catch (innerError) {
                        console.error('Failed to parse inner string:', innerError);
                    }
                }
                return parsed;
            }
        } catch (e) {
            console.error('Failed to parse string as JSON:', e);
            return [];
        }
    }
    
    console.log('No valid data found, returning empty array');
    return [];
};

// Helper function to parse JSON data
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

export default function StayDetail() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [stay, setStay] = useState<any>(null);
    const [images, setImages] = useState<any[]>([]);
    const [accommodations, setAccommodations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const getImageCaption = (image: any, index: number) => {
        if (image?.caption && image.caption.trim() !== "") {
            return image.caption;
        }

        const defaultCaptions = [
            "Property exterior/landscape view",
            "Interior/Room view",
            "Dining/Restaurant area",
            "Activity/Experience shot",
            "Amenities/Facilities",
            "Scenic views",
            "Guest areas",
            "Local experiences"
        ];
        return defaultCaptions[index] || `Image ${index + 1}`;
    };

    const getRightImage = (offset: number) => {
        const targetIndex = (currentImageIndex + offset) % images.length;
        return images[targetIndex];
    };

    const getThumbnailCaption = (offset: number) => {
        const image = getRightImage(offset);
        return getImageCaption(image, (currentImageIndex + offset) % images.length);
    };

    // Auto-slide functionality
    useEffect(() => {
        if (images.length <= 1) return;

        if (slideIntervalRef.current) {
            clearInterval(slideIntervalRef.current);
        }

        slideIntervalRef.current = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 1500);

        return () => {
            if (slideIntervalRef.current) {
                clearInterval(slideIntervalRef.current);
            }
        };
    }, [images.length, currentImageIndex]);

    // Form state
    const [formData, setFormData] = useState({
        checkInDate: "",
        checkOutDate: "",
        adults: "2",
        children: "0",
        contactNumber: "",
        email: "",
        remarks: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (id) {
            fetchStayDetails();
        }
    }, [id]);

    const fetchStayDetails = async () => {
        try {
            // Fetch stay
            const { data: stayData, error: stayError } = await supabase
                .from("experiential_stays")
                .select("*")
                .eq("id", id)
                .eq("is_active", true)
                .single();

            if (stayError) throw stayError;

            if (!stayData) {
                setStay(null);
                setLoading(false);
                return;
            }

            // Fetch images
            const { data: imagesData } = await supabase
                .from("stay_images")
                .select("*")
                .eq("stay_id", id)
                .order("image_order", { ascending: true });

            // Fetch accommodations
            const { data: accommodationsData } = await supabase
                .from("accommodation_options")
                .select("*")
                .eq("stay_id", id)
                .order("sort_order", { ascending: true });

            // Parse stay data
            const parsedStay = {
                ...stayData,
                categories: parseJSON(stayData.categories, []),
                connectivity: parseJSON(stayData.connectivity, { airport: "", railway: "", city: "" }),
            };

            // Parse accommodations with proper feature handling
            const parsedAccommodations = (accommodationsData || []).map(acc => {
                const features = parseAccommodationFeatures(acc.features);
                console.log(`Room "${acc.name}" features:`, features);
                
                return {
                    ...acc,
                    features: features
                };
            });

            console.log('All accommodations with features:', parsedAccommodations);

            setStay(parsedStay);
            setImages(imagesData || []);
            setAccommodations(parsedAccommodations);
        } catch (error) {
            console.error("Error fetching stay details:", error);
        } finally {
            setLoading(false);
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleImageSelect = (index: number) => {
        setCurrentImageIndex(index);
        if (slideIntervalRef.current) {
            clearInterval(slideIntervalRef.current);
        }
        
        slideIntervalRef.current = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitted(true);

            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    checkInDate: "",
                    checkOutDate: "",
                    adults: "2",
                    children: "0",
                    contactNumber: "",
                    email: "",
                    remarks: ""
                });
            }, 3000);

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    useEffect(() => {
        return () => {
            if (slideIntervalRef.current) {
                clearInterval(slideIntervalRef.current);
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="pt-32 pb-16 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading stay details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!stay) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="pt-32 pb-16 text-center">
                    <div className="max-w-md mx-auto">
                        <Home className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-foreground mb-4">Stay Not Found</h1>
                        <p className="text-muted-foreground mb-6">The stay you're looking for doesn't exist or has been removed.</p>
                        <Link href="/experiential-stays">
                            <Button className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to All Stays
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const currentImage = images[currentImageIndex];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <section className="pt-24 pb-8 relative">
                <div className="container mx-auto px-4">
                    <Link
                        href="/experiential-stays"
                        className="inline-flex items-center mb-8 text-primary hover:text-primary/80 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to All Stays
                    </Link>
                </div>
            </section>

            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Stay Name and Badge */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                        {stay.name}
                                    </h1>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-5 h-5" />
                                        <span className="text-lg">{stay.location || "Location not specified"}</span>
                                    </div>
                                </div>
                                <Badge className="bg-primary text-primary-foreground px-4 py-2 text-lg">
                                    {stay.badge}
                                </Badge>
                            </div>
                        </div>

                        {/* Categories */}
                        {stay.categories && stay.categories.length > 0 && (
                            <div className="mb-8">
                                <div className="flex flex-wrap gap-2">
                                    {stay.categories.map((category: string, index: number) => (
                                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                                            {category}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-border my-8"></div>

                        {/* Image Gallery */}
                        <div className="mb-12">
                            {images.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Main Image */}
                                    <div className="lg:col-span-2">
                                        <div className="relative h-[400px] rounded-xl overflow-hidden">
                                            <img
                                                src={currentImage?.image_url || "/placeholder.svg"}
                                                alt={`${stay.name} - ${getImageCaption(currentImage, currentImageIndex)}`}
                                                className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                }}
                                            />
                                            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                                                {getImageCaption(currentImage, currentImageIndex)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column Images */}
                                    <div className="space-y-4">
                                        {getRightImage(1) && (
                                            <div
                                                className="relative h-[128px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => handleImageSelect((currentImageIndex + 1) % images.length)}
                                            >
                                                <img
                                                    src={getRightImage(1).image_url}
                                                    alt={`${stay.name} - ${getThumbnailCaption(1)}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                    }}
                                                />
                                                <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                                    {getThumbnailCaption(1)}
                                                </div>
                                            </div>
                                        )}

                                        {getRightImage(2) && (
                                            <div
                                                className="relative h-[128px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => handleImageSelect((currentImageIndex + 2) % images.length)}
                                            >
                                                <img
                                                    src={getRightImage(2).image_url}
                                                    alt={`${stay.name} - ${getThumbnailCaption(2)}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                    }}
                                                />
                                                <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                                    {getThumbnailCaption(2)}
                                                </div>
                                            </div>
                                        )}

                                        {getRightImage(3) && (
                                            <div
                                                className="relative h-[128px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => handleImageSelect((currentImageIndex + 3) % images.length)}
                                            >
                                                <img
                                                    src={getRightImage(3).image_url}
                                                    alt={`${stay.name} - ${getThumbnailCaption(3)}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                    }}
                                                />
                                                <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                                    {getThumbnailCaption(3)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 h-[400px] flex items-center justify-center">
                                    <div className="text-center">
                                        <Home className="w-20 h-20 text-primary/30 mx-auto mb-4" />
                                        <p className="text-muted-foreground">No images available for this stay</p>
                                    </div>
                                </div>
                            )}

                            {/* Image Navigation */}
                            {images.length > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            prevImage();
                                            if (slideIntervalRef.current) {
                                                clearInterval(slideIntervalRef.current);
                                            }
                                            slideIntervalRef.current = setInterval(() => {
                                                setCurrentImageIndex((prev) => (prev + 1) % images.length);
                                            }, 3000);
                                        }}
                                        className="h-8 w-8"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex space-x-2">
                                        {images.map((img, index) => (
                                            <button
                                                key={img.id}
                                                onClick={() => handleImageSelect(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-primary w-6" : "bg-border"}`}
                                            />
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            nextImage();
                                            if (slideIntervalRef.current) {
                                                clearInterval(slideIntervalRef.current);
                                            }
                                            slideIntervalRef.current = setInterval(() => {
                                                setCurrentImageIndex((prev) => (prev + 1) % images.length);
                                            }, 3000);
                                        }}
                                        className="h-8 w-8"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm text-muted-foreground ml-2">
                                        Image {currentImageIndex + 1} of {images.length}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Address and Overview */}
                        <div className="mb-12">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground mb-2">Address</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {stay.address || "Address information coming soon"}
                                        </p>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground mb-2">Overview</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {stay.overview || stay.description || "Experience the beauty of the Himalayas"}
                                        </p>
                                    </div>
                                </div>

                                {/* Connectivity Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground mb-4">Connectivity</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Plane className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-medium text-foreground">Nearest Airport</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {stay.connectivity?.airport || "Information not available"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Train className="w-5 h-5 text-primary mt=1 flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-medium text-foreground">Nearest Railhead</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {stay.connectivity?.railway || "Information not available"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Building className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-medium text-foreground">Nearest City</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {stay.connectivity?.city || "Information not available"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border my-8"></div>

                        {/* Accommodation Options */}
                        {accommodations.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-foreground mb-6">Accommodation</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {accommodations.map((room) => (
                                        <Card key={room.id} className="overflow-hidden">
                                            <div className="relative h-48">
                                                {room.image_url ? (
                                                    <img
                                                        src={room.image_url}
                                                        alt={room.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                                        <Home className="w-12 h-12 text-primary/30" />
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-bold text-lg mb-2 text-foreground">{room.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                                    <Users className="w-4 h-4" />
                                                    <span>Ideal For: {room.capacity || "Not specified"}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {Array.isArray(room.features) && room.features.length > 0 ? (
                                                        room.features.slice(0, 3).map((feature: string, index: number) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                                <span className="text-sm text-muted-foreground">{feature}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">No features listed</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-border my-8"></div>

                        {/* Restaurant Description */}
                        {stay.restaurant_description && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Utensils className="w-6 h-6 text-primary" />
                                    Restaurant
                                </h2>
                                <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-6">
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {stay.restaurant_description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
                            <div className="prose prose-lg max-w-none text-muted-foreground">
                                <p className="leading-relaxed whitespace-pre-line">
                                    {stay.description}
                                </p>
                            </div>
                        </div>

                        {/* Query Form */}
                        <div className="mb-16">
                            <Card>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold text-foreground mb-2">Your Query</h2>
                                            <p className="text-muted-foreground">Fill in the details below and we'll get back to you within 24 hours.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="checkInDate">Check In Date</Label>
                                                <Input
                                                    id="checkInDate"
                                                    name="checkInDate"
                                                    type="date"
                                                    value={formData.checkInDate}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="checkOutDate">Check Out Date</Label>
                                                <Input
                                                    id="checkOutDate"
                                                    name="checkOutDate"
                                                    type="date"
                                                    value={formData.checkOutDate}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="adults">No. of Adults</Label>
                                                <Input
                                                    id="adults"
                                                    name="adults"
                                                    type="number"
                                                    min="1"
                                                    value={formData.adults}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="children">No. of Children</Label>
                                                <Input
                                                    id="children"
                                                    name="children"
                                                    type="number"
                                                    min="0"
                                                    value={formData.children}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="contactNumber">Contact No.</Label>
                                                <Input
                                                    id="contactNumber"
                                                    name="contactNumber"
                                                    type="tel"
                                                    placeholder="+91 12345 67890"
                                                    value={formData.contactNumber}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <Label htmlFor="remarks">Remarks</Label>
                                            <Textarea
                                                id="remarks"
                                                name="remarks"
                                                placeholder="Any special requirements or questions..."
                                                value={formData.remarks}
                                                onChange={handleInputChange}
                                                rows={4}
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                            <Button
                                                type="submit"
                                                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8"
                                                disabled={isSubmitted}
                                            >
                                                {isSubmitted ? (
                                                    <>
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Query Submitted
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Submit Query
                                                    </>
                                                )}
                                            </Button>

                                            {isSubmitted && (
                                                <div className="text-green-600 text-sm flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Thanks for your query. We shall check the availability & reply back within 24 Hours.
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}