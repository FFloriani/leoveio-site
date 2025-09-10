'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import ContactModal from './ContactModal';

const Header = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-end">
            {/* Navigation & Contact */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/leobanca"
                  className="relative group px-3 py-2 text-white/80 hover:text-white transition-all duration-300 font-medium text-sm rounded-lg bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-sm hover:bg-white/10 sm:px-5 sm:py-2.5"
                >
                  <span className="relative z-10 hidden sm:inline">Leo Banca</span>
                  <span className="relative z-10 sm:hidden">Banca</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/eventos"
                  className="relative group px-3 py-2 text-white/80 hover:text-white transition-all duration-300 font-medium text-sm rounded-lg bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-sm hover:bg-white/10 sm:px-5 sm:py-2.5"
                >
                  <span className="relative z-10 hidden sm:inline">Principais Eventos e Conquistas</span>
                  <span className="relative z-10 sm:hidden">Eventos</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </motion.div>
              
              <motion.button
                onClick={() => setIsContactModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm border border-purple-400/30 text-sm sm:gap-2 sm:px-5 sm:py-2.5"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(168, 85, 247, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Mail size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Entrar em Contato</span>
                <span className="sm:hidden">Contatos</span>
              </motion.button>
            </div>
          </div>
        </div>
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