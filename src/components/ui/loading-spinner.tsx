import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'circle';
}

export function LoadingSpinner({
  className,
  size = 'md',
  variant = 'default'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  if (variant === 'circle') {
    return (
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-current border-t-transparent',
          {
            'border-2': size === 'sm' || size === 'md',
            'border-3': size === 'lg',
            'border-4': size === 'xl',
          },
          sizeClasses[size],
          className
        )}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <svg
      className={cn(
        'animate-spin',
        sizeClasses[size],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
