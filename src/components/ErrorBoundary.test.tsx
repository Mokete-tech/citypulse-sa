import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import ErrorBoundary from './ErrorBoundary';

// Create a component that throws an error
const ErrorComponent = () => {
  throw new Error('Test error');
};

// Mock console.error to prevent test output pollution
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
  
  it('renders fallback UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    // Check for error message in the fallback UI
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/We're sorry, but an error occurred/i)).toBeInTheDocument();
    
    // Check for refresh button
    expect(screen.getByRole('button', { name: /Refresh the page/i })).toBeInTheDocument();
  });
  
  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom error UI</div>}>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
  });
});
