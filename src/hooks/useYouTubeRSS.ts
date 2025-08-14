'use client';

import { useState, useEffect, useCallback } from 'react';
import { YouTubeVideo, YouTubeRSSResponse } from '@/types/youtube.types';

interface UseYouTubeRSSOptions {
  enabled?: boolean;
  maxItems?: number;
  refetchInterval?: number;
  retryCount?: number;
}

export const useYouTubeRSS = (options: UseYouTubeRSSOptions = {}) => {
  const { enabled = true, maxItems = 12, refetchInterval, retryCount = 3 } = options;
  
  const [data, setData] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [cacheAge, setCacheAge] = useState<number>(0);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const fetchVideos = useCallback(async (attempt: number = 0) => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const url = `/api/youtube-rss?max=${maxItems}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: YouTubeRSSResponse = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setData(result.videos || []);
      setFromCache(result.fromCache);
      setCacheAge(result.cacheAge || 0);
      setRetryAttempt(0); // Reset retry count on success
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao buscar vídeos do YouTube:', errorMessage);
      
      // Retry logic
      if (attempt < retryCount && errorMessage.includes('fetch')) {
        console.log(`Tentativa ${attempt + 1}/${retryCount} falhou, tentando novamente em 2s...`);
        setRetryAttempt(attempt + 1);
        setTimeout(() => {
          fetchVideos(attempt + 1);
        }, 2000);
        return;
      }
      
      setError(errorMessage);
      setRetryAttempt(0);
    } finally {
      setLoading(false);
    }
  }, [enabled, maxItems, retryCount]);

  // Fetch inicial
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Auto-refetch se configurado
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(() => fetchVideos(), refetchInterval);
    return () => clearInterval(interval);
  }, [refetchInterval, enabled, fetchVideos]);

  const retry = useCallback(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    data,
    loading,
    error,
    fromCache,
    cacheAge,
    retryAttempt,
    retry,
    refetch: fetchVideos,
  };
}; 