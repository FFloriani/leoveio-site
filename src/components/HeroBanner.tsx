'use client';

import { motion } from 'framer-motion';
import { Twitch, Youtube, Video, Instagram, Gamepad2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const HeroBanner = () => {
    // Social Links Data
    const socialLinks = [
        {
            icon: <Twitch size={24} />,
            label: 'TWITCH',
            subLabel: 'Lives ao vivo',
            href: 'https://twitch.tv/leoveio'
        },
        {
            icon: <Youtube size={24} />,
            label: 'YOUTUBE',
            subLabel: 'Conteúdo principal',
            href: 'https://youtube.com/@leoveio'
        },
        {
            icon: <Video size={24} />,
            label: 'KICK',
            subLabel: 'Stream alternativa',
            href: 'https://kick.com/leoveio'
        },
        {
            icon: <Instagram size={24} />,
            label: 'INSTA',
            subLabel: 'Fotos e Stories',
            href: 'https://instagram.com/leoveio'
        },
        {
            icon: <Gamepad2 size={24} />,
            label: 'FORRAS',
            subLabel: 'Conteúdo extra',
            href: 'https://youtube.com/@LeoVeioYT'
        }
    ];

    // Bottom Buttons
    const bottomButtons = [
        {
            label: 'Clash Royale',
            href: '/clash',
            style: 'bg-black/80 border-[#DEB066] text-[#DEB066] hover:bg-[#DEB066] hover:text-black shadow-[0_0_15px_rgba(222,176,102,0.2)]'
        },
        {
            label: 'Wild Rift',
            href: '/wild-rift',
            style: 'bg-black/80 border-[#00FFB2] text-[#00FFB2] hover:bg-[#00FFB2] hover:text-black shadow-[0_0_15px_rgba(0,255,178,0.2)]'
        },
        {
            label: 'Cassino',
            href: '/leobanca',
            style: 'bg-gradient-to-r from-[#9A1207] to-[#810B09] border-[#E8D5B0] text-white hover:brightness-110 shadow-[0_0_20px_rgba(154,18,7,0.4)]'
        },
    ];

    return (
        <section className="relative w-full h-screen overflow-hidden" id="home">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/herobanner8.png"
                    alt="Leoveio Hero Background"
                    fill
                    priority
                    className="object-cover object-center"
                    quality={100}
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b0c] via-transparent to-[#050b0c]/10" />
            </div>

            {/* Social Sidebar (Left) - "Pill" Style RESTORED */}
            <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6 hidden md:flex bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                {socialLinks.map((link, index) => (
                    <motion.a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 group"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                    >
                        {/* Icon Box - Red/Dark Theme */}
                        <div className="w-12 h-12 flex items-center justify-center bg-black/80 border border-white/10 rounded-xl shadow-lg group-hover:bg-[#9A1207] group-hover:border-[#DEB066] group-hover:scale-110 transition-all duration-300 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {link.icon}
                        </div>
                        {/* Text Content */}
                        <div className="flex flex-col opacity-100 transition-opacity">
                            <span className="font-black italic text-2xl tracking-wider text-[#FF0000] group-hover:text-[#FF4444] transition-colors uppercase leading-none filter drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]">
                                {link.label}
                            </span>
                            <span className="text-xs text-white font-bold uppercase tracking-widest group-hover:text-[#DEB066] mt-0.5">
                                {link.subLabel}
                            </span>
                        </div>
                    </motion.a>
                ))}
            </div>

            {/* Main Content (Center) */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-32 md:pb-28 pointer-events-none">
                <div className="container mx-auto px-4 flex flex-col items-center text-center">

                    {/* Info Text */}
                    <motion.div
                        className="mt-6 md:mt-8 flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs md:text-sm font-bold text-white/90 drop-shadow-md"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <p>
                            <span className="text-[#DEB066]">Transmissões:</span> Seg-Sex 17:30 às 22:00
                        </p>
                        <span className="hidden md:block text-white/30">|</span>
                        <p>
                            <span className="text-[#DEB066]">Conquistas:</span> Vanguarda Hextech, Campeão Internacional Wild Rift, Transformação 70kg
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Buttons */}
            <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center items-center pointer-events-auto">
                <div className="flex gap-6">
                    {bottomButtons.map((btn, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 + (index * 0.1) }}
                        >
                            <Link href={btn.href}>
                                <div className={`px-8 py-3 rounded-xl border-2 backdrop-blur-md font-black italic uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${btn.style}`}>
                                    {btn.label}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
