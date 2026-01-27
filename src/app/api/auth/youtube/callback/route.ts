import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// URL para trocar código por token
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Arquivo para persistir tokens (em produção, use um banco de dados)
const TOKENS_FILE = join(process.cwd(), '.youtube-tokens.json');

interface TokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    scope: string;
}

interface StoredTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

function saveTokens(tokens: StoredTokens) {
    writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

export function getStoredTokens(): StoredTokens | null {
    if (!existsSync(TOKENS_FILE)) return null;
    try {
        return JSON.parse(readFileSync(TOKENS_FILE, 'utf-8'));
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Se houver erro, redirecionar com mensagem
    if (error) {
        return NextResponse.redirect(
            new URL(`/overlay?auth_error=${encodeURIComponent(error)}`, request.url)
        );
    }

    if (!code) {
        return NextResponse.json(
            { error: 'Código de autorização não encontrado' },
            { status: 400 }
        );
    }

    const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.YOUTUBE_OAUTH_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        return NextResponse.json(
            { error: 'OAuth não configurado' },
            { status: 500 }
        );
    }

    try {
        // Trocar código por tokens
        const response = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erro ao obter token:', errorData);
            return NextResponse.redirect(
                new URL('/overlay?auth_error=token_exchange_failed', request.url)
            );
        }

        const data: TokenResponse = await response.json();

        // Salvar tokens
        const tokens: StoredTokens = {
            access_token: data.access_token,
            refresh_token: data.refresh_token || '',
            expires_at: Date.now() + (data.expires_in * 1000),
        };

        saveTokens(tokens);

        console.log('✅ YouTube OAuth: Tokens salvos com sucesso!');

        // Redirecionar para página de sucesso
        return NextResponse.redirect(
            new URL('/overlay?auth_success=true', request.url)
        );

    } catch (error) {
        console.error('Erro no callback OAuth:', error);
        return NextResponse.redirect(
            new URL('/overlay?auth_error=unknown', request.url)
        );
    }
}
