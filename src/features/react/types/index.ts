// Tipos para o sistema de React Queue

export interface VideoReact {
    id: string;
    url: string;
    platform: VideoPlatform;
    videoId: string | null;

    // URL direta do MP4 (extraída via Cobalt)
    directUrl?: string;
    extracting?: boolean;
    extractError?: string;

    // Metadata (preenchido async)
    title?: string;
    thumbnail?: string;
    duration?: string;

    // Quem enviou
    username: string;
    displayName: string;
    source: 'twitch' | 'youtube';

    // Timestamps
    receivedAt: number;
    watchedAt?: number;

    // Status
    status: 'pending' | 'playing' | 'watched' | 'skipped';
}

export type VideoPlatform =
    | 'youtube'
    | 'tiktok'
    | 'instagram'
    | 'twitter'
    | 'unknown';

export interface ReactQueueState {
    queue: VideoReact[];
    currentIndex: number;
    isPlaying: boolean;
    isPaused: boolean;
}

export interface ParsedLink {
    platform: VideoPlatform;
    videoId: string | null;
    originalUrl: string;
    embedUrl?: string;
}
