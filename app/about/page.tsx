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
  TreePine
} from "lucide-react";
import Link from "next/link";
import React from "react";

const AboutUsPage = () => {
 const teamMembers = [
  {
    name: "Giri",
    description: "The founder of an offbeat Himalayan camp and travel initiative, he specializes in curating cultural hikes and treks across the Himalayas. Driven by a passion for authentic travel, he creates experiences that connect travelers with local traditions, landscapes, and lesser-known trails.",
    role: "Founder & Cultural Curator",
    imageUrl: "/teams/giri.jpg",
    experience: "15+ years",
    featured: true
  },
  {
    name: "Ajit Negi",
    description: "An outgoing and deeply rooted explorer of the Himalayas, he specializes in organizing immersive cultural trips and guided hikes across the region. With a strong connection to local communities, he blends adventure with authentic cultural experiences.",
    role: "Cultural Explorer & Guide",
    imageUrl: "/teams/ajit-negi.jpg",
    experience: "12+ years"
  },
  {
    name: "Anuj Mallik",
    description: "A dynamic sales and marketing professional with a natural eye for photography, he specializes in curating and selling meaningful travel & stay experiences. With a deep appreciation for nature and detail, he connects clients to thoughtfully designed trips.",
    role: "Marketing & Experience Curator",
    imageUrl: "/teams/anuj-mallik.jpg",
    experience: "10+ years"
  },
  {
    name: "Som Bose",
    description: "A highly knowledgeable Trip Leader and founder of Experiential Himalaya, Som specializes in leading Himalayan trips that offer clients truly enriching experiences. With deep regional knowledge and years of hands-on expertise.",
    role: "Trip Leader & Founder",
    imageUrl: "/teams/som.jpg",
    experience: "18+ years",
    featured: true
  },
  {
    name: "Phunchok",
    description: "A seasoned Trek Leader overseeing operations in Ladakh and Kashmir area, Phunchok is a man for all seasons. With strong knowledge of the region's terrain, culture, and high-altitude conditions, he ensures safe, well-paced, and comfortable treks.",
    role: "Trek Leader & Operations",
    imageUrl: "/teams/phunchok.jpg",
    experience: "14+ years"
  }
];

  const services = [
    {
      title: "Locally Guided Treks",
      description: "Our treks are led by experienced local guides, certified mountaineers, and cultural experts.",
      icon: Compass,
      color: "bg-blue-500/10 text-blue-500"
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Discover the Himalayas
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Beyond
              <span className="block text-luxury">The Ordinary</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Shanti Himalaya is a specialized tour & camping operator offering immersive Himalayan journeys,
              experiential stays and expertly guided hikes & treks that connect travelers with the landscapes,
              cultures and spirit of the Himalayas.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Link href="/contact">Contact Our Experts</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/tours">View Our Tours</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
<section className="py-20 mountain-gradient">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
        Meet Our Passionate Team
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
        We have a dedicated team of passionate people that forms the backbone of Shanti Himalaya.
      </p>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Most of team members including the founder have spent much of their life's time in the mountains.
        We have travelled extensively across the Himalayas, and thus their understanding of the region
        goes far beyond maps and guidebooks.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {teamMembers.map((member, index) => (
        <Card key={index} className="shadow-card hover-lift overflow-hidden bg-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Fallback avatar with initial
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-display font-bold text-xl">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-xl mb-1">{member.name}</h3>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                      {member.role}
                    </Badge>
                  </div>
                  {member.featured && (
                    <Badge className="bg-gold text-white text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.description}
                </p>
                {member.experience && (
                  <div className="mt-3 flex items-center text-xs text-muted-foreground">
                    <Award className="w-3 h-3 mr-1" />
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
    src="/teams/team main.jpg"
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
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/tours">View All Tours</Link>
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