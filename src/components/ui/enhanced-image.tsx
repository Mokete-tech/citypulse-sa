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
}

/**
 * Enhanced Image component with error handling, fallbacks, and loading states
 */
export function EnhancedImage({
  src,
  alt = '',
  fallbackSrc = '/images/placeholder.jpg',
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
  ...props
}: EnhancedImageProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  // Handle image load error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    // Try to use fallback if available
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
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
          placeholderClassName
        )}>
          {placeholderIcon || <ImageIcon className="h-12 w-12 text-muted-foreground/50" />}
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
