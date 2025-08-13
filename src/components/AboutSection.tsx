'use client';

import { motion } from 'framer-motion';
import { Gamepad2, Clock, Users, Star, Trophy, Award, MapPin, Calendar, Download, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import AnimatedBackground from './AnimatedBackground';
import EventGallery from './EventGallery';

const AboutSection = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

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
      icon: <Award className="w-6 h-6" />,
      label: 'Vanguarda Hextech',
      value: 'Único Representante',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const achievements = [
    {
      title: 'Vanguarda Hextech Wild Rift',
      description: 'Único representante do seleto grupo da Riot Games',
      icon: <Star className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Transformação Pessoal',
      description: 'Superação inspiradora: perda de 70kg',
      icon: <Trophy className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Representante Internacional',
      description: 'Brasil nos principais eventos mundiais',
      icon: <MapPin className="w-8 h-8" />,
      color: 'from-blue-500 to-purple-500'
    }
  ];

  const events = [
    {
      id: 'china-2023',
      title: 'Ionia Cup - China',
      year: '2023',
      location: 'China',
      achievement: '3º Lugar',
      description: 'Representou o Brasil no torneio internacional. Única equipe do ocidente convidada. Entrevista emocionante em inglês com homenagem à sua mãe.',
      highlights: [
        'Único país do ocidente convidado',
        'Entrevista em inglês na TV chinesa',
        'Homenagem emocionante à sua mãe'
      ],
      folderName: 'CHINA 2023',
      color: 'from-red-500 to-yellow-500',
      flag: '🇨🇳'
    },
    {
      id: 'china-2024',
      title: 'China Wild Round Smash',
      year: '2024',
      location: 'China',
      achievement: '2º Lugar',
      description: 'Retorno triunfal à China como titular. Liderou vitórias memoráveis contra times da Coreia e China, conquistando a vice-liderança.',
      highlights: [
        'Vitórias contra times coreanos',
        'Derrotou equipes chinesas',
        'Vice-campeão do torneio'
      ],
      folderName: 'CHINA 2024',
      color: 'from-red-500 to-pink-500',
      flag: '🇨🇳'
    },
    {
      id: 'carnawild',
      title: 'CarnaWild',
      year: '2024',
      location: 'Brasil',
      achievement: 'Evento Especial',
      description: 'Participação no evento temático de Carnaval do Wild Rift, representando a comunidade brasileira com muito estilo e diversão.',
      highlights: [
        'Evento temático brasileiro',
        'Representação da comunidade',
        'Conteúdo exclusivo'
      ],
      folderName: 'CARNAWILD',
      color: 'from-yellow-500 to-orange-500',
      flag: '🇧🇷'
    },
    {
      id: 'arraia-no-rift',
      title: 'Arraiá no Rift',
      year: '2024',
      location: 'Brasil',
      achievement: 'Festa Junina',
      description: 'Evento especial de festa junina do Wild Rift, celebrando as tradições brasileiras no universo dos jogos.',
      highlights: [
        'Celebração da cultura brasileira',
        'Evento temático junino',
        'Interação com a comunidade'
      ],
      folderName: 'ARRAIA NO RIFT',
      color: 'from-green-500 to-yellow-500',
      flag: '🇧🇷'
    },
    {
      id: 'hex-rift',
      title: 'Hex Rift',
      year: '2024',
      location: 'Brasil',
      achievement: 'Evento Hextech',
      description: 'Participação no evento especial Hex Rift, explorando as tecnologias Hextech do universo de League of Legends.',
      highlights: [
        'Tecnologia Hextech',
        'Evento exclusivo',
        'Conteúdo especial'
      ],
      folderName: 'HEX-RIFT',
      color: 'from-blue-500 to-purple-500',
      flag: '🔧'
    },
    {
      id: 'coca-cola',
      title: 'Parceria Coca-Cola',
      year: '2024',
      location: 'Brasil',
      achievement: 'Campanha Publicitária',
      description: 'Colaboração especial com a Coca-Cola para campanha publicitária, unindo gaming e uma das maiores marcas do mundo.',
      highlights: [
        'Parceria com marca global',
        'Campanha publicitária',
        'Alcance nacional'
      ],
      folderName: 'COCA-COLA',
      color: 'from-red-600 to-red-400',
      flag: '🥤'
    },
    {
      id: 'wild-play-brasilia',
      title: 'Wild Play Brasília',
      year: '2024',
      location: 'Brasília, Brasil',
      achievement: 'Torneio Presencial',
      description: 'Participação no grande torneio presencial de Wild Rift em Brasília, reunindo os melhores jogadores do país.',
      highlights: [
        'Torneio presencial',
        'Capital federal',
        'Elite do Wild Rift brasileiro'
      ],
      folderName: 'WILD PLAY BRASILIA',
      color: 'from-green-600 to-blue-500',
      flag: '🏛️'
    }
  ];

  const handleDownloadMediaKit = () => {
    const link = document.createElement('a');
    link.href = '/MÍDIA KIT LEO VEIO.pdf';
    link.download = 'MÍDIA KIT LEO VEIO.pdf';
    link.click();
  };

  return (
    <AnimatedBackground variant="gaming" intensity="medium">
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
                    Reconhecido como o <strong className="text-yellow-400">único representante do seleto grupo "Vanguarda Hextech"</strong> do Wild Rift, uma honraria concedida pela Riot Games a jogadores talentosos e comprometidos com a comunidade do jogo.
                  </p>
                  
                  <p>
                    Além de sua atuação nos games, LEOVEIO também compartilha uma <strong className="text-green-400">inspiradora história de superação pessoal</strong>, tendo passado por uma significativa transformação física ao perder <strong className="text-emerald-400">70 quilos</strong>, um feito que inspira muitos de seus seguidores.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right - Achievements */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Principais Conquistas</h3>
              
              {achievements.map((achievement, index) => (
                    <motion.div
                  key={achievement.title}
                  className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                    >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${achievement.color}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">{achievement.title}</h4>
                      <p className="text-white/80 text-sm">{achievement.description}</p>
                      </div>
                      </div>
                    </motion.div>
                  ))}
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

          {/* Events Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl lg:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-12">
              Principais Eventos e Conquistas
            </h3>

            <div className="grid lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedEvent(event.id)}
                >
                  {/* Header */}
                  <div className={`h-4 bg-gradient-to-r ${event.color}`}></div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{event.flag}</span>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="w-4 h-4" />
                        {event.year}
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
                    <div className="text-sm text-white/70 mb-1">{event.location}</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${event.color} text-white mb-4`}>
                      {event.achievement}
                    </div>

                    <p className="text-white/80 text-sm mb-4 leading-relaxed">{event.description}</p>

                    {/* Highlights */}
                    <div className="space-y-2 mb-4">
                      {event.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white/70">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          {highlight}
                        </div>
                      ))}
                    </div>

                    {/* Gallery Indicators */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <ImageIcon className="w-4 h-4" />
                        <span>Fotos & Vídeos</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-purple-400 ml-auto group-hover:text-purple-300 transition-colors">
                        <span>Ver Galeria</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Event Gallery Modal */}
        {selectedEvent && (
          <EventGallery
            event={events.find(e => e.id === selectedEvent)}
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </section>
    </AnimatedBackground>
  );
};

export default AboutSection; 