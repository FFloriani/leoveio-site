import { YouTubeVideo, RSSCacheEntry } from '@/types/youtube.types';

class CacheManager {
  private cache = new Map<string, RSSCacheEntry>();
  private defaultTTL: number;

  constructor() {
    this.defaultTTL = parseInt(process.env.YT_RSS_TTL || process.env.NEXT_PUBLIC_YT_RSS_TTL || '300') * 1000; // TTL em ms
  }

  set(key: string, data: YouTubeVideo[], ttl?: number): void {
    const entry: RSSCacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    
    this.cache.set(key, entry);
  }

  get(key: string): { data: YouTubeVideo[]; isStale: boolean } | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;
    const isStale = age > entry.ttl;

    return {
      data: entry.data,
      isStale,
    };
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getCacheAge(key: string): number | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    return Math.floor((Date.now() - entry.timestamp) / 1000);
  }

  // Cleanup de entradas expiradas
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      // Remove entradas que estão stale há mais de 1 hora
      if (age > entry.ttl + (60 * 60 * 1000)) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

// Cleanup automático a cada 10 minutos
if (typeof window === 'undefined') { // Apenas no servidor
  setInterval(() => {
    cacheManager.cleanup();
  }, 10 * 60 * 1000);
} 