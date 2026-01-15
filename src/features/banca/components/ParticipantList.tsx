// Lista de participantes - Chinese Casino Style (Reference Match)

'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Participant } from '../types';
import ParticipantCard from './ParticipantCard';

interface ParticipantListProps {
    participants: Participant[];
    onEdit: (participant: Participant) => void;
    onRemove: (participantId: string) => void;
    isLocked?: boolean;
}

export default function ParticipantList({
    participants,
    onEdit,
    onRemove,
    isLocked = false
}: ParticipantListProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="chinese-card p-5"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users size={18} className="text-yellow-500" />
                    <h3 className="text-lg font-bold text-gold-gradient">Participantes</h3>
                </div>
                {/* Delete all button placeholder */}
                <div className="flex items-center gap-2 text-yellow-600/40">
                    {/* Future: batch actions */}
                </div>
            </div>

            {/* Lista */}
            {participants.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#DEB066]/10 flex items-center justify-center border-2 border-[#DEB066]/30">
                        <Users size={32} className="text-[#DEB066]" />
                    </div>
                    <p className="text-[#DEB066] font-medium text-lg">Nenhum participante adicionado ainda</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {participants.map((participant, index) => (
                        <ParticipantCard
                            key={participant.id}
                            participant={participant}
                            index={index}
                            onEdit={onEdit}
                            onRemove={onRemove}
                            isLocked={isLocked}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}
