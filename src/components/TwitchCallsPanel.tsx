'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTwitchChat, TwitchCall } from '@/hooks/useTwitchChat';
import { Radio, RefreshCw, Trash2, Wifi, WifiOff } from 'lucide-react';

interface TwitchCallsPanelProps {
    channels?: string | string[];
    enabled?: boolean;
    onCallSelect?: (call: TwitchCall) => void;
}

export default function TwitchCallsPanel({
    channels = ['leoveio', 'florianitv'],
    enabled = true,
    onCallSelect
}: TwitchCallsPanelProps) {
    const { calls, isConnected, error, clearCalls, reconnect } = useTwitchChat({
        channels,
        enabled,
        maxCalls: 30
    });

    // Cores padrão da Twitch para viewers sem cor customizada
    const defaultColors = [
        '#FF4500', '#FF6347', '#2E8B57', '#DAA520', '#D2691E',
        '#5F9EA0', '#1E90FF', '#FF69B4', '#8A2BE2', '#00CED1'
    ];

    const getColor = (call: TwitchCall) => {
        if (call.color) return call.color;
        // Gerar cor consistente baseada no username
        const hash = call.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return defaultColors[hash % defaultColors.length];
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 px-4 py-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Radio size={18} className="text-red-400 animate-pulse" />
                        <span className="text-white font-semibold text-sm">Live Calls</span>
                        <span className="text-white/50 text-xs">
                            #{Array.isArray(channels) ? channels.join(' #') : channels}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Status de conexão */}
                        <div className="flex items-center gap-1">
                            {isConnected ? (
                                <Wifi size={14} className="text-green-400" />
                            ) : (
                                <WifiOff size={14} className="text-red-400" />
                            )}
                            <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                                {isConnected ? 'Online' : 'Offline'}
                            </span>
                        </div>

                        {/* Botões de ação */}
                        <button
                            onClick={reconnect}
                            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
                            title="Reconectar"
                        >
                            <RefreshCw size={14} />
                        </button>
                        <button
                            onClick={clearCalls}
                            className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title="Limpar calls"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="text-red-400 text-xs mt-1">{error}</p>
                )}
            </div>

            {/* Instruções */}
            <div className="px-3 py-2 bg-yellow-500/10 border-b border-white/10">
                <p className="text-yellow-400 text-xs text-center">
                    💬 Digite <span className="font-mono bg-yellow-500/20 px-1 rounded">!call nome do slot</span> no chat
                </p>
            </div>

            {/* Lista de calls */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {calls.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <Radio size={32} className="text-white/20 mb-2" />
                        <p className="text-white/40 text-sm">Nenhuma call ainda</p>
                        <p className="text-white/30 text-xs mt-1">Aguardando !call no chat...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {calls.map((call) => (
                            <motion.div
                                key={call.id}
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => onCallSelect?.(call)}
                                className={`bg-white/5 hover:bg-white/10 rounded-lg p-2.5 cursor-pointer transition-colors border border-transparent hover:border-white/20 ${onCallSelect ? 'cursor-pointer' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        {/* Username com cor da Twitch */}
                                        <span
                                            className="font-semibold text-sm"
                                            style={{ color: getColor(call) }}
                                        >
                                            {call.displayName}
                                        </span>

                                        {/* Slot name */}
                                        <p className="text-yellow-400 text-sm font-medium truncate mt-0.5">
                                            🎰 {call.slotName}
                                        </p>
                                    </div>

                                    {/* Timestamp */}
                                    <span className="text-white/30 text-xs flex-shrink-0">
                                        {formatTime(call.timestamp)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Footer com contagem */}
            <div className="px-3 py-2 bg-white/5 border-t border-white/10">
                <p className="text-white/40 text-xs text-center">
                    {calls.length} call{calls.length !== 1 ? 's' : ''} registrada{calls.length !== 1 ? 's' : ''}
                </p>
            </div>
        </div>
    );
}
