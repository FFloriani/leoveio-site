import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TOKENS_COOKIE_NAME = 'youtube_tokens';
const MEMBERS_API_URL = 'https://www.googleapis.com/youtube/v3/members';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

interface StoredTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

interface YouTubeMember {
    snippet: {
        memberDetails: {
            channelId: string;
            displayName: string;
            profileImageUrl: string;
        };
        membershipsDetails: {
            memberSince: string;
            memberTotalDuration: string;
            highestAccessibleLevel: string;
            highestAccessibleLevelDisplayName: string;
        };
    };
}

interface MembersResponse {
    items: YouTubeMember[];
    nextPageToken?: string;
    pageInfo: {
        totalResults: number;
    };
}

async function getStoredTokens(): Promise<StoredTokens | null> {
    try {
        const cookieStore = await cookies();
        const tokensCookie = cookieStore.get(TOKENS_COOKIE_NAME);
        if (!tokensCookie) return null;
        return JSON.parse(tokensCookie.value);
    } catch {
        return null;
    }
}

async function saveTokens(tokens: StoredTokens): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(TOKENS_COOKIE_NAME, JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
    });
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
    const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) return null;

    try {
        const response = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) return null;

        const data = await response.json();

        // Atualizar tokens salvos
        const newTokens: StoredTokens = {
            access_token: data.access_token,
            refresh_token: refreshToken, // Manter o refresh_token original
            expires_at: Date.now() + (data.expires_in * 1000),
        };
        await saveTokens(newTokens);

        return data.access_token;
    } catch {
        return null;
    }
}

async function getValidAccessToken(): Promise<string | null> {
    const tokens = await getStoredTokens();
    if (!tokens) return null;

    // Se o token ainda é válido (com margem de 5 minutos)
    if (tokens.expires_at > Date.now() + 300000) {
        return tokens.access_token;
    }

    // Token expirado, renovar usando refresh_token
    if (tokens.refresh_token) {
        return await refreshAccessToken(tokens.refresh_token);
    }

    return null;
}

export async function GET(request: NextRequest) {
    const accessToken = await getValidAccessToken();

    if (!accessToken) {
        return NextResponse.json({
            error: 'Não autenticado',
            message: 'É necessário conectar sua conta do YouTube primeiro.',
            authUrl: '/api/auth/youtube',
            isAuthenticated: false,
        }, { status: 401 });
    }

    try {
        // Buscar membros do canal
        const url = new URL(MEMBERS_API_URL);
        url.searchParams.set('part', 'snippet');
        url.searchParams.set('maxResults', '10'); // Últimos 10 membros
        url.searchParams.set('mode', 'all_current'); // Todos os membros ativos

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erro ao buscar membros:', errorData);

            // Se for erro de autenticação, indicar que precisa reconectar
            if (response.status === 401 || response.status === 403) {
                return NextResponse.json({
                    error: 'Token inválido',
                    message: 'Sua sessão expirou. Por favor, reconecte sua conta.',
                    authUrl: '/api/auth/youtube',
                    isAuthenticated: false,
                }, { status: 401 });
            }

            return NextResponse.json({
                error: 'Erro ao buscar membros',
                details: errorData,
            }, { status: response.status });
        }

        const data: MembersResponse = await response.json();

        // Ordenar por data de início (mais recente primeiro)
        const sortedMembers = (data.items || []).sort((a, b) => {
            const dateA = new Date(a.snippet.membershipsDetails.memberSince).getTime();
            const dateB = new Date(b.snippet.membershipsDetails.memberSince).getTime();
            return dateB - dateA;
        });

        // Formatar resposta
        const members = sortedMembers.map(member => ({
            channelId: member.snippet.memberDetails.channelId,
            displayName: member.snippet.memberDetails.displayName,
            profileImageUrl: member.snippet.memberDetails.profileImageUrl,
            memberSince: member.snippet.membershipsDetails.memberSince,
            level: member.snippet.membershipsDetails.highestAccessibleLevelDisplayName,
            duration: member.snippet.membershipsDetails.memberTotalDuration,
        }));

        // O primeiro da lista é o membro mais recente
        const latestMember = members[0] || null;

        return NextResponse.json({
            isAuthenticated: true,
            totalMembers: data.pageInfo?.totalResults || members.length,
            latestMember,
            members,
        });

    } catch (error) {
        console.error('Erro ao processar membros:', error);
        return NextResponse.json({
            error: 'Erro interno',
            message: 'Ocorreu um erro ao processar a requisição.',
        }, { status: 500 });
    }
}
