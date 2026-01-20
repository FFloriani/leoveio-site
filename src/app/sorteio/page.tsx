'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useYouTubeChat } from '@/hooks/useYouTubeChat';
import { useTwitchChat } from '@/hooks/useTwitchChat';
import { usePlinkoGame, Ball, Peg } from '@/hooks/usePlinkoGame';

export default function SorteioPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { gameState, pegs, addPlayer, startDrop, resetRound, CANVAS_WIDTH, CANVAS_HEIGHT } = usePlinkoGame();

    // Chat Sources
    const { messages: ytMessages } = useYouTubeChat();
    const { messages: twitchMessages } = useTwitchChat(['florianitv', 'leoveio']);

    // --- CHAT INTEGRATION ---
    const processedMsgIdsRef = useRef<Set<string>>(new Set());

    // Generic Message Handler
    const handleMessage = (source: 'yt' | 'twitch', msg: any) => {
        // Dedup
        const uid = `${source}-${msg.id || Math.random()}`;
        if (processedMsgIdsRef.current.has(uid)) return;
        processedMsgIdsRef.current.add(uid);

        const text = (msg.message || '').toLowerCase().trim();
        const userName = msg.displayName || msg.author || 'Anon';
        const userId = msg.id || msg.author || 'anon';

        // 1. !jogar (Anyone)
        if (text === '!jogar' || text === '!play') {
            addPlayer(userId, userName);
        }

        // 2. !soltar (Owner/Mod)
        const isOwner =
            (source === 'twitch' && (msg.isBroadcaster || msg.username === 'leoveio')) ||
            (source === 'yt' && (userName.toLowerCase() === 'leoveio')); // YT hook doesn't give roles yet, check name

        if (text === '!jogar' && isOwner) { // User asked for "!jogar" from owner to trigger
            // Wait, user said "quando o dono do canal digitar !jogar tem que soltar as bolas"
            // SO: Owner !jogar = START DROP.
            startDrop();
        }

        // Backup command
        if (text === '!soltar' && isOwner) {
            startDrop();
        }
    };

    // YouTube Listener
    useEffect(() => {
        if (!ytMessages || ytMessages.length === 0) return;
        const lastMsg = ytMessages[ytMessages.length - 1];
        handleMessage('yt', lastMsg);
    }, [ytMessages]);

    // Twitch Listener
    useEffect(() => {
        if (!twitchMessages || twitchMessages.length === 0) return;
        const lastMsg = twitchMessages[twitchMessages.length - 1];
        handleMessage('twitch', lastMsg);
    }, [twitchMessages]);


    // --- TEST FUNCTION ---
    const addTestPlayers = () => {
        for (let i = 0; i < 100; i++) {
            const names = ['Zed', 'Yasuo', 'Lux', 'Ahri', 'Teemo', 'Darius', 'Vayne', 'Jinx', 'Vi', 'Ekko'];
            const name = `${names[Math.floor(Math.random() * names.length)]}_${Math.floor(Math.random() * 999)}`;
            addPlayer(`test-${i}-${Date.now()}`, name);
        }
    };


    // --- RENDER LOOP ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const render = () => {
            // 1. Clear
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // 2. Draw Background Elements (The "Bucket")
            // Lose Zones (Red tint at bottom sides)
            ctx.fillStyle = 'rgba(154, 18, 7, 0.2)';
            ctx.fillRect(0, 750, 350, 50); // Left Lose
            ctx.fillRect(450, 750, 350, 50); // Right Lose

            // Win Zone (Golden center)
            ctx.fillStyle = 'rgba(232, 197, 71, 0.3)';
            ctx.fillRect(350, 750, 100, 50);
            ctx.strokeStyle = '#DEB066';
            ctx.lineWidth = 2;
            ctx.strokeRect(350, 750, 100, 50);

            // Labels
            ctx.fillStyle = '#DEB066';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('VENCEDOR', 400, 780);

            // 3. Draw Pegs
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            pegs.forEach(peg => {
                ctx.beginPath();
                ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // 4. Draw Balls
            gameState.balls.forEach(ball => {
                ctx.fillStyle = ball.color;
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fill();

                // Name (High perf cost if many balls, maybe limit?)
                // Only draw name if static or few balls
                if (gameState.balls.length < 50 || ball.finished) {
                    ctx.fillStyle = 'white';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(ball.name.substring(0, 8), ball.x, ball.y - 8);
                }
            });

            animationId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationId);
    }, [gameState, pegs, CANVAS_WIDTH, CANVAS_HEIGHT]);

    return (
        <div className="min-h-screen bg-[#1a0808] flex items-center justify-center p-4 font-sans text-[#E8D5B0] relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <Image src="/backgroundchines.png" alt="bg" fill className="object-cover" />
            </div>

            {/* Sidebar / Stats */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 w-64 space-y-4 z-10">
                <div className="p-4 bg-black/60 border border-[#DEB066] rounded-xl backdrop-blur-md">
                    <h2 className="text-xl font-bold text-[#DEB066] mb-2">PLINKO ROYALE</h2>
                    <div className="flex justify-between items-center bg-black/40 p-2 rounded mb-2">
                        <span className="opacity-70">Rodada</span>
                        <span className="font-bold text-2xl">{gameState.round}</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/40 p-2 rounded">
                        <span className="opacity-70">Vivos</span>
                        <span className="font-bold text-2xl text-[#00A86B]">
                            {gameState.status === 'finished' ? gameState.survivors.length : gameState.balls.length}
                        </span>
                    </div>
                </div>

                <div className="p-4 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md">
                    <h3 className="text-sm font-bold opacity-70 mb-2">COMANDOS</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex gap-2"><span className="text-[#00A86B] font-bold">!jogar</span> Entrar na rodada</li>
                        <li className="flex gap-2"><span className="text-[#DEB066] font-bold">!soltar</span> Iniciar (Admin)</li>
                    </ul>
                </div>
            </div>

            {/* Main Canvas */}
            <div className="relative z-10 p-2 border-4 border-[#DEB066] rounded-2xl bg-black/80 shadow-[0_0_50px_rgba(222,176,102,0.1)]">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="rounded-lg block w-full h-[90vh] object-contain"
                />

                {/* Overlays */}
                <AnimatePresence>
                    {/* Lobby Overlay */}
                    {gameState.status === 'lobby' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
                        >
                            <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-4">AGUARDANDO...</h2>
                            <div className="bg-[#DEB066] text-black px-6 py-2 rounded-full font-bold animate-pulse">
                                Digite !jogar
                            </div>

                            {/* Manual Start Button for Admin/Testing */}
                            <div className="mt-8 pointer-events-auto flex gap-4">
                                <button
                                    onClick={addTestPlayers}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-all shadow-lg active:scale-95"
                                >
                                    TESTAR 100 🤖
                                </button>
                                <button
                                    onClick={startDrop}
                                    className="px-8 py-3 bg-[#9A1207] hover:bg-[#b91c10] text-white font-bold rounded-lg transition-all shadow-lg active:scale-95"
                                >
                                    SOLTAR BOLAS ⬇️
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Round End / Winner Overlay */}
                    {gameState.status === 'finished' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20"
                        >
                            {gameState.winner ? (
                                <>
                                    <h2 className="text-6xl font-black text-[#E8C547] drop-shadow-[0_0_30px_rgba(232,197,71,0.8)] mb-4 animate-bounce">
                                        VENCEDOR!
                                    </h2>
                                    <div className="text-5xl text-white font-bold mb-8">
                                        {gameState.winner.name}
                                    </div>
                                    <button
                                        onClick={() => resetRound(false)} // Reset completely
                                        className="px-6 py-3 bg-[#00A86B] text-white font-bold rounded-lg hover:scale-105 transition-transform"
                                    >
                                        Novo Sorteio
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-4xl font-bold text-white mb-2">FIM DA RODADA {gameState.round}</h2>
                                    <p className="text-xl text-[#DEB066] mb-8">
                                        {gameState.survivors.length} Jogadores passaram!
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => resetRound(true)} // Keep survivors
                                            className="px-6 py-3 bg-[#DEB066] text-black font-bold rounded-lg hover:scale-105 transition-transform"
                                        >
                                            Próxima Rodada (Survivors →)
                                        </button>
                                        {gameState.survivors.length === 0 && (
                                            <button
                                                onClick={() => resetRound(false)} // Retry if everyone died
                                                className="px-6 py-3 bg-[#9A1207] text-white font-bold rounded-lg hover:scale-105 transition-transform"
                                            >
                                                Reiniciar (Ninguém ganhou)
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
