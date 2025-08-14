'use client';

import { useState, useEffect, useCallback } from 'react';
import { SocialPlatform, SidebarState } from '@/types/sidebar.types';

export const useSocialSidebar = () => {
  const [state, setState] = useState<SidebarState>({
    activePanel: null,
    isExpanded: false,
    isMobile: false,
  });

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setState(prev => ({
        ...prev,
        isMobile: window.innerWidth < 768,
      }));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handler para abrir painel
  const openPanel = useCallback((platform: SocialPlatform) => {
    setState(prev => ({
      ...prev,
      activePanel: platform,
      isExpanded: true,
    }));
  }, []);

  // Handler para fechar painel
  const closePanel = useCallback(() => {
    setState(prev => ({
      ...prev,
      activePanel: null,
      isExpanded: false,
    }));
  }, []);

  // Handler para toggle de painel
  const togglePanel = useCallback((platform: SocialPlatform) => {
    setState(prev => {
      if (prev.activePanel === platform && prev.isExpanded) {
        // Fechar se já está aberto
        return {
          ...prev,
          activePanel: null,
          isExpanded: false,
        };
      } else {
        // Abrir novo painel
        return {
          ...prev,
          activePanel: platform,
          isExpanded: true,
        };
      }
    });
  }, []);

  // Handler para tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.isExpanded) {
        closePanel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [state.isExpanded, closePanel]);

  return {
    ...state,
    openPanel,
    closePanel,
    togglePanel,
  };
}; 