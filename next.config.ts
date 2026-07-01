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
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',
      },
    ],
  },



  // Otimizações básicas para reduzir o tamanho das funções
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Next.js 16 usa Turbopack no build por padrão; webpack só no `npm run dev --webpack`
  turbopack: {},

  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/.brain/**', '**/node_modules/**'],
      };
    }
    return config;
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
            value: "frame-src 'self' https://*.twitch.tv https://twitch.tv https://www.twitch.tv https://player.twitch.tv https://embed.twitch.tv https://*.youtube.com https://youtube.com https://platform.twitter.com https://*.twitter.com https://twitter.com https://*.x.com https://x.com https://twitframe.com https://*.instagram.com https://instagram.com https://*.tiktok.com https://tiktok.com; frame-ancestors 'self' https://*.twitch.tv https://*.youtube.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://player.twitch.tv https://embed.twitch.tv https://platform.twitter.com;",
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
      {
        source: '/pix',
        destination: 'https://livepix.gg/leoveio',
        permanent: false,
      },
      {
        source: '/aposta',
        destination: 'https://go.aff.casadeapostas.bet.br/lkp84bia?utm_source=LeoVeio',
        permanent: false,
      },
    ];
  },
};

export default nextConfig as any;
