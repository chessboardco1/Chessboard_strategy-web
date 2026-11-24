import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Directory indexes keep the page files separate from the legacy .html redirects.
  trailingSlash: true,
 };

export default nextConfig;
