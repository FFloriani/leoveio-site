// Componente de estatísticas da banca

'use client';

import { motion } from 'framer-motion';
import { DollarSign, Users, Percent } from 'lucide-react';
import { Banca } from '../types';
import { formatCurrency, formatPercent } from '../utils/export';

interface BancaStatsProps {
    banca: Banca;
}

export default function BancaStats({ banca }: BancaStatsProps) {
    const maxParticipation = banca.participants.length > 0
        ? Math.max(...banca.participants.map(p => p.percentage))
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <DollarSign className="text-green-400" size={20} />
                    </div>
                    <div>
                        <p className="text-white/60 text-sm">Total Investido</p>
                        <p className="text-white font-bold text-lg">
                            {formatCurrency(banca.totalInvested)}
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Users className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <p className="text-white/60 text-sm">Participantes</p>
                        <p className="text-white font-bold text-lg">
                            {banca.participants.length}
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Percent className="text-purple-400" size={20} />
                    </div>
                    <div>
                        <p className="text-white/60 text-sm">Maior Participação</p>
                        <p className="text-white font-bold text-lg">
                            {formatPercent(maxParticipation)}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
