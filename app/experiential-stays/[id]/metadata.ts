import { Metadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import { 
  generateStaySEO, 
  generateSEOMetadata, 
  generateJSONLD,
  generateBreadcrumbJSONLD 
} from "@/lib/seo-utils";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data: stay, error } = await supabase
      .from("experiential_stays")
      .select("*")
      .eq("slug", params.id)
      .maybeSingle();

    if (error || !stay) {
      return {
        title: "Stay Not Found",
        description: "The stay you are looking for does not exist.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const seoProps = generateStaySEO(stay);
    const metadata = generateSEOMetadata(seoProps);

    // Add structured data via metadata
    const stayJSONLD = generateJSONLD(stay, 'Stay');
    const breadcrumbJSONLD = generateBreadcrumbJSONLD([
      { name: 'Home', url: '/' },
      { name: 'Experiential Stays', url: '/experiential-stays' },
      { name: stay.name, url: `/experiential-stays/${stay.slug}` }
    ]);

    return {
      ...metadata,
      other: {
        'structured-data': JSON.stringify(stayJSONLD),
        'breadcrumb-data': JSON.stringify(breadcrumbJSONLD),
      }
    };
  } catch (error) {
    console.error("Error generating metadata for stay:", error);
    return {
      title: "Experiential Stay",
      description: "Experience luxury and comfort at Shanti Himalaya.",
    };
  }
}
