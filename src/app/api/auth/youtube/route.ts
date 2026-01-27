import { NextRequest, NextResponse } from 'next/server';

// Configurações OAuth do YouTube
const YOUTUBE_AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';
const SCOPE = 'https://www.googleapis.com/auth/youtube.channel-memberships.creator';

export async function GET(request: NextRequest) {
    const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID;
    const redirectUri = process.env.YOUTUBE_OAUTH_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return NextResponse.json(
            { error: 'OAuth não configurado. Verifique as variáveis de ambiente.' },
            { status: 500 }
        );
    }

    // Criar URL de autorização do Google
    const authUrl = new URL(YOUTUBE_AUTH_URL);
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', SCOPE);
    authUrl.searchParams.set('access_type', 'offline'); // Para receber refresh_token
    authUrl.searchParams.set('prompt', 'consent'); // Força mostrar tela de permissão

    // Redirecionar para o Google
    return NextResponse.redirect(authUrl.toString());
}
