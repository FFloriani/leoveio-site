'use client';

import { motion } from 'framer-motion';

interface FloatingLikeProps {
    onComplete: () => void;
}

export function FloatingLike({ onComplete }: FloatingLikeProps) {
    const randomOffset = Math.random() * 30 - 15;

    return (
        <motion.svg
            viewBox="0 0 24 24"
            style={{
                position: 'absolute',
                left: 35 + randomOffset,
                top: 25,
                width: 24,
                height: 24,
                fill: '#22c55e',
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
