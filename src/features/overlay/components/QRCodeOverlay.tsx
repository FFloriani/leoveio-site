'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

export interface QRSlide {
  id: string;
  type: 'qrcode' | 'photo' | 'qrcode_photo';
  // QR Code
  qrLink?: string;
  // Images
  photoUrl?: string;
  logoUrl?: string;
  logoSize?: number; // px height of logo, default 40
  // Header
  headerText?: string;
  // Disclaimer
  showDisclaimer: boolean;
  disclaimerText?: string;
  // Styling
  bgColor: string;
  borderColor: string;
  textColor: string;
  // Timing
  duration: number; // seconds this slide is shown
}

export interface QROverlayConfig {
  slides: QRSlide[];
  globalDisclaimer: string;
  globalDisclaimerEnabled: boolean;
  width: number;
  height: number;
  borderRadius: number;
  animationStyle: 'fade' | 'slide' | 'scale' | 'flip';
}

interface QRCodeOverlayProps {
  config: QROverlayConfig;
}

const slideAnimations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
};

export function QRCodeOverlay({ config }: QRCodeOverlayProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { slides, globalDisclaimer, globalDisclaimerEnabled, borderRadius, animationStyle } = config;

  // Reset index if slides change
  useEffect(() => {
    setCurrentSlideIndex(prev => prev >= slides.length ? 0 : prev);
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlideIndex(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return;
    const timer = setTimeout(nextSlide, currentSlide.duration * 1000);
    return () => clearTimeout(timer);
  }, [currentSlideIndex, slides, nextSlide]);

  if (slides.length === 0) return null;

  const slide = slides[currentSlideIndex] || slides[0];
  const animation = slideAnimations[animationStyle] || slideAnimations.fade;

  const showDisclaimer = slide.showDisclaimer || globalDisclaimerEnabled;
  const disclaimerText = slide.disclaimerText || globalDisclaimer || 'PROIBIDO PARA MENORES DE 18 ANOS';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: config.width,
        height: config.height,
        borderRadius,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + currentSlideIndex}
          initial={animation.initial}
          animate={animation.animate}
          exit={animation.exit}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 flex flex-col"
          style={{
            backgroundColor: slide.bgColor,
            border: `3px solid ${slide.borderColor}`,
            borderRadius,
            overflow: 'hidden',
          }}
        >
          {/* FULL COVER PHOTO mode */}
          {slide.type === 'photo' && slide.photoUrl && (
            <motion.img
              src={slide.photoUrl}
              alt="Foto"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          )}

          {/* Header with Logo - floats on top for photo type */}
          {(slide.headerText || slide.logoUrl) && (
            <motion.div
              className="flex items-center justify-center gap-3 px-4 py-3 relative z-10"
              style={slide.type === 'photo' ? { backgroundColor: 'rgba(0,0,0,0.5)' } : undefined}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slide.logoUrl && (
                <motion.img
                  src={slide.logoUrl}
                  alt="Logo"
                  className="w-auto object-contain"
                  style={{ height: slide.logoSize || 40 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 260 }}
                />
              )}
              {slide.headerText && (
                <span
                  className="font-black text-lg uppercase tracking-wider"
                  style={{ color: slide.textColor }}
                >
                  {slide.headerText}
                </span>
              )}
            </motion.div>
          )}

          {/* Main Content - QR code and photo for non-fullcover modes */}
          {slide.type !== 'photo' && (
            <div className="flex-1 flex items-center justify-center px-4 py-2 gap-4 relative z-10">
              {/* QR Code */}
              {slide.qrLink && (slide.type === 'qrcode' || slide.type === 'qrcode_photo') && (
                <motion.div
                  className="bg-white rounded-xl p-3 shadow-2xl relative"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                  <QRCodeSVG
                    value={slide.qrLink}
                    size={slide.type === 'qrcode_photo' ? 140 : 180}
                    level="H"
                    includeMargin={false}
                  />
                  {/* LEOVEIO brand center overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="rounded-md overflow-hidden"
                      style={{
                        padding: '3px',
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      <img
                        src="/leoveiologofav.png"
                        alt="LEOVEIO"
                        className="block rounded-sm"
                        style={{ width: 36, height: 36, objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Photo (small, inside card for qrcode_photo) */}
              {slide.photoUrl && slide.type === 'qrcode_photo' && (
                <motion.div
                  className="relative overflow-hidden rounded-xl shadow-2xl"
                  style={{
                    border: `3px solid ${slide.borderColor}`,
                    maxHeight: 170,
                  }}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <img
                    src={slide.photoUrl}
                    alt="Foto"
                    className="w-auto object-cover"
                    style={{ maxHeight: 170 }}
                  />
                </motion.div>
              )}
            </div>
          )}

          {/* Spacer for photo type to push disclaimer to bottom */}
          {slide.type === 'photo' && <div className="flex-1" />}

          {/* Disclaimer */}
          {showDisclaimer && (
            <motion.div
              className="flex items-center justify-center gap-2 px-3 py-2 relative z-10"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-red-500 bg-red-500/20 flex-shrink-0">
                <span className="text-red-500 font-black text-[10px]">18</span>
              </div>
              <span className="text-white font-bold text-[10px] uppercase tracking-wider leading-tight">
                {disclaimerText}
              </span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Default config
export const DEFAULT_QRCODE_CONFIG: QROverlayConfig = {
  slides: [
    {
      id: 'slide-1',
      type: 'qrcode',
      qrLink: 'https://example.com',
      logoUrl: '',
      headerText: 'ESCANEIE AQUI',
      showDisclaimer: true,
      disclaimerText: '',
      bgColor: '#1a1040',
      borderColor: '#DEB066',
      textColor: '#ffffff',
      duration: 8,
      logoSize: 40,
    },
  ],
  globalDisclaimer: 'PROIBIDO PARA MENORES DE 18 ANOS\nSPA/MF N.º 469 - DE 10 DE MARÇO 2025',
  globalDisclaimerEnabled: false,
  width: 320,
  height: 380,
  borderRadius: 16,
  animationStyle: 'fade',
};
