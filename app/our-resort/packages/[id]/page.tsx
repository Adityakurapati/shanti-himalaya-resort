import React from 'react'
import { notFound } from 'next/navigation'
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowLeft,
  Star,
  Camera,
  Mail,
  Phone
} from "lucide-react"
import Link from "next/link"

async function getPackageBySlug(slug: string) {
  const { data, error } = await supabase
    .from("resort_packages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return data
}

async function getOtherPackages(currentId: string) {
  const { data, error } = await supabase
    .from("resort_packages")
    .select("*")
    .neq("id", currentId)
    .limit(3)
    .order("created_at", { ascending: false })

  if (error) return []
  return data
}

async function getPackageById(id: string) {
  const { data, error } = await supabase
    .from("resort_packages")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return data
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const pkg = await getPackageBySlug(params.id)
  
  return {
    title: pkg ? `${pkg.name} - Shanti Himalaya Resort` : 'Package Not Found',
    description: pkg?.description || 'Discover our curated resort packages',
  }
}

export default async function PackageDetailPage({ params }: { params: { id: string } }) {
  const pkg = await getPackageBySlug(params.id)
  const otherPackages = await getOtherPackages(pkg?.id || params.id)

  if (!pkg) {
    notFound()
  }

  const badgeColors: Record<string, string> = {
    "Festival Special": "bg-red-500",
    "Popular": "bg-green-500",
    "Luxury": "bg-gold",
    "Standard": "bg-blue-500",
    "Budget": "bg-gray-500",
  }

  // Function to create email content with package details
  const createBookingEmail = () => {
    const subject = `Booking Inquiry: ${pkg.name} Package - Shanti Himalaya Resort`
    const body = `Dear Shanti Himalaya Team,

I am interested in booking the "${pkg.name}" package.

Package Details:
- Package Name: ${pkg.name}
- Package Type: ${pkg.badge}
- Duration: ${pkg.duration}
- Price: ${pkg.price}
${pkg.original_price && pkg.original_price !== pkg.price ? `- Original Price: ${pkg.original_price}` : ''}

My Requirements:
1. Number of Adults: 
2. Number of Children: 
3. Preferred Check-in Date: 
4. Preferred Check-out Date: 
5. Special Requirements: 

Please contact me with availability and booking procedure.

Best regards,
[Your Name]
[Your Phone Number]`

    return `mailto:shantihimalayas@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  // Function to create WhatsApp message
  const createWhatsAppMessage = () => {
    const message = `Hello, I'm interested in booking the "${pkg.name}" package at Shanti Himalaya Resort.

Package: ${pkg.name}
Type: ${pkg.badge}
Duration: ${pkg.duration}
Price: ${pkg.price}

Please provide more details about availability and booking.`

    return `https://wa.me/919910775073?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Image */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          {pkg.image_url ? (
            <>
              {/* Hero Image */}
              <div className="absolute inset-0">
                <img 
                  src={pkg.image_url || "/placeholder.svg"} 
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                {/* Additional overlay at the bottom for text */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              </div>
            </>
          ) : (
            <div className="w-full h-full hero-gradient"></div>
          )}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="lg:w-2/3">
              <Link
                href="/our-resort#packages"
                className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Packages
              </Link>
              
              <div className="mb-6">
                <Badge className={`${badgeColors[pkg.badge] || "bg-gold"} text-white text-lg px-6 py-2 mb-4`}>
                  {pkg.badge}
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4 text-white drop-shadow-lg">
                  {pkg.name}
                </h1>
              
              </div>


              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-4xl font-bold text-white">{pkg.price}</div>
                  {pkg.original_price && pkg.original_price !== pkg.price && (
                    <div className="text-lg text-white/70 line-through">{pkg.original_price}</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-white text-primary hover:bg-white/90 font-semibold" size="lg" asChild>
                    <a href={createBookingEmail()}>
                      <Mail className="w-5 h-5 mr-2" />
                      Book via Email
                    </a>
                  </Button>
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-semibold" size="lg" asChild>
                    <a href="tel:919910775073">
                      <Phone className="w-5 h-5 mr-2" />
                      Call to Book
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
               <h2 className="text-3xl font-display font-bold mb-6 text-foreground">About Package</h2>
               <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mb-8 drop-shadow">
                {pkg.description}
              </p>
              <div className="mb-12">
                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pkg.includes?.map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">{item.split(':')[0]}</h4>
                        {item.includes(':') && (
                          <p className="text-sm text-muted-foreground">{item.split(':')[1]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">Package Features</h2>
                <div className="flex flex-wrap gap-3">
                  {pkg.features?.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-base px-4 py-2">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-card sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Booking Options</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <span className="text-muted-foreground">Package Type</span>
                      <span className="font-semibold">{pkg.badge}</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b">
                      <span className="text-muted-foreground">Best For</span>
                      <span className="font-semibold">Couples & Families</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold text-primary">{pkg.price}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <Button className="w-full" size="lg" asChild>
                      <a href={createBookingEmail()}>
                        <Mail className="w-5 h-5 mr-2" />
                        Send Booking Inquiry
                      </a>
                    </Button>
                    
                    <Button variant="outline" className="w-full bg-transparent" size="lg" asChild>
                      <a href={createWhatsAppMessage()}>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
                        </svg>
                        WhatsApp Inquiry
                      </a>
                    </Button>
                    
                    <Button variant="secondary" className="w-full" size="lg" asChild>
                      <a href="tel:919910775073">
                        <Phone className="w-5 h-5 mr-2" />
                        Call Directly
                      </a>
                    </Button>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2 text-foreground">Contact Information</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Email us for detailed quotes and customizations.</p>
                      <a href="mailto:shantihimalayas@gmail.com" className="text-primary hover:text-primary/80 block">
                        shantihimalayas@gmail.com
                      </a>
                      <a href="tel:919910775073" className="text-primary hover:text-primary/80 block">
                        +91 99107 75073
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Other Packages */}
      {otherPackages.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4 text-foreground">Other Packages</h2>
              <p className="text-lg text-muted-foreground">Explore more options for your perfect stay</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherPackages.map((otherPkg: any) => {
                const createOtherPackageEmail = () => {
                  const subject = `Booking Inquiry: ${otherPkg.name} Package - Shanti Himalaya Resort`
                  const body = `Dear Shanti Himalaya Team,

I am interested in booking the "${otherPkg.name}" package.

Package Details:
- Package Name: ${otherPkg.name}
- Package Type: ${otherPkg.badge}
- Duration: ${otherPkg.duration}
- Price: ${otherPkg.price}
${otherPkg.original_price && otherPkg.original_price !== otherPkg.price ? `- Original Price: ${otherPkg.original_price}` : ''}

Please contact me with availability and booking procedure.

Best regards,
[Your Name]
[Your Phone Number]`

                  return `mailto:shantihimalayas@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                }

                return (
                  <Card key={otherPkg.id} className="shadow-card hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="h-40 relative">
                      {otherPkg.image_url ? (
                        <img 
                          src={otherPkg.image_url || "/placeholder.svg"} 
                          alt={otherPkg.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full hero-gradient flex items-center justify-center">
                          <Camera className="w-12 h-12 text-white/30" />
                        </div>
                      )}
                      <Badge className={`absolute top-3 right-3 ${badgeColors[otherPkg.badge] || "bg-gold"} text-white text-xs`}>
                        {otherPkg.badge}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold mb-2">{otherPkg.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{otherPkg.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{otherPkg.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-primary">{otherPkg.price}</span>
                        {otherPkg.original_price && otherPkg.original_price !== otherPkg.price && (
                          <span className="text-sm text-muted-foreground line-through">{otherPkg.original_price}</span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Link href={`/our-resort/packages/${otherPkg.id}`}>
                          <Button variant="outline" className="w-full bg-transparent">
                            View Details
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="w-full" asChild>
                          <a href={createOtherPackageEmail()}>
                            <Mail className="w-4 h-4 mr-2" />
                            Inquire via Email
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
