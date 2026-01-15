// YouTube Chat Hook - Polling endpoint /api/youtube-chat
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface YouTubeCall {
    id: string;
    username: string;
    displayName: string;
    slotName: string;
    timestamp: Date;
    receivedAt?: number; // When frontend received/processed this call (ms)
    avatarUrl?: string;
    source: 'youtube';
}

// Estatísticas de usuário do YouTube
export interface YouTubeUserStats {
    username: string;
    displayName: string;
    messageCount: number;
    firstSeenAt: number;
    lastSeenAt: number;
    avatarUrl?: string;
}

interface UseYouTubeChatOptions {
    enabled?: boolean;
    pollingInterval?: number; // ms
    maxCalls?: number;
}

interface YouTubeChatResponse {
    calls: YouTubeCall[];
    userStats: Record<string, YouTubeUserStats>;
    isConnected: boolean;
    error: string | null;
    channelId: string | null;
}

export function useYouTubeChat({
    enabled = true,
    pollingInterval = 3000,
    maxCalls = 50
}: UseYouTubeChatOptions = {}) {
    const [calls, setCalls] = useState<YouTubeCall[]>([]);
    const [userStats, setUserStats] = useState<Map<string, YouTubeUserStats>>(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastCallIdRef = useRef<string | null>(null);

    const fetchCalls = useCallback(async () => {
        if (!enabled) return;

        try {
            const response = await fetch('/api/youtube-chat');
            const data: YouTubeChatResponse = await response.json();

            setIsConnected(data.isConnected);
            setError(data.error);

            if (data.calls && data.calls.length > 0) {
                // Adicionar receivedAt para novos calls (quando o frontend processou)
                setCalls(prevCalls => {
                    const existingIds = new Set(prevCalls.map(c => c.id));
                    const newCalls = data.calls
                        .filter(c => !existingIds.has(c.id))
                        .map(c => ({ ...c, receivedAt: Date.now() }));

                    if (newCalls.length === 0) return prevCalls;

                    return [...prevCalls, ...newCalls].slice(-maxCalls);
                });
            }

            // Atualizar estatísticas de usuários
            if (data.userStats) {
                setUserStats(new Map(Object.entries(data.userStats)));
            }
        } catch (err) {
            console.error('[YouTube Chat] Erro no polling:', err);
            setError('Falha ao conectar com API');
            setIsConnected(false);
        }
    }, [enabled, maxCalls]);

    const reconnect = useCallback(async () => {
        try {
            await fetch('/api/youtube-chat?action=reconnect');
            await fetchCalls();
        } catch (err) {
            console.error('[YouTube Chat] Erro ao reconectar:', err);
        }
    }, [fetchCalls]);

    const clearCalls = useCallback(async () => {
        try {
            await fetch('/api/youtube-chat?action=clear');
            setCalls([]);
            lastCallIdRef.current = null;
        } catch (err) {
            console.error('[YouTube Chat] Erro ao limpar:', err);
        }
    }, []);

    useEffect(() => {
        if (!enabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Fetch inicial
        fetchCalls();

        // Polling
        intervalRef.current = setInterval(fetchCalls, pollingInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [enabled, pollingInterval, fetchCalls]);

    // Função para obter estatísticas de um usuário específico
    const getUserStats = useCallback((username: string): YouTubeUserStats | null => {
        return userStats.get(username.toLowerCase()) || null;
    }, [userStats]);

    return {
        calls,
        userStats,
        isConnected,
        error,
        clearCalls,
        getUserStats,
        reconnect
    };
}
