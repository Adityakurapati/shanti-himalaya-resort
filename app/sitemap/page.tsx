"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Map,
  Home,
  Compass,
  MapPin,
  Star,
  BookOpen,
  Phone,
  Users,
  Building2,
  Bed,
  Utensils,
  Route,
  FileText,
  Scale,
  Cookie,
  Shield,
  Lock
} from "lucide-react";

const SitemapPage = () => {
  const sections = [
    {
      title: "General",
      icon: <Home className="w-5 h-5 text-primary" />,
      links: [
        { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
        { href: "/journeys", label: "Journeys", icon: <Compass className="w-4 h-4" /> },
        { href: "/destinations", label: "Destinations", icon: <MapPin className="w-4 h-4" /> },
        { href: "/experiences", label: "Experiences", icon: <Star className="w-4 h-4" /> },
        { href: "/experiential-stays", label: "Stays", icon: <Star className="w-4 h-4" /> },
        { href: "/blog", label: "Blog", icon: <BookOpen className="w-4 h-4" /> },
        { href: "/contact", label: "Contact", icon: <Phone className="w-4 h-4" /> },
        { href: "/about-us-team", label: "About Us", icon: <Users className="w-4 h-4" /> }
      ]
    },
    {
      title: "Our Resort",
      icon: <Building2 className="w-5 h-5 text-primary" />,
      links: [
        { href: "/our-resort", label: "Overview", icon: <Building2 className="w-4 h-4" /> },
        { href: "/our-resort/accommodations", label: "Accommodations", icon: <Bed className="w-4 h-4" /> },
        { href: "/our-resort/menu-meals", label: "Meals", icon: <Utensils className="w-4 h-4" /> },
        { href: "/our-resort/how-to-reach", label: "How to Reach", icon: <Route className="w-4 h-4" /> }
      ]
    },
    {
      title: "Legal",
      icon: <Scale className="w-5 h-5 text-primary" />,
      links: [
        { href: "/privacy", label: "Privacy Policy", icon: <Shield className="w-4 h-4" /> },
        { href: "/terms", label: "Terms & Conditions", icon: <FileText className="w-4 h-4" /> },
        { href: "/cookies", label: "Cookies Policy", icon: <Cookie className="w-4 h-4" /> }
      ]
    },
    {
      title: "Admin",
      icon: <Lock className="w-5 h-5 text-primary" />,
      links: [
        { href: "/admin/login", label: "Admin Login", icon: <Lock className="w-4 h-4" /> }
      ]
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
              Navigate Your Way
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Site
              <span className="block text-luxury leading-tight">Map</span>
            </h1>
            <div className="mt-6 flex items-center justify-center gap-2 text-white/80">
              <Map className="w-5 h-5" />
              <span>Explore all pages and sections of our website</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-card border-0 mb-8">
              <CardContent className="p-8">
                {/* Introduction */}
                <div className="mb-10 text-center">
                  <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
                    Complete Website Overview
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Use this sitemap to quickly navigate through all the pages and sections available on our website. 
                    Find the information you need about our resort, journeys, experiences, and more.
                  </p>
                </div>

                {/* Sitemap Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  {sections.map((section, index) => (
                    <Card key={index} className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-6">
                          <div className="p-2 bg-primary/10 rounded-lg mr-3">
                            {section.icon}
                          </div>
                          <h2 className="text-2xl font-display font-bold text-foreground">
                            {section.title}
                          </h2>
                        </div>

                        <ul className="space-y-3">
                          {section.links.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <Link 
                                href={link.href} 
                                className="flex items-center group hover:text-primary transition-colors"
                              >
                                <span className="text-primary mr-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                  {link.icon}
                                </span>
                                <span className="text-muted-foreground group-hover:text-primary transition-colors">
                                  {link.label}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-display font-bold text-primary mb-1">15+</div>
                      <p className="text-sm text-muted-foreground">Total Pages</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-display font-bold text-primary mb-1">4</div>
                      <p className="text-sm text-muted-foreground">Main Sections</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-display font-bold text-primary mb-1">7</div>
                      <p className="text-sm text-muted-foreground">General Pages</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-display font-bold text-primary mb-1">3</div>
                      <p className="text-sm text-muted-foreground">Legal Documents</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

           
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SitemapPage;