'use client';

import { SocialIcon } from './SocialIcon';
import { SidebarPanel } from './SidebarPanel';
import { MobileDrawer } from './MobileDrawer';
import { useSocialSidebar } from '@/hooks/useSocialSidebar';
import { SocialPlatform } from '@/types/sidebar.types';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';

interface SocialSidebarProps {
  className?: string;
}

export const SocialSidebar = ({ className = '' }: SocialSidebarProps) => {
  const { 
    activePanel, 
    isExpanded, 
    isMobile, 
    togglePanel, 
    closePanel 
  } = useSocialSidebar();

  const platforms: Array<{
    type: SocialPlatform;
    hasContent: boolean;
  }> = [
    { type: 'youtube', hasContent: true },
    { type: 'instagram', hasContent: false },
    { type: 'twitter', hasContent: false },
  ];

  // Desktop Sidebar
  if (!isMobile) {
    return (
      <>
        {/* Barra de ícones fixa */}
        <motion.div
          className={`
            fixed left-4 top-1/3 z-[1000] flex flex-col gap-3 
            ${className}
          `}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {platforms.map((platform) => (
            <div key={platform.type} data-sidebar-icon>
              <SocialIcon
                type={platform.type}
                isActive={activePanel === platform.type}
                hasContent={platform.hasContent}
                onClick={() => togglePanel(platform.type)}
              />
            </div>
          ))}
        </motion.div>

        {/* Painel expansível */}
        <SidebarPanel
          isOpen={isExpanded}
          activePanel={activePanel}
          onClose={closePanel}
        />
      </>
    );
  }

  // Mobile - Botão flutuante
  return (
    <>
      {/* Botão flutuante mobile */}
      <motion.button
        onClick={() => togglePanel('youtube')} // Abrir com YouTube por padrão
        className={`
          fixed bottom-6 right-6 z-[1000] w-14 h-14 bg-purple-600 
          hover:bg-purple-500 rounded-full shadow-lg flex items-center 
          justify-center md:hidden ${className}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 400, 
          damping: 15,
          delay: 0.3 
        }}
        aria-label="Abrir redes sociais"
      >
        <Share2 size={24} className="text-white" />
        
        {/* Indicador de conteúdo disponível */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      </motion.button>

      {/* Drawer mobile */}
      <MobileDrawer
        isOpen={isExpanded}
        activePanel={activePanel}
        onClose={closePanel}
        onPanelChange={togglePanel}
      />
    </>
  );
};

export default SocialSidebar; 