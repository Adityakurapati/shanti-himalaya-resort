"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, Phone, Globe, Lock, FileText, AlertTriangle, Users } from "lucide-react";

const PrivacyPolicyPage = () => {
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
              Privacy
              <span className="block text-luxury">Policy</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Last updated: January 7, 2026
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-white/80">
              <Shield className="w-5 h-5" />
              <span>Protecting your personal data is our priority</span>
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
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
                    Interpretation and Definitions
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-semibold mb-3 text-foreground">Interpretation</h3>
                      <p className="text-muted-foreground mb-4">
                        The words of which the initial letter is capitalized have meanings defined under the following conditions. 
                        The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-display font-semibold mb-3 text-foreground">Definitions</h3>
                      <p className="text-muted-foreground mb-4">
                        For the purposes of this Privacy Policy:
                      </p>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to "Shanti Himalaya", Kotdwar, Uttarakhand, India.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>Country</strong> refers to: India, Nepal & Bhutan</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>Service</strong> refers to the Website.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>Website</strong> refers to Shanti Himalaya, accessible from https://www.shantihimalaya.com/</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Collecting and Using Your Personal Data */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Collecting and Using Your Personal Data</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-semibold mb-4 text-foreground">Types of Data Collected</h3>
                      
                      <div className="space-y-4">
                        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
                          <CardContent className="p-4">
                            <h4 className="font-display font-semibold mb-2">Personal Data</h4>
                            <p className="text-muted-foreground mb-3">
                              While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                            </p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                Email address
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                First name and last name
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                Phone number
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                Address, State, Province, ZIP/Postal code, City
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                Usage Data
                              </li>
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
                          <CardContent className="p-4">
                            <h4 className="font-display font-semibold mb-2">Usage Data</h4>
                            <p className="text-muted-foreground">
                              Usage Data is collected automatically when using the Service. This may include information such as Your Device's Internet Protocol address (IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-display font-semibold mb-4 text-foreground">Tracking Technologies and Cookies</h3>
                      <p className="text-muted-foreground mb-4">
                        We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <Card className="bg-white border">
                          <CardContent className="p-4">
                            <div className="flex items-center mb-2">
                              <FileText className="w-5 h-5 text-primary mr-2" />
                              <h4 className="font-display font-semibold">Browser Cookies</h4>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-white border">
                          <CardContent className="p-4">
                            <div className="flex items-center mb-2">
                              <AlertTriangle className="w-5 h-5 text-primary mr-2" />
                              <h4 className="font-display font-semibold">Web Beacons</h4>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              Certain sections of our Service and our emails may contain small electronic files known as web beacons that permit the Company to count users who have visited those pages.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Use of Your Personal Data */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Use of Your Personal Data</h2>
                  <p className="text-muted-foreground mb-6">
                    The Company may use Personal Data for the following purposes:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {[
                      "To provide and maintain our Service",
                      "To manage Your Account",
                      "For the performance of a contract",
                      "To contact You",
                      "To provide You with news and offers",
                      "To manage Your requests",
                      "For business transfers",
                      "For other purposes: data analysis, trends, effectiveness"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Sharing */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Sharing Your Personal Information</h2>
                  <p className="text-muted-foreground mb-4">
                    We may share Your personal information in the following situations:
                  </p>
                  
                  <Card className="mb-6 border">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Users className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-display font-semibold mb-1">With Service Providers</h4>
                            <p className="text-muted-foreground text-sm">
                              To monitor and analyze the use of our Service, to contact You.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Globe className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-display font-semibold mb-1">For business transfers</h4>
                            <p className="text-muted-foreground text-sm">
                              In connection with any merger, sale of Company assets, financing, or acquisition.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Shield className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-display font-semibold mb-1">With Your consent</h4>
                            <p className="text-muted-foreground text-sm">
                              We may disclose Your personal information for any other purpose with Your consent.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Security & Retention */}
                <div className="mb-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-display font-semibold mb-4 text-foreground">Security of Your Personal Data</h3>
                      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-3">
                            <Lock className="w-5 h-5 text-primary mr-2" />
                            <span className="font-display font-semibold">Secure Data Protection</span>
                          </div>
                          <p className="text-muted-foreground">
                            The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-xl font-display font-semibold mb-4 text-foreground">Retention of Your Personal Data</h3>
                      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-0">
                        <CardContent className="p-4">
                          <p className="text-muted-foreground">
                            The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Children's Privacy */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-4 text-foreground">Children's Privacy</h2>
                  <Card className="bg-gradient-to-r from-red-50 to-transparent border-red-100">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground">
                        Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Changes to Policy */}
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-bold mb-4 text-foreground">Changes to this Privacy Policy</h2>
                  <p className="text-muted-foreground mb-4">
                    We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
                  </p>
                  <p className="text-muted-foreground">
                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="pt-8 border-t">
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Contact Us</h2>
                  <p className="text-muted-foreground mb-6">
                    If you have any questions about this Privacy Policy, You can contact us:
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
                        <p className="text-muted-foreground">+91-99107 75073</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="hero-gradient text-white shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 mr-3" />
                  <h3 className="text-xl font-display font-bold">Privacy Commitment Summary</h3>
                </div>
                <p className="text-white/90 mb-4">
                  This Privacy Policy describes how Shanti Himalaya collects, uses, and protects your personal information when you use our website and services.
                </p>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    We collect only necessary information to provide our services
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    We use industry-standard security measures to protect your data
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    We never sell your personal information to third parties
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    You have control over your data and can request deletion
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

export default PrivacyPolicyPage;