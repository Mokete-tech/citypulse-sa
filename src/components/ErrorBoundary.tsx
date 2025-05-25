import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ hasError: true, error: this.getErrorMessage(error) });
  }

  handleRefresh = (): void => {
    window.location.reload();
  };

  getErrorMessage(error: Error): Error | null {
    if (error instanceof Error) return error;
    if (typeof error === 'string') return new Error(error);
    if (error && typeof error === 'object' && 'message' in error) {
      return new Error((error as { message?: string }).message || 'An unknown error occurred');
    }
    return null;
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Return custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md mt-10">
          <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-4">We're sorry, but an error occurred while rendering this component.</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={this.handleRefresh}
          >
            Refresh the page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorBoundary;
