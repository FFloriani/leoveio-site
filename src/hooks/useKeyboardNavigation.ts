'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
  isOpen: boolean;
  onClose: () => void;
  trapFocus?: boolean;
  restoreFocus?: boolean;
}

export const useKeyboardNavigation = (options: UseKeyboardNavigationOptions) => {
  const { isOpen, onClose, trapFocus = true, restoreFocus = true } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Salvar elemento ativo antes de abrir
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Restaurar foco ao fechar
  useEffect(() => {
    if (!isOpen && restoreFocus && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen, restoreFocus]);

  // Trap focus dentro do container
  const handleTabKey = useCallback((event: KeyboardEvent) => {
    if (!trapFocus || !isOpen || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }, [trapFocus, isOpen]);

  // Handler para teclas de navegação
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      case 'Tab':
        handleTabKey(event);
        break;
    }
  }, [isOpen, onClose, handleTabKey]);

  // Registrar event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      
      // Focar primeiro elemento focável
      if (trapFocus && containerRef.current) {
        const firstFocusable = containerRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (firstFocusable) {
          // Delay para aguardar animação
          setTimeout(() => firstFocusable.focus(), 100);
        }
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown, trapFocus]);

  return {
    containerRef,
  };
}; 