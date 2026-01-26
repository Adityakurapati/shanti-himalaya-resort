import { Metadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import { generateDestinationSEO, generateSEOMetadata } from "@/lib/seo-utils";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data: destination, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("slug", params.id)
      .maybeSingle();

    if (error || !destination) {
      return {
        title: "Destination Not Found",
        description: "The destination you are looking for does not exist.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const seoProps = generateDestinationSEO(destination);
    return generateSEOMetadata(seoProps);
  } catch (error) {
    console.error("Error generating metadata for destination:", error);
    return {
      title: "Destination",
      description: "Explore amazing destinations in the Himalayas.",
    };
  }
}
