import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages deployment configuration
  basePath: process.env.NODE_ENV === 'production' ? '/RecapFlow' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/RecapFlow/' : '',
};

export default nextConfig;
