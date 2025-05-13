import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showErrorInProduction?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info
    this.setState({ errorInfo });

    // Log the error to console
    if (import.meta.env.DEV) {
      console.error('Uncaught error:', error, errorInfo);
    } else {
      // In production, log with less detail
      console.error('Uncaught error:', error.message);
    }

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Show a toast notification in development or if explicitly allowed in production
    if (import.meta.env.DEV || this.props.showErrorInProduction) {
      toast.error('An error occurred', {
        description: 'Something went wrong. Please try again or contact support if the problem persists.',
        action: {
          label: 'Refresh',
          onClick: () => this.handleRetry(),
        },
      });
    }
  }

  private handleRetry = (): void => {
    this.setState(prevState => ({
      hasError: false,
      retryCount: prevState.retryCount + 1,
    }));
  };

  public render(): ReactNode {
    const { hasError, retryCount } = this.state;

    if (hasError) {
      // In production, use a minimal error UI or try to recover
      if (import.meta.env.PROD && !this.props.showErrorInProduction) {
        // If we've tried to recover multiple times, show a minimal error UI
        if (retryCount > 2) {
          return (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">
                Something went wrong. Please try refreshing the page.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          );
        }

        // Try to render children even if there's an error
        try {
          return this.props.children;
        } catch (e) {
          // If that fails, show minimal error UI
          return (
            <div className="p-4 text-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          );
        }
      }

      // In development or if showErrorInProduction is true, show the detailed error UI
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            We're sorry, but an error occurred while rendering this component.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <div className="mb-4 p-4 bg-destructive/10 rounded-md text-left w-full max-w-xl overflow-auto">
              <p className="font-mono text-sm mb-2">{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <pre className="text-xs overflow-auto max-h-[200px]">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={this.handleRetry}
              variant="default"
            >
              Try again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Refresh the page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
