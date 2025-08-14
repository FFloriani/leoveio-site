'use client';

interface VideoSkeletonProps {
  count?: number;
}

export const VideoSkeleton = ({ count = 6 }: VideoSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Thumbnail skeleton */}
          <div className="aspect-video bg-white/10 rounded-lg mb-2" />
          
          {/* Title skeleton */}
          <div className="space-y-1">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-3/4" />
          </div>
          
          {/* Meta info skeleton */}
          <div className="flex items-center justify-between mt-2">
            <div className="h-2 bg-white/10 rounded w-16" />
            <div className="h-2 bg-white/10 rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}; 