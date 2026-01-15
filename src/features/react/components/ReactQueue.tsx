'use client';

import { VideoReact } from '../types';
import { getPlatformColor, getPlatformIcon } from '../utils/linkParser';
import { Trash2, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ReactQueueProps {
    videos: VideoReact[];
    currentVideo: VideoReact | null;
    onRemove: (id: string) => void;
}

// Componente para buscar metadata async
function QueueCard({
    video,
    isNext,
    onRemove
}: {
    video: VideoReact;
    isNext: boolean;
    onRemove: () => void;
}) {
    const [metadata, setMetadata] = useState<{ title: string; thumbnail: string } | null>(null);
    const platformColor = getPlatformColor(video.platform);

    useEffect(() => {
        if (video.title) {
            setMetadata({ title: video.title, thumbnail: video.thumbnail || '' });
            return;
        }

        // Buscar metadata
        fetch(`/api/video-metadata?url=${encodeURIComponent(video.url)}&platform=${video.platform}`)
            .then(res => res.json())
            .then(data => {
                setMetadata({ title: data.title, thumbnail: data.thumbnail });
            })
            .catch(() => {
                setMetadata({ title: 'Vídeo', thumbnail: '' });
            });
    }, [video]);

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        return `${Math.floor(seconds / 3600)}h`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${isNext ? 'ring-2 ring-[#DEB066] ring-offset-2 ring-offset-[#1a0808]' : ''
                }`}
            style={{ borderColor: platformColor }}
        >
            {/* Thumbnail */}
            <div className="relative h-20 bg-gradient-to-r from-[#2a1515] to-[#1a0808]">
                {metadata?.thumbnail ? (
                    <img
                        src={metadata.thumbnail}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                ) : null}

                {/* Platform badge */}
                <div
                    className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                    style={{ backgroundColor: platformColor }}
                >
                    {getPlatformIcon(video.platform)}
                    {video.platform}
                </div>

                {/* Next badge */}
                {isNext && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold bg-[#DEB066] text-[#1a0808]">
                        PRÓXIMO
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3 bg-[#1a0808]/90">
                <p className="text-white text-sm font-medium truncate mb-1">
                    {metadata?.title || 'Carregando...'}
                </p>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-[#DEB066]">{video.displayName}</span>
                    <span className="text-white/50 flex items-center gap-1">
                        <Clock size={10} />
                        {timeAgo(video.receivedAt)}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity flex gap-1">
                <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white"
                >
                    <ExternalLink size={14} />
                </a>
                <button
                    onClick={onRemove}
                    className="p-1.5 rounded-lg bg-red-500/50 hover:bg-red-500 text-white"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </motion.div>
    );
}

export default function ReactQueue({ videos, currentVideo, onRemove }: ReactQueueProps) {
    const pendingVideos = videos.filter(v => v.status === 'pending');

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#1a0808] to-[#2a1515] rounded-2xl border-2 border-[#DEB066]/30 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#DEB066]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    <span className="text-[#DEB066] font-bold">Fila de React</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#DEB066]/20 text-[#DEB066] text-sm font-bold">
                    {pendingVideos.length} vídeo{pendingVideos.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Queue List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {pendingVideos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-4xl mb-2 opacity-50">📭</div>
                        <p className="text-[#DEB066]/60 text-sm">
                            Fila vazia
                        </p>
                        <p className="text-[#DEB066]/40 text-xs mt-1">
                            Aguardando !react no chat
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {pendingVideos.map((video, index) => (
                            <QueueCard
                                key={video.id}
                                video={video}
                                isNext={index === 0 && !currentVideo}
                                onRemove={() => onRemove(video.id)}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
