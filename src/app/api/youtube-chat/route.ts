// API Route para capturar chat do YouTube Live - Polling endpoint
import { NextRequest, NextResponse } from 'next/server';
import { LiveChat } from 'youtube-chat';

// Interface para calls do YouTube
interface YouTubeCall {
    id: string;
    username: string;
    displayName: string;
    slotName: string;
    timestamp: Date;
    avatarUrl?: string;
    source: 'youtube';
}

// Interface para estatísticas de usuário
interface YouTubeUserStats {
    username: string;
    displayName: string;
    messageCount: number;
    firstSeenAt: number;
    lastSeenAt: number;
    avatarUrl?: string;
}

// Cache de calls em memória (últimas 50)
let callsCache: YouTubeCall[] = [];
// Cache de estatísticas de usuários
const userStatsCache = new Map<string, YouTubeUserStats>();

// Múltiplos listeners de chat
const liveChats = new Map<string, InstanceType<typeof LiveChat>>();
const channelStatus = new Map<string, { isListening: boolean; error: string | null }>();

// Lista de canais a monitorar (do .env ou hardcoded)
const YOUTUBE_CHANNELS = [
    process.env.YOUTUBE_CHANNEL_ID || 'UCyftCA0NLN5q8Ora3S0k7dw', // LeoVeio
    'UC1Xdu6upiWUyXvCG6GYdvnw' // Segundo canal
].filter(Boolean) as string[];

// Converter MessageItem[] para string
function messageToString(message: { text?: string }[]): string {
    return message
        .map(item => ('text' in item ? item.text : ''))
        .join('');
}

// Handler de mensagens do chat (compartilhado entre canais)
function handleChatMessage(chatItem: any) {
    const message = messageToString(chatItem.message as { text?: string }[]);
    const now = Date.now();
    const userKey = (chatItem.author.channelId || 'unknown').toLowerCase();

    // Atualizar estatísticas do usuário (para TODAS as mensagens)
    const existingStats = userStatsCache.get(userKey);
    if (existingStats) {
        existingStats.messageCount++;
        existingStats.lastSeenAt = now;
        if (chatItem.author.name) existingStats.displayName = chatItem.author.name;
        if (chatItem.author.thumbnail?.url) existingStats.avatarUrl = chatItem.author.thumbnail.url;
    } else {
        userStatsCache.set(userKey, {
            username: chatItem.author.channelId || 'unknown',
            displayName: chatItem.author.name || 'Anônimo',
            messageCount: 1,
            firstSeenAt: now,
            lastSeenAt: now,
            avatarUrl: chatItem.author.thumbnail?.url
        });
    }

    // Verificar se é um comando !call
    const callMatch = message?.match(/^!call\s+(.+)/i);
    if (callMatch) {
        const slotName = callMatch[1].trim();
        const newCall: YouTubeCall = {
            id: chatItem.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            username: chatItem.author.channelId || 'unknown',
            displayName: chatItem.author.name || 'Anônimo',
            slotName,
            timestamp: chatItem.timestamp || new Date(),
            avatarUrl: chatItem.author.thumbnail?.url,
            source: 'youtube'
        };

        // Evitar duplicatas (mesmo usuário, mesmo slot, em 5 segundos)
        const isDuplicate = callsCache.some(c =>
            c.username === newCall.username &&
            c.slotName === newCall.slotName &&
            (new Date(newCall.timestamp).getTime() - new Date(c.timestamp).getTime()) < 5000
        );

        if (!isDuplicate) {
            callsCache = [...callsCache, newCall].slice(-50);
            console.log(`[YouTube Call] ${newCall.displayName}: ${slotName}`);
        }
    }
}

// Iniciar listener para um canal específico
async function startChannelListener(channelId: string) {
    // Verificar se já está conectado
    if (liveChats.has(channelId)) {
        const status = channelStatus.get(channelId);
        if (status?.isListening) return;
    }

    try {
        console.log('[YouTube Chat] Iniciando listener para canal:', channelId);

        // Criar instância do LiveChat
        const liveChat = new LiveChat({ channelId });
        liveChats.set(channelId, liveChat);

        liveChat.on('start', (liveId: string) => {
            console.log(`[YouTube Chat] Conectado ao live ${channelId}:`, liveId);
            channelStatus.set(channelId, { isListening: true, error: null });
        });

        liveChat.on('chat', handleChatMessage);

        liveChat.on('error', (err: Error | unknown) => {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            console.error(`[YouTube Chat] Erro no canal ${channelId}:`, errorMessage);
            channelStatus.set(channelId, { isListening: false, error: errorMessage });
        });

        liveChat.on('end', (reason?: string) => {
            console.log(`[YouTube Chat] Stream encerrada ${channelId}:`, reason || 'sem razão');
            channelStatus.set(channelId, { isListening: false, error: null });
            liveChats.delete(channelId);
        });

        // Iniciar listening
        const success = await liveChat.start();
        if (!success) {
            const error = 'Não foi possível encontrar live ativa';
            console.log(`[YouTube Chat] ${channelId}:`, error);
            channelStatus.set(channelId, { isListening: false, error });
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar';
        console.error(`[YouTube Chat] Erro ao iniciar ${channelId}:`, errorMessage);
        channelStatus.set(channelId, { isListening: false, error: errorMessage });
    }
}

// Iniciar listeners para todos os canais
async function startAllChatListeners() {
    for (const channelId of YOUTUBE_CHANNELS) {
        await startChannelListener(channelId);
    }
}

// GET: Retorna calls e status
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Ação: limpar cache (calls + estatísticas)
    if (action === 'clear') {
        callsCache = [];
        userStatsCache.clear();
        return NextResponse.json({ success: true, message: 'Cache e estatísticas limpos' });
    }

    // Ação: reconectar todos os canais
    if (action === 'reconnect') {
        // Parar todos os listeners ativos
        for (const [channelId, liveChat] of liveChats) {
            liveChat.stop();
        }
        liveChats.clear();
        channelStatus.clear();

        // Reiniciar todos os canais
        await startAllChatListeners();
        return NextResponse.json({ success: true, message: 'Reconectando todos os canais...' });
    }

    // Iniciar listeners se não estiverem rodando
    const anyListening = Array.from(channelStatus.values()).some(s => s.isListening);
    if (!anyListening && liveChats.size === 0) {
        startAllChatListeners();
    }

    // Calcular status geral
    const statuses = Array.from(channelStatus.entries()).map(([id, s]) => ({
        channelId: id,
        ...s
    }));
    const isConnected = statuses.some(s => s.isListening);
    const errors = statuses.filter(s => s.error).map(s => `${s.channelId}: ${s.error}`);

    // Retornar calls, status e estatísticas
    return NextResponse.json({
        calls: callsCache,
        userStats: Object.fromEntries(userStatsCache),
        isConnected,
        error: errors.length > 0 ? errors.join('; ') : null,
        channels: YOUTUBE_CHANNELS,
        channelStatuses: statuses
    });
}
