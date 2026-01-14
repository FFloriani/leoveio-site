// Modal para encerrar banca com saldo final

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Banca } from '../types';
import { formatCurrency } from '../utils/export';
import { calculateDistribution } from '../utils/calculations';

interface CloseBancaModalProps {
    isOpen: boolean;
    banca: Banca | null;
    onClose: () => void;
    onConfirm: (finalBalance: number) => void;
}

export default function CloseBancaModal({
    isOpen,
    banca,
    onClose,
    onConfirm
}: CloseBancaModalProps) {
    const [finalBalance, setFinalBalance] = useState('');

    if (!isOpen || !banca) return null;

    const balance = parseFloat(finalBalance) || 0;
    const previewParticipants = calculateDistribution(banca.participants, balance);
    const totalProfit = balance - banca.totalInvested;
    const isProfitable = totalProfit >= 0;

    const handleConfirm = () => {
        if (balance <= 0) {
            alert('Por favor, informe o saldo final da banca.');
            return;
        }
        onConfirm(balance);
        setFinalBalance('');
        onClose();
    };

    const handleClose = () => {
        setFinalBalance('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 rounded-xl p-6 w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Encerrar Banca</h3>
                    <button
                        onClick={handleClose}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Resumo da Banca */}
                <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">{banca.title}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-white/50">Total Investido</p>
                            <p className="text-green-400 font-bold">{formatCurrency(banca.totalInvested)}</p>
                        </div>
                        <div>
                            <p className="text-white/50">Participantes</p>
                            <p className="text-white font-bold">{banca.participants.length}</p>
                        </div>
                    </div>
                </div>

                {/* Input do Saldo Final */}
                <div className="mb-6">
                    <label className="text-white/70 text-sm mb-2 block">
                        Qual foi o saldo final da banca? *
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" size={20} />
                        <input
                            type="number"
                            placeholder="0.00"
                            value={finalBalance}
                            onChange={(e) => setFinalBalance(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white text-xl placeholder-white/30 focus:outline-none focus:border-green-500/50"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Preview do Resultado */}
                {balance > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        {/* Lucro/Prejuízo Total */}
                        <div className={`p-4 rounded-lg mb-4 ${isProfitable ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                            <div className="flex items-center gap-2">
                                {isProfitable ? (
                                    <TrendingUp className="text-green-400" size={24} />
                                ) : (
                                    <TrendingDown className="text-red-400" size={24} />
                                )}
                                <div>
                                    <p className="text-white/70 text-sm">
                                        {isProfitable ? 'Lucro Total' : 'Prejuízo Total'}
                                    </p>
                                    <p className={`font-bold text-xl ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                                        {isProfitable ? '+' : ''}{formatCurrency(totalProfit)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Distribuição por Participante */}
                        <h4 className="text-white/70 text-sm mb-2">Distribuição:</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {previewParticipants.map((p) => (
                                <div
                                    key={p.id}
                                    className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                                            {p.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{p.name}</p>
                                            <p className="text-white/50 text-xs">
                                                Investiu: {formatCurrency(p.contribution)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-bold">{formatCurrency(p.finalAmount)}</p>
                                        <p className={`text-xs ${p.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {p.profit >= 0 ? '+' : ''}{formatCurrency(p.profit)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Botões */}
                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={balance <= 0}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle size={18} />
                        Encerrar Banca
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
