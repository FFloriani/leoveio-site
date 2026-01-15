// API Route para extrair URL de vídeo usando Cobalt API v10+
// Docs: https://github.com/imputnet/cobalt/blob/main/docs/api.md
import { NextRequest, NextResponse } from 'next/server';

interface CobaltPickerItem {
    type: 'photo' | 'video' | 'gif';
    url: string;
    thumb?: string;
}

interface CobaltResponse {
    status: 'tunnel' | 'redirect' | 'picker' | 'local-processing' | 'error';
    url?: string;
    filename?: string;
    picker?: CobaltPickerItem[];
    audio?: string;
    error?: { code: string; context?: { service?: string } };
}

interface ExtractResult {
    success: boolean;
    videoUrl?: string;
    filename?: string;
    error?: string;
}

// Lista de instâncias públicas do Cobalt v10+ (de instances.cobalt.best)
// NOTA: Instâncias públicas podem requerer autenticação (Turnstile/API Key)
const COBALT_INSTANCES = [
    'https://cobalt-api.meowing.de',          // 96% uptime
    'https://cobalt-backend.canine.tools',    // 88% uptime
    'https://kityune.imput.net',              // 80% uptime
    'https://blossom.imput.net',              // 80% uptime
    'https://capi.3kh0.net',                  // 72% uptime
];

async function callCobaltAPI(videoUrl: string): Promise<ExtractResult> {
    for (const instance of COBALT_INSTANCES) {
        try {
            // Cobalt v10+ usa POST na raiz (/)
            // Headers obrigatórios: Accept e Content-Type
            const response = await fetch(instance, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: videoUrl,
                    // Opções conforme docs/api.md
                    videoQuality: '720',
                    filenameStyle: 'basic',
                    downloadMode: 'auto',
                    audioFormat: 'mp3',
                    disableMetadata: false,
                    // Opções específicas de serviço
                    youtubeVideoCodec: 'h264',
                    tiktokFullAudio: false,
                    allowH265: false,
                    convertGif: true,
                }),
            });

            // Log detalhado para debug
            console.log(`[Cobalt] ${instance} -> Status HTTP: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                console.log(`[Cobalt] Erro: ${errorText.substring(0, 200)}`);
                continue;
            }

            const data: CobaltResponse = await response.json();
            console.log(`[Cobalt] Resposta:`, JSON.stringify(data).substring(0, 200));

            // Status 'tunnel' ou 'redirect' = URL direta disponível
            if ((data.status === 'tunnel' || data.status === 'redirect') && data.url) {
                return {
                    success: true,
                    videoUrl: data.url,
                    filename: data.filename,
                };
            }

            // Picker = múltiplas opções (ex: carrossel Instagram, vários vídeos)
            if (data.status === 'picker' && data.picker && data.picker.length > 0) {
                // Priorizar vídeos, depois fotos
                const video = data.picker.find(p => p.type === 'video');
                const item = video || data.picker[0];
                return {
                    success: true,
                    videoUrl: item.url,
                    filename: data.filename,
                };
            }

            // Local-processing = precisa processar localmente (não suportado)
            if (data.status === 'local-processing') {
                console.log(`[Cobalt] local-processing não suportado`);
                return {
                    success: false,
                    error: 'Processamento local não suportado',
                };
            }

            // Erro explícito
            if (data.status === 'error') {
                const errorCode = data.error?.code || 'unknown';
                console.log(`[Cobalt] Erro: ${errorCode}`);

                // Se precisa autenticação, tentar próxima instância
                if (errorCode.includes('auth')) {
                    continue;
                }

                return {
                    success: false,
                    error: errorCode,
                };
            }

        } catch (error) {
            console.error(`[Cobalt] Erro com ${instance}:`, error instanceof Error ? error.message : error);
            continue;
        }
    }

    return {
        success: false,
        error: 'Todas as instâncias falharam. As APIs públicas podem exigir autenticação.',
    };
}

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { success: false, error: 'URL é obrigatória' },
                { status: 400 }
            );
        }

        console.log('[Video Extract] Extraindo:', url);
        const result = await callCobaltAPI(url);

        if (result.success) {
            console.log('[Video Extract] Sucesso:', result.videoUrl?.substring(0, 80));
        } else {
            console.log('[Video Extract] Falha:', result.error);
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('[Video Extract] Erro:', error);
        return NextResponse.json(
            { success: false, error: 'Erro interno ao extrair vídeo' },
            { status: 500 }
        );
    }
}

// GET para testar a API
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({
            info: 'API de extração de vídeo via Cobalt v10',
            usage: 'POST com { url: "https://..." }',
            docs: 'https://github.com/imputnet/cobalt/blob/main/docs/api.md',
            supported: ['YouTube', 'Instagram', 'TikTok', 'Twitter/X', 'Reddit', 'Pinterest'],
            note: 'Instâncias públicas podem exigir autenticação'
        });
    }

    const result = await callCobaltAPI(url);
    return NextResponse.json(result);
}
