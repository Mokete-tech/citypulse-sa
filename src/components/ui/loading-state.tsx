import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  type?: 'card' | 'list' | 'text' | 'spinner' | 'grid' | 'custom';
  count?: number;
  className?: string;
  children?: React.ReactNode;
  isLoading: boolean;
  fallback?: React.ReactNode;
  delay?: number; // Delay in ms before showing loading state
}

export function LoadingState({
  type = 'card',
  count = 3,
  className,
  children,
  isLoading,
  fallback,
  delay = 0,
}: LoadingStateProps) {
  const [showLoading, setShowLoading] = React.useState(delay === 0);

  React.useEffect(() => {
    if (isLoading && delay > 0) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, delay);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isLoading, delay]);

  // If not loading or delay hasn't elapsed yet, show children
  if (!isLoading || (delay > 0 && !showLoading)) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Generate an array of the specified count
  const items = Array.from({ length: count }, (_, i) => i);

  switch (type) {
    case 'spinner':
      return (
        <div className={cn('flex justify-center items-center py-8', className)}>
          <LoadingSpinner size="lg" className="text-primary" />
        </div>
      );

    case 'card':
      return (
        <div className={cn('space-y-4', className)}>
          {items.map((i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse-slow">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'grid':
      return (
        <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
          {items.map((i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse-slow">
              <Skeleton className="h-40 w-full mb-4 rounded-md" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className={cn('space-y-2', className)}>
          {items.map((i) => (
            <div key={i} className="flex items-center space-x-4 py-2 animate-pulse-slow">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'text':
      return (
        <div className={cn('space-y-2', className)}>
          {items.map((i) => (
            <Skeleton key={i} className="h-4 w-full animate-pulse-slow" />
          ))}
        </div>
      );

    case 'custom':
      return <div className={className}>{children}</div>;

    default:
      return null;
  }
}
