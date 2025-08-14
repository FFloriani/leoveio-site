import { NextRequest, NextResponse } from 'next/server';
import { YouTubeRSSParser } from '@/lib/youtube-rss-parser';
import { cacheManager } from '@/lib/cache-manager';
import { YouTubeRSSResponse } from '@/types/youtube.types';

const YOUTUBE_RSS_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC1ajCC-_nKsdSMbY95XMucg';
const CACHE_KEY = 'youtube-rss-leoveio';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxItems = parseInt(searchParams.get('max') || '12');

    // Verificar cache primeiro
    const cached = cacheManager.get(CACHE_KEY);
    
    if (cached && !cached.isStale) {
      // Cache válido - retornar imediatamente
      const response: YouTubeRSSResponse = {
        videos: cached.data.slice(0, maxItems),
        totalCount: cached.data.length,
        fromCache: true,
        cacheAge: cacheManager.getCacheAge(CACHE_KEY) || 0,
      };

      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'X-From-Cache': 'fresh',
          'X-Cache-TTL': String(300 - (cacheManager.getCacheAge(CACHE_KEY) || 0)),
        },
      });
    }

    // Tentar fetch do RSS
    let videos;
    let fromCache = false;
    let cacheAge = 0;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(YOUTUBE_RSS_URL, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'LeoVeio-Site/1.0',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlData = await response.text();
      videos = await YouTubeRSSParser.parseRSSToVideos(xmlData, 20); // Parse mais itens para cache

      // Salvar no cache
      cacheManager.set(CACHE_KEY, videos);

    } catch (fetchError) {
      console.error('Erro ao buscar RSS:', fetchError);

      // Fallback para cache stale se disponível
      if (cached) {
        videos = cached.data;
        fromCache = true;
        cacheAge = cacheManager.getCacheAge(CACHE_KEY) || 0;
        
        console.log('Usando cache stale devido a erro de fetch');
      } else {
        // Sem cache disponível - retornar erro
        const errorResponse: YouTubeRSSResponse = {
          videos: [],
          totalCount: 0,
          fromCache: false,
          error: 'Feed RSS temporariamente indisponível. Tente novamente em alguns minutos.',
        };

        return NextResponse.json(errorResponse, {
          status: 503,
          headers: {
            'Cache-Control': 'no-cache',
            'Retry-After': '300',
          },
        });
      }
    }

    // Resposta de sucesso
    const responseData: YouTubeRSSResponse = {
      videos: videos.slice(0, maxItems),
      totalCount: videos.length,
      fromCache,
      cacheAge,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (fromCache) {
      headers['Cache-Control'] = 'public, max-age=60, stale-while-revalidate=300';
      headers['X-From-Cache'] = 'stale';
      headers['X-Cache-Age'] = String(cacheAge);
    } else {
      headers['Cache-Control'] = 'public, max-age=300, stale-while-revalidate=600';
      headers['X-From-Cache'] = 'fresh';
    }

    return NextResponse.json(responseData, { headers });

  } catch (error) {
    console.error('Erro na API YouTube RSS:', error);

    const errorResponse: YouTubeRSSResponse = {
      videos: [],
      totalCount: 0,
      fromCache: false,
      error: 'Erro interno do servidor',
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
} 