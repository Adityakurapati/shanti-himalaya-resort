'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
  ];

  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(Boolean);
  
  pathSegments.forEach((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbItems.push({ name, href });
  });

  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://shantihimlaya.com${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className="py-4 border-b">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index === 0 ? (
                <Home className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4 mx-2" />
              )}
              <Link
                href={item.href}
                className={`hover:text-foreground transition-colors ${
                  index === breadcrumbItems.length - 1 ? 'text-foreground font-medium' : ''
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
