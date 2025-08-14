'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { YouTubeVideo } from '@/types/youtube.types';
import { FocusTrap } from '@/components/ui/FocusTrap';
import { useEffect } from 'react';

interface VideoModalProps {
  video: YouTubeVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal = ({ video, isOpen, onClose }: VideoModalProps) => {
  // Fechar modal com Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll do body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!video) return null;

  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&rel=0&modestbranding=1`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <FocusTrap isActive={isOpen}>
            <motion.div
              className="relative w-full max-w-4xl bg-black/90 rounded-2xl overflow-hidden border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex-1 min-w-0">
                  <h2 
                    id="video-modal-title"
                    className="text-lg font-semibold text-white truncate"
                  >
                    {video.title}
                  </h2>
                  <p className="text-sm text-white/60 mt-1">
                    {video.channelTitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* Botão para abrir no YouTube */}
                  <motion.a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Abrir no YouTube"
                  >
                    <ExternalLink size={20} className="text-white/70" />
                  </motion.a>

                  {/* Botão fechar */}
                  <motion.button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Fechar modal"
                  >
                    <X size={20} className="text-white/70" />
                  </motion.button>
                </div>
              </div>

              {/* Video Embed */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <div className="flex items-center gap-4">
                    {video.isShort && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                        Short
                      </span>
                    )}
                    <span>
                      {new Date(video.publishedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <motion.a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Ver no YouTube →
                  </motion.a>
                </div>

                {video.description && (
                  <p className="mt-3 text-sm text-white/70 leading-relaxed">
                    {video.description}
                  </p>
                )}
              </div>
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 