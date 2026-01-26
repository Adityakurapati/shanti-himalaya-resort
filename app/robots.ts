import type { MetadataRoute } from 'next'

/**
 * Robots.txt configuration for Shanti Himalaya
 * Controls search engine crawling behavior and directives
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://shantihimlaya.com'
  
  return {
    rules: [
      // ============================================
      // DEFAULT RULES FOR ALL BOTS
      // ============================================
      {
        userAgent: '*',
        // Allow main public content
        allow: [
          '/',
          '/journeys/',
          '/journeys/$',
          '/destinations/',
          '/destinations/$',
          '/experiences/',
          '/experiences/$',
          '/experiential-stays/',
          '/experiential-stays/$',
          '/our-resort/',
          '/our-resort/accommodations',
          '/our-resort/activities',
          '/our-resort/packages',
          '/our-resort/menu-meals',
          '/our-resort/how-to-reach',
          '/blog/',
          '/blog/$',
          '/about/',
          '/contact/',
          '/sustainable-tourism/',
          '/public/',
          '/images/',
          '_next/static/',
          'favicon.ico',
          'sitemap.xml',
          'robots.txt',
        ],
        // Disallow private and admin areas
        disallow: [
          '/admin/',
          '/api/',
          '/api/',
          '/private/',
          '/dashboard/',
          '/user-profile/',
          '/settings/',
          '/checkout/',
          '/cart/',
          '/*?*checkout',
          '/*?*sort=',
          '/*?*filter=',
          '/*?*page=',
          '/*?*utm_',
          '/*?*fbclid=',
          '/*?*gclid=',
          '/*.json$',
          '/*.xml$',
          '*.pdf$',
          '/.next/',
          '/.vercel/',
          '/node_modules/',
          '/src/',
          '/scripts/',
          '/_next/server/',
          '*?param1=value',
        ],
        // Crawl rate for all bots
        crawlDelay: 0, // 0 = no delay (maximum crawl rate)
      },
      
      // ============================================
      // GOOGLE SPECIFIC OPTIMIZATION
      // ============================================
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/journeys/',
          '/destinations/',
          '/experiences/',
          '/experiential-stays/',
          '/our-resort/',
          '/blog/',
          '/about/',
          '/contact/',
          '/sustainable-tourism/',
          '_next/static/',
          'sitemap.xml',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/dashboard/',
          '/*.json$',
        ],
        crawlDelay: 0, // Allow aggressive crawling
      },

      // ============================================
      // BING SPECIFIC OPTIMIZATION
      // ============================================
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/dashboard/',
        ],
        crawlDelay: 1,
      },

      // ============================================
      // BLOCK BAD & AGGRESSIVE BOTS
      // ============================================
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'YandexBot',
          'AiHitBot',
          'Qwantify',
          'Applebot-Extended',
          'PetalBot',
          'ChatGPT-User',
          'GPTBot',
          'CCBot',
          'anthropic-ai',
          'ClaudeBot',
          'Claude-Web',
          'bard-web-crawl',
          'AwarioRssBot',
          'AwarioSmartBot',
          'Exabot',
        ],
        disallow: '/',
      },

      // ============================================
      // ALLOW SPECIFIC GOOD BOTS
      // ============================================
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Googlebot-Mobile',
          'Bingbot',
          'Slurp',
          'DuckDuckBot',
          'baiduspider',
          'yandex',
          'FacebookExternalHit',
          'Twitterbot',
          'LinkedInBot',
          'WhatsApp',
          'Slotovod',
          'Mediapartners-Google',
        ],
        allow: '/',
      },
    ],

    // ============================================
    // SITEMAPS
    // ============================================
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-journeys.xml`,
      `${baseUrl}/sitemap-destinations.xml`,
      `${baseUrl}/sitemap-experiences.xml`,
      `${baseUrl}/sitemap-stays.xml`,
      `${baseUrl}/sitemap-blog.xml`,
    ],

    // ============================================
    // CRAWL SETTINGS
    // ============================================
    host: baseUrl,

    // Clean parameters (remove tracking parameters from crawl)
    // Note: Not directly supported by MetadataRoute.Robots in Next.js,
    // but documented here for reference. Implement via robots-meta-tag.ts if needed
  }
}
