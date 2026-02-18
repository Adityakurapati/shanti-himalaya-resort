'use client'

import { Phone, Mail, MapPin, Facebook, Instagram, Globe, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/shanti-himalaya-logo.jpg";
import Link from "next/link";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-primary text-primary-foreground relative">
      

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shanti Himalaya Wilderness Resort */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-40 h-40 sm:w-24 sm:h-24 flex items-center justify-center bg-white p-2 rounded-lg overflow-hidden">
                <Image
                  src={logo}
                  alt="Shanti Himalaya Logo"
                  width={120}
                  height={120}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Shanti Himalaya Wilderness Resort</h3>
                <p className="text-sm text-primary-foreground/80">A serene glamping retreat</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              A serene glamping retreat tucked away in a remote Himalayan village beyond Corbett,
              where luxury tents meet crisp mountain air, starry nights, and untouched landscapes—perfect
              for slowing down and reconnecting with nature.
            </p>
            <div className="pt-2">
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                <span>Village Digolikhal, Marchula Rasiya Mahadev Road, P.O Dhumakot, Pauri Garhwal, Uttarakhand</span>
              </div>
            </div>
          </div>

          {/* Shanti Himalaya Tour Operator */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Shanti Himalaya</h4>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              A boutique Himalayan tour operator crafting immersive, experiential journeys across the mountains.
              We specialize in slow travel, authentic local encounters, and thoughtfully designed trips that
              connect travelers with culture, nature, and community—beyond the usual routes.
            </p>
            <div className="pt-2">
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                <span>Deviroad, PO Kotdwar, Pauri Garhwal, Uttarakhand</span>
              </div>
            </div>
          </div>

          {/* Contact & Quick Links */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-lg">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-primary-foreground/60 flex-shrink-0" />
                  <a href="tel:+919910775078" className="text-md hover:text-white transition-colors">
                    +91-99107 75078
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-primary-foreground/60 flex-shrink-0" />
                  <a href="mailto:info@shantihimalaya.com" className="text-md hover:text-white transition-colors">
                    info@shantihimalaya.com
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-display font-semibold text-lg">Follow Us</h4>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com/shantihimalaya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/60 hover:text-white transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com/shantihimalaya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/60 hover:text-white transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://shantihimalaya.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/60 hover:text-white transition-colors"
                >
                  <Globe className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Site Map Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Quick Links</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Link href="/contact" className="block text-md text-primary-foreground/80 hover:text-white transition-colors">
                  Contact Us
                </Link>
                <Link href="/about-us-team" className="block text-md text-primary-foreground/80 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="/our-resort#gallery" className="block text-md text-primary-foreground/80 hover:text-white transition-colors">
                  Gallery
                </Link>
                <Link href="/our-resort#accommodation" className="block text-md text-primary-foreground/80 hover:text-white transition-colors">
                  Accommodation
                </Link>
              </div>
              <div className="space-y-2">
                <Link href="/about-us-team#team" className="block text-md text-primary-foreground/80 hover:text-white transition-colors">
                  Our Team
                </Link>
                <Link href="/sustainable-tourism" className="block text-md text-primary-foreground/80 hover:text-white transition-colors">
                  Sustainable Tourism
                </Link>
                <Link href="/sitemap" className="block text-md text-primary-foreground/80 hover:text-white transition-colors font-medium">
                  Sitemap
                </Link>
                <Link href="/terms" className="block text-md text-primary-foreground/80 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
                <Link href="/privacy" className="block text-md text-primary-foreground/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Go to Top Button - Fixed position */}
        <button
          onClick={scrollToTop}
          className="sticky bottom-6 left-[90vw] w-10 h-10 bg-gray-200 hover:bg-primary/90 text-black hover:text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          aria-label="Go to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-primary-foreground/60 text-center md:text-left mb-4 md:mb-0">
              © {new Date().getFullYear()} Shanti Himalaya. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
              <Link href="/sitemap" className="hover:text-white transition-colors border-r border-white/20 pr-2">
                Sitemap
              </Link>
              <span className="hidden md:inline">Website by </span>
              <a
                href="https://shantihimalaya.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Shanti Himalaya Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;