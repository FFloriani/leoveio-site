'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Youtube, Instagram, Twitter } from 'lucide-react';
import { SocialPlatform } from '@/types/sidebar.types';
import { FocusTrap } from '@/components/ui/FocusTrap';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy-load da galeria YouTube
const YTRSSGallery = dynamic(() => import('@/components/YouTube/YTRSSGallery').then(mod => ({ default: mod.YTRSSGallery })), {
  ssr: false,
  loading: () => (
    <div className="p-4 animate-pulse">
      <div className="h-6 bg-white/10 rounded mb-4 w-32" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-video bg-white/10 rounded" />
            <div className="h-3 bg-white/10 rounded" />
            <div className="h-2 bg-white/10 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  ),
});

interface MobileDrawerProps {
  isOpen: boolean;
  activePanel: SocialPlatform | null;
  onClose: () => void;
  onPanelChange: (platform: SocialPlatform) => void;
}

const platforms = [
  { type: 'youtube' as SocialPlatform, label: 'YouTube', icon: Youtube, hasContent: true },
  { type: 'instagram' as SocialPlatform, label: 'Instagram', icon: Instagram, hasContent: false },
  { type: 'twitter' as SocialPlatform, label: 'Twitter', icon: Twitter, hasContent: false },
];

export const MobileDrawer = ({ 
  isOpen, 
  activePanel, 
  onClose, 
  onPanelChange 
}: MobileDrawerProps) => {
  // Prevenir scroll do body quando drawer está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const renderContent = () => {
    switch (activePanel) {
      case 'youtube':
        return <YTRSSGallery maxItems={12} />;
      
      case 'instagram':
        return (
          <div className="p-4 text-center">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-lg font-semibold text-white mb-2">Instagram</h3>
            <p className="text-white/70 mb-4">
              Integração em desenvolvimento
            </p>
            <div className="text-sm text-white/50">
              Em breve: feed de fotos e stories
            </div>
          </div>
        );
      
      case 'twitter':
        return (
          <div className="p-4 text-center">
            <div className="text-6xl mb-4">🐦</div>
            <h3 className="text-lg font-semibold text-white mb-2">Twitter</h3>
            <p className="text-white/70 mb-4">
              Integração em desenvolvimento
            </p>
            <div className="text-sm text-white/50">
              Em breve: timeline e tweets recentes
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-white mb-2">Redes Sociais</h3>
            <p className="text-white/70">
              Selecione uma plataforma acima
            </p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1100] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <FocusTrap isActive={isOpen}>
            <motion.div
              className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-black/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 30 
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de redes sociais"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">
                  Redes Sociais
                </h2>
                
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Fechar menu"
                >
                  <X size={20} className="text-white/70" />
                </motion.button>
              </div>

              {/* Platform Tabs */}
              <div className="flex border-b border-white/10">
                {platforms.map((platform) => {
                  const IconComponent = platform.icon;
                  const isActive = activePanel === platform.type;
                  
                  return (
                    <motion.button
                      key={platform.type}
                      onClick={() => onPanelChange(platform.type)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 p-4 transition-colors
                        ${isActive 
                          ? 'bg-white/10 border-b-2 border-purple-500' 
                          : 'hover:bg-white/5'
                        }
                        ${!platform.hasContent ? 'opacity-60' : ''}
                      `}
                      whileTap={{ scale: 0.95 }}
                      aria-pressed={isActive}
                    >
                      <IconComponent size={18} className="text-white/70" />
                      <span className="text-sm text-white/90 font-medium">
                        {platform.label}
                      </span>
                      
                      {/* Indicador de conteúdo */}
                      {platform.hasContent && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                <motion.div
                  key={activePanel || 'default'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </div>

              {/* Handle indicator */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-white/30 rounded-full" />
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 