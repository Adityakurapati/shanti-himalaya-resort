import { MetadataRoute } from 'next';
import { supabase } from '@/integrations/supabase/client';

/**
 * Sitemap generation for SEO
 * - Generates XML sitemap with all content
 * - Updates dynamically from database
 * - Prioritizes main content
 * - Respects 50,000 URL limit per sitemap
 */

const SITE_URL = 'https://shantihimlaya.com';
const URLS_LIMIT = 50000; // Google sitemap spec limit

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Core static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/our-resort`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/our-resort/accommodations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/our-resort/how-to-reach`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/our-resort/menu-meals`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/journeys`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/experiences`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/experiential-stays`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/sustainable-tourism`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Fetch dynamic pages from database with error handling
    const [journeysRes, destinationsRes, experiencesRes, staysRes, blogRes, activitiesRes, packagesRes] = 
      await Promise.allSettled([
        supabase.from('journeys').select('slug, updated_at').eq('is_active', true),
        supabase.from('destinations').select('slug, updated_at').eq('is_active', true),
        supabase.from('experiences').select('slug, updated_at').eq('is_active', true),
        supabase.from('experiential_stays').select('slug, updated_at').eq('is_active', true),
        supabase.from('packages').select('slug, updated_at').eq('published_date', true),
        supabase.from('resort_activities').select('slug, updated_at'),
        supabase.from('resort_packages').select('slug, updated_at'),
      ]);

    const dynamicPages: MetadataRoute.Sitemap = [];

    // Process journeys
    if (journeysRes.status === 'fulfilled' && journeysRes.value.data) {
      dynamicPages.push(
        ...journeysRes.value.data.map(journey => ({
          url: `${SITE_URL}/journeys/${journey.slug}`,
          lastModified: journey.updated_at ? new Date(journey.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.85,
        }))
      );
    }

    // Process destinations
    if (destinationsRes.status === 'fulfilled' && destinationsRes.value.data) {
      dynamicPages.push(
        ...destinationsRes.value.data.map(destination => ({
          url: `${SITE_URL}/destinations/${destination.slug}`,
          lastModified: destination.updated_at ? new Date(destination.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.85,
        }))
      );
    }

    // Process experiences
    if (experiencesRes.status === 'fulfilled' && experiencesRes.value.data) {
      dynamicPages.push(
        ...experiencesRes.value.data.map(experience => ({
          url: `${SITE_URL}/experiences/${experience.slug}`,
          lastModified: experience.updated_at ? new Date(experience.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }))
      );
    }

    // Process experiential stays
    if (staysRes.status === 'fulfilled' && staysRes.value.data) {
      dynamicPages.push(
        ...staysRes.value.data.map(stay => ({
          url: `${SITE_URL}/experiential-stays/${stay.slug}`,
          lastModified: stay.updated_at ? new Date(stay.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }))
      );
    }

    // Process blog posts
    if (blogRes.status === 'fulfilled' && blogRes.value.data) {
      dynamicPages.push(
        ...blogRes.value.data.map(post => ({
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        }))
      );
    }

    // Process resort activities
    if (activitiesRes.status === 'fulfilled' && activitiesRes.value.data) {
      dynamicPages.push(
        ...activitiesRes.value.data.map(activity => ({
          url: `${SITE_URL}/our-resort/activities/${activity.slug}`,
          lastModified: activity.updated_at ? new Date(activity.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.75,
        }))
      );
    }

    // Process resort packages
    if (packagesRes.status === 'fulfilled' && packagesRes.value.data) {
      dynamicPages.push(
        ...packagesRes.value.data.map(pkg => ({
          url: `${SITE_URL}/our-resort/packages/${pkg.slug}`,
          lastModified: pkg.updated_at ? new Date(pkg.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }))
      );
    }

    // Combine and return all pages (max 50,000 URLs per sitemap spec)
    const allPages = [...staticPages, ...dynamicPages];
    const totalPages = allPages.length;
    
    // Log statistics
    console.log('[Sitemap] Generated with', totalPages, 'URLs', {
      static: staticPages.length,
      dynamic: dynamicPages.length,
    });

    if (totalPages > URLS_LIMIT) {
      console.warn(`[Sitemap] Truncated from ${totalPages} to ${URLS_LIMIT} URLs (Google limit)`);
    }

    return allPages.slice(0, URLS_LIMIT);
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    console.log('[Sitemap] Falling back to static pages only');
    // Return at least the static pages if there's an error
    return staticPages;
  }
}
