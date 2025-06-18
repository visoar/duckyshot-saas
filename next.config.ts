import type { NextConfig } from "next";
import nextBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "r2-saas.ullrai.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
  },
};

// 只有在 process.env.ANALYZE 为 'true' 时才启用 bundle analyzer
if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
