'use client';

import { motion } from 'framer-motion';
import { Gamepad2, Clock, Users, Star, Trophy } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

const AboutSection = () => {
  const stats = [
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Horário das Lives',
      value: 'Seg-Sex 17:30-22h',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      label: 'Jogos Principais',
      value: 'Clash Royale, Wild Rift',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Comunidade',
      value: 'Crescendo Sempre',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      label: 'Especialidade',
      value: 'Gaming + IRL',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const games = [
    {
      name: 'Clash Royale',
      description: 'Estratégia e batalhas épicas',
      emoji: '👑',
      color: 'from-blue-600 to-purple-600'
    },
    {
      name: 'Wild Rift',
      description: 'MOBA mobile competitivo',
      emoji: '⚔️',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      name: 'Cassino',
      description: 'Diversão e adrenalina',
      emoji: '🎰',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'React',
      description: 'Desenvolvimento ao vivo',
      emoji: '⚛️',
      color: 'from-cyan-400 to-blue-500'
    }
  ];

  return (
    <AnimatedBackground variant="gaming" intensity="high">
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-6 drop-shadow-2xl"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              Sobre o LeoVeio
            </motion.h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Streamer apaixonado por games, tecnologia e comunidade. Venha fazer parte dessa jornada incrível!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left side - Story */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">Minha História</h3>
                </div>
                
                <p className="text-white/90 leading-relaxed mb-4 drop-shadow-sm">
                  Comecei no mundo dos games ainda jovem e me apaixonei pela possibilidade de conectar pessoas através da diversão. O que começou como hobby se tornou uma paixão que compartilho todos os dias com vocês.
                </p>
                
                <p className="text-white/90 leading-relaxed drop-shadow-sm">
                  Além dos games, sou desenvolvedor e adoro mostrar como a tecnologia funciona por trás das telas. Nas lives de React, vocês podem ver código sendo criado em tempo real!
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">Filosofia</h3>
                </div>
                
                <p className="text-white/90 leading-relaxed drop-shadow-sm">
                  Acredito que os games são mais do que entretenimento - são uma forma de arte, competição e, principalmente, uma maneira de criar laços genuínos com pessoas incríveis como vocês da nossa comunidade.
                </p>
              </div>
            </motion.div>

            {/* Right side - Stats */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3 shadow-lg`}>
                      {stat.icon}
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1 drop-shadow-md">{stat.label}</h4>
                    <p className="text-white/80 text-xs drop-shadow-sm">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-md">Jogos em Destaque</h3>
                <div className="space-y-4">
                  {games.map((game, index) => (
                    <motion.div
                      key={game.name}
                      className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/10 shadow-lg"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${game.color} rounded-lg flex items-center justify-center text-2xl shadow-lg`}>
                        {game.emoji}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold drop-shadow-md">{game.name}</h4>
                        <p className="text-white/70 text-sm drop-shadow-sm">{game.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/30 rounded-full shadow-2xl">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Gamepad2 className="w-6 h-6 text-purple-300" />
              </motion.div>
              <span className="text-white/95 font-medium drop-shadow-sm">
                Vem jogar comigo! Lives todos os dias úteis das 17:30 às 22h
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </AnimatedBackground>
  );
};

export default AboutSection; 