// Modal para adicionar participante - Chinese Casino Style

'use client';

import { motion } from 'framer-motion';
import { X, UserPlus, Wallet, CreditCard } from 'lucide-react';
import { ParticipantFormData, SlotCallFormData } from '../types';
import SlotCallsInput from './SlotCallsInput';

interface AddParticipantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    participantForm: ParticipantFormData;
    setParticipantForm: React.Dispatch<React.SetStateAction<ParticipantFormData>>;
    slotCalls: SlotCallFormData[];
    onAddSlotCall: () => void;
    onRemoveSlotCall: (index: number) => void;
    onUpdateSlotCall: (index: number, field: 'slotName' | 'betValue', value: string) => void;
}

export default function AddParticipantModal({
    isOpen,
    onClose,
    onSubmit,
    participantForm,
    setParticipantForm,
    slotCalls,
    onAddSlotCall,
    onRemoveSlotCall,
    onUpdateSlotCall
}: AddParticipantModalProps) {
    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="chinese-card glow-gold p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center border border-yellow-500/50">
                            <UserPlus size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-yellow-100">Adicionar Participante</h3>
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

                <div className="space-y-5">
                    {/* Nome */}
                    <div>
                        <label className="text-yellow-200/70 text-sm mb-2 block font-medium flex items-center gap-2">
                            <UserPlus size={14} /> Nome *
                        </label>
                        <input
                            type="text"
                            placeholder="Nome do participante"
                            value={participantForm.name}
                            onChange={(e) => setParticipantForm(prev => ({ ...prev, name: e.target.value }))}
                            className="chinese-input w-full"
                            autoFocus
                        />
                    </div>

                    {/* Contribuição */}
                    <div>
                        <label className="text-yellow-200/70 text-sm mb-2 block font-medium flex items-center gap-2">
                            <Wallet size={14} /> Contribuição (R$) *
                        </label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={participantForm.contribution}
                            onChange={(e) => setParticipantForm(prev => ({ ...prev, contribution: e.target.value }))}
                            className="chinese-input w-full text-green-400 font-bold"
                        />
                    </div>

                    {/* PIX */}
                    <div>
                        <label className="text-yellow-200/70 text-sm mb-2 block font-medium flex items-center gap-2">
                            <CreditCard size={14} /> Chave PIX
                        </label>
                        <input
                            type="text"
                            placeholder="CPF, E-mail ou Celular"
                            value={participantForm.pix}
                            onChange={(e) => setParticipantForm(prev => ({ ...prev, pix: e.target.value }))}
                            className="chinese-input w-full"
                        />
                    </div>

                    {/* Slot Calls */}
                    <SlotCallsInput
                        slotCalls={slotCalls}
                        onAdd={onAddSlotCall}
                        onRemove={onRemoveSlotCall}
                        onUpdate={onUpdateSlotCall}
                    />
                </div>

                {/* Divider */}
                <div className="chinese-divider" />

                {/* Botões */}
                <div className="flex gap-3">
                    <motion.button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-red-900/50 border border-yellow-500/30 text-yellow-200 rounded-lg hover:bg-red-900/70 transition-colors font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Cancelar
                    </motion.button>
                    <motion.button
                        onClick={handleSubmit}
                        disabled={!participantForm.name.trim() || !participantForm.contribution}
                        className="flex-1 btn-chinese-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <UserPlus size={18} />
                        ADICIONAR
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
