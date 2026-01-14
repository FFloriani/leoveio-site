// Componente de lista de participantes

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
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users size={20} />
                Participantes
            </h3>

            {participants.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                >
                    <Users size={48} className="mx-auto text-white/20 mb-3" />
                    <p className="text-white/50">Nenhum participante adicionado ainda</p>
                </motion.div>
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
        </div>
    );
}
