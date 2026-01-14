// Funções de cálculo para o sistema de Banca

import { Participant } from '../types';

/**
 * Calcula os percentuais de participação
 */
export function calculatePercentages(
    participants: Participant[],
    total: number
): Participant[] {
    return participants.map(p => ({
        ...p,
        percentage: total > 0 ? (p.contribution / total) * 100 : 0
    }));
}

/**
 * Calcula a distribuição final baseada no saldo final
 */
export function calculateDistribution(
    participants: Participant[],
    finalBalance: number
): Participant[] {
    const totalContributions = participants.reduce((sum, p) => sum + p.contribution, 0);

    return participants.map(p => {
        const percentage = totalContributions > 0 ? p.contribution / totalContributions : 0;
        const finalAmount = finalBalance * percentage;
        const profit = finalAmount - p.contribution;

        return {
            ...p,
            percentage: percentage * 100,
            finalAmount,
            profit
        };
    });
}

/**
 * Calcula o total investido
 */
export function calculateTotalInvested(participants: Participant[]): number {
    return participants.reduce((sum, p) => sum + p.contribution, 0);
}

/**
 * Encontra a maior participação percentual
 */
export function getMaxParticipation(participants: Participant[]): number {
    if (participants.length === 0) return 0;
    return Math.max(...participants.map(p => p.percentage));
}

/**
 * Gera um ID único
 */
export function generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}
