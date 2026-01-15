'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Menu, X, Home, Calendar, DollarSign, ExternalLink, BarChart3, Play } from 'lucide-react';
import Link from 'next/link';
import ContactModal from './ContactModal';

const Header = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    {
      href: '/',
      label: 'Início',
      icon: <Home size={16} />,
      mobileLabel: 'Início'
    },
    {
      href: '/leobanca',
      label: 'Banca',
      icon: <DollarSign size={16} />,
      mobileLabel: 'Banca'
    },
    {
      href: '/react',
      label: 'React',
      icon: <Play size={16} />,
      mobileLabel: 'React'
    },
    {
      href: '/eventos',
      label: 'Eventos',
      icon: <Calendar size={16} />,
      mobileLabel: 'Eventos'
    },
    {
      href: '/rtp',
      label: 'RTP Live',
      icon: <BarChart3 size={16} />,
      mobileLabel: 'RTP Live'
    }
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'backdrop-blur-xl bg-black/40 border-b border-white/20 shadow-lg'
            : 'backdrop-blur-md bg-black/20 border-b border-white/10'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">

            {/* Logo/Brand */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">LV</span>
                  </div>
                  <span className="text-white font-bold text-lg hidden sm:block group-hover:text-purple-300 transition-colors">
                    LEOVEIO
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="relative group px-4 py-2 text-white/80 hover:text-white transition-all duration-300 font-medium text-sm rounded-lg bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-sm hover:bg-white/10 flex items-center gap-2"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </motion.div>
              ))}

              <motion.button
                onClick={() => setIsContactModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm border border-purple-400/30 text-sm"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(168, 85, 247, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Mail size={16} />
                <span>Contato</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-4 space-y-3">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-all duration-300 font-medium rounded-lg bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-sm hover:bg-white/10"
                    >
                      {item.icon}
                      <span>{item.mobileLabel}</span>
                      <ExternalLink size={14} className="ml-auto opacity-50" />
                    </Link>
                  </motion.div>
                ))}

                <motion.button
                  onClick={() => {
                    setIsContactModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm border border-purple-400/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Mail size={16} />
                  <span>Entrar em Contato</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};

export default Header; 