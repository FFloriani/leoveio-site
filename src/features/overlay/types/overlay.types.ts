export type ViewMode = 'like' | 'meta' | 'instagram';

export interface OverlayConfig {
    videoId: string;
    goal: number;
    instagramHandle: string;
    isTestMode: boolean;
}

export interface OverlayStats {
    likes: number;
    viewers: number | null;
    goal: number;
    progress: number;
}
