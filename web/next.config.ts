import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icon-v2.png",
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
