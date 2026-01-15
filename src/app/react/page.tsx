'use client';

import { useReactQueue } from '@/hooks/useReactQueue';
import { useResizableDraggable } from '@/hooks/useDraggable';
import { ReactPlayer, ReactQueue } from '@/features/react';
import { useState } from 'react';

export default function ReactPage() {
    const {
        queue,
        currentVideo,
        error,
        next,
        skip,
        remove,
    } = useReactQueue({
        channels: ['leoveio', 'florianitv'],
        enabled: true,
        maxQueue: 50,
        cooldownMs: 30000
    });

    // Estados para mostrar/esconder elementos
    const [showInstructions, setShowInstructions] = useState(true);
    const [showQueue, setShowQueue] = useState(true);

    // Elemento de vídeo: arrastável + redimensionável
    const video = useResizableDraggable({
        initialPosition: { x: 100, y: 100 },
        initialSize: { width: 550, height: 700 },
        minSize: { width: 300, height: 400 }
    });

    // Placeholder da câmera: arrastável + redimensionável
    const camera = useResizableDraggable({
        initialPosition: { x: 700, y: 100 },
        initialSize: { width: 400, height: 500 },
        minSize: { width: 200, height: 250 }
    });

    // Fila: arrastável + redimensionável
    const queuePanel = useResizableDraggable({
        initialPosition: { x: 1150, y: 100 },
        initialSize: { width: 300, height: 500 },
        minSize: { width: 250, height: 300 }
    });

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-[#0a0505] via-[#1a0808] to-[#0a0505] overflow-hidden relative">

            {/* Toolbar - controles discretos no topo */}
            <div className="absolute top-0 left-0 right-0 z-50 p-2 bg-black/50 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-[#DEB066] font-bold">🎬 React Canvas</span>
                    <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className={`px-3 py-1 rounded text-xs ${showInstructions ? 'bg-[#DEB066] text-black' : 'bg-white/10 text-white'}`}
                    >
                        {showInstructions ? '✓ Instruções' : 'Instruções'}
                    </button>
                    <button
                        onClick={() => setShowQueue(!showQueue)}
                        className={`px-3 py-1 rounded text-xs ${showQueue ? 'bg-[#DEB066] text-black' : 'bg-white/10 text-white'}`}
                    >
                        {showQueue ? '✓ Fila' : 'Fila'}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {currentVideo && (
                        <>
                            <span className="text-white/50 text-xs">Enviado por</span>
                            <span className="text-[#DEB066] font-bold text-sm">{currentVideo.displayName}</span>
                        </>
                    )}
                    <button onClick={skip} className="px-3 py-1 rounded bg-red-500/80 text-white text-xs">✕ Pular</button>
                    <button onClick={next} className="px-3 py-1 rounded bg-[#DEB066] text-black text-xs font-bold">Próximo ▶</button>
                </div>
            </div>

            {error && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 p-2 rounded bg-red-500/20 border border-red-500/50 text-red-400 text-xs">
                    {error}
                </div>
            )}

            {/* === VÍDEO - Arrastável + Redimensionável === */}
            <div
                style={video.containerStyle}
                className="bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-[#DEB066]/50"
            >
                {/* Barra de título para arrastar */}
                <div
                    onMouseDown={video.startDrag}
                    className="h-8 bg-gradient-to-r from-[#DEB066] to-[#DEB066]/70 cursor-grab active:cursor-grabbing flex items-center justify-between px-3"
                >
                    <span className="text-black font-bold text-sm">📺 Vídeo</span>
                    <span className="text-black/50 text-xs">Arraste para mover</span>
                </div>

                {/* Conteúdo do vídeo - overflow:hidden faz crop do conteúdo */}
                <div className="w-full h-[calc(100%-32px)] overflow-hidden">
                    <ReactPlayer video={currentVideo} onNext={next} onSkip={skip} />
                </div>

                {/* Handles de redimensionamento */}
                <div onMouseDown={(e) => video.startResize(e, 'se')} className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-[#DEB066]/50 rounded-tl" />
                <div onMouseDown={(e) => video.startResize(e, 'sw')} className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize bg-[#DEB066]/50 rounded-tr" />
                <div onMouseDown={(e) => video.startResize(e, 'ne')} className="absolute top-8 right-0 w-4 h-4 cursor-ne-resize bg-[#DEB066]/50 rounded-bl" />
                <div onMouseDown={(e) => video.startResize(e, 'e')} className="absolute top-1/2 right-0 w-2 h-8 cursor-e-resize bg-[#DEB066]/30" />
                <div onMouseDown={(e) => video.startResize(e, 's')} className="absolute bottom-0 left-1/2 w-8 h-2 cursor-s-resize bg-[#DEB066]/30" />
            </div>

            {/* === PLACEHOLDER DA CÂMERA === */}
            {showInstructions && (
                <div
                    style={camera.containerStyle}
                    className="border-4 border-dashed border-[#00ff00]/60 rounded-lg bg-[#00ff00]/10 flex flex-col items-center justify-center"
                >
                    {/* Barra para arrastar */}
                    <div
                        onMouseDown={camera.startDrag}
                        className="absolute top-0 left-0 right-0 h-8 bg-[#00ff00]/30 cursor-grab active:cursor-grabbing flex items-center justify-center"
                    >
                        <span className="text-[#00ff00] font-bold text-xs">Arraste para posicionar</span>
                    </div>

                    {/* Instruções */}
                    <div className="text-center p-4 mt-8">
                        <div className="text-6xl mb-4">📷</div>
                        <h3 className="text-[#00ff00] font-bold text-xl mb-2">SUA CÂMERA AQUI</h3>
                        <p className="text-[#00ff00]/70 text-sm">
                            No OBS, posicione sua webcam<br />
                            nesta área da tela
                        </p>
                    </div>

                    {/* Handles de redimensionamento */}
                    <div onMouseDown={(e) => camera.startResize(e, 'se')} className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-[#00ff00]/50" />
                    <div onMouseDown={(e) => camera.startResize(e, 'sw')} className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize bg-[#00ff00]/50" />
                    <div onMouseDown={(e) => camera.startResize(e, 'e')} className="absolute top-1/2 right-0 w-2 h-8 cursor-e-resize bg-[#00ff00]/30" />
                    <div onMouseDown={(e) => camera.startResize(e, 's')} className="absolute bottom-0 left-1/2 w-8 h-2 cursor-s-resize bg-[#00ff00]/30" />
                </div>
            )}

            {/* === FILA DE VÍDEOS === */}
            {showQueue && (
                <div
                    style={queuePanel.containerStyle}
                    className="bg-black/80 rounded-lg overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm"
                >
                    {/* Barra para arrastar */}
                    <div
                        onMouseDown={queuePanel.startDrag}
                        className="h-8 bg-gradient-to-r from-white/20 to-transparent cursor-grab active:cursor-grabbing flex items-center justify-between px-3"
                    >
                        <span className="text-white font-bold text-sm">📋 Fila ({queue.length})</span>
                    </div>

                    <div className="h-[calc(100%-32px)] overflow-y-auto">
                        <ReactQueue
                            videos={queue}
                            currentVideo={currentVideo}
                            onRemove={remove}
                        />
                    </div>

                    {/* Handles de redimensionamento */}
                    <div onMouseDown={(e) => queuePanel.startResize(e, 'se')} className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-white/30" />
                    <div onMouseDown={(e) => queuePanel.startResize(e, 'sw')} className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize bg-white/30" />
                </div>
            )}

            {/* Instruções gerais */}
            {showInstructions && (
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white/70 text-xs max-w-xs">
                    <h4 className="text-[#DEB066] font-bold mb-2">💡 Como usar:</h4>
                    <ol className="space-y-1 list-decimal list-inside">
                        <li>Arraste os elementos para posicionar</li>
                        <li>Redimensione pelos cantos</li>
                        <li>Capture esta janela no OBS</li>
                        <li>Sobreponha sua webcam na área verde</li>
                        <li>Esconda instruções quando estiver pronto</li>
                    </ol>
                </div>
            )}
        </div>
    );
}
