import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Add quality values to prevent warnings
    qualities: [60, 70, 75, 80, 90],
    // Add placeholder and blur data URL to prevent hydration issues
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable compression
  compress: true,
  // Production optimizations
  productionBrowserSourceMaps: false,
  // External packages for server components (updated key)
  serverExternalPackages: [],
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
  // Prevent hydration issues with external images
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
