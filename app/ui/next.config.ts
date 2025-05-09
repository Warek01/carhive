import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            hostname: 'i.simpalsmedia.com',
            protocol: 'https',
         },
         {
            hostname: 'daac-hermes.md',
            protocol: 'https',
         },
         {
            hostname: 'localhost',
         },
      ],
   },
   basePath: '',
   logging: {
      fetches: {
         fullUrl: true,
         hmrRefreshes: false,
      },
   },
};

export default nextConfig;
