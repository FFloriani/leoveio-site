// API Route para obter metadata de vídeos (título, thumbnail)
import { NextRequest, NextResponse } from 'next/server';

interface VideoMetadata {
    title: string;
    thumbnail: string;
    platform: string;
    author?: string;
    duration?: string;
    videoUrl?: string; // URL direta do vídeo MP4 quando disponível
}

// YouTube oEmbed (grátis, sem API key)
async function getYouTubeMetadata(url: string): Promise<VideoMetadata | null> {
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const response = await fetch(oembedUrl);

        if (!response.ok) return null;

        const data = await response.json();

        // Extrair video ID para thumbnail HD
        const videoIdMatch = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
        const videoId = videoIdMatch?.[1];

        return {
            title: data.title || 'Vídeo do YouTube',
            thumbnail: videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : data.thumbnail_url,
            platform: 'youtube',
            author: data.author_name
        };
    } catch (error) {
        console.error('[Video Metadata] YouTube error:', error);
        return null;
    }
}

// TikTok oEmbed
async function getTikTokMetadata(url: string): Promise<VideoMetadata | null> {
    try {
        const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
        const response = await fetch(oembedUrl);

        if (!response.ok) return null;

        const data = await response.json();

        return {
            title: data.title || 'Vídeo do TikTok',
            thumbnail: data.thumbnail_url || '',
            platform: 'tiktok',
            author: data.author_name
        };
    } catch (error) {
        console.error('[Video Metadata] TikTok error:', error);
        return null;
    }
}

// Twitter/X: usar API JSON do fxtwitter que retorna tudo
async function getTwitterMetadata(url: string): Promise<VideoMetadata | null> {
    try {
        // Extrair username e status ID da URL
        const match = url.match(/(?:x\.com|twitter\.com)\/([^\/]+)\/status\/(\d+)/);
        if (!match) {
            console.log('[Video Metadata] Twitter URL inválida');
            return null;
        }

        const [, username, statusId] = match;
        const apiUrl = `https://api.fxtwitter.com/${username}/status/${statusId}`;

        console.log('[Video Metadata] Buscando Twitter via fxtwitter API:', apiUrl);

        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            console.log('[Video Metadata] fxtwitter API failed:', response.status);
            return null;
        }

        const data = await response.json();
        const tweet = data.tweet;

        if (!tweet) {
            console.log('[Video Metadata] Tweet não encontrado');
            return null;
        }

        // Pegar thumbnail do primeiro vídeo
        let thumbnail = '';
        let videoUrl = '';

        if (tweet.media?.videos?.[0]) {
            const video = tweet.media.videos[0];
            thumbnail = video.thumbnail_url || '';
            videoUrl = video.url || '';
        } else if (tweet.media?.all?.[0]) {
            const media = tweet.media.all[0];
            thumbnail = media.thumbnail_url || '';
            if (media.type === 'video') {
                videoUrl = media.url || '';
            }
        }

        const title = `${tweet.author?.name || 'Tweet'} - @${tweet.author?.screen_name || 'unknown'}`;

        console.log('[Video Metadata] Twitter thumbnail:', thumbnail?.substring(0, 60));
        console.log('[Video Metadata] Twitter videoUrl:', videoUrl?.substring(0, 60));
        console.log('[Video Metadata] Twitter title:', title);

        return {
            title,
            thumbnail,
            platform: 'twitter',
            author: tweet.author?.screen_name,
            videoUrl: videoUrl || undefined
        };
    } catch (error) {
        console.error('[Video Metadata] Twitter error:', error);
        return null;
    }
}

// Instagram: usar imginn ou similar para obter thumbnail
async function getInstagramMetadata(url: string): Promise<VideoMetadata | null> {
    try {
        // Tentar ddinstagram que expõe metadados
        const ddUrl = url.replace('instagram.com', 'ddinstagram.com');

        const response = await fetch(ddUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)'
            }
        });

        if (!response.ok) {
            console.log('[Video Metadata] ddinstagram failed:', response.status);
            return null;
        }

        const html = await response.text();

        const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
            html.match(/<meta\s+content="([^"]+)"\s+property="og:title"/i);

        const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
            html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);

        console.log('[Video Metadata] Instagram thumbnail:', imageMatch?.[1]?.substring(0, 60));

        return {
            title: titleMatch?.[1] || 'Vídeo do Instagram',
            thumbnail: imageMatch?.[1] || '',
            platform: 'instagram'
        };
    } catch (error) {
        console.error('[Video Metadata] Instagram error:', error);
        return null;
    }
}

// Fallback: tentar obter og:image via fetch HTML
async function getGenericMetadata(url: string, platform: string): Promise<VideoMetadata | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
            }
        });

        if (!response.ok) return null;

        const html = await response.text();

        // Extrair og:title
        const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
            html.match(/<title>([^<]+)<\/title>/i);

        // Extrair og:image
        const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);

        return {
            title: titleMatch?.[1] || 'Vídeo',
            thumbnail: imageMatch?.[1] || '',
            platform
        };
    } catch (error) {
        console.error('[Video Metadata] Generic error:', error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const platform = searchParams.get('platform') || 'unknown';

    if (!url) {
        return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
    }

    let metadata: VideoMetadata | null = null;

    switch (platform) {
        case 'youtube':
            metadata = await getYouTubeMetadata(url);
            break;
        case 'tiktok':
            metadata = await getTikTokMetadata(url);
            break;
        case 'twitter':
            metadata = await getTwitterMetadata(url);
            break;
        case 'instagram':
            metadata = await getInstagramMetadata(url);
            break;
        default:
            metadata = await getGenericMetadata(url, platform);
    }

    if (!metadata) {
        return NextResponse.json({
            title: 'Vídeo',
            thumbnail: '',
            platform,
            error: 'Não foi possível obter metadata'
        });
    }

    return NextResponse.json(metadata);
}
