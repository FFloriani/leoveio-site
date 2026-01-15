// Link Parser - Detecta plataforma e extrai ID do vídeo

import { ParsedLink, VideoPlatform } from '../types';

// Patterns para cada plataforma
const YOUTUBE_PATTERNS = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/
];

const TIKTOK_PATTERNS = [
    /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
    /vm\.tiktok\.com\/(\w+)/,
    /tiktok\.com\/t\/(\w+)/
];

const INSTAGRAM_PATTERNS = [
    /instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/,
    /instagr\.am\/(?:reel|p)\/([a-zA-Z0-9_-]+)/
];

const TWITTER_PATTERNS = [
    /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/
];

export function parseVideoLink(url: string): ParsedLink {
    const cleanUrl = url.trim();

    // YouTube
    for (const pattern of YOUTUBE_PATTERNS) {
        const match = cleanUrl.match(pattern);
        if (match) {
            return {
                platform: 'youtube',
                videoId: match[1],
                originalUrl: cleanUrl,
                embedUrl: `https://www.youtube.com/embed/${match[1]}?autoplay=1`
            };
        }
    }

    // TikTok
    for (const pattern of TIKTOK_PATTERNS) {
        const match = cleanUrl.match(pattern);
        if (match) {
            return {
                platform: 'tiktok',
                videoId: match[1],
                originalUrl: cleanUrl
                // TikTok embed é complicado, usaremos link direto
            };
        }
    }

    // Instagram
    for (const pattern of INSTAGRAM_PATTERNS) {
        const match = cleanUrl.match(pattern);
        if (match) {
            return {
                platform: 'instagram',
                videoId: match[1],
                originalUrl: cleanUrl
            };
        }
    }

    // Twitter/X
    for (const pattern of TWITTER_PATTERNS) {
        const match = cleanUrl.match(pattern);
        if (match) {
            return {
                platform: 'twitter',
                videoId: match[1],
                originalUrl: cleanUrl
            };
        }
    }

    // Desconhecido
    return {
        platform: 'unknown',
        videoId: null,
        originalUrl: cleanUrl
    };
}

export function isValidVideoUrl(url: string): boolean {
    const parsed = parseVideoLink(url);
    return parsed.platform !== 'unknown';
}

export function getPlatformIcon(platform: VideoPlatform): string {
    switch (platform) {
        case 'youtube': return '▶️';
        case 'tiktok': return '🎵';
        case 'instagram': return '📸';
        case 'twitter': return '🐦';
        default: return '🔗';
    }
}

export function getPlatformColor(platform: VideoPlatform): string {
    switch (platform) {
        case 'youtube': return '#FF0000';
        case 'tiktok': return '#00F2EA';
        case 'instagram': return '#E4405F';
        case 'twitter': return '#1DA1F2';
        default: return '#6B7280';
    }
}
