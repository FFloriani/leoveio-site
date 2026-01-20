'use client';

import { useEffect, useRef } from 'react';
import { useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
}

export function AnimatedCounter({ value }: AnimatedCounterProps) {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.floor(current).toLocaleString('pt-BR'));
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    useEffect(() => {
        return display.on('change', (latest) => {
            if (ref.current) {
                ref.current.textContent = latest;
            }
        });
    }, [display]);

    return <span ref={ref}>{value.toLocaleString('pt-BR')}</span>;
}
