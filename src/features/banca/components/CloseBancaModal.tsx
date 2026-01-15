// Modal para encerrar banca com saldo final - Chinese Casino Style

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Coins, TrendingUp, TrendingDown, Trophy } from 'lucide-react';
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

    const balance = finalBalance.trim() !== '' ? parseFloat(finalBalance) : NaN;
    const isValidInput = !isNaN(balance) && balance >= 0;
    const previewParticipants = calculateDistribution(banca.participants, isValidInput ? balance : 0);
    const totalProfit = (isValidInput ? balance : 0) - banca.totalInvested;
    const isProfitable = totalProfit >= 0;

    const handleConfirm = () => {
        if (!isValidInput) {
            alert('Por favor, informe o saldo final da banca (pode ser R$ 0,00 se perdeu tudo).');
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="chinese-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center border border-yellow-500/50">
                            <Trophy size={20} className="text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-yellow-100">Encerrar Banca</h3>
                    </div>
                    <motion.button
                        onClick={handleClose}
                        className="p-2 text-yellow-500/50 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X size={20} />
                    </motion.button>
                </div>

                {/* Resumo da Banca */}
                <div className="chinese-glass p-4 mb-6 rounded-xl border border-[#DEB066]/30 bg-[#2a0808]/80">
                    <h4 className="text-[#DEB066] font-bold mb-3 text-lg">{banca.title}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-[#DEB066]/70 uppercase text-xs font-bold mb-1">Total Investido</p>
                            <p className="text-emerald-400 font-black text-xl">{formatCurrency(banca.totalInvested)}</p>
                        </div>
                        <div>
                            <p className="text-[#DEB066]/70 uppercase text-xs font-bold mb-1">Participantes</p>
                            <p className="text-[#DEB066] font-black text-xl">{banca.participants.length}</p>
                        </div>
                    </div>
                </div>

                {/* Input do Saldo Final */}
                <div className="mb-6">
                    <label className="text-[#DEB066] text-sm mb-2 block font-bold uppercase flex items-center gap-2">
                        <Coins size={16} /> Saldo Final *
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DEB066]/60 font-bold text-lg group-focus-within:text-[#DEB066]">R$</span>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={finalBalance}
                            onChange={(e) => setFinalBalance(e.target.value)}
                            className="w-full bg-[#3d1a00] border-2 border-[#DEB066]/30 rounded-xl pl-12 pr-4 py-4 text-2xl font-black text-[#DEB066] placeholder-[#DEB066]/20 focus:outline-none focus:border-[#DEB066] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Preview do Resultado */}
                {isValidInput && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        {/* Lucro/Prejuízo Total */}
                        <div className={`p-4 rounded-xl mb-4 border-2 ${isProfitable ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-red-950/40 border-red-500/30'}`}>
                            <div className="flex items-center gap-3">
                                {isProfitable ? (
                                    <TrendingUp className="text-emerald-400" size={28} />
                                ) : (
                                    <TrendingDown className="text-red-400" size={28} />
                                )}
                                <div>
                                    <p className={`text-sm font-bold uppercase ${isProfitable ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                                        {isProfitable ? 'Lucro Total' : 'Prejuízo Total'}
                                    </p>
                                    <p className={`font-black text-3xl ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {isProfitable ? '+' : ''}{formatCurrency(totalProfit)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Distribuição por Participante */}
                        <h4 className="text-[#DEB066] text-sm mb-3 font-bold uppercase">Distribuição:</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                            {previewParticipants.map((p) => (
                                <div
                                    key={p.id}
                                    className="flex items-center justify-between bg-[#3d1a00]/50 border border-[#DEB066]/20 rounded-lg p-3 hover:bg-[#3d1a00]/80 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 p-[2px]">
                                            <div className="w-full h-full rounded-full bg-red-900 flex items-center justify-center text-xs font-bold text-yellow-400">
                                                {p.name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-yellow-100 text-sm font-medium">{p.name}</p>
                                            <p className="text-yellow-200/50 text-xs">
                                                Investiu: {formatCurrency(p.contribution)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-yellow-100 font-bold">{formatCurrency(p.finalAmount)}</p>
                                        <p className={`text-xs font-medium ${p.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {p.profit >= 0 ? '+' : ''}{formatCurrency(p.profit)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Divider */}
                <div className="chinese-divider" />

                {/* Botões */}
                <div className="flex gap-3">
                    <motion.button
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 bg-red-900/50 border border-yellow-500/30 text-yellow-200 rounded-lg hover:bg-red-900/70 transition-colors font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Cancelar
                    </motion.button>
                    <motion.button
                        onClick={handleConfirm}
                        disabled={!isValidInput}
                        className="flex-1 btn-chinese-red flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CheckCircle size={18} />
                        ENCERRAR
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
