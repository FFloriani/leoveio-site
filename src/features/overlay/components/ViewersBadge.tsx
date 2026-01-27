'use client';

interface ViewersBadgeProps {
    viewers: number;
    formatNum: (n: number) => string;
    position?: 'top' | 'inside';
}

export function ViewersBadge({ viewers, formatNum, position = 'top' }: ViewersBadgeProps) {
    if (position === 'inside') {
        // Estilo para dentro do painel (substitui o botão Inscreva-se)
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: 8,
                padding: '8px 20px',
                minWidth: 70,
            }}>
                <span style={{
                    fontFamily: "'Teko', sans-serif",
                    fontSize: 32,
                    fontWeight: 600,
                    color: '#ef4444',
                    lineHeight: 1,
                }}>
                    {formatNum(viewers)}
                </span>
            </div>
        );
    }

    // Estilo original (badge em cima)
    return (
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
    );
}

