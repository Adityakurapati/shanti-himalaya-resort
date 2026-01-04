"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Utensils,
  Coffee,
  Flame,
  ChefHat,
  Info,
  Mountain,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react"

export default function MenuMealsPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const diningImages = [
    "/sample/dining-1.jpg",
    "/sample/dining-2.jpg",
    "/sample/dining-3.jpg",
    "/sample/dining-4.jpg",
    "/sample/dining-5.jpg",
    "/sample/dining-6.jpg",
    "/sample/dining-7.jpg",
    "/sample/dining-8.jpg",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % diningImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [diningImages.length])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: currentSlide * scrollRef.current.offsetWidth,
        behavior: "smooth"
      })
    }
  }, [currentSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % diningImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + diningImages.length) % diningImages.length)
  }

  // Featured images above carousel
  const featuredImages = [
    "/sample/dining-hero.jpg",
    "/sample/dining-view-1.jpg",
    "/sample/dining-view-2.jpg",
  ]

  return (
    <div className="bg-background">
      <Header />

      {/* ================= HERO BANNER ================= */}
      <section className="relative h-[90vh]">
        <Image
          src="/sample/dining-hero.jpg"
          alt="Luxury Dining"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-6">
          <Badge className="mb-6 bg-white/20 backdrop-blur-sm border-white/30 text-white px-6 py-2 hover:bg-white/30 transition-all">
            <Sparkles className="w-4 h-4 mr-2" />
            Fine Dining Experience
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold max-w-5xl leading-tight">
            Where Wilderness Meets
            <span className="block text-amber-200">Fine Dining</span>
          </h1>
          <p className="mt-6 text-xl max-w-2xl text-white/90 leading-relaxed">
            Inspired by nature, curated with passion — enjoy memorable meals
            amidst the serene Himalayas.
          </p>
        </div>
      </section>

      {/* ================= FEATURED IMAGES ABOVE CAROUSEL ================= */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredImages.map((src, i) => (
              <div
                key={i}
                className="relative h-[300px] rounded-2xl overflow-hidden group shadow-xl"
              >
                <Image
                  src={src}
                  alt={`Featured dining ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold">Dining Space {i + 1}</h3>
                  <p className="text-sm text-white/80">Panoramic Mountain Views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ENHANCED AUTO-SCROLLING CAROUSEL ================= */}
      <section className="py-20 bg-gradient-to-b from-muted/10 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Dining Spaces
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Explore our beautifully designed dining areas that blend traditional
              elegance with modern comfort
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Navigation Buttons */}
            <Button
              onClick={prevSlide}
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full shadow-lg"
              variant="secondary"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              onClick={nextSlide}
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full shadow-lg"
              variant="secondary"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Auto-scrolling Carousel */}
            <div
              ref={scrollRef}
              className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth rounded-2xl shadow-2xl"
            >
              {diningImages.map((src, i) => (
                <div
                  key={i}
                  className="min-w-full relative h-[500px] snap-center"
                >
                  <Image
                    src={src}
                    alt={`Dining view ${i + 1}`}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="max-w-2xl mx-auto text-center">
                      <Badge className="mb-4 bg-white/20 backdrop-blur-sm">
                        View {i + 1} of {diningImages.length}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {i % 2 === 0 ? "Main Dining Hall" : "Private Dining"}
                      </h3>
                      <p className="text-white/80">
                        {i % 2 === 0 
                          ? "Spacious hall with panoramic windows and traditional decor"
                          : "Intimate setting perfect for family gatherings and special occasions"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {diningImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    i === currentSlide 
                      ? "bg-primary w-8" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Thumbnail Navigation */}
            <div className="mt-8 grid grid-cols-4 md:grid-cols-8 gap-3">
              {diningImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`relative h-20 rounded-lg overflow-hidden transition-all ${
                    i === currentSlide 
                      ? "ring-2 ring-primary ring-offset-2 scale-105" 
                      : "opacity-70 hover:opacity-100 hover:scale-102"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 ${
                    i === currentSlide ? "bg-primary/20" : "bg-black/20"
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4</div>
              <p className="text-muted-foreground">Unique Dining Areas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">120+</div>
              <p className="text-muted-foreground">Guest Capacity</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">180°</div>
              <p className="text-muted-foreground">Mountain Views</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT DINING ================= */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full">
            <Mountain className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Shanti Himalaya Dining Experience
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our restaurant offers warm Himalayan hospitality, breathtaking panoramic
            mountain views, and thoughtfully crafted multi-course meals. We serve
            curated set menus using locally sourced organic ingredients while
            accommodating all special dietary requirements with care.
          </p>
        </div>
      </section>

      {/* ================= MENU CARDS ================= */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Curated Dining Menus</h2>
            <p className="text-muted-foreground text-lg">
              Experience culinary excellence with our specially crafted menus
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Breakfast */}
            <MenuCard
              img="/sample/breakfast.jpg"
              icon={<Coffee className="w-8 h-8 text-amber-600" />}
              title="Breakfast"
              price="₹349 per person"
              desc="A wholesome start with Indian & continental options, fresh fruits, baked goods, and specialty teas served every morning."
              features={["Fresh Juices", "Indian & Continental", "Baked Goods", "Specialty Teas"]}
            />

            {/* Lunch / Dinner Veg */}
            <MenuCard
              img="/sample/veg-thali.png"
              icon={<ChefHat className="w-8 h-8 text-green-600" />}
              title="Veg Lunch / Dinner"
              price="₹549 per person"
              desc="Comforting vegetarian meals featuring seasonal vegetables, traditional flavors, and authentic preparation methods."
              features={["Seasonal Vegetables", "Traditional Flavors", "Multi-course Meal", "Local Spices"]}
            />

            {/* Non Veg */}
            <MenuCard
              img="/sample/non-veg.png"
              icon={<Flame className="w-8 h-8 text-orange-600" />}
              title="Non-Veg Lunch / Dinner"
              price="₹749 per person"
              desc="Delicious chicken and fish preparations served with traditional Indian accompaniments and modern presentations."
              features={["Chicken/Fish Dishes", "Indian Accompaniments", "Modern Presentation", "Local Herbs"]}
            />
          </div>
        </div>
      </section>

      {/* ================= SPECIAL EXPERIENCES ================= */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-6 py-2 text-sm">Exclusive Experiences</Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Special Gourmet Experiences
            </h2>
            <p className="text-muted-foreground text-lg mt-4">
              Create unforgettable memories with our unique dining experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Outdoor Breakfasts & Summer Picnics",
                desc: "Al fresco dining with mountain vistas",
              },
              {
                title: "Children's Picnic Experiences",
                desc: "Fun-filled meals for young guests",
              },
              {
                title: "Sundowner Tea & Snacks",
                desc: "Evening refreshments with sunset views",
              },
              {
                title: "Bonfire Bar-be-cue Dinners",
                desc: "Grilled delights under the stars",
              },
              {
                title: "Romantic Candle Light Meals",
                desc: "Intimate dinners for couples",
              },
              {
                title: "Village & Hilltop Dining",
                desc: "Traditional local cuisine experiences",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-background rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow border border-border/50 group hover:border-primary/30"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOUSE RULES ================= */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-gradient-to-br from-background to-muted/30 rounded-2xl shadow-card p-8 border border-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Info className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold">Dining Guidelines</h2>
                <p className="text-muted-foreground">For a smooth dining experience</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-primary">1</span>
                  </div>
                  <span className="text-sm">Same dishes for the entire group (per meal)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-primary">2</span>
                  </div>
                  <span className="text-sm">Kitchen service ends at 10 PM</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-primary">3</span>
                  </div>
                  <span className="text-sm">Menu confirmation required 24 hours prior</span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-primary">4</span>
                  </div>
                  <span className="text-sm">Guests above 6 years will be charged fully</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-primary">5</span>
                  </div>
                  <span className="text-sm">Menu subject to local availability</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-primary">6</span>
                  </div>
                  <span className="text-sm">Special requests available on prior notice</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ================= ENHANCED MENU CARD ================= */
function MenuCard({
  img,
  icon,
  title,
  price,
  desc,
  features,
}: {
  img: string
  icon: React.ReactNode
  title: string
  price: string
  desc: string
  features?: string[]
}) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 group border border-border/50 hover:border-primary/30 bg-background">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 backdrop-blur-sm text-foreground hover:bg-white">
            {price}
          </Badge>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <Separator />
        <p className="text-muted-foreground leading-relaxed">{desc}</p>
        
        {features && (
          <div className="pt-2">
            <h4 className="text-sm font-semibold mb-2">Includes:</h4>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs py-1"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Button variant="outline" className="w-full mt-4 group-hover:border-primary group-hover:text-primary">
          View Full Menu
        </Button>
      </div>
    </div>
  )
}