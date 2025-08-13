'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Video, Download, ExternalLink, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useEventMedia } from '@/hooks/useEventMedia';

interface Event {
  id: string;
  title: string;
  year: string;
  location: string;
  achievement: string;
  description: string;
  highlights: string[];
  folderName: string;
  color: string;
  flag: string;
}

interface EventGalleryProps {
  event: Event | undefined;
  isOpen: boolean;
  onClose: () => void;
}

interface MediaFile {
  name: string;
  path: string;
  type: 'image' | 'video';
  extension: string;
  size?: number;
  lastModified?: Date;
}

const EventGallery = ({ event, isOpen, onClose }: EventGalleryProps) => {
  const [currentTab, setCurrentTab] = useState<'photos' | 'videos'>('photos');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Use custom hook for media management
  const { photos, videos, loading } = useEventMedia(event, isOpen);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedMedia(null);
      setCurrentMediaIndex(0);
      // Set default tab based on available content
      if (photos.length > 0) {
        setCurrentTab('photos');
      } else if (videos.length > 0) {
        setCurrentTab('videos');
      }
    }
  }, [isOpen, photos.length, videos.length]);

  const currentMedia = currentTab === 'photos' ? photos : videos;

  const nextMedia = () => {
    if (currentMediaIndex < currentMedia.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
      setSelectedMedia(currentMedia[currentMediaIndex + 1]);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
      setSelectedMedia(currentMedia[currentMediaIndex - 1]);
    }
  };

  const handleMediaClick = (media: MediaFile, index: number) => {
    setSelectedMedia(media);
    setCurrentMediaIndex(index);
  };

  const handleDownload = (media: MediaFile) => {
    const link = document.createElement('a');
    link.href = media.path;
    link.download = media.name;
    link.click();
  };

  const handleTabChange = (tab: 'photos' | 'videos') => {
    setCurrentTab(tab);
    setSelectedMedia(null);
    setCurrentMediaIndex(0);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Main Modal */}
          <motion.div
            className="fixed inset-4 lg:inset-8 bg-black/90 backdrop-blur-lg rounded-2xl border border-white/20 z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{event.flag}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                  <p className="text-white/70">{event.location} • {event.year}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${event.color} text-white mt-1`}>
                    {event.achievement}
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Event Description */}
            <div className="px-6 py-4 border-b border-white/10">
              <p className="text-white/80 text-sm leading-relaxed">{event.description}</p>
              
              {/* Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                {event.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-white/70">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-6 py-4 border-b border-white/10">
              <button
                onClick={() => handleTabChange('photos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentTab === 'photos'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <ImageIcon size={18} />
                <span>Fotos {loading ? '(...)' : `(${photos.length})`}</span>
              </button>
              
              <button
                onClick={() => handleTabChange('videos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ml-2 ${
                  currentTab === 'videos'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Video size={18} />
                <span>Vídeos {loading ? '(...)' : `(${videos.length})`}</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <div className="text-white/70">Carregando mídia...</div>
                  </div>
                </div>
              ) : (
                <div className="h-full p-6">
                  {currentMedia.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white/70">
                        <div className="text-4xl mb-4">📁</div>
                        <p className="text-lg font-semibold mb-2">
                          Nenhum {currentTab === 'photos' ? 'foto' : 'vídeo'} disponível
                        </p>
                        <p className="text-sm">
                          {currentTab === 'photos' 
                            ? 'Não foram encontradas fotos nesta pasta.'
                            : 'Não foram encontrados vídeos nesta pasta.'
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 h-full overflow-y-auto">
                      {currentMedia.map((media, index) => (
                        <motion.div
                          key={media.name}
                          className="aspect-square bg-black/40 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => handleMediaClick(media, index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="relative w-full h-full">
                            {media.type === 'image' ? (
                              <Image
                                src={media.path}
                                alt={media.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                <Play className="w-8 h-8 text-white/70" />
                              </div>
                            )}
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="text-white text-xs text-center p-2">
                                <div className="font-semibold mb-1 truncate">{media.name}</div>
                                <div className="text-white/70">{media.extension.toUpperCase()}</div>
                                {media.size && (
                                  <div className="text-white/50 text-xs mt-1">{formatFileSize(media.size)}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">
                  {loading ? 'Carregando...' : `${currentMedia.length} ${currentTab === 'photos' ? 'fotos' : 'vídeos'}`} • {event.achievement}
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.open(`/${event.folderName}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span>Ver Pasta</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Media Viewer Modal */}
          {selectedMedia && (
            <motion.div
              className="fixed inset-0 bg-black/95 z-60 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMedia(null)}
            >
              <div className="relative max-w-6xl max-h-full p-8">
                {/* Navigation */}
                {currentMedia.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                      disabled={currentMediaIndex === 0}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                      disabled={currentMediaIndex === currentMedia.length - 1}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                >
                  <X size={24} />
                </button>

                {/* Download Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload(selectedMedia); }}
                  className="absolute top-4 right-20 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                >
                  <Download size={24} />
                </button>

                {/* Media Content */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  {selectedMedia.type === 'image' ? (
                    <div className="relative w-full max-w-4xl max-h-[80vh]">
                      <Image
                        src={selectedMedia.path}
                        alt={selectedMedia.name}
                        width={1200}
                        height={800}
                        className="object-contain rounded-lg"
                        style={{ maxHeight: '80vh', width: 'auto' }}
                      />
                    </div>
                  ) : (
                    <video
                      src={selectedMedia.path}
                      controls
                      className="max-w-4xl max-h-[80vh] rounded-lg"
                    >
                      Seu navegador não suporta vídeos.
                    </video>
                  )}
                </div>

                {/* Media Info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{selectedMedia.name}</h3>
                      <p className="text-white/70 text-sm">
                        {currentMediaIndex + 1} de {currentMedia.length} • {selectedMedia.extension.toUpperCase()} • {event.title}
                        {selectedMedia.size && ` • ${formatFileSize(selectedMedia.size)}`}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(selectedMedia); }}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default EventGallery; 