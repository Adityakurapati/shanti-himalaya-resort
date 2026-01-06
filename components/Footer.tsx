import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">S</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Shanti Himalaya</h3>
                <p className="text-sm text-primary-foreground/80">Resort & Spa</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Experience tranquility and luxury in the heart of the Himalayas. 
              Our resort offers the perfect blend of traditional hospitality 
              and modern comfort.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary-foreground/60" />
                <span className="text-sm">Digolikhal, Uttarakhand</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-foreground/60" />
                <span className="text-sm">+91 99107 75073</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-foreground/60" />
                <span className="text-sm">info@shantihimalaya.com</span>
              </div>
            </div>
          </div>

         {/* Quick Links */}
<div className="space-y-4">
  <h4 className="font-display font-semibold text-lg">Quick Links</h4>
  <div className="space-y-2">
    <a
      href="/about"
      className="block text-sm text-primary-foreground/80 hover:text-white transition-colors"
    >
      About Us
    </a>
    <a
      href="/terms"
      className="block text-sm text-primary-foreground/80 hover:text-white transition-colors"
    >
      Terms & Conditions
    </a>
    <a
      href="/gallery"
      className="block text-sm text-primary-foreground/80 hover:text-white transition-colors"
    >
      Gallery
    </a>
    <a
      href="/sitemap"
      className="block text-sm text-primary-foreground/80 hover:text-white transition-colors"
    >
      Site Map
    </a>
    <a
      href="/blog"
      className="block text-sm text-primary-foreground/80 hover:text-white transition-colors"
    >
      Blog
    </a>
    <a
      href="/sustainable-tourism"
      className="block text-sm text-primary-foreground/80 hover:text-white transition-colors"
    >
      Sustainable Tourism
    </a>
  </div>
</div>

          {/* Follow Us */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg">Follow Us</h4>
            <div className="flex space-x-3">
              <Facebook className="w-6 h-6 text-primary-foreground/60 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-primary-foreground/60 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-primary-foreground/60">
             © {new Date().getFullYear()} Shanti Himalaya Resort. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-primary-foreground/60 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-primary-foreground/60 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
