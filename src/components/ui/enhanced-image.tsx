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

    // If we've exhausted retries or retries are disabled, use the fallback
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      // Use type-specific fallback if available
      let typedFallback = fallbackSrc;
      if (imageType === 'deal' && !fallbackSrc.includes('deal')) {
        typedFallback = '/images/placeholder-deal.svg';
      } else if (imageType === 'event' && !fallbackSrc.includes('event')) {
        typedFallback = '/images/placeholder-event.svg';
      }

      setImgSrc(typedFallback);
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
