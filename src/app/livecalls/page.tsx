'use client';

import TwitchCallsPanel from '@/components/TwitchCallsPanel';
import Head from 'next/head';
import { useEffect } from 'react';

export default function LiveCallsPage() {
    // Adicionar manifest dinamicamente
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = '/manifest.json';
        document.head.appendChild(link);

        // Meta tags para PWA
        const themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        themeColor.content = '#1a0808';
        document.head.appendChild(themeColor);

        const appleCapable = document.createElement('meta');
        appleCapable.name = 'apple-mobile-web-app-capable';
        appleCapable.content = 'yes';
        document.head.appendChild(appleCapable);

        const appleStatus = document.createElement('meta');
        appleStatus.name = 'apple-mobile-web-app-status-bar-style';
        appleStatus.content = 'black-translucent';
        document.head.appendChild(appleStatus);
    }, []);

    return (
        <div className="w-full h-screen bg-[#1a0808] overflow-hidden">
            <TwitchCallsPanel
                channels={['leoveio', 'florianitv']}
                youtubeEnabled={true}
                enabled={true}
            />
        </div>
    );
}
