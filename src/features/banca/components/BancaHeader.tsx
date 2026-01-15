// Componente de cabeçalho da banca ativa - Chinese Casino Style (EXACT Reference Match)

'use client';

import { motion } from 'framer-motion';
import { Plus, CheckCircle, Coins, Calendar } from 'lucide-react';
import { Banca } from '../types';
import { formatDate, formatCurrency } from '../utils/export';

interface BancaHeaderProps {
    banca: Banca;
    onAddParticipant: () => void;
    onCloseBanca: () => void;
    onUpdateFinalBalance: (balance: number) => void;
}

export default function BancaHeader({
    banca,
    onAddParticipant,
    onCloseBanca,
    onUpdateFinalBalance
}: BancaHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="chinese-card p-5 mb-5"
        >
            {/* Header Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#E8D5B0] tracking-wide">
                        {banca.title}
                    </h2>
                    <div className="flex items-center gap-2 text-[#E8D5B0] text-xs mt-1 font-medium">
                        <Calendar size={14} />
                        <span>Iniciada em {formatDate(banca.startDate)}</span>
                    </div>
                </div>

                {/* Action Buttons - Cream border style */}
                <div className="flex flex-wrap gap-3">
                    <motion.button
                        onClick={onAddParticipant}
                        className="btn-chinese-gold flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={14} strokeWidth={2.5} />
                        ADICIONAR
                    </motion.button>

                    <motion.button
                        onClick={onCloseBanca}
                        className="btn-chinese-red flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CheckCircle size={14} />
                        ENCERRAR
                    </motion.button>
                </div>
            </div>

            {/* Saldo Final Box - Golden background like reference */}
            <div className="inner-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
                            <Coins size={16} className="text-white" />
                        </div>
                        <label className="text-[#3d1a00] font-bold text-sm uppercase">Saldo Final</label>
                    </div>

                    <div className="flex-1 flex items-center gap-3">
                        <input
                            type="number"
                            placeholder="R$ 0.00"
                            value={banca.finalBalance || ''}
                            onChange={(e) => onUpdateFinalBalance(parseFloat(e.target.value) || 0)}
                            className="chinese-input flex-1 px-4 py-2 text-base font-bold"
                        />

                        <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-800 to-red-900 border-2 border-[#DEB066]">
                            <span className="text-[#DEB066] font-bold text-lg">
                                {formatCurrency(banca.finalBalance)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
