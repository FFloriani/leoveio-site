'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ExternalLink, Activity, Info, AlertCircle, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { OverlayPreview, DEFAULT_TRANSITIONS, DEFAULT_VISUAL_OPTIONS, TextTransition, OverlayVisualOptions } from '@/features/overlay';
import type { ViewMode } from '@/features/overlay';

function ConfigContent() {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [goal, setGoal] = useState('5000');
    const [instagramHandle, setInstagramHandle] = useState('@leoveio');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [copied, setCopied] = useState(false);

    // Transôïes customizáveis
    const [transitions, setTransitions] = useState<TextTransition[]>(DEFAULT_TRANSITIONS);

    // Opções visuais
    const [visualOptions, setVisualOptions] = useState<OverlayVisualOptions>(DEFAULT_VISUAL_OPTIONS);

    // Color picker aberto (id da transição ou null)
    const [openColorPicker, setOpenColorPicker] = useState<ViewMode | null>(null);

    // Extract video ID from YouTube URL
    const extractVideoId = (url: string): string | null => {
        if (!url) return null;
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\s?]+)/,
            /youtube\.com\/embed\/([^?&\s]+)/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return url.length === 11 ? url : null;
    };

    const updateTransition = (id: ViewMode, updates: Partial<TextTransition>) => {
        setTransitions(prev => prev.map(t =>
            t.id === id ? { ...t, ...updates } : t
        ));
    };

    const handleGenerate = () => {
        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            if (!youtubeUrl) {
                // Modo teste/exemplo
            } else {
                alert('URL inválida! Cole o link da sua live do YouTube.');
                return;
            }
        }

        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const idToUse = videoId || 'TEST_MODE';

        // Encode transitions as JSON in URL
        const enabledTransitions = transitions.filter(t => t.enabled);
        const transitionsParam = encodeURIComponent(JSON.stringify(enabledTransitions.map(t => ({
            id: t.id,
            text: t.text
        }))));

        let url = `${baseUrl}/overlay/overlay?v=${idToUse}&meta=${goal}&ig=${encodeURIComponent(instagramHandle)}&texts=${transitionsParam}`;
        if (idToUse === 'TEST_MODE') {
            url += '&test=1';
        }

        setGeneratedUrl(url);
        setCopied(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] text-white font-sans">

            {/* Layout Principal - 2 Colunas para PC */}
            <div className="flex h-screen">

                {/* Coluna Esquerda - Configurações (scrollable) */}
                <div className="w-[480px] flex-shrink-0 border-r border-white/10 overflow-y-auto bg-[#0d0d0d]">
                    <div className="p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-black bg-gradient-to-r from-[#DEB066] to-[#E8C547] bg-clip-text text-transparent mb-2">
                                OVERLAY BUILDER
                            </h1>
                            <p className="text-gray-500 text-sm">Configure seu widget para OBS</p>
                        </div>

                        {/* Seção: Dados da Live */}
                        <div className="mb-6">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Activity size={14} className="text-[#DEB066]" />
                                Dados da Live
                            </h2>
                            <div className="space-y-4 bg-white/5 rounded-xl p-4 border border-white/5">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Link do YouTube / Video ID</label>
                                    <input
                                        type="text"
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        placeholder="Cole o link aqui..."
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#DEB066] transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Meta de Likes</label>
                                        <input
                                            type="number"
                                            value={goal}
                                            onChange={(e) => setGoal(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#DEB066] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Instagram</label>
                                        <input
                                            type="text"
                                            value={instagramHandle}
                                            onChange={(e) => setInstagramHandle(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#DEB066] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seção: Transições de Texto */}
                        <div className="mb-6">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Settings size={14} className="text-[#DEB066]" />
                                Transições de Texto
                            </h2>
                            <div className="space-y-3">
                                {transitions.map((transition) => (
                                    <div key={transition.id} className={`bg-white/5 rounded-xl p-4 border transition-all ${transition.enabled ? 'border-white/10' : 'border-transparent opacity-50'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium">{transition.label}</span>
                                            <button
                                                onClick={() => updateTransition(transition.id, { enabled: !transition.enabled })}
                                                className={`transition-colors ${transition.enabled ? 'text-green-400' : 'text-gray-600'}`}
                                            >
                                                {transition.enabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                            </button>
                                        </div>

                                        {transition.id !== 'instagram' && transition.enabled && (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={transition.text}
                                                    onChange={(e) => updateTransition(transition.id, { text: e.target.value })}
                                                    placeholder="Texto..."
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DEB066]"
                                                />
                                                <div className="flex gap-2 items-end">
                                                    <div className="flex-1">
                                                        <label className="text-[10px] text-gray-500 mb-1 block">Destaque</label>
                                                        <input
                                                            type="text"
                                                            value={transition.highlightWord}
                                                            onChange={(e) => updateTransition(transition.id, { highlightWord: e.target.value })}
                                                            placeholder="LIKE"
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#DEB066]"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <label className="text-[10px] text-gray-500 mb-1 block">Cor</label>
                                                        <button
                                                            onClick={() => setOpenColorPicker(openColorPicker === transition.id ? null : transition.id)}
                                                            className="w-10 h-10 rounded-lg border-2 border-white/20 cursor-pointer hover:scale-105 transition-transform"
                                                            style={{ backgroundColor: transition.highlightColor }}
                                                            title="Abrir seletor de cores"
                                                        />

                                                        {/* Color Picker Popup */}
                                                        <AnimatePresence>
                                                            {openColorPicker === transition.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                                    className="absolute bottom-full right-0 mb-2 z-50 bg-[#1a1a1a] p-3 rounded-xl border border-white/20 shadow-2xl"
                                                                >
                                                                    <HexColorPicker
                                                                        color={transition.highlightColor}
                                                                        onChange={(color) => updateTransition(transition.id, { highlightColor: color })}
                                                                    />
                                                                    <div className="flex gap-1 mt-2">
                                                                        {['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'].map(c => (
                                                                            <button
                                                                                key={c}
                                                                                onClick={() => updateTransition(transition.id, { highlightColor: c })}
                                                                                className="w-6 h-6 rounded border border-white/30 hover:scale-110 transition-transform"
                                                                                style={{ backgroundColor: c }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => setOpenColorPicker(null)}
                                                                        className="w-full mt-2 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs text-gray-300 transition-colors"
                                                                    >
                                                                        Fechar
                                                                    </button>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Seção: Opções Visuais */}
                        <div className="mb-6">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Settings size={14} className="text-[#DEB066]" />
                                Opções Visuais
                            </h2>
                            <div className="space-y-3 bg-white/5 rounded-xl p-4 border border-white/5">
                                {/* Botão Inscrever-se */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Botão "Inscreva-se"</span>
                                    <button
                                        onClick={() => setVisualOptions(v => ({ ...v, showSubscribeButton: !v.showSubscribeButton }))}
                                        className={`transition-colors ${visualOptions.showSubscribeButton ? 'text-green-400' : 'text-gray-600'}`}
                                    >
                                        {visualOptions.showSubscribeButton ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                    </button>
                                </div>

                                {/* Ícone YouTube */}
                                <div className={`flex items-center justify-between ${!visualOptions.showSubscribeButton ? 'opacity-40' : ''}`}>
                                    <span className="text-sm text-gray-300">Ícone do YouTube</span>
                                    <button
                                        onClick={() => setVisualOptions(v => ({ ...v, showYouTubeIcon: !v.showYouTubeIcon }))}
                                        disabled={!visualOptions.showSubscribeButton}
                                        className={`transition-colors ${visualOptions.showYouTubeIcon ? 'text-green-400' : 'text-gray-600'} disabled:cursor-not-allowed`}
                                    >
                                        {visualOptions.showYouTubeIcon ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                    </button>
                                </div>

                                {/* Tamanho da Fonte */}
                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">Tamanho da Fonte</label>
                                    <div className="flex gap-2">
                                        {(['small', 'medium', 'large'] as const).map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setVisualOptions(v => ({ ...v, fontSize: size }))}
                                                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${visualOptions.fontSize === size
                                                    ? 'bg-[#DEB066] text-black'
                                                    : 'bg-black/40 text-gray-400 hover:bg-black/60'
                                                    }`}
                                            >
                                                {size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Delay entre Transições */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm text-gray-300">Delay entre CTAs</label>
                                        <span className="text-xs text-[#DEB066] font-medium">{visualOptions.transitionDelay}s</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="2"
                                        max="30"
                                        step="1"
                                        value={visualOptions.transitionDelay}
                                        onChange={(e) => setVisualOptions(v => ({ ...v, transitionDelay: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#DEB066]"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                        <span>2s</span>
                                        <span>30s</span>
                                    </div>
                                </div>

                                {/* Delay para Instagram aparecer */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm text-gray-300">Delay do Instagram</label>
                                        <span className="text-xs text-[#DEB066] font-medium">{visualOptions.instagramDelay}s</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="120"
                                        step="1"
                                        value={visualOptions.instagramDelay}
                                        onChange={(e) => setVisualOptions(v => ({ ...v, instagramDelay: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#DEB066]"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                        <span>5s</span>
                                        <span>2min</span>
                                    </div>
                                </div>

                                {/* Duração do Instagram */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm text-gray-300">Duração do Instagram</label>
                                        <span className="text-xs text-[#DEB066] font-medium">{visualOptions.instagramDuration}s</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="120"
                                        step="1"
                                        value={visualOptions.instagramDuration}
                                        onChange={(e) => setVisualOptions(v => ({ ...v, instagramDuration: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#DEB066]"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                        <span>5s</span>
                                        <span>2min</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botão Gerar */}
                        <button
                            onClick={handleGenerate}
                            className="w-full py-3.5 bg-gradient-to-r from-[#9A1207] to-[#DEB066] rounded-xl font-bold text-white shadow-lg hover:shadow-orange-900/30 hover:scale-[1.01] active:scale-[0.99] transition-all mb-6"
                        >
                            Gerar Link do Overlay
                        </button>

                        {/* URL Gerada */}
                        <AnimatePresence>
                            {generatedUrl && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Check size={16} className="text-green-400" />
                                        <span className="text-sm font-medium text-green-400">URL Gerada</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <code className="flex-1 bg-black/40 rounded px-2 py-1.5 text-xs text-green-300 truncate">
                                            {generatedUrl}
                                        </code>
                                        <button
                                            onClick={handleCopy}
                                            className={`px-3 py-1.5 rounded font-medium text-xs transition-all ${copied ? 'bg-green-500 text-black' : 'bg-[#DEB066] text-black hover:bg-[#E8C547]'}`}
                                        >
                                            {copied ? 'Copiado!' : 'Copiar'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Instruções OBS */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h3 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
                                <Info size={12} /> Como usar no OBS
                            </h3>
                            <ol className="text-xs text-gray-500 space-y-1.5">
                                <li>1. Adicione <strong className="text-gray-300">Browser Source</strong></li>
                                <li>2. Cole a URL gerada</li>
                                <li>3. Largura: <strong className="text-[#DEB066]">500</strong> Altura: <strong className="text-[#DEB066]">200</strong></li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Coluna Direita - Preview (fixo) */}
                <div className="flex-1 flex flex-col bg-[#0a0a0a]">
                    {/* Header do Preview */}
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0d0d0d]">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Live Preview</span>
                        </div>
                        <a
                            href={generatedUrl || '#'}
                            target="_blank"
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                        >
                            <ExternalLink size={12} /> Abrir em nova aba
                        </a>
                    </div>

                    {/* Área do Preview */}
                    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                        {/* Pattern de fundo simulando transparência */}
                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }}></div>

                        {/* Overlay centralizado com espaço para expansão */}
                        <div className="relative" style={{ marginLeft: 200 }}>
                            <OverlayPreview
                                goal={parseInt(goal) || 5000}
                                instagramHandle={instagramHandle}
                                transitions={transitions}
                                visualOptions={visualOptions}
                                isDemo={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MetaConfigPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-[#DEB066]">Carregando...</div>}>
            <ConfigContent />
        </Suspense>
    );
}
