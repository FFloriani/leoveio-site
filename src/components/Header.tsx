'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Menu, X, Home, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import ContactModal from './ContactModal';

const Header = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      href: '/',
      label: 'Início',
      icon: <Home size={16} />
    },
    {
      href: '/leobanca',
      label: 'Banca',
      icon: <DollarSign size={16} />
    },
    {
      href: '/eventos',
      label: 'Eventos',
      icon: <Calendar size={16} />
    },
    {
      href: '/rtp',
      label: 'RTP Live',
      icon: <BarChart3 size={16} />
    },
    {
      href: '/overlay',
      label: 'Overlay',
      icon: <BarChart3 size={16} />
    }
  ];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">

            {/* Desktop Navigation - Centered Pill */}
            <motion.nav
              className="hidden md:flex items-center gap-1 px-2 py-1.5 bg-white shadow-lg shadow-black/10 rounded-full"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {navigationItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 text-slate-800 hover:text-black hover:bg-slate-100 transition-all duration-200 font-bold text-sm rounded-full"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </motion.nav>

            {/* Contact Button - Fixed to right */}
            <motion.button
              onClick={() => setIsContactModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-black/40 backdrop-blur-md text-white font-medium rounded-full border border-white/20 hover:bg-white/10 transition-all duration-200 text-sm absolute right-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail size={16} />
              <span>Contato</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors bg-black/40 backdrop-blur-md rounded-full border border-white/20"
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
              className="md:hidden mt-4 mx-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20 p-4 space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium rounded-xl"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}

                <motion.button
                  onClick={() => {
                    setIsContactModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white font-medium rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 mt-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Mail size={16} />
                  <span>Contato</span>
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