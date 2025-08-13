'use client';

import { motion } from 'framer-motion';
import { Play, Users, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import TwitchPlayer from './TwitchPlayer';

const HeroBanner = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Custom Banner Background */}
      <div className="absolute inset-0">
        <Image
          src="/herobanner.png"
          alt="LeoVeio Banner"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradiente para melhor legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
      </div>

      {/* Background Effects - mais sutis para não competir com o banner */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern - mais sutil */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-24 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Side - Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            
            {/* Main Title */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Título e subtítulo removidos */}
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-lg text-white/80 max-w-lg leading-relaxed drop-shadow-lg backdrop-blur-sm bg-black/20 p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Clash Royale, Wild Rift, Cassino, React e muito mais! Lives de segunda a sexta das 17:30 às 22h com a melhor jogabilidade e uma comunidade incrível.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2 relative z-10">
                  <Play size={20} />
                  <span>Assistir Live</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>

              <motion.button
                className="group relative overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:bg-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  <span>Chat</span>
                </div>
              </motion.button>
            </motion.div>

            {/* Social Stats */}
            <motion.div 
              className="flex gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-center backdrop-blur-sm bg-black/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-white drop-shadow-lg">Seg-Sex</div>
                <div className="text-sm text-white/70">17:30-22h</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-black/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-white drop-shadow-lg">Multi</div>
                <div className="text-sm text-white/70">Games</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-black/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-white drop-shadow-lg">Live+IRL</div>
                <div className="text-sm text-white/70">Soon</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Player Section */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Platform Buttons - Fora do grupo do player */}
            <motion.div 
              className="flex gap-3 mb-4 relative z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.a
                href="https://kick.com/leoveio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600/90 border-2 border-green-400 rounded-lg text-white font-semibold hover:bg-green-500 hover:border-green-300 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-green-500/25 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>Kick</span>
              </motion.a>

              <motion.a
                href="https://www.youtube.com/@leoveioyt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-600/90 border-2 border-red-400 rounded-lg text-white font-semibold hover:bg-red-500 hover:border-red-300 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-red-500/25 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </motion.a>
            </motion.div>

            {/* Player Container */}
            <div className="relative group">
              {/* Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-300 z-0"></div>
              
              {/* Player Container */}
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 z-10">
                <TwitchPlayer channel="leoveio" />
                
                {/* Player Info */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">LEOVEIO</div>
                      <div className="text-sm text-white/60">twitch.tv/leoveio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner; 