'use client';

import { useEffect, useState, useRef } from 'react';

interface TwitchPlayerProps {
  channel: string;
}

declare global {
  interface Window {
    Twitch?: {
      Embed: new (element: HTMLElement, options: TwitchEmbedOptions) => TwitchEmbedInstance;
    };
  }
}

interface TwitchEmbedOptions {
  width: string | number;
  height: string | number;
  channel: string;
  parent: string[];
  autoplay?: boolean;
  muted?: boolean;
  layout?: string;
  theme?: string;
  allowfullscreen?: boolean;
}

interface TwitchPlayer {
  setVolume?: (volume: number) => void;
  play?: () => void;
  pause?: () => void;
  setChannel?: (channel: string) => void;
}

interface TwitchEmbedInstance {
  // Métodos disponíveis na instância do embed
  getPlayer?: () => TwitchPlayer;
  addEventListener?: (event: string, callback: () => void) => void;
}

const TwitchPlayer = ({ channel }: TwitchPlayerProps) => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [useJSEmbed, setUseJSEmbed] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupEmbed = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // Debug: log do hostname atual
        console.log('Hostname detectado:', hostname);
        console.log('Canal:', channel);
        
        // Construir URL do embed com todos os parâmetros necessários
        const url = `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&enableExtensions=true&muted=false&parent=${encodeURIComponent(hostname)}&player=popout&quality=chunked&volume=1&autoplay=true`;
        
        console.log('URL do embed:', url);
        
        setEmbedUrl(url);
        setIsLoading(false);
      }
    };

    const loadTwitchJSAPI = () => {
      // Carregar a API JavaScript do Twitch como fallback
      if (!window.Twitch && !document.querySelector('script[src*="embed/v1.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://embed.twitch.tv/embed/v1.js';
        script.onload = () => {
          console.log('Twitch JS API carregada');
        };
        document.head.appendChild(script);
      }
    };

    setupEmbed();
    loadTwitchJSAPI();
  }, [channel]);

  const handleIframeError = () => {
    console.log('Iframe falhou, tentando JS API...');
    setUseJSEmbed(true);
  };

  useEffect(() => {
    if (useJSEmbed && window.Twitch && embedRef.current) {
      try {
        const hostname = window.location.hostname;
        console.log('Usando Twitch JS API com parent:', hostname);
        
        const embed = new window.Twitch.Embed(embedRef.current, {
          width: '100%',
          height: '100%',
          channel: channel,
          parent: [hostname],
          autoplay: true,
          muted: false,
          layout: 'video-with-chat',
          theme: 'dark',
          allowfullscreen: true
        });

        console.log('Twitch JS Embed criado:', embed);
        setError('');
      } catch (err) {
        console.error('Erro ao criar JS embed:', err);
        setError('Erro ao carregar stream do Twitch');
      }
    }
  }, [useJSEmbed, channel]);

  if (isLoading) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden bg-black relative flex items-center justify-center">
        <div className="text-white">Carregando player do Twitch...</div>
      </div>
    );
  }

  if (error && !useJSEmbed) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden bg-black relative flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-black relative">
      {useJSEmbed ? (
        <div 
          ref={embedRef}
          className="w-full h-full rounded-xl"
          style={{ minWidth: '400px', minHeight: '300px' }}
        />
      ) : (
        <iframe
          src={embedUrl}
          height="100%"
          width="100%"
          className="rounded-xl"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          title={`${channel} Twitch Stream`}
          frameBorder="0"
          scrolling="no"
          style={{ 
            border: 'none', 
            minWidth: '400px', 
            minHeight: '300px',
            width: '100%',
            height: '100%'
          }}
          onLoad={() => console.log('Iframe carregado com sucesso')}
          onError={handleIframeError}
        />
      )}
      
      {/* Fallback manual para testar */}
      {error && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => {
              console.log('Tentando JS API manualmente...');
              setUseJSEmbed(true);
              setError('');
            }}
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
          >
            Tentar JS API
          </button>
        </div>
      )}
    </div>
  );
};

export default TwitchPlayer; 