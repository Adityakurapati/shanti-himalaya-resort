"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Mountain,
  Camera,
  Users,
  Shield,
  Compass,
  Heart,
  Award,
  Phone,
  Mail,
  ArrowRight,
  MapPin,
  Calendar,
  Star,
  Clock,
  TreePine,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { aboutHeroImages } from "../images";

const AboutUsPage = () => {
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const getHeroImagePath = (filename: string) => {
    const basePath = process.env.NEXT_PUBLIC_IMAGE_PATH || '';
    return `${basePath}/About Us Hero image/${filename}`;
  };

  // Hero images array
  const heroImages = aboutHeroImages.map(getHeroImagePath);
  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const teamMembers = [
    {
      name: "Giri",
      description: "The founder of an offbeat Himalayan camp and travel initiative, he specializes in curating cultural hikes and treks across the Himalayas. Driven by a passion for authentic travel, he creates experiences that connect travelers with local traditions, landscapes, and lesser-known trails. His vision blends simplicity, sustainability, and deep cultural immersion, offering journeys that go far beyond conventional Himalayan travel.",
      role: "Founder & Cultural Curator",
      imageUrl: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/Team/Giri.jpg`,
      experience: "15+ years"
    },
    {
      name: "Ajit Negi",
      description: "An outgoing and deeply rooted explorer of the Himalayas, he specializes in organizing immersive cultural trips and guided hikes across the region. With a strong connection to local communities, he blends adventure with authentic cultural experiences, offering journeys that go beyond the usual trails. His trips are designed for travelers who seek meaningful exploration, breathtaking landscapes, and a true understanding of Himalayan life.",
      role: "Marketing & Experience Curator",
      imageUrl: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/Team/Ajit-Negi.jpg`,
      experience: "20+ years",
      featured: true
    },
    {
      name: "Anuj Mallik",
      description: "A dynamic sales and marketing professional with a natural eye for photography, he specializes in curating and selling meaningful travel & stay experiences. With a deep appreciation for nature and detail, he connects clients to thoughtfully designed trips focused on bird watching and immersive exploration. His blend of storytelling, visual creativity, and client understanding helps travelers choose journeys & stays that are enriching, responsible, and truly memorable.",
      role: "Marketing & PR",
      imageUrl: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/Team/Anuj-Mallik.jpg`,
      experience: "18+ years",
      featured: true
    },
    {
      name: "Ratnesh Rawat",
      description: "Deeply connected with the local community, our camp manager brings the hills to life through expertly guided village walks and authentic local experiences. His strong local relationships and intimate knowledge of the region ensure guests enjoy meaningful, immersive encounters with the culture, people, and traditions of this region.",
      role: "Camp Manager",
      imageUrl: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/Team/Ratnesh.jpg`,
      experience: "6+ years"
    },
    {
      name: "Som Bose",
      description: "A highly knowledgeable Trip Leader and founder of Experiential Himalaya, Som specializes in leading Himalayan trips that offer clients truly enriching experiences. With deep regional knowledge and years of hands-on expertise, he is quite experimental and ensures that every journey is safe, well-guided, and meaningful. His leadership style blends professionalism with warmth, allowing travelers to connect deeply with the landscapes, culture, and spirit of the Himalayas.",
      role: "Mentor & Leader",
      imageUrl: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/Team/Som.jpg`,
      experience: "18+ years",
    },
    {
      name: "Phunchok",
      description: "A seasoned Trek Leader overseeing operations in Ladakh and Kashmir area,  Phunchok is a man for all seasons. With strong knowledge of the region’s terrain, culture, and high-altitude conditions, he ensures safe, well-paced, and comfortable treks. His calm guidance, attentiveness, and genuine concern for travelers make each journey in Ladakh both secure and deeply rewarding.",
      role: "Leader & Operations",
      imageUrl: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/Team/Phunchok.jpg`,
      experience: "14+ years"
    },
  ];

  const services = [
    {
      title: "Locally Guided Treks",
      description: "Our treks are led by experienced local guides, certified mountaineers, and cultural experts.",
      icon: Compass,
      color: "bg-blue-500/10 text-blue-500 "
    },
    {
      title: "Luxury Camping",
      description: "Elevate your Himalayan camping with our boutique setups and gourmet local cuisine.",
      icon: TreePine,
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
      title: "Responsible Travel",
      description: "We prioritize sustainable tourism, supporting local communities and minimizing environmental impact.",
      icon: Heart,
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "Safety First",
      description: "Acclimatization-focused itineraries with emergency response planning and first-aid trained guides.",
      icon: Shield,
      color: "bg-red-500/10 text-red-500"
    },
    {
      title: "Cultural Immersion",
      description: "Stay in Himalayan villages, interact with locals, and experience traditional lifestyles.",
      icon: Users,
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Expert Planning",
      description: "We handle permits, transportation, meals, and logistics—so you can focus on the journey.",
      icon: Award,
      color: "bg-amber-500/10 text-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Carousel */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
              <img
                src={heroImages[index] || "/placeholder.svg"}
                alt={`Hero background ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              Discover the Himalayas
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white">
              Beyond
              <span className="block text-luxury">The Ordinary</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-8">
              Shanti Himalaya is a specialized tour & camping operator offering immersive Himalayan journeys,
              experiential stays and expertly guided hikes & treks that connect travelers with the landscapes,
              cultures and spirit of the Himalayas.
            </p>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center space-x-8 mb-8">
              <button
                onClick={goToPrevSlide}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                        ? 'bg-luxury w-8'
                        : 'bg-white/50 hover:bg-white/70'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNextSlide}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <Button
              size="lg"
              className="bg-luxury text-white hover:bg-luxury/90"
              asChild
            >
              <Link href="/contact">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Rest of your existing code remains the same */}
      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
              Why Choose Our Himalayan Tour Experiences?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traveling in the Himalayas requires more than logistics—it demands local knowledge,
              respect for nature, and thoughtful planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="shadow-card hover-lift overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-display mb-3">{service.title}</CardTitle>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section id="team" className="py-20 mountain-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
              Meet Our Passionate Team
            </h2>
            <p className="text-md text-muted-foreground max-w-2xl mx-auto mb-8">
              This core leading team is supported by a comprehensive camping and trekking team that typically includes qualified trek leaders, local guides, specialized support staff (cooks and kitchen staff), and logistical crew (porters, muleteers).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="shadow-card hover-lift overflow-hidden bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-8">
                    {/* Rectangular portrait image */}
                    <div className="w-36 h-44 rounded-xl overflow-hidden flex-shrink-0 border-2 border-primary/20 shadow-md">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : null}

                      ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-white font-display font-bold text-3xl">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-display font-semibold text-2xl mb-2">{member.name}</h3>
                          <Badge variant="outline" className="text-sm bg-primary/10 text-primary border-primary/30 px-3 py-1">
                            {member.role}
                          </Badge>
                        </div>
                        {member.featured && (
                          <Badge className="bg-gold text-white text-sm px-3 py-1">
                            <Star className="w-4 h-4 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {member.description}
                      </p>
                      {member.experience && (
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                          <Award className="w-4 h-4 mr-2" />
                          {member.experience} experience
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team Image Gallery */}
          <div className="mt-16">
            <Card className="shadow-card overflow-hidden border-0">
              <CardContent className="p-0">
                <div className="relative h-fit md:h-fit overflow-hidden">
                  <img
                    src="https://ik.imagekit.io/cyigpptqp/TEAM/Team%20main.jpg"
                    alt="Shanti Himalaya Team"
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-2xl font-display font-bold mb-2">Our Family</h3>
                      <p className="text-white/90">Together, we create unforgettable Himalayan experiences</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety & Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Safety, Comfort & Logistics You Can Trust
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-display font-bold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      High Safety Standards
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Acclimatization-focused itineraries
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        Emergency response planning
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        First-aid trained guides
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-display font-bold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      End-to-End Support
                    </h3>
                    <p className="text-muted-foreground">
                      We handle permits, transportation, meals, accommodation, and on-ground logistics—so you can focus on the journey.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Experiential Journeys Beyond Trekking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl">
                    <h3 className="text-xl font-display font-bold mb-3">Cultural & Village Immersion Tours</h3>
                    <p className="text-muted-foreground">
                      Stay in Himalayan villages, interact with locals, and experience traditional
                      lifestyles, cuisine, and festivals.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl">
                    <h3 className="text-xl font-display font-bold mb-3">Spiritual & Wellness Retreats</h3>
                    <p className="text-muted-foreground">
                      Explore monasteries, meditation retreats, and sacred Himalayan sites ideal
                      for mindfulness, yoga, and spiritual renewal.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl">
                    <h3 className="text-xl font-display font-bold mb-3">Wildlife & Nature Expeditions</h3>
                    <p className="text-muted-foreground">
                      Discover Himalayan biodiversity through guided nature walks and wildlife
                      spotting in protected reserves.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Best Time & CTA */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-6">Best Time to Visit the Himalayas</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              The ideal season for Himalayan treks varies by region, but our team helps you choose the perfect season and route based on your preferences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-center">Spring (March–May)</h3>
                <p className="text-white/80 text-center">Clear skies & blooming landscapes</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 mx-auto">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-center">Autumn (September–November)</h3>
                <p className="text-white/80 text-center">Best trekking conditions</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 mx-auto">
                  <SnowflakeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-center">Winter (December–February)</h3>
                <p className="text-white/80 text-center">Snow treks & serene experiences</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-display font-bold mb-6">Plan Your Himalayan Adventure Today</h3>
              <p className="text-white/90 mb-8">
                Whether you're seeking a challenging trek, a cultural immersion, or a transformative journey through the mountains,
                we're here to design the experience you've always dreamed of.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Link href="/contact">Contact Us Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Add missing Snowflake icon component
const SnowflakeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12h20" />
    <path d="M12 2v20" />
    <path d="m4.93 4.93 14.14 14.14" />
    <path d="m19.07 4.93-14.14 14.14" />
    <path d="m6.34 17.66 11.32-11.32" />
    <path d="m6.34 6.34 11.32 11.32" />
    <path d="m17.66 17.66-11.32-11.32" />
    <path d="m17.66 6.34-11.32 11.32" />
  </svg>
);

export default AboutUsPage;