'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Youtube, Instagram, MessageCircle } from 'lucide-react';
import Image from 'next/image';

interface SocialNetwork {
  name: string;
  username: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const Footer = () => {
  const socialNetworks: SocialNetwork[] = [
    {
      name: 'YouTube',
      username: 'LeoVeio',
      url: 'https://www.youtube.com/@LeoVeio',
      icon: <Youtube size={24} />,
      color: 'from-red-500 to-red-600',
      description: 'Vídeos e Highlights'
    },
    {
      name: 'YouTube Forras',
      username: 'LeoVeioYT',
      url: 'https://www.youtube.com/@LeoVeioYT',
      icon: <Youtube size={24} />,
      color: 'from-orange-500 to-orange-600',
      description: 'Conteúdo de Forras'
    },
    {
      name: 'Instagram',
      username: 'leoveio',
      url: 'https://www.instagram.com/leoveio/',
      icon: <Instagram size={24} />,
      color: 'from-pink-500 to-purple-500',
      description: 'Fotos e Stories'
    },
    {
      name: 'Twitch',
      username: 'leoveio',
      url: 'https://www.twitch.tv/leoveio',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      description: 'Lives Diárias'
    },
    {
      name: 'Kick',
      username: 'leoveio',
      url: 'https://www.kick.com/leoveio',
      icon: (
        <Image
          src="/kick.png"
          alt="Kick"
          width={24}
          height={24}
          className="object-contain"
        />
      ),
      color: 'from-green-500 to-green-600',
      description: 'Streams Alternativas'
    },
    {
      name: 'Discord',
      username: 'LEOVEIO',
      url: 'https://discord.gg/leoveio',
      icon: <MessageCircle size={24} />,
      color: 'from-indigo-500 to-blue-500',
      description: 'Comunidade'
    }
  ];

  return (
    <footer className="relative bg-black/60 backdrop-blur-lg border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-8">
          
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-4">
              LEOVEIO
            </h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Streamer profissional especializado em Wild Rift e Clash Royale. 
              Vanguarda Hextech da Riot Games e inspiração na jornada de transformação.
            </p>
            <div className="text-sm text-white/60">
              <p>📅 Lives: Segunda à Sexta</p>
              <p>🕐 Horário: 17:30 às 22:00</p>
            </div>
          </motion.div>

          {/* Social Networks */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-white mb-6">Redes Sociais</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {socialNetworks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 text-center">
                    {/* Icon */}
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-lg`}>
                      {social.icon}
                    </div>

                    {/* Content */}
                    <h5 className="text-sm font-semibold text-white mb-1">
                      {social.name}
                    </h5>
                    <p className="text-xs text-white/60 mb-2">
                      @{social.username}
                    </p>
                    <p className="text-xs text-white/50">
                      {social.description}
                    </p>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* External Link Icon */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ExternalLink size={12} className="text-white/70" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-white/60 text-center md:text-left">
            © 2024 LEOVEIO. Todos os direitos reservados.
            <br />
            <span className="text-xs text-white/40">
              Site criado por{' '}
              <a 
                href="https://wa.me/+5511917163488" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors underline"
              >
                Floriani
              </a>
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-white/50">
            <span>🎮 Vanguarda Hextech</span>
            <span>🏆 Campeão Internacional</span>
            <span>💪 Transformação 70kg</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
