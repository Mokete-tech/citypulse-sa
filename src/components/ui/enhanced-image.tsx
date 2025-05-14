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
    // Check if src is valid before setting it
    if (src && typeof src === 'string' && src.trim() !== '') {
      setImgSrc(src);
      setIsLoading(true);
      setHasError(false);
      setRetryCount(0);
    } else {
      // If src is invalid, immediately use fallback
      setHasError(true);
      setIsLoading(false);
    }

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

    // If we've exhausted retries or retries are disabled, use a default fallback based on image type
    // These are embedded data URIs that will always work regardless of file system
    const defaultFallbacks = {
      deal: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23f0f4f8%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23a0aec0%22%20stroke-width%3D%222%22%3E%3Crect%20x%3D%22150%22%20y%3D%22100%22%20width%3D%22500%22%20height%3D%22250%22%20rx%3D%228%22%20stroke-dasharray%3D%228%204%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3EDeal%20Image%3C%2Ftext%3E%3Cg%20transform%3D%22translate%28350%2C%20260%29%22%3E%3Cpath%20d%3D%22M50%2C0%20L100%2C50%20L50%2C100%20L0%2C50%20Z%22%20fill%3D%22%233b82f6%22%20fill-opacity%3D%220.2%22%20stroke%3D%22%233b82f6%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2255%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%233b82f6%22%20text-anchor%3D%22middle%22%3E50%25%20OFF%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fsvg%3E',

      event: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23f0f4f8%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23a0aec0%22%20stroke-width%3D%222%22%3E%3Crect%20x%3D%22150%22%20y%3D%22100%22%20width%3D%22500%22%20height%3D%22250%22%20rx%3D%228%22%20stroke-dasharray%3D%228%204%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3EEvent%20Image%3C%2Ftext%3E%3Cg%20transform%3D%22translate%28350%2C%20260%29%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2240%22%20fill%3D%22%238b5cf6%22%20fill-opacity%3D%220.2%22%20stroke%3D%22%238b5cf6%22%20stroke-width%3D%222%22%2F%3E%3Cpath%20d%3D%22M50%2C25%20L55%2C45%20L75%2C45%20L60%2C55%20L65%2C75%20L50%2C65%20L35%2C75%20L40%2C55%20L25%2C45%20L45%2C45%20Z%22%20fill%3D%22%238b5cf6%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E',

      general: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23f0f4f8%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23a0aec0%22%20stroke-width%3D%222%22%3E%3Crect%20x%3D%22150%22%20y%3D%22100%22%20width%3D%22500%22%20height%3D%22250%22%20rx%3D%228%22%20stroke-dasharray%3D%228%204%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3ECityPulse%3C%2Ftext%3E%3Cg%20transform%3D%22translate%28350%2C%20260%29%22%3E%3Crect%20x%3D%2225%22%20y%3D%2225%22%20width%3D%2250%22%20height%3D%2250%22%20rx%3D%224%22%20fill%3D%22%230ea5e9%22%20fill-opacity%3D%220.2%22%20stroke%3D%22%230ea5e9%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2255%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%230ea5e9%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3ECP%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fsvg%3E'
    };

    // Select the appropriate fallback based on image type
    const defaultFallback = defaultFallbacks[imageType];

    // Always use our embedded fallbacks to ensure images always display
    if (imgSrc !== defaultFallback) {
      console.log(`Using fallback image for ${imageType}`);
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
