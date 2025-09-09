'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { LazyTwitchPlayer } from './LazyComponents';

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
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left Side - Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >

            {/* Main Title */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 drop-shadow-2xl">
                LEOVEIO
              </h1>
              <h2 className="text-2xl lg:text-3xl font-bold text-white/90 drop-shadow-lg">
                Streamer Profissional
              </h2>
            </motion.div>

            {/* Description - More concise */}
            <motion.p
              className="text-lg text-white/80 max-w-md leading-relaxed drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              🎮 <strong>Vanguarda Hextech</strong> da Riot Games
              <br />
              🏆 <strong>70kg</strong> perdidos em transformação
              <br />
              🌟 <strong>Campeão Internacional</strong>
              <br /><br />
              <span className="text-purple-300 font-semibold">Lives diárias • 17:30 às 22:00</span>
            </motion.p>

            {/* Games - Simplified */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { name: 'Clash Royale', color: 'from-blue-500 to-purple-500' },
                { name: 'Wild Rift', color: 'from-cyan-500 to-blue-500' },
                { name: 'Cassino', color: 'from-yellow-500 to-orange-500' }
              ].map((game, index) => (
                <motion.div
                  key={game.name}
                  className={`px-4 py-2 bg-gradient-to-r ${game.color} rounded-full text-white font-semibold text-sm shadow-lg`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {game.name}
                </motion.div>
              ))}
            </motion.div>

          </motion.div>

          {/* Right Side - Player Section */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Platform Buttons */}
            <motion.div
              className="flex flex-wrap gap-3 mb-8 relative z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Twitch */}
              <motion.a
                href="https://www.twitch.tv/leoveio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-purple-600/90 border-2 border-purple-400 rounded-xl text-white font-semibold hover:bg-purple-500 hover:border-purple-300 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-purple-500/25 cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
                <span className="text-sm font-bold">TWITCH</span>
              </motion.a>

              {/* Kick */}
              <motion.a
                href="https://kick.com/leoveio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-green-600/90 border-2 border-green-400 rounded-xl text-white font-semibold hover:bg-green-500 hover:border-green-300 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-green-500/25 cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/kick.png"
                  alt="Kick logo"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
                <span className="text-sm font-bold">KICK</span>
              </motion.a>

              {/* YouTube */}
              <motion.a
                href="https://www.youtube.com/@LeoVeio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-red-600/90 border-2 border-red-400 rounded-xl text-white font-semibold hover:bg-red-500 hover:border-red-300 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-red-500/25 cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-sm font-bold">YOUTUBE</span>
              </motion.a>
            </motion.div>

            {/* Player Container */}
            <div className="relative group">
              {/* Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-300 z-0"></div>

              {/* Player Container */}
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 z-10">
                <LazyTwitchPlayer channel="leoveio" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner; 