import { Metadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import { 
  generateJourneySEO, 
  generateSEOMetadata, 
  generateJSONLD,
  generateBreadcrumbJSONLD 
} from "@/lib/seo-utils";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data: journey, error } = await supabase
      .from("journeys")
      .select("*")
      .eq("slug", params.id)
      .maybeSingle();

    if (error || !journey) {
      return {
        title: "Journey Not Found",
        description: "The journey you are looking for does not exist.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const seoProps = generateJourneySEO(journey);
    const metadata = generateSEOMetadata(seoProps);

    // Add structured data via metadata
    const journeyJSONLD = generateJSONLD(journey, 'Journey');
    const breadcrumbJSONLD = generateBreadcrumbJSONLD([
      { name: 'Home', url: '/' },
      { name: 'Journeys', url: '/journeys' },
      { name: journey.title, url: `/journeys/${journey.slug}` }
    ]);

    return {
      ...metadata,
      other: {
        'structured-data': JSON.stringify(journeyJSONLD),
        'breadcrumb-data': JSON.stringify(breadcrumbJSONLD),
      }
    };
  } catch (error) {
    console.error("Error generating metadata for journey:", error);
    return {
      title: "Journey",
      description: "Explore our mountain journeys and treks.",
    };
  }
}
