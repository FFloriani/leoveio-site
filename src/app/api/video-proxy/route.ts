import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    try {
        // Fetch video with streaming
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://twitter.com/',
                'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
            },
        });

        if (!response.ok) {
            console.error('[Video Proxy] Fetch failed:', response.status, response.statusText);
            return NextResponse.json(
                { error: 'Failed to fetch video' },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('content-type') || 'video/mp4';
        const contentLength = response.headers.get('content-length');

        // Stream the response
        const headers = new Headers({
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600',
            'Access-Control-Allow-Origin': '*',
        });

        if (contentLength) {
            headers.set('Content-Length', contentLength);
        }

        return new NextResponse(response.body, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('[Video Proxy] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
