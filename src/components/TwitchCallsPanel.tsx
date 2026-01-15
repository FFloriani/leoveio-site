'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTwitchChat, TwitchCall } from '@/hooks/useTwitchChat';
import { useYouTubeChat, YouTubeCall } from '@/hooks/useYouTubeChat';
import { Radio, RefreshCw, Trash2, X, Youtube, Twitch, Crown, Check, ExternalLink } from 'lucide-react';

// Tipo unificado para calls de ambas plataformas
type UnifiedCall = (TwitchCall & { source?: 'twitch' }) | YouTubeCall;

interface LiveCallsPanelProps {
    channels?: string | string[];
    youtubeEnabled?: boolean;
    enabled?: boolean;
    vipNames?: string[];
    participantNames?: string[]; // Lista de participantes da banca
    ownerNames?: string[]; // Contas sem nenhuma restrição de cooldown (streamers)
    cooldownNormal?: number; // Cooldown para usuários normais (ms) - padrão 30 min
    cooldownVip?: number; // Cooldown para VIPs/participantes (ms) - padrão 10 min
    onCallSelect?: (call: UnifiedCall) => void;
}

// Cache de fotos de perfil
const profileCache = new Map<string, string | null>();

export default function TwitchCallsPanel({
    channels = ['leoveio', 'florianitv'],
    youtubeEnabled = true,
    enabled = true,
    vipNames = [],
    participantNames = [],
    ownerNames = ['florianitv', '@florianitv'], // Contas do streamer sem cooldown
    cooldownNormal = 30 * 60 * 1000, // 30 minutos
    cooldownVip = 10 * 60 * 1000, // 10 minutos
    onCallSelect
}: LiveCallsPanelProps) {
    // Hook Twitch
    const {
        calls: twitchCalls,
        userStats: twitchUserStats,
        isConnected: twitchConnected,
        error: twitchError,
        clearCalls: clearTwitchCalls,
        clearUserStats: clearTwitchUserStats,
        reconnect: reconnectTwitch
    } = useTwitchChat({
        channels,
        enabled,
        maxCalls: 30
    });

    // Hook YouTube
    const {
        calls: youtubeCalls,
        userStats: youtubeUserStats,
        isConnected: youtubeConnected,
        error: youtubeError,
        clearCalls: clearYoutubeCalls,
        reconnect: reconnectYoutube
    } = useYouTubeChat({
        enabled: enabled && youtubeEnabled,
        pollingInterval: 3000,
        maxCalls: 30
    });

    // Estado de calls escondidas - persiste em localStorage
    const [hiddenCalls, setHiddenCalls] = useState<Set<string>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('hiddenCalls');
            if (saved) {
                try {
                    return new Set(JSON.parse(saved));
                } catch {
                    return new Set();
                }
            }
        }
        return new Set();
    });

    // Salvar no localStorage quando mudar
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('hiddenCalls', JSON.stringify([...hiddenCalls]));
        }
    }, [hiddenCalls]);

    const [profilePics, setProfilePics] = useState<Map<string, string | null>>(new Map());
    const listRef = useRef<HTMLDivElement>(null);

    const defaultColors = [
        '#FF4500', '#FF6347', '#2E8B57', '#DAA520', '#D2691E',
        '#5F9EA0', '#1E90FF', '#FF69B4', '#8A2BE2', '#00CED1'
    ];

    // Normalizar nomes VIP para comparação
    const normalizedVipNames = useMemo(() =>
        vipNames.map(n => n.toLowerCase().trim()),
        [vipNames]
    );

    // Normalizar nomes de participantes
    const normalizedParticipantNames = useMemo(() =>
        participantNames.map(n => n.toLowerCase().trim()),
        [participantNames]
    );

    // Normalizar nomes de owners (sem cooldown)
    const normalizedOwnerNames = useMemo(() =>
        ownerNames.map(n => n.toLowerCase().trim().replace(/^@/, '')),
        [ownerNames]
    );

    // Verificar se um call é do owner (sem cooldown)
    const isOwner = (call: UnifiedCall) => {
        const name = call.displayName.toLowerCase().trim().replace(/^@/, '');
        const username = call.username.toLowerCase().trim().replace(/^@/, '');
        return normalizedOwnerNames.includes(name) || normalizedOwnerNames.includes(username);
    };

    // Obter contagem de mensagens do usuário
    const getUserMessageCount = (call: UnifiedCall): number => {
        const isYouTube = 'source' in call && call.source === 'youtube';
        const userKey = call.username.toLowerCase();

        if (isYouTube) {
            return youtubeUserStats.get(userKey)?.messageCount || 0;
        } else {
            return twitchUserStats.get(userKey)?.messageCount || 0;
        }
    };

    // Verificar se um call é VIP ou participante (tem cooldown reduzido)
    // Twitch: 50+ msgs, YouTube: 25+ msgs = VIP automático
    const isVipOrParticipant = (call: UnifiedCall) => {
        const name = call.displayName.toLowerCase().trim();
        const messageCount = getUserMessageCount(call);
        const isYouTube = 'source' in call && call.source === 'youtube';

        // Threshold diferente por plataforma
        const vipThreshold = isYouTube ? 25 : 50;
        if (messageCount >= vipThreshold) return true;

        return normalizedVipNames.includes(name) || normalizedParticipantNames.includes(name);
    };

    // Verificar se um call é VIP (para exibição visual)
    // Twitch: 50+ msgs, YouTube: 25+ msgs = VIP automático
    const isVipCall = (call: UnifiedCall) => {
        const messageCount = getUserMessageCount(call);
        const isYouTube = 'source' in call && call.source === 'youtube';

        // Threshold diferente por plataforma
        const vipThreshold = isYouTube ? 25 : 50;
        if (messageCount >= vipThreshold) return true;

        return normalizedVipNames.includes(call.displayName.toLowerCase().trim());
    };

    // Combinar calls de ambas plataformas, aplicar cooldown e ordenar
    const allCalls = useMemo(() => {
        const twitch: UnifiedCall[] = twitchCalls.map(c => ({ ...c, source: 'twitch' as const }));
        const youtube: UnifiedCall[] = youtubeCalls;

        const combined = [...twitch, ...youtube];

        // Função para obter o timestamp de recebimento (receivedAt é mais preciso)
        const getReceivedAt = (call: UnifiedCall): number => {
            // Usar receivedAt se disponível (quando o frontend processou)
            if ('receivedAt' in call && typeof call.receivedAt === 'number') {
                return call.receivedAt;
            }
            // Fallback para timestamp original
            const ts = call.timestamp;
            if (typeof ts === 'number') return ts;
            if (ts instanceof Date) return ts.getTime();
            const parsed = new Date(ts);
            return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
        };

        const now = Date.now();

        // Mapa para rastrear qual call de cada usuário foi a primeira aceita
        const acceptedCallIds = new Set<string>();
        const userFirstAcceptedCall = new Map<string, { time: number; id: string }>();

        // Primeiro passo: ordenar por tempo (mais antigo primeiro) para processar na ordem correta
        const sortedByTime = [...combined].sort((a, b) => getReceivedAt(a) - getReceivedAt(b));

        // Filtrar calls baseado no cooldown anti-spam
        for (const call of sortedByTime) {
            const username = call.username.toLowerCase();
            const callTime = getReceivedAt(call);

            // Owners não têm cooldown - sempre aceitos
            if (isOwner(call)) {
                acceptedCallIds.add(call.id);
                continue;
            }

            const isSpecial = isVipOrParticipant(call);
            const cooldown = isSpecial ? cooldownVip : cooldownNormal;

            const firstAccepted = userFirstAcceptedCall.get(username);

            if (!firstAccepted) {
                // Primeiro call deste usuário - aceitar
                userFirstAcceptedCall.set(username, { time: callTime, id: call.id });
                acceptedCallIds.add(call.id);
            } else if ((callTime - firstAccepted.time) >= cooldown) {
                // Passou tempo suficiente desde o primeiro call - aceitar este e atualizar referência
                userFirstAcceptedCall.set(username, { time: callTime, id: call.id });
                acceptedCallIds.add(call.id);
            }
            // Se não passou tempo suficiente, não adiciona ao set (será filtrado)
        }

        // Filtrar apenas calls aceitas
        const filteredByCooldown = combined.filter(call => acceptedCallIds.has(call.id));

        // Ordenar: VIPs primeiro, depois por ordem de recebimento (mais antigo primeiro)
        return filteredByCooldown
            .sort((a, b) => {
                const aVip = normalizedVipNames.includes(a.displayName.toLowerCase().trim());
                const bVip = normalizedVipNames.includes(b.displayName.toLowerCase().trim());

                // VIPs vêm primeiro
                if (aVip && !bVip) return -1;
                if (!aVip && bVip) return 1;

                // Dentro do mesmo grupo, ordenar por receivedAt (mais antigo primeiro)
                return getReceivedAt(a) - getReceivedAt(b);
            })
            .slice(-50);
    }, [twitchCalls, youtubeCalls, normalizedVipNames, normalizedParticipantNames, cooldownVip, cooldownNormal]);

    const getColor = (call: UnifiedCall) => {
        if ('color' in call && call.color) return call.color;
        const hash = call.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return defaultColors[hash % defaultColors.length];
    };

    const getAvatarUrl = (call: UnifiedCall) => {
        if ('avatarUrl' in call && call.avatarUrl) return call.avatarUrl;
        return profilePics.get(call.username.toLowerCase()) || null;
    };

    // Obter estatísticas de um usuário (mensagens + tempo ativo)
    const getUserCallStats = (call: UnifiedCall): { messageCount: number; firstSeenAt: number | null } => {
        const isYouTube = 'source' in call && call.source === 'youtube';
        const userKey = call.username.toLowerCase();

        if (isYouTube) {
            const stats = youtubeUserStats.get(userKey);
            return {
                messageCount: stats?.messageCount || 0,
                firstSeenAt: stats?.firstSeenAt || null
            };
        } else {
            const stats = twitchUserStats.get(userKey);
            return {
                messageCount: stats?.messageCount || 0,
                firstSeenAt: stats?.firstSeenAt || null
            };
        }
    };

    // Formatar tempo relativo
    const formatTimeSince = (timestamp: number | null): string => {
        if (!timestamp) return '';
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `${hours}h${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m`;
        return '<1m';
    };

    const hideCall = (callId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setHiddenCalls(prev => new Set([...prev, callId]));
    };

    const handleClearAll = () => {
        clearTwitchCalls();
        clearTwitchUserStats(); // Limpa estatísticas de mensagens do Twitch
        clearYoutubeCalls(); // Também limpa estatísticas do YouTube no servidor
        setHiddenCalls(new Set());
    };

    const handleReconnectAll = () => {
        reconnectTwitch();
        reconnectYoutube();
    };

    const handleOpenPopup = () => {
        const width = 400;
        const height = 700;
        const left = window.screenX + window.outerWidth - width - 50;
        const top = window.screenY + 50;

        window.open(
            '/livecalls',
            'LiveCalls',
            `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
        );
    };

    const visibleCalls = allCalls.filter(call => !hiddenCalls.has(call.id));

    // Status de conexão combinado
    const isConnected = twitchConnected || youtubeConnected;
    const error = twitchError || youtubeError;

    // Buscar fotos de perfil (apenas para Twitch)
    useEffect(() => {
        const fetchProfiles = async () => {
            for (const call of twitchCalls) {
                const username = call.username.toLowerCase();

                if (profileCache.has(username)) {
                    continue;
                }

                try {
                    const response = await fetch(`/api/twitch-profile?username=${encodeURIComponent(username)}`);
                    const data = await response.json();

                    profileCache.set(username, data.profile_image_url || null);
                    setProfilePics(new Map(profileCache));
                } catch {
                    profileCache.set(username, null);
                }
            }
        };

        if (twitchCalls.length > 0) {
            fetchProfiles();
        }
    }, [twitchCalls]);

    // Auto-scroll
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [allCalls]);

    return (
        <div className="chinese-card overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b-2 border-[#DEB066]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Radio size={16} className="text-[#DEB066]" />
                    <span className="text-[#DEB066] font-bold text-sm">Live Calls</span>
                    <div className="flex items-center gap-1">
                        {/* Twitch Status */}
                        <span
                            className={`w-2 h-2 rounded-full ${twitchConnected ? 'bg-purple-400' : 'bg-gray-500'}`}
                            title={`Twitch: ${twitchConnected ? 'Conectado' : 'Desconectado'}`}
                        />
                        {/* YouTube Status */}
                        {youtubeEnabled && (
                            <span
                                className={`w-2 h-2 rounded-full ${youtubeConnected ? 'bg-red-400' : 'bg-gray-500'}`}
                                title={`YouTube: ${youtubeConnected ? 'Conectado' : 'Desconectado'}`}
                            />
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={handleOpenPopup} className="p-1.5 text-[#DEB066]/50 hover:text-blue-400 rounded" title="Abrir em popup">
                        <ExternalLink size={14} />
                    </button>
                    <button onClick={handleReconnectAll} className="p-1.5 text-[#DEB066]/50 hover:text-[#DEB066] rounded" title="Reconectar">
                        <RefreshCw size={14} />
                    </button>
                    <button onClick={handleClearAll} className="p-1.5 text-[#DEB066]/50 hover:text-red-400 rounded" title="Limpar tudo">
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
                            const avatarUrl = getAvatarUrl(call);
                            const isYouTube = 'source' in call && call.source === 'youtube';
                            const isVip = isVipCall(call);

                            // Determinar cores baseado no tipo
                            const getBorderColor = () => {
                                if (isVip) return '#DEB066';
                                if (isYouTube) return '#FF0000';
                                return '#A970FF';
                            };

                            const getBackgroundGradient = () => {
                                if (isVip) return 'linear-gradient(to right, #DEB066, #F1D08B)';
                                if (isYouTube) return 'linear-gradient(to right, #FF0000, #CC0000)';
                                return 'linear-gradient(to right, #A970FF, #8B5CF6)';
                            };

                            const getHeaderBg = () => {
                                if (isVip) return 'bg-[#5a4a00]';
                                if (isYouTube) return 'bg-[#5a2a00]';
                                return 'bg-[#2a1a4a]';
                            };

                            const getIcon = () => {
                                if (isVip) return <Crown size={12} className="text-[#DEB066]" />;
                                if (isYouTube) return <Youtube size={12} className="text-red-400" />;
                                return <Twitch size={12} className="text-[#A970FF]" />;
                            };

                            return (
                                <motion.div
                                    key={call.id}
                                    layout
                                    initial={{
                                        opacity: 0,
                                        x: -120,
                                        scale: 0.5,
                                        rotate: -10
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        scale: 1,
                                        rotate: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: 120,
                                        scale: 0.5,
                                        rotate: 10
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 15,
                                        mass: 0.8
                                    }}
                                    whileHover={{
                                        scale: 1.03,
                                        rotate: 1,
                                        transition: { type: "spring", stiffness: 400 }
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => onCallSelect?.(call)}
                                    className={`group flex items-start gap-3 ${isVip ? 'relative' : ''}`}
                                >
                                    {/* VIP Glow Effect */}
                                    {isVip && (
                                        <div className="absolute inset-0 bg-[#DEB066]/20 rounded-xl blur-md -z-10" />
                                    )}

                                    {/* Avatar com badge de mensagens */}
                                    <div className="relative flex-shrink-0">
                                        <div
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg border-2 transform -rotate-3 overflow-hidden ${isVip ? 'ring-2 ring-[#DEB066] ring-offset-2 ring-offset-[#1a0808]' : ''}`}
                                            style={{
                                                backgroundColor: avatarUrl ? 'transparent' : getColor(call),
                                                borderColor: getBorderColor()
                                            }}
                                        >
                                            {avatarUrl ? (
                                                <img
                                                    src={avatarUrl}
                                                    alt={call.displayName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                call.displayName.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        {/* Badge de contagem de mensagens com animação */}
                                        {(() => {
                                            const stats = getUserCallStats(call);
                                            if (stats.messageCount > 0) {
                                                return (
                                                    <motion.div
                                                        key={`msg-${call.username}-${stats.messageCount}`}
                                                        initial={{ scale: 1.5, rotate: -25 }}
                                                        animate={{ scale: 1, rotate: -25 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 500,
                                                            damping: 15
                                                        }}
                                                        className="absolute text-[#DEB066] font-black text-sm"
                                                        style={{
                                                            bottom: '-6px',
                                                            left: '-4px',
                                                            textShadow: '2px 2px 0 #1a0808, -1px -1px 0 #1a0808, 1px -1px 0 #1a0808, -1px 1px 0 #1a0808, 0 2px 0 #1a0808',
                                                            fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                                                            letterSpacing: '0.5px'
                                                        }}
                                                    >
                                                        {stats.messageCount}
                                                    </motion.div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>

                                    {/* Balão de mensagem */}
                                    <div className="flex-1 relative">
                                        {/* Seta */}
                                        <div
                                            className="absolute left-0 top-3 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] -ml-3"
                                            style={{ borderRightColor: getBorderColor() }}
                                        />

                                        {/* Conteúdo */}
                                        <div
                                            className={`relative rounded-lg border-2 shadow-lg overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer ${isVip ? 'shadow-[0_0_15px_rgba(222,176,102,0.4)]' : ''}`}
                                            style={{
                                                background: getBackgroundGradient(),
                                                borderColor: isVip ? '#C9A050' : (isYouTube ? '#CC0000' : '#7C3AED')
                                            }}
                                        >
                                            {/* Header */}
                                            <div className={`${getHeaderBg()} px-3 py-1.5 flex items-center justify-between`}>
                                                <div className="flex items-center gap-1.5">
                                                    {getIcon()}
                                                    <span className={isVip ? "text-[#DEB066] font-bold text-sm" : "text-white font-bold text-sm"}>
                                                        {call.displayName}
                                                        {isVip && <span className="ml-1 text-xs opacity-70">★ VIP</span>}
                                                    </span>
                                                </div>
                                                {/* Tempo na live */}
                                                {(() => {
                                                    const stats = getUserCallStats(call);
                                                    const timeSince = formatTimeSince(stats.firstSeenAt);
                                                    if (timeSince) {
                                                        return (
                                                            <span className={`text-xs font-medium ${isVip ? 'text-[#DEB066]/80' : 'text-white/70'}`}>
                                                                ⏱️ {timeSince}
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>

                                            {/* Slot name + Checkmark para fechar */}
                                            <div className="px-4 py-2 flex items-center justify-between">
                                                <p className={isVip ? "text-[#5a2a00] font-black text-xl leading-tight" : "text-white font-black text-xl leading-tight"}>
                                                    {call.slotName}
                                                </p>
                                                <button
                                                    onClick={(e) => hideCall(call.id, e)}
                                                    className={`p-1.5 rounded-full transition-all hover:scale-110 ${isVip ? 'bg-[#5a2a00]/20 text-[#5a2a00] hover:bg-green-500/30 hover:text-green-700' : 'bg-white/10 text-white/50 hover:bg-green-500/30 hover:text-green-400'}`}
                                                    title="Marcar como atendido"
                                                >
                                                    <Check size={18} strokeWidth={3} />
                                                </button>
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
                    {visibleCalls.length} call{visibleCalls.length !== 1 ? 's' : ''} •
                    <span className="text-purple-400"> Twitch</span>
                    {youtubeEnabled && <span className="text-red-400"> + YouTube</span>}
                </span>
            </div>
        </div>
    );
}
