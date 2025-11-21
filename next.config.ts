import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: '**.youtube.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
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
            value: "frame-src 'self' https://*.twitch.tv https://twitch.tv https://www.twitch.tv https://player.twitch.tv https://embed.twitch.tv https://*.youtube.com https://youtube.com; frame-ancestors 'self' https://*.twitch.tv https://*.youtube.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://player.twitch.tv https://embed.twitch.tv;",
          },
        ],
      },
      {
        source: '/api/youtube-rss',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/growth',
        destination: 'https://www.gsuplementos.com.br/?cupom=LEOVEIO&fbclid=PAb21jcAONiY9leHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAaeyqQnebWFfIdeR1VrjiJ7gl0iYCNxMluHqYG6dNmiyPkZQvTCQLBhw_TN7sg_aem_nlLLdZiSaDIwodMtFyx90Q',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
