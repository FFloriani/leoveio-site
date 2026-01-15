// API Route para buscar foto de perfil da Twitch - com retry e timeout
import { NextRequest, NextResponse } from 'next/server';

// Cache de tokens e fotos
let cachedToken: { token: string; expiresAt: number } | null = null;
const profileCache = new Map<string, { url: string | null; expiresAt: number }>();

// Fetch com timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 15000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

async function getAppToken(): Promise<string> {
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.token;
    }

    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Twitch credentials not configured');
    }

    // Retry até 3 vezes
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await fetchWithTimeout('https://id.twitch.tv/oauth2/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'client_credentials'
                })
            }, 20000);

            if (!response.ok) {
                throw new Error('Token request failed');
            }

            const data = await response.json();
            cachedToken = {
                token: data.access_token,
                expiresAt: Date.now() + (data.expires_in * 1000) - 60000
            };
            return cachedToken.token;
        } catch (error) {
            console.log(`[Twitch] Token attempt ${attempt}/3 failed`);
            if (attempt === 3) throw error;
            await new Promise(r => setTimeout(r, 1000)); // Espera 1s
        }
    }
    throw new Error('Failed to get token after retries');
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username')?.toLowerCase();

    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    // Verificar cache (5 minutos para null, 1 hora para sucesso)
    const cached = profileCache.get(username);
    if (cached && Date.now() < cached.expiresAt) {
        return NextResponse.json({ profile_image_url: cached.url });
    }

    try {
        const token = await getAppToken();
        const clientId = process.env.TWITCH_CLIENT_ID!;

        // Retry até 2 vezes para buscar usuário
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const response = await fetchWithTimeout(
                    `https://api.twitch.tv/helix/users?login=${encodeURIComponent(username)}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Client-Id': clientId
                        }
                    },
                    20000
                );

                if (!response.ok) {
                    throw new Error('User fetch failed');
                }

                const data = await response.json();

                if (data.data && data.data.length > 0) {
                    const profileUrl = data.data[0].profile_image_url;
                    profileCache.set(username, { url: profileUrl, expiresAt: Date.now() + 3600000 });
                    return NextResponse.json({ profile_image_url: profileUrl });
                }

                profileCache.set(username, { url: null, expiresAt: Date.now() + 300000 });
                return NextResponse.json({ profile_image_url: null });
            } catch (error) {
                console.log(`[Twitch] User fetch attempt ${attempt}/2 failed for ${username}`);
                if (attempt === 2) throw error;
                await new Promise(r => setTimeout(r, 500));
            }
        }
    } catch (error) {
        console.error('[Twitch] Error:', error);
        // Cache erro por 1 minuto para evitar spam
        profileCache.set(username, { url: null, expiresAt: Date.now() + 60000 });
        return NextResponse.json({ profile_image_url: null });
    }

    return NextResponse.json({ profile_image_url: null });
}
