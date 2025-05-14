import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Loader2, Film } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';

interface EnhancedVideoProps {
  src: string;
  poster?: string;
  fallbackSrc?: string;
  aspectRatio?: 'auto' | 'square' | 'video' | '4/3' | '3/2' | '16/9' | '21/9';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  containerClassName?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  showCustomControls?: boolean;
  onError?: () => void;
  retryOnError?: boolean;
  maxRetries?: number;
  shimmer?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
}

export function EnhancedVideo({
  src,
  poster,
  fallbackSrc = '/images/placeholder-video.svg',
  aspectRatio = 'video',
  objectFit = 'cover',
  containerClassName,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  showCustomControls = true,
  onError,
  retryOnError = true,
  maxRetries = 2,
  shimmer = true,
  preload = 'metadata',
}: EnhancedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset states when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    setProgress(0);
    setDuration(0);
  }, [src]);

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    setIsLoading(false);
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle video load error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);

    // Try to retry loading the video if retries are enabled and we haven't exceeded max retries
    if (retryOnError && retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);

      // Add a cache-busting parameter to force a fresh request
      const cacheBuster = `?cb=${Date.now()}-${retryCount + 1}`;
      const srcWithCacheBuster = src + cacheBuster;

      // Retry after a short delay
      setTimeout(() => {
        setIsLoading(true);
        setHasError(false);
        if (videoRef.current) {
          videoRef.current.src = srcWithCacheBuster;
          videoRef.current.load();
        }
      }, 1000);

      return;
    }

    onError?.();
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle progress bar change
  const handleProgressChange = (value: number[]) => {
    if (videoRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  // Show controls on hover and hide after timeout
  const handleMouseEnter = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Determine aspect ratio class
  const aspectRatioClass = {
    'auto': '',
    'square': 'aspect-square',
    'video': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    '16/9': 'aspect-[16/9]',
    '21/9': 'aspect-[21/9]',
  }[aspectRatio];

  // Determine object fit class
  const objectFitClass = {
    'contain': 'object-contain',
    'cover': 'object-cover',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down',
  }[objectFit];

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-muted group',
        aspectRatioClass,
        containerClassName
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Show placeholder while loading or on error */}
      {(isLoading || hasError) && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-muted z-10',
          shimmer && 'animate-pulse'
        )}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-muted-foreground/50 animate-spin" />
              <p className="text-xs text-muted-foreground mt-2">Loading video...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Film className="h-12 w-12 text-muted-foreground/50" />
              {hasError && retryCount >= maxRetries && (
                <p className="text-xs text-muted-foreground mt-2">Video could not be loaded</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* The actual video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls && !showCustomControls}
        preload={preload}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className={cn(
          'w-full h-full transition-opacity duration-300',
          objectFitClass,
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
      />

      {/* Custom video controls */}
      {showCustomControls && !controls && (
        <div 
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300',
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none',
            'flex flex-col gap-2'
          )}
        >
          {/* Progress bar */}
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="cursor-pointer"
          />
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={togglePlay}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Duration */}
            <div className="text-xs text-white">
              {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      )}

      {/* Play button overlay for non-playing videos */}
      {!isPlaying && !isLoading && !hasError && !controls && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="bg-black/50 rounded-full p-4 transition-transform hover:scale-110">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format time in MM:SS format
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default EnhancedVideo;
