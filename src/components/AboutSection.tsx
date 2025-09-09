'use client';

import { motion } from 'framer-motion';
import { Gamepad2, Clock, Users, Star, Trophy, Download } from 'lucide-react';
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
      icon: <Star className="w-6 h-6" />,
      label: 'Vanguarda Hextech',
      value: 'Único Representante',
      color: 'from-yellow-500 to-orange-500'
    }
  ];



  const handleDownloadMediaKit = () => {
    const link = document.createElement('a');
    link.href = '/MÍDIA KIT LEO VEIO.pdf';
    link.download = 'MÍDIA KIT LEO VEIO.pdf';
    link.click();
  };

  return (
    <AnimatedBackground variant="tropical" intensity="medium">
      <section className="relative py-20" id="sobre">
        <div className="relative z-10 container mx-auto px-4">
          
          {/* Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-6 drop-shadow-lg">
              Quem é LEOVEIO?
            </h2>
            
            {/* Download Media Kit Button */}
            <motion.button
              onClick={handleDownloadMediaKit}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm border border-white/20 mb-8"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(168, 85, 247, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={20} />
              <span>Download Mídia Kit</span>
            </motion.button>
          </motion.div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            
            {/* Left - Story */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  A Jornada de um Campeão
                </h3>
                
                <div className="space-y-4 text-white/90 leading-relaxed">
                  <p>
                    <strong className="text-purple-400">LEOVEIO</strong> é um streamer brasileiro proeminente, especialmente conhecido na comunidade de <strong className="text-cyan-400">League of Legends: Wild Rift</strong>. Sua jornada no mundo dos eSports e criação de conteúdo é marcada por dedicação, perseverança e uma capacidade notável de superar desafios.
                  </p>
                  
                  <p>
                    Reconhecido como o <strong className="text-yellow-400">único representante do seleto grupo &ldquo;Vanguarda Hextech&rdquo;</strong> do Wild Rift, uma honraria concedida pela Riot Games a jogadores talentosos e comprometidos com a comunidade do jogo.
                  </p>
                  
                  <p>
                    Além de sua atuação nos games, LEOVEIO também compartilha uma <strong className="text-green-400">inspiradora história de superação pessoal</strong>, tendo passado por uma significativa transformação física ao perder <strong className="text-emerald-400">70 quilos</strong>, um feito que inspira muitos de seus seguidores.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right - Key Highlights */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Momentos Marcantes</h3>
              
              <motion.div
                className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Star className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">Vanguarda Hextech Wild Rift</h4>
                    <p className="text-white/80 text-sm">Único representante do seleto grupo da Riot Games</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">Transformação Inspiradora</h4>
                    <p className="text-white/80 text-sm">Jornada de superação com perda de 70kg</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-sm text-white/70 mb-1">{stat.label}</div>
                <div className="font-semibold text-white">{stat.value}</div>
              </motion.div>
            ))}
          </motion.div>

        </div>

      </section>
    </AnimatedBackground>
  );
};

export default AboutSection; 