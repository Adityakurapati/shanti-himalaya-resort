import React from 'react'
import { notFound } from 'next/navigation'
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Breadcrumbs } from "@/components/seo/Breadcrumps"
import { generateJSONLD, generateBreadcrumbJSONLD } from "@/lib/seo-utils"
import { 
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  Mountain,
  TreePine,
  Utensils,
  Coffee,
  Camera
} from "lucide-react"
import Link from "next/link"
import Image from 'next/image'

async function getActivityById(id: string) {
  const { data, error } = await supabase
    .from("resort_activities")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return data
}

async function getOtherActivities(currentId: string) {
  const { data, error } = await supabase
    .from("resort_activities")
    .select("*")
    .neq("id", currentId)
    .limit(3)
    .order("created_at", { ascending: false })

  if (error) return []
  return data
}

async function getActivityBySlug(slug: string) {
  const { data, error } = await supabase
    .from("resort_activities")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return data
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mountain,
  TreePine,
  Utensils,
  Coffee,
  Camera,
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const activity = await getActivityBySlug(params.id)

  if (!activity) {
    return {
      title: 'Activity Not Found',
      description: 'The activity you are looking for does not exist.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title: `${activity.title} - Shanti Himalaya Resort Activities`,
    description: activity.description || `Experience ${activity.title} at Shanti Himalaya Resort.`,
    keywords: [
      activity.title,
      'resort activities',
      'Himalayan experiences',
      'adventure',
      'wellness',
      'Corbett National Park',
    ],
    openGraph: {
      title: `${activity.title} - Shanti Himalaya Resort`,
      description: activity.description,
      url: `https://shantihimlaya.com/our-resort/activities/${activity.slug}`,
      type: 'website',
      images: activity.image_url ? [{ url: activity.image_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${activity.title} - Shanti Himalaya Resort`,
      description: activity.description,
      images: activity.image_url ? [activity.image_url] : [],
    },
  }
}

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = await getActivityBySlug(params.id)
  const otherActivities = await getOtherActivities(activity?.id || params.id)

  if (!activity) {
    notFound()
  }

  const Icon = iconMap[activity.icon] || Mountain

  // Generate JSON-LD structured data
  const activityJSONLD = generateJSONLD(activity, "Experience");
  const breadcrumbStructuredData = generateBreadcrumbJSONLD([
    { name: "Home", url: "/" },
    { name: "Our Resort", url: "/our-resort" },
    { name: "Activities", url: "/our-resort/activities" },
    { name: activity.title, url: `/our-resort/activities/${activity.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activityJSONLD) }}
      />
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <div className="min-h-screen bg-background">
        <Header />
        <Breadcrumbs />

        {/* Hero Section with Image */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0">
            {activity.image_url ? (
              <>
                {/* Hero Image */}
                <div className="absolute inset-0">
                  <img 
                    src={activity.image_url || "/placeholder.svg"} 
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  {/* Additional overlay at the bottom for text */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-accent"></div>
            )}
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="lg:w-2/3">
                <Link
                  href="/our-resort#activities"
                  className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Activities
                </Link>
                
                <div className="mb-6">
                  <div className="mb-4">
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      <Icon className="w-3 h-3 mr-1" />
                      {activity.icon === 'Mountain' ? 'Adventure' : 
                       activity.icon === 'TreePine' ? 'Nature' :
                       activity.icon === 'Utensils' ? 'Cultural' :
                       activity.icon === 'Coffee' ? 'Relaxation' : 'Experience'}
                    </Badge>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-4xl font-display font-bold mb-4 text-white drop-shadow-lg">
                    {activity.title}
                  </h1>
                  <p className="text-xl text-white/90 leading-relaxed max-w-3xl mb-8 drop-shadow">
                    {activity.description}
                  </p>
                  
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <Card className="shadow-xl bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">Quick Booking</h3>
                    
                    <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold" size="lg">
                      <a href="tel:919910775073" className="w-full h-full flex items-center justify-center">
                        Book Now
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Details */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="mb-12">
                  <h2 className="text-3xl font-display font-bold mb-6 text-foreground">About This Activity</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {activity.full_description}
                    </p>
                    
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card className="shadow-card sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Activity Information</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between pb-3 border-b">
                        <span className="text-muted-foreground">Activity Type</span>
                        <span className="font-semibold">
                          {activity.icon === 'Mountain' ? 'Adventure' : 
                           activity.icon === 'TreePine' ? 'Nature' :
                           activity.icon === 'Utensils' ? 'Cultural' :
                           activity.icon === 'Coffee' ? 'Relaxation' : 'Experience'}
                        </span>
                      </div>
                     
                    </div>

                    <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2 text-foreground">Need Assistance?</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Our activity coordinators are available 24/7 to help you plan your perfect experience.
                      </p>
                      <div className="flex items-center">
                        <a href="tel:919910775073" className="text-primary hover:text-primary/80 font-semibold">
                          +91 99107 75073
                        </a>
                      </div>
                    </div>

                    <Button className="w-full hero-gradient text-white" size="lg" asChild>
                      <a href="tel:919910775073">
                        Book This Activity
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Other Activities */}
        {otherActivities.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold mb-4 text-foreground">More Activities</h2>
                <p className="text-lg text-muted-foreground">Explore other experiences at Shanti Himalaya</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherActivities.map((otherActivity: any) => {
                  const OtherIcon = iconMap[otherActivity.icon] || Mountain
                  return (
                    <Card key={otherActivity.id} className="shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
                      <div className="h-40 relative">
                        {otherActivity.image_url ? (
                          <img 
                            src={otherActivity.image_url || "/placeholder.svg"} 
                            alt={otherActivity.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <OtherIcon className="w-12 h-12 text-white/30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                            <OtherIcon className="w-3 h-3 mr-1" />
                            {otherActivity.icon === 'Mountain' ? 'Adventure' : 
                             otherActivity.icon === 'TreePine' ? 'Nature' :
                             otherActivity.icon === 'Utensils' ? 'Cultural' :
                             otherActivity.icon === 'Coffee' ? 'Relaxation' : 'Experience'}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold mb-2">{otherActivity.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{otherActivity.description}</p>
                        <Link href={`/our-resort/activities/${otherActivity.id}`}>
                          <Button variant="outline" className="w-full bg-transparent">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="text-center mt-10">
                <Link href="/our-resort#activities">
                  <Button variant="outline" size="lg">
                    View All Activities
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  )
}
