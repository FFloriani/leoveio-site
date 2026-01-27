'use client';

import { useState, useEffect, useCallback } from 'react';

export interface YouTubeMember {
    channelId: string;
    displayName: string;
    profileImageUrl: string;
    memberSince: string;
    level: string;
    duration: string;
}

export interface MembersData {
    isAuthenticated: boolean;
    totalMembers: number;
    latestMember: YouTubeMember | null;
    members: YouTubeMember[];
    error?: string;
    authUrl?: string;
}

interface UseYouTubeMembersResult {
    data: MembersData | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    latestMember: YouTubeMember | null;
    refetch: () => Promise<void>;
}

export function useYouTubeMembers(pollingInterval: number = 30000): UseYouTubeMembersResult {
    const [data, setData] = useState<MembersData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = useCallback(async () => {
        try {
            const response = await fetch('/api/youtube/members');
            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setData({
                        isAuthenticated: false,
                        totalMembers: 0,
                        latestMember: null,
                        members: [],
                        authUrl: result.authUrl,
                    });
                    setError(null);
                } else {
                    setError(result.error || 'Erro ao buscar membros');
                }
            } else {
                setData(result);
                setError(null);
            }
        } catch (err) {
            setError('Erro de conexão');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();

        // Polling para atualização periódica
        const interval = setInterval(fetchMembers, pollingInterval);

        return () => clearInterval(interval);
    }, [fetchMembers, pollingInterval]);

    return {
        data,
        isLoading,
        error,
        isAuthenticated: data?.isAuthenticated ?? false,
        latestMember: data?.latestMember ?? null,
        refetch: fetchMembers,
    };
}
