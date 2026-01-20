import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
        return NextResponse.json({ error: 'videoId is required' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'YouTube API Key not configured' }, { status: 500 });
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,liveStreamingDetails&id=${videoId}&key=${apiKey}`;
        const response = await fetch(url, { cache: 'no-store' });
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        const stats = data.items[0].statistics || {};
        const liveStats = data.items[0].liveStreamingDetails || {};

        return NextResponse.json({
            videoId,
            likeCount: parseInt(stats.likeCount || '0'),
            viewCount: parseInt(stats.viewCount || '0'),
            commentCount: parseInt(stats.commentCount || '0'),
            concurrentViewers: liveStats.concurrentViewers ? parseInt(liveStats.concurrentViewers) : null
        });
    } catch (error) {
        console.error('[YouTube Stats] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
