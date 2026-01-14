// Modal para editar participante

'use client';

import { motion } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { ParticipantFormData, SlotCallFormData, Participant } from '../types';
import SlotCallsInput from './SlotCallsInput';

interface EditParticipantModalProps {
    isOpen: boolean;
    participant: Participant | null;
    onClose: () => void;
    onSubmit: () => void;
    participantForm: ParticipantFormData;
    setParticipantForm: React.Dispatch<React.SetStateAction<ParticipantFormData>>;
    slotCalls: SlotCallFormData[];
    onAddSlotCall: () => void;
    onRemoveSlotCall: (index: number) => void;
    onUpdateSlotCall: (index: number, field: 'slotName' | 'betValue', value: string) => void;
}

export default function EditParticipantModal({
    isOpen,
    participant,
    onClose,
    onSubmit,
    participantForm,
    setParticipantForm,
    slotCalls,
    onAddSlotCall,
    onRemoveSlotCall,
    onUpdateSlotCall
}: EditParticipantModalProps) {
    if (!isOpen || !participant) return null;

    const handleSubmit = () => {
        onSubmit();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-white/10 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Editar Participante</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Nome */}
                    <div>
                        <label className="text-white/70 text-sm mb-1 block">Nome *</label>
                        <input
                            type="text"
                            placeholder="Nome do participante"
                            value={participantForm.name}
                            onChange={(e) => setParticipantForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                        />
                    </div>

                    {/* Contribuição */}
                    <div>
                        <label className="text-white/70 text-sm mb-1 block">Contribuição (R$) *</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={participantForm.contribution}
                            onChange={(e) => setParticipantForm(prev => ({ ...prev, contribution: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                        />
                    </div>

                    {/* PIX */}
                    <div>
                        <label className="text-white/70 text-sm mb-1 block">Chave PIX</label>
                        <input
                            type="text"
                            placeholder="CPF, E-mail ou Celular"
                            value={participantForm.pix}
                            onChange={(e) => setParticipantForm(prev => ({ ...prev, pix: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
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

                {/* Botões */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={18} />
                        Atualizar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
