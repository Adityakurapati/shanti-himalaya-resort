'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const SITE_URL = 'https://shantihimlaya.com';

  // Return null for home page
  if (pathname === '/') return null;

  // Build breadcrumb items with custom name mapping
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
  ];

  const pathSegments = pathname.split('/').filter(Boolean);

  // Map of segment to display names
  const segmentNames: Record<string, string> = {
    journeys: 'Journeys',
    destinations: 'Destinations',
    experiences: 'Experiences',
    'experiential-stays': 'Experiential Stays',
    blog: 'Blog',
    'our-resort': 'Our Resort',
    accommodations: 'Accommodations',
    activities: 'Activities',
    packages: 'Packages',
    'how-to-reach': 'How to Reach',
    'menu-meals': 'Menu & Meals',
    about: 'About Us',
    contact: 'Contact',
    'sustainable-tourism': 'Sustainable Tourism',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    cookies: 'Cookie Policy',
    admin: 'Admin',
  };

  // Build path items
  pathSegments.forEach((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const displayName = segmentNames[segment] || segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Only add non-ID segments (UUIDs and slugs are last items)
    const isIdSegment = index === pathSegments.length - 1 && 
      (segment.includes('-') && segment.length > 30 || /^[a-f0-9-]{36}$/.test(segment));

    if (!isIdSegment || index < pathSegments.length - 2) {
      breadcrumbItems.push({ name: displayName, href });
    }
  });

  // For detail pages, add the item name from last segment
  if (pathSegments.length > 1) {
    const lastSegment = pathSegments[pathSegments.length - 1];
    const isIdOrSlug = lastSegment.includes('-') || /^[a-f0-9-]{36}$/.test(lastSegment);

    if (isIdOrSlug) {
      const itemName = lastSegment
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbItems.push({
        name: itemName,
        href: pathname,
      });
    }
  }

  // Generate JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb"
        className="py-3 px-4 sm:px-0 border-b border-border/40 bg-background/50 backdrop-blur-sm"
      >
        <ol className="flex items-center space-x-1 text-sm text-muted-foreground flex-wrap">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <li key={`${item.href}-${index}`} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0 text-muted-foreground/50" />
                )}

                {index === 0 ? (
                  <Link
                    href={item.href}
                    className="p-1 hover:text-foreground transition-colors"
                    title="Home"
                    aria-label="Home"
                  >
                    <Home className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-2 py-1 rounded transition-colors ${
                      isLast
                        ? 'text-foreground font-medium bg-primary/5 cursor-text'
                        : 'hover:text-foreground hover:bg-muted/30'
                    }`}
                    aria-current={isLast ? 'page' : undefined}
                    title={item.name}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
