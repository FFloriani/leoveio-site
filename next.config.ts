import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['static-cdn.jtvnw.net', 'twitch.tv', 'www.twitch.tv'],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://*.twitch.tv https://twitch.tv https://www.twitch.tv https://player.twitch.tv; frame-ancestors 'self' https://*.twitch.tv;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
