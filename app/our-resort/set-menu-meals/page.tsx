"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Utensils, Coffee, Leaf, Clock, ChefHat, ArrowLeft, Star, Users } from "lucide-react"
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client"

type DiningSchedule = { id: string; meal_type: string; time: string; description: string }

const SetMenuMeals = () => {
        const [mealPlans, setMealPlans] = React.useState<
                Array<{
                        id: string
                        name: string
                        price: string
                        description: string
                        breakfast: string[]
                        lunch: string[]
                        dinner: string[]
                        badge: string
                }>
        >([])
        const [loading, setLoading] = React.useState(true)
        const [schedule, setSchedule] = React.useState<DiningSchedule[]>([])

        React.useEffect(() => {
                const load = async () => {
                        const { data: plans, error: plansError } = await supabase
                                .from("meal_plans")
                                .select("*")
                                .order("created_at", { ascending: false })
                        const { data: sched, error: schedError } = await supabase
                                .from("dining_schedule")
                                .select("*")
                                .order("meal_type", { ascending: true })
                        if (!plansError) setMealPlans(plans || [])
                        if (!schedError) setSchedule(sched || [])
                        setLoading(false)
                }
                load()

                const chPlans = supabase
                        .channel("meal_plans_changes")
                        .on("postgres_changes", { event: "*", schema: "public", table: "meal_plans" }, load)
                        .subscribe()
                const chSchedule = supabase
                        .channel("dining_schedule_changes")
                        .on("postgres_changes", { event: "*", schema: "public", table: "dining_schedule" }, load)
                        .subscribe()
                return () => {
                        supabase.removeChannel(chPlans)
                        supabase.removeChannel(chSchedule)
                }
        }, [])

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

        if (loading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Header />
                                <div className="pt-32 pb-16 text-center">
                                        <p className="text-lg text-muted-foreground">Loading meal plans...</p>
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
                                                                Set Menu Meals
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

                        {/* Meal Plans Section */}
                        <section className="py-20 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="text-center mb-16">
                                                <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Daily Meal Plans</h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                        Choose from our carefully crafted meal plans, all featuring fresh, local ingredients
                                                </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {mealPlans.map((plan: any) => (
                                                        <Card key={plan.id} className="shadow-card hover-lift overflow-hidden relative">
                                                                <div className="absolute top-4 right-4">
                                                                        <Badge
                                                                                className={`${plan.badge === "Popular" ? "bg-green-500" : plan.badge === "Premium" ? "bg-gold" : "bg-primary"} text-white`}
                                                                        >
                                                                                {plan.badge}
                                                                        </Badge>
                                                                </div>

                                                                <CardHeader className="text-center pb-4">
                                                                        <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                                                                        <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
                                                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                                                </CardHeader>

                                                                <CardContent className="space-y-6">
                                                                        {/* Breakfast */}
                                                                        <div>
                                                                                <h4 className="font-semibold text-sm text-accent mb-2 flex items-center">
                                                                                        <Coffee className="w-4 h-4 mr-2" />
                                                                                        BREAKFAST
                                                                                </h4>
                                                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                                                        {plan.breakfast.map((item: string, idx: number) => (<li key={idx} className="flex items-center space-x-2">
                                                                                                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                                                                                                <span>{item}</span>
                                                                                        </li>
                                                                                        ))}
                                                                                </ul>
                                                                        </div>

                                                                        <Separator />

                                                                        {/* Lunch */}
                                                                        <div>
                                                                                <h4 className="font-semibold text-sm text-primary mb-2 flex items-center">
                                                                                        <Utensils className="w-4 h-4 mr-2" />
                                                                                        LUNCH
                                                                                </h4>
                                                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                                                        {plan.lunch.map((item: string, idx: number) => (
                                                                                                <li key={idx} className="flex items-center space-x-2">
                                                                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                                                                        <span>{item}</span>
                                                                                                </li>
                                                                                        ))}
                                                                                </ul>
                                                                        </div>

                                                                        <Separator />

                                                                        {/* Dinner */}
                                                                        <div>
                                                                                <h4 className="font-semibold text-sm text-gold mb-2 flex items-center">
                                                                                        <ChefHat className="w-4 h-4 mr-2" />
                                                                                        DINNER
                                                                                </h4>
                                                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                                                        {plan.dinner.map((item: string, idx: number) => (<li key={idx} className="flex items-center space-x-2">
                                                                                                <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                                                                                <span>{item}</span>
                                                                                        </li>
                                                                                        ))}
                                                                                </ul>
                                                                        </div>

                                                                        <Button className="w-full mt-6 hero-gradient hover-glow">Select This Plan</Button>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
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
                                                {specialFeatures.map((feature: string, index: number) => (
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

                        {/* Dining Schedule */}
                        <section className="py-20 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-4xl mx-auto">
                                                <div className="text-center mb-16">
                                                        <h2 className="text-4xl font-display font-bold mb-6 text-foreground">Dining Schedule</h2>
                                                        <p className="text-lg text-muted-foreground">
                                                                All meals are served at fixed timings to ensure fresh and hot food
                                                        </p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                        {schedule.map((s: string, index: number) => (
                                                                <Card key={s.id} className="shadow-card hover-lift bg-white text-center">
                                                                        <CardContent className="p-6">
                                                                                {s.meal_type.toLowerCase() === "breakfast" ? (
                                                                                        <Coffee className="w-12 h-12 text-primary mx-auto mb-4" />
                                                                                ) : s.meal_type.toLowerCase() === "lunch" ? (
                                                                                        <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
                                                                                ) : (
                                                                                        <ChefHat className="w-12 h-12 text-primary mx-auto mb-4" />
                                                                                )}
                                                                                <h3 className="text-xl font-semibold mb-2">{s.meal_type}</h3>
                                                                                <div className="text-lg font-bold text-accent mb-3">{s.time}</div>
                                                                                <p className="text-muted-foreground text-sm">{s.description}</p>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                        {schedule.length === 0 && (
                                                                <div className="col-span-1 md:col-span-3 text-center text-muted-foreground">
                                                                        Dining schedule coming soon.
                                                                </div>
                                                        )}
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <Footer />
                </div>
        )
}

export default SetMenuMeals
