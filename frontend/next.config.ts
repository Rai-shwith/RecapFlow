import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages deployment configuration
  basePath: '',
  assetPrefix: '',
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during builds (optional)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
