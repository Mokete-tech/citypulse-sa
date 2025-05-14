import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface EnhancedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: 'auto' | 'square' | 'video' | '4/3' | '3/2' | '16/9' | '21/9';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  containerClassName?: string;
  showPlaceholder?: boolean;
  placeholderClassName?: string;
  placeholderIcon?: React.ReactNode;
  loadingStrategy?: 'eager' | 'lazy';
  onLoadingComplete?: () => void;
  onError?: () => void;
  retryOnError?: boolean;
  maxRetries?: number;
  shimmer?: boolean;
}

/**
 * Enhanced Image component with error handling, fallbacks, and loading states
 */
export function EnhancedImage({
  src,
  alt = '',
  fallbackSrc = '/images/placeholder.svg',
  aspectRatio = 'auto',
  objectFit = 'cover',
  className,
  containerClassName,
  showPlaceholder = true,
  placeholderClassName,
  placeholderIcon,
  loadingStrategy = 'lazy',
  onLoadingComplete,
  onError,
  retryOnError = true,
  maxRetries = 2,
  shimmer = true,
  ...props
}: EnhancedImageProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageType, setImageType] = useState<'deal' | 'event' | 'general'>('general');

  // Reset states when src changes
  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);

    // Determine image type based on src or fallbackSrc
    if (src?.includes('deal') || fallbackSrc?.includes('deal')) {
      setImageType('deal');
    } else if (src?.includes('event') || fallbackSrc?.includes('event')) {
      setImageType('event');
    } else {
      setImageType('general');
    }
  }, [src, fallbackSrc]);

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  // Handle image load error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);

    // Try to retry loading the image if retries are enabled and we haven't exceeded max retries
    if (retryOnError && retryCount < maxRetries && imgSrc === src) {
      setRetryCount(prev => prev + 1);

      // Add a cache-busting parameter to force a fresh request
      const cacheBuster = `?cb=${Date.now()}-${retryCount + 1}`;
      const srcWithCacheBuster = src + cacheBuster;

      // Retry after a short delay
      setTimeout(() => {
        setIsLoading(true);
        setHasError(false);
        setImgSrc(srcWithCacheBuster);
      }, 1000);

      return;
    }

    // If we've exhausted retries or retries are disabled, use a default fallback
    // This ensures we always have a fallback even if the specified one doesn't exist
    const defaultFallback = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23f0f4f8%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285%22%20y%3D%22225%22%3ECityPulse%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

    if (fallbackSrc && imgSrc !== fallbackSrc) {
      try {
        // Try to use the specified fallback
        setImgSrc(fallbackSrc);
      } catch (e) {
        // If that fails, use the default data URI fallback
        console.warn('Fallback image failed to load, using default fallback');
        setImgSrc(defaultFallback);
      }
    } else {
      // No fallback specified, use default
      setImgSrc(defaultFallback);
    }

    onError?.();
  };

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
    <div className={cn(
      'relative overflow-hidden bg-muted',
      aspectRatioClass,
      containerClassName
    )}>
      {/* Show placeholder while loading or on error */}
      {(isLoading || hasError) && showPlaceholder && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-muted',
          shimmer && 'animate-pulse',
          placeholderClassName
        )}>
          {placeholderIcon || (
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
              {hasError && retryCount >= maxRetries && (
                <p className="text-xs text-muted-foreground mt-2">Image could not be loaded</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* The actual image */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          loading={loadingStrategy}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-opacity duration-300',
            objectFitClass,
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}

export default EnhancedImage;
