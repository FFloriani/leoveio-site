'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Zap, Trophy, Globe, Star, MapPin } from 'lucide-react';

export default function WildRiftPage() {
    const timelineEvents = [
        {
            id: 1,
            title: "THE BEGINNING",
            subtitle: "MONO RAMMUS ERA",
            date: "2020",
            description: "Onde tudo começou. Apenas um Rammus, um sonho e muita velocidade. O início da jornada que definiria minha carreira.",
            image: "/herobanner8.png", // Placeholder
            rotate: "-2deg",
            type: "origin",
            color: "#bc13fe"
        },
        {
            id: 2,
            title: "VANGUARDA HEXTECH",
            subtitle: "RIOT GAMES PARTNER",
            date: "2021",
            description: "Reconhecimento oficial. Tornando-me parte da elite de criadores da Riot Games. A responsabilidade de representar a comunidade.",
            image: "/riotgames.png",
            rotate: "1deg",
            type: "achievement",
            color: "#00f0ff"
        },
        {
            id: 3,
            title: "IONIA CUP",
            subtitle: "CHINA EXPEDITION",
            date: "2023",
            description: "Do Brasil para o mundo. Representando nossa região na China. Uma experiência cultural e competitiva transformadora.",
            image: "/herobanner7.png", // Placeholder
            rotate: "3deg",
            type: "international",
            color: "#ff0055"
        },
        {
            id: 4,
            title: "ARCANE PREMIERE",
            subtitle: "LOS ANGELES",
            date: "2024",
            description: "Tapete vermelho em LA. Convidado exclusivo para a estreia mundial da segunda temporada de Arcane.",
            image: "/uploaded_image_1768692240206.jpg", // Using the ref image as placeholder art
            rotate: "-1deg",
            type: "event",
            color: "#bc13fe"
        },
        {
            id: 5,
            title: "GLOBAL CHAMPION",
            subtitle: "WILD RIFT",
            date: "CURRENT",
            description: "Topo do mundo. Consolidando o legado como um dos maiores nomes do cenário competitivo e de criação de conteúdo.",
            image: "/herobanner8.png",
            rotate: "2deg",
            type: "legend",
            color: "#ffd700"
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-[#ff0055] selection:text-white font-sans">

            {/* GLITCH OVERLAYS */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

            {/* BACK BUTTON */}
            <Link href="/" className="fixed top-8 left-8 z-50 group">
                <motion.div
                    whileHover={{ x: -5, scale: 1.1 }}
                    className="bg-black/80 backdrop-blur-md p-3 rounded-full border border-white/20 hover:border-[#00f0ff] transition-colors"
                >
                    <ArrowLeft size={24} className="text-white group-hover:text-[#00f0ff]" />
                </motion.div>
            </Link>

            {/* HERO SECTION */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Chaos */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#bc13fe]/20 via-[#050505] to-[#050505]" />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"
                    />
                </div>

                <div className="relative z-10 text-center px-4 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative inline-block"
                    >
                        <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#bc13fe] to-[#ff0055] drop-shadow-[0_0_15px_rgba(188,19,254,0.5)] transform -rotate-2">
                            WILD RIFT
                        </h1>
                        <span className="absolute -top-8 -right-8 text-[#ffee00] font-black text-2xl md:text-4xl rotate-12 drop-shadow-[0_0_10px_rgba(255,238,0,0.8)]">
                            LEGEND
                        </span>
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm md:text-xl font-mono tracking-[0.5em] uppercase whitespace-nowrap">
                            The History of Leoveio
                        </span>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="absolute bottom-[-20vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#00f0ff] to-transparent" />
                        <span className="text-[10px] uppercase tracking-widest text-[#00f0ff]">Scroll Down</span>
                    </motion.div>
                </div>
            </section>

            {/* TIMELINE SECTION */}
            <section className="relative py-32 px-4 container mx-auto">
                {/* Connection Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#bc13fe]/30 to-transparent hidden md:block" />

                <div className="grid grid-cols-1 gap-32 relative">
                    {timelineEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 100, rotate: event.rotate }}
                            whileInView={{ opacity: 1, y: 0, rotate: event.rotate }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Content Side */}
                            <div className="flex-1 w-full relative group">
                                <div className="bg-black/40 backdrop-blur-sm border-2 p-8 relative transform hover:scale-[1.02] transition-transform duration-300"
                                    style={{ borderColor: event.color, boxShadow: `0 0 30px ${event.color}20` }}>

                                    {/* Decorative Tape */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#ffee00]/80 rotate-1 shadow-sm opacity-80" />

                                    <div className="absolute -top-4 -left-4 font-black text-6xl opacity-10 select-none" style={{ color: event.color }}>
                                        {event.date}
                                    </div>

                                    <h3 className="text-4xl font-black italic mb-2 uppercase" style={{ color: event.color, textShadow: `0 0 10px ${event.color}` }}>
                                        {event.title}
                                    </h3>
                                    <h4 className="text-xl font-bold text-white/90 mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
                                        {event.subtitle}
                                    </h4>
                                    <p className="text-gray-300 leading-relaxed font-mono text-sm md:text-base">
                                        {event.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex gap-2 mt-6">
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-wider font-bold text-white/70">
                                            History
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-opacity-20" style={{ backgroundColor: `${event.color}30`, color: event.color }}>
                                            {event.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Side */}
                            <div className="flex-1 w-full flex justify-center relative">
                                <div className="relative w-full max-w-md aspect-[4/3] group">
                                    {/* Graffiti BG */}
                                    <div className="absolute -inset-4 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-6 border border-white/10" />

                                    <motion.div
                                        className="relative w-full h-full overflow-hidden border-4 border-black shadow-2xl bg-[#111]"
                                        style={{ borderColor: event.color }}
                                        whileHover={{ scale: 1.05, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                                        />
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FOOTER CTA */}
            <section className="py-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[#bc13fe]/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-5xl md:text-8xl font-black italic mb-12 uppercase tracking-tighter text-white/20">
                        TO BE CONTINUED
                    </h2>
                    <Link href="/">
                        <button className="px-12 py-4 bg-[#00f0ff] text-black font-black text-xl uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(0,240,255,0.4)] clip-path-polygon">
                            BACK TO HOME
                        </button>
                    </Link>
                </div>
            </section>

        </div>
    );
}
