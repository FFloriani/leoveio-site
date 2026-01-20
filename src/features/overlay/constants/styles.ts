export const OVERLAY_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;500;600;700&display=swap');

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}
`;

export const COLORS = {
    primary: '#dc2626',
    success: '#22c55e',
    dark: '#1f1f1f',
    instagram: {
        purple: '#833AB4',
        pink: '#C13584',
        red: '#E1306C'
    }
} as const;

export const ANIMATION_DURATIONS = {
    viewCycle: 15000,
    statsFetch: 8000,
    likeParticle: 1200
} as const;
