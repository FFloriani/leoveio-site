'use client';

import { RefreshCw, Trash2, Radio, Pause, Play } from 'lucide-react';

interface ReactControlsProps {
    isConnected: boolean;
    queueCount: number;
    isPaused?: boolean;
    onClear: () => void;
    onReconnect: () => void;
    onTogglePause?: () => void;
}

export default function ReactControls({
    isConnected,
    queueCount,
    isPaused = false,
    onClear,
    onReconnect,
    onTogglePause
}: ReactControlsProps) {
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1a0808] to-[#2a1515] rounded-xl border-2 border-[#DEB066]/30">
            {/* Status de conexão */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Radio size={16} className="text-[#DEB066]" />
                    <span className="text-[#DEB066] font-bold text-sm">React Queue</span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${isConnected
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                    {isConnected ? 'Conectado' : 'Desconectado'}
                </div>
            </div>

            {/* Estatísticas */}
            <div className="flex items-center gap-4 text-sm">
                <span className="text-white/60">
                    <span className="text-[#DEB066] font-bold">{queueCount}</span> na fila
                </span>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
                {onTogglePause && (
                    <button
                        onClick={onTogglePause}
                        className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold ${isPaused
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            }`}
                        title={isPaused ? 'Retomar fila' : 'Pausar fila'}
                    >
                        {isPaused ? <Play size={14} /> : <Pause size={14} />}
                        {isPaused ? 'Retomar' : 'Pausar'}
                    </button>
                )}
                <button
                    onClick={onReconnect}
                    className="p-2 rounded-lg bg-[#DEB066]/20 text-[#DEB066] hover:bg-[#DEB066]/30 transition-colors"
                    title="Reconectar"
                >
                    <RefreshCw size={16} />
                </button>
                <button
                    onClick={onClear}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    title="Limpar fila"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
