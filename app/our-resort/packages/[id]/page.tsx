import React from 'react'
import { notFound } from 'next/navigation'
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Utensils,
  Home,
  Shield,
  Heart
} from "lucide-react"
import Link from "next/link"

async function getPackageById(id: string) {
  const { data, error } = await supabase
    .from("resort_packages")
    .select("*")
    .eq("id", id)
    .single()

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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const pkg = await getPackageById(params.id)
  
  return {
    title: pkg ? `${pkg.name} - Shanti Himalaya Resort` : 'Package Not Found',
    description: pkg?.description || 'Discover our curated resort packages',
  }
}

export default async function PackageDetailPage({ params }: { params: { id: string } }) {
  const pkg = await getPackageById(params.id)
  const otherPackages = await getOtherPackages(params.id)

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="lg:w-2/3">
              <Link
                href="/our-resort#packages"
                className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Packages
              </Link>
              
              <div className="mb-6">
                <Badge className={`${badgeColors[pkg.badge] || "bg-gold"} text-white text-lg px-6 py-2 mb-4`}>
                  {pkg.badge}
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
                  {pkg.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Perfect for couples & families</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 fill-current" />
                    <span>4.8/5 Rating</span>
                  </div>
                </div>
              </div>

              <p className="text-xl text-white/90 leading-relaxed max-w-3xl mb-8">
                {pkg.description}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-4xl font-bold">{pkg.price}</div>
                  {pkg.original_price && pkg.original_price !== pkg.price && (
                    <div className="text-lg text-white/70 line-through">{pkg.original_price}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-1/3">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-white/70" />
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-sm text-white/80">{pkg.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3 text-white/70" />
                      <div>
                        <div className="font-medium">Best For</div>
                        <div className="text-sm text-white/80">Couples & Families</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-3 text-white/70" />
                      <div>
                        <div className="font-medium">Included</div>
                        <div className="text-sm text-white/80">All meals & activities</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Package Image Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="lg:col-span-2">
              <div className="h-96 rounded-2xl overflow-hidden">
                {pkg.image_url ? (
                  <img 
                    src={pkg.image_url} 
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Camera className="w-20 h-20 text-white/30" />
                    <span className="text-white/50 absolute">Main Image</span>
                  </div>
                )}
              </div>
            </div>
        </div>
      </section>

      {/* Package Details */}
      <section className="py-20 mountain-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pkg.includes.map((item: string, index: number) => (
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
                  {pkg.features.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-base px-4 py-2">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Other Packages */}
      {otherPackages.length > 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4 text-foreground">Other Packages You Might Like</h2>
              <p className="text-lg text-muted-foreground">Explore more options for your perfect stay</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherPackages.map((otherPkg: any) => (
                <Card key={otherPkg.id} className="shadow-card hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="h-40 relative">
                    {otherPkg.image_url ? (
                      <img 
                        src={otherPkg.image_url} 
                        alt={otherPkg.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
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
                    <Link href={`/our-resort/packages/${otherPkg.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}