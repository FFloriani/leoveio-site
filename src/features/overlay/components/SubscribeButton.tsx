'use client';

interface SubscribeButtonProps {
    showIcon?: boolean;
    fontScale?: number;
}

export function SubscribeButton({ showIcon = true, fontScale = 1 }: SubscribeButtonProps) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'rgba(0,0,0,0.55)',
            padding: '5px 8px',
            borderRadius: 3,
            flexShrink: 0
        }}>
            {showIcon && (
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
            )}
            <span style={{ color: 'white', fontSize: 10 * fontScale, fontWeight: 600 }}>
                Inscreva-se
            </span>
        </div>
    );
}
