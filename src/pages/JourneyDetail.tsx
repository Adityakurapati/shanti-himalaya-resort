import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Mountain, 
  Clock, 
  Users, 
  Star,
  ArrowLeft,
  Phone,
  Mail,
  CheckCircle
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

const JourneyDetail = () => {
  const { id } = useParams();
  const [journey, setJourney] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      fetchJourney();
    }
  }, [id]);

  const fetchJourney = async () => {
    try {
      const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setJourney(data);
    } catch (error) {
      console.error('Error fetching journey:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 text-center">
          <p className="text-lg text-muted-foreground">Loading journey...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Journey Not Found</h1>
          <Link to="/journeys">
            <Button>Back to Journeys</Button>
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
            <Link to="/journeys" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Journeys
            </Link>
            
            <div className="flex items-center space-x-4 mb-6">
              <Badge className="bg-white/20 text-white border-white/30">
                {journey.difficulty}
              </Badge>
              <Badge className="bg-gold text-white">
                {journey.category}
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              {journey.title}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              {journey.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Duration</p>
                  <p className="font-semibold">{journey.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mountain className="w-6 h-6 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Difficulty</p>
                  <p className="font-semibold">{journey.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Category</p>
                  <p className="font-semibold">{journey.category}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
                <Phone className="w-5 h-5 mr-2" />
                Book This Journey
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
                <Mail className="w-5 h-5 mr-2" />
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
                  <h2 className="text-3xl font-display font-bold mb-6 text-foreground">About This Journey</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {journey.description}
                  </p>

                  <h3 className="text-2xl font-display font-bold mb-4 text-foreground">Activities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {journey.activities && journey.activities.map((activity: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{activity}</span>
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
                        <span className="font-semibold">{journey.duration}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground">Difficulty</span>
                        <span className="font-semibold">{journey.difficulty}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <span className="font-semibold">{journey.category}</span>
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
              Ready for Your Journey?
            </h2>
            <p className="text-white/90 mb-8 leading-relaxed">
              Contact us to customize this journey according to your preferences.
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

export default JourneyDetail;
