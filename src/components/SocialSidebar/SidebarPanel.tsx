'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SocialPlatform } from '@/types/sidebar.types';
import { useEffect, useRef } from 'react';
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

interface SidebarPanelProps {
  isOpen: boolean;
  activePanel: SocialPlatform | null;
  onClose: () => void;
  className?: string;
}

export const SidebarPanel = ({ 
  isOpen, 
  activePanel, 
  onClose, 
  className = '' 
}: SidebarPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Fechar com clique fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        panelRef.current && 
        !panelRef.current.contains(event.target as Node)
      ) {
        // Verificar se o clique foi em um ícone da sidebar (não fechar nesse caso)
        const target = event.target as HTMLElement;
        const isIconClick = target.closest('[data-sidebar-icon]');
        
        if (!isIconClick) {
          onClose();
        }
      }
    };

    if (isOpen) {
      // Pequeno delay para evitar fechar imediatamente após abrir
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && activePanel && (
        <motion.div
          ref={panelRef}
          className={`
            fixed left-16 top-0 h-full w-80 bg-black/90 backdrop-blur-xl 
            border-r border-white/10 z-[1000] overflow-hidden
            ${className}
          `}
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 400, 
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          role="dialog"
          aria-label={`Painel ${activePanel}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white capitalize">
              {activePanel}
            </h2>
            
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Fechar painel"
            >
              <X size={20} className="text-white/70" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="h-[calc(100vh-73px)] overflow-y-auto">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
            >
              {renderContent()}
            </motion.div>
          </div>

          {/* Scroll shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 