// YouTube Chat Server para Railway
// Mantém conexão persistente com YouTube Live Chat

const express = require('express');
const cors = require('cors');
const { LiveChat } = require('youtube-chat');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS para permitir requests do leoveio.com
app.use(cors({
    origin: ['https://leoveio.com', 'http://localhost:3000', 'https://www.leoveio.com'],
    methods: ['GET', 'POST', 'DELETE']
}));

app.use(express.json());

// ==================== CONFIGURAÇÃO ====================

// Canais a monitorar
const YOUTUBE_CHANNELS = [
    { id: 'UC1Xdu6upiWUyXvCG6GYdvnw', name: 'leoveio' },
    { handle: 'FlorianiTV', name: 'FlorianiTV' }
];

// ==================== CACHE ====================

let callsCache = [];
const userStatsCache = new Map();
const liveChats = new Map();
const channelStatus = new Map();

// ==================== FUNÇÕES ====================

function messageToString(message) {
    if (!message) return '';
    return message.map(item => item.text || '').join('');
}

function handleChatMessage(chatItem) {
    const message = messageToString(chatItem.message);
    const now = Date.now();
    const userKey = (chatItem.author.channelId || 'unknown').toLowerCase();

    // Atualizar estatísticas
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

    // Verificar comando !call
    const callMatch = message?.match(/^!call\s+(.+)/i);
    if (callMatch) {
        const slotName = callMatch[1].trim();
        const newCall = {
            id: chatItem.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            username: chatItem.author.channelId || 'unknown',
            displayName: chatItem.author.name || 'Anônimo',
            slotName,
            timestamp: chatItem.timestamp || new Date(),
            avatarUrl: chatItem.author.thumbnail?.url,
            source: 'youtube'
        };

        // Evitar duplicatas
        const isDuplicate = callsCache.some(c =>
            c.username === newCall.username &&
            c.slotName === newCall.slotName &&
            (new Date(newCall.timestamp).getTime() - new Date(c.timestamp).getTime()) < 5000
        );

        if (!isDuplicate) {
            callsCache = [...callsCache, newCall].slice(-50);
            console.log(`[Call] ${newCall.displayName}: ${slotName}`);
        }
    }
}

async function startChannelListener(channel) {
    const key = channel.id || channel.handle;

    if (liveChats.has(key)) {
        const status = channelStatus.get(key);
        if (status?.isListening) return;
    }

    try {
        console.log(`[YouTube] Iniciando listener: ${channel.name}`);

        const liveChat = channel.id
            ? new LiveChat({ channelId: channel.id })
            : new LiveChat({ handle: channel.handle });

        liveChats.set(key, liveChat);

        liveChat.on('start', (liveId) => {
            console.log(`[YouTube] Conectado: ${channel.name} (${liveId})`);
            channelStatus.set(key, { isListening: true, error: null, liveId });
        });

        liveChat.on('chat', handleChatMessage);

        liveChat.on('error', (err) => {
            const errorMessage = err instanceof Error ? err.message : 'Erro';
            console.error(`[YouTube] Erro ${channel.name}:`, errorMessage);
            channelStatus.set(key, { isListening: false, error: errorMessage });
        });

        liveChat.on('end', (reason) => {
            console.log(`[YouTube] Stream encerrada ${channel.name}:`, reason || '');
            channelStatus.set(key, { isListening: false, error: null });
            liveChats.delete(key);
        });

        const success = await liveChat.start();
        if (!success) {
            channelStatus.set(key, { isListening: false, error: 'Canal não está ao vivo' });
        }
    } catch (err) {
        console.error(`[YouTube] Falha ao iniciar ${channel.name}:`, err.message);
        channelStatus.set(key, { isListening: false, error: err.message });
    }
}

async function startAllListeners() {
    for (const channel of YOUTUBE_CHANNELS) {
        await startChannelListener(channel);
    }
}

async function stopAllListeners() {
    for (const [key, liveChat] of liveChats) {
        try {
            liveChat.stop();
        } catch (e) { }
    }
    liveChats.clear();
    channelStatus.clear();
}

// ==================== ENDPOINTS ====================

// Health check
app.get('/', (req, res) => {
    const channels = [];
    for (const ch of YOUTUBE_CHANNELS) {
        const key = ch.id || ch.handle;
        const status = channelStatus.get(key) || { isListening: false };
        channels.push({ name: ch.name, ...status });
    }
    res.json({
        status: 'ok',
        channels,
        callsCount: callsCache.length,
        usersTracked: userStatsCache.size
    });
});

// Buscar calls e stats
app.get('/calls', (req, res) => {
    const isAnyConnected = Array.from(channelStatus.values()).some(s => s.isListening);

    res.json({
        calls: callsCache,
        userStats: Object.fromEntries(userStatsCache),
        isConnected: isAnyConnected,
        error: null
    });
});

// Limpar cache
app.delete('/calls', (req, res) => {
    callsCache = [];
    userStatsCache.clear();
    res.json({ success: true, message: 'Cache limpo' });
});

// Reconectar
app.post('/reconnect', async (req, res) => {
    await stopAllListeners();
    await startAllListeners();
    res.json({ success: true, message: 'Reconectando...' });
});

// ==================== INICIAR ====================

app.listen(PORT, async () => {
    console.log(`[Server] Rodando na porta ${PORT}`);
    await startAllListeners();
});
