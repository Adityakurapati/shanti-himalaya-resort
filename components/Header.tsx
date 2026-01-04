"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu, X, Phone, ChevronDown, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/assets/shanti-himalaya-logo.jpg";
import type { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [topJourneys, setTopJourneys] = useState<Tables<"journeys">[]>([]);
  const [topDestinations, setTopDestinations] = useState<Tables<"destinations">[]>([]);
  const [topExperiences, setTopExperiences] = useState<Tables<"experiences">[]>([]);
  const [loading, setLoading] = useState({
    journeys: true,
    destinations: true,
    experiences: true
  });
  
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on resort-related pages
  const isResortPage = pathname.startsWith("/our-resort");

  // Hide dropdown menus on Our Resort pages
  const showDropdowns = !isResortPage;

  const mainNavLinks = [
    { href: "/our-resort", label: "Our Resort", featured: true },
    { href: "/blog", label: "Blogs" },
  ];

  const resortNavLinks = isResortPage ? [
    { href: "#accommodation", label: "Accommodation" },
    { href: "#packages", label: "Packages" },
    { href: "#gallery", label: "Gallery" },
    { href: "#activities", label: "Activities" },
  ] : [];

  // Handle resort navigation click
  const handleResortNavClick = (hash: string) => {
    // If we're already on /our-resort, just scroll to section
    if (pathname === "/our-resort") {
      setIsMenuOpen(false);
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're on a subpage, navigate to /our-resort with the hash
      setIsMenuOpen(false);
      router.push(`/our-resort${hash}`);
    }
  };

  // Fetch featured journeys, destinations, and experiences
  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        // Fetch featured journeys
        const { data: journeysData, error: journeysError } = await supabase
          .from("journeys")
          .select("*")
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(5);

        if (journeysError) throw journeysError;
        setTopJourneys(journeysData || []);
        setLoading(prev => ({ ...prev, journeys: false }));

        // Fetch featured destinations
        const { data: destinationsData, error: destinationsError } = await supabase
          .from("destinations")
          .select("*")
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(5);

        if (destinationsError) throw destinationsError;
        setTopDestinations(destinationsData || []);
        setLoading(prev => ({ ...prev, destinations: false }));

        // Fetch featured experiences
        const { data: experiencesData, error: experiencesError } = await supabase
          .from("experiences")
          .select("*")
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(5);

        if (experiencesError) throw experiencesError;
        setTopExperiences(experiencesData || []);
        setLoading(prev => ({ ...prev, experiences: false }));

      } catch (error) {
        console.error("Error fetching featured data:", error);
        // Set loading to false even on error
        setLoading({ journeys: false, destinations: false, experiences: false });
      }
    };

    if (showDropdowns) {
      fetchFeaturedData();
    }
  }, [showDropdowns]);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src={logo.src}
              alt="Shanti Himalaya - Culture et Adventure"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Main Navigation Links - Filter out Blogs on resort pages */}
            {mainNavLinks
              .filter(link => !isResortPage || link.href !== "/blog") // Hide Blog link on resort pages
              .map((link: any) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-all duration-300 relative ${link.featured
                      ? "text-primary font-semibold"
                      : isActive(link.href)
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                >
                  {link.label}
                  {(isActive(link.href) || link.featured) && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}

            {/* Resort-specific Navigation */}
            {resortNavLinks.map((link: any) => (
              <button
                key={link.href}
                onClick={() => handleResortNavClick(link.href)}
                className="font-medium transition-all duration-300 text-foreground hover:text-primary"
              >
                {link.label}
              </button>
            ))}

            {/* Dropdown Menus - Hidden on Our Resort pages */}
            {showDropdowns && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="font-medium transition-all duration-300 text-foreground hover:text-primary flex items-center space-x-1">
                    <span>Journeys</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-background border border-border shadow-lg">
                    {loading.journeys ? (
                      <DropdownMenuItem className="text-sm text-muted-foreground">
                        Loading journeys...
                      </DropdownMenuItem>
                    ) : topJourneys.length > 0 ? (
                      <>
                        {topJourneys.map((journey) => (
                          <DropdownMenuItem key={journey.id} asChild>
                            <Link href={`/journeys/${journey.id}`} className="cursor-pointer">
                              {journey.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem asChild>
                          <Link href="/journeys" className="cursor-pointer font-semibold text-primary">
                            View All Journeys
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem className="text-sm text-muted-foreground">
                        No featured journeys yet
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="font-medium transition-all duration-300 text-foreground hover:text-primary flex items-center space-x-1">
                    <span>Destinations</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-background border border-border shadow-lg">
                    {loading.destinations ? (
                      <DropdownMenuItem className="text-sm text-muted-foreground">
                        Loading destinations...
                      </DropdownMenuItem>
                    ) : topDestinations.length > 0 ? (
                      <>
                        {topDestinations.map((destination) => (
                          <DropdownMenuItem key={destination.id} asChild>
                            <Link href={`/destinations/${destination.id}`} className="cursor-pointer">
                              {destination.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem asChild>
                          <Link href="/destinations" className="cursor-pointer font-semibold text-primary">
                            View All Destinations
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem className="text-sm text-muted-foreground">
                        No featured destinations yet
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="font-medium transition-all duration-300 text-foreground hover:text-primary flex items-center space-x-1">
                    <span>Experiences</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-background border border-border shadow-lg">
                    {loading.experiences ? (
                      <DropdownMenuItem className="text-sm text-muted-foreground">
                        Loading experiences...
                      </DropdownMenuItem>
                    ) : topExperiences.length > 0 ? (
                      <>
                        {topExperiences.map((experience) => (
                          <DropdownMenuItem key={experience.id} asChild>
                            <Link href={`/experiences/${experience.id}`} className="cursor-pointer">
                              {experience.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem asChild>
                          <Link href="/experiences" className="cursor-pointer font-semibold text-primary">
                            View All Experiences
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem className="text-sm text-muted-foreground">
                        No featured experiences yet
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+91 99107 75073</span>
            </div>
            {/* Admin Shield Button */}
            <Link href="/admin">
              <Button
                variant="outline"
                size="icon"
                className="border-primary/20 hover:border-primary hover:bg-primary/10 transition-all"
                title="Admin Panel"
              >
                <Shield className="w-4 h-4 text-primary" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              {/* Main Navigation Links - Filter out Blogs on resort pages for mobile */}
              {mainNavLinks
                .filter(link => !isResortPage || link.href !== "/blog") // Hide Blog link on resort pages
                .map((link: any) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive(link.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}

              {/* Resort Navigation in Mobile */}
              {resortNavLinks.map((link: any) => (
                <button
                  key={link.href}
                  onClick={() => handleResortNavClick(link.href)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-muted text-left"
                >
                  {link.label}
                </button>
              ))}

              {/* Mobile Dropdown Sections - Hidden on Our Resort pages */}
              {showDropdowns && (
                <>
                  <div className="px-4 py-2">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Journeys</h4>
                    {loading.journeys ? (
                      <p className="text-sm text-muted-foreground py-1">Loading journeys...</p>
                    ) : topJourneys.length > 0 ? (
                      <>
                        {topJourneys.slice(0, 3).map((journey) => (
                          <Link
                            key={journey.id}
                            href={`/journeys/${journey.id}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-1 text-sm text-foreground hover:text-primary"
                          >
                            {journey.title}
                          </Link>
                        ))}
                        <Link
                          href="/journeys"
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-1 text-sm text-primary font-semibold"
                        >
                          View All Journeys
                        </Link>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground py-1">No featured journeys yet</p>
                    )}
                  </div>

                  <div className="px-4 py-2">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Destinations</h4>
                    {loading.destinations ? (
                      <p className="text-sm text-muted-foreground py-1">Loading destinations...</p>
                    ) : topDestinations.length > 0 ? (
                      <>
                        {topDestinations.slice(0, 3).map((destination) => (
                          <Link
                            key={destination.id}
                            href={`/destinations/${destination.slug || destination.id}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-1 text-sm text-foreground hover:text-primary"
                          >
                            {destination.name}
                          </Link>
                        ))}
                        <Link
                          href="/destinations"
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-1 text-sm text-primary font-semibold"
                        >
                          View All Destinations
                        </Link>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground py-1">No featured destinations yet</p>
                    )}
                  </div>

                  <div className="px-4 py-2">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Experiences</h4>
                    {loading.experiences ? (
                      <p className="text-sm text-muted-foreground py-1">Loading experiences...</p>
                    ) : topExperiences.length > 0 ? (
                      <>
                        {topExperiences.slice(0, 3).map((experience) => (
                          <Link
                            key={experience.id}
                            href={`/experiences/${experience.id}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-1 text-sm text-foreground hover:text-primary"
                          >
                            {experience.title}
                          </Link>
                        ))}
                        <Link
                          href="/experiences"
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-1 text-sm text-primary font-semibold"
                        >
                          View All Experiences
                        </Link>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground py-1">No featured experiences yet</p>
                    )}
                  </div>
                </>
              )}

              <div className="px-4 py-3 border-t border-border">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                  <Phone className="w-4 h-4" />
                  <span>+91 99107 75073</span>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 hero-gradient">Book Now</Button>
                  {/* Admin Shield Button for Mobile */}
                  <Link href="/admin" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-primary/20 hover:border-primary hover:bg-primary/10 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;