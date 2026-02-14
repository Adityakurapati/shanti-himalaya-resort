"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumps";
import { generateStaySEO, generateSEOMetadata, generateJSONLD, generateBreadcrumbJSONLD } from "@/lib/seo-utils";
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
  Clock,
  Maximize2,
  Wifi,
  Coffee,
  Car,
  Thermometer,
  Shield,
  Bike,
  Navigation,
  Calendar,
  Compass,
  Award,
  Heart,
  Info
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import LocationMapEmbed from "@/components/admin/LocationMapEmbed";

// Helper function to properly parse accommodation features
const parseAccommodationFeatures = (featuresData: any): string[] => {
  if (!featuresData) return [];

  if (Array.isArray(featuresData)) {
    if (featuresData.length > 0) {
      const firstElement = featuresData[0];

      if (typeof firstElement === 'string' && firstElement.trim().startsWith('[') && firstElement.trim().endsWith(']')) {
        try {
          const parsed = JSON.parse(firstElement);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {
          try {
            const cleaned = firstElement
              .trim()
              .slice(1, -1)
              .replace(/\\"/g, '"')
              .replace(/"/g, '')
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0);
            return cleaned;
          } catch (cleanError) {
            return [];
          }
        }
      }

      if (featuresData.every(item => typeof item === 'string')) {
        return featuresData;
      }
    }
    return [];
  }

  if (typeof featuresData === 'string') {
    try {
      const parsed = JSON.parse(featuresData);
      if (Array.isArray(parsed)) {
        if (parsed.length === 1 && typeof parsed[0] === 'string') {
          try {
            const innerParsed = JSON.parse(parsed[0]);
            if (Array.isArray(innerParsed)) {
              return innerParsed;
            }
          } catch (innerError) {
            return [];
          }
        }
        return parsed;
      }
    } catch (e) {
      return [];
    }
  }

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

// Helper function to get connectivity icon
const getConnectivityIcon = (type: string) => {
  switch (type) {
    case 'airport':
      return <Plane className="w-5 h-5" />;
    case 'railway':
      return <Train className="w-5 h-5" />;
    case 'city':
      return <Building className="w-5 h-5" />;
    default:
      return <Navigation className="w-5 h-5" />;
  }
};

// Helper function to get image type badge
const getImageTypeBadge = (type: string) => {
  const badges: Record<string, string> = {
    restaurant: "bg-blue-100 text-blue-800",
    dining_area: "bg-purple-100 text-purple-800",
    food: "bg-amber-100 text-amber-800",
    ambiance: "bg-green-100 text-green-800",
    property: "bg-indigo-100 text-indigo-800",
    room: "bg-pink-100 text-pink-800",
    view: "bg-teal-100 text-teal-800",
    activity: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800"
  };
  return badges[type] || badges.other;
};

// Helper function to get image type label
const getImageTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    restaurant: "Restaurant",
    dining_area: "Dining Area",
    food: "Food",
    ambiance: "Ambiance",
    property: "Property",
    room: "Room",
    view: "View",
    activity: "Activity",
    other: "Other"
  };
  return labels[type] || "Other";
};

// Carousel Component for Images
const ImageCarousel = ({
  images,
  stayName,
  onImageClick,
  title = "Gallery"
}: {
  images: any[],
  stayName: string,
  onImageClick: (index: number) => void,
  title?: string
}) => {
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const slidesToShow = 3;
  const totalImages = images.length;

  const nextSlide = useCallback(() => {
    if (totalImages <= slidesToShow) {
      setCurrentStartIndex((prev) => (prev + 1) % totalImages);
    } else {
      setCurrentStartIndex((prev) => (prev + 1) % totalImages);
    }
  }, [totalImages, slidesToShow]);

  const prevSlide = useCallback(() => {
    if (totalImages <= slidesToShow) {
      setCurrentStartIndex((prev) => (prev - 1 + totalImages) % totalImages);
    } else {
      setCurrentStartIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  }, [totalImages, slidesToShow]);

  // Get visible images with cyclic behavior
  const getVisibleImages = useCallback(() => {
    if (totalImages === 0) return [];

    const visibleImages = [];
    for (let i = 0; i < slidesToShow; i++) {
      const index = (currentStartIndex + i) % totalImages;
      visibleImages.push({
        ...images[index],
        originalIndex: index
      });
    }
    return visibleImages;
  }, [images, currentStartIndex, totalImages, slidesToShow]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 0) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 3000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, nextSlide, images.length]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setAutoPlay(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    setAutoPlay(true);
  };

  if (images.length === 0) {
    return (
      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 h-[200px] flex items-center justify-center">
        <div className="text-center">
          <Home className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No images available</p>
        </div>
      </div>
    );
  }

  const visibleImages = getVisibleImages();

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Navigation Buttons */}
      {images.length > slidesToShow && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleImages.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className="relative rounded-lg overflow-hidden cursor-pointer group h-[200px]"
              onClick={() => onImageClick(image.originalIndex)}
            >
              <div className="absolute inset-0">
                <img
                  src={image.image_url || "/placeholder.svg"}
                  alt={image.caption || `${title} image ${image.originalIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 mb-2">
                  {image.image_type && (
                    <Badge className={getImageTypeBadge(image.image_type)} >
                      {getImageTypeLabel(image.image_type)}
                    </Badge>
                  )}
                  {image.is_featured && (
                    <Badge className="bg-amber-500">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-white text-sm font-medium truncate">
                  {image.caption || `${getImageTypeLabel(image.image_type || 'other')} view`}
                </p>
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-white/80" />
                  <span className="text-white/80 text-xs">Click to view larger</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Dots */}
      {images.length > slidesToShow && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalImages) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStartIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentStartIndex % Math.min(5, totalImages)
                    ? "bg-primary w-6"
                    : "bg-border hover:bg-border/80"
                  }`}
                aria-label={`Go to image set starting at ${index + 1}`}
              />
            ))}
            {totalImages > 5 && (
              <span className="text-sm text-muted-foreground ml-2">
                +{totalImages - 5} more
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Image Counter */}
      {images.length > slidesToShow && (
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Showing images {currentStartIndex + 1}-{Math.min(currentStartIndex + slidesToShow, totalImages)}
          {currentStartIndex + slidesToShow > totalImages && (
            ` and 1-${(currentStartIndex + slidesToShow) % totalImages}`
          )}
          {' '}of {totalImages} images
        </div>
      )}
    </div>
  );
};

export default function StayDetail() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [stay, setStay] = useState<any>(null);
  const [propertyImages, setPropertyImages] = useState<any[]>([]);
  const [restaurantImages, setRestaurantImages] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageTab, setActiveImageTab] = useState<"property" | "restaurant">("property");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");

  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Get current images based on active tab
  const getCurrentImages = () => {
    return activeImageTab === "property" ? propertyImages : restaurantImages;
  };

  // Get image caption
  const getImageCaption = (image: any, index: number) => {
    if (image?.caption && image.caption.trim() !== "") {
      return image.caption;
    }

    const defaultCaptions = {
      property: [
        "Property exterior view",
        "Interior view",
        "Common areas",
        "Scenic views",
        "Amenities",
        "Guest rooms",
        "Local experiences"
      ],
      restaurant: [
        "Dining area",
        "Cuisine showcase",
        "Ambiance",
        "Signature dishes",
        "Food presentation",
        "Restaurant interior"
      ]
    };

    const category = activeImageTab === "property" ? "property" : "restaurant";
    const captions = defaultCaptions[category];

    if (image?.image_type) {
      return `${getImageTypeLabel(image.image_type)} view`;
    }

    return captions[index % captions.length] || `${getImageTypeLabel(image?.image_type || 'other')} ${index + 1}`;
  };

  const getRightImage = (offset: number) => {
    const currentImages = getCurrentImages();
    const targetIndex = (currentImageIndex + offset) % currentImages.length;
    return currentImages[targetIndex];
  };

  const getThumbnailCaption = (offset: number) => {
    const image = getRightImage(offset);
    const currentImages = getCurrentImages();
    return getImageCaption(image, (currentImageIndex + offset) % currentImages.length);
  };

  // Auto-slide functionality
  useEffect(() => {
    const currentImages = getCurrentImages();
    if (currentImages.length <= 1) return;

    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }

    slideIntervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
    }, 3000);

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [propertyImages.length, restaurantImages.length, activeImageTab]);

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
      // Fetch stay by slug
      const { data: stayData, error: stayError } = await supabase
        .from("experiential_stays")
        .select("*")
        .eq("slug", id)
        .eq("is_active", true)
        .maybeSingle();

      if (stayError) throw stayError;

      if (!stayData) {
        setStay(null);
        setLoading(false);
        return;
      }

      // Fetch property images
      const { data: propertyImagesData } = await supabase
        .from("stay_images")
        .select("*")
        .eq("stay_id", stayData.id)
        .order("image_order", { ascending: true });

      // Fetch restaurant images
      const { data: restaurantImagesData } = await supabase
        .from("restaurant_images")
        .select("*")
        .eq("stay_id", stayData.id)
        .order("image_order", { ascending: true });

      // Fetch accommodations
      const { data: accommodationsData } = await supabase
        .from("accommodation_options")
        .select("*")
        .eq("stay_id", stayData.id)
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
        return {
          ...acc,
          features: features
        };
      });

      setStay(parsedStay);
      setPropertyImages(propertyImagesData || []);
      setRestaurantImages(restaurantImagesData || []);
      setAccommodations(parsedAccommodations);
    } catch (error) {
      console.error("Error fetching stay details:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    const currentImages = getCurrentImages();
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const prevImage = () => {
    const currentImages = getCurrentImages();
    setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }

    const currentImages = getCurrentImages();
    slideIntervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
    }, 3000);
  };

  const handleImageTabChange = (tab: "property" | "restaurant") => {
    setActiveImageTab(tab);
    setCurrentImageIndex(0);

    // Reset interval for new tab
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }

    const currentImages = tab === "property" ? propertyImages : restaurantImages;
    if (currentImages.length > 1) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
      }, 3000);
    }
  };

  const handleRestaurantImageClick = (index: number) => {
    handleImageTabChange("restaurant");
    handleImageSelect(index);
    setShowFullScreen(true);
  };

  const handlePropertyImageClick = (index: number) => {
    handleImageTabChange("property");
    handleImageSelect(index);
    setShowFullScreen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct email subject
    const subject = `Query for ${stay.name}`;

    // Construct email body with all form data
    const body = `
Dear Shanti Himalayas Team,

I'm interested in booking the following stay:

Stay Details:
- Stay Name: ${stay.name}
- Location: ${stay.location}
- Duration: ${stay.duration || "Not specified"}
- Badge: ${stay.badge}

My Requirements:
- Check-in Date: ${formData.checkInDate}
- Check-out Date: ${formData.checkOutDate}
- Number of Adults: ${formData.adults}
- Number of Children: ${formData.children}
- Contact Number: ${formData.contactNumber}
- Email: ${formData.email}

Additional Remarks:
${formData.remarks || "No additional remarks"}

Looking forward to your response.

Best regards,
${formData.contactNumber} | ${formData.email}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:shantihimalayas@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success message
    toast({
      title: "Email Client Opened",
      description: "Please send the email to complete your query submission.",
    });

    setIsSubmitted(true);
  };

  // Handle keyboard navigation for fullscreen view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showFullScreen) return;

      if (e.key === 'Escape') {
        setShowFullScreen(false);
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullScreen]);

  // Scroll spy for navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "accommodations", "dining", "location", "connectivity", "query"];
      
      for (const section of sections) {
        const element = sectionRefs.current[section];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, []);

  const currentImages = getCurrentImages();
  const currentImage = currentImages[currentImageIndex];

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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Stay Not Found</h1>
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

  // Parse connectivity data
  const connectivity = stay.connectivity || {};

  // Generate JSON-LD structured data
  const stayJSONLD = generateJSONLD(stay, "Stay");
  const breadcrumbStructuredData = generateBreadcrumbJSONLD([
    { name: "Home", url: "/" },
    { name: "Experiential Stays", url: "/experiential-stays" },
    { name: stay.name, url: `/experiential-stays/${stay.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stayJSONLD) }}
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
        <section className="relative pt-24 pb-8 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <Link
              href="/experiential-stays"
              className="inline-flex items-center mb-6 text-primary hover:text-primary/80 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to All Stays
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                    {stay.name}
                  </h1>
                  {stay.badge && (
                    <Badge className="bg-primary text-primary-foreground px-4 py-2 text-lg">
                      {stay.badge}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{stay.location || "Location not specified"}</span>
                </div>

                {/* Categories */}
                {stay.categories && stay.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {stay.categories.map((category: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {stay.duration && (
                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">Duration: {stay.duration}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sticky Navigation */}
        <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md border-y border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center overflow-x-auto py-3 gap-2 no-scrollbar">
              <Button
                variant={activeSection === "overview" ? "default" : "ghost"}
                size="sm"
                onClick={() => scrollToSection("overview")}
                className="whitespace-nowrap"
              >
                <Info className="w-4 h-4 mr-2" />
                Overview
              </Button>
              {accommodations.length > 0 && (
                <Button
                  variant={activeSection === "accommodations" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToSection("accommodations")}
                  className="whitespace-nowrap"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Accommodations ({accommodations.length})
                </Button>
              )}
              {(stay.restaurant_description || restaurantImages.length > 0) && (
                <Button
                  variant={activeSection === "dining" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToSection("dining")}
                  className="whitespace-nowrap"
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  Dining
                </Button>
              )}
              <Button
                variant={activeSection === "location" ? "default" : "ghost"}
                size="sm"
                onClick={() => scrollToSection("location")}
                className="whitespace-nowrap"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </Button>
              {(connectivity.airport || connectivity.railway || connectivity.city) && (
                <Button
                  variant={activeSection === "connectivity" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToSection("connectivity")}
                  className="whitespace-nowrap"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Connectivity
                </Button>
              )}
              <Button
                variant={activeSection === "query" ? "default" : "ghost"}
                size="sm"
                onClick={() => scrollToSection("query")}
                className="whitespace-nowrap"
              >
                <Send className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </div>
          </div>
        </div>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Image Gallery Section */}
              <div ref={(el) => { sectionRefs.current["overview"] = el; }} className="mb-12 scroll-mt-32">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Home className="w-6 h-6 text-primary" />
                    Gallery
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant={activeImageTab === "property" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleImageTabChange("property")}
                      className="gap-2"
                    >
                      <Home className="w-4 h-4" />
                      Property ({propertyImages.length})
                    </Button>
                    <Button
                      variant={activeImageTab === "restaurant" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleImageTabChange("restaurant")}
                      className="gap-2"
                    >
                      <Utensils className="w-4 h-4" />
                      Restaurant ({restaurantImages.length})
                    </Button>
                  </div>
                </div>

                {/* Image Gallery */}
                {currentImages.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Image */}
                    <div className="lg:col-span-2">
                      <div className="relative h-[400px] rounded-xl overflow-hidden group">
                        <img
                          src={currentImage?.image_url || "/placeholder.svg"}
                          alt={`${stay.name} - ${getImageCaption(currentImage, currentImageIndex)}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onClick={() => setShowFullScreen(true)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={getImageTypeBadge(currentImage?.image_type || 'other')}>
                            {getImageTypeLabel(currentImage?.image_type || 'other')}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                          {getImageCaption(currentImage, currentImageIndex)}
                        </div>
                        {currentImage?.is_featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-amber-500 hover:bg-amber-600">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-4 right-4 bg-black/60 text-white hover:bg-black/80 border-none opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setShowFullScreen(true)}
                        >
                          <Maximize2 className="w-4 h-4 mr-2" />
                          View Full Size
                        </Button>
                      </div>
                    </div>

                    {/* Right Column Images */}
                    <div className="space-y-4">
                      {getRightImage(1) && (
                        <div
                          className="relative h-[128px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
                          onClick={() => handleImageSelect((currentImageIndex + 1) % currentImages.length)}
                        >
                          <img
                            src={getRightImage(1).image_url || "/placeholder.svg"}
                            alt={`${stay.name} - ${getThumbnailCaption(1)}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                            {getThumbnailCaption(1)}
                          </div>
                        </div>
                      )}

                      {getRightImage(2) && (
                        <div
                          className="relative h-[128px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
                          onClick={() => handleImageSelect((currentImageIndex + 2) % currentImages.length)}
                        >
                          <img
                            src={getRightImage(2).image_url || "/placeholder.svg"}
                            alt={`${stay.name} - ${getThumbnailCaption(2)}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                            {getThumbnailCaption(2)}
                          </div>
                        </div>
                      )}

                      {getRightImage(3) && (
                        <div
                          className="relative h-[128px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
                          onClick={() => handleImageSelect((currentImageIndex + 3) % currentImages.length)}
                        >
                          <img
                            src={getRightImage(3).image_url || "/placeholder.svg"}
                            alt={`${stay.name} - ${getThumbnailCaption(3)}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-6 h-6 text-white" />
                          </div>
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
                      {activeImageTab === "property" ? (
                        <Home className="w-20 h-20 text-primary/30 mx-auto mb-4" />
                      ) : (
                        <Utensils className="w-20 h-20 text-primary/30 mx-auto mb-4" />
                      )}
                      <p className="text-muted-foreground">
                        No {activeImageTab} images available yet
                      </p>
                    </div>
                  </div>
                )}

                {/* Image Navigation */}
                {currentImages.length > 1 && (
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
                          setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
                        }, 3000);
                      }}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex space-x-2">
                      {currentImages.map((img, index) => (
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
                          setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
                        }, 3000);
                      }}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                      Image {currentImageIndex + 1} of {currentImages.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Overview Section */}
              {stay.overview && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Info className="w-6 h-6 text-primary" />
                    Overview
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {stay.overview}
                    </p>
                  </div>
                </div>
              )}

              {/* Description Section */}
              {stay.description && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Compass className="w-6 h-6 text-primary" />
                    About the Stay
                  </h2>
                  <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-6">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {stay.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Accommodations Section */}
              {accommodations.length > 0 && (
                <div ref={(el) => { sectionRefs.current["accommodations"] = el; }} className="mb-12 scroll-mt-32">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Home className="w-6 h-6 text-primary" />
                    Accommodation Options
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {accommodations.map((acc) => (
                      <Card key={acc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {acc.image_url && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={acc.image_url}
                              alt={acc.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">{acc.name}</h3>
                          {acc.capacity && (
                            <div className="flex items-center gap-2 text-muted-foreground mb-3">
                              <Users className="w-4 h-4" />
                              <span>Capacity: {acc.capacity}</span>
                            </div>
                          )}
                          {acc.features && acc.features.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-muted-foreground">Features:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {acc.features.map((feature: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Dining Section */}
              {(stay.restaurant_description || restaurantImages.length > 0) && (
                <div ref={(el) => { sectionRefs.current["dining"] = el; }} className="mb-12 scroll-mt-32">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Utensils className="w-6 h-6 text-primary" />
                    Dining Experience
                  </h2>

                  {/* Restaurant Images Carousel */}
                  {restaurantImages.length > 0 && (
                    <div className="mb-8">
                      <ImageCarousel
                        images={restaurantImages}
                        stayName={stay.name}
                        onImageClick={handleRestaurantImageClick}
                        title="Restaurant"
                      />
                    </div>
                  )}

                  {/* Restaurant Description */}
                  {stay.restaurant_description && (
                    <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-6">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {stay.restaurant_description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Location & Address Section */}
              <div ref={(el) => { sectionRefs.current["location"] = el; }} className="mb-12 scroll-mt-32">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Location
                </h2>
                
                {stay.address && (
                  <div className="mb-4 p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-semibold mb-2">Address:</h3>
                    <p className="text-muted-foreground">{stay.address}</p>
                  </div>
                )}

                {stay.map_url && (
                  <LocationMapEmbed
                    mapUrl={stay.map_url}
                    address={stay.address}
                    locationName={stay.name}
                    height="450px"
                    showTitle={false}
                    showBadge={true}
                    showAddress={true}
                    showOpenButton={true}
                  />
                )}
              </div>

              {/* Connectivity Section */}
              {(connectivity.airport || connectivity.railway || connectivity.city) && (
                <div ref={(el) => { sectionRefs.current["connectivity"] = el; }} className="mb-12 scroll-mt-32">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Navigation className="w-6 h-6 text-primary" />
                    How to Reach
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {connectivity.airport && (
                      <Card>
                        <CardContent className="p-4 flex items-start gap-3">
                          <Plane className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold mb-1">Nearest Airport</h3>
                            <p className="text-sm text-muted-foreground">{connectivity.airport}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {connectivity.railway && (
                      <Card>
                        <CardContent className="p-4 flex items-start gap-3">
                          <Train className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold mb-1">Nearest Railway Station</h3>
                            <p className="text-sm text-muted-foreground">{connectivity.railway}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {connectivity.city && (
                      <Card>
                        <CardContent className="p-4 flex items-start gap-3">
                          <Building className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold mb-1">Nearest City</h3>
                            <p className="text-sm text-muted-foreground">{connectivity.city}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Query Form */}
              <div ref={(el) => { sectionRefs.current["query"] = el; }} className="mb-16 scroll-mt-32">
                <Card className="border-2 border-primary/10">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-foreground mb-2">Book Your Stay</h2>
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

                      <div className="flex flex-col items-center gap-4">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-12 py-6 text-lg"
                          disabled={isSubmitted}
                        >
                          {isSubmitted ? (
                            <>
                              <Check className="mr-2 h-5 w-5" />
                              Query Submitted
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              Submit Query
                            </>
                          )}
                        </Button>

                        {isSubmitted && (
                          <div className="text-green-600 text-sm flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
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

        {/* Fullscreen Image Modal */}
        {showFullScreen && currentImage && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-7xl max-h-[90vh]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
                onClick={() => setShowFullScreen(false)}
              >
                <span className="sr-only">Close</span>
                <span className="text-2xl">×</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
                onClick={prevImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              <img
                src={currentImage.image_url || "/placeholder.svg"}
                alt={getImageCaption(currentImage, currentImageIndex)}
                className="w-full h-full object-contain max-h-[80vh] rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg text-sm">
                {getImageCaption(currentImage, currentImageIndex)}
                <span className="ml-2 text-muted-foreground">
                  ({currentImageIndex + 1} of {currentImages.length})
                </span>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}