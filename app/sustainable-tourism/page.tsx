"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Mountain,
  Users,
  Heart,
  Target,
  Globe,
  Shield,
  Sparkles,
  TrendingUp,
  HeartHandshake,
  BookOpen,
  Recycle,
  HandHeart,
  Trees,
  Star,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  Trophy,
  Award,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Utensils,
  Home,
  Camera,
  ChevronDown,
  ChevronUp,
  Play,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

const FadeInSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const SlideInSection = ({ children, direction = "left", delay = 0 }: { children: React.ReactNode; direction?: "left" | "right"; delay?: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction === "left" ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: direction === "left" ? -50 : 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const ActivityItem = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);

const DetailItem = ({ icon: Icon, title, value, color }: { icon: any; title: string; value: string; color: string }) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
    teal: "bg-teal-100 text-teal-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
};

const ResponsiveTourismPage = () => {
  const [activeTab, setActiveTab] = useState("sustainability");

  const principles = [
    {
      icon: Leaf,
      title: "Eco-Friendly Travel",
      description: "Minimizing environmental impact through responsible practices",
      color: "emerald",
    },
    {
      icon: Users,
      title: "Cultural Respect",
      description: "Honoring and preserving local traditions and communities",
      color: "amber",
    },
    {
      icon: Heart,
      title: "Positive Impact",
      description: "Creating meaningful benefits for local communities",
      color: "rose",
    },
    {
      icon: Target,
      title: "Sustainable Focus",
      description: "Long-term commitment to environmental conservation",
      color: "teal",
    },
  ];

  const sustainabilityFeatures = [
    {
      title: "Waste Reduction",
      description: "Implementing comprehensive waste management systems and promoting zero-waste initiatives in all our operations.",
      icon: Recycle,
      color: "emerald",
    },
    {
      title: "Eco-Tourism",
      description: "Designing experiences that educate travelers about local ecosystems while minimizing environmental impact.",
      icon: Trees,
      color: "teal",
    },
    {
      title: "Economic Empowerment",
      description: "Creating fair employment opportunities and supporting local businesses through community-based tourism.",
      icon: TrendingUp,
      color: "amber",
    },
    {
      title: "Sustainable Communities",
      description: "Investing in infrastructure and education that supports long-term community development.",
      icon: Users,
      color: "blue",
    },
  ];

  const womenEmpowermentStats = [
    { value: "60%", label: "Women Staff", description: "of our team consists of empowered local women" },
    { value: "25+", label: "Programs", description: "focused on women's skill development" },
    { value: "100%", label: "Equal Pay", description: "ensuring gender equality in compensation" },
    { value: "15", label: "Communities", description: "actively participating in women-led initiatives" },
  ];

  const givingBackOpportunities = [
    {
      title: "Education Support",
      description: "Volunteer in local schools and educational programs to support children's learning.",
      icon: BookOpen,
    },
    {
      title: "Community Work",
      description: "Participate in infrastructure development and community improvement projects.",
      icon: HeartHandshake,
    },
    {
      title: "Eco-Tourism Projects",
      description: "Join conservation efforts and sustainable tourism development initiatives.",
      icon: Globe,
    },
    {
      title: "Skill Development",
      description: "Share your expertise in workshops and training sessions for local communities.",
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              href="/"
              className="inline-flex items-center mb-6 text-white/80 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <div className="flex items-center space-x-4 mb-6">
              <Badge className="bg-white/20 text-white border-white/30">
                Our Commitment
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white">
              Responsible Tourism
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Travel with purpose, respect, and positive impact in the majestic Himalayas
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-primary hover:bg-white/90"
                onClick={() => window.location.href = "mailto:shantihimalaya@gmail.com"}
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-1 bg-primary rounded-full"></div>
                <span className="mx-4 text-lg font-semibold text-primary">Our Philosophy</span>
                <div className="w-16 h-1 bg-primary rounded-full"></div>
              </div>
              
              <p className="text-lg text-muted-foreground text-center leading-relaxed mb-8">
                <span className="font-semibold text-primary">"Shanti Himalaya"</span> offers eco-friendly travel journeys and experiences that prioritize responsible tourism along with respect for local culture and environmental conservation. From trekking to cultural exploration while visiting vibrant villages, our trips are designed to minimize your impact and maximize your connection with stunning landscapes of Himalayas and warm-hearted communities.
              </p>
              
              <div className="text-center">
                <p className="text-xl font-bold text-foreground mb-4">
                  Join us in travelling sustainably, supporting local businesses and leaving a positive footprint in the beautiful Himalayas.
                </p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold mb-4 text-foreground">
                Our Core Principles
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Guiding values that shape every journey and interaction
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {principles.map((principle, index) => (
              <SlideInSection key={index} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                <Card className="h-full bg-card border-2 hover:border-primary/50 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <principle.icon className={`w-8 h-8 text-primary`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{principle.title}</h3>
                    <p className="text-muted-foreground">{principle.description}</p>
                  </CardContent>
                </Card>
              </SlideInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section id="sustainability" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeInSection>
                <div>
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-primary rounded-xl">
                      <Leaf className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="ml-4">
                      <Badge className="bg-primary/10 text-primary border-primary/30">SUSTAINABILITY</Badge>
                      <h2 className="text-3xl font-display font-bold mt-2 text-foreground">
                        Building a Sustainable Future
                      </h2>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-lg text-muted-foreground">
                      <span className="font-semibold text-primary">'Shanti Himalaya'</span> strives hard to promote sustainable tourism practices in Himalayas. We focus on economic empowerment, waste reduction, eco-tourism and sustainable communities.
                    </p>
                    <p className="text-lg text-muted-foreground">
                      With our simple approach, we seek to offer our travellers something different: genuine experiences designed sustainably with an eye for a positive impact on the environment and tourism in the service of building a better future for all.
                    </p>
                  </div>
                </div>
              </FadeInSection>

              <SlideInSection direction="right">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sustainabilityFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="h-full bg-card border-2 hover:border-primary/50 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4`}>
                            <feature.icon className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </SlideInSection>
            </div>
          </div>
        </div>
      </section>

      {/* Women Empowerment Section */}
      <section id="women-empowerment" className="py-20 bg-gradient-to-br from-rose-50/50 to-pink-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeInSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary rounded-xl">
                    <Heart className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="ml-4 text-left">
                    <Badge className="bg-primary/10 text-primary border-primary/30">WOMEN EMPOWERMENT</Badge>
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
                  Empowering Women, Transforming Communities
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  <span className="font-semibold text-primary">'Shanti Himalaya'</span> is strongly driven by the belief in women's empowerment. We invest in and create programs promoting women's empowerment, boosting their self-esteem and confidence.
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {womenEmpowermentStats.map((stat, index) => (
                <SlideInSection key={index} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                  <div className="text-center p-6 bg-card rounded-2xl shadow-lg border-2 hover:border-primary/50 transition-all duration-300">
                    <div className="text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-lg font-semibold text-foreground mt-2">{stat.label}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.description}</div>
                  </div>
                </SlideInSection>
              ))}
            </div>

            <FadeInSection delay={0.4}>
              <div className="bg-card rounded-2xl p-8 shadow-lg border-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">Leadership Development</h3>
                    <p className="text-sm text-muted-foreground">Training women to take leadership roles in tourism</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">Skill Building</h3>
                    <p className="text-sm text-muted-foreground">Providing vocational training and entrepreneurship support</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">Community Impact</h3>
                    <p className="text-sm text-muted-foreground">Creating role models that inspire future generations</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Economic Opportunities Section */}
      <section id="economic-opportunities" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeInSection>
                <div>
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-primary rounded-xl">
                      <TrendingUp className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="ml-4">
                      <Badge className="bg-primary/10 text-primary border-primary/30">ECONOMIC OPPORTUNITIES</Badge>
                      <h2 className="text-3xl font-display font-bold mt-2 text-foreground">
                        Creating Sustainable Livelihoods
                      </h2>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-lg text-muted-foreground">
                      As thousands of families living in remote Himalayan regions are still struggling with basic needs, we intend to operate in unique ways that help in creating decent work and economic opportunities to support indigenous groups in rural areas.
                    </p>
                  </div>

                  <div className="mt-8 p-6 bg-card rounded-2xl shadow-lg border-2">
                    <div className="flex items-center mb-4">
                      <MapPin className="w-6 h-6 text-primary mr-3" />
                      <h3 className="text-xl font-bold text-foreground">New Destinations</h3>
                    </div>
                    <p className="text-muted-foreground">
                      'Shanti Himalaya' is working continuously to discover & explore new tourist destinations in remote Himalayan regions. This helps in the new communities driving economic empowerment from tourist activities. We further insight into supporting local communities and look more for sustainable travel to positively impact the communities and environment.
                    </p>
                  </div>
                </div>
              </FadeInSection>

              <SlideInSection direction="right">
                <div className="space-y-6">
                  <Card className="bg-card border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary rounded-lg">
                          <HandHeart className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-foreground">Local Partnerships</h3>
                          <p className="text-muted-foreground">
                            We prioritize working with local guides, homestays, and artisans to ensure tourism revenue benefits communities directly.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary rounded-lg">
                          <Shield className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-foreground">Fair Employment</h3>
                          <p className="text-muted-foreground">
                            Providing fair wages, training, and career development opportunities for local community members.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary rounded-lg">
                          <Lightbulb className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-foreground">Community Enterprises</h3>
                          <p className="text-muted-foreground">
                            Supporting the development of community-owned tourism businesses and social enterprises.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </SlideInSection>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Consciousness Section */}
      <section id="environment" className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeInSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary rounded-xl">
                    <Globe className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="ml-4 text-left">
                    <Badge className="bg-primary/10 text-primary border-primary/30">ENVIRONMENTAL CONSCIOUSNESS</Badge>
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
                  Preserving the Himalayan Environment
                </h2>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <FadeInSection>
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground">
                    Our core principles are deeply rooted in sustainability – we ensure that the benefits of sustainable tourism reach the lives of our staff and the local communities we work with.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    We focus on preserving the environment and regenerating our natural and cultural heritage. We are committed to the shared responsibility of unburdening the mountains through waste reduction by joining hands with our partners, locals and travellers.
                  </p>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center text-foreground">
                      <Trees className="w-6 h-6 text-primary mr-2" />
                      Our Environmental Initiatives
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">Plastic-free trekking expeditions</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">Reforestation and conservation projects</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">Carbon offset programs for all journeys</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">Sustainable infrastructure development</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </FadeInSection>

              <SlideInSection direction="right">
                <div className="relative">
                  <div className="bg-card rounded-2xl p-8 shadow-lg border-2">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Trophy className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-foreground">Our Environmental Commitment</h3>
                      <p className="text-muted-foreground">Certified by leading sustainability organizations</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="font-medium">100% Plastic-Free Operations</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="font-medium">Carbon Neutral Certification</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="font-medium">Wildlife Conservation Partner</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="font-medium">Sustainable Tourism Award Winner</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SlideInSection>
            </div>
          </div>
        </div>
      </section>

      {/* Giving Back Section */}
      <section id="giving-back" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeInSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary rounded-xl">
                    <HandHeart className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="ml-4 text-left">
                    <Badge className="bg-primary/10 text-primary border-primary/30">GIVING BACK</Badge>
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
                  Creating Meaningful Impact Together
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our communities are what make us. When they benefit, we benefit; when we benefit, they should also benefit. This is our commitment to challenge poverty and establish equality.
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {givingBackOpportunities.map((opportunity, index) => (
                <SlideInSection key={index} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                  <Card className="h-full bg-card border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <opportunity.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">{opportunity.title}</h3>
                      <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    </CardContent>
                  </Card>
                </SlideInSection>
              ))}
            </div>

            <FadeInSection delay={0.4}>
              <div className="bg-primary rounded-2xl p-8 text-primary-foreground shadow-lg border-2 border-primary/20">
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-2xl font-bold mb-4">Join Our Volunteer Program</h3>
                  <p className="mb-6 text-primary-foreground/90">
                    Get in touch with us, if you are interested in volunteering opportunities in the Himalayan regions, not just as a barter, but as a meaningful exchange. Whether it's education, storytelling, community work, operations, eco-tourism, permaculture, or simply being of service — we can offer experiences that allow you to contribute as a family.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90"
                      onClick={() => window.location.href = "mailto:shantihimalaya@gmail.com"}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Write to us: shantihimalaya@gmail.com
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Learn More About Volunteering
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInSection>
              <h2 className="text-4xl font-display font-bold mb-6">Travel Responsibly with Shanti Himalaya</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Join us in creating positive change through sustainable tourism. Every journey you take with us supports local communities, preserves cultural heritage, and protects the pristine Himalayan environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-2xl"
                  onClick={() => window.location.href = "/journeys"}
                >
                  Explore Responsible Journeys
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                  onClick={() => window.location.href = "mailto:shantihimalaya@gmail.com"}
                >
                  Contact Us
                  <Mail className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResponsiveTourismPage;