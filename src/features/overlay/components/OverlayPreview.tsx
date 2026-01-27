'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
    AnimatedCounter,
    FloatingLike,
    ProgressBar,
    ViewersBadge,
    SubscribeButton,
    LikeIcon,
    InstagramPanel,
    OVERLAY_STYLES,
    ANIMATION_DURATIONS,
    ViewMode
} from '@/features/overlay';
import { MembersPanel } from './MembersPanel';
import type { YouTubeMember } from '../hooks/useYouTubeMembers';

export interface TextTransition {
    id: ViewMode;
    label: string;
    text: string;
    highlightWord: string;
    highlightColor: string;
    enabled: boolean;
}

export interface OverlayVisualOptions {
    showSubscribeButton: boolean;
    showYouTubeIcon: boolean;
    fontSize: 'small' | 'medium' | 'large';
    transitionDelay: number; // segundos entre cada CTA (2-30)
    instagramDelay: number; // segundos para Instagram aparecer (1-120)
    instagramDuration: number; // segundos que o Instagram fica visível (1-120)
    viewersPosition: 'top' | 'inside'; // 'top' = badge em cima, 'inside' = dentro do painel
}

export const DEFAULT_VISUAL_OPTIONS: OverlayVisualOptions = {
    showSubscribeButton: true,
    showYouTubeIcon: true,
    fontSize: 'medium',
    transitionDelay: 5,
    instagramDelay: 30,
    instagramDuration: 10,
    viewersPosition: 'top'
};

interface OverlayPreviewProps {
    likes?: number;
    goal?: number;
    instagramHandle?: string;
    isDemo?: boolean;
    transitions?: TextTransition[];
    cycleDuration?: number;
    visualOptions?: OverlayVisualOptions;
}

const DEFAULT_TRANSITIONS: TextTransition[] = [
    { id: 'like', label: 'Call to Action', text: 'DEIXA O LIKE!', highlightWord: 'LIKE', highlightColor: '#22c55e', enabled: true },
    { id: 'meta', label: 'Meta', text: 'META = {META} LIKES', highlightWord: '{META}', highlightColor: '#22c55e', enabled: true },
    { id: 'instagram', label: 'Instagram', text: '', highlightWord: '', highlightColor: '#22c55e', enabled: true }
];

// Simple text parser - highlights specific word with color
function parseText(text: string, vars: Record<string, string>, highlightWord: string, highlightColor: string): React.ReactNode[] {
    if (!text) return [];

    // Replace variables first
    let processedText = text;
    Object.entries(vars).forEach(([key, value]) => {
        processedText = processedText.replace(new RegExp(`\\{${key}\\}`, 'gi'), value);
    });

    // If no highlight word, return plain text
    if (!highlightWord) {
        return [processedText];
    }

    // Replace the variable in highlight word too for matching
    let processedHighlight = highlightWord;
    Object.entries(vars).forEach(([key, value]) => {
        processedHighlight = processedHighlight.replace(new RegExp(`\\{${key}\\}`, 'gi'), value);
    });

    // Split by highlight word (case-insensitive)
    const regex = new RegExp(`(${processedHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = processedText.split(regex);

    return parts.map((part, i) => {
        if (part.toLowerCase() === processedHighlight.toLowerCase()) {
            return <span key={i} style={{ color: highlightColor }}>{part}</span>;
        }
        return part;
    });
}


export function OverlayPreview({
    likes: initialLikes = 2500,
    goal: initialGoal = 5000,
    instagramHandle = '@leoveio',
    isDemo = true,
    transitions = DEFAULT_TRANSITIONS,
    cycleDuration = ANIMATION_DURATIONS.viewCycle,
    visualOptions = DEFAULT_VISUAL_OPTIONS
}: OverlayPreviewProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [goal, setGoal] = useState(initialGoal);
    const [viewers] = useState(1234);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [particles, setParticles] = useState<number[]>([]);
    const [lastMilestone, setLastMilestone] = useState(0);
    const [showInstagramPanel, setShowInstagramPanel] = useState(false); // Controle independente do painel Instagram

    // Membros de demonstração
    const demoLatestMember: YouTubeMember = {
        channelId: 'demo123',
        displayName: 'João Gaming',
        profileImageUrl: 'https://i.pravatar.cc/100?img=12',
        memberSince: new Date().toISOString(),
        level: 'Membro',
        duration: '1 mês'
    };

    const demoPreviousMember: YouTubeMember = {
        channelId: 'demo456',
        displayName: 'Maria Plays',
        profileImageUrl: 'https://i.pravatar.cc/100?img=5',
        memberSince: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        level: 'Membro',
        duration: '2 meses'
    };

    const iconControls = useAnimation();

    // Font size mapping
    const fontSizeMap = { small: 0.8, medium: 1, large: 1.2 };
    const fontScale = fontSizeMap[visualOptions.fontSize];

    // Calcular progresso relativo ao milestone atual
    // Se likes < lastMilestone, usar 0 como base (sessão nova ou reset)
    const effectiveMilestone = likes < lastMilestone ? 0 : lastMilestone;
    const progressRange = goal - effectiveMilestone;
    const progressValue = likes - effectiveMilestone;
    const progress = progressRange > 0 ? Math.max(0, Math.min((progressValue / progressRange) * 100, 100)) : 0;

    const formatNum = (n: number) => n.toLocaleString('pt-BR');

    // Detectar quando a meta é batida e atualizar milestone
    useEffect(() => {
        // Resetar milestone se likes voltou ao início (nova sessão)
        if (likes < lastMilestone) {
            setLastMilestone(0);
        }
        // Meta batida! Atualiza o milestone para o goal atual
        else if (likes >= goal && goal > lastMilestone) {
            setLastMilestone(goal);
        }
    }, [likes, goal, lastMilestone]);

    // Get only enabled transitions
    const enabledTransitions = useMemo(() =>
        transitions.filter(t => t.enabled),
        [transitions]
    );

    // Current view based on enabled transitions
    const currentTransition = enabledTransitions[currentIndex % enabledTransitions.length] || DEFAULT_TRANSITIONS[0];
    const view = currentTransition.id;

    // Track previous goal to detect goal changes
    const [prevGoal, setPrevGoal] = useState(initialGoal);

    // Sync props and handle goal changes
    useEffect(() => {
        // Detectar se a meta AUMENTOU (usuário subiu a meta após bater)
        if (initialGoal > prevGoal && likes >= prevGoal) {
            // Meta batida anteriormente, agora subiu - o milestone é a meta antiga
            setLastMilestone(prevGoal);
        }
        // Se a meta diminuiu ou é uma sessão nova, resetar
        else if (initialGoal < prevGoal || likes < lastMilestone) {
            setLastMilestone(0);
        }

        setGoal(initialGoal);
        setPrevGoal(initialGoal);
    }, [initialGoal]);

    // Demo mode: simulate likes periodically
    useEffect(() => {
        if (!isDemo) return;

        const interval = setInterval(() => {
            const increment = Math.floor(Math.random() * 30) + 5;
            setLikes(prev => {
                const newLikes = prev + increment;
                const now = Date.now();
                const newIds = Array.from({ length: Math.min(increment / 10, 3) }).map((_, i) => now + i * 1000 + Math.floor(Math.random() * 1000));
                setParticles(p => [...p, ...newIds]);

                iconControls.start({
                    scale: [1, 1.4, 1],
                    fill: ['#ffffff', '#22c55e', '#ffffff'],
                    transition: { duration: 0.5, times: [0, 0.4, 1] }
                });

                // Quando bater a meta, atualizar milestone ANTES de aumentar o goal
                if (newLikes >= goal) {
                    setLastMilestone(goal); // Milestone = meta atual (ex: 2500)
                    setGoal(g => g + initialGoal); // Nova meta (ex: 2500 + 5000 = 7500)
                }
                return newLikes;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [isDemo, goal, initialGoal, iconControls]);

    // Cycle through enabled transitions using custom delay
    const transitionDelayMs = visualOptions.transitionDelay * 1000;
    useEffect(() => {
        if (enabledTransitions.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % enabledTransitions.length);
        }, transitionDelayMs);
        return () => clearInterval(interval);
    }, [enabledTransitions.length, transitionDelayMs]);

    // Reset index when transitions change
    useEffect(() => {
        setCurrentIndex(0);
    }, [transitions]);

    // Ciclo independente do painel Instagram
    // Delay = quanto tempo espera pra aparecer, Duration = quanto tempo fica visível
    const instagramDelayMs = visualOptions.instagramDelay * 1000;
    const instagramDurationMs = visualOptions.instagramDuration * 1000;

    useEffect(() => {
        // Verifica se a transição Instagram está habilitada
        const instagramEnabled = transitions.find(t => t.id === 'instagram')?.enabled ?? true;
        if (!instagramEnabled) {
            setShowInstagramPanel(false);
            return;
        }

        // Usar ref para rastrear o timeout atual e flag de montagem
        let timeoutId: NodeJS.Timeout | null = null;
        let isMounted = true;

        const runCycle = () => {
            if (!isMounted) return;

            // Fase 1: Esconde e espera o delay
            setShowInstagramPanel(false);

            timeoutId = setTimeout(() => {
                if (!isMounted) return;

                // Fase 2: Mostra
                setShowInstagramPanel(true);

                // Fase 3: Após duration, reinicia o ciclo
                timeoutId = setTimeout(() => {
                    if (!isMounted) return;
                    runCycle();
                }, instagramDurationMs);
            }, instagramDelayMs);
        };

        // Inicia o ciclo
        runCycle();

        // Cleanup: limpa qualquer timeout pendente e marca como desmontado
        return () => {
            isMounted = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [instagramDelayMs, instagramDurationMs, transitions]);

    const removeParticle = (id: number) => {
        setParticles(prev => prev.filter(p => p !== id));
    };

    // Variables for text parsing
    const textVars: Record<string, string> = {
        'LIKE': 'LIKE',
        'META': formatNum(goal),
        'LIKES': likes.toString(),
        'VIEWERS': viewers.toString(),
        'INSTAGRAM': instagramHandle
    };

    return (
        <div className="relative" style={{ fontFamily: 'system-ui, sans-serif' }}>
            <style>{OVERLAY_STYLES}</style>

            <div style={{
                width: 380,
                height: 80,
                borderRadius: 8,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                marginTop: 60
            }}>
                {/* Members Panel - Sempre visível */}
                {isDemo && (
                    <MembersPanel
                        latestMember={demoLatestMember}
                        previousMember={demoPreviousMember}
                    />
                )}

                {/* Viewers Badge (posição TOP) */}
                {visualOptions.viewersPosition === 'top' && (
                    <ViewersBadge viewers={viewers} formatNum={formatNum} position="top" />
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

                {/* Instagram Panel - Ciclo independente */}
                <InstagramPanel isVisible={showInstagramPanel} handle={instagramHandle} />

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
                                    key={currentTransition.id + currentIndex}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {currentTransition.text ? (
                                        parseText(currentTransition.text, textVars, currentTransition.highlightWord, currentTransition.highlightColor)
                                    ) : view === 'instagram' ? (
                                        <span style={{ opacity: 0.5 }}>@{instagramHandle.replace('@', '')}</span>
                                    ) : null}
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

                    {/* Viewers Badge (posição INSIDE) - substitui o botão Inscreva-se */}
                    {visualOptions.viewersPosition === 'inside' ? (
                        <ViewersBadge viewers={viewers} formatNum={formatNum} position="inside" />
                    ) : (
                        /* Subscribe Button - só aparece se viewers não está inside */
                        visualOptions.showSubscribeButton && (
                            <SubscribeButton showIcon={visualOptions.showYouTubeIcon} fontScale={fontScale} />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export { DEFAULT_TRANSITIONS };

