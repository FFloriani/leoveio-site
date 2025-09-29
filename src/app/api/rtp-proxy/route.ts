import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || 'pragmatic-play';

    // Mapeamento dos provedores
    const providerMapping: Record<string, string> = {
      'pragmatic-play': 'pragmatic-play',
      'microgaming': 'microgaming',
      'reel-kingdom': 'reel-kingdom',
      'pg-soft': 'pg-soft',
      'avantplay': 'advantplay',
      'fa-chai': 'fa-chai',
      'crowd-play': 'crowd-play',
      'jili': 'jili',
      'slot88': 'slot88',
      'ion-slot': 'ionslot',
      'joker-gaming': 'joker-gaming',
      'live22': 'live22',
      'playstar': 'playstar-slot-77',
      'spadegaming': 'spadegaming',
      'habanero': 'habanero',
      'jdb': 'jdb',
      'cq9-gaming': 'cq9-gaming',
      'ttg-slot': 'ttg-slot',
      'betsoft': 'betsoft',
      'playtech': 'playtech',
      'yggdrasil': 'yggdrasil',
      'playn-go': 'playn-go',
      'onetouch': 'onetouch',
      'rtg-slots': 'rtg-slot',
      'flow-gaming': 'flow-gaming',
      'astrotech': 'astrotech',
      'funky-games': 'funky-games',
    };

    const mappedProvider = providerMapping[provider] || provider;
    const targetUrl = `https://alibabaslots.org/rtp-live/${mappedProvider}/`;

    console.log('Fazendo proxy para:', targetUrl);

    // Fazer requisição para o site original
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let html = await response.text();

    // Modificar o HTML para remover políticas de iframe e ajustar links
    html = html
      // Remover X-Frame-Options e Content-Security-Policy
      .replace(/<meta[^>]*http-equiv="X-Frame-Options"[^>]*>/gi, '')
      .replace(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>/gi, '')
      // Remover apenas elementos específicos de header/navegação
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<div[^>]*class="[^"]*header[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*class="[^"]*navbar[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*class="[^"]*top[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*class="[^"]*menu[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*class="[^"]*navigation[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*class="[^"]*banner[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      // Remover elementos específicos do site alibabaslots.org
      .replace(/<div[^>]*id="jackpot"[^>]*class="[^"]*jackpot[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*id="banner"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*class="[^"]*sticky[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*id="board-section"[^>]*class="[^"]*board-section[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*class="[^"]*col-12[^"]*time[^"]*bb[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*class="[^"]*col-12[^"]*date[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
      // Ajustar links relativos para absolutos
      .replace(/src="\/([^"]*)"/g, `src="https://alibabaslots.org/$1"`)
      .replace(/href="\/([^"]*)"/g, `href="https://alibabaslots.org/$1"`)
      // Adicionar meta tag para permitir iframe e CSS básico
      .replace(
        '<head>',
        `<head>
          <meta http-equiv="X-Frame-Options" content="ALLOWALL">
          <meta http-equiv="Content-Security-Policy" content="frame-ancestors *;">
          <style>
            /* Esconder elementos específicos do site alibabaslots.org */
            #jackpot, #banner, .jackpot, .banner,
            .sticky, #board-section, .board-section,
            .col-12.time.bb, .col-12.date {
              display: none !important;
            }
            
            /* Ajustar margem do body */
            body {
              margin-top: -50px !important;
              padding-top: 20px !important;
              background: #1a1a1a !important;
              color: white !important;
              font-family: Arial, sans-serif !important;
            }
            
            /* Estilos para tabelas RTP */
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin: 20px 0 !important;
              background: #2a2a2a !important;
              color: white !important;
            }
            
            th, td {
              padding: 12px !important;
              text-align: left !important;
              border-bottom: 1px solid #444 !important;
              color: white !important;
            }
            
            th {
              background: #333 !important;
              font-weight: bold !important;
              color: #fff !important;
            }
            
            tr:hover {
              background: #333 !important;
            }
          </style>`
      );

    // Retornar o HTML modificado
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': 'frame-ancestors *;',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Erro no proxy:', error);
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Erro - RTP Live</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: #1a1a1a; 
            color: white; 
            text-align: center; 
            padding: 50px; 
          }
          .error { 
            background: #2a2a2a; 
            padding: 30px; 
            border-radius: 10px; 
            max-width: 500px; 
            margin: 0 auto; 
          }
        </style>
      </head>
      <body>
        <div class="error">
          <h2>🚫 Erro ao Carregar</h2>
          <p>Não foi possível carregar os dados RTP.</p>
          <p>Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
          <button onclick="window.parent.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            🔄 Tentar Novamente
          </button>
        </div>
      </body>
      </html>
      `,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    );
  }
}
