import type { NextConfig } from "next";
import nextBundleAnalyzer from "@next/bundle-analyzer";
import env from "@/env";

// Safely parse the R2 hostname
let r2Hostname: string | undefined;
try {
  if (env.R2_PUBLIC_URL) {
    r2Hostname = new URL(env.R2_PUBLIC_URL).hostname;
  }
} catch (error) {
  console.error(
    "\x1b[33m%s\x1b[0m", // Yellow color for warning
    `Warning: Invalid R2_PUBLIC_URL found in environment variables. Skipping R2 remote pattern.`,
  );
  r2Hostname = undefined;
}

const remotePatterns = [
  {
    protocol: "https" as const,
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https" as const,
    hostname: "unsplash.com",
  },
];

if (r2Hostname) {
  remotePatterns.push({
    protocol: "https" as const,
    hostname: r2Hostname,
  });
}

const nextConfig: NextConfig = {
  experimental: {},
  images: {
    remotePatterns,
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
