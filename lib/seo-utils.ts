import type { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function generateSEOMetadata(props: SEOProps): Metadata {
  const { title, description, image, url } = props;

  return {
    title: `${title} | Shanti Himalaya Resort`,
    description,
    keywords: [
      "Shanti Himalaya",
      "Nepal",
      "Resort",
      "Himalayan",
      title,
      description.split(" ").slice(0, 5).join(","),
    ],
    openGraph: {
      title: `${title} | Shanti Himalaya Resort`,
      description,
      images: image ? [{ url: image }] : [],
      url: url || "https://shanti-himalaya-resort.vercel.app",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Shanti Himalaya Resort`,
      description,
      images: image ? [image] : [],
    },
  };
}

/**
 * Generate SEO metadata for a journey
 */
export function generateJourneySEO(journey: any): SEOProps {
  return {
    title: journey.title,
    description:
      journey.description ||
      `Discover the ${journey.title} journey. ${journey.duration} of incredible trekking experiences in Nepal's Himalayas.`,
    image: journey.image_url,
    url: `https://shanti-himalaya-resort.vercel.app/journeys/${journey.slug}`,
  };
}

/**
 * Generate SEO metadata for a destination
 */
export function generateDestinationSEO(destination: any): SEOProps {
  return {
    title: destination.name,
    description:
      destination.description ||
      `Explore ${destination.name} in Nepal. Best time to visit: ${destination.best_time}. ${destination.difficulty} difficulty.`,
    image: destination.image_url,
    url: `https://shanti-himalaya-resort.vercel.app/destinations/${destination.slug}`,
  };
}

/**
 * Generate SEO metadata for an experience
 */
export function generateExperienceSEO(experience: any): SEOProps {
  return {
    title: experience.title,
    description:
      experience.description ||
      `${experience.category} experience in Nepal. ${experience.duration} duration. From ${experience.price}.`,
    image: experience.image_url,
    url: `https://shanti-himalaya-resort.vercel.app/experiences/${experience.title
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
  };
}

/**
 * Generate structured data for JSON-LD
 */
export function generateJSONLD(data: any, type: "Journey" | "Destination" | "Experience") {
  const baseURL = "https://shanti-himalaya-resort.vercel.app";

  if (type === "Journey") {
    return {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      name: data.title,
      description: data.description,
      image: data.image_url,
      url: `${baseURL}/journeys/${data.slug}`,
      duration: data.duration,
      difficulty: data.difficulty,
      bestTime: data.best_time,
    };
  }

  if (type === "Destination") {
    return {
      "@context": "https://schema.org",
      "@type": "Place",
      name: data.name,
      description: data.description,
      image: data.image_url,
      url: `${baseURL}/destinations/${data.slug}`,
      location: {
        "@type": "Place",
        name: data.category,
      },
      bestTime: data.best_time,
      difficulty: data.difficulty,
    };
  }

  if (type === "Experience") {
    return {
      "@context": "https://schema.org",
      "@type": "Experience",
      name: data.title,
      description: data.description,
      image: data.image_url,
      url: `${baseURL}/experiences/${data.title.toLowerCase().replace(/\s+/g, "-")}`,
      duration: data.duration,
      groupSize: data.group_size,
      price: data.price,
      category: data.category,
    };
  }
}
