// Twitch Chat IRC Hook - Captura mensagens !call do chat
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface TwitchCall {
    id: string;
    username: string;
    displayName: string;
    slotName: string;
    timestamp: Date;
    color?: string;
}

interface UseTwitchChatOptions {
    channels: string | string[]; // Pode ser um canal ou array de canais
    enabled?: boolean;
    maxCalls?: number;
}

export function useTwitchChat({ channels, enabled = true, maxCalls = 50 }: UseTwitchChatOptions) {
    const [calls, setCalls] = useState<TwitchCall[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Normalizar canais para array
    const channelList = Array.isArray(channels) ? channels : [channels];

    const connect = useCallback(() => {
        if (!enabled || channelList.length === 0) return;

        try {
            // Conectar ao IRC da Twitch via WebSocket
            const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[Twitch IRC] Conectado');
                // Autenticação anônima (apenas leitura)
                ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
                ws.send('PASS SCHMOOPIIE');
                ws.send('NICK justinfan' + Math.floor(Math.random() * 100000));

                // Entrar em todos os canais
                for (const channel of channelList) {
                    ws.send(`JOIN #${channel.toLowerCase()}`);
                    console.log(`[Twitch IRC] Entrando em #${channel}`);
                }

                setIsConnected(true);
                setError(null);
            };

            ws.onmessage = (event) => {
                const message = event.data;

                // Responder ao PING para manter conexão
                if (message.startsWith('PING')) {
                    ws.send('PONG :tmi.twitch.tv');
                    return;
                }

                // Parsear mensagem PRIVMSG (mensagens do chat)
                if (message.includes('PRIVMSG')) {
                    const parsed = parseMessage(message);

                    if (parsed) {

                        // Verificar se é um comando !call
                        const callMatch = parsed.message.match(/^!call\s+(.+)/i);
                        if (callMatch) {
                            const slotName = callMatch[1].trim();
                            const newCall: TwitchCall = {
                                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                                username: parsed.username,
                                displayName: parsed.displayName || parsed.username,
                                slotName,
                                timestamp: new Date(),
                                color: parsed.color
                            };

                            setCalls(prev => {
                                const updated = [newCall, ...prev].slice(0, maxCalls);
                                return updated;
                            });

                            console.log(`[Twitch Call] ${parsed.displayName}: ${slotName}`);
                        }
                    }
                }
            };

            ws.onerror = (e) => {
                console.error('[Twitch IRC] Erro:', e);
                setError('Erro de conexão com o chat');
                setIsConnected(false);
            };

            ws.onclose = () => {
                console.log('[Twitch IRC] Desconectado');
                setIsConnected(false);

                // Reconectar após 5 segundos
                if (enabled) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log('[Twitch IRC] Tentando reconectar...');
                        connect();
                    }, 5000);
                }
            };

        } catch (err) {
            console.error('[Twitch IRC] Erro ao conectar:', err);
            setError('Falha ao conectar');
            setIsConnected(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, maxCalls]); // Removido channelList para evitar reconexões

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
    }, []);

    const clearCalls = useCallback(() => {
        setCalls([]);
    }, []);

    useEffect(() => {
        let mounted = true;

        // Delay pequeno para evitar dupla conexão do Strict Mode
        const timer = setTimeout(() => {
            if (mounted && enabled) {
                connect();
            }
        }, 100);

        return () => {
            mounted = false;
            clearTimeout(timer);
            disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    return {
        calls,
        isConnected,
        error,
        clearCalls,
        reconnect: connect
    };
}

// Parser de mensagens IRC da Twitch
function parseMessage(raw: string): {
    username: string;
    displayName: string;
    message: string;
    command: boolean;
    color?: string;
} | null {
    try {
        // Formato: @tags :user!user@user.tmi.twitch.tv PRIVMSG #channel :message

        // Limpar \r\n do final da mensagem
        const cleanRaw = raw.replace(/\r?\n/g, '');

        // Extrair tags (tudo entre @ e o primeiro espaço seguido de :)
        const tagMatch = cleanRaw.match(/^@([^ ]+) /);

        // Extrair username - formato: :username!username@username.tmi.twitch.tv
        const userMatch = cleanRaw.match(/:([a-zA-Z0-9_]+)![a-zA-Z0-9_]+@[a-zA-Z0-9_]+\.tmi\.twitch\.tv/);

        // Extrair mensagem - tudo depois de "PRIVMSG #channel :"
        const messageMatch = cleanRaw.match(/PRIVMSG #[a-zA-Z0-9_]+ :(.*)/);

        if (!userMatch || !messageMatch) {
            return null;
        }

        // Parsear tags
        let displayName = userMatch[1];
        let color: string | undefined;

        if (tagMatch) {
            const tags = tagMatch[1].split(';');
            for (const tag of tags) {
                const [key, value] = tag.split('=');
                if (key === 'display-name' && value) {
                    displayName = value;
                }
                if (key === 'color' && value) {
                    color = value;
                }
            }
        }

        return {
            username: userMatch[1],
            displayName,
            message: messageMatch[1].trim(),
            command: messageMatch[1].startsWith('!'),
            color
        };
    } catch (e) {
        console.error('[Parser Error]', e);
        return null;
    }
}
