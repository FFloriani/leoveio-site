'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Camera, Video } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';

interface EventMedia {
  type: 'image' | 'video';
  src: string;
  alt: string;
}

interface Event {
  id: string;
  title: string;
  year: string;
  location: string;
  description: string;
  folderName: string;
  color: string;
  flag: string;
  media: EventMedia[];
}

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<EventMedia | null>(null);

  const events: Event[] = [
    {
      id: 'china-2023',
      title: 'Ionia Cup - China',
      year: '2023',
      location: 'China',
      description: 'Representou o Brasil no torneio internacional. Única equipe do ocidente convidada.',
      folderName: 'CHINA 2023',
      color: 'from-red-500 to-yellow-500',
      flag: '🇨🇳',
      media: [
        { type: 'video', src: '/CHINA 2023/China 2023 video 1.mp4', alt: 'China 2023 - Vídeo 1' },
        { type: 'video', src: '/CHINA 2023/China 2023 video 2.mp4', alt: 'China 2023 - Vídeo 2' },
        { type: 'video', src: '/CHINA 2023/China 2023 video 3.mp4', alt: 'China 2023 - Vídeo 3' },
        { type: 'image', src: '/CHINA 2023/SaveClip.App_375285684_1401375157116749_9113715993321179520_n.jpg', alt: 'China 2023 - Foto 1' },
        { type: 'image', src: '/CHINA 2023/SaveClip.App_376748361_331980589388989_5832804683005093260_n.jpg', alt: 'China 2023 - Foto 2' },
        { type: 'image', src: '/CHINA 2023/SaveClip.App_377984064_1333674620572333_1238186601170080021_n.jpg', alt: 'China 2023 - Foto 3' },
        { type: 'image', src: '/CHINA 2023/SaveClip.App_377986895_1743984686043184_8999759766424387510_n.jpg', alt: 'China 2023 - Foto 4' },
        { type: 'image', src: '/CHINA 2023/SaveClip.App_378026015_1278586222802452_7430792236341338919_n.jpg', alt: 'China 2023 - Foto 5' },
        { type: 'image', src: '/CHINA 2023/SaveClip.App_378504527_1508760949939951_8064741594926262709_n.jpg', alt: 'China 2023 - Foto 6' },
        { type: 'image', src: '/CHINA 2023/_storage_emulated_0_Download_SaveClip.App_378056514_1038593333953393_4876902194309486671_n.jpg', alt: 'China 2023 - Foto 7' }
      ]
    },
    {
      id: 'china-2024',
      title: 'China Wild Round Smash',
      year: '2024',
      location: 'China',
      description: 'Retorno triunfal à China como titular. Vice-campeão do torneio.',
      folderName: 'CHINA 2024',
      color: 'from-red-500 to-pink-500',
      flag: '🇨🇳',
      media: [
        { type: 'image', src: '/CHINA 2024/SaveClip.App_461284768_420678521019077_1879660322265298447_n.jpg', alt: 'China 2024 - Foto 1' },
        { type: 'image', src: '/CHINA 2024/SaveClip.App_461311477_516591834403744_358591664827263291_n.jpg', alt: 'China 2024 - Foto 2' },
        { type: 'image', src: '/CHINA 2024/SaveClip.App_461372539_2000996677024275_7808445532094938806_n.jpg', alt: 'China 2024 - Foto 3' },
        { type: 'image', src: '/CHINA 2024/SaveClip.App_461394027_3846127635663351_112588862315159057_n.jpg', alt: 'China 2024 - Foto 4' },
        { type: 'image', src: '/CHINA 2024/_storage_emulated_0_Download_SaveClip.App_461469783_1001088901790298_8743263499592766543_n.jpg', alt: 'China 2024 - Foto 5' }
      ]
    },
    {
      id: 'carnawild',
      title: 'CarnaWild',
      year: '2024',
      location: 'Brasil',
      description: 'Evento temático de Carnaval do Wild Rift, representando a comunidade brasileira.',
      folderName: 'CARNAWILD',
      color: 'from-yellow-500 to-orange-500',
      flag: '🇧🇷',
      media: [
        { type: 'image', src: '/CARNAWILD/8K8A0621.JPG', alt: 'CarnaWild - Foto 1' },
        { type: 'image', src: '/CARNAWILD/IMG_0179.JPG', alt: 'CarnaWild - Foto 2' },
        { type: 'image', src: '/CARNAWILD/SaveClip.App_431714817_1137426574377849_8293703766808440070_n.jpg', alt: 'CarnaWild - Foto 3' },
        { type: 'image', src: '/CARNAWILD/SaveClip.App_431731232_937910941361015_5442629646327585930_n.jpg', alt: 'CarnaWild - Foto 4' },
        { type: 'image', src: '/CARNAWILD/SaveClip.App_431743106_974077134396767_3905448022305706502_n.jpg', alt: 'CarnaWild - Foto 5' },
        { type: 'image', src: '/CARNAWILD/SaveClip.App_432075870_425616029981963_3017957128102257524_n.jpg', alt: 'CarnaWild - Foto 6' },
        { type: 'image', src: '/CARNAWILD/SaveClip.App_432075877_331726206031225_5794561401953064243_n.jpg', alt: 'CarnaWild - Foto 7' },
        { type: 'image', src: '/CARNAWILD/SaveClip.App_432080805_727125339530771_2997236572239213131_n.jpg', alt: 'CarnaWild - Foto 8' },
        { type: 'image', src: '/CARNAWILD/SaveClip.App_432244327_1079637046710120_4037109754828004297_n.jpg', alt: 'CarnaWild - Foto 9' }
      ]
    },
    {
      id: 'arraia-no-rift',
      title: 'Arraiá no Rift',
      year: '2024',
      location: 'Brasil',
      description: 'Evento especial de festa junina do Wild Rift, celebrando as tradições brasileiras.',
      folderName: 'ARRAIA NO RIFT',
      color: 'from-green-500 to-yellow-500',
      flag: '🇧🇷',
      media: [
        { type: 'image', src: '/ARRAIA NO RIFT/SaveClip.App_449749256_848248500543163_7501240635089623146_n.jpg', alt: 'Arraiá no Rift - Foto 1' },
        { type: 'image', src: '/ARRAIA NO RIFT/SaveClip.App_449774461_705805158338136_594600703762436771_n.jpg', alt: 'Arraiá no Rift - Foto 2' },
        { type: 'image', src: '/ARRAIA NO RIFT/SaveClip.App_449799949_506107535106963_2947371221924181468_n.jpg', alt: 'Arraiá no Rift - Foto 3' },
        { type: 'image', src: '/ARRAIA NO RIFT/SaveClip.App_449863352_3659477017626117_7747038631392297204_n.jpg', alt: 'Arraiá no Rift - Foto 4' },
        { type: 'image', src: '/ARRAIA NO RIFT/SaveClip.App_449870762_460350323407516_1077441658275613462_n.jpg', alt: 'Arraiá no Rift - Foto 5' },
        { type: 'image', src: '/ARRAIA NO RIFT/SaveClip.App_449875921_2197401860637351_3308673960674269473_n.jpg', alt: 'Arraiá no Rift - Foto 6' }
      ]
    },
    {
      id: 'wild-play-brasilia',
      title: 'Wild Play Brasília',
      year: '2024',
      location: 'Brasília, Brasil',
      description: 'Grande torneio presencial de Wild Rift em Brasília, reunindo os melhores jogadores do país.',
      folderName: 'WILD PLAY BRASILIA',
      color: 'from-green-600 to-blue-500',
      flag: '🏛️',
      media: [
        { type: 'video', src: '/WILD PLAY BRASILIA/WILD PLAY BRASILIA.mp4', alt: 'Wild Play Brasília - Vídeo' }
      ]
    },
    {
      id: 'coca-cola',
      title: 'Parceria Coca-Cola',
      year: '2024',
      location: 'Brasil',
      description: 'Colaboração especial com a Coca-Cola para campanha publicitária.',
      folderName: 'COCA-COLA',
      color: 'from-red-600 to-red-400',
      flag: '🥤',
      media: [
        { type: 'video', src: '/COCA-COLA/COCA-COLA.mp4', alt: 'Coca-Cola - Campanha' }
      ]
    }
  ];

  const handleEventClick = (eventId: string) => {
    setSelectedEvent(selectedEvent === eventId ? null : eventId);
  };

  const handleMediaClick = (media: EventMedia) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <AnimatedBackground variant="gaming" intensity="low">
      <div className="min-h-screen py-8 pt-24">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </Link>
          </motion.div>

          {/* Page Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-4 drop-shadow-2xl">
              Principais Eventos e Conquistas
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Acompanhe toda a trajetória internacional e momentos especiais
            </p>
          </motion.div>

          {/* Events Grid */}
          <div className="space-y-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Event Header */}
                <motion.div
                  className={`h-2 bg-gradient-to-r ${event.color}`}
                  layoutId={`header-${event.id}`}
                />
                
                <div className="p-6">
                  {/* Event Info */}
                  <motion.button
                    onClick={() => handleEventClick(event.id)}
                    className="w-full text-left group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{event.flag}</span>
                        <div>
                          <h2 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                            {event.title}
                          </h2>
                          <div className="flex items-center gap-4 text-white/60 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {event.year}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-white/60">
                        {selectedEvent === event.id ? '▼' : '▶'}
                      </div>
                    </div>
                    
                    <p className="text-white/80 leading-relaxed">
                      {event.description}
                    </p>
                  </motion.button>

                  {/* Media Gallery */}
                  {selectedEvent === event.id && (
                    <motion.div
                      className="mt-6 pt-6 border-t border-white/10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {event.media.map((media, mediaIndex) => (
                          <motion.div
                            key={mediaIndex}
                            className="relative aspect-square group cursor-pointer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: mediaIndex * 0.1 }}
                            onClick={() => handleMediaClick(media)}
                          >
                            {media.type === 'image' ? (
                              <Image
                                src={media.src}
                                alt={media.alt}
                                fill
                                className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                                <video
                                  src={media.src}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  muted
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <Video size={32} className="text-white drop-shadow-lg" />
                                </div>
                              </div>
                            )}
                            
                            {/* Media Type Indicator */}
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1">
                              {media.type === 'image' ? (
                                <Camera size={16} className="text-white" />
                              ) : (
                                <Video size={16} className="text-white" />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Media Modal */}
        {selectedMedia && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'image' ? (
                <Image
                  src={selectedMedia.src}
                  alt={selectedMedia.alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={selectedMedia.src}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[90vh] rounded-lg"
                />
              )}
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default EventsPage;
