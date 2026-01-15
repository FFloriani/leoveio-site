// Componente com os botões de ação do dashboard - Chinese Casino Style

'use client';

import { motion } from 'framer-motion';
import { Plus, Clock } from 'lucide-react';

interface DashboardActionsProps {
    onCreateBanca: () => void;
    onShowHistory: () => void;
}

export default function DashboardActions({
    onCreateBanca,
    onShowHistory
}: DashboardActionsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
            {/* Nova Banca - Gold Theme */}
            <motion.button
                onClick={onCreateBanca}
                className="group relative chinese-card glow-gold p-8 text-center overflow-hidden"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon container */}
                <motion.div
                    className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg border-4 border-yellow-300/50"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    <Plus size={40} className="text-red-900" strokeWidth={3} />
                </motion.div>

                <h3 className="text-2xl font-black text-gold-gradient mb-2 tracking-wider">
                    NOVA BANCA
                </h3>
                <p className="text-yellow-200/60 text-sm">
                    Criar nova banca compartilhada
                </p>
            </motion.button>

            {/* Histórico - Red/Gold Theme */}
            <motion.button
                onClick={onShowHistory}
                className="group relative chinese-card p-8 text-center overflow-hidden"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon container */}
                <motion.div
                    className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 flex items-center justify-center shadow-lg border-4 border-yellow-500/50"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    <Clock size={40} className="text-yellow-400" strokeWidth={2} />
                </motion.div>

                <h3 className="text-2xl font-black text-gold-gradient mb-2 tracking-wider">
                    HISTÓRICO
                </h3>
                <p className="text-yellow-200/60 text-sm">
                    Ver bancas anteriores
                </p>
            </motion.button>
        </motion.div>
    );
}
