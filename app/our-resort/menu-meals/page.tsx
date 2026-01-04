"use client"

import React from "react"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Coffee,
  Utensils,
  Leaf,
  Drumstick,
  Info
} from "lucide-react"

const SetMenuMeals = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 hero-gradient text-white text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-2">
          <Utensils className="w-5 h-5 mr-2" />
          Set Menu
        </Badge>

        <h1 className="text-5xl font-display font-bold mb-4">
          Homely Dining Experience
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Fresh, comforting meals prepared daily with local ingredients
        </p>
      </section>

      {/* Menu Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Breakfast */}
          <Card className="overflow-hidden shadow-card hover:shadow-xl transition">
            <Image
              src="/menu/breakfast.png"
              alt="Breakfast"
              width={500}
              height={300}
              className="h-48 w-full object-cover"
            />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Coffee className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Breakfast</h2>
              </div>

              <Badge variant="secondary">₹250 per person</Badge>
              <Separator />

              <p className="font-medium">Choose any two:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Stuffed Parathas / Aalu Poorie</li>
                <li>• Poha / Upma / Cornflakes</li>
                <li>• Bread Toast & Jam</li>
              </ul>

              <p className="text-sm font-medium">
                Served with Hot Tea / Coffee
              </p>
            </CardContent>
          </Card>

          {/* Veg Lunch / Dinner */}
          <Card className="overflow-hidden shadow-card hover:shadow-xl transition border-green-200">
            <Image
              src="/menu/veg-thali.png"
              alt="Veg Thali"
              width={500}
              height={300}
              className="h-48 w-full object-cover"
            />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Leaf className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-semibold">Veg Lunch / Dinner</h2>
              </div>

              <Badge className="bg-green-100 text-green-800">
                ₹450 per person
              </Badge>
              <Separator />

              <p className="font-medium">Choose any 1 Dal</p>
              <p className="text-sm text-muted-foreground">
                Chana / Fry / Makhani / Tadka / Rajma
              </p>

              <p className="font-medium">Choose any 1 Subzi</p>
              <p className="text-sm text-muted-foreground">
                Shahi Paneer, Kadhai Paneer, Matar Paneer, Paneer Bhurji,
                Mix Veg, Aalu Gobhi, Jeera Aalu, Aalu Methi
              </p>

              <p className="text-sm font-medium">
                Served with Rice / Roti & Salad
              </p>
            </CardContent>
          </Card>

          {/* Non-Veg Lunch / Dinner */}
          <Card className="overflow-hidden shadow-card hover:shadow-xl transition border-orange-200">
            <Image
              src="/menu/non-veg-thali.png"
              alt="Non Veg Thali"
              width={500}
              height={300}
              className="h-48 w-full object-cover"
            />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Drumstick className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-semibold">Non-Veg Lunch / Dinner</h2>
              </div>

              <Badge className="bg-orange-100 text-orange-800">
                ₹550 per person
              </Badge>
              <Separator />

              <p className="font-medium">Choose any 1 Dal</p>
              <p className="text-sm text-muted-foreground">
                Chana / Fry / Makhani / Tadka / Rajma
              </p>

              <p className="font-medium">Choose any 1 Chicken Dish</p>
              <p className="text-sm text-muted-foreground">
                Chicken Curry / Butter Chicken / Kadhai Chicken
              </p>

              <p className="text-sm font-medium">
                Served with Rice / Roti & Salad
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* House Rules */}
      <section className="py-20 mountain-gradient">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-card">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">House Rules</h2>
              </div>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Same dishes for entire group (per meal)</li>
                <li>• Breakfast after 10 AM will be charged</li>
                <li>• Kitchen closes at 10 PM (microwave available)</li>
                <li>• Confirm menu 24 hours before check-in</li>
                <li>• Guests above 5 years will be charged</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default SetMenuMeals
