// Modal de histórico de bancas - Chinese Casino Style

'use client';

import { motion } from 'framer-motion';
import { X, Download, RefreshCw, Calendar, Users, Coins, History } from 'lucide-react';
import { Banca } from '../types';
import { formatCurrency, formatDate, exportToCSV } from '../utils/export';

interface BancaHistoryProps {
    isOpen: boolean;
    bancas: Banca[];
    onClose: () => void;
    onReopen: (banca: Banca) => void;
}

export default function BancaHistory({
    isOpen,
    bancas,
    onClose,
    onReopen
}: BancaHistoryProps) {
    if (!isOpen) return null;

    const closedBancas = bancas.filter(b => b.status === 'closed');

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="chinese-card p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center border border-yellow-300/50">
                            <History size={20} className="text-red-900" />
                        </div>
                        <h3 className="text-xl font-black text-gold-gradient">HISTÓRICO</h3>
                    </div>
                    <motion.button
                        onClick={onClose}
                        className="p-2 text-yellow-500/50 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X size={20} />
                    </motion.button>
                </div>

                {closedBancas.length === 0 ? (
                    <div className="text-center py-16 flex-1 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-red-900/50 flex items-center justify-center mb-4 border border-yellow-500/20">
                            <Calendar size={40} className="text-yellow-500/30" />
                        </div>
                        <p className="text-yellow-200/50 text-lg">Nenhuma banca encerrada ainda</p>
                        <p className="text-yellow-200/30 text-sm mt-2">As bancas encerradas aparecerão aqui</p>
                    </div>
                ) : (
                    <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                        {closedBancas.map((banca, index) => {
                            const profit = banca.finalBalance - banca.totalInvested;
                            const isProfitable = profit >= 0;

                            return (
                                <motion.div
                                    key={banca.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="chinese-glass p-4 rounded-xl"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-yellow-100 font-bold">{banca.title}</h4>
                                                <span className={`badge-${isProfitable ? 'jade' : 'red'} text-xs`}>
                                                    {isProfitable ? '+' : ''}{formatCurrency(profit)}
                                                </span>
                                            </div>

                                            {banca.description && (
                                                <p className="text-yellow-200/50 text-sm mb-3">{banca.description}</p>
                                            )}

                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <span className="flex items-center gap-1 text-yellow-200/60">
                                                    <Calendar size={14} />
                                                    {formatDate(banca.startDate)}
                                                </span>
                                                <span className="flex items-center gap-1 text-yellow-200/60">
                                                    <Users size={14} />
                                                    {banca.participants.length} participantes
                                                </span>
                                                <span className="flex items-center gap-1 text-yellow-400 font-medium">
                                                    <Coins size={14} />
                                                    {formatCurrency(banca.finalBalance)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <motion.button
                                                onClick={() => exportToCSV(banca)}
                                                className="p-2 text-yellow-500/50 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Exportar CSV"
                                            >
                                                <Download size={18} />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => {
                                                    onReopen(banca);
                                                    onClose();
                                                }}
                                                className="p-2 text-yellow-500/50 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Reabrir Banca"
                                            >
                                                <RefreshCw size={18} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Divider */}
                <div className="chinese-divider" />

                <motion.button
                    onClick={onClose}
                    className="w-full px-4 py-3 bg-red-900/50 border border-yellow-500/30 text-yellow-200 rounded-lg hover:bg-red-900/70 transition-colors font-medium"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    Fechar
                </motion.button>
            </motion.div>
        </div>
    );
}
