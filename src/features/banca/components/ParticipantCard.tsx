// Componente de card de participante

'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
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
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {participant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="text-white font-semibold">{participant.name}</h4>
                        <p className="text-green-400 text-sm font-medium">
                            {formatCurrency(participant.contribution)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-lg">
                        {formatPercent(participant.percentage)}
                    </span>
                    {!isLocked && (
                        <>
                            <button
                                onClick={() => onEdit(participant)}
                                className="p-2 text-white/50 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                title="Editar"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => onRemove(participant.id)}
                                className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Remover"
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Barra de progresso */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${participant.percentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                />
            </div>

            {/* Informações adicionais */}
            <div className="flex flex-wrap gap-2">
                {participant.pix && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                        💳 PIX: {participant.pix}
                    </span>
                )}

                {/* Slot Calls */}
                {participant.slotCalls && participant.slotCalls.length > 0 && (
                    participant.slotCalls.map((call, i) => (
                        <span
                            key={call.id || i}
                            className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs"
                        >
                            🎰 {call.slotName}
                            {call.betValue && ` - ${formatCurrency(call.betValue)}`}
                        </span>
                    ))
                )}

                {/* Compatibilidade com formato legado */}
                {!participant.slotCalls && participant.slotCall && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                        🎰 {participant.slotCall}
                        {participant.betValue && ` - ${formatCurrency(participant.betValue)}`}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
