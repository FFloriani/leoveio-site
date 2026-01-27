'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { YouTubeMember } from '../hooks/useYouTubeMembers';

interface LatestMemberBadgeProps {
    member: YouTubeMember | null;
    isVisible: boolean;
}

export function LatestMemberBadge({ member, isVisible }: LatestMemberBadgeProps) {
    if (!member) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        top: -60,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                        borderRadius: 12,
                        border: '2px solid #FFD700',
                        boxShadow: '0 4px 20px rgba(255, 0, 0, 0.4)',
                    }}
                >
                    {/* Ícone de membro */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1
                        }}
                        style={{
                            fontSize: 24,
                        }}
                    >
                        ⭐
                    </motion.div>

                    {/* Avatar do membro */}
                    {member.profileImageUrl && (
                        <img
                            src={member.profileImageUrl}
                            alt={member.displayName}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                border: '2px solid #FFD700',
                            }}
                        />
                    )}

                    {/* Texto */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                            color: '#FFD700',
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>
                            Novo Membro!
                        </span>
                        <span style={{
                            color: 'white',
                            fontSize: 16,
                            fontWeight: 800,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}>
                            {member.displayName}
                        </span>
                    </div>

                    {/* Efeito de brilho */}
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                        }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.2), transparent)',
                            borderRadius: 12,
                            pointerEvents: 'none',
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
