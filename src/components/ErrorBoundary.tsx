import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);

    // In production, don't show any error messages
    if (import.meta.env.DEV) {
      // Show a toast notification only in development
      toast.error('An error occurred', {
        description: 'Something went wrong. Please try again or contact support if the problem persists.',
        action: {
          label: 'Refresh',
          onClick: () => window.location.reload(),
        },
      });
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // In production, don't show any error UI, just render children or null
      if (import.meta.env.PROD) {
        // Try to render children even if there's an error
        try {
          return this.props.children;
        } catch (e) {
          // If that fails, render nothing
          return null;
        }
      }

      // In development, show the error UI
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            We're sorry, but an error occurred while rendering this component.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Refresh the page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
