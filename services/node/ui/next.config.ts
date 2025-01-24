import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "999",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
