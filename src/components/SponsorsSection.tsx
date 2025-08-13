'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Gift, Percent, Star } from 'lucide-react';
import Image from 'next/image';
import AnimatedBackground from './AnimatedBackground';

interface ActiveSponsor {
  name: string;
  description: string;
  url: string;
  coupon?: string;
  category: string;
  color: string;
  iconSrc: string;
  isSpecial?: boolean;
}

interface PreviousSponsor {
  name: string;
  category: string;
  logo: string;
}

interface SponsorsProps {
  onOpenContact?: () => void;
}

const SponsorsSection = ({ onOpenContact }: SponsorsProps = {}) => {
  const activeSponsors: ActiveSponsor[] = [
    {
      name: 'Riot Games',
      description: 'Vanguarda Hextech - Wild Rift | Parceria oficial como embaixador da comunidade',
      url: 'https://wildrift.leagueoflegends.com/',
      category: 'Gaming Partner',
      color: 'from-yellow-500 via-blue-500 to-cyan-400',
      iconSrc: '/growth.png', // Temporário - adicione riot-games.png na pasta public
      isSpecial: true
    },
    {
      name: 'ExitLag',
      description: 'Otimização de conexão para jogos - Reduza seu ping e melhore sua gameplay',
      url: 'https://exitlag.com/',
      coupon: 'leoveio',
      category: 'Gaming Tech',
      color: 'from-blue-600 to-purple-600',
      iconSrc: '/exitlag.png'
    },
    {
      name: 'Growth Suplementos',
      description: 'Os melhores suplementos para potencializar seu desempenho',
      url: 'https://gsuplementos.com.br/?cupom=leoveio&fbclid=PAZXh0bgNhZW0CMTEAAaYymVSEnYVah0jtjA-iFznsCVNua1YmF8_DqN020XoqMjWQwSLfs3KOZSo_aem_hASjju_cOhW62kSJdH7sbQ',
      coupon: 'leoveio',
      category: 'Fitness',
      color: 'from-green-500 to-emerald-500',
      iconSrc: '/growth.png'
    },
    {
      name: 'Liveup',
      description: 'Produtos naturais e saudáveis para uma vida melhor',
      url: 'https://livup.com.br/?utm_source=instagram&utm_medium=influencers&utm_campaign=creator_awon_leoveio',
      coupon: 'leoveio',
      category: 'Lifestyle',
      color: 'from-blue-500 to-cyan-500',
      iconSrc: '/liveup.jpg'
    },
    {
      name: 'ALFA BET',
      description: 'Cassino online com os melhores jogos e promoções exclusivas',
      url: 'https://cassino.alfa.bet.br/?sign-up=modal&tr_src=influencer&tracking_link=http%3A%2F%2Fjogaralfa.bet%2Fx671897f8',
      coupon: 'leoveio',
      category: 'Entertainment',
      color: 'from-red-500 to-orange-500',
      iconSrc: '/alfabet.png'
    }
  ];

  const previousSponsors: PreviousSponsor[] = [
    { name: 'Intel', category: 'Tech', logo: '/intel.png' },
    { name: 'Coca-Cola', category: 'Bebidas', logo: '/cocacola.jpg' },
    { name: 'PicPay', category: 'Fintech', logo: '/picpay.png' },
    { name: 'Santander', category: 'Banco', logo: '/santander.png' },
    { name: 'Bet365', category: 'Gaming', logo: '/bet365.png' },
    { name: 'Betano', category: 'Gaming', logo: '/betano.jpg' },
    { name: 'Lenovo', category: 'Tech', logo: '/lenovo.png' },
    { name: 'Estrela Bet', category: 'Gaming', logo: '/estrelabet.png' },
    { name: 'Heineken', category: 'Bebidas', logo: '/heineken.png' },
    { name: 'Old Spice', category: 'Cuidados', logo: '/oldspice.png' },
    { name: 'TIM', category: 'Telecom', logo: '/tim.jpeg' },
    { name: 'Johnnie Walker', category: 'Bebidas', logo: '/johnnie walker.png' },
    { name: 'Blizzard', category: 'Gaming', logo: '/blizzard.png' },
    { name: 'Estácio', category: 'Educação', logo: '/estacio.png' },
    { name: 'Netflix', category: 'Streaming', logo: '/netflix.jpeg' }
  ];

  return (
    <AnimatedBackground variant="tropical" intensity="medium">
      <section className="relative py-20">
        <div className="relative z-10 container mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-4 drop-shadow-lg">
              Parceiros & Patrocinadores
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Parcerias estratégicas que impulsionam o crescimento da comunidade
            </p>
          </motion.div>

          {/* Active Sponsors - Main Partners */}
          <div className="mb-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                Parceiros Ativos
                <Star className="w-8 h-8 text-yellow-400" />
              </h3>
              <p className="text-white/70">
                Descontos exclusivos! Use o cupom <span className="text-purple-400 font-bold">LEOVEIO</span>
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  {/* Special Partner Badge */}
                  {sponsor.isSpecial && (
                    <div className="absolute -top-3 -right-3 z-20">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        🏆 OFICIAL
                      </div>
                    </div>
                  )}

                  {/* Glowing Border Effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${sponsor.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-300`}></div>
                  
                  {/* Card Content */}
                  <div className="relative bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/10">
                        <Image
                          src={sponsor.iconSrc}
                          alt={`${sponsor.name} logo`}
                          width={32}
                          height={32}
                          className="rounded-lg object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white drop-shadow-md">{sponsor.name}</h3>
                        <span className="text-sm text-white/70">{sponsor.category}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/90 mb-6 leading-relaxed drop-shadow-sm text-sm">
                      {sponsor.description}
                    </p>

                    {/* Coupon - Only if exists */}
                    {sponsor.coupon && (
                      <div className="mb-6 p-4 bg-white/20 rounded-lg border border-white/30 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-white/80">Cupom de Desconto</span>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-lg font-bold text-purple-300 drop-shadow-md">{sponsor.coupon.toUpperCase()}</code>
                              <Percent size={16} className="text-purple-300" />
                            </div>
                          </div>
                          <motion.button
                            className="px-3 py-2 bg-purple-600/30 border border-purple-400/50 rounded-lg text-purple-200 text-sm hover:bg-purple-600/50 transition-colors backdrop-blur-sm"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigator.clipboard.writeText(sponsor.coupon || '')}
                          >
                            Copiar
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <motion.a
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${sponsor.color} hover:shadow-lg transition-all duration-300 shadow-lg`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ExternalLink size={18} />
                      <span>Acessar {sponsor.name}</span>
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Previous Collaborations - Continuous Slide */}
          <motion.div
            className="mt-16 pt-16 border-t border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h3 className="text-xl lg:text-2xl font-bold text-white/90 mb-4">
                Colaborações Anteriores
              </h3>
              <p className="text-white/60 text-sm">
                Marcas que já confiaram no trabalho do LeoVeio
              </p>
            </div>

            {/* Continuous Slider */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-8 items-center"
                animate={{ x: ['0%', '-100%'] }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ width: '200%' }}
              >
                {/* First set */}
                {previousSponsors.map((sponsor, index) => (
                  <div
                    key={`first-${sponsor.name}`}
                    className="flex-shrink-0 w-24 h-24 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      width={72}
                      height={72}
                      className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
                
                {/* Duplicate set for seamless loop */}
                {previousSponsors.map((sponsor, index) => (
                  <div
                    key={`second-${sponsor.name}`}
                    className="flex-shrink-0 w-24 h-24 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      width={72}
                      height={72}
                      className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Call to Action - Clickable */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={onOpenContact}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/30 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gift className="w-6 h-6 text-purple-300" />
              <div className="text-center">
                <div className="text-white/95 font-medium drop-shadow-sm">
                  Quer ser nosso parceiro?
                </div>
                <div className="text-white/70 text-sm">
                  Entre em contato
                </div>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </AnimatedBackground>
  );
};

export default SponsorsSection;