'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ConfigContent() {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [goal, setGoal] = useState('5000');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [copied, setCopied] = useState(false);

    // Extract video ID from YouTube URL
    const extractVideoId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\s?]+)/,
            /youtube\.com\/embed\/([^?&\s]+)/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    const handleGenerate = () => {
        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            alert('URL inválida! Cole o link da sua live do YouTube.');
            return;
        }

        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${baseUrl}/overlay/overlay?v=${videoId}&meta=${goal}`;
        setGeneratedUrl(url);
        setCopied(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a0a0a 0%, #0d0d0d 50%, #1a0808 100%)',
            color: 'white',
            fontFamily: 'system-ui, sans-serif',
            padding: 32
        }}>
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{
                        fontSize: 32,
                        fontWeight: 800,
                        background: 'linear-gradient(90deg, #DEB066, #E8C547)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 8
                    }}>
                        🎯 META DE LIKES
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Gere seu overlay para OBS
                    </p>
                </div>

                {/* Form */}
                <div style={{
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: 16,
                    padding: 24,
                    border: '1px solid rgba(222,176,102,0.2)'
                }}>
                    {/* YouTube URL */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{
                            display: 'block',
                            color: '#DEB066',
                            fontWeight: 700,
                            marginBottom: 8
                        }}>
                            🔗 Link da sua Live
                        </label>
                        <input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'rgba(0,0,0,0.6)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12,
                                color: 'white',
                                fontSize: 14,
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Goal */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{
                            display: 'block',
                            color: '#DEB066',
                            fontWeight: 700,
                            marginBottom: 8
                        }}>
                            🎯 Meta de Likes
                        </label>
                        <input
                            type="number"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="5000"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'rgba(0,0,0,0.6)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12,
                                color: 'white',
                                fontSize: 14,
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        style={{
                            width: '100%',
                            padding: '14px 24px',
                            background: 'linear-gradient(90deg, #9A1207, #DEB066)',
                            border: 'none',
                            borderRadius: 12,
                            color: 'white',
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        Gerar Link do Overlay
                    </button>
                </div>

                {/* Generated URL */}
                {generatedUrl && (
                    <div style={{
                        marginTop: 24,
                        background: 'rgba(34,197,94,0.1)',
                        border: '1px solid rgba(34,197,94,0.3)',
                        borderRadius: 16,
                        padding: 20
                    }}>
                        <p style={{ color: '#22c55e', fontWeight: 700, marginBottom: 12 }}>
                            ✅ Link gerado! Cole no OBS como Browser Source:
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                type="text"
                                value={generatedUrl}
                                readOnly
                                style={{
                                    flex: 1,
                                    padding: '10px 12px',
                                    background: 'rgba(0,0,0,0.6)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: 12
                                }}
                            />
                            <button
                                onClick={handleCopy}
                                style={{
                                    padding: '10px 16px',
                                    background: copied ? '#22c55e' : '#DEB066',
                                    border: 'none',
                                    borderRadius: 8,
                                    color: copied ? 'white' : 'black',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {copied ? '✓ Copiado!' : 'Copiar'}
                            </button>
                        </div>
                        <p style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: 12,
                            marginTop: 12
                        }}>
                            Tamanho recomendado: 500 x 100 pixels
                        </p>

                        {/* Preview Link */}
                        <a
                            href={generatedUrl}
                            target="_blank"
                            style={{
                                display: 'inline-block',
                                marginTop: 12,
                                padding: '8px 16px',
                                background: 'rgba(139,92,246,0.2)',
                                border: '1px solid rgba(139,92,246,0.4)',
                                borderRadius: 8,
                                color: '#a78bfa',
                                textDecoration: 'none',
                                fontSize: 13,
                                fontWeight: 600
                            }}
                        >
                            👁️ Ver Preview
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MetaConfigPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d0d0d' }} />}>
            <ConfigContent />
        </Suspense>
    );
}
