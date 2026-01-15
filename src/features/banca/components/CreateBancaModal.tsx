// Modal para criar nova banca - Chinese Casino Style

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';

interface CreateBancaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, description: string) => void;
}

export default function CreateBancaModal({
    isOpen,
    onClose,
    onSubmit
}: CreateBancaModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(title, description);
        setTitle('');
        setDescription('');
        onClose();
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="chinese-card glow-gold p-6 w-full max-w-md"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center border border-yellow-300/50">
                            <Sparkles size={20} className="text-red-900" />
                        </div>
                        <h3 className="text-xl font-black text-gold-gradient">NOVA BANCA</h3>
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

                <div className="space-y-5">
                    {/* Título */}
                    <div>
                        <label className="text-yellow-200/70 text-sm mb-2 block font-medium">Título</label>
                        <input
                            type="text"
                            placeholder="Ex: Banca do Balão"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="chinese-input w-full"
                            autoFocus
                        />
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="text-yellow-200/70 text-sm mb-2 block font-medium">Descrição (opcional)</label>
                        <textarea
                            placeholder="Descrição da banca..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="chinese-input w-full resize-none"
                        />
                    </div>
                </div>

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
                        onClick={handleSubmit}
                        disabled={!title.trim()}
                        className="flex-1 btn-chinese-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        CRIAR BANCA
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
