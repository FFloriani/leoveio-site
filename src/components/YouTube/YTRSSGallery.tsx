'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, AlertCircle, Clock } from 'lucide-react';
import { VideoThumbnail } from './VideoThumbnail';
import { VideoModal } from './VideoModal';
import { VideoSkeleton } from './VideoSkeleton';
import { useYouTubeRSS } from '@/hooks/useYouTubeRSS';
import { YouTubeVideo } from '@/types/youtube.types';

interface YTRSSGalleryProps {
  maxItems?: number;
  onError?: (error: string) => void;
}

export const YTRSSGallery = ({ maxItems = 12, onError }: YTRSSGalleryProps) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: videos, loading, error, fromCache, cacheAge, retry } = useYouTubeRSS({
    enabled: true,
    maxItems,
  });

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleVideoClick = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const handleRetry = () => {
    retry();
  };

  const openYouTubeChannel = () => {
    window.open('https://www.youtube.com/@LeoVeio', '_blank', 'noopener,noreferrer');
  };

  // Estados de loading
  if (loading && videos.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Últimos Vídeos</h3>
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
        <VideoSkeleton count={6} />
      </div>
    );
  }

  // Estado de erro
  if (error && videos.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Últimos Vídeos</h3>
        </div>
        
        <div className="text-center py-8">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-white/70 mb-4">{error}</p>
          <motion.button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            Tentar Novamente
          </motion.button>
        </div>
      </div>
    );
  }

  // Estado sem vídeos
  if (!loading && videos.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Últimos Vídeos</h3>
        </div>
        
        <div className="text-center py-8">
          <p className="text-white/70 mb-4">Nenhum vídeo encontrado</p>
          <motion.button
            onClick={openYouTubeChannel}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink size={16} />
            Ver Canal no YouTube
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Últimos Vídeos</h3>
          
          {/* Indicador de cache */}
          {fromCache && (
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Clock size={12} />
              <span>{cacheAge}s atrás</span>
            </div>
          )}
          
          {/* Indicador de erro com cache stale */}
          {error && videos.length > 0 && (
            <div className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
              Cache offline
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Botão de refresh */}
          <motion.button
            onClick={handleRetry}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Atualizar vídeos"
            disabled={loading}
          >
            <RefreshCw 
              size={16} 
              className={`text-white/70 ${loading ? 'animate-spin' : ''}`} 
            />
          </motion.button>

          {/* Botão Ver Tudo */}
          <motion.button
            onClick={openYouTubeChannel}
            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Ver Tudo</span>
            <ExternalLink size={14} />
          </motion.button>
        </div>
      </div>

      {/* Grid de vídeos */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {videos.map((video, index) => (
          <VideoThumbnail
            key={video.id}
            video={video}
            onClick={() => handleVideoClick(video)}
            index={index}
          />
        ))}
      </div>

      {/* Link para o canal */}
      <motion.button
        onClick={openYouTubeChannel}
        className="w-full py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-center text-white/70 hover:text-white/90 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Visite o canal no YouTube</span>
        <ExternalLink size={16} />
      </motion.button>

      {/* Modal de vídeo */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}; 