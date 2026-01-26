import { generateJSONLD } from "@/lib/seo-utils";

interface StructuredDataProps {
  data: any;
  type: "Journey" | "Destination" | "Experience" | "Stay" | "Blog" | "Organization";
}

export function StructuredData({ data, type }: StructuredDataProps) {
  const jsonLd = generateJSONLD(data, type);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}