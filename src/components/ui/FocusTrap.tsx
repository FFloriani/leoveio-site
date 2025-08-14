'use client';

import { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  restoreFocus?: boolean;
}

export const FocusTrap = ({ children, isActive, restoreFocus = true }: FocusTrapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      // Salvar elemento ativo atual
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focar primeiro elemento focável dentro do container
      if (containerRef.current) {
        const firstFocusable = containerRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (firstFocusable) {
          setTimeout(() => firstFocusable.focus(), 50);
        }
      }
    } else if (restoreFocus && previousActiveElement.current) {
      // Restaurar foco anterior
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isActive, restoreFocus]);

  useEffect(() => {
    if (!isActive) return;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !containerRef.current) return;

      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab - ir para o último se estiver no primeiro
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab - ir para o primeiro se estiver no último
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isActive]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}; 