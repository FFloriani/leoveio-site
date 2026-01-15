// Componente de card de participante - Chinese Casino Style (Reference Match)

'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2, Wallet, Gamepad2 } from 'lucide-react';
import { Participant } from '../types';
import { formatCurrency, formatPercent } from '../utils/export';

interface ParticipantCardProps {
    participant: Participant;
    index: number;
    onEdit: (participant: Participant) => void;
    onRemove: (participantId: string) => void;
    isLocked?: boolean;
}

export default function ParticipantCard({
    participant,
    index,
    onEdit,
    onRemove,
    isLocked = false
}: ParticipantCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-xl p-4 mb-3 border-2 border-[#DEB066]/40 bg-gradient-to-br from-[#2a0808] to-[#3f1010] shadow-lg hover:border-[#DEB066] transition-all"
        >
            {/* Header Row */}
            <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#F1D08B] to-[#B8860B] p-[2px] shadow-lg">
                        <div className="w-full h-full rounded-full bg-[#3d0000] flex items-center justify-center text-lg font-black text-[#F1D08B]">
                            {participant.name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-lg tracking-wide drop-shadow-md">
                            {participant.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[#DEB066] text-sm font-bold opacity-80 uppercase text-[10px] tracking-wider">Investiu</span>
                            <p className="text-[#4ade80] text-sm font-black flex items-center gap-1 bg-[#000000]/40 px-2 py-0.5 rounded border border-[#4ade80]/30 shadow-sm">
                                <Wallet size={12} className="text-[#4ade80]" />
                                {formatCurrency(participant.contribution)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {/* Percentage Badge */}
                    <span className="bg-[#F1D08B] text-[#3d1a00] text-sm font-black px-2.5 py-0.5 rounded-md shadow-lg border border-white/20">
                        {formatPercent(participant.percentage)}
                    </span>

                    {/* Action Buttons */}
                    {!isLocked && (
                        <div className="flex gap-1 opacity-100">
                            <motion.button
                                onClick={() => onEdit(participant)}
                                className="p-1.5 text-[#DEB066] bg-[#DEB066]/10 hover:bg-[#DEB066] hover:text-[#3d1a00] rounded-lg transition-all border border-[#DEB066]/30"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Edit size={14} strokeWidth={2.5} />
                            </motion.button>
                            <motion.button
                                onClick={() => onRemove(participant.id)}
                                className="p-1.5 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/30"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Trash2 size={14} strokeWidth={2.5} />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-3 rounded-full bg-[#000000]/60 mb-3 overflow-hidden border border-[#DEB066]/30 shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${participant.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#DEB066] via-[#F1D08B] to-[#DEB066] rounded-full shadow-[0_0_15px_rgba(222,176,102,0.6)]"
                />
            </div>

            {/* Tags */}
            {(participant.pix || (participant.slotCalls && participant.slotCalls.length > 0) || participant.slotCall) && (
                <div className="flex flex-wrap gap-2 relative z-10">
                    {participant.pix && (
                        <span className="px-2.5 py-1 bg-cyan-900/60 text-cyan-200 font-bold rounded-md text-xs border border-cyan-500/50 flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            PIX: {participant.pix}
                        </span>
                    )}

                    {participant.slotCalls && participant.slotCalls.length > 0 && (
                        participant.slotCalls.map((call, i) => (
                            <span
                                key={call.id || i}
                                className="px-2.5 py-1 bg-purple-900/60 text-purple-200 font-bold rounded-md text-xs border border-purple-500/50 flex items-center gap-1.5 shadow-sm"
                            >
                                <Gamepad2 size={12} className="text-purple-400" />
                                {call.slotName}
                            </span>
                        ))
                    )}

                    {!participant.slotCalls && participant.slotCall && (
                        <span className="px-2.5 py-1 bg-purple-900/60 text-purple-200 font-bold rounded-md text-xs border border-purple-500/50 flex items-center gap-1.5 shadow-sm">
                            <Gamepad2 size={12} className="text-purple-400" />
                            {participant.slotCall}
                        </span>
                    )}
                </div>
            )}

            {/* Background Texture/Glow */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#DEB066]/5 blur-2xl rounded-full pointer-events-none" />
        </motion.div>
    );
}
