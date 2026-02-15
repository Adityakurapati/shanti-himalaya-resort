import type { Metadata } from "next";

const SITE_URL = "https://shantihimlaya.com";
const SITE_NAME = "Shanti Himalaya";

// Valid Open Graph types according to the Open Graph protocol
type ValidOpenGraphType = 
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";

// For Facebook's custom types, we'll use a different approach
type FacebookType = 
  | "place"
  | "product"
  | "product.item"
  | "hotel"
  | "restaurant";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  canonical?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  type?: ValidOpenGraphType; // Open Graph type (required)
  facebookType?: FacebookType; // Facebook-specific type (optional)
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateSEOMetadata(props: SEOProps): Metadata {
  const {
    title,
    description,
    image = "/images/og-default.jpg",
    url,
    canonical,
    keywords = [],
    author = "Shanti Himalaya",
    publishedTime,
    modifiedTime,
    type = "website",
    facebookType,
    section,
    tags,
    noindex = false,
    nofollow = false,
  } = props;

  const metadataTitle = `${title} | ${SITE_NAME}`;
  const metadataUrl = url || SITE_URL;
  const fullCanonical = canonical || `${SITE_URL}${url || ''}`;
  
  // Combine default keywords with provided ones
  const allKeywords = [
    "Shanti Himalaya",
    "Himalayan resort",
    "luxury resort India",
    "mountain retreat",
    "wilderness glamping",
    "Corbett National Park",
    "adventure travel",
    "wellness retreat",
    ...keywords
  ];

  // Prepare Open Graph object
  const openGraph: any = {
    title: metadataTitle,
    description,
    url: metadataUrl,
    siteName: SITE_NAME,
    locale: "en_US",
    type,
    images: [
      {
        url: image.startsWith('http') ? image : `${SITE_URL}${image}`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    publishedTime,
    modifiedTime,
  };

  // Add Facebook-specific properties if provided
  if (facebookType) {
    // Facebook uses custom properties for specific types
    openGraph[`${facebookType}`] = {
      // Add specific properties based on type
    };
    
  }

  return {
    title: metadataTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: author }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    
    // Open Graph
    openGraph,
    
    // Twitter
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description,
      images: [image.startsWith('http') ? image : `${SITE_URL}${image}`],
      creator: "@shantihimlaya",
      site: "@shantihimlaya",
    },
    
    // Additional metadata
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Canonical URL
    alternates: {
      canonical: fullCanonical,
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
      journey.seo_description || 
      journey.description ||
      `Join our ${journey.title} journey. ${journey.duration} of incredible trekking experiences in the Himalayas with Shanti Himalaya.`,
    image: journey.seo_image || journey.image_url || "/images/journeys-default.jpg",
    url: `${SITE_URL}/journeys/${journey.slug}`,
    type: "website", // Use "website" for journeys
    facebookType: "product", // Facebook sees it as a product
    keywords: [
      journey.title,
      "Himalayan trek",
      "mountain adventure",
      journey.difficulty,
      journey.best_time,
    ],
    author: "Shanti Himalaya Guides",
    publishedTime: journey.created_at,
    modifiedTime: journey.updated_at,
    tags: journey.categories || [],
  };
}

/**
 * Generate SEO metadata for a destination
 */
export function generateDestinationSEO(destination: any): SEOProps {
  return {
    title: destination.seo_title || destination.name,
    description:
      destination.seo_description ||
      destination.description ||
      `Visit ${destination.name} with Shanti Himalaya. Best time: ${destination.best_time}. ${destination.difficulty} difficulty. Perfect for ${destination.category} travelers.`,
    image: destination.seo_image || destination.image_url || "/images/destinations-default.jpg",
    url: `${SITE_URL}/destinations/${destination.slug}`,
    type: "website", // Changed from "place" to "website"
    facebookType: "place", // Facebook-specific type for places
    keywords: [
      destination.name,
      "Himalayan destination",
      destination.category,
      destination.best_time,
      destination.difficulty,
      "travel guide",
    ],
    author: "Shanti Himalaya Travel Experts",
    publishedTime: destination.created_at,
    modifiedTime: destination.updated_at,
    tags: destination.tags || [],
  };
}

/**
 * Generate SEO metadata for an experience
 */
export function generateExperienceSEO(experience: any): SEOProps {
  const slug = experience.slug || experience.title.toLowerCase().replace(/\s+/g, "-");
  
  return {
    title: experience.seo_title || experience.title,
    description:
      experience.seo_description ||
      experience.description ||
      `${experience.category} experience at Shanti Himalaya. ${experience.duration} duration. Perfect for ${experience.group_size} people.`,
    image: experience.seo_image || experience.image_url || "/images/experiences-default.jpg",
    url: `${SITE_URL}/experiences/${slug}`,
    type: "website", // Changed from "product" to "website"
    facebookType: "product", // Facebook-specific type
    keywords: [
      experience.title,
      "Himalayan experience",
      experience.category,
      "wellness",
      "adventure",
      "cultural immersion",
    ],
    author: "Shanti Himalaya Experience Team",
    publishedTime: experience.created_at,
    modifiedTime: experience.updated_at,
    tags: experience.categories || [],
  };
}

/**
 * Generate SEO metadata for an experiential stay
 */
export function generateStaySEO(stay: any): SEOProps {
  const slug = stay.slug || stay.name.toLowerCase().replace(/\s+/g, "-");
  
  return {
    title: stay.seo_title || stay.name,
    description:
      stay.seo_description ||
      stay.overview ||
      stay.description ||
      `Experience luxury wilderness glamping at ${stay.name}. ${stay.duration} stay with Shanti Himalaya near Corbett National Park.`,
    image: stay.seo_image || stay.featuredImage || "/images/stays-default.jpg",
    url: `${SITE_URL}/experiential-stays/${slug}`,
    type: "website", // Changed from "product" to "website"
    facebookType: "hotel", // Facebook-specific type for hotels
    keywords: [
      stay.name,
      "glamping",
      "wilderness stay",
      "luxury camping",
      "Corbett National Park",
      "mountain retreat",
    ],
    author: "Shanti Himalaya Hospitality",
    publishedTime: stay.created_at,
    modifiedTime: stay.updated_at,
    tags: stay.categories || [],
  };
}

/**
 * Generate SEO metadata for a blog post
 */
export function generateBlogSEO(blog: any): SEOProps {
  return {
    title: blog.seo_title || blog.title,
    description:
      blog.seo_description ||
      blog.excerpt ||
      blog.description ||
      `Read about ${blog.title} on Shanti Himalaya blog. Travel tips, guides, and Himalayan adventure stories.`,
    image: blog.seo_image || blog.image_url || "/images/blog-default.jpg",
    url: `${SITE_URL}/blog/${blog.slug}`,
    type: "article", // This is a valid Open Graph type for blog posts
    keywords: [
      ...(blog.tags || []),
      "Himalayan travel blog",
      "travel tips",
      "adventure guide",
      blog.category,
    ],
    author: blog.author || "Shanti Himalaya",
    publishedTime: blog.published_date,
    modifiedTime: blog.updated_at,
    section: blog.category,
    tags: blog.tags || [],
  };
}

/**
 * Generate SEO metadata for the home page
 */
export function generateHomeSEO(): SEOProps {
  return {
    title: "Luxury Himalayan Resort & Wilderness Glamping Experience",
    description: "Experience tranquility and luxury at Shanti Himalaya, a luxury resort & spa in the Himalayas near Corbett National Park. Wilderness glamping, epic journeys, and unique Himalayan experiences.",
    image: "/images/home-og.jpg",
    url: SITE_URL,
    type: "website",
    keywords: [
      "luxury Himalayan resort",
      "wilderness glamping",
      "Corbett National Park resort",
      "mountain spa retreat",
      "luxury camping India",
      "adventure travel India",
      "wellness retreat Himalayas",
    ],
  };
}

/**
 * Generate SEO metadata for about page
 */
export function generateAboutSEO(): SEOProps {
  return {
    title: "Our Story: Himalayan Hospitality Excellence",
    description: "Discover the story behind Shanti Himalaya. A decade of Himalayan exploration leading to our luxury wilderness resort near Corbett National Park.",
    image: "/images/about-og.jpg",
    url: `${SITE_URL}/about-us-team`,
    type: "website",
    keywords: [
      "Shanti Himalaya story",
      "Himalayan hospitality",
      "resort history",
      "founder story",
      "mountain expertise",
    ],
  };
}

/**
 * Generate structured data for JSON-LD
 */
export function generateJSONLD(data: any, type: "Journey" | "Destination" | "Experience" | "Stay" | "Blog" | "Organization") {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "",
    name: "",
    description: "",
    image: "",
    url: "",
  };

  switch (type) {
    case "Journey":
      return {
        ...baseData,
        "@type": "TouristAttraction",
        name: data.title,
        description: data.description,
        image: data.image_url,
        url: `${SITE_URL}/journeys/${data.slug}`,
        duration: data.duration,
        difficulty: data.difficulty,
        bestTime: data.best_time,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
        aggregateRating: data.rating ? {
          "@type": "AggregateRating",
          ratingValue: data.rating,
          reviewCount: data.review_count,
        } : undefined,
      };

    case "Destination":
      return {
        ...baseData,
        "@type": "Place",
        name: data.name,
        description: data.description,
        image: data.image_url,
        url: `${SITE_URL}/destinations/${data.slug}`,
        address: {
          "@type": "PostalAddress",
          addressCountry: "India",
          addressRegion: data.region,
        },
        containsPlace: data.category === "Region" ? {
          "@type": "Place",
          name: "Various attractions",
        } : undefined,
      };

    case "Experience":
      return {
        ...baseData,
        "@type": "Product",
        name: data.title,
        description: data.description,
        image: data.image_url,
        url: `${SITE_URL}/experiences/${data.slug || data.title.toLowerCase().replace(/\s+/g, "-")}`,
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
        offers: {
          "@type": "Offer",
          price: data.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
      };

    case "Stay":
      return {
        ...baseData,
        "@type": "LodgingBusiness",
        name: data.name,
        description: data.overview || data.description,
        image: data.featuredImage,
        url: `${SITE_URL}/experiential-stays/${data.slug}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: data.address,
          addressLocality: "Ramnagar",
          addressRegion: "Uttarakhand",
          addressCountry: "India",
          postalCode: "244715",
        },
        priceRange: "₹₹₹",
        numberOfRooms: 4, // Update with actual count
        amenityFeature: [
          "Glamping Tents",
          "Mountain Views",
          "Guided Activities",
          "All Meals Included",
        ],
      };

    case "Blog":
      return {
        ...baseData,
        "@type": "BlogPosting",
        name: data.title,
        description: data.excerpt || data.description,
        image: data.image_url,
        url: `${SITE_URL}/blog/${data.slug}`,
        author: {
          "@type": "Person",
          name: data.author,
        },
        datePublished: data.published_date,
        dateModified: data.updated_at,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/images/logo.png`,
          },
        },
        keywords: data.tags?.join(", "),
      };

    case "Organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.png`,
        sameAs: [
          "https://www.facebook.com/shantihimlaya", // Add your social media links
          "https://www.instagram.com/shantihimlaya",
          "https://twitter.com/shantihimlaya",
          "https://www.youtube.com/shantihimlaya",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-9010775073", // Add your phone
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      };
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbJSONLD(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQJSONLD(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate LocalBusiness structured data for the resort
 */
export function generateLocalBusinessJSONLD() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: "+91-XXXXXXXXXX",
    email: "shantihimalayas@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Near Corbett National Park",
      addressLocality: "Ramnagar",
      addressRegion: "Uttarakhand",
      postalCode: "244715",
      addressCountry: "IN",
    },
    priceRange: "₹₹₹",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    hasMap: "https://maps.google.com/?q=Shanti+Himalaya+Ramnagar",
    image: `${SITE_URL}/images/logo.png`,
    sameAs: [
      "https://www.facebook.com/shantihimlaya",
      "https://www.instagram.com/shantihimlaya",
      "https://twitter.com/shantihimlaya",
    ],
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "4.8",
        bestRating: "5",
      },
      author: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };
}

/**
 * Generate Product structured data for packages/experiences
 */
export function generateProductJSONLD(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name || product.title,
    description: product.description || product.overview,
    image: product.image_url || product.seo_image,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: product.price,
      highPrice: product.price,
      offerCount: 1,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: product.rating ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.review_count || 1,
      bestRating: "5",
      worstRating: "1",
    } : undefined,
  };
}

/**
 * Generate Event structured data for journeys with dates
 */
export function generateEventJSONLD(event: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.start_date || new Date().toISOString(),
    endDate: event.end_date || new Date().toISOString(),
    eventAttendanceMode: "OfflineEventAttendanceMode",
    eventStatus: "EventScheduled",
    location: {
      "@type": "Place",
      name: event.location || "Himalayan Region",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        addressRegion: "Uttarakhand",
      },
    },
    image: event.image_url,
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/journeys/${event.slug}`,
      price: event.price || "Contact for pricing",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
    },
  };
}

/**
 * Generate Travel Action structured data
 */
export function generateTravelActionJSONLD(travel: any) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAction",
    name: travel.title,
    description: travel.description,
    fromLocation: {
      "@type": "Place",
      name: travel.from_location || "Delhi",
    },
    toLocation: {
      "@type": "Place",
      name: travel.to_location || "Himalayan Region",
    },
    distance: travel.distance,
    duration: travel.duration,
    image: travel.image_url,
    startTime: travel.start_date,
    endTime: travel.end_date,
    agent: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

/**
 * Generate Video structured data
 */
export function generateVideoJSONLD(video: any) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail,
    uploadDate: video.uploadDate,
    duration: video.duration,
    videoQuality: "HD",
    contentUrl: video.videoUrl,
    embedUrl: video.embedUrl,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

/**
 * Generate Article structured data for blog posts
 */
export function generateArticleJSONLD(article: any) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${SITE_URL}/blog/${article.slug}`,
    headline: article.title,
    alternativeHeadline: article.seo_title,
    description: article.excerpt || article.description,
    image: {
      "@type": "ImageObject",
      url: article.image_url,
    },
    datePublished: article.published_date,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: article.author || SITE_NAME,
      url: article.author_url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntity: {
      "@type": "Article",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
    keywords: (article.tags || []).join(", "),
    articleBody: article.content,
  };
}

/**
 * Generate Organization schema with comprehensive details
 */
export function generateEnhancedOrganizationJSONLD() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/#logo`,
          width: 400,
          height: 200,
        },
        description: "Luxury Himalayan resort and wilderness glamping experience near Corbett National Park",
        sameAs: [
          "https://www.facebook.com/shantihimlaya",
          "https://www.instagram.com/shantihimlaya",
          "https://twitter.com/shantihimlaya",
          "https://www.youtube.com/shantihimlaya",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          telephone: "+91-XXXXXXXXXX",
          email: "shantihimalayas@gmail.com",
          areaServed: "IN",
          availableLanguage: ["en", "hi"],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Himalayan Adventures & Luxury Stays",
          itemListElement: [
            { "@type": "Offer", name: "Journeys & Treks" },
            { "@type": "Offer", name: "Destination Guides" },
            { "@type": "Offer", name: "Experiences" },
            { "@type": "Offer", name: "Experiential Stays" },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: "Luxury Himalayan resort & wilderness glamping",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          queryInput: "required name=search_term_string",
        },
      },
    ],
  };
}
