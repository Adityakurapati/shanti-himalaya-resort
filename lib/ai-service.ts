import { GoogleGenAI } from "@google/genai";

export interface AIRequestPayload {
  title: string;
  contentType:
    | "journey"
    | "experience"
    | "package"
    | "mealPlan"
    | "resortActivity"
    | "resortPackage"
    | "blogPost"
    | "destination"
    | "place"
    | "activity"
    | "itinerary"
    | "faq"
    | "travelInfo"
    | "season"
    | "accommodation"
    | "travelTips";
  existingData?: Record<string, any>;
  context?: Record<string, any>; // Add context property
}

export interface AIResponse {
  content: Record<string, any>;
  suggestions: string[];
}

export class AIContentService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey =
      process.env.GEMINI_API_KEY || "AIzaSyDvLlmHAXvm3Gu0fV5_RNogslmadVZQLFs";

    if (!apiKey || apiKey === "your-fallback-api-key-here") {
      console.warn("Gemini API key is not set. AI features will not work.");
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateContent(payload: AIRequestPayload): Promise<AIResponse> {
    try {
      if (
        !process.env.NEXT_PUBLIC_GEMINI_API_KEY &&
        !process.env.GEMINI_API_KEY
      ) {
        throw new Error(
          "API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment."
        );
      }

      const prompt = this.buildPrompt(payload);

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const generatedText = response.text;

      if (!generatedText) {
        throw new Error("No content generated");
      }

      return this.parseAIResponse(generatedText, payload.contentType);
    } catch (error) {
      console.error("AI Content Generation Error:", error);
      throw error;
    }
  }

  private buildPrompt(payload: AIRequestPayload): string {
    const { title, contentType, existingData, context } = payload; // Destructure context

    const contentTypePrompts = {
      journey: `Generate content for a travel journey titled "${title}". Provide:
      1. A compelling description (2-3 sentences)
      2. Suggested duration (e.g., "7 Days")
      3. Difficulty level (e.g., "Moderate", "Challenging")
      4. Activities (comma-separated list)
      5. Category (choose from: Trekking, Wildlife, Culture, Adventure, Pilgrimage, Nature)
      6. Featured image description for DALL-E
      
      Format as JSON: {
        "description": "string",
        "duration": "string",
        "difficulty": "string",
        "activities": "comma, separated, list",
        "category": "string",
        "image_prompt": "string"
      }`,

      experience: `Generate content for a travel experience titled "${title}". Provide:
1. A compelling description (2-3 sentences)
2. Duration (e.g., "Half Day", "Full Day")
3. Group size (e.g., "2-8 people", "Private")
4. Price range (e.g., "₹2,500 per person")
5. Highlights (comma-separated list, 3-5 items)
6. Category (choose from: Trekking, Wildlife, Culture, Adventure, Pilgrimage, Nature)
7. Featured image description for DALL-E
8. Publicly accessible image URL that represents this experience (use Unsplash or other free image source)

Format as JSON: {
  "description": "string",
  "duration": "string",
  "group_size": "string",
  "price": "string",
  "highlights": "comma, separated, list",
  "category": "string",
  "image_prompt": "string",
  "image_url": "string (publicly accessible URL, e.g., Unsplash source)"
}`,

      blog: `Generate content for a travel package blog post titled "${title}". Provide:
      1. Excerpt (1-2 sentences)
      2. Full content (3-4 paragraphs)
      3. Category (e.g., "Adventure", "Luxury", "Budget")
      4. Author name
      5. Author bio (1 sentence)
      6. Tags (comma-separated, 3-5 tags)
      7. Read time (e.g., "5 min read")
      8. Featured image description for DALL-E
      
      Format as JSON: {
        "excerpt": "string",
        "content": "string",
        "category": "string",
        "author": "string",
        "author_bio": "string",
        "tags": "comma, separated, tags",
        "read_time": "string",
        "image_prompt": "string"
      }`,

      resortActivity: `Generate content for a resort activity titled "${title}". Provide:
      1. Short description (1 sentence)
      2. Full detailed description (2-3 paragraphs)
      3. Icon name (choose from: Mountain, Tent, Trees, MapPin, Compass, Route, Camera, Coffee, Utensils, Bike, Binoculars, Sailboat, Sun, Star)
      4. Activity image description
      
      Format as JSON: {
        "description": "string",
        "full_description": "string",
        "icon": "string",
        "image_prompt": "string"
      }`,

      resortPackage: `Generate content for a resort package titled "${title}". Provide:
      1. Duration (e.g., "2 Days / 1 Night")
      2. Price (e.g., "₹8,999")
      3. Original price (e.g., "₹12,999")
      4. Description (2-3 sentences)
      5. Includes list (newline separated, 5-7 items)
      6. Features list (newline separated, 3-5 items)
      7. Badge (e.g., "Popular", "Exclusive", "Festival Special")
      8. Package image description
      
      Format as JSON: {
        "duration": "string",
        "price": "string",
        "original_price": "string",
        "description": "string",
        "includes": "newline\\nseparated\\nitems",
        "features": "newline\\nseparated\\nitems",
        "badge": "string",
        "image_prompt": "string"
      }`,

      mealPlan: `Generate content for a food dish or meal item titled "${title}". This is for a restaurant/hotel menu system where items can be served at breakfast, lunch, or dinner.

Provide:
1. Dish description (1-2 sentences)
2. Suggested price in Indian Rupees (₹)
3. Category (choose from: main, starter, dessert, beverage, snack)
4. Suggested spice level (mild, medium, spicy, very_spicy)
5. Whether it's typically vegetarian (true/false)
6. Suggested meal times where this dish is commonly served (choose any combination: breakfast, lunch, dinner)

Format as JSON: {
  "description": "string",
  "price": "string",
  "category": "string",
  "spice_level": "string",
  "is_vegetarian": boolean,
  "meal_times": ["breakfast", "lunch", "dinner"]
}`,

      destination: `Generate comprehensive travel destination information for "${title}" in Nepal/Himalayan region. 
      
      Provide:
      1. Short description (2-3 sentences)
      2. Suggested duration (e.g., "5-7 days")
      3. Difficulty level (Easy/Moderate/Challenging)
      4. Best time to visit (seasons/months)
      5. Approximate altitude (if applicable)
      6. Category (Trekking/Wildlife/Culture/Adventure/Pilgrimage/Nature)
      7. Key highlights (3-5 comma-separated attractions)
      8. Overview (3-4 paragraph detailed description)
      
      Format as JSON: {
        "description": "string",
        "duration": "string",
        "difficulty": "string",
        "best_time": "string",
        "altitude": "string",
        "category": "string",
        "highlights": "string",
        "overview": "string"
      }`,

      place: `Generate information for a place to visit at "${title}" destination in Nepal/Himalayan region.
      
      Provide:
      1. Place name
      2. Description (2-3 sentences)
      3. 2-3 key highlights
      
      Format as JSON: {
        "name": "string",
        "description": "string",
        "highlights": ["highlight1", "highlight2", "highlight3"]
      }`,

      activity: `Generate activity information for "${title}" destination in Nepal/Himalayan region.
      
      Provide:
      1. Activity title (start with number like "1. Activity Name")
      2. Description (2-3 sentences)
      
      Format as JSON: {
        "title": "string",
        "description": "string"
      }`,

      itinerary: `Generate itinerary for ${context?.duration || "5-7 day"} trip to "${title}" in Nepal/Himalayan region.
      
      For each day provide:
      1. Day number
      2. Day title/theme
      3. 4-5 activities for the day
      
      Format as JSON array: [
        {
          "day": 1,
          "title": "Day 1 title",
          "activities": ["Activity 1", "Activity 2", "Activity 3"]
        }
      ]`,

      faq: `Generate frequently asked questions (FAQs) about visiting "${title}" in Nepal/Himalayan region.
      
      Provide both question and detailed answer for 5-8 common questions.
      
      Format as JSON array: [
        {
          "question": "What is the best time to visit?",
          "answer": "The best time is from March to May..."
        }
      ]`,

      travelInfo: `Generate ${context?.type || "air"} travel information for reaching "${title}" in Nepal/Himalayan region.
      
      Provide 3-4 practical details about ${context?.type || "air"} travel.
      
      Format as JSON: {
        "details": ["detail1", "detail2", "detail3"]
      }`,

      season: `Generate information about visiting "${title}" in Nepal/Himalayan region during ${context?.season || "winter"} season.
      
      Provide:
      1. Season dates
      2. Weather conditions
      3. Why visit during this season
      4. Special events/festivals
      5. Challenges/considerations
      
      Format as JSON: {
        "season": "string",
        "weather": "string",
        "why_visit": "string",
        "events": "string",
        "challenges": "string"
      }`,

      accommodation: `Generate ${context?.type || "budget"} accommodation information for "${title}" in Nepal/Himalayan region.
      
      Provide:
      1. Description of what to expect
      2. 3-5 accommodation options/suggestions
      
      Format as JSON: {
        "description": "string",
        "options": ["option1", "option2", "option3"]
      }`,

      travelTips: `Generate 8-10 useful travel tips for visiting "${title}" in Nepal/Himalayan region.
      Tips should cover packing, health, safety, cultural etiquette, and practical advice.
      
      Format as JSON: {
        "tips": ["tip1", "tip2", "tip3"]
      }`,
    };

    return contentTypePrompts[contentType] || contentTypePrompts.journey;
  }

  private parseAIResponse(text: string, contentType: string): AIResponse {
    try {
      // Clean the text - remove markdown code blocks if present
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7, -3).trim();
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3, -3).trim();
      }

      // Extract JSON from the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/) || cleanedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        content: parsed,
        suggestions: [],
      };
    } catch (error) {
      console.error("Failed to parse AI response:", error, "Text:", text);
      return this.getFallbackContent(contentType);
    }
  }

  private getFallbackContent(contentType: string): AIResponse {
    const fallbacks = {
      journey: {
        description:
          "An exciting journey through breathtaking landscapes and cultural experiences.",
        duration: "7 Days",
        difficulty: "Moderate",
        activities: "Trekking, Photography, Cultural Visits",
        category: "Adventure",
        image_prompt: "Beautiful mountain landscape with travelers hiking",
      },
      experience: {
        description:
          "An unforgettable experience that combines adventure with local culture.",
        duration: "Full Day",
        group_size: "4-12 people",
        price: "₹3,500 per person",
        highlights: "Expert guide, Local cuisine, Photography spots",
        category: "Culture",
        image_prompt: "Group of travelers enjoying a cultural experience",
      },
      package: {
        excerpt: "Discover the perfect travel package for your next adventure.",
        content:
          "This comprehensive package includes everything you need for an unforgettable journey. From accommodation to guided tours, we've got you covered. Experience the best destinations with our carefully curated itineraries.",
        category: "Adventure",
        author: "Travel Expert",
        author_bio: "Seasoned traveler with 10+ years of experience",
        tags: "Travel, Adventure, Package",
        read_time: "5 min read",
        image_prompt:
          "Travel package brochure with beautiful destination photos",
      },
      resortActivity: {
        description: "Enjoy a relaxing activity at our resort.",
        full_description:
          "This activity offers a perfect way to unwind and enjoy your stay. Our experienced staff will ensure you have a memorable experience. Suitable for all ages and skill levels.",
        icon: "Mountain",
        image_prompt: "Resort activity in a beautiful natural setting",
      },
      resortPackage: {
        duration: "2 Days / 1 Night",
        price: "₹8,999",
        original_price: "₹12,999",
        description: "A perfect getaway package with all amenities included.",
        includes:
          "Accommodation\nAll meals\nGuided activities\nTransportation\nWelcome drink",
        features:
          "Luxury accommodation\nGourmet dining\nSpa access\nAdventure activities",
        badge: "Popular",
        image_prompt: "Luxury resort package presentation",
      },
      mealPlan: {
        description:
          "A carefully curated meal plan featuring local and international cuisine.",
        meal_count: "3 Meals per day",
        dietary_focus: "Local Cuisine",
        price: "₹1,500 per day",
        benefits: "Fresh ingredients, Local flavors, Healthy options",
      },
      blogPost: {
        excerpt: "Explore the wonders of travel through our latest blog post.",
        content:
          "Travel opens up new perspectives and creates lifelong memories. In this post, we share insights and tips for making the most of your journeys. Whether you're a seasoned traveler or planning your first trip, you'll find valuable information here.",
        category: "Travel Tips",
        author: "Travel Blogger",
        author_bio: "Passionate about sharing travel experiences and tips",
        tags: "Travel, Tips, Adventure",
        read_time: "4 min read",
        image_prompt: "Blog post header with travel-themed imagery",
      },
      destination: {
        description: "A beautiful destination in the Himalayan region offering breathtaking views and cultural experiences.",
        duration: "5-7 days",
        difficulty: "Moderate",
        best_time: "March to May, September to November",
        altitude: "2,000-4,000 meters",
        category: "Adventure",
        highlights: "Mountain views, Local culture, Trekking routes",
        overview: "This destination offers a perfect blend of natural beauty and cultural richness. Nestled in the majestic Himalayas, it provides visitors with unforgettable experiences ranging from challenging treks to serene cultural explorations. The region is known for its warm hospitality and diverse landscapes that cater to all types of travelers."
      },
      place: {
        name: "Scenic Viewpoint",
        description: "A beautiful viewpoint offering panoramic views of the surrounding mountains.",
        highlights: ["Panoramic views", "Great for photography", "Accessible location"]
      },
      activity: {
        title: "1. Mountain Trekking",
        description: "Experience the thrill of trekking through beautiful mountain trails with expert guides."
      },
      itinerary: [
        {
          day: 1,
          title: "Arrival and Acclimatization",
          activities: ["Arrive at destination", "Check into accommodation", "Light walk around town", "Evening cultural show"]
        }
      ],
      faq: [
        {
          question: "What is the best time to visit?",
          answer: "The best time to visit is during the spring (March to May) and autumn (September to November) seasons when the weather is pleasant and skies are clear."
        }
      ],
      travelInfo: {
        details: ["Nearest airport: Tribhuvan International Airport", "Flight duration: 30-45 minutes from Kathmandu", "Best to book tickets in advance"]
      },
      season: {
        season: "Winter (December-February)",
        weather: "Cold with occasional snowfall",
        why_visit: "Fewer crowds, beautiful snow-capped mountains",
        events: "Christmas, New Year celebrations",
        challenges: "Cold temperatures, possible road closures"
      },
      accommodation: {
        description: "Comfortable lodging options suitable for budget travelers",
        options: ["Local guesthouses", "Budget hotels", "Homestays"]
      },
      travelTips: {
        tips: ["Pack warm clothing", "Stay hydrated", "Respect local customs", "Carry necessary permits"]
      }
    };

    const fallback = fallbacks[contentType as keyof typeof fallbacks] || {};

    return {
      content: fallback,
      suggestions: ["AI generation failed, using fallback content"],
    };
  }
}

// Singleton instance
export const aiContentService = new AIContentService();