'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load heavy components with loading fallbacks
export const LazyEventGallery = dynamic(() => import('./EventGallery'), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
    </div>
  ),
  ssr: false,
});

export const LazyAnimatedBackground = dynamic(() => import('./AnimatedBackground'), {
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />,
  ssr: false,
});

export const LazyYTRSSGallery = dynamic(() => import('./YouTube/YTRSSGallery').then(mod => ({ default: mod.YTRSSGallery })), {
  loading: () => (
    <div className="p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-video bg-white/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

export const LazyTwitchPlayer = dynamic(() => import('./TwitchPlayer'), {
  loading: () => (
    <div className="aspect-video rounded-xl overflow-hidden bg-black relative flex items-center justify-center">
      <div className="text-white">Carregando player...</div>
    </div>
  ),
  ssr: false,
});

// Wrapper component with Suspense for better error boundary
export const SuspenseWrapper = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <Suspense fallback={fallback || <div className="animate-pulse bg-white/5 rounded-lg h-32"></div>}>
    {children}
  </Suspense>
);
