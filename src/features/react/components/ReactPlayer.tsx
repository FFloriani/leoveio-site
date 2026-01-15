'use client';

import { VideoReact } from '../types';
import { getPlatformColor } from '../utils/linkParser';

// Componente para embed do Twitter usando iframe direto
function TwitterEmbed({ url, tweetId }: { url: string; tweetId: string }) {
    return (
        <div className="flex justify-center w-full">
            <iframe
                src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=dark&dnt=true`}
                className="w-full max-w-[550px] min-h-[600px] border-0 bg-transparent"
                allowFullScreen
                allow="autoplay; fullscreen"
            />
        </div>
    );
}

interface ReactPlayerProps {
    video: VideoReact | null;
    onNext: () => void;
    onSkip: () => void;
}

export default function ReactPlayer({ video, onNext, onSkip }: ReactPlayerProps) {




    if (!video) {
        return (
            <div className="min-h-[400px] bg-gradient-to-br from-[#1a0808] to-[#2a1515] rounded-2xl flex flex-col items-center justify-center border-2 border-[#DEB066]/30">
                <div className="text-6xl mb-4 opacity-50">🎬</div>
                <h2 className="text-[#DEB066] text-2xl font-bold mb-2">Aguardando Vídeos</h2>
                <p className="text-[#DEB066]/60 text-sm">
                    Viewers podem enviar: <code className="bg-[#DEB066]/20 px-2 py-1 rounded">!react &lt;link&gt;</code>
                </p>
            </div>
        );
    }

    const platformColor = getPlatformColor(video.platform);

    // Extrair IDs necessários
    const getTweetId = () => {
        const match = video.url.match(/status\/(\d+)/);
        return match?.[1] || null;
    };

    const getInstagramId = () => {
        // https://www.instagram.com/reel/ABC123/ ou /p/ABC123/
        const match = video.url.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/);
        return match?.[2] || null;
    };

    const getTikTokId = () => {
        // https://www.tiktok.com/@user/video/123456789
        const match = video.url.match(/video\/(\d+)/);
        return match?.[1] || null;
    };

    // Renderizar embed baseado na plataforma
    const renderEmbed = () => {
        // YouTube: iframe nativo
        if (video.platform === 'youtube' && video.videoId) {
            return (
                <div className="w-full aspect-video">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }

        // Twitter: widget nativo com blockquote
        if (video.platform === 'twitter') {
            const tweetId = getTweetId();
            if (tweetId) {
                return (
                    <TwitterEmbed url={video.url} tweetId={tweetId} />
                );
            }
        }

        // Instagram: Embed nativo
        if (video.platform === 'instagram') {
            const postId = getInstagramId();
            if (postId) {
                return (
                    <div className="flex justify-center max-w-[540px] mx-auto">
                        <iframe
                            src={`https://www.instagram.com/p/${postId}/embed/`}
                            className="w-[540px] min-h-[600px] border-0"
                            allowFullScreen
                            scrolling="no"
                        />
                    </div>
                );
            }
        }

        // TikTok: Embed nativo
        if (video.platform === 'tiktok') {
            const videoId = getTikTokId();
            if (videoId) {
                return (
                    <div className="flex justify-center">
                        <iframe
                            src={`https://www.tiktok.com/embed/v2/${videoId}`}
                            className="w-[325px] h-[575px] border-0"
                            allowFullScreen
                            allow="encrypted-media"
                        />
                    </div>
                );
            }
        }

        // Fallback: Link para abrir
        return (
            <div className="min-h-[300px] bg-gradient-to-br from-[#1a0808] to-[#2a1515] flex flex-col items-center justify-center p-8">
                <div className="text-5xl mb-4">🔗</div>
                <p className="text-white/70 mb-4 text-center">
                    Não foi possível carregar o embed
                </p>
                <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
                    style={{ backgroundColor: platformColor }}
                >
                    Abrir Link ↗
                </a>
            </div>
        );
    };

    // Retornar apenas o embed puro sem container
    return renderEmbed();
}
