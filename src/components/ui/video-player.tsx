import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader, AlertCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { EnhancedImage } from '@/components/ui/enhanced-image';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'square' | 'video' | '4/3' | '3/2' | '16/9' | '21/9';
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: () => void;
  onProgress?: (progress: number) => void;
  actionButton?: {
    text: string;
    url: string;
    className?: string;
  };
}

/**
 * Advanced Video Player component with custom controls and error handling
 */
export function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  className,
  containerClassName,
  aspectRatio = 'video',
  onPlay,
  onPause,
  onEnded,
  onError,
  onProgress,
  actionButton,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
      onProgress?.(currentProgress);
    };

    const handleVideoPlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handleVideoPause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleVideoEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleVideoError = () => {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);
    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('error', handleVideoError);

    // Clean up event listeners
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
      video.removeEventListener('ended', handleVideoEnded);
      video.removeEventListener('error', handleVideoError);
    };
  }, [onPlay, onPause, onEnded, onError, onProgress]);

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((error) => {
        console.error('Error playing video:', error);
        setHasError(true);
      });
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Handle seeking
  const handleSeek = (value: number[]) => {
    const newProgress = value[0];
    const video = videoRef.current;
    if (!video) return;

    const newTime = (newProgress / 100) * duration;
    video.currentTime = newTime;
    setProgress(newProgress);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((error) => {
        console.error('Error exiting fullscreen:', error);
      });
    } else {
      video.requestFullscreen().catch((error) => {
        console.error('Error entering fullscreen:', error);
      });
    }
  };

  // Show/hide controls on hover
  const handleMouseEnter = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    controlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Determine aspect ratio class
  const aspectRatioClass = {
    'square': 'aspect-square',
    'video': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    '16/9': 'aspect-[16/9]',
    '21/9': 'aspect-[21/9]',
  }[aspectRatio];

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-black rounded-md',
        aspectRatioClass,
        containerClassName
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className={cn(
          'w-full h-full object-contain',
          className
        )}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <h3 className="text-lg font-semibold mb-1">Video playback error</h3>
          <p className="text-sm text-center text-gray-300">
            There was a problem playing this video. Please try again later.
          </p>
        </div>
      )}

      {/* Video title */}
      {title && (
        <div className={cn(
          'absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent',
          showControls ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300'
        )}>
          <h3 className="text-white font-medium truncate">{title}</h3>
        </div>
      )}

      {/* Action button (e.g., "Learn More") */}
      {actionButton && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="default"
            size="sm"
            className={cn(
              'bg-primary hover:bg-primary/90 text-white font-medium',
              actionButton.className
            )}
            onClick={() => window.open(actionButton.url, '_blank')}
          >
            {actionButton.text}
          </Button>
        </div>
      )}

      {/* Custom controls */}
      {controls && (
        <div 
          className={cn(
            'absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent',
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0',
            'transition-opacity duration-300'
          )}
        >
          {/* Progress bar */}
          <div className="mb-2">
            <Slider
              value={[progress]}
              min={0}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="h-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Play/Pause button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              {/* Time display */}
              <div className="text-xs text-white">
                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Volume control */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-20 h-1"
                />
              </div>

              {/* Fullscreen button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Big play button in the center when paused */}
      {!isPlaying && !isLoading && !hasError && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={togglePlay}
        >
          <Play className="h-8 w-8" />
        </Button>
      )}
    </div>
  );
}

export default VideoPlayer;
