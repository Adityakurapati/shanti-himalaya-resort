import { Metadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import { generateBlogSEO, generateSEOMetadata } from "@/lib/seo-utils";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data: blog, error } = await supabase
      .from("packages")
      .select("*")
      .eq("slug", params.id)
      .eq("type", "blog")
      .maybeSingle();

    if (error || !blog) {
      return {
        title: "Blog Post Not Found",
        description: "The blog post you are looking for does not exist.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const seoProps = generateBlogSEO(blog);
    return generateSEOMetadata(seoProps);
  } catch (error) {
    console.error("Error generating metadata for blog:", error);
    return {
      title: "Blog",
      description: "Read travel tips and stories from Shanti Himalaya.",
    };
  }
}
