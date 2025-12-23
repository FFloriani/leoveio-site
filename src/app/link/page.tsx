'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LinkItem {
  name: string;
  url: string;
  icon: string;
  color: string;
  description?: string;
  isNew?: boolean;
}

const LinkTreePage = () => {
  const socialLinks: LinkItem[] = [
    {
      name: 'Twitch',
      url: 'https://www.twitch.tv/leoveio',
      icon: 'twitch',
      color: 'from-purple-500 to-purple-600',
      description: 'Lives ao vivo • Seg-Sex 17:30'
    },
    {
      name: 'Kick',
      url: 'https://www.kick.com/leoveio',
      icon: 'kick',
      color: 'from-green-500 to-green-600',
      description: 'Stream alternativo'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@LeoVeio',
      icon: 'youtube',
      color: 'from-red-500 to-red-600',
      description: 'Vídeos e Highlights'
    },
    {
      name: 'YouTube Forras',
      url: 'https://www.youtube.com/@LeoVeioYT',
      icon: 'youtube',
      color: 'from-orange-500 to-orange-600',
      description: 'Conteúdo de Cassino'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/leoveio/',
      icon: 'instagram',
      color: 'from-pink-500 to-purple-500',
      description: 'Fotos e Stories'
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/HpSPGs7kQ7',
      icon: 'discord',
      color: 'from-indigo-500 to-blue-500',
      description: 'Comunidade LEOVEIO'
    },
    {
      name: 'WhatsApp',
      url: 'https://chat.whatsapp.com/JUotvnWvLi2D8eoqfQ1OB2',
      icon: 'whatsapp',
      color: 'from-green-500 to-emerald-500',
      description: 'Grupo do Zap'
    },
  ];

  const sponsorLinks: LinkItem[] = [
    {
      name: 'Superbet',
      url: 'https://superbet.bet.br/registro?bonus=LEOVEIO',
      icon: 'superbet',
      color: 'from-red-500 to-yellow-500',
      description: 'Cupom: LEOVEIO',
      isNew: true
    },
    {
      name: 'Growth Suplementos',
      url: 'https://www.gsuplementos.com.br/?cupom=LEOVEIO',
      icon: 'growth',
      color: 'from-green-500 to-emerald-500',
      description: 'Cupom: LEOVEIO (até 14% OFF)'
    },
    {
      name: 'Liveup',
      url: 'https://livup.com.br/?utm_source=instagram&utm_medium=influencers&utm_campaign=creator_awon_leoveio',
      icon: 'liveup',
      color: 'from-blue-500 to-cyan-500',
      description: 'Cupom: LEOVEIO (até 25% OFF)'
    },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'twitch':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
          </svg>
        );
      case 'kick':
        return (
          <Image src="/kick.png" alt="Kick" width={24} height={24} className="object-contain" />
        );
      case 'youtube':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'discord':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        );
      case 'superbet':
        return (
          <Image src="/superbet.jpeg" alt="Superbet" width={24} height={24} className="object-contain rounded" />
        );
      case 'growth':
        return (
          <Image src="/growth.png" alt="Growth" width={24} height={24} className="object-contain rounded" />
        );
      case 'liveup':
        return (
          <Image src="/liveup.jpg" alt="Liveup" width={24} height={24} className="object-contain rounded" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      {/* Efeitos de fundo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header / Perfil */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 p-1">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  LV
                </span>
              </div>
            </div>
            {/* Status online */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-slate-900 animate-pulse"></div>
          </div>

          {/* Nome */}
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-2">
            LEOVEIO
          </h1>
          
          {/* Bio */}
          <p className="text-white/70 text-sm mb-2">
            Streamer Profissional • Vanguarda Hextech 🏆
          </p>
          <p className="text-white/50 text-xs">
            Lives: Seg-Sex 17:30 às 22:00
          </p>
        </motion.div>

        {/* Seção: Redes Sociais */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4 text-center">
            Redes Sociais
          </h2>
          
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full p-4 rounded-2xl bg-gradient-to-r ${link.color} bg-opacity-20 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-[1.02] transition-all duration-300 group`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${link.color} flex items-center justify-center text-white shadow-lg`}>
                    {renderIcon(link.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">{link.name}</div>
                    {link.description && (
                      <div className="text-sm text-white/60">{link.description}</div>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Seção: Patrocinadores */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4 text-center">
            🎁 Cupons Exclusivos
          </h2>
          
          <div className="space-y-3">
            {sponsorLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full p-4 rounded-2xl bg-gradient-to-r ${link.color} backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index + 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {link.isNew && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-white text-black text-xs font-bold rounded-full">
                    NOVO
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-lg backdrop-blur-sm">
                    {renderIcon(link.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">{link.name}</div>
                    {link.description && (
                      <div className="text-sm text-white/80 font-medium">{link.description}</div>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            leoveio.com
          </a>
          <p className="text-white/30 text-xs mt-2">
            © 2024 LEOVEIO • Todos os direitos reservados
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LinkTreePage;

