// Componente de estatísticas da banca - Chinese Casino Style (EXACT Reference Match)

'use client';

import { motion } from 'framer-motion';
import { DollarSign, Users, TrendingUp } from 'lucide-react';
import { Banca } from '../types';
import { formatCurrency, formatPercent } from '../utils/export';

interface BancaStatsProps {
    banca: Banca;
}

export default function BancaStats({ banca }: BancaStatsProps) {
    const maxParticipation = banca.participants.length > 0
        ? Math.max(...banca.participants.map(p => p.percentage))
        : 0;

    const stats = [
        {
            label: 'Total Investido',
            value: formatCurrency(banca.totalInvested),
            icon: DollarSign,
            iconBg: 'from-green-600 to-emerald-700',
            delay: 0.1
        },
        {
            label: 'Participantes',
            value: banca.participants.length.toString(),
            icon: Users,
            iconBg: 'from-yellow-600 to-amber-700',
            delay: 0.2
        },
        {
            label: 'Maior Participação',
            value: formatPercent(maxParticipation),
            icon: TrendingUp,
            iconBg: 'from-red-600 to-red-800',
            delay: 0.3
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {stats.map((stat) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stat.delay }}
                    className="stats-card-chinese"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.iconBg} shadow-md`}>
                            <stat.icon className="text-white" size={20} />
                        </div>

                        <div>
                            <p className="text-[#3d1a00]/80 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-[#3d1a00] font-black text-xl">{stat.value}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
