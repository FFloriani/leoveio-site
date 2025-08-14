'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play, Clock } from 'lucide-react';
import { YouTubeVideo } from '@/types/youtube.types';
import { useState } from 'react';

interface VideoThumbnailProps {
  video: YouTubeVideo;
  onClick: () => void;
  index: number;
}

export const VideoThumbnail = ({ video, onClick, index }: VideoThumbnailProps) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(video.thumbnail);

  const fallbackUrls = [
    `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,  // Sempre disponível
    `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,  // Boa qualidade
    `https://img.youtube.com/vi/${video.id}/default.jpg`,    // Básica mas sempre existe
    '/placeholder-video.svg'  // Local fallback
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return '1 dia atrás';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return `${Math.floor(diffDays / 30)} meses atrás`;
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const handleImageError = () => {
    console.warn(`Erro ao carregar thumbnail: ${currentImageUrl}`);
    
    // Encontrar o próximo fallback
    const currentIndex = fallbackUrls.indexOf(currentImageUrl);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < fallbackUrls.length) {
      console.log(`Tentando fallback ${nextIndex + 1}: ${fallbackUrls[nextIndex]}`);
      setCurrentImageUrl(fallbackUrls[nextIndex]);
    } else {
      console.error('Todos os fallbacks de thumbnail falharam');
      setImageError(true);
    }
  };

  return (
    <motion.button
      onClick={onClick}
      className="group w-full text-left focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Assistir vídeo: ${video.title}`}
    >
      <div className="relative">
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
          {!imageError ? (
            <Image
              src={currentImageUrl}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 160px"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            // Fallback manual quando todas as imagens falharam
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <Play size={32} className="text-white/40 mx-auto mb-2" />
                <div className="text-xs text-white/60">Thumbnail indisponível</div>
              </div>
            </div>
          )}
          
          {/* Overlay de hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Play 
              size={24} 
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
            />
          </div>

          {/* Badge de Short */}
          {video.isShort && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 text-white text-xs rounded font-medium">
              Short
            </div>
          )}

          {/* Duração (se disponível) */}
          {video.durationHint !== 'unknown' && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded flex items-center gap-1">
              <Clock size={10} />
              {video.durationHint}
            </div>
          )}
        </div>

        {/* Informações do vídeo */}
        <div className="mt-2 space-y-1">
          <h3 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors leading-tight">
            {truncateTitle(video.title)}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{formatDate(video.publishedAt)}</span>
            <span className="text-white/40">{video.channelTitle}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}; 