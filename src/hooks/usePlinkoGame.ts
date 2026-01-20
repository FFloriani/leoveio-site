import { useState, useEffect, useCallback, useRef } from 'react';

// --- TYPES ---
export interface Ball {
    id: string; // UserId
    name: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    isStatic: boolean; // True in lobby
    finished: boolean; // Landed in a bucket
    result?: 'win' | 'lose';
}

export interface Peg {
    x: number;
    y: number;
    radius: number;
}

export interface Wall {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'wall' | 'floor';
}

export interface GameState {
    balls: Ball[];
    round: number;
    status: 'lobby' | 'dropping' | 'finished';
    winner: Ball | null;
    survivors: Ball[];
}

// --- CONSTANTS ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const GRAVITY = 0.4;
const FRICTION = 0.99;
const BOUNCE = 0.6;
const PEG_RADIUS = 4;
const BALL_RADIUS = 6;
const COLS = 16; // Pyramid base size matches bucket zones

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5', '#FFFF33'];

export function usePlinkoGame() {
    const [gameState, setGameState] = useState<GameState>({
        balls: [],
        round: 1,
        status: 'lobby',
        winner: null,
        survivors: []
    });

    // Refs for physics loop to avoid closure staleness
    const stateRef = useRef<GameState>(gameState);
    stateRef.current = gameState;

    const pegsRef = useRef<Peg[]>([]);

    // --- SETUP PEGS ---
    useEffect(() => {
        // Create standard Pyramid
        const newPegs: Peg[] = [];
        const rows = 14;
        const startX = CANVAS_WIDTH / 2;
        const startY = 150;
        const spacingX = 40;
        const spacingY = 40;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col <= row; col++) {
                const x = startX - (row * spacingX / 2) + (col * spacingX);
                const y = startY + (row * spacingY);
                newPegs.push({ x, y, radius: PEG_RADIUS });
            }
        }
        pegsRef.current = newPegs;
    }, []);

    // --- ACTIONS ---

    const addPlayer = useCallback((id: string, name: string) => {
        if (stateRef.current.status !== 'lobby') return;
        if (stateRef.current.balls.find(b => b.id === id)) return;

        // Spread spawn position slightly to avoid perfect stacking
        const spawnX = (CANVAS_WIDTH / 2) + (Math.random() * 40 - 20);

        const newBall: Ball = {
            id,
            name,
            x: spawnX,
            y: 50 + (Math.random() * 50), // Staging area
            vx: 0,
            vy: 0,
            radius: BALL_RADIUS,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            isStatic: true,
            finished: false
        };

        setGameState(prev => ({
            ...prev,
            balls: [...prev.balls, newBall]
        }));
    }, []);

    const startDrop = useCallback(() => {
        if (stateRef.current.balls.length === 0) return;

        setGameState(prev => ({
            ...prev,
            status: 'dropping',
            balls: prev.balls.map(b => ({
                ...b,
                isStatic: false,
                vx: (Math.random() * 2 - 1), // Light jitter
                vy: (Math.random() * 2)
            }))
        }));
    }, []);

    const resetRound = useCallback((survivorsOnly: boolean = false) => {
        setGameState(prev => {
            let nextBalls = survivorsOnly ? prev.survivors : prev.balls;

            // If no survivors (all lost), retry with everyone ? Or strict elimination?
            // "Os vencedores passam pra proxima rodada" implies strict.
            // But if 0 survivors, the game ends or restarts round?
            // Let's assume if 0 survive, we restart with the SAME group (Retry).
            if (survivorsOnly && nextBalls.length === 0) {
                nextBalls = prev.balls; // Retry round
            }

            // Reset positions
            nextBalls = nextBalls.map(b => ({
                ...b,
                x: (CANVAS_WIDTH / 2) + (Math.random() * 40 - 20),
                y: 50 + (Math.random() * 50),
                vx: 0,
                vy: 0,
                isStatic: true,
                finished: false,
                result: undefined
            }));

            return {
                balls: nextBalls,
                round: survivorsOnly && prev.survivors.length > 0 ? prev.round + 1 : prev.round,
                status: 'lobby',
                winner: null,
                survivors: []
            };
        });
    }, []);

    // --- PHYSICS LOOP ---
    useEffect(() => {
        let animationId: number;

        const update = () => {
            if (stateRef.current.status !== 'dropping') {
                animationId = requestAnimationFrame(update);
                return;
            }

            // Update Physics
            const activeBalls = stateRef.current.balls.map(ball => {
                if (ball.isStatic || ball.finished) return ball;

                let { x, y, vx, vy } = ball;

                // Gravity
                vy += GRAVITY;
                vx *= FRICTION;
                vy *= FRICTION;

                // Move
                x += vx;
                y += vy;

                // Wall Collisions
                if (x < ball.radius) { x = ball.radius; vx *= -BOUNCE; }
                if (x > CANVAS_WIDTH - ball.radius) { x = CANVAS_WIDTH - ball.radius; vx *= -BOUNCE; }

                // Peg Collisions
                for (const peg of pegsRef.current) {
                    const dx = x - peg.x;
                    const dy = y - peg.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = ball.radius + peg.radius;

                    if (dist < minDist) {
                        // Collision vector
                        const nx = dx / dist; // Normalize
                        const ny = dy / dist;

                        // Reflect velocity based on collision normal
                        // V_new = V_old - 2 * (V_old . N) * N
                        const dot = vx * nx + vy * ny;
                        vx = vx - 2 * dot * nx;
                        vy = vy - 2 * dot * ny;

                        // Add bounce energy loss
                        vx *= BOUNCE;
                        vy *= BOUNCE;

                        // Add chaos (imperfection)
                        vx += (Math.random() * 0.5 - 0.25);

                        // Push out of collision
                        const overlap = minDist - dist;
                        x += nx * overlap;
                        y += ny * overlap;
                    }
                }

                // Floor / Win Zone Check
                // Win Zone is center ~15% of width?
                // Let's say Peg pyramid ends at Y=~700. Floor is 780.
                if (y > 750) {
                    const finished = true;
                    let result: 'win' | 'lose' = 'lose';

                    // Win Zone: Center 100px? (350 to 450)
                    if (x > 350 && x < 450) {
                        result = 'win';
                    } else {
                        result = 'lose';
                    }

                    // Stop
                    y = 750;
                    vx = 0;
                    vy = 0;

                    return { ...ball, x, y, vx, vy, finished, result };
                }

                return { ...ball, x, y, vx, vy };
            });

            // Check Round End
            const allFinished = activeBalls.every(b => b.finished);

            if (allFinished) {
                const survivors = activeBalls.filter(b => b.result === 'win');

                // If only 1 survivor (or 0 and we retry), logic handled in reset
                // But if 1 survivor -> WINNER
                let status: GameState['status'] = 'finished';
                let winner: Ball | null = null;

                if (survivors.length === 1) {
                    winner = survivors[0];
                } else if (survivors.length === 0) {
                    // No winner in this round, technically 'finished' round but no absolute winner
                    // UI awaits manual trigger to "Next Round" (which will act as Retry)
                } else {
                    // Multiple survivors, ready for next round
                }

                setGameState(prev => ({
                    ...prev,
                    balls: activeBalls,
                    status: status, // Actually wait for user to click "Next Round"
                    survivors: survivors,
                    winner: winner
                }));
            } else {
                setGameState(prev => ({ ...prev, balls: activeBalls }));
            }

            animationId = requestAnimationFrame(update);
        };

        animationId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return {
        gameState,
        pegs: pegsRef.current,
        addPlayer,
        startDrop,
        resetRound,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
    };
}
