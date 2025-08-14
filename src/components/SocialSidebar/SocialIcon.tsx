'use client';

import { motion } from 'framer-motion';
import { Youtube, Instagram, Twitter } from 'lucide-react';
import { SocialPlatform } from '@/types/sidebar.types';

interface SocialIconProps {
  type: SocialPlatform;
  isActive: boolean;
  hasContent: boolean;
  onClick: () => void;
  className?: string;
}

const iconMap = {
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
};

const platformLabels = {
  youtube: 'YouTube',
  instagram: 'Instagram', 
  twitter: 'Twitter',
};

const platformColors = {
  youtube: 'hover:bg-red-500/20 hover:text-red-400 active:bg-red-500/30',
  instagram: 'hover:bg-pink-500/20 hover:text-pink-400 active:bg-pink-500/30',
  twitter: 'hover:bg-blue-500/20 hover:text-blue-400 active:bg-blue-500/30',
};

export const SocialIcon = ({ 
  type, 
  isActive, 
  hasContent, 
  onClick, 
  className = '' 
}: SocialIconProps) => {
  const IconComponent = iconMap[type];
  const label = platformLabels[type];
  const colorClasses = platformColors[type];

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative w-12 h-12 rounded-xl border border-white/10 
        bg-black/40 backdrop-blur-sm transition-all duration-300
        flex items-center justify-center group
        focus:outline-none focus:ring-2 focus:ring-purple-500/50
        ${colorClasses}
        ${isActive ? 'bg-white/10 border-white/20' : ''}
        ${!hasContent ? 'opacity-60' : ''}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`${label} ${hasContent ? '' : '(em breve)'}`}
      aria-pressed={isActive}
      title={`${label} ${hasContent ? '' : '(em breve)'}`}
    >
      {/* Ícone */}
      <IconComponent 
        size={20} 
        className={`
          transition-colors duration-300
          ${isActive ? 'text-white' : 'text-white/70'}
        `} 
      />

      {/* Indicador de ativo */}
      {isActive && (
        <motion.div
          className="absolute -right-1 -top-1 w-3 h-3 bg-purple-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* Indicador de conteúdo disponível */}
      {hasContent && (
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
      )}

      {/* Tooltip no hover */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
        {!hasContent && <span className="text-white/60"> (em breve)</span>}
      </div>
    </motion.button>
  );
}; 