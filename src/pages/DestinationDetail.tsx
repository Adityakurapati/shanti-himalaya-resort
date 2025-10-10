import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  MapPin, 
  Clock, 
  Star,
  Mountain,
  ArrowRight,
  ArrowLeft,
  Thermometer,
  Compass
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      fetchDestination();
    }
  }, [id]);

  const fetchDestination = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setDestination(data);
    } catch (error) {
      console.error('Error fetching destination:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 text-center">
          <p className="text-lg text-muted-foreground">Loading destination...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Destination Not Found</h1>
          <Link to="/destinations">
            <Button>Back to Destinations</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link to="/destinations" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Destinations
            </Link>
            
            <div className="flex items-center space-x-4 mb-6">
              <Badge className="bg-white/20 text-white border-white/30">
                {destination.category}
              </Badge>
              <Badge className="bg-gold text-white">
                {destination.difficulty}
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              {destination.name}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              {destination.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Duration</p>
                  <p className="font-semibold">{destination.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mountain className="w-6 h-6 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Difficulty</p>
                  <p className="font-semibold">{destination.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Thermometer className="w-6 h-6 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Best Time</p>
                  <p className="font-semibold">{destination.best_time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Compass className="w-6 h-6 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Altitude</p>
                  <p className="font-semibold">{destination.altitude}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
                Book This Trek
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
                Get More Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-6 text-foreground">About {destination.name}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {destination.description}
                  </p>

                  <h3 className="text-2xl font-display font-bold mb-4 text-foreground">Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destination.highlights && destination.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Star className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="shadow-card">
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">Quick Info</h3>
                      <p className="text-sm text-muted-foreground">Essential details</p>
                    </div>

                    <div className="space-y-3 border-t pt-4">
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="font-semibold">{destination.duration}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground">Difficulty</span>
                        <span className="font-semibold">{destination.difficulty}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground">Best Time</span>
                        <span className="font-semibold">{destination.best_time}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground">Max Altitude</span>
                        <span className="font-semibold">{destination.altitude}</span>
                      </div>
                    </div>

                    <Button className="w-full hero-gradient hover-glow mt-4">
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-6">
              Ready for Your Adventure?
            </h2>
            <p className="text-white/90 mb-8 leading-relaxed">
              Contact us to plan your perfect journey to {destination.name}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover-glow">
                Book Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Call Us: +977 9876543210
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DestinationDetail;
