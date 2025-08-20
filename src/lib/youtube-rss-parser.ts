import xml2js from 'xml2js';
import { YouTubeVideo } from '@/types/youtube.types';

interface RSSItem {
  title: string[];
  link: string[];
  'yt:videoId': string[];
  'media:group': [{
    'media:title': string[];
    'media:description': string[];
    'media:thumbnail': { $: { url: string; width: string; height: string } }[];
  }];
  published: string[];
  author: [{ name: string[] }];
}

interface RSSFeed {
  feed: {
    entry?: RSSItem[];
    title: string[];
  };
}

export class YouTubeRSSParser {
  private static detectShorts(video: Partial<YouTubeVideo>): boolean {
    // Método 1: Duração ≤ 60s (quando disponível)
    if (video.durationSeconds && video.durationSeconds <= 60) {
      return true;
    }

    // Método 2: URL contém /shorts/
    if (video.url && video.url.includes('/shorts/')) {
      return true;
    }

    // Método 3: Título contém #shorts (case-insensitive)
    if (video.title && video.title.toLowerCase().includes('#shorts')) {
      return true;
    }

    return false;
  }

  private static extractVideoId(url: string): string {
    // Extrair video ID da URL do YouTube
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  }

  private static getBestThumbnail(thumbnails: Array<{ $: { url: string; width: string; height: string } }>, videoId: string): string {
    // URLs confiáveis do YouTube em ordem de preferência
    // Evitando maxresdefault.jpg que muitas vezes não existe
    const fallbackUrls = [
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, // Média qualidade (320x180) - sempre disponível
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, // Alta qualidade (480x360)
      `https://img.youtube.com/vi/${videoId}/default.jpg`,   // Qualidade padrão (120x90)
      `/placeholder-video.svg` // Último fallback local
    ];

    // Sempre usar mqdefault como padrão - é mais confiável
    if (!thumbnails || thumbnails.length === 0) {
      return fallbackUrls[0]; 
    }

    // Tentar usar thumbnail do RSS, mas filtrar URLs problemáticas
    try {
      const sorted = thumbnails.sort((a, b) => {
        const aWidth = parseInt(a.$.width) || 0;
        const bWidth = parseInt(b.$.width) || 0;
        return bWidth - aWidth;
      });

      const bestFromRSS = sorted[0]?.$.url;
      
      // Verificar se a URL do RSS é válida e não é maxresdefault (que falha muito)
      if (bestFromRSS && 
          bestFromRSS.includes('youtube') && 
          bestFromRSS.includes(videoId) &&
          !bestFromRSS.includes('maxresdefault')) {
        return bestFromRSS;
      }
    } catch (error) {
      console.warn('Erro ao processar thumbnails do RSS:', error);
    }

    // Sempre retornar mqdefault como fallback seguro
    return fallbackUrls[0];
  }

  private static sanitizeText(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
  }

  static async parseRSSToVideos(xmlData: string, maxItems: number = 12): Promise<YouTubeVideo[]> {
    try {
      const parser = new xml2js.Parser({ 
        explicitArray: true,
        trim: true,
        normalize: true
      });
      const result: RSSFeed = await parser.parseStringPromise(xmlData);

      if (!result.feed?.entry) {
        console.warn('Nenhuma entrada encontrada no RSS feed');
        return [];
      }

      const videos: YouTubeVideo[] = result.feed.entry
        .slice(0, maxItems)
        .map((item: RSSItem) => {
          try {
            const videoId = item['yt:videoId']?.[0] || this.extractVideoId(item.link?.[0] || '');
            
            if (!videoId) {
              console.warn('Video ID não encontrado para item:', item.title?.[0]);
              return null;
            }

            const title = this.sanitizeText(item.title?.[0] || 'Título indisponível');
            const description = this.sanitizeText(
              item['media:group']?.[0]?.['media:description']?.[0] || ''
            );
            const url = `https://www.youtube.com/watch?v=${videoId}`;
            const thumbnail = this.getBestThumbnail(
              item['media:group']?.[0]?.['media:thumbnail'] || [],
              videoId
            );
            const publishedAt = item.published?.[0] || new Date().toISOString();
            const channelTitle = item.author?.[0]?.name?.[0] || 'LeoVeio';

            const video: YouTubeVideo = {
              id: videoId,
              title,
              description: description.length > 150 ? description.substring(0, 150) + '...' : description,
              url,
              thumbnail,
              publishedAt,
              durationHint: 'unknown', // RSS não fornece duração
              isShort: false, // será detectado depois
              channelTitle: this.sanitizeText(channelTitle),
            };

            // Detectar se é Short
            video.isShort = this.detectShorts(video);

            return video;
          } catch (itemError) {
            console.error('Erro ao processar item do RSS:', itemError);
            return null;
          }
        })
        .filter((video): video is YouTubeVideo => video !== null); // Remove vídeos inválidos

      console.log(`RSS processado: ${videos.length} vídeos válidos de ${result.feed.entry.length} entries`);
      return videos;
      
    } catch (error) {
      console.error('Erro ao parsear RSS:', error);
      throw new Error('Falha ao processar feed RSS do YouTube');
    }
  }
} 