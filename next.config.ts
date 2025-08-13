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
  
  // Otimizações para reduzir o tamanho das funções
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Configuração mais agressiva de tracing de arquivos
  outputFileTracingIncludes: {
    // Incluir apenas o mínimo necessário para a API
    '/api/media/[folder]': [],
  },
  
  outputFileTracingExcludes: {
    // Excluir tudo que não é necessário para a API
    '/api/media/[folder]': [
      './public/**/*',
      './src/components/**/*',
      './src/app/globals.css',
      './src/app/layout.tsx',
      './src/app/page.tsx',
      './src/hooks/**/*',
      './node_modules/@emailjs/**/*',
      './node_modules/framer-motion/**/*',
      './node_modules/lucide-react/**/*',
      './node_modules/swr/**/*',
      './node_modules/axios/**/*',
      './node_modules/@tailwindcss/**/*',
      '**/*.md',
      '**/*.txt',
      '**/*.json',
      '**/*.ico',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.gif',
      '**/*.svg',
      '**/*.mp4',
      '**/*.mov',
      '**/*.avi',
      '**/*.webm',
      '**/*.zip',
      '**/*.pdf',
      '**/*.map',
    ],
  },

  // Configuração de webpack para otimização adicional
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Otimizações específicas para o servidor
      config.externals = config.externals || [];
      config.externals.push({
        'framer-motion': 'framer-motion',
        'lucide-react': 'lucide-react',
      });
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
