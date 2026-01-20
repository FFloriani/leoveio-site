'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface InstagramPanelProps {
    isVisible: boolean;
    handle: string;
}

export function InstagramPanel({ isVisible, handle }: InstagramPanelProps) {
    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="instagram-panel"
                    initial={{
                        clipPath: 'inset(0 0 0 100%)',
                        opacity: 1
                    }}
                    animate={{
                        clipPath: 'inset(0 0 0 0)',
                        opacity: 1
                    }}
                    exit={{
                        clipPath: 'inset(0 0 0 100%)',
                        opacity: 1
                    }}
                    style={{
                        position: 'absolute',
                        right: 'calc(100% - 6px)',
                        top: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, #833AB4 0%, #C13584 30%, #E1306C 60%, #dc2626 100%)',
                        zIndex: 10,
                        borderRadius: '50px 0 0 50px',
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        paddingLeft: 8,
                        overflow: 'hidden'
                    }}
                    transition={{
                        duration: 0.6,
                        ease: [0.65, 0, 0.35, 1]
                    }}
                >
                    {/* Large Instagram Icon - Half visible */}
                    <motion.svg
                        viewBox="0 0 24 24"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            delay: 0.2,
                            duration: 0.3,
                            ease: 'easeOut'
                        }}
                        style={{
                            width: 100,
                            height: 100,
                            fill: 'rgba(255,255,255,0.25)',
                            flexShrink: 0,
                            marginLeft: -50,
                            marginRight: -10
                        }}
                    >
                        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                    </motion.svg>

                    {/* Handle text */}
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{
                            delay: 0.4,
                            duration: 0.35,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        style={{
                            color: 'white',
                            fontFamily: "'Teko', sans-serif",
                            fontSize: 28,
                            fontWeight: 500,
                            letterSpacing: '0.5px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            paddingRight: 20,
                            paddingLeft: 5
                        }}
                    >
                        {handle}
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
