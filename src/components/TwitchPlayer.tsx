'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Play, Tv } from 'lucide-react';

interface TwitchPlayerProps {
  channel: string;
}

const TwitchPlayer = ({ channel }: TwitchPlayerProps) => {
  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-black relative">
      <iframe
        src={`https://www.twitch.tv/embed/${channel}?parent=localhost&parent=127.0.0.1`}
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