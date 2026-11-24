import type { MetadataRoute } from 'next';
import { insights, services, site, work } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ['', '/work', '/services', '/about', '/insights', '/contact', '/privacy'];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: now, priority: p === '' ? 1 : 0.8 })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, lastModified: now, priority: 0.8 })),
    ...work.map((w) => ({ url: `${site.url}/work/${w.slug}`, lastModified: now, priority: 0.6 })),
    ...insights.map((i) => ({ url: `${site.url}/insights/${i.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
