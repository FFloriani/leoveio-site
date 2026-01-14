// Componente de cabeçalho da banca ativa

'use client';

import { motion } from 'framer-motion';
import { Plus, CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { Banca } from '../types';
import { formatDate, formatCurrency, exportToCSV } from '../utils/export';

interface BancaHeaderProps {
    banca: Banca;
    onAddParticipant: () => void;
    onCloseBanca: () => void;
    onBack: () => void;
    onUpdateFinalBalance: (balance: number) => void;
}

export default function BancaHeader({
    banca,
    onAddParticipant,
    onCloseBanca,
    onBack,
    onUpdateFinalBalance
}: BancaHeaderProps) {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Voltar"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{banca.title}</h2>
                            {banca.description && (
                                <p className="text-white/70 text-sm">{banca.description}</p>
                            )}
                            <p className="text-white/50 text-xs mt-1">
                                Iniciada em {formatDate(banca.startDate)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <motion.button
                        onClick={onAddParticipant}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={18} />
                        Adicionar
                    </motion.button>

                    <motion.button
                        onClick={onCloseBanca}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CheckCircle size={18} />
                        Encerrar
                    </motion.button>
                </div>
            </div>

            {/* Saldo Final */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <label className="text-white/70 text-sm whitespace-nowrap">Saldo Final (R$):</label>
                <input
                    type="number"
                    placeholder="0.00"
                    value={banca.finalBalance || ''}
                    onChange={(e) => onUpdateFinalBalance(parseFloat(e.target.value) || 0)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-green-500/50"
                />
                <span className="text-green-400 font-bold text-lg">
                    {formatCurrency(banca.finalBalance)}
                </span>
            </div>
        </div>
    );
}
