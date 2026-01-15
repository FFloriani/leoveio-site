// Footer premium para a página de LeoBanca - Chinese Casino Style

'use client';

import { Sparkles, MessageCircle } from 'lucide-react';

export default function BancaFooter() {
    const whatsappLink = 'https://wa.me/5511917163488';

    return (
        <footer className="w-full bg-gradient-to-b from-[#9A1207] to-[#810B09] border-t-4 border-[#E8D5B0] mt-auto relative shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    {/* Left side - Copyright */}
                    <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-full border border-[#E8D5B0]/20">
                        <Sparkles size={18} className="text-[#DEB066] animate-pulse" />
                        <p className="text-[#E8D5B0] text-sm font-medium tracking-wide">
                            © 2025 <span className="text-[#DEB066] font-bold drop-shadow-sm">leoveio.com</span> - Todos os direitos reservados
                        </p>
                    </div>

                    {/* Right side - Developer credit */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-5 py-2.5 bg-[#DEB066] hover:bg-[#F1D08B] text-[#3d1a00] rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_0_15px_rgba(222,176,102,0.4)] font-bold group border-b-4 border-[#C9A227] active:border-b-0 active:translate-y-1"
                    >
                        <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
                        <span>
                            Desenvolvido por <span className="uppercase tracking-wider">Floriani</span>
                        </span>
                    </a>
                </div>
            </div>

            {/* Background Texture */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E8D5B0' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />
        </footer>
    );
}
