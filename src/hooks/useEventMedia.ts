import { useState, useEffect } from 'react';

interface MediaFile {
  name: string;
  path: string;
  type: 'image' | 'video';
  extension: string;
  size?: number;
  lastModified?: Date;
}

interface Event {
  id: string;
  folderName: string;
}

export const useEventMedia = (event: Event | undefined, isOpen: boolean) => {
  const [photos, setPhotos] = useState<MediaFile[]>([]);
  const [videos, setVideos] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event || !isOpen || !event.folderName) {
      setPhotos([]);
      setVideos([]);
      setLoading(false);
      return;
    }

    const loadMedia = async () => {
      setLoading(true);
      
      try {
        // Use the API route to get real files
        const response = await fetch(`/api/media/${encodeURIComponent(event.folderName)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch media: ${response.status}`);
        }

        const data = await response.json();
        setPhotos(data.photos || []);
        setVideos(data.videos || []);
        
      } catch (error) {
        console.error('Error loading media:', error);
        // Fallback to empty arrays if API fails
        setPhotos([]);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [event, isOpen]);

  return { photos, videos, loading };
}; 