import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['static-cdn.jtvnw.net', 'twitch.tv', 'www.twitch.tv', 'player.twitch.tv'],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Otimizações básicas para reduzir o tamanho das funções
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://*.twitch.tv https://twitch.tv https://www.twitch.tv https://player.twitch.tv https://embed.twitch.tv; frame-ancestors 'self' https://*.twitch.tv; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://player.twitch.tv https://embed.twitch.tv;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
