import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  type?: 'card' | 'list' | 'text' | 'custom';
  count?: number;
  className?: string;
  children?: React.ReactNode;
  isLoading: boolean;
}

export function LoadingState({
  type = 'card',
  count = 3,
  className,
  children,
  isLoading,
}: LoadingStateProps) {
  // If not loading, render children
  if (!isLoading) {
    return <div className={className}>{children}</div>;
  }

  // Generate an array of the specified count
  const items = Array.from({ length: count }, (_, i) => i);

  switch (type) {
    case 'card':
      return (
        <div className={cn('space-y-4', className)}>
          {items.map((i) => (
            <div key={i} className="rounded-lg border p-4">
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

    case 'list':
      return (
        <div className={cn('space-y-2', className)}>
          {items.map((i) => (
            <div key={i} className="flex items-center space-x-4 py-2">
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
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      );

    case 'custom':
      return <div className={className}>{children}</div>;

    default:
      return null;
  }
}
