'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTwitchChat, TwitchCall } from '@/hooks/useTwitchChat';
import { Radio, RefreshCw, Trash2, X } from 'lucide-react';

interface TwitchCallsPanelProps {
    channels?: string | string[];
    enabled?: boolean;
    onCallSelect?: (call: TwitchCall) => void;
}

// Cache de fotos de perfil
const profileCache = new Map<string, string | null>();

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

    const [hiddenCalls, setHiddenCalls] = useState<Set<string>>(new Set());
    const [profilePics, setProfilePics] = useState<Map<string, string | null>>(new Map());
    const listRef = useRef<HTMLDivElement>(null);

    const defaultColors = [
        '#FF4500', '#FF6347', '#2E8B57', '#DAA520', '#D2691E',
        '#5F9EA0', '#1E90FF', '#FF69B4', '#8A2BE2', '#00CED1'
    ];

    const getColor = (call: TwitchCall) => {
        if (call.color) return call.color;
        const hash = call.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return defaultColors[hash % defaultColors.length];
    };

    const hideCall = (callId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setHiddenCalls(prev => new Set([...prev, callId]));
    };

    const visibleCalls = calls.filter(call => !hiddenCalls.has(call.id));

    // Buscar fotos de perfil
    useEffect(() => {
        const fetchProfiles = async () => {
            for (const call of calls) {
                const username = call.username.toLowerCase();

                // Já tem no cache local
                if (profileCache.has(username)) {
                    continue;
                }

                try {
                    const response = await fetch(`/api/twitch-profile?username=${encodeURIComponent(username)}`);
                    const data = await response.json();

                    profileCache.set(username, data.profile_image_url || null);
                    setProfilePics(new Map(profileCache));
                } catch (err) {
                    profileCache.set(username, null);
                }
            }
        };

        if (calls.length > 0) {
            fetchProfiles();
        }
    }, [calls]);

    // Auto-scroll
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [calls]);

    return (
        <div className="chinese-card overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b-2 border-[#DEB066]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Radio size={16} className="text-[#DEB066]" />
                    <span className="text-[#DEB066] font-bold text-sm">Live Calls</span>
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={reconnect} className="p-1.5 text-[#DEB066]/50 hover:text-[#DEB066] rounded">
                        <RefreshCw size={14} />
                    </button>
                    <button onClick={() => { clearCalls(); setHiddenCalls(new Set()); }} className="p-1.5 text-[#DEB066]/50 hover:text-red-400 rounded">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {error && <p className="text-red-400 text-xs px-4 py-1">{error}</p>}

            {/* Lista de calls */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {visibleCalls.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Radio size={32} className="text-[#DEB066]/70 mb-2" />
                        <p className="text-[#DEB066]/70 text-sm font-medium">Aguardando !call...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {visibleCalls.map((call) => {
                            const profileUrl = profilePics.get(call.username.toLowerCase());

                            return (
                                <motion.div
                                    key={call.id}
                                    initial={{ opacity: 0, x: -50, rotate: -2 }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.3, type: "spring" }}
                                    onClick={() => onCallSelect?.(call)}
                                    className="group flex items-start gap-3"
                                >
                                    {/* Avatar */}
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg border-2 border-[#DEB066] flex-shrink-0 transform -rotate-3 overflow-hidden"
                                        style={{ backgroundColor: profileUrl ? 'transparent' : getColor(call) }}
                                    >
                                        {profileUrl ? (
                                            <img
                                                src={profileUrl}
                                                alt={call.displayName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Fallback para inicial se imagem falhar
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            call.displayName.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    {/* Balão de mensagem */}
                                    <div className="flex-1 relative">
                                        {/* Seta */}
                                        <div className="absolute left-0 top-3 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-[#DEB066] -ml-3" />

                                        {/* Conteúdo */}
                                        <div className="relative bg-gradient-to-r from-[#DEB066] to-[#F1D08B] rounded-lg border-2 border-[#C9A050] shadow-lg overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
                                            {/* Header */}
                                            <div className="bg-[#5a2a00] px-3 py-1.5 flex items-center justify-between">
                                                <span className="text-[#DEB066] font-bold text-sm">
                                                    {call.displayName}
                                                </span>
                                                <button
                                                    onClick={(e) => hideCall(call.id, e)}
                                                    className="text-[#DEB066]/50 hover:text-red-300 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>

                                            {/* Slot name */}
                                            <div className="px-4 py-3">
                                                <p className="text-[#5a2a00] font-black text-xl leading-tight">
                                                    {call.slotName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-[#DEB066]/30 text-center">
                <span className="text-[#DEB066] text-xs font-medium">
                    {visibleCalls.length} call{visibleCalls.length !== 1 ? 's' : ''} • #{Array.isArray(channels) ? channels.join(' #') : channels}
                </span>
            </div>
        </div>
    );
}
