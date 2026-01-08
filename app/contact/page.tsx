"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Mountain,
  Users,
  Calendar,
  CheckCircle,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageCircle
} from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    tripInterest: "",
    travelDates: ""
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Number",
      details: "+91-99107 75073",
      description: "Available 9AM-6PM IST",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: Mail,
      title: "Email Address",
      details: "info@shantihimalaya.com",
      description: "Response within 24 hours",
      color: "bg-green-500/10 text-green-500"
    },
    {
      icon: MapPin,
      title: "Office Location",
      details: "Kotdwar, Uttarakhand, India",
      description: "Headquarters & Operations Center",
      color: "bg-amber-500/10 text-amber-500"
    },
    {
      icon: Globe,
      title: "Website",
      details: "www.shantihimalaya.com",
      description: "Complete trip information",
      color: "bg-purple-500/10 text-purple-500"
    }
  ];

  const socialMedia = [
    { icon: Instagram, name: "Instagram", url: "https://instagram.com/shantihimalaya", color: "bg-pink-500" },
    { icon: Facebook, name: "Facebook", url: "https://facebook.com/shantihimalaya", color: "bg-blue-600" },
    { icon: Twitter, name: "Twitter", url: "https://twitter.com/shantihimalaya", color: "bg-sky-500" },
    { icon: Youtube, name: "YouTube", url: "https://youtube.com/@shantihimalaya", color: "bg-red-600" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              We're Here to Help
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Get in
              <span className="block text-luxury">Touch</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Have questions about your Himalayan adventure? Our team of experts is ready to guide you 
              through every step of your journey planning.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-white/80">
              <Clock className="w-5 h-5" />
              <span>Response time: Within 24 hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
              Contact Information
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reach out to us through any of these channels. We're always happy to hear from fellow adventure seekers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="shadow-card hover-lift overflow-hidden border-0">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${info.color} flex items-center justify-center mx-auto mb-4`}>
                    <info.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{info.title}</h3>
                  <p className="text-muted-foreground mb-3 text-sm">{info.details}</p>
                  <p className="text-sm text-primary">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="shadow-card border-0">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <MessageSquare className="w-6 h-6 text-primary mr-3" />
                    <CardTitle className="text-2xl font-display font-bold text-foreground">
                      Send Us a Message
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Subject *</label>
                        <input
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Trip Interest</label>
                        <select
                          name="tripInterest"
                          value={formData.tripInterest}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                        >
                          <option value="">Select trip type</option>
                          <option value="trekking">Trekking</option>
                          <option value="cultural">Cultural Tours</option>
                          <option value="wildlife">Wildlife Safari</option>
                          <option value="spiritual">Spiritual Retreat</option>
                          <option value="luxury">Luxury Camping</option>
                          <option value="custom">Custom Trip</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Travel Dates</label>
                        <input
                          type="text"
                          name="travelDates"
                          value={formData.travelDates}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="e.g., March 2026"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Your Message *</label>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                        placeholder="Tell us about your adventure plans..."
                      />
                    </div>

                    <Button type="submit" className="w-full hero-gradient hover-glow py-6">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info & Social */}
            <div className="space-y-8">
              {/* Why Contact Us */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Users className="w-6 h-6 text-primary mr-3" />
                    <CardTitle className="text-2xl font-display font-bold text-foreground">
                      Why Contact Us?
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      icon: Mountain,
                      title: "Expert Guidance",
                      description: "Get personalized recommendations from Himalayan experts"
                    },
                    {
                      icon: Calendar,
                      title: "Trip Planning",
                      description: "Customized itineraries based on your preferences"
                    },
                    {
                      icon: CheckCircle,
                      title: "Safety First",
                      description: "Detailed safety briefings and preparation guidance"
                    },
                    {
                      icon: MessageCircle,
                      title: "Quick Responses",
                      description: "Prompt replies to all your queries and concerns"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Follow Our Journey
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Join our community of adventure seekers and stay updated.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {socialMedia.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <div className={`${social.color} text-white p-4 rounded-lg text-center transition-transform group-hover:scale-105`}>
                          <social.icon className="w-6 h-6 mx-auto mb-2" />
                          <p className="text-sm font-medium">{social.name}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-semibold">9:00 AM - 6:00 PM IST</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-semibold">10:00 AM - 4:00 PM IST</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-semibold text-primary">Emergency Only</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Quick Help */}
      <section className="py-20 mountain-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-6 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about our Himalayan adventures.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How far in advance should I book my trip?",
                answer: "We recommend booking at least 3-6 months in advance for peak seasons (Spring & Autumn) and 1-2 months for off-season trips."
              },
              {
                question: "What's included in the tour package?",
                answer: "All packages include accommodation, meals, permits, guide services, and transportation as specified in the itinerary."
              },
              {
                question: "What if I need to cancel my booking?",
                answer: "Please refer to our Cancellation Policy. We offer flexible options based on notice period."
              },
              {
                question: "Do I need special insurance for trekking?",
                answer: "Yes, comprehensive travel insurance with high-altitude coverage and emergency evacuation is mandatory."
              },
              {
                question: "What is the best time to visit the Himalayas?",
                answer: "Spring (March-May) and Autumn (September-November) offer the best weather conditions for most treks."
              },
              {
                question: "Can you customize an itinerary for me?",
                answer: "Absolutely! We specialize in creating personalized itineraries based on your preferences, fitness level, and schedule."
              }
            ].map((faq, index) => (
              <Card key={index} className="shadow-card hover-lift overflow-hidden bg-white">
                <CardContent className="p-6">
                  <h3 className="font-display font-semibold text-lg mb-3 flex items-start">
                    <span className="text-primary mr-2">Q:</span>
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">
                    <span className="text-primary font-medium">A:</span> {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              View All FAQs
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Card className="hero-gradient text-white shadow-xl border-0 max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <Badge className="mb-4 bg-white/30 text-white border-white/40">
                  Emergency Support
                </Badge>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  24/7 Emergency Contact
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  For urgent assistance during your trip or for after-hours emergencies, use our dedicated emergency line.
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
                      <Phone className="w-7 h-7 text-red-300" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white/80">Emergency Contact</p>
                      <p className="text-2xl font-bold">+91-99107 75073</p>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm">
                    Available 24 hours for genuine emergencies only
                  </p>
                </div>

                <div className="space-y-3 text-white/80">
                  <p className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    For medical emergencies during trips
                  </p>
                  <p className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Immediate assistance coordination
                  </p>
                  <p className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Family contact in case of emergencies
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;