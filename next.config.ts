import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization: serve WebP/AVIF formats automatically
  images: {
    formats: ["image/avif", "image/webp"],
    // Optimize images on-demand
    minimumCacheTTL: 60,
    // Allow SVGs from the public directory
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable compression (gzip/brotli) for responses
  compress: true,

  // Optimize package imports to reduce bundle size
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
