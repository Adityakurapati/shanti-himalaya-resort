import { Phone, Mail, MapPin, Facebook, Instagram, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shanti Himalaya Wilderness Resort */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">S</span>
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
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4" />
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
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4" />
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
                  <Phone className="w-4 h-4 text-primary-foreground/60" />
                  <span className="text-sm">+91-99107 75078</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-primary-foreground/60" />
                  <span className="text-sm">info@shantihimalaya.com</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-display font-semibold text-lg">Follow Us</h4>
              <div className="flex space-x-3">
                <Facebook className="w-6 h-6 text-primary-foreground/60 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-6 h-6 text-primary-foreground/60 hover:text-white cursor-pointer transition-colors" />
                <Globe className="w-6 h-6 text-primary-foreground/60 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          {/* Site Map Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Site Map</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <a href="/contact" className="block text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Contact Us
                </a>
                <a href="/about" className="block text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  About Us
                </a>
                <a href="/accommodations" className="block text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Accommodations
                </a>
                <a href="/gallery" className="block text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Gallery
                </a>
              </div>
              <div className="space-y-2">
                <a href="/sustainable-tourism" className="block text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Sustainable Tourism
                </a>
                <a href="/terms" className="block text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Terms & Conditions
                </a>
                <a href="/privacy" className="block text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/cookies" className="block text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-primary-foreground/60 text-center md:text-left">
              © {new Date().getFullYear()} Shanti Himalaya. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-sm text-primary-foreground/60 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-primary-foreground/60 hover:text-white transition-colors">
                Terms & Conditions
              </a>
              <a href="/cookies" className="text-sm text-primary-foreground/60 hover:text-white transition-colors">
                Cookies
              </a>
              <a href="/sustainable-tourism" className="text-sm text-primary-foreground/60 hover:text-white transition-colors">
                Sustainable Tourism
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;