import React from 'react'
import { notFound } from 'next/navigation'
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
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

async function getActivityById(id: string) {
  const { data, error } = await supabase
    .from("resort_activities")
    .select("*")
    .eq("id", id)
    .single()

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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const activity = await getActivityById(params.id)
  
  return {
    title: activity ? `${activity.title} - Shanti Himalaya Resort` : 'Activity Not Found',
    description: activity?.description || 'Discover exciting activities at our resort',
  }
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mountain,
  TreePine,
  Utensils,
  Coffee,
  Camera,
}

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = await getActivityById(params.id)
  const otherActivities = await getOtherActivities(params.id)

  if (!activity) {
    notFound()
  }

  const Icon = iconMap[activity.icon] || Mountain

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
                href="/our-resort#activities"
                className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Activities
              </Link>
              
              <div className="mb-6">
               
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
                  {activity.title}
                </h1>
                <p className="text-xl text-white/90 leading-relaxed max-w-3xl mb-8">
                  {activity.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Details */}
      <section className="py-20 mountain-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <div className="h-96 rounded-2xl overflow-hidden shadow-xl mb-8">
                  {activity.image_url ? (
                    <img 
                      src={activity.image_url} 
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Icon className="w-24 h-24 text-white/30" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">Activity Details</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {activity.full_description}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Quick Details</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Activity Type</span>
                      <span className="font-semibold">
                        {activity.icon === 'Mountain' ? 'Adventure' : 
                         activity.icon === 'TreePine' ? 'Nature' :
                         activity.icon === 'Utensils' ? 'Cultural' :
                         activity.icon === 'Coffee' ? 'Relaxation' : 'Experience'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 text-primary mr-2" />
                      <span className="text-muted-foreground">Category: </span>
                      <span className="font-semibold ml-2">
                        {activity.icon === 'Mountain' ? 'Outdoor Adventure' : 
                         activity.icon === 'TreePine' ? 'Nature Walk' :
                         activity.icon === 'Utensils' ? 'Local Culture' :
                         activity.icon === 'Coffee' ? 'Relaxation' : 'General'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold mb-2 text-foreground">Activity Highlights</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Guided experience by local experts</li>
                      <li>• Connect with nature and culture</li>
                      <li>• Safe and enjoyable for all ages</li>
                      <li>• Memorable Himalayan experience</li>
                    </ul>
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
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4 text-foreground">More Activities</h2>
              <p className="text-lg text-muted-foreground">Explore other experiences at Shanti Himalaya</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherActivities.map((otherActivity: any) => {
                const OtherIcon = iconMap[otherActivity.icon] || Mountain
                return (
                  <Card key={otherActivity.id} className="shadow-card hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="h-40 relative">
                      {otherActivity.image_url ? (
                        <img 
                          src={otherActivity.image_url} 
                          alt={otherActivity.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <OtherIcon className="w-12 h-12 text-white/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center mb-3">
                        <OtherIcon className="w-5 h-5 text-primary mr-2" />
                        <h3 className="text-lg font-semibold">{otherActivity.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{otherActivity.description}</p>
                      <Link href={`/our-resort/activities/${otherActivity.id}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-12">
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
  )
}