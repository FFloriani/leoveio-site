'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ width: { duration: 0.6, ease: 'easeOut' } }}
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
    );
}
