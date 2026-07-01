'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Check, ExternalLink, Plus, Trash2, Settings, Image as ImageIcon,
  QrCode, FileText, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Eye
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { QRCodeOverlay, DEFAULT_QRCODE_CONFIG } from '@/features/overlay/components/QRCodeOverlay';
import type { QRSlide, QROverlayConfig } from '@/features/overlay/components/QRCodeOverlay';

let slideIdCounter = 2;
function generateSlideId() {
  return `slide-${slideIdCounter++}`;
}

export default function QRCodeOverlayPage() {
  const [config, setConfig] = useState<QROverlayConfig>(DEFAULT_QRCODE_CONFIG);
  const [expandedSlide, setExpandedSlide] = useState<string | null>(config.slides[0]?.id || null);
  const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const updateSlide = useCallback((slideId: string, updates: Partial<QRSlide>) => {
    setConfig(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === slideId ? { ...s, ...updates } : s),
    }));
  }, []);

  const addSlide = useCallback(() => {
    const newSlide: QRSlide = {
      id: generateSlideId(),
      type: 'qrcode',
      qrLink: '',
      photoUrl: '',
      logoUrl: '',
      headerText: '',
      showDisclaimer: config.globalDisclaimerEnabled,
      disclaimerText: '',
      bgColor: '#1a1040',
      borderColor: '#DEB066',
      textColor: '#ffffff',
      duration: 8,
    };
    setConfig(prev => ({ ...prev, slides: [...prev.slides, newSlide] }));
    setExpandedSlide(newSlide.id);
  }, [config.globalDisclaimerEnabled]);

  const removeSlide = useCallback((slideId: string) => {
    setConfig(prev => ({
      ...prev,
      slides: prev.slides.filter(s => s.id !== slideId),
    }));
  }, []);

  const moveSlide = useCallback((slideId: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      const idx = prev.slides.findIndex(s => s.id === slideId);
      if (idx < 0) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.slides.length) return prev;
      const newSlides = [...prev.slides];
      [newSlides[idx], newSlides[newIdx]] = [newSlides[newIdx], newSlides[idx]];
      return { ...prev, slides: newSlides };
    });
  }, []);

  const handleGenerate = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const encodedConfig = encodeURIComponent(JSON.stringify(config));
    const url = `${baseUrl}/overlay/qrcode/render?config=${encodedConfig}`;
    setGeneratedUrl(url);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
    } catch {
      // Fallback for non-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = generatedUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] text-white font-sans">
      <div className="flex h-screen">

        {/* Left Column - Settings */}
        <div className="w-[520px] flex-shrink-0 border-r border-white/10 overflow-y-auto bg-[#0d0d0d]">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <QrCode size={28} className="text-[#DEB066]" />
                <h1 className="text-3xl font-black bg-gradient-to-r from-[#DEB066] to-[#E8C547] bg-clip-text text-transparent">
                  QRCODE OVERLAY
                </h1>
              </div>
              <p className="text-gray-500 text-sm">Crie overlays animados com QR Codes, fotos e logos</p>
            </div>

            {/* Global Settings */}
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Settings size={14} className="text-[#DEB066]" />
                Configurações Gerais
              </h2>
              <div className="space-y-4 bg-white/5 rounded-xl p-4 border border-white/5">
                {/* Dimensions */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Largura</label>
                    <input
                      type="number"
                      value={config.width}
                      onChange={e => setConfig(prev => ({ ...prev, width: parseInt(e.target.value) || 320 }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DEB066] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Altura</label>
                    <input
                      type="number"
                      value={config.height}
                      onChange={e => setConfig(prev => ({ ...prev, height: parseInt(e.target.value) || 380 }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DEB066] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Borda (px)</label>
                    <input
                      type="number"
                      value={config.borderRadius}
                      onChange={e => setConfig(prev => ({ ...prev, borderRadius: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DEB066] transition-all"
                    />
                  </div>
                </div>

                {/* Animation Style */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Animação de Transição</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['fade', 'slide', 'scale', 'flip'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => setConfig(prev => ({ ...prev, animationStyle: style }))}
                        className={`py-2 rounded-lg text-xs font-medium transition-all capitalize ${config.animationStyle === style
                          ? 'bg-[#DEB066] text-black'
                          : 'bg-black/40 text-gray-400 hover:bg-black/60'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Global Disclaimer */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Disclaimer Global (18+)</span>
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, globalDisclaimerEnabled: !prev.globalDisclaimerEnabled }))}
                      className={`transition-colors ${config.globalDisclaimerEnabled ? 'text-green-400' : 'text-gray-600'}`}
                    >
                      {config.globalDisclaimerEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </div>
                  {config.globalDisclaimerEnabled && (
                    <textarea
                      value={config.globalDisclaimer}
                      onChange={e => setConfig(prev => ({ ...prev, globalDisclaimer: e.target.value }))}
                      placeholder="PROIBIDO PARA MENORES DE 18 ANOS..."
                      rows={2}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DEB066] transition-all resize-none"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Slides */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={14} className="text-[#DEB066]" />
                  Telas ({config.slides.length})
                </h2>
                <button
                  onClick={addSlide}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DEB066] text-black rounded-lg text-xs font-bold hover:bg-[#E8C547] transition-all"
                >
                  <Plus size={14} /> Nova Tela
                </button>
              </div>

              <div className="space-y-3">
                {config.slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                  >
                    {/* Slide Header */}
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedSlide(expandedSlide === slide.id ? null : slide.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#DEB066]/20 text-[#DEB066] text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">
                          {slide.headerText || `Tela ${index + 1}`}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400 uppercase font-bold">
                          {slide.type === 'qrcode' ? 'QR' : slide.type === 'photo' ? 'Foto' : 'QR + Foto'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); moveSlide(slide.id, 'up'); }}
                          className="p-1 text-gray-500 hover:text-white transition-colors"
                          disabled={index === 0}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); moveSlide(slide.id, 'down'); }}
                          className="p-1 text-gray-500 hover:text-white transition-colors"
                          disabled={index === config.slides.length - 1}
                        >
                          <ChevronDown size={14} />
                        </button>
                        {config.slides.length > 1 && (
                          <button
                            onClick={e => { e.stopPropagation(); removeSlide(slide.id); }}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors ml-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Slide Body */}
                    <AnimatePresence>
                      {expandedSlide === slide.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                            {/* Type */}
                            <div>
                              <label className="text-xs text-gray-400 mb-2 block font-medium">Tipo da Tela</label>
                              <div className="grid grid-cols-3 gap-2">
                                {([
                                  { value: 'qrcode', label: 'QR Code', icon: <QrCode size={14} /> },
                                  { value: 'photo', label: 'Foto', icon: <ImageIcon size={14} /> },
                                  { value: 'qrcode_photo', label: 'QR + Foto', icon: <Eye size={14} /> },
                                ] as const).map(t => (
                                  <button
                                    key={t.value}
                                    onClick={() => updateSlide(slide.id, { type: t.value })}
                                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${slide.type === t.value
                                      ? 'bg-[#DEB066] text-black'
                                      : 'bg-black/40 text-gray-400 hover:bg-black/60'
                                    }`}
                                  >
                                    {t.icon} {t.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Header (Texto + Imagem) */}
                            <div>
                              <label className="text-xs text-gray-400 mb-2 block font-medium">Header</label>
                              <div className="space-y-3 bg-black/30 rounded-lg p-3 border border-white/5">
                                <div>
                                  <label className="text-[10px] text-gray-500 mb-1 block">Texto</label>
                                  <input
                                    type="text"
                                    value={slide.headerText || ''}
                                    onChange={e => updateSlide(slide.id, { headerText: e.target.value })}
                                    placeholder="Ex: ESCANEIE AQUI"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DEB066] transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-500 mb-1 block">Imagem / Logo</label>
                                  <input
                                    type="text"
                                    value={slide.logoUrl || ''}
                                    onChange={e => updateSlide(slide.id, { logoUrl: e.target.value })}
                                    placeholder="/logo-empresa.png ou https://..."
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DEB066] transition-all"
                                  />
                                  {slide.logoUrl && (
                                    <div className="mt-2 flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-white/5">
                                      <img
                                        src={slide.logoUrl}
                                        alt="Preview"
                                        className="w-auto object-contain rounded"
                                        style={{ height: slide.logoSize || 40 }}
                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                      />
                                      <span className="text-[10px] text-gray-500 truncate flex-1">{slide.logoUrl}</span>
                                      <button
                                        onClick={() => updateSlide(slide.id, { logoUrl: '' })}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-0.5"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  )}
                                  {slide.logoUrl && (
                                    <div className="mt-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <label className="text-[10px] text-gray-500">Tamanho do Logo</label>
                                        <span className="text-[10px] text-[#DEB066] font-medium">{slide.logoSize || 40}px</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="20"
                                        max="120"
                                        value={slide.logoSize || 40}
                                        onChange={e => updateSlide(slide.id, { logoSize: parseInt(e.target.value) })}
                                        className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#DEB066]"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* QR Link */}
                            {(slide.type === 'qrcode' || slide.type === 'qrcode_photo') && (
                              <div>
                                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Link para QR Code</label>
                                <input
                                  type="url"
                                  value={slide.qrLink || ''}
                                  onChange={e => updateSlide(slide.id, { qrLink: e.target.value })}
                                  placeholder="https://..."
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DEB066] transition-all"
                                />
                              </div>
                            )}

                            {/* Photo URL */}
                            {(slide.type === 'photo' || slide.type === 'qrcode_photo') && (
                              <div>
                                <label className="text-xs text-gray-400 mb-1.5 block font-medium">URL da Foto</label>
                                <input
                                  type="text"
                                  value={slide.photoUrl || ''}
                                  onChange={e => updateSlide(slide.id, { photoUrl: e.target.value })}
                                  placeholder="/minha-foto.png ou https://..."
                                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DEB066] transition-all"
                                />
                              </div>
                            )}

                            {/* Colors */}
                            <div>
                              <label className="text-xs text-gray-400 mb-2 block font-medium">Cores</label>
                              <div className="grid grid-cols-3 gap-3">
                                {[
                                  { key: 'bgColor', label: 'Fundo' },
                                  { key: 'borderColor', label: 'Borda' },
                                  { key: 'textColor', label: 'Texto' },
                                ].map(colorField => (
                                  <div key={colorField.key} className="relative">
                                    <span className="text-[10px] text-gray-500 block mb-1">{colorField.label}</span>
                                    <button
                                      onClick={() => setOpenColorPicker(
                                        openColorPicker === `${slide.id}-${colorField.key}` ? null : `${slide.id}-${colorField.key}`
                                      )}
                                      className="w-full h-8 rounded-lg border-2 border-white/20 cursor-pointer hover:scale-105 transition-transform"
                                      style={{ backgroundColor: (slide as any)[colorField.key] }}
                                    />
                                    {openColorPicker === `${slide.id}-${colorField.key}` && (
                                      <div className="absolute bottom-full left-0 mb-2 z-50 bg-[#1a1a1a] p-3 rounded-xl border border-white/20 shadow-2xl">
                                        <HexColorPicker
                                          color={(slide as any)[colorField.key]}
                                          onChange={color => updateSlide(slide.id, { [colorField.key]: color })}
                                        />
                                        <div className="flex gap-1 mt-2">
                                          {['#1a1040', '#0a0a2e', '#1a0000', '#0d1117', '#DEB066', '#FFD700', '#ffffff'].map(c => (
                                            <button
                                              key={c}
                                              onClick={() => updateSlide(slide.id, { [colorField.key]: c })}
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
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Duration */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs text-gray-400 font-medium">Duração</label>
                                <span className="text-xs text-[#DEB066] font-medium">{slide.duration}s</span>
                              </div>
                              <input
                                type="range"
                                min="3"
                                max="30"
                                value={slide.duration}
                                onChange={e => updateSlide(slide.id, { duration: parseInt(e.target.value) })}
                                className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#DEB066]"
                              />
                            </div>

                            {/* Per-slide Disclaimer */}
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400 font-medium">Disclaimer nesta tela</span>
                                <button
                                  onClick={() => updateSlide(slide.id, { showDisclaimer: !slide.showDisclaimer })}
                                  className={`transition-colors ${slide.showDisclaimer ? 'text-green-400' : 'text-gray-600'}`}
                                >
                                  {slide.showDisclaimer ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                </button>
                              </div>
                              {slide.showDisclaimer && (
                                <input
                                  type="text"
                                  value={slide.disclaimerText || ''}
                                  onChange={e => updateSlide(slide.id, { disclaimerText: e.target.value })}
                                  placeholder="Deixe vazio para usar o disclaimer global"
                                  className="w-full mt-2 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#DEB066] transition-all"
                                />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              className="w-full py-3.5 bg-gradient-to-r from-[#9A1207] to-[#DEB066] rounded-xl font-bold text-white shadow-lg hover:shadow-orange-900/30 hover:scale-[1.01] active:scale-[0.99] transition-all mb-6"
            >
              Gerar Link do Overlay
            </button>

            {/* Generated URL */}
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

            {/* OBS Instructions */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <h3 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Settings size={12} /> Como usar no OBS
              </h3>
              <ol className="text-xs text-gray-500 space-y-1.5">
                <li>1. Adicione <strong className="text-gray-300">Browser Source</strong></li>
                <li>2. Cole a URL gerada</li>
                <li>3. Largura: <strong className="text-[#DEB066]">{config.width}</strong> Altura: <strong className="text-[#DEB066]">{config.height}</strong></li>
                <li>4. As telas vão rotacionar automaticamente</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
          {/* Preview Header */}
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

          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Transparency grid */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}></div>

            <div className="relative">
              <QRCodeOverlay config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
