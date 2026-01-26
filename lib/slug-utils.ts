import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// In /lib/slug-utils.ts
import { redirect } from 'next/navigation';

/**
 * Check if a string is a UUID
 */
export function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Handle legacy UUID URLs by redirecting to slug-based URLs
 */
export async function handleLegacyUrl(id: string, type: 'journey' | 'destination' | 'experience' | 'stay' | 'blog') {
  if (!isUUID(id)) {
    return null; // Already a slug
  }
  
  try {
    let tableName: "journeys" | "destinations" | "experiences" | "experiential_stays" | "packages";
    if (type === 'blog') {
      tableName = 'packages';
    } else if (type === 'stay') {
      tableName = 'experiential_stays';
    } else if (type === 'journey') {
      tableName = 'journeys';
    } else if (type === 'destination') {
      tableName = 'destinations';
    } else if (type === 'experience') {
      tableName = 'experiences';
    } else {
      throw new Error(`Unknown type: ${type}`);
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .select('slug')
      .eq('id', id)
      .single();
    
    if (error || !data || !data.slug) {
      return null;
    }
    
    // Return the slug for redirection
    return data.slug;
  } catch (error) {
    console.error(`Error handling legacy ${type} URL:`, error);
    return null;
  }
}
/**
 * Generate a SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Fetch a journey by slug
 */
export async function getJourneyBySlug(
  slug: string
): Promise<Tables<"journeys"> | null> {
  try {
    const { data, error } = await supabase
      .from("journeys")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching journey by slug:", error);
    return null;
  }
}

/**
 * Fetch a destination by slug
 */
export async function getDestinationBySlug(
  slug: string
): Promise<Tables<"destinations"> | null> {
  try {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching destination by slug:", error);
    return null;
  }
}

/**
 * Fetch an experience by slug (generated from title)
 */
export async function getExperienceByTitle(
  slug: string
): Promise<Tables<"experiences"> | null> {
  try {
    // Since experiences don't have slug field, we'll search by title
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .ilike("title", `%${slug.replace(/-/g, " ")}%`)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching experience by title:", error);
    return null;
  }
}

/**
 * Fetch an experiential stay by slug (generated from name)
 */
export async function getExperientialStayByName(
  slug: string
): Promise<Tables<"experiential_stays"> | null> {
  try {
    // Since experiential_stays don't have slug field, we'll search by name
    const { data, error } = await supabase
      .from("experiential_stays")
      .select("*")
      .ilike("name", `%${slug.replace(/-/g, " ")}%`)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching experiential stay by name:", error);
    return null;
  }
}

/**
 * Create a slug from an item's name/title
 */
export function createSlugFromName(name: string | null): string {
  if (!name) return "";
  return generateSlug(name);
}
