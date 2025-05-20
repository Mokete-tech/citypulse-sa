
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  aspectRatio?: 'square' | '16/9' | '4/3' | '21/9';
  objectFit?: 'cover' | 'contain' | 'fill';
}

export function ResponsiveImage({
  src,
  alt,
  fallbackSrc = '/images/placeholders/general-placeholder.svg',
  className,
  aspectRatio = '16/9',
  objectFit = 'cover',
  ...props
}: ResponsiveImageProps) {
  const [imgSrc, setImgSrc] = React.useState<string>(src);
  const [hasError, setHasError] = React.useState<boolean>(false);

  React.useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  const aspectRatioClass = {
    'square': 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3',
    '21/9': 'aspect-[21/9]',
  }[aspectRatio];

  const objectFitClass = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
  }[objectFit];

  return (
    <div className={cn("overflow-hidden", aspectRatioClass, className)}>
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          "w-full h-full transition-all duration-300",
          objectFitClass
        )}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    </div>
  );
}

export default ResponsiveImage;
