import { Metadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import { generateExperienceSEO, generateSEOMetadata } from "@/lib/seo-utils";

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
    return generateSEOMetadata(seoProps);
  } catch (error) {
    console.error("Error generating metadata for experience:", error);
    return {
      title: "Experience",
      description: "Discover unique experiences at Shanti Himalaya.",
    };
  }
}
