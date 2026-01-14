// Componente com os botões de ação do dashboard

'use client';

import { motion } from 'framer-motion';
import { Plus, History } from 'lucide-react';

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
            <motion.button
                onClick={onCreateBanca}
                className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white text-center hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Plus size={32} className="mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Nova Banca</h3>
                <p className="text-white/80">Criar nova banca compartilhada</p>
            </motion.button>

            <motion.button
                onClick={onShowHistory}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-xl text-white text-center hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <History size={32} className="mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Histórico</h3>
                <p className="text-white/80">Ver bancas anteriores</p>
            </motion.button>
        </motion.div>
    );
}
