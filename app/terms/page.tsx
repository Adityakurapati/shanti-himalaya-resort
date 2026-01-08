"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CreditCard, 
  Calendar, 
  FileWarning,
  HeartPulse,
  Plane,
  UserCheck,
  Scale,
  Mail,
  CheckCircle,
  XCircle
} from "lucide-react";

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Important Legal Information
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Terms &
              <span className="block text-luxury">Conditions</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Please read these terms carefully before booking your Himalayan adventure with us
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-white/80">
              <FileText className="w-5 h-5" />
              <span>Last updated: January 7, 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <Card className="shadow-card border-0 mb-8">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <FileText className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-3xl font-display font-bold text-foreground">
                    Terms and Conditions
                  </h2>
                </div>
                <p className="text-muted-foreground text-lg mb-6">
                  These Terms and Conditions govern all bookings and services provided by <strong>Shanti Himalaya</strong>. 
                  By booking any trip with us, you acknowledge and accept these terms.
                </p>
              </CardContent>
            </Card>

            {/* Booking & Payment Policy */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-primary mr-3" />
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Booking & Payment Policy
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      A <strong>20% non-refundable deposit</strong> of the total trip cost is required at the time of booking to confirm your reservation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      The remaining balance must be paid <strong>at least 7 days prior</strong> to the trip start date.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Payments can be made via <strong>bank transfer, online payment, or cash</strong> in major currencies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-primary mr-3" />
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Cancellation Policy
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Cancellations must be made in writing via email. Refunds are made based on the notice period:
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <h4 className="font-display font-semibold text-green-800">More than 30 days</h4>
                    </div>
                    <p className="text-green-700 text-sm">
                      80% refund (excluding deposit)
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                      <h4 className="font-display font-semibold text-yellow-800">15-30 days</h4>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      50% refund
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                      <h4 className="font-display font-semibold text-red-800">Less than 15 days</h4>
                    </div>
                    <p className="text-red-700 text-sm">
                      No refund
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <h4 className="font-display font-semibold text-red-800 mb-2">No refunds are provided for:</h4>
                  <ul className="space-y-2 text-red-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Late arrivals or early departures
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Unused services
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Trek interruptions due to personal issues, illness, or weather
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Trip Alterations and Delays */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-primary mr-3" />
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Trip Alterations and Delays
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl">
                  <p className="text-muted-foreground">
                    Shanti Himalaya reserves the right to modify or cancel any itinerary due to unforeseen events such as:
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      <span className="text-sm text-muted-foreground">Weather conditions</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      <span className="text-sm text-muted-foreground">Political unrest</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      <span className="text-sm text-muted-foreground">Natural disasters</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      <span className="text-sm text-muted-foreground">Government restrictions</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  We will do our best to offer suitable alternatives. Any additional costs due to such changes will be borne by the client.
                </p>
              </CardContent>
            </Card>

            {/* Horizontal Divider */}
            <div className="my-12 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-6 text-gray-500">•••</span>
              </div>
            </div>

            {/* Travel Insurance */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-primary mr-3" />
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Travel Insurance
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  All participants must have <strong>comprehensive travel insurance</strong> covering:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Medical expenses",
                    "Trip cancellation",
                    "Emergency evacuation (including helicopter rescue)",
                    "High-altitude sickness"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start bg-white p-3 rounded-lg border">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800">
                    <strong>Important:</strong> Proof of valid insurance must be presented before the trip begins.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Health & Fitness */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <HeartPulse className="w-6 h-6 text-primary mr-3" />
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Health & Fitness
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    Trekking and peak climbing in Nepal require a reasonable level of fitness and good health.
                  </p>
                  <p className="text-muted-foreground">
                    It is the client's responsibility to assess personal fitness before booking.
                  </p>
                  <p className="text-muted-foreground">
                    Participants are responsible for carrying prescribed medications and informing guides of any pre-existing medical conditions.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Passport & Visa */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <Plane className="w-6 h-6 text-primary mr-3" />
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Passport & Visa
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <p className="text-muted-foreground">
                      Clients must hold a <strong>valid passport (minimum 6 months validity)</strong> and obtain the appropriate <strong>Nepal visa</strong> prior to or on arrival.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      The Shanti Himalaya will assist in providing necessary documentation for permits and entry passes where required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assumption of Risk */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <FileWarning className="w-6 h-6 text-primary mr-3" />
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Assumption of Risk
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-orange-50 to-transparent border border-orange-200 rounded-xl p-6">
                  <p className="text-muted-foreground">
                    Trekking and peak climbing involve inherent risks such as injury, illness, accidents, or altitude-related complications.
                  </p>
                  <p className="text-muted-foreground mt-3">
                    By booking a trip, you accept these risks and release <strong>Shanti Himalaya</strong>, its staff, and partners from any liability.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Client Responsibilities */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <UserCheck className="w-6 h-6 text-primary mr-3" />
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Client Responsibilities
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Clients must:
                </p>
                <div className="grid gap-3 mb-4">
                  {[
                    "Follow guide instructions",
                    "Respect local culture and environment",
                    "Abide by the laws of Nepal"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center bg-white p-3 rounded-lg border">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-primary font-bold">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800">
                    <strong>Warning:</strong> Misconduct, illegal behavior, or refusal to cooperate may lead to dismissal from the trip without refund.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Company Liability */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <Scale className="w-6 h-6 text-primary mr-3" />
                  <CardTitle className="text-2xl font-display font-bold text-foreground">
                    Company Liability
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    Shanti Himalaya is not responsible for:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Delays or cancellations by airlines, hotels, or transport services
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Loss or damage to personal belongings
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Injuries or illnesses resulting from your negligence or actions beyond our control
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data Protection */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-display font-bold text-foreground">
                  Privacy & Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Personal information collected during booking will be used solely for trip management and will not be shared with third parties without consent.
                </p>
              </CardContent>
            </Card>

            {/* Complaints & Feedback */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-display font-bold text-foreground">
                  Complaints & Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If any issue arises during the trip, please notify our guide or office immediately so we can assist.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800">
                    <strong>Important:</strong> Written complaints must be submitted within <strong>14 days</strong> of trip completion for review.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card className="shadow-card border-0 mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-display font-bold text-foreground">
                  Governing Law
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 font-bold">•</span>
                    These terms are governed by and construed in accordance with the laws of <strong>Nepal</strong>.
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 font-bold">•</span>
                    Any legal matters will be handled by the competent courts of <strong>Kathmandu</strong>.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Final Note */}
            <div className="my-12 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-6 text-gray-500">•••</span>
              </div>
            </div>

            {/* Agreement Card */}
            <Card className="hero-gradient text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">Important Notice</h3>
                    <p className="text-white/90">Please read carefully before booking</p>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 mb-6">
                  <p className="text-xl text-center font-display font-semibold">
                    By booking with Shanti Himalaya, you confirm that you have read, understood, and agreed to the above Terms and Conditions.
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-white/90 text-lg">Thank you for choosing Shanti Himalaya for your adventure!</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span className="text-white/80">Questions? Contact: info@shantihimalaya.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Summary */}
            <Card className="mt-8 shadow-card border">
              <CardHeader>
                <CardTitle className="text-xl font-display font-bold text-foreground">
                  Quick Reference Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-display font-semibold text-primary">Booking</h4>
                    <p className="text-sm text-muted-foreground">20% deposit required</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display font-semibold text-primary">Cancellation</h4>
                    <p className="text-sm text-muted-foreground">Varies by notice period</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display font-semibold text-primary">Insurance</h4>
                    <p className="text-sm text-muted-foreground">Mandatory for all trips</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display font-semibold text-primary">Passport</h4>
                    <p className="text-sm text-muted-foreground">6+ months validity required</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display font-semibold text-primary">Fitness</h4>
                    <p className="text-sm text-muted-foreground">Client responsibility</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display font-semibold text-primary">Complaints</h4>
                    <p className="text-sm text-muted-foreground">Within 14 days of trip</p>
                  </div>
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

export default TermsAndConditionsPage;