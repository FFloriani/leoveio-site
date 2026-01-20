'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// Add global styles for pulse animation
const globalStyles = `
@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}
`;

// Animated Counter Component
function AnimatedCounter({ value }: { value: number }) {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.floor(current).toLocaleString('pt-BR'));
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    useEffect(() => {
        return display.on('change', (latest) => {
            if (ref.current) {
                ref.current.textContent = latest;
            }
        });
    }, [display]);

    return <span ref={ref}>{value.toLocaleString('pt-BR')}</span>;
}

// Floating Like Particle Component
function FloatingLike({ onComplete }: { onComplete: () => void }) {
    // Randomize starting position slightly
    const randomOffset = Math.random() * 30 - 15;

    return (
        <motion.svg
            viewBox="0 0 24 24"
            style={{
                position: 'absolute',
                left: 35 + randomOffset, // Align with main icon
                top: 25,
                width: 24,
                height: 24,
                fill: '#22c55e', // Green for new life
                zIndex: 20,
                pointerEvents: 'none'
            }}
            initial={{ opacity: 0, y: 0, scale: 0.5, rotate: 0 }}
            animate={{
                opacity: [0, 1, 0],
                y: -60,
                scale: 1.2,
                rotate: Math.random() * 30 - 15
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onAnimationComplete={onComplete}
        >
            <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z" />
        </motion.svg>
    );
}

function OverlayContent() {
    const searchParams = useSearchParams();
    const videoId = searchParams.get('v') || '';
    const initialGoal = parseInt(searchParams.get('meta') || '5000');

    const [likes, setLikes] = useState(0);
    const [viewers, setViewers] = useState<number | null>(null);
    const [goal, setGoal] = useState(initialGoal);
    const [view, setView] = useState<'like' | 'meta' | 'viewers'>('like');

    // Floating particles state
    const [particles, setParticles] = useState<number[]>([]);
    const prevLikes = useRef(likes);

    // Cycle views
    useEffect(() => {
        const interval = setInterval(() => {
            setView(current => current === 'like' ? 'meta' : 'like');
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    // Fetch stats
    useEffect(() => {
        if (!videoId) return;

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/youtube-stats?videoId=${videoId}`);
                if (!res.ok) throw new Error('Fetch status: ' + res.status);

                const data = await res.json();

                if (data.likeCount !== undefined) {
                    const newLikes = data.likeCount;

                    // Spawn particles if likes increased
                    if (newLikes > prevLikes.current) {
                        const diff = newLikes - prevLikes.current;
                        const count = Math.min(diff, 5); // Limit max particles per tick
                        const now = Date.now();
                        const newIds = Array.from({ length: count }).map((_, i) => now + i);
                        setParticles(prev => [...prev, ...newIds]);
                    }
                    prevLikes.current = newLikes;

                    if (newLikes >= goal) setGoal(g => g + initialGoal);
                    setLikes(newLikes);
                }

                if (data.concurrentViewers !== undefined) {
                    setViewers(data.concurrentViewers);
                }
            } catch (e) {
                // Silently ignore fetch errors to keep overlay running
                console.warn('Stats fetch failed, retrying in next cycle...');
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 8000);
        return () => clearInterval(interval);
    }, [videoId, goal, initialGoal]);

    const progress = Math.min((likes / goal) * 100, 100);
    const formatNum = (n: number) => n.toLocaleString('pt-BR');

    if (!videoId) {
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
                <p>Acesse /meta para configurar</p>
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
            <style>{globalStyles}</style>
            <div
                style={{
                    width: 380,
                    height: 80,
                    borderRadius: 8,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 20 // Space for badge
                }}
            >
                {/* Viewers Badge - Positioned on Top Right */}
                {viewers !== null && (
                    <div style={{
                        position: 'absolute',
                        top: -24,
                        right: 0,
                        background: '#dc2626',
                        padding: '4px 8px',
                        borderRadius: '4px 4px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'white',
                        boxShadow: '0 -2px 10px rgba(0,0,0,0.2)'
                    }}>
                        <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'white' }}>
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                        {formatNum(viewers)}
                    </div>
                )}


                {/* Floating Particles Container */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 30 }}>
                    {particles.map(id => (
                        <FloatingLike
                            key={id}
                            onComplete={() => setParticles(prev => prev.filter(p => p !== id))}
                        />
                    ))}
                </div>

                {/* Background - Dark */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#1f1f1f',
                    zIndex: 0,
                    borderRadius: 8,
                    overflow: 'hidden'
                }} />

                {/* Red Progress Fill */}
                <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        background: '#dc2626',
                        zIndex: 1,
                        borderRadius: '8px 0 0 8px'
                    }}
                />

                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '0 12px',
                    gap: 12
                }}>

                    {/* Animated Thumbs Up */}
                    <motion.svg
                        viewBox="0 0 24 24"
                        style={{
                            width: 40,
                            height: 40,
                            fill: 'white',
                            flexShrink: 0
                        }}
                        animate={{
                            rotate: [0, -8, 8, -4, 4, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatDelay: 2
                        }}
                    >
                        <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z" />
                    </motion.svg>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: 14,
                            lineHeight: 1.2,
                            height: 18,
                            position: 'relative',
                            overflow: 'hidden'
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
                            fontWeight: 900,
                            fontSize: 22,
                            lineHeight: 1.1,
                            whiteSpace: 'nowrap'
                        }}>
                            <AnimatedCounter value={likes} />
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}> / </span>
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{formatNum(goal)}</span>
                        </div>
                    </div>

                    {/* Subscribe Button */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        background: 'rgba(0,0,0,0.55)',
                        padding: '5px 8px',
                        borderRadius: 3,
                        flexShrink: 0
                    }}>
                        <div style={{
                            width: 18,
                            height: 12,
                            background: '#ff0000',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg viewBox="0 0 24 24" style={{ width: 7, height: 7, fill: 'white' }}>
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <span style={{ color: 'white', fontSize: 10, fontWeight: 600 }}>
                            Inscreva-se
                        </span>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default function MetaOverlayPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: 'transparent' }} />}>
            <OverlayContent />
        </Suspense>
    );
}
