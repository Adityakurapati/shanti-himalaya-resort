"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Utensils, Coffee, Leaf, Clock, ChefHat, ArrowLeft, Star, Users, Sun, Moon, Check, Filter } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"

type MealTimeFilter = 'all' | 'breakfast' | 'lunch' | 'dinner'

const SetMenuMeals = () => {
  // Use the exact type from your Supabase types
  const [mealItems, setMealItems] = React.useState<Tables<'meal_items'>[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeFilter, setActiveFilter] = useState<MealTimeFilter>('all')

  const specialFeatures = [
    {
      icon: Leaf,
      title: "Organic Ingredients",
      description: "Fresh, locally sourced organic produce from village farms",
    },
    {
      icon: ChefHat,
      title: "Traditional Cooking",
      description: "Prepared using traditional methods and family recipes",
    },
    {
      icon: Clock,
      title: "Fixed Timings",
      description: "Breakfast 8-10 AM, Lunch 12-2 PM, Dinner 7-9 PM",
    },
    {
      icon: Users,
      title: "Group Dining",
      description: "Communal dining experience with fellow travelers",
    },
  ]

  React.useEffect(() => {
    const loadMealItems = async () => {
      const { data, error } = await supabase
        .from("meal_items")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error) {
        setMealItems(data || [])
      }
      setLoading(false)
    }

    loadMealItems()

    const channel = supabase
      .channel("meal_items_changes")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "meal_items"
      }, loadMealItems)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Helper function to safely check boolean values
  const isTrue = (value: boolean | null) => value === true

  // Update your helper functions to handle null values
  const getMealTimeBadges = (item: Tables<'meal_items'>) => {
    const badges = []
    if (item.is_breakfast) badges.push("Breakfast")
    if (item.is_lunch) badges.push("Lunch")
    if (item.is_dinner) badges.push("Dinner")
    return badges
  }

  const filterMealItems = (items: Tables<'meal_items'>[], filter: MealTimeFilter) => {
    if (filter === 'all') return items
    if (filter === 'breakfast') return items.filter(item => item.is_breakfast)
    if (filter === 'lunch') return items.filter(item => item.is_lunch)
    if (filter === 'dinner') return items.filter(item => item.is_dinner)
    return items
  }

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'main': return 'bg-blue-100 text-blue-800'
      case 'starter': return 'bg-purple-100 text-purple-800'
      case 'dessert': return 'bg-pink-100 text-pink-800'
      case 'beverage': return 'bg-cyan-100 text-cyan-800'
      case 'snack': return 'bg-amber-100 text-amber-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'main': return 'Main Course'
      case 'starter': return 'Starter'
      case 'dessert': return 'Dessert'
      case 'beverage': return 'Beverage'
      case 'snack': return 'Snack'
      default: return category
    }
  }

  const filteredItems = filterMealItems(mealItems, activeFilter)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 text-center">
          <p className="text-lg text-muted-foreground">Loading menu...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/our-resort"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Our Resort
            </Link>
            <div className="text-center">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 text-lg px-6 py-2">
                <Utensils className="w-5 h-5 mr-2" />
                Our Menu
              </Badge>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                Farm to Table
                <span className="block text-luxury">Dining Experience</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                Savor authentic local cuisine prepared with love and fresh ingredients sourced directly from village
                farms. Every meal tells a story of tradition and flavor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section with Filter Buttons */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Our Menu</h2>
              <p className="text-muted-foreground mt-2">
                Browse our delicious selection of dishes
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                Filter by:
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeFilter === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                >
                  All Items ({mealItems.length})
                </Button>
                <Button
                  variant={activeFilter === 'breakfast' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter('breakfast')}
                  className="gap-2"
                >
                  <Coffee className="w-4 h-4" />
                  Breakfast ({mealItems.filter(item => isTrue(item.is_breakfast)).length})
                </Button>
                <Button
                  variant={activeFilter === 'lunch' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter('lunch')}
                  className="gap-2"
                >
                  <Sun className="w-4 h-4" />
                  Lunch ({mealItems.filter(item => isTrue(item.is_lunch)).length})
                </Button>
                <Button
                  variant={activeFilter === 'dinner' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter('dinner')}
                  className="gap-2"
                >
                  <Moon className="w-4 h-4" />
                  Dinner ({mealItems.filter(item => isTrue(item.is_dinner)).length})
                </Button>
              </div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground">
                Try selecting a different filter or check back later
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="shadow-card hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {item.category && (
                            <Badge variant="secondary" className={getCategoryColor(item.category)}>
                              {getCategoryName(item.category)}
                            </Badge>
                          )}
                          {item.is_vegetarian && (
                            <Badge variant="outline" className="text-green-700 border-green-300">
                              <Check className="w-3 h-3 mr-1" /> Veg
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-xl font-bold text-primary">₹{item.price}</span>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {item.spice_level || 'medium'} spice
                      </Badge>
                      <div className="flex gap-1">
                        {getMealTimeBadges(item).map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special Features Section */}
      <section className="py-20 mountain-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-6 text-foreground">What Makes Our Dining Special</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience authentic Himalayan cuisine prepared with care, tradition, and the finest local ingredients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialFeatures.map((feature, index) => (
              <Card key={index} className="shadow-card hover-lift bg-white text-center">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chef's Special Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <Star className="w-8 h-8 text-gold fill-current" />
                <h2 className="text-3xl font-display font-bold text-foreground">Chef's Special</h2>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Our kitchen is renowned for serving some of the best delicacies in the region. Every dish is prepared
                with locally produced ingredients that add exceptional flavor and nutrition to your dining experience.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Signature milky Chai - perfect with mountain views</span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Fresh village-style cooking using wood fire</span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Seasonal specialties based on local harvest</span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Special dietary requirements accommodated</span>
                </div>
              </div>

              <div className="pt-6">
                <Button size="lg" className="hero-gradient hover-glow">
                  Book Your Culinary Experience
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="h-96 bg-gradient-to-br from-accent via-primary to-gold rounded-2xl shadow-card flex items-center justify-center">
                <div className="text-center text-white">
                  <ChefHat className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p className="text-xl font-semibold">Local Cuisine Gallery</p>
                  <p className="text-sm opacity-80">Farm-fresh ingredients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dining Hours */}
      <section className="py-20 mountain-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Dining Hours</h2>
              <p className="text-lg text-muted-foreground">
                All meals are served at fixed timings to ensure fresh and hot food
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Breakfast Hours */}
              <Card className="shadow-card hover-lift bg-white text-center">
                <CardContent className="p-6">
                  <Coffee className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Breakfast</h3>
                  <div className="text-lg font-bold text-accent mb-3">8:00 AM - 10:00 AM</div>
                  <p className="text-muted-foreground text-sm">
                    Start your day with a hearty breakfast featuring local specialties
                  </p>
                </CardContent>
              </Card>

              {/* Lunch Hours */}
              <Card className="shadow-card hover-lift bg-white text-center">
                <CardContent className="p-6">
                  <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Lunch</h3>
                  <div className="text-lg font-bold text-accent mb-3">12:00 PM - 2:00 PM</div>
                  <p className="text-muted-foreground text-sm">
                    Traditional midday meal with fresh, locally sourced ingredients
                  </p>
                </CardContent>
              </Card>

              {/* Dinner Hours */}
              <Card className="shadow-card hover-lift bg-white text-center">
                <CardContent className="p-6">
                  <ChefHat className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Dinner</h3>
                  <div className="text-lg font-bold text-accent mb-3">7:00 PM - 9:00 PM</div>
                  <p className="text-muted-foreground text-sm">
                    End your day with a warm, comforting dinner by the fireplace
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default SetMenuMeals