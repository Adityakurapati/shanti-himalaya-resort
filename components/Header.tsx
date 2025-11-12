"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu, X, Phone, Mail, ChevronDown, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/shanti-himalaya-logo.jpg";

const Header = () => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const pathname = usePathname();

        // Check if we're on resort-related pages
        const isResortPage = pathname === "/our-resort" ||
                pathname === "/our-resort/how-to-reach" ||
                pathname === "/our-resort/set-menu-meals";

        // Hide dropdown menus on Our Resort pages
        const showDropdowns = !isResortPage;

        // Determine the label for the second nav link based on current page
        const secondNavLabel = isResortPage ? "Packages" : "Blogs";

        const mainNavLinks = [
                { href: "/our-resort", label: "Our Resort", featured: true },
                { href: "/blog", label: secondNavLabel },
        ];

        const resortNavLinks = isResortPage ? [
                { href: "#accommodation", label: "Accommodation" },
                { href: "#activities", label: "Activities" },
                { href: "#gallery", label: "Gallery" },
        ] : [];

        // Top journeys data
        const topJourneys = [
                { id: "everest-base-camp", name: "Everest Base Camp Trek" },
                { id: "annapurna-circuit", name: "Annapurna Circuit" },
                { id: "manaslu-circuit", name: "Manaslu Circuit Trek" },
                { id: "adventure", name: "Adventure Journeys" },
                { id: "wildlife", name: "Wildlife Safari" }
        ];

        // Top destinations data
        const topDestinations = [
                { id: "ladakh", name: "Ladakh" },
                { id: "corbett", name: "Jim Corbett National Park" },
                { id: "kashmir", name: "Kashmir Valley" },
                { id: "everest-region", name: "Everest Region" },
                { id: "annapurna-region", name: "Annapurna Region" }
        ];

        // Top experiences data
        const topExperiences = [
                { id: "luxury-spa", name: "Himalayan Spa Retreat" },
                { id: "cultural-immersion", name: "Cultural Village Experience" },
                { id: "adventure-sports", name: "Ultimate Adventure Package" },
                { id: "helicopter-tour", name: "Everest Helicopter Experience" },
                { id: "culinary-journey", name: "Nepalese Culinary Adventure" }
        ];

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
                                                {/* Main Navigation Links */}
                                                {mainNavLinks.map((link) => (
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
                                                {resortNavLinks.map((link) => (
                                                        <a
                                                                key={link.href}
                                                                href={link.href}
                                                                className="font-medium transition-all duration-300 text-foreground hover:text-primary"
                                                        >
                                                                {link.label}
                                                        </a>
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
                                                                                {topJourneys.map((journey) => (
                                                                                        <DropdownMenuItem key={journey.id} asChild>
                                                                                                <Link href={`/journeys/${journey.id}`} className="cursor-pointer">
                                                                                                        {journey.name}
                                                                                                </Link>
                                                                                        </DropdownMenuItem>
                                                                                ))}
                                                                                <DropdownMenuItem asChild>
                                                                                        <Link href="/journeys" className="cursor-pointer font-semibold text-primary">
                                                                                                View All Journeys
                                                                                        </Link>
                                                                                </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                </DropdownMenu>

                                                                <DropdownMenu>
                                                                        <DropdownMenuTrigger className="font-medium transition-all duration-300 text-foreground hover:text-primary flex items-center space-x-1">
                                                                                <span>Destinations</span>
                                                                                <ChevronDown className="w-4 h-4" />
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent className="w-64 bg-background border border-border shadow-lg">
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
                                                                        </DropdownMenuContent>
                                                                </DropdownMenu>

                                                                <DropdownMenu>
                                                                        <DropdownMenuTrigger className="font-medium transition-all duration-300 text-foreground hover:text-primary flex items-center space-x-1">
                                                                                <span>Experiences</span>
                                                                                <ChevronDown className="w-4 h-4" />
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent className="w-64 bg-background border border-border shadow-lg">
                                                                                {topExperiences.map((experience) => (
                                                                                        <DropdownMenuItem key={experience.id} asChild>
                                                                                                <Link href={`/experiences/${experience.id}`} className="cursor-pointer">
                                                                                                        {experience.name}
                                                                                                </Link>
                                                                                        </DropdownMenuItem>
                                                                                ))}
                                                                                <DropdownMenuItem asChild>
                                                                                        <Link href="/experiences" className="cursor-pointer font-semibold text-primary">
                                                                                                View All Experiences
                                                                                        </Link>
                                                                                </DropdownMenuItem>
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
                                                        {mainNavLinks.map((link) => (
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
                                                        {resortNavLinks.map((link) => (
                                                                <a
                                                                        key={link.href}
                                                                        href={link.href}
                                                                        onClick={() => setIsMenuOpen(false)}
                                                                        className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-muted"
                                                                >
                                                                        {link.label}
                                                                </a>
                                                        ))}

                                                        {/* Mobile Dropdown Sections - Hidden on Our Resort pages */}
                                                        {showDropdowns && (
                                                                <>
                                                                        <div className="px-4 py-2">
                                                                                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Journeys</h4>
                                                                                {topJourneys.slice(0, 3).map((journey) => (
                                                                                        <Link
                                                                                                key={journey.id}
                                                                                                href={`/journeys/${journey.id}`}
                                                                                                onClick={() => setIsMenuOpen(false)}
                                                                                                className="block py-1 text-sm text-foreground hover:text-primary"
                                                                                        >
                                                                                                {journey.name}
                                                                                        </Link>
                                                                                ))}
                                                                                <Link
                                                                                        href="/journeys"
                                                                                        onClick={() => setIsMenuOpen(false)}
                                                                                        className="block py-1 text-sm text-primary font-semibold"
                                                                                >
                                                                                        View All Journeys
                                                                                </Link>
                                                                        </div>

                                                                        <div className="px-4 py-2">
                                                                                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Destinations</h4>
                                                                                {topDestinations.slice(0, 3).map((destination) => (
                                                                                        <Link
                                                                                                key={destination.id}
                                                                                                href={`/destinations/${destination.id}`}
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
                                                                        </div>

                                                                        <div className="px-4 py-2">
                                                                                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Experiences</h4>
                                                                                {topExperiences.slice(0, 3).map((experience) => (
                                                                                        <Link
                                                                                                key={experience.id}
                                                                                                href={`/experiences/${experience.id}`}
                                                                                                onClick={() => setIsMenuOpen(false)}
                                                                                                className="block py-1 text-sm text-foreground hover:text-primary"
                                                                                        >
                                                                                                {experience.name}
                                                                                        </Link>
                                                                                ))}
                                                                                <Link
                                                                                        href="/experiences"
                                                                                        onClick={() => setIsMenuOpen(false)}
                                                                                        className="block py-1 text-sm text-primary font-semibold"
                                                                                >
                                                                                        View All Experiences
                                                                                </Link>
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