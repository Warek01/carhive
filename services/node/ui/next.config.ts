import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            hostname: 'i.simpalsmedia.com',
            protocol: 'https',
         },
      ],
   },
};

export default nextConfig;
