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
      {
        source: "/selected-work",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/connect",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/creator-work",
        destination: "/social",
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
