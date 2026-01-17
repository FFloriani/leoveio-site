'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Gift, Star, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ActiveSponsor {
  name: string;
  description: string;
  url: string;
  coupon?: string;
  category: string;
  color: string; // Tailwind gradient classes or hex
  glowColor: string; // Hex for shadow
  iconSrc: string;
  isSpecial?: boolean;
  customCreative?: string;
}

interface PreviousSponsor {
  name: string;
  logo: string;
}

interface SponsorsProps {
  onOpenContact?: () => void;
}

const SponsorsSection = ({ onOpenContact }: SponsorsProps = {}) => {
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const handleCopy = (coupon: string) => {
    navigator.clipboard.writeText(coupon);
    setCopiedCoupon(coupon);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const activeSponsors: ActiveSponsor[] = [
    {
      name: 'Riot Games',
      description: 'Vanguarda Hextech - Wild Rift | Parceria oficial como embaixador da comunidade.',
      url: 'https://wildrift.leagueoflegends.com/',
      category: 'PARCEIRO OFICIAL',
      color: 'text-[#00FFB2]',
      glowColor: '#00FFB2',
      iconSrc: '/riotgames.png',
      isSpecial: true
    },
    {
      name: 'Growth',
      description: 'Os melhores suplementos para potencializar seu desempenho nos treinos.',
      url: 'https://www.gsuplementos.com.br/?cupom=LEOVEIO',
      coupon: 'LEOVEIO',
      category: 'SUPLEMENTOS',
      color: 'text-[#DEB066]',
      glowColor: '#DEB066',
      iconSrc: '/growth.png',
      customCreative: '/growthcupom.png'
    },
    {
      name: 'Superbet',
      description: 'A melhor casa de apostas do Brasil. Bônus exclusivo com meu cupom!',
      url: 'https://superbet.bet.br/registro?bonus=LEOVEIO',
      coupon: 'LEOVEIO',
      category: 'BETTING',
      color: 'text-[#FFD700]',
      glowColor: '#FFD700',
      iconSrc: '/superbet.jpeg',
      customCreative: '/superbet.jpeg'
    },
    {
      name: 'Liveup',
      description: 'Alimentação saudável e prática para o seu dia a dia.',
      url: 'https://livup.com.br/',
      coupon: 'LEOVEIO',
      category: 'LIFESTYLE',
      color: 'text-[#00BFFF]',
      glowColor: '#00BFFF',
      iconSrc: '/liveup.jpg'
    }
  ];

  const previousSponsors: PreviousSponsor[] = [
    { name: 'Intel', logo: '/intel.png' },
    { name: 'Coca-Cola', logo: '/cocacola.jpg' },
    { name: 'PicPay', logo: '/picpay.png' },
    { name: 'Santander', logo: '/santander.png' },
    { name: 'Bet365', logo: '/bet365.png' },
    { name: 'Lenovo', logo: '/lenovo.png' },
    { name: 'Estrela Bet', logo: '/estrelabet.png' },
    { name: 'Heineken', logo: '/heineken.png' },
    { name: 'Old Spice', logo: '/oldspice.png' },
    { name: 'TIM', logo: '/tim.jpeg' },
    { name: 'Netflix', logo: '/netflix.jpeg' }
  ];

  return (
    <section className="relative py-24 bg-[#050b0c] overflow-hidden" id="parcerias">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#DEB066]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#DEB066]/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1 rounded-full border border-[#DEB066]/30 bg-[#DEB066]/5 mb-4">
            <span className="text-[#DEB066] text-xs font-bold tracking-[0.2em] uppercase">Patrocínios</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-xl">
            Parcerias <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DEB066] to-[#F1D08B]">Estratégicas</span>
          </h2>
          <div className="w-24 h-1 bg-[#DEB066] mx-auto rounded-full shadow-[0_0_15px_rgba(222,176,102,0.4)] mt-4" />
        </motion.div>

        {/* Active Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 max-w-7xl mx-auto">
          {activeSponsors.map((sponsor, index) => (
            <motion.div
              key={index}
              className="bg-[#0a0f10] border border-[#DEB066]/10 rounded-xl overflow-hidden group hover:border-[#DEB066]/50 hover:shadow-[0_0_20px_rgba(222,176,102,0.1)] transition-all duration-300 relative flex flex-col w-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Special Badge */}
              {sponsor.isSpecial && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="px-2 py-1 bg-[#DEB066] text-black text-[10px] font-black uppercase rounded shadow-lg flex items-center gap-1">
                    <Star size={10} fill="black" /> Oficial
                  </div>
                </div>
              )}

              {/* Image / Creative Area */}
              <div className="h-80 w-full relative bg-[#151a1c] overflow-hidden border-b border-[#DEB066]/10 group-hover:border-[#DEB066]/30 transition-colors">
                {sponsor.customCreative ? (
                  <>
                    {/* Blurred Background for Fill */}
                    <div className="absolute inset-0 opacity-40 blur-2xl scale-125">
                      <Image
                        src={sponsor.customCreative}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Main Image - Maximized */}
                    <div className="absolute inset-0">
                      <Image
                        src={sponsor.customCreative}
                        alt={sponsor.name}
                        fill
                        className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1f20] to-[#050b0c]">
                    <Image
                      src={sponsor.iconSrc}
                      alt={sponsor.name}
                      width={200}
                      height={120}
                      className="object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
                    />
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f10] to-transparent opacity-30" />
              </div>

              {/* Content */}
              <div className="p-6 pt-6 flex-1 flex flex-col relative z-10">
                <div className="mb-4 text-center">
                  <div className={`text-[10px] font-black tracking-widest uppercase mb-2 ${sponsor.color}`}>
                    {sponsor.category}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-wide">{sponsor.name}</h3>
                </div>

                <p className="text-sm text-slate-400 mb-6 flex-1 text-center leading-relaxed">
                  {sponsor.description}
                </p>

                <div className="space-y-3">
                  {/* Coupon Code */}
                  {sponsor.coupon && (
                    <div className="bg-[#DEB066]/5 border border-[#DEB066]/20 dashed rounded-lg p-3 flex items-center justify-between group/coupon hover:bg-[#DEB066]/10 transition-colors">
                      <div className="text-xs text-[#DEB066] font-bold">
                        CUPOM: <span className="text-white text-sm ml-2 tracking-widest font-black">{sponsor.coupon}</span>
                      </div>
                      <button
                        onClick={() => sponsor.coupon && handleCopy(sponsor.coupon)}
                        className="text-[#DEB066]/70 hover:text-[#DEB066] transition-colors p-1"
                        title="Copiar Cupom"
                      >
                        {copiedCoupon === sponsor.coupon ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}

                  {/* Link Button */}
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#DEB066] to-[#B88A44] text-black hover:shadow-[0_0_15px_rgba(222,176,102,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span>Acessar Site</span>
                    <ExternalLink size={14} className="stroke-[3px]" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Previous Sponsors Marquee */}
        <div className="border-t border-[#DEB066]/10 pt-16">
          <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-10 opacity-70">
            Parceiros que fizeram história
          </p>

          <div className="relative overflow-hidden w-full mask-gradient-x py-4 bg-black/20">
            <motion.div
              className="flex gap-16 items-center whitespace-nowrap w-max"
              animate={{ x: ["0%", "-300%"] }}
              transition={{
                duration: 120,
                ease: "linear",
                repeat: Infinity
              }}
            >
              {/* Double output for infinite scroll */}
              {[...previousSponsors, ...previousSponsors].map((sponsor, idx) => (
                <div key={`${sponsor.name}-${idx}`} className="w-28 h-14 relative opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-help transform hover:scale-110" title={sponsor.name}>
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-24 text-center">
          <motion.button
            onClick={onOpenContact}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#0a0f10] border border-[#DEB066] text-[#DEB066] font-black uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(222,176,102,0.1)] hover:bg-[#DEB066] hover:text-black hover:shadow-[0_0_40px_rgba(222,176,102,0.4)] transition-all duration-300"
            whileTap={{ scale: 0.95 }}
          >
            <Gift size={20} className="group-hover:rotate-12 transition-transform stroke-[2.5px]" />
            <span>Seja um Parceiro</span>
          </motion.button>
        </div>

      </div>


    </section >
  );
};

export default SponsorsSection;