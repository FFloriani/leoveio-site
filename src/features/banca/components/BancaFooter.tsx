// Footer simplificado para a página de LeoBanca

'use client';

import { motion } from 'framer-motion';

export default function BancaFooter() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-white/10"
        >
            <div className="text-center text-white/40 text-sm space-y-2">
                <p>
                    © 2024 <span className="text-purple-400 font-semibold">LEOVEIO</span> • Banca do Balão
                </p>
                <p className="text-xs">
                    Desenvolvido por{' '}
                    <a
                        href="https://wa.me/+5511917163488"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        Floriani
                    </a>
                </p>
            </div>
        </motion.footer>
    );
}
