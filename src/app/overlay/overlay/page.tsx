'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import {
    AnimatedCounter,
    FloatingLike,
    ProgressBar,
    ViewersBadge,
    SubscribeButton,
    LikeIcon,
    InstagramPanel,
    useOverlayStats,
    OVERLAY_STYLES,
    ANIMATION_DURATIONS,
    ViewMode
} from '@/features/overlay';

function OverlayContent() {
    const searchParams = useSearchParams();
    const videoId = searchParams.get('v') || '';
    const instagramHandle = searchParams.get('ig') || '@leoveio';
    const initialGoal = parseInt(searchParams.get('meta') || '5000');
    const isTestMode = searchParams.get('test') === '1';

    const {
        likes,
        viewers,
        goal,
        progress,
        particles,
        iconControls,
        simulateLike,
        removeParticle,
        formatNum
    } = useOverlayStats({ videoId, initialGoal, isTestMode });

    const [view, setView] = useState<ViewMode>('like');

    // Cycle views
    useEffect(() => {
        const interval = setInterval(() => {
            setView(current => {
                if (current === 'like') return 'meta';
                if (current === 'meta') return 'instagram';
                return 'like';
            });
        }, ANIMATION_DURATIONS.viewCycle);
        return () => clearInterval(interval);
    }, []);

    if (!videoId && !isTestMode) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                color: 'white',
                fontFamily: 'system-ui, sans-serif'
            }}>
                <p>Acesse /overlay para configurar</p>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            padding: 16,
            fontFamily: 'system-ui, sans-serif'
        }}>
            <style>{OVERLAY_STYLES}</style>

            <div style={{
                width: 380,
                height: 80,
                borderRadius: 8,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                marginTop: 20
            }}>
                {/* Viewers Badge */}
                {viewers !== null && (
                    <ViewersBadge viewers={viewers} formatNum={formatNum} />
                )}

                {/* Floating Particles */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 30 }}>
                    {particles.map(id => (
                        <FloatingLike key={id} onComplete={() => removeParticle(id)} />
                    ))}
                </div>

                {/* Background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#1f1f1f',
                    zIndex: 0,
                    borderRadius: 8,
                    overflow: 'hidden'
                }} />

                {/* Progress Bar */}
                <ProgressBar progress={progress} />

                {/* Instagram Panel */}
                <InstagramPanel isVisible={view === 'instagram'} handle={instagramHandle} />

                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '0 12px',
                    gap: 20
                }}>
                    {/* Like Icon */}
                    <LikeIcon iconControls={iconControls} />

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            color: 'white',
                            fontFamily: "'Teko', sans-serif",
                            fontWeight: 500,
                            fontSize: 18,
                            lineHeight: 1,
                            height: 20,
                            position: 'relative',
                            overflow: 'hidden',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={view}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {view === 'like' ? (
                                        <>DEIXA O <span style={{ color: '#22c55e' }}>LIKE</span>!</>
                                    ) : (
                                        <>META = <span style={{ color: '#22c55e' }}>{formatNum(goal)}</span> LIKES</>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div style={{
                            color: 'white',
                            fontFamily: "'Teko', sans-serif",
                            fontWeight: 600,
                            fontSize: 32,
                            lineHeight: 1,
                            whiteSpace: 'nowrap'
                        }}>
                            <AnimatedCounter value={likes} />
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}> / </span>
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{formatNum(goal)}</span>
                        </div>
                    </div>

                    {/* Subscribe Button */}
                    <SubscribeButton />
                </div>
            </div>

            {/* Test Mode Button */}
            {isTestMode && (
                <motion.button
                    onClick={simulateLike}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        position: 'fixed',
                        top: 100,
                        right: 40,
                        zIndex: 9999,
                        padding: '16px 32px',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        border: '3px solid white',
                        borderRadius: 16,
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 8px 30px rgba(34, 197, 94, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}
                >
                    👍 SIMULAR +LIKE
                </motion.button>
            )}
        </div>
    );
}

export default function OverlayPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: 'transparent' }} />}>
            <OverlayContent />
        </Suspense>
    );
}
