export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  durationSeconds?: number;
  durationHint: string;
  isShort: boolean;
  channelTitle: string;
}

export interface YouTubeRSSResponse {
  videos: YouTubeVideo[];
  totalCount: number;
  fromCache: boolean;
  cacheAge?: number;
  error?: string;
}

export interface RSSCacheEntry {
  data: YouTubeVideo[];
  timestamp: number;
  ttl: number;
} 