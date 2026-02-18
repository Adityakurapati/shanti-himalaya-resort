"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cookie, 
  Shield, 
  Mail, 
  Phone, 
  Globe, 
  Lock, 
  FileText, 
  AlertTriangle, 
  Users,
  Settings,
  BarChart,
  Target,
  CheckCircle
} from "lucide-react";

const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Your Privacy Matters
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Cookie
              <span className="block text-luxury">Policy</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Last updated: January 7, 2026
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-white/80">
              <Cookie className="w-5 h-5" />
              <span>How we use cookies to enhance your experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-card border-0 mb-8">
              <CardContent className="p-8">
                {/* What Are Cookies Section */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
                    What Are Cookies?
                  </h2>
                  
                  <div className="space-y-6">
                    <p className="text-muted-foreground mb-4">
                      Cookies are small text files that are placed on your device when you visit our website. 
                      They help us provide you with a better experience by:
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Settings className="w-5 h-5 text-primary mr-2" />
                            <h4 className="font-display font-semibold">Remember Preferences</h4>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Remembering your settings and choices for future visits
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <BarChart className="w-5 h-5 text-primary mr-2" />
                            <h4 className="font-display font-semibold">Analyze Usage</h4>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Understanding how you interact with our website
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Target className="w-5 h-5 text-primary mr-2" />
                            <h4 className="font-display font-semibold">Improve Functionality</h4>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Enhancing site performance and user experience
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Types of Cookies Section */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Types of Cookies We Use</h2>
                  
                  <div className="space-y-4">
                    <Card className="border-l-4 border-l-primary border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Shield className="w-5 h-5 text-primary mr-2" />
                          <h3 className="text-xl font-display font-semibold text-foreground">Essential Cookies</h3>
                        </div>
                        <p className="text-muted-foreground">
                          These are necessary for the website to function properly. They enable basic functions 
                          like page navigation and access to secure areas. The website cannot function properly 
                          without these cookies.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-secondary border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Settings className="w-5 h-5 text-secondary mr-2" />
                          <h3 className="text-xl font-display font-semibold text-foreground">Preference Cookies</h3>
                        </div>
                        <p className="text-muted-foreground">
                          These cookies remember your preferences (like language or region) to provide you with 
                          a more personalized experience.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-accent border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <BarChart className="w-5 h-5 text-accent mr-2" />
                          <h3 className="text-xl font-display font-semibold text-foreground">Analytics Cookies</h3>
                        </div>
                        <p className="text-muted-foreground">
                          These help us understand how visitors interact with our website by collecting and 
                          reporting information anonymously. This helps us improve our website and services.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-warning border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Target className="w-5 h-5 text-warning mr-2" />
                          <h3 className="text-xl font-display font-semibold text-foreground">Marketing Cookies</h3>
                        </div>
                        <p className="text-muted-foreground">
                          These track your online activity to help advertisers deliver more relevant advertising 
                          or to limit how many times you see an ad. These cookies can share that information 
                          with other organizations or advertisers.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* How We Use Cookies */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground">How We Use Cookies</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {[
                      "Website Functionality: To remember your preferences and settings",
                      "Performance & Analytics: To understand how our website is used and improve it",
                      "Marketing: To show you relevant content and advertisements",
                      "Security: To protect your information and prevent fraud"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Third-Party Cookies */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Third-Party Cookies</h2>
                  <p className="text-muted-foreground mb-4">
                    Some cookies are placed by third-party services that appear on our pages. These may include:
                  </p>
                  
                  <Card className="mb-6 border">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Users className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-display font-semibold mb-1">Social Media Platforms</h4>
                            <p className="text-muted-foreground text-sm">
                              Facebook, Instagram, and other social sharing features
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <BarChart className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-display font-semibold mb-1">Analytics Services</h4>
                            <p className="text-muted-foreground text-sm">
                              Google Analytics and other tools to understand site usage
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Shield className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-display font-semibold mb-1">Payment Processors</h4>
                            <p className="text-muted-foreground text-sm">
                              Secure payment processing and fraud prevention
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-4 text-sm">
                        We don't control these third-party cookies. Please check their privacy policies for 
                        more information.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Managing Cookies */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Managing Cookies</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <div>
                      <h3 className="text-xl font-display font-semibold mb-4 text-foreground">Browser Controls</h3>
                      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
                        <CardContent className="p-4">
                          <p className="text-muted-foreground mb-3">
                            Most web browsers allow you to:
                          </p>
                          <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>See what cookies you have and delete them</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>Block cookies from specific sites</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>Block all cookies</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>Clear all cookies when you close your browser</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-xl font-display font-semibold mb-4 text-foreground">Browser-Specific Instructions</h3>
                      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
                        <CardContent className="p-4">
                          <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span><strong>Google Chrome:</strong> Settings → Privacy and Security</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span><strong>Mozilla Firefox:</strong> Options → Privacy & Security</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span><strong>Safari:</strong> Preferences → Privacy</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Changes to Policy */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-4 text-foreground">Changes to This Cookie Policy</h2>
                  <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
                    <CardContent className="p-4">
                      <p className="text-muted-foreground">
                        We may update this Cookie Policy from time to time. We will notify you of any changes 
                        by posting the new Cookie Policy on this page and updating the "Last Updated" date.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Your Consent */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-4 text-foreground">Your Consent</h2>
                  <Card className="bg-gradient-to-r from-blue-50 to-transparent border-blue-100">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <CheckCircle className="w-5 h-5 text-primary mr-2" />
                        <h3 className="font-display font-semibold">Cookie Consent</h3>
                      </div>
                      <p className="text-muted-foreground">
                        By using our website, you consent to our use of cookies as described in this policy. 
                        You can withdraw your consent at any time by adjusting your browser settings or 
                        contacting us.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <div className="pt-8 border-t">
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Contact Us</h2>
                  <p className="text-muted-foreground mb-6">
                    If you have any questions about our use of cookies, please contact us:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6 text-center">
                        <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h4 className="font-display font-semibold mb-2">Email</h4>
                        <p className="text-muted-foreground">info@shantihimalaya.com</p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6 text-center">
                        <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h4 className="font-display font-semibold mb-2">Website</h4>
                        <p className="text-muted-foreground">www.shantihimalaya.com</p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6 text-center">
                        <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h4 className="font-display font-semibold mb-2">Phone</h4>
                        <p className="text-muted-foreground">+91-99107 75078</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-foreground">Shanti Himalaya</p>
                    <p className="text-muted-foreground">Kotdwar, Uttarakhand, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="hero-gradient text-white shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Cookie className="w-6 h-6 mr-3" />
                  <h3 className="text-xl font-display font-bold">Cookie Usage Summary</h3>
                </div>
                <p className="text-white/90 mb-4">
                  This Cookie Policy explains how Shanti Himalaya uses cookies and similar technologies to enhance your browsing experience.
                </p>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Essential cookies required for website functionality
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Preference cookies remember your settings
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Analytics cookies help us improve our services
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    You can control cookies through browser settings
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CookiesPage;