'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Gift, Percent } from 'lucide-react';
import Image from 'next/image';

interface Sponsor {
  name: string;
  description: string;
  url: string;
  coupon: string;
  category: string;
  color: string;
  iconSrc: string;
}

const SponsorsSection = () => {
  const sponsors: Sponsor[] = [
    {
      name: 'ALFA BET',
      description: 'Cassino online com os melhores jogos e promoções exclusivas',
      url: 'https://cassino.alfa.bet.br/?sign-up=modal&tr_src=influencer&tracking_link=http%3A%2F%2Fjogaralfa.bet%2Fx671897f8',
      coupon: 'leoveio',
      category: 'Gaming',
      color: 'from-red-500 to-orange-500',
      iconSrc: '/alfabet.png'
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
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-4">
            Parceiros Oficiais
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Descontos exclusivos dos nossos patrocinadores! Use o cupom <span className="text-purple-400 font-bold">LEOVEIO</span> e economize.
          </p>
        </motion.div>

        {/* Sponsors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              {/* Glowing Border Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${sponsor.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-300`}></div>
              
              {/* Card Content */}
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <Image
                      src={sponsor.iconSrc}
                      alt={`${sponsor.name} logo`}
                      width={32}
                      height={32}
                      className="rounded-lg object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{sponsor.name}</h3>
                    <span className="text-sm text-white/60">{sponsor.category}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/80 mb-6 leading-relaxed">
                  {sponsor.description}
                </p>

                {/* Coupon */}
                <div className="mb-6 p-4 bg-white/10 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-white/60">Cupom de Desconto</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-lg font-bold text-purple-300">{sponsor.coupon.toUpperCase()}</code>
                        <Percent size={16} className="text-purple-300" />
                      </div>
                    </div>
                    <motion.button
                      className="px-3 py-2 bg-purple-600/20 border border-purple-500/50 rounded-lg text-purple-300 text-sm hover:bg-purple-600/30 transition-colors"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigator.clipboard.writeText(sponsor.coupon)}
                    >
                      Copiar
                    </motion.button>
                  </div>
                </div>

                {/* Action Button */}
                <motion.a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${sponsor.color} hover:shadow-lg transition-all duration-300`}
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

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
            <Gift className="w-5 h-5 text-purple-300" />
            <span className="text-white/90">
              Todos os cupons são <span className="text-purple-300 font-bold">LEOVEIO</span> - Aproveite!
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorsSection; 