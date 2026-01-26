import { Metadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import { generateJourneySEO, generateSEOMetadata, generateEnhancedOrganizationJSONLD } from "@/lib/seo-utils";
import { JourneyDetail } from "./journey-detail";

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
    return generateSEOMetadata(seoProps);
  } catch (error) {
    console.error("Error generating metadata for journey:", error);
    return {
      title: "Journey",
      description: "Explore our mountain journeys and treks.",
    };
  }
}

export default function JourneyPage() {
  return <JourneyDetail />;
}
