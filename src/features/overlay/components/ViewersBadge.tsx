'use client';

interface ViewersBadgeProps {
    viewers: number;
    formatNum: (n: number) => string;
}

export function ViewersBadge({ viewers, formatNum }: ViewersBadgeProps) {
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
