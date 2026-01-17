'use client';

import { motion } from 'framer-motion';
import { Trophy, Globe, Activity, Users, Star, Target, Dumbbell, MapPin, Rocket, Instagram } from 'lucide-react';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section className="relative py-24 bg-[#050b0c] overflow-hidden" id="sobre">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DEB066] rounded-full blur-[128px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00FFB2] rounded-full blur-[128px] opacity-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-4">
            Media <span className="text-[#DEB066]">Kit</span>
          </h2>
          <div className="w-24 h-1 bg-[#DEB066] mx-auto rounded-full" />
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

          {/* 1. QUEM É LÉO VEIO (Main Bio) - Large Block */}
          <motion.div
            className="md:col-span-6 lg:col-span-8 row-span-2 bg-[#0a0f10] border border-[#DEB066]/20 rounded-3xl p-8 relative overflow-hidden group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Rocket size={120} strokeWidth={1} />
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase mb-6 flex items-center gap-3">
              Quem é <span className="text-[#DEB066]">Léo Veio?</span>
              <div className="px-3 py-1 bg-[#DEB066]/10 border border-[#DEB066] rounded text-[10px] text-[#DEB066] not-italic tracking-widest">STREAMER</div>
            </h3>

            <div className="space-y-4 text-slate-300 leading-relaxed font-light text-sm md:text-base text-justify">
              <p>
                LÉO VEIO É UM STREAMER DEDICADO E APAIXONADO POR <strong className="text-white">WILD RIFT</strong>, CONHECIDO POR SUA PERSEVERANÇA E ESFORÇO INCANSÁVEL. COM UMA TRAJETÓRIA MARCADA POR DESAFIOS E CONQUISTAS.
              </p>
              <p className="border-l-4 border-[#DEB066] pl-4 italic text-white/90">
                "LÉO É O ÚNICO REPRESENTANTE DO SELETO <strong className="text-[#DEB066]">VANGUARDA HEXTECH</strong> DO WILD RIFT, UMA HONRA RESERVADA APENAS AOS JOGADORES MAIS TALENTOSOS E COMPROMETIDOS."
              </p>
              <p>
                SUA PAIXÃO PELO JOGO O LEVOU A PARTICIPAR DE DIVERSOS CAMPEONATOS, INCLUINDO UMA VIAGEM À CHINA PARA COMPETIR EM UM TORNEIO INTERNACIONAL DE WILD RIFT.
              </p>
            </div>
          </motion.div>

          {/* 2. STATS (Twitch) */}
          <motion.div
            className="md:col-span-3 lg:col-span-4 bg-[#6441A5] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
              <Activity size={120} />
            </div>
            <div className="flex justify-between items-start">
              <h4 className="text-white/80 font-bold uppercase tracking-wider text-xs">Twitch</h4>
              <div className="p-2 bg-white/20 rounded-lg"><Activity size={20} className="text-white" /></div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white mb-1">53k</div>
              <div className="text-white/60 text-xs uppercase font-bold tracking-widest">Seguidores</div>
            </div>
          </motion.div>

          {/* 3. STATS (YouTube) */}
          <motion.div
            className="md:col-span-3 lg:col-span-4 bg-[#FF0000] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
              <Users size={120} />
            </div>
            <div className="flex justify-between items-start">
              <h4 className="text-white/80 font-bold uppercase tracking-wider text-xs">YouTube</h4>
              <div className="p-2 bg-white/20 rounded-lg"><Users size={20} className="text-white" /></div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-2xl md:text-3xl font-black text-white">30k</div>
                <div className="text-white/60 text-[10px] uppercase font-bold">Léo Veio</div>
              </div>
              <div className="border-l border-white/20 pl-6">
                <div className="text-2xl md:text-3xl font-black text-white">17k</div>
                <div className="text-white/60 text-[10px] uppercase font-bold">Cortes</div>
              </div>
            </div>
          </motion.div>

          {/* 4. FITNESS / SUPERAÇÃO */}
          <motion.div
            className="md:col-span-6 lg:col-span-4 row-span-2 bg-gradient-to-br from-[#1a1f20] to-[#050b0c] border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden group"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                  <Dumbbell size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase italic">Superação</h4>
                  <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">70kg OFF</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-6">
                <p className="text-sm text-slate-400 italic">
                  "LÉO NÃO É APENAS UM NOME, É UMA HISTÓRIA DE SUPERAÇÃO. APÓS PERDER INCRÍVEIS 70 KG, SEM CIRURGIA."
                </p>
                <p className="text-sm text-slate-400">
                  VÁRIAS PESSOAS COMEÇARAM ACADEMIA POR CAUSA DELE. TRAZENDO UMA NOVA PERSPECTIVA E MUITA INSPIRAÇÃO.
                </p>
              </div>

              <div className="mt-auto bg-[#000]/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">Parceiro Oficial</span>
                <span className="text-blue-500 font-black tracking-tighter text-lg italic">GROWTH</span>
              </div>
            </div>
          </motion.div>

          {/* 5. INTERNACIONAL (China/LA) */}
          <motion.div
            className="md:col-span-6 lg:col-span-8 bg-[#0a0f10] border border-[#DEB066]/20 rounded-3xl p-8 relative overflow-hidden group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-center h-full">
              <div className="flex-1 space-y-6 z-10">
                <h3 className="text-2xl font-black text-white italic uppercase flex items-center gap-2">
                  <Globe className="text-[#DEB066]" size={24} />
                  Carreira <span className="text-[#DEB066]">Internacional</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Event 1 */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-red-500" />
                      <span className="text-xs font-bold text-red-400 uppercase">China</span>
                    </div>
                    <h5 className="font-bold text-white text-sm mb-1">IONIA CUP</h5>
                    <p className="text-xs text-slate-500">3º Lugar. Homenagem à mãe ao vivo.</p>
                  </div>
                  {/* Event 2 */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-blue-400" />
                      <span className="text-xs font-bold text-blue-400 uppercase">Los Angeles</span>
                    </div>
                    <h5 className="font-bold text-white text-sm mb-1">ARCANE PREMIERE</h5>
                    <p className="text-xs text-slate-500">Convidado Riot/Netflix. Final exclusiva.</p>
                  </div>
                </div>
              </div>

              {/* Visual Decor */}
              <div className="w-full md:w-1/3 h-32 md:h-full bg-gradient-to-r from-[#DEB066]/10 to-transparent rounded-2xl flex items-center justify-center relative overflow-hidden border border-[#DEB066]/10">
                <Trophy size={64} className="text-[#DEB066] drop-shadow-[0_0_15px_rgba(222,176,102,0.5)]" />
              </div>
            </div>
          </motion.div>

          {/* 6. INSTAGRAM STATS */}
          <motion.div
            className="md:col-span-3 lg:col-span-4 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl p-6 relative group overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Instagram size={80} color="white" />
            </div>
            <div className="h-full flex flex-col justify-end text-white">
              <div className="text-4xl font-black mb-1">17k</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-4">Seguidores</div>
              <div className="text-sm font-medium bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                @leoyahata
              </div>
            </div>
          </motion.div>

          {/* 7. PARCEIROS HISTÓRICOS */}
          <motion.div
            className="md:col-span-6 lg:col-span-12 bg-[#050b0c] border-y border-[#DEB066]/10 py-12 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-center text-[#DEB066] font-bold uppercase tracking-[0.3em] text-xs mb-8">
              Marcas que já confiaram
            </h4>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {/* Text-based Logos for representation */}
              <span className="text-2xl font-black text-white hover:text-[#DEB066] transition-colors cursor-default">PICPAY</span>
              <span className="text-2xl font-black text-white hover:text-blue-500 transition-colors cursor-default">INTEL</span>
              <span className="text-2xl font-black text-white hover:text-red-500 transition-colors cursor-default">COCA-COLA</span>
              <span className="text-2xl font-black text-white hover:text-red-600 transition-colors cursor-default">RIOT GAMES</span>
              <span className="text-2xl font-black text-white hover:text-yellow-500 transition-colors cursor-default">HONOR OF KINGS</span>
              <span className="text-2xl font-black text-white hover:text-blue-800 transition-colors cursor-default">SANTANDER</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;