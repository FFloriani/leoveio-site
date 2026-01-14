// Modal para criar nova banca

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';

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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-white/10"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Nova Banca</h3>
                    <button
                        onClick={handleClose}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Título */}
                    <div>
                        <label className="text-white/70 text-sm mb-1 block">Título</label>
                        <input
                            type="text"
                            placeholder="Ex: Banca do Balão"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                        />
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="text-white/70 text-sm mb-1 block">Descrição</label>
                        <textarea
                            placeholder="Descrição opcional da banca"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                        />
                    </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={18} />
                        Criar Banca
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
