import { Metadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import { 
  generateExperienceSEO, 
  generateSEOMetadata, 
  generateJSONLD,
  generateBreadcrumbJSONLD 
} from "@/lib/seo-utils";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data: experience, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("slug", params.id)
      .maybeSingle();

    if (error || !experience) {
      return {
        title: "Experience Not Found",
        description: "The experience you are looking for does not exist.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const seoProps = generateExperienceSEO(experience);
    const metadata = generateSEOMetadata(seoProps);

    // Add structured data via metadata
    const experienceJSONLD = generateJSONLD(experience, 'Experience');
    const breadcrumbJSONLD = generateBreadcrumbJSONLD([
      { name: 'Home', url: '/' },
      { name: 'Experiences', url: '/experiences' },
      { name: experience.title, url: `/experiences/${experience.slug}` }
    ]);

    return {
      ...metadata,
      other: {
        'structured-data': JSON.stringify(experienceJSONLD),
        'breadcrumb-data': JSON.stringify(breadcrumbJSONLD),
      }
    };
  } catch (error) {
    console.error("Error generating metadata for experience:", error);
    return {
      title: "Experience",
      description: "Discover unique experiences at Shanti Himalaya.",
    };
  }
}
