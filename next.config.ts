import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Export each route as a directory index for static hosting.
  trailingSlash: true,
 };

export default nextConfig;
