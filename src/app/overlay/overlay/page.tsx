'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useSpring, useTransform, useAnimation } from 'framer-motion';

// Add global styles for pulse animation and Teko font
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;500;600;700&display=swap');

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
    const instagramHandle = searchParams.get('ig') || '@leoveio';
    const initialGoal = parseInt(searchParams.get('meta') || '5000');
    const isTestMode = searchParams.get('test') === '1';

    const [likes, setLikes] = useState(isTestMode ? 2500 : 0);
    const [viewers, setViewers] = useState<number | null>(isTestMode ? 1234 : null);
    const [goal, setGoal] = useState(initialGoal);

    // Test function to simulate likes
    const simulateLike = () => {
        const increment = Math.floor(Math.random() * 50) + 10; // Add 10-60 likes
        setLikes(prev => {
            const newLikes = prev + increment;
            if (newLikes >= goal) setGoal(g => g + initialGoal);
            return newLikes;
        });
    };
    const [view, setView] = useState<'like' | 'meta' | 'instagram'>('like');

    // Floating particles state
    const [particles, setParticles] = useState<number[]>([]);
    const prevLikes = useRef(likes);

    // Icon animation controls
    const iconControls = useAnimation();

    // Cycle views
    useEffect(() => {
        const interval = setInterval(() => {
            setView(current => {
                if (current === 'like') return 'meta';
                if (current === 'meta') return 'instagram';
                return 'like';
            });
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    // Trigger animations when likes increase (works for test mode too)
    useEffect(() => {
        if (likes > prevLikes.current) {
            const diff = likes - prevLikes.current;
            const count = Math.min(diff, 5);
            const now = Date.now();
            const newIds = Array.from({ length: count }).map((_, i) => now + i);
            setParticles(prev => [...prev, ...newIds]);

            iconControls.start({
                scale: [1, 1.4, 1],
                fill: ['#ffffff', '#22c55e', '#ffffff'],
                transition: { duration: 0.5, times: [0, 0.4, 1] }
            });
        }
        prevLikes.current = likes;
    }, [likes, iconControls]);

    // Fetch stats (skip in test mode)
    useEffect(() => {
        if (!videoId || isTestMode) return;

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/youtube-stats?videoId=${videoId}`);
                if (!res.ok) throw new Error('Fetch status: ' + res.status);
                const data = await res.json();

                if (data.likeCount !== undefined) {
                    const newLikes = data.likeCount;
                    if (newLikes >= goal) setGoal(g => g + initialGoal);
                    setLikes(newLikes);
                }

                if (data.concurrentViewers !== undefined) {
                    setViewers(data.concurrentViewers);
                }
            } catch (e) {
                console.warn('Stats fetch failed, retrying in next cycle...');
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 8000);
        return () => clearInterval(interval);
    }, [videoId, goal, initialGoal, isTestMode]);

    const progress = Math.min((likes / goal) * 100, 100);
    const formatNum = (n: number) => n.toLocaleString('pt-BR');

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
                        top: -30,
                        right: 0,
                        background: '#dc2626',
                        padding: '0px 12px',
                        borderRadius: '6px 6px 0 0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Teko', sans-serif",
                        fontSize: 26,
                        fontWeight: 500,
                        color: 'white',
                        boxShadow: '0 -2px 10px rgba(0,0,0,0.3)',
                        minWidth: 'fit-content'
                    }}>
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
                {/* Progress Fill with Gradient Wave logic */}
                <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                        width: `${progress}%`
                    }}
                    transition={{
                        width: { duration: 0.6, ease: 'easeOut' }
                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        zIndex: 1,
                        borderRadius: '8px 0 0 8px',
                        background: '#dc2626'
                    }}
                />

                {/* Instagram Expanding Panel - Lower Third Style */}
                <AnimatePresence mode="wait">
                    {view === 'instagram' && (
                        <motion.div
                            key="instagram-panel"
                            initial={{
                                clipPath: 'inset(0 0 0 100%)',
                                opacity: 1
                            }}
                            animate={{
                                clipPath: 'inset(0 0 0 0)',
                                opacity: 1
                            }}
                            exit={{
                                clipPath: 'inset(0 0 0 100%)',
                                opacity: 1
                            }}
                            style={{
                                position: 'absolute',
                                right: 'calc(100% - 6px)',
                                top: 0,
                                bottom: 0,
                                background: 'linear-gradient(90deg, #833AB4 0%, #C13584 30%, #E1306C 60%, #dc2626 100%)',
                                zIndex: 10,
                                borderRadius: '50px 0 0 50px',
                                display: 'flex',
                                alignItems: 'center',
                                whiteSpace: 'nowrap',
                                paddingLeft: 8,
                                overflow: 'hidden'
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.65, 0, 0.35, 1] // Smooth ease-in-out
                            }}
                        >
                            {/* Large Instagram Icon - Half visible */}
                            <motion.svg
                                viewBox="0 0 24 24"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.4,
                                    ease: [0.34, 1.56, 0.64, 1]
                                }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    fill: 'rgba(255,255,255,0.25)',
                                    flexShrink: 0,
                                    marginLeft: -50,
                                    marginRight: -10
                                }}
                            >
                                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                            </motion.svg>

                            {/* Handle text */}
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{
                                    delay: 0.4,
                                    duration: 0.35,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                style={{
                                    color: 'white',
                                    fontFamily: "'Teko', sans-serif",
                                    fontSize: 28,
                                    fontWeight: 500,
                                    letterSpacing: '0.5px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    paddingRight: 20,
                                    paddingLeft: 5
                                }}
                            >
                                {instagramHandle}
                            </motion.span>
                        </motion.div>
                    )}
                </AnimatePresence>

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

                    {/* Animated Thumbs Up with continuous pulse */}
                    {/* Icon Swap: Thumbs Up <-> Instagram */}
                    {/* Standard Icon - Always rendered, will be covered by Insta Panel */}
                    <motion.svg
                        viewBox="0 0 24 24"
                        style={{
                            width: 40,
                            height: 40,
                            fill: 'white',
                            flexShrink: 0
                        }}
                        animate={{
                            scale: [1, 1.15, 1],
                            rotate: [0, -8, 8, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <motion.path
                            d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"
                            animate={iconControls}
                            initial={{ fill: '#ffffff' }}
                        />
                    </motion.svg>

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

            {/* Test Mode Floating Button */}
            {
                isTestMode && (
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
                )
            }
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
