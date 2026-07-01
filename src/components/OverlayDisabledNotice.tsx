'use client';

import { motion } from 'framer-motion';
import { MessageCircle, MonitorOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { OVERLAY_CONTACT } from '@/lib/feature-flags';

type OverlayDisabledVariant = 'config' | 'render';

interface OverlayDisabledNoticeProps {
  variant?: OverlayDisabledVariant;
  title?: string;
}

const whatsappUrl = `https://wa.me/${OVERLAY_CONTACT.whatsapp}?text=${encodeURIComponent(OVERLAY_CONTACT.whatsappMessage)}`;

export default function OverlayDisabledNotice({
  variant = 'config',
  title = 'Overlay desativado',
}: OverlayDisabledNoticeProps) {
  const isRender = variant === 'render';

  return (
    <section
      className={`relative flex items-center justify-center px-4 ${
        isRender ? 'min-h-screen bg-transparent' : 'min-h-screen pt-24 pb-16 bg-[#050b0c]'
      }`}
    >
      {!isRender && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#DEB066]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#6441A5]/15 rounded-full blur-[120px]" />
        </div>
      )}

      <motion.div
        className={`relative z-10 w-full max-w-xl text-center ${
          isRender
            ? 'p-8 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-md'
            : 'p-10 md:p-12 rounded-3xl bg-[#0a0f10] border border-[#DEB066]/25 shadow-[0_0_60px_rgba(222,176,102,0.08)]'
        }`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-[#DEB066]/10 border border-[#DEB066]/30">
          <MonitorOff className="text-[#DEB066]" size={32} />
        </div>

        <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white mb-3">
          {title}
        </h1>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-2">
          Esta ferramenta não está mais disponível no site.
        </p>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
          Se você usava o overlay e quer um serviço igual ou personalizado, fale com{' '}
          <span className="text-[#DEB066] font-semibold">{OVERLAY_CONTACT.name}</span> no WhatsApp.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full transition-all duration-200 shadow-lg shadow-[#25D366]/25 hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageCircle size={22} />
          <span>WhatsApp {OVERLAY_CONTACT.whatsappDisplay}</span>
        </a>

        {!isRender && (
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#DEB066] transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar ao início
          </Link>
        )}
      </motion.div>
    </section>
  );
}
