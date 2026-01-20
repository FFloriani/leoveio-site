'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnimation } from 'framer-motion';
import { OverlayStats } from '../types/overlay.types';
import { ANIMATION_DURATIONS } from '../constants/styles';

interface UseOverlayStatsOptions {
    videoId: string;
    initialGoal: number;
    isTestMode: boolean;
}

interface UseOverlayStatsReturn extends OverlayStats {
    particles: number[];
    iconControls: ReturnType<typeof useAnimation>;
    simulateLike: () => void;
    removeParticle: (id: number) => void;
    formatNum: (n: number) => string;
}

export function useOverlayStats({
    videoId,
    initialGoal,
    isTestMode
}: UseOverlayStatsOptions): UseOverlayStatsReturn {
    const [likes, setLikes] = useState(isTestMode ? 2500 : 0);
    const [viewers, setViewers] = useState<number | null>(isTestMode ? 1234 : null);
    const [goal, setGoal] = useState(initialGoal);
    const [particles, setParticles] = useState<number[]>([]);

    const prevLikes = useRef(likes);
    const iconControls = useAnimation();

    // Test function to simulate likes
    const simulateLike = useCallback(() => {
        const increment = Math.floor(Math.random() * 50) + 10;
        setLikes(prev => {
            const newLikes = prev + increment;
            if (newLikes >= goal) setGoal(g => g + initialGoal);
            return newLikes;
        });
    }, [goal, initialGoal]);

    const removeParticle = useCallback((id: number) => {
        setParticles(prev => prev.filter(p => p !== id));
    }, []);

    const formatNum = useCallback((n: number) => n.toLocaleString('pt-BR'), []);

    // Trigger animations when likes increase
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

    // Fetch stats from API
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
        const interval = setInterval(fetchStats, ANIMATION_DURATIONS.statsFetch);
        return () => clearInterval(interval);
    }, [videoId, goal, initialGoal, isTestMode]);

    const progress = Math.min((likes / goal) * 100, 100);

    return {
        likes,
        viewers,
        goal,
        progress,
        particles,
        iconControls,
        simulateLike,
        removeParticle,
        formatNum
    };
}
