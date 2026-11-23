import type { NextConfig } from 'next';

// Old static-site URLs keep working (and keep their search ranking) via permanent redirects.
const legacy: Record<string, string> = {
  '/index.html': '/',
  '/about.html': '/about',
  '/services.html': '/services',
  '/insights.html': '/insights',
  '/contact.html': '/contact',
  '/blog-strategy-before-spend.html': '/insights/strategy-before-spend',
  '/blog-revenue-engine.html': '/insights/revenue-engine',
  '/blog-social-media-intent.html': '/insights/social-media-with-intent',
  '/blog-performance-advertising.html': '/insights/performance-advertising',
  '/blog-website-growth-asset.html': '/insights/website-growth-asset',
  '/blog-leadership-alignment.html': '/insights/leadership-alignment',
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return Object.entries(legacy).map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: '/models/:file*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/media/:file*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
