// React Queue Hook - Captura !react do chat
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { VideoReact, VideoPlatform } from '@/features/react/types';
import { parseVideoLink, isValidVideoUrl } from '@/features/react/utils/linkParser';

interface UseReactQueueOptions {
    channels: string | string[];
    enabled?: boolean;
    maxQueue?: number;
    cooldownMs?: number; // Cooldown por usuário
}

interface TwitchMessage {
    username: string;
    displayName: string;
    message: string;
    color?: string;
}

export function useReactQueue({
    channels,
    enabled = true,
    maxQueue = 50,
    cooldownMs = 30000 // 30 segundos de cooldown
}: UseReactQueueOptions) {
    const [queue, setQueue] = useState<VideoReact[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const userCooldowns = useRef<Map<string, number>>(new Map());

    // Memoizar channelList para evitar recriação a cada render
    const channelList = useMemo(() =>
        Array.isArray(channels) ? channels : [channels],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(channels)]
    );

    // Verificar cooldown do usuário
    const isOnCooldown = (username: string): boolean => {
        const lastReact = userCooldowns.current.get(username.toLowerCase());
        if (!lastReact) return false;
        return Date.now() - lastReact < cooldownMs;
    };

    // Adicionar vídeo à fila
    const addToQueue = useCallback((video: Omit<VideoReact, 'id' | 'receivedAt' | 'status'>) => {
        const now = Date.now();
        const videoId = now.toString() + Math.random().toString(36).substr(2, 9);
        const newVideo: VideoReact = {
            ...video,
            id: videoId,
            receivedAt: now,
            status: 'pending',
            extracting: true, // Marcando como em extração
        };

        setQueue(prev => {
            // Verificar duplicatas (mesma URL)
            if (prev.some(v => v.url === newVideo.url && v.status !== 'watched')) {
                console.log(`[React Queue] URL duplicada ignorada: ${newVideo.url}`);
                return prev;
            }
            return [...prev, newVideo].slice(-maxQueue);
        });

        // Registrar cooldown
        userCooldowns.current.set(video.username.toLowerCase(), now);
        console.log(`[React Queue] Adicionado: ${video.displayName} -> ${video.url}`);

        // Para plataformas que não são YouTube, buscar apenas metadados (thumbnail/título)
        // YouTube não precisa pois o iframe já mostra tudo
        if (video.platform !== 'youtube') {
            console.log(`[React Queue] Buscando metadados para: ${video.url}`);
            fetch(`/api/video-metadata?url=${encodeURIComponent(video.url)}&platform=${video.platform}`)
                .then(res => res.json())
                .then(data => {
                    setQueue(prev => prev.map(v => {
                        if (v.id === videoId) {
                            console.log(`[React Queue] Metadados obtidos:`, data.title?.substring(0, 40));
                            if (data.videoUrl) {
                                console.log(`[React Queue] URL do vídeo:`, data.videoUrl.substring(0, 60));
                            }
                            return {
                                ...v,
                                title: data.title || v.title,
                                thumbnail: data.thumbnail || v.thumbnail,
                                directUrl: data.videoUrl || v.directUrl, // URL direta do MP4!
                                extracting: false
                            };
                        }
                        return v;
                    }));
                })
                .catch(err => {
                    console.error(`[React Queue] Erro ao buscar metadados:`, err);
                    setQueue(prev => prev.map(v => {
                        if (v.id === videoId) {
                            return { ...v, extracting: false };
                        }
                        return v;
                    }));
                });
        }
    }, [maxQueue]);

    // Próximo vídeo
    const next = useCallback(() => {
        setQueue(prev => {
            const newQueue = [...prev];
            if (newQueue[currentIndex]) {
                newQueue[currentIndex] = { ...newQueue[currentIndex], status: 'watched', watchedAt: Date.now() };
            }
            return newQueue;
        });
        setCurrentIndex(prev => Math.min(prev + 1, queue.length));
    }, [currentIndex, queue.length]);

    // Pular vídeo (sem marcar como assistido)
    const skip = useCallback(() => {
        setQueue(prev => {
            const newQueue = [...prev];
            if (newQueue[currentIndex]) {
                newQueue[currentIndex] = { ...newQueue[currentIndex], status: 'skipped' };
            }
            return newQueue;
        });
        setCurrentIndex(prev => Math.min(prev + 1, queue.length));
    }, [currentIndex, queue.length]);

    // Remover vídeo específico
    const remove = useCallback((videoId: string) => {
        setQueue(prev => prev.filter(v => v.id !== videoId));
    }, []);

    // Limpar fila
    const clearQueue = useCallback(() => {
        setQueue([]);
        setCurrentIndex(0);
    }, []);

    // Vídeo atual
    const currentVideo = queue[currentIndex] || null;

    // Vídeos pendentes (próximos na fila)
    const pendingVideos = queue.slice(currentIndex + 1).filter(v => v.status === 'pending');

    // Parse Twitch IRC message
    const parseTwitchMessage = (raw: string): TwitchMessage | null => {
        try {
            const tagsMatch = raw.match(/^@([^ ]+)/);
            const messageMatch = raw.match(/PRIVMSG #\w+ :(.+)$/);

            if (!messageMatch) return null;

            const tags: Record<string, string> = {};
            if (tagsMatch) {
                tagsMatch[1].split(';').forEach(tag => {
                    const [key, value] = tag.split('=');
                    tags[key] = value;
                });
            }

            return {
                username: tags['display-name']?.toLowerCase() || 'unknown',
                displayName: tags['display-name'] || 'Anônimo',
                message: messageMatch[1].trim(),
                color: tags['color']
            };
        } catch {
            return null;
        }
    };

    // Conectar ao IRC
    const connect = useCallback(() => {
        if (!enabled || channelList.length === 0) return;

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        try {
            const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[React Queue] Conectado ao Twitch IRC');
                ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
                ws.send('PASS SCHMOOPIIE');
                ws.send(`NICK justinfan${Math.floor(Math.random() * 99999)}`);

                channelList.forEach(channel => {
                    ws.send(`JOIN #${channel.toLowerCase()}`);
                    console.log(`[React Queue] Entrou no canal: #${channel}`);
                });

                setIsConnected(true);
                setError(null);
            };

            ws.onmessage = (event) => {
                const lines = event.data.split('\r\n');

                for (const line of lines) {
                    if (!line) continue;

                    // Responder PING
                    if (line.startsWith('PING')) {
                        ws.send('PONG :tmi.twitch.tv');
                        continue;
                    }

                    // Processar mensagens
                    if (line.includes('PRIVMSG')) {
                        const parsed = parseTwitchMessage(line);
                        if (parsed) {
                            // DEBUG: Log todas as mensagens
                            console.log(`[React Queue] Mensagem: ${parsed.displayName}: ${parsed.message}`);

                            // Verificar comando !react
                            const reactMatch = parsed.message.match(/^!react\s+(.+)/i);
                            if (reactMatch) {
                                const url = reactMatch[1].trim();
                                console.log(`[React Queue] Comando !react detectado: ${url}`);

                                // Validar URL
                                if (!isValidVideoUrl(url)) {
                                    console.log(`[React Queue] URL inválida: ${url}`);
                                    continue;
                                }

                                // Verificar cooldown
                                if (isOnCooldown(parsed.username)) {
                                    console.log(`[React Queue] Cooldown: ${parsed.username}`);
                                    continue;
                                }

                                // Parsear link
                                const linkInfo = parseVideoLink(url);
                                console.log(`[React Queue] Link parseado:`, linkInfo);

                                // Adicionar à fila
                                addToQueue({
                                    url: linkInfo.originalUrl,
                                    platform: linkInfo.platform,
                                    videoId: linkInfo.videoId,
                                    username: parsed.username,
                                    displayName: parsed.displayName,
                                    source: 'twitch'
                                });

                                console.log(`[React Queue] Vídeo adicionado à fila!`);
                            }
                        }
                    }
                }
            };

            ws.onerror = (event) => {
                console.warn('[React Queue] Erro de conexão, reconectando em 5s...', event);
                // Não mostrar erro na UI na primeira tentativa, só se falhar várias vezes
            };

            ws.onclose = (event) => {
                console.log('[React Queue] Desconectado:', event.code, event.reason);
                setIsConnected(false);

                // Reconectar automaticamente se ainda habilitado
                if (enabled && !reconnectTimeoutRef.current) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectTimeoutRef.current = null;
                        connect();
                    }, 5000);
                }
            };

        } catch (err) {
            console.error('[React Queue] Erro ao conectar:', err);
            setError('Falha ao conectar');
        }
    }, [enabled, channelList, addToQueue]);

    // Reconectar
    const reconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
        }
        connect();
    }, [connect]);

    // Lifecycle
    useEffect(() => {
        connect();
        return () => {
            if (wsRef.current) wsRef.current.close();
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        };
    }, [connect]);

    return {
        queue,
        currentVideo,
        currentIndex,
        pendingVideos,
        isConnected,
        error,
        next,
        skip,
        remove,
        clearQueue,
        reconnect,
        addToQueue
    };
}
