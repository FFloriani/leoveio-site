'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Youtube, Instagram } from 'lucide-react';
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
      url: 'https://discord.gg/HpSPGs7kQ7',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      ),
      color: 'from-indigo-500 to-blue-500',
      description: 'Comunidade'
    },
    {
      name: 'WhatsApp',
      username: 'Grupo',
      url: 'https://chat.whatsapp.com/JUotvnWvLi2D8eoqfQ1OB2?mode=ac_t',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      description: 'Grupo do Zap'
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
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
