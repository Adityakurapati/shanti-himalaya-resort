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
  Sparkles,
  Trees,
  Users,
  Star
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

      {/* ================= SHANTI HIMALAYA DINING EXPERIENCE ================= */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
              <Trees className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              SHANTI HIMALAYA DINING EXPERIENCE
            </h2>
          </div>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              At <span className="font-semibold text-foreground">Shanti Himalaya Wilderness Resort</span>, dining is more than just a meal; it's an immersive experience.
            </p>
            
            <p>
              Our main restaurant serves as the central dining area where you can enjoy a wide variety of dishes. This large restaurant not only serves finger-licking food, but also provides eye-soothing, gorgeous 180-degree views of greenery laden mountains in front.
            </p>
            
            <p>
              The restaurant provides Set Menu Meals and caters to any special dietary requirements. The Resort Cook strives to create flavorful dishes that satisfy diverse palates.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SPECIAL OUTDOOR DINING EXPERIENCES ================= */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-6 py-2 text-sm">Outdoor Experiences</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Unique Outdoor Dining Experiences
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Shanti Himalaya excels in providing memorable outdoor dining experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Breakfast During Summers */}
            <div className="bg-background rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Coffee className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Breakfast During Summers</h3>
                  <p className="text-sm text-muted-foreground">
                    Imagine starting your day with a delightful picnic-style Breakfast amongst the nature in the Resort's courtyard.
                  </p>
                </div>
              </div>
            </div>

            {/* Children's Picnic */}
            <div className="bg-background rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Children's Picnic</h3>
                  <p className="text-sm text-muted-foreground">
                    The resort caters to families by offering special picnic experiences for children. We prepare a basket filled with snacks & drinks allowing children to enjoy a meal in the natural surroundings.
                  </p>
                </div>
              </div>
            </div>

            {/* Sundowner Tea and Snacks */}
            <div className="bg-background rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sundowner Tea and Snacks</h3>
                  <p className="text-sm text-muted-foreground">
                    Guests can indulge in a "sundowner" experience, enjoying tea and cookies as the sun sets through the mountains. This provides a relaxing way to conclude a day well spent in wilderness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SPECIAL GOURMET EXPERIENCES ================= */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-6 py-2 text-sm">Exclusive Experiences</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Special Gourmet Experiences
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Shanti Himalaya Wilderness Glamps offers a few different special gourmet experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Trees className="w-5 h-5 text-green-600" />,
                title: "Special Village Meals",
                desc: "Experience special home-cooked meals during village visits, often featuring fresh, locally sourced ingredients prepared by host families as part of an authentic cultural immersion, moving beyond typical tourist fare to offer genuine taste of local life and tradition."
              },
              {
                icon: <Mountain className="w-5 h-5 text-blue-600" />,
                title: "Sundowner at Hilltop",
                desc: "Hike to a nearby hill top for sundowner drinks and snacks."
              },
              {
                icon: <Flame className="w-5 h-5 text-orange-600" />,
                title: "BonFlame-Bar-be-cue dinners",
                desc: "Enjoy a meal cooked over a BONFIRE."
              },
              {
                icon: <Coffee className="w-5 h-5 text-amber-600" />,
                title: "Outdoor Breakfasts",
                desc: "Enjoy a breakfast served outside."
              },
              {
                icon: <Sparkles className="w-5 h-5 text-pink-600" />,
                title: "Romantic Candle Light Meal",
                desc: "Enjoy a romantic meal set in the Restaurant."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-background rounded-xl p-6 shadow-card hover:shadow-xl transition-shadow border border-border/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg italic text-muted-foreground max-w-3xl mx-auto">
              The combination of delicious food, stunning scenery, and the unique ambiance of the wilderness makes dining at Shanti Himalaya Wilderness Resort an experience you won't soon forget.
            </p>
          </div>
        </div>
      </section>

      {/* ================= OUR SET FOOD MENU MEALS ================= */}
      <section className="py-12">
  <div className="container mx-auto px-4">
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-3">OUR SET FOOD MENU MEALS</h2>
      <p className="text-muted-foreground">Complete set meals for your convenience</p>
    </div>

    {/* Menu Cards Container */}
    <div className="space-y-8">
      {/* BREAKFAST CARD */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden border border-border/50">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-2/5 h-56 md:h-auto">
            <Image
              src="/sample/breakfast.jpg"
              alt="Breakfast"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:bg-gradient-to-r md:from-black/30 md:via-black/10 md:to-transparent" />
          </div>
          <div className="md:w-3/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Coffee className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold">BREAKFAST</h3>
            </div>
            <Badge className="text-base px-5 py-2 bg-amber-50 text-amber-800 border-amber-200 mb-5">
              Rs. 349* Per person per meal
            </Badge>
            <div className="mb-5">
              <p className="text-muted-foreground mb-3 font-medium">Choose any Two Options:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Stuffed Parantha / Aalu Poorie / Poha</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Two Eggs prepared to your liking / Scrambled Egg</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Bread Toast with Butter / Jam</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t">
              <p className="font-semibold text-primary">Hot Tea / Coffee included</p>
            </div>
          </div>
        </div>
      </div>

      {/* LUNCH & DINNER CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VEG LUNCH/DINNER CARD */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden border border-border/50">
          <div className="relative h-48">
            <Image
              src="/sample/veg-thali.png"
              alt="Vegetarian Thali"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChefHat className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-white">VEG LUNCH / DINNER</h3>
              </div>
              <Badge className="bg-white/95 text-green-800 border-green-200 font-medium">
                Rs. 549* Per person per meal
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <h4 className="font-semibold text-sm mb-2 text-green-700">Choose 1 Daal</h4>
                <p className="text-sm text-muted-foreground">Daal Fry / Channa Daal / Rajma / Chole</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 text-green-700">Choose 1 Subzi</h4>
                <p className="text-sm text-muted-foreground">Mix veg / Aalu Gobhi / Jeera Aalu</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 text-green-700">Rice</h4>
                <p className="text-sm text-muted-foreground">Plain Rice / Jeera Rice</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 text-green-700">Desert</h4>
                <p className="text-sm text-muted-foreground">Seviyan / Kheer / Halwa</p>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Also includes:</span> Tawa Roti, Salad, Achar, Papad
              </p>
            </div>
          </div>
        </div>

        {/* NON-VEG LUNCH/DINNER CARD */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden border border-border/50">
          <div className="relative h-48">
            <Image
              src="/sample/non-veg.png"
              alt="Non-Vegetarian Meal"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Flame className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-white">NON-VEG LUNCH / DINNER</h3>
              </div>
              <Badge className="bg-white/95 text-red-800 border-red-200 font-medium">
                Rs. 749* Per person per meal
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <h4 className="font-semibold text-sm mb-2 text-red-700">Choose 1 Daal</h4>
                <p className="text-sm text-muted-foreground">Daal Fry / Channa Daal / Rajma / Chole</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 text-red-700">Choose 1 Subzi</h4>
                <p className="text-sm text-muted-foreground">Mix veg / Aalu Gobhi / Jeera Aalu</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 text-red-700">Choose 1 Non-Veg</h4>
                <p className="text-sm text-muted-foreground">Chicken Curry / Chicken Masala / Kadhai Chicken</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 text-red-700">Rice</h4>
                <p className="text-sm text-muted-foreground">Plain Rice / Jeera Rice</p>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Also includes:</span> Tawa Roti, Desert (Seviyan/Kheer/Halwa), Salad, Achar, Papad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ================= SNACKS & BONFIRE ================= */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flame className="w-8 h-8 text-orange-600" />
              <h2 className="text-4xl md:text-5xl font-bold">SNACKS & BONFIRE</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto italic">
              Imagine the crackling of a BONFIRE, the gentle hum of nocturnal insects, and the vast, star-studded sky above. This is the magic of our BONFIRE evenings, where the thrill of the wilderness meets the delight of exquisite cuisine.
            </p>
          </div>

          {/* SNACKS OPTIONS */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 1 Veg + 1 Non Veg */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="text-center mb-6">
                <Badge className="text-lg px-6 py-2 bg-blue-50 text-blue-800 border-blue-200 mb-2">
                  1 VEG + 1 Non Veg
                </Badge>
                <p className="text-2xl font-bold">Rs. 500 Per Person</p>
                <p className="text-sm text-muted-foreground mt-2">(Choose Any One from each category)</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Veg Options */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-green-700">Veg</h4>
                  <ul className="space-y-2">
                    <li className="text-muted-foreground">• Mixed Pakora</li>
                    <li className="text-muted-foreground">• Masala Peanut</li>
                  </ul>
                </div>
                
                {/* Non Veg Options */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-red-700">Non Veg</h4>
                  <ul className="space-y-2">
                    
                    <li className="text-muted-foreground">• Egg Bhurji</li>
                    <li className="text-muted-foreground">• Chilli Chicken</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2 Veg + 2 Non Veg */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="text-center mb-6">
                <Badge className="text-lg px-6 py-2 bg-purple-50 text-purple-800 border-purple-200 mb-2">
                  2 Veg + 2 Non Veg
                </Badge>
                <p className="text-2xl font-bold">Rs. 850 Per Person</p>
                <p className="text-sm text-muted-foreground mt-2">(Choose Any Two from each category)</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Veg Options */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-green-700">Veg</h4>
                  <ul className="space-y-2">
                    <li className="text-muted-foreground">• Mixed Pakora</li>
                    <li className="text-muted-foreground">• Masala Peanut</li>
                    <li className="text-muted-foreground">• Chilli Mushroom</li>
                    <li className="text-muted-foreground">• Paneer Manchurian</li>
                  </ul>
                </div>
                
                {/* Non Veg Options */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-red-700">Non Veg</h4>
                  <ul className="space-y-2">
                    <li className="text-muted-foreground">• Chilli Chicken</li>
                    <li className="text-muted-foreground">• Fried Chicken</li>
                    <li className="text-muted-foreground">• Grilled Chicken</li>
                    <li className="text-muted-foreground">• Egg Bhurji</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* BONFIRE */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl shadow-card p-8 border border-orange-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="md:w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="w-8 h-8 text-orange-600" />
                  <h3 className="text-2xl font-bold text-orange-900">BONFIRE</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Flame-wood collection is a part of daily work schedule of rural women living in villages around the resort. We purchase the Flamewood from these women and encourage our Guests to contribute for our effort in helping in the upliftment of local women community.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <p className="font-semibold text-lg text-orange-800">BONFIRE for 1 Hr</p>
                    <p className="text-2xl font-bold text-orange-600">Rs. 600 in total</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <p className="font-semibold text-lg text-orange-800">BONFIRE for 2 Hrs</p>
                    <p className="text-2xl font-bold text-orange-600">Rs. 900 in total</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="relative h-48 w-48 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full opacity-70"></div>
                  <Flame className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
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
                <h2 className="text-2xl md:text-3xl font-semibold">HOUSE RULES</h2>
                <p className="text-muted-foreground">For a smooth dining experience</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-primary">1</span>
                </div>
                <span className="text-base">Same dishes for the entire group (for each meal).</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-primary">2</span>
                </div>
                <span className="text-base">Our Team will retire at 10 pm every night. Post which no table service will be available.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-primary">3</span>
                </div>
                <span className="text-base">Please confirm the food menu at least 24 hours prior to check-in date.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-primary">4</span>
                </div>
                <span className="text-base">Anyone above 6 years will be charged in full.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-primary">5</span>
                </div>
                <span className="text-base">Due to remote location of Resort, any particular dish is subject to availability of that item locally.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}