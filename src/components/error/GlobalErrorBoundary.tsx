import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    
    // In a production app, you would send this to your error tracking service
    // Example: Sentry.captureException(error);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            
            <p className="text-gray-600 mb-6">
              We're sorry, but an unexpected error has occurred. Our team has been notified.
            </p>
            
            {this.state.error && (
              <div className="mb-6 text-left">
                <details className="bg-gray-50 p-4 rounded-md text-sm">
                  <summary className="font-medium cursor-pointer">Error details</summary>
                  <p className="mt-2 text-red-600 overflow-auto">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-xs text-gray-700 overflow-auto p-2 bg-gray-100 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
              
              <Link to="/">
                <Button 
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
