'use client';

interface TwitchPlayerProps {
  channel: string;
}

const TwitchPlayer = ({ channel }: TwitchPlayerProps) => {
  const getParentDomains = () => {
    if (typeof window !== 'undefined') {
      return `&parent=${window.location.hostname}`;
    }
    return '&parent=localhost&parent=127.0.0.1&parent=leoveio-streamer-site.vercel.app';
  };

  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-black relative">
      <iframe
        src={`https://www.twitch.tv/embed/${channel}?${getParentDomains()}`}
        height="100%"
        width="100%"
        className="rounded-xl"
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
        title={`${channel} Twitch Stream`}
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};

export default TwitchPlayer; 