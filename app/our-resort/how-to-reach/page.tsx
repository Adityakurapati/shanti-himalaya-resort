import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
        MapPin,
        Clock,
        Phone,
        Mail,
        Mountain,
        Train,
        Car,
        MapPinned
} from "lucide-react";
import Image from "next/image";
import mapStandard from "@/assets/map-standard.jpg";
import mapSatellite from "@/assets/map-satellite.jpg";

const HowToReach = () => {
        return (
                <div className="min-h-screen bg-background">
                        <Header />

                        {/* Hero Section */}
                        <section className="pt-32 pb-16 hero-gradient text-white">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-4xl mx-auto text-center">
                                                <Badge className="mb-6 bg-white/20 text-white border-white/30">
                                                        Your Journey Begins Here
                                                </Badge>
                                                <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                                                        How to Reach Us
                                                </h1>
                                                <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                                                        Shanti Himalaya Wilderness Resort is nestled in the serene village of Digolikhal, Uttarakhand.
                                                        Surrounded by lush landscapes, utter isolation, and a tranquil ambience, it offers breathtaking
                                                        views of Trishul, Nandaghungti, and Mrignayani peaks—a perfect escape for peace, nature, and
                                                        conversations by the bonfire.
                                                </p>
                                        </div>
                                </div>
                        </section>

                        {/* Quick Overview Cards */}
                        <section className="py-16 bg-background">
                                <div className="container mx-auto px-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                                                <Card className="text-center shadow-card hover-lift">
                                                        <CardContent className="p-6">
                                                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                                                        <MapPin className="w-8 h-8 text-white" />
                                                                </div>
                                                                <h3 className="font-display font-semibold text-lg mb-2">Location</h3>
                                                                <p className="text-muted-foreground text-sm">
                                                                        Digolikhal, Uttarakhand
                                                                </p>
                                                        </CardContent>
                                                </Card>

                                                <Card className="text-center shadow-card hover-lift">
                                                        <CardContent className="p-6">
                                                                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                                                        <Clock className="w-8 h-8 text-white" />
                                                                </div>
                                                                <h3 className="font-display font-semibold text-lg mb-2">From Delhi</h3>
                                                                <p className="text-muted-foreground text-sm">
                                                                        297 km / ~7-8 hours by road
                                                                </p>
                                                        </CardContent>
                                                </Card>

                                                <Card className="text-center shadow-card hover-lift">
                                                        <CardContent className="p-6">
                                                                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                                                                        <Mountain className="w-8 h-8 text-white" />
                                                                </div>
                                                                <h3 className="font-display font-semibold text-lg mb-2">Nearest Station</h3>
                                                                <p className="text-muted-foreground text-sm">
                                                                        Ramnagar Railway Station
                                                                </p>
                                                        </CardContent>
                                                </Card>
                                        </div>

                                        {/* By Road Section */}
                                        <div className="max-w-5xl mx-auto mb-16">
                                                <Card className="shadow-card">
                                                        <CardHeader>
                                                                <div className="flex items-center space-x-3">
                                                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                                                                <Car className="w-6 h-6 text-white" />
                                                                        </div>
                                                                        <div>
                                                                                <CardTitle className="text-2xl">By Road</CardTitle>
                                                                                <p className="text-muted-foreground text-sm">Most scenic route through the mountains</p>
                                                                        </div>
                                                                </div>
                                                        </CardHeader>
                                                        <CardContent className="space-y-6">
                                                                <div className="bg-muted p-6 rounded-lg">
                                                                        <h4 className="font-semibold text-lg mb-4">Delhi to Shanti Himalaya</h4>
                                                                        <p className="text-muted-foreground mb-4">
                                                                                Approx. 297 km via NH 9 (through Ramnagar – Corbett Park)
                                                                        </p>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                                                <div className="flex justify-between p-3 bg-background rounded">
                                                                                        <span className="text-muted-foreground">Delhi to Ramnagar</span>
                                                                                        <span className="font-semibold">260 km / ~5 hrs</span>
                                                                                </div>
                                                                                <div className="flex justify-between p-3 bg-background rounded">
                                                                                        <span className="text-muted-foreground">Gurgaon to Ramnagar</span>
                                                                                        <span className="font-semibold">275 km / ~5 hrs 30 min</span>
                                                                                </div>
                                                                                <div className="flex justify-between p-3 bg-background rounded">
                                                                                        <span className="text-muted-foreground">Noida to Ramnagar</span>
                                                                                        <span className="font-semibold">245 km / ~4 hrs 30 min</span>
                                                                                </div>
                                                                                <div className="flex justify-between p-3 bg-background rounded">
                                                                                        <span className="text-muted-foreground">Moradabad to Ramnagar</span>
                                                                                        <span className="font-semibold">90 km / ~2 hrs 30 min</span>
                                                                                </div>
                                                                                <div className="flex justify-between p-3 bg-background rounded">
                                                                                        <span className="text-muted-foreground">Bareilly to Ramnagar</span>
                                                                                        <span className="font-semibold">150 km / ~3 hrs 30 min</span>
                                                                                </div>
                                                                                <div className="flex justify-between p-3 bg-background rounded">
                                                                                        <span className="text-muted-foreground">Ramnagar to Shanti Himalaya</span>
                                                                                        <span className="font-semibold">60 km / ~2 hrs</span>
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                                                                        <h4 className="font-semibold text-lg mb-3 flex items-center">
                                                                                <MapPinned className="w-5 h-5 mr-2 text-primary" />
                                                                                Suggested Route
                                                                        </h4>
                                                                        <p className="text-foreground leading-relaxed">
                                                                                Delhi → Gajraula → Moradabad (Bypass) → Kashipur → Ramnagar → Mohan (Left) →
                                                                                Chimtakhal → Marchula (via Rasiya Mahadev Road) → Gaulikhal → Digolikhal
                                                                        </p>
                                                                </div>

                                                                <div className="bg-accent/5 p-6 rounded-lg border border-accent/20">
                                                                        <h4 className="font-semibold text-lg mb-3">Stopovers En Route</h4>
                                                                        <div className="space-y-3">
                                                                                <div>
                                                                                        <p className="font-medium mb-1">Gajraula</p>
                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                Food joints like McDonald's, KFC, Domino's, Tadka, Udupiwala (with clean washrooms & a nearby petrol pump)
                                                                                        </p>
                                                                                </div>
                                                                                <div>
                                                                                        <p className="font-medium mb-1">Between Kashipur & Ramnagar</p>
                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                Multiple dhabas & restaurants with good food and clean washrooms
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </CardContent>
                                                </Card>
                                        </div>

                                        {/* By Train Section */}
                                        <div className="max-w-5xl mx-auto mb-16">
                                                <Card className="shadow-card">
                                                        <CardHeader>
                                                                <div className="flex items-center space-x-3">
                                                                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                                                                                <Train className="w-6 h-6 text-white" />
                                                                        </div>
                                                                        <div>
                                                                                <CardTitle className="text-2xl">By Train</CardTitle>
                                                                                <p className="text-muted-foreground text-sm">Nearest railway station: Ramnagar, well connected with Delhi</p>
                                                                        </div>
                                                                </div>
                                                        </CardHeader>
                                                        <CardContent className="space-y-6">
                                                                <div>
                                                                        <h4 className="font-semibold text-lg mb-4">Delhi to Ramnagar</h4>
                                                                        <div className="space-y-3">
                                                                                <div className="bg-muted p-4 rounded-lg">
                                                                                        <div className="flex justify-between items-start mb-2">
                                                                                                <div>
                                                                                                        <p className="font-semibold">UTR Sampark Kranti (15035)</p>
                                                                                                        <p className="text-sm text-muted-foreground mt-1">Duration: 5 hours</p>
                                                                                                </div>
                                                                                                <Badge variant="secondary">Morning Arrival</Badge>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-4 text-sm mt-3">
                                                                                                <div>
                                                                                                        <span className="text-muted-foreground">Dep. Delhi:</span>
                                                                                                        <span className="font-semibold ml-2">16:00</span>
                                                                                                </div>
                                                                                                <span className="text-muted-foreground">→</span>
                                                                                                <div>
                                                                                                        <span className="text-muted-foreground">Arr. Ramnagar:</span>
                                                                                                        <span className="font-semibold ml-2">21:00</span>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>

                                                                                <div className="bg-muted p-4 rounded-lg">
                                                                                        <div className="flex justify-between items-start mb-2">
                                                                                                <div>
                                                                                                        <p className="font-semibold">Ranikhet Express (15013)</p>
                                                                                                        <p className="text-sm text-muted-foreground mt-1">Duration: 7 hrs 55 min</p>
                                                                                                </div>
                                                                                                <Badge variant="secondary">Early Morning</Badge>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-4 text-sm mt-3">
                                                                                                <div>
                                                                                                        <span className="text-muted-foreground">Dep. Delhi Cantt.:</span>
                                                                                                        <span className="font-semibold ml-2">20:20</span>
                                                                                                </div>
                                                                                                <span className="text-muted-foreground">→</span>
                                                                                                <div>
                                                                                                        <span className="text-muted-foreground">Arr. Ramnagar:</span>
                                                                                                        <span className="font-semibold ml-2">04:15</span>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                <div>
                                                                        <h4 className="font-semibold text-lg mb-4">Ramnagar to Delhi</h4>
                                                                        <div className="space-y-3">
                                                                                <div className="bg-muted p-4 rounded-lg">
                                                                                        <div className="flex justify-between items-start mb-2">
                                                                                                <div>
                                                                                                        <p className="font-semibold">RMR–DLI Link Express (15035)</p>
                                                                                                        <p className="text-sm text-muted-foreground mt-1">Duration: 5 hrs 25 min</p>
                                                                                                </div>
                                                                                                <Badge variant="secondary">Afternoon Arrival</Badge>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-4 text-sm mt-3">
                                                                                                <div>
                                                                                                        <span className="text-muted-foreground">Dep. Ramnagar:</span>
                                                                                                        <span className="font-semibold ml-2">10:00</span>
                                                                                                </div>
                                                                                                <span className="text-muted-foreground">→</span>
                                                                                                <div>
                                                                                                        <span className="text-muted-foreground">Arr. Delhi:</span>
                                                                                                        <span className="font-semibold ml-2">15:25</span>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>

                                                                                <div className="bg-muted p-4 rounded-lg">
                                                                                        <div className="flex justify-between items-start mb-2">
                                                                                                <div>
                                                                                                        <p className="font-semibold">Corbett Park Link (15013)</p>
                                                                                                        <p className="text-sm text-muted-foreground mt-1">Duration: 5 hrs 35 min</p>
                                                                                                </div>
                                                                                                <Badge variant="secondary">Early Morning</Badge>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-4 text-sm mt-3">
                                                                                                <div>
                                                                                                        <span className="text-muted-foreground">Dep. Ramnagar:</span>
                                                                                                        <span className="font-semibold ml-2">22:15</span>
                                                                                                </div>
                                                                                                <span className="text-muted-foreground">→</span>
                                                                                                <div>
                                                                                                        <span className="text-muted-foreground">Arr. Delhi:</span>
                                                                                                        <span className="font-semibold ml-2">03:50</span>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                                                                        <p className="text-sm">
                                                                                ➡️ Local taxis are available from Ramnagar, and our team can also arrange pickups for a
                                                                                comfortable transfer to Digolikhal via Marchula.
                                                                        </p>
                                                                </div>
                                                        </CardContent>
                                                </Card>
                                        </div>

                                        {/* Location on Maps */}
                                        <div className="max-w-5xl mx-auto">
                                                <Card className="shadow-card">
                                                        <CardHeader>
                                                                <CardTitle className="text-2xl flex items-center">
                                                                        <MapPin className="w-6 h-6 mr-2 text-primary" />
                                                                        Location on Google Maps
                                                                </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-6">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                        <div>
                                                                                <h4 className="font-semibold mb-3">Standard Map View</h4>
                                                                                <Image
                                                                                        src={mapStandard}
                                                                                        alt="Standard map showing Shanti Himalaya Resort location in Digolikhal, Uttarakhand"
                                                                                        className="w-full rounded-lg shadow-md"
                                                                                        width={600}
                                                                                        height={400}
                                                                                />
                                                                        </div>
                                                                        <div>
                                                                                <h4 className="font-semibold mb-3">Satellite Map View</h4>
                                                                                <Image
                                                                                        src={mapSatellite}
                                                                                        alt="Satellite map view of Shanti Himalaya Resort location in Digolikhal"
                                                                                        className="w-full rounded-lg shadow-md"
                                                                                        width={600}
                                                                                        height={400}
                                                                                />
                                                                        </div>
                                                                </div>
                                                                <div className="bg-muted p-6 rounded-lg text-center">
                                                                        <p className="font-mono text-lg mb-4">📍 Shanti Himalaya Resort, Digolikhal, Uttarakhand</p>
                                                                        <Button variant="default" className="hero-gradient hover-glow" asChild>
                                                                                <a
                                                                                        href="https://maps.app.goo.gl/XTQVScugPHvdRKG87"
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                >
                                                                                        Open in Google Maps
                                                                                </a>
                                                                        </Button>
                                                                </div>
                                                        </CardContent>
                                                </Card>
                                        </div>
                                </div>
                        </section>

                        {/* Contact for Assistance */}
                        <section className="py-16 mountain-gradient">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-2xl mx-auto text-center">
                                                <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
                                                        Need Travel Assistance?
                                                </h2>
                                                <p className="text-muted-foreground mb-8 leading-relaxed">
                                                        Our team is available to help plan your journey and arrange transportation.
                                                        We can organize pickup services from Ramnagar or any location en route.
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                        <Card className="shadow-card hover-lift">
                                                                <CardContent className="p-6 text-center">
                                                                        <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                                                                        <h3 className="font-semibold mb-2">Call Us</h3>
                                                                        <p className="text-muted-foreground mb-3">Available for assistance</p>
                                                                        <a href="tel:9910775073" className="font-mono text-primary hover:underline">
                                                                                9910775073
                                                                        </a>
                                                                </CardContent>
                                                        </Card>

                                                        <Card className="shadow-card hover-lift">
                                                                <CardContent className="p-6 text-center">
                                                                        <Mail className="w-8 h-8 text-accent mx-auto mb-3" />
                                                                        <h3 className="font-semibold mb-2">Email Us</h3>
                                                                        <p className="text-muted-foreground mb-3">Quick response guaranteed</p>
                                                                        <a href="mailto:travel@shantihimalaya.com" className="font-mono text-accent hover:underline">
                                                                                travel@shantihimalaya.com
                                                                        </a>
                                                                </CardContent>
                                                        </Card>
                                                </div>
{/* 
                                                <Button size="lg" className="hero-gradient hover-glow">
                                                        Request Pickup Service
                                                </Button> */}
                                        </div>
                                </div>
                        </section>

                        <Footer />
                </div>
        );
};

export default HowToReach;
