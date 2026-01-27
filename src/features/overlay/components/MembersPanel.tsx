'use client';

import { motion } from 'framer-motion';
import { YouTubeMember } from '../hooks/useYouTubeMembers';

interface MembersPanelProps {
    latestMember: YouTubeMember | null;
    previousMember?: YouTubeMember | null;
}

export function MembersPanel({ latestMember, previousMember }: MembersPanelProps) {
    // Se não tem membros, não renderiza nada
    if (!latestMember) return null;

    return (
        <div style={{
            position: 'absolute',
            top: -50,
            left: 0,
            right: 0,
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
        }}>
            {/* Membro Anterior */}
            {previousMember && (
                <MemberBadge
                    member={previousMember}
                    label="Anterior"
                    variant="secondary"
                />
            )}

            {/* Novo Membro */}
            <MemberBadge
                member={latestMember}
                label="Novo Membro"
                variant="primary"
                isNew
            />
        </div>
    );
}

interface MemberBadgeProps {
    member: YouTubeMember;
    label: string;
    variant: 'primary' | 'secondary';
    isNew?: boolean;
}

function MemberBadge({ member, label, variant, isNew }: MemberBadgeProps) {
    const isPrimary = variant === 'primary';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px 6px 6px',
                background: isPrimary
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'rgba(255, 255, 255, 0.08)',
                borderRadius: 20,
                border: isPrimary
                    ? '1px solid rgba(34, 197, 94, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
                <img
                    src={member.profileImageUrl || 'https://i.pravatar.cc/100'}
                    alt={member.displayName}
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: isPrimary
                            ? '2px solid #22c55e'
                            : '2px solid rgba(255,255,255,0.3)',
                    }}
                />
                {isNew && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            width: 10,
                            height: 10,
                            background: '#22c55e',
                            borderRadius: '50%',
                            border: '2px solid #1f1f1f',
                        }}
                    />
                )}
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <span style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: isPrimary ? '#22c55e' : 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    lineHeight: 1,
                }}>
                    {label}
                </span>
                <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'white',
                    lineHeight: 1.2,
                    maxWidth: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {member.displayName}
                </span>
            </div>
        </motion.div>
    );
}
