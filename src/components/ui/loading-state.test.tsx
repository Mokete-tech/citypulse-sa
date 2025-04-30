import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { LoadingState } from './loading-state';

describe('LoadingState', () => {
  it('renders children when not loading', () => {
    render(
      <LoadingState isLoading={false}>
        <div data-testid="child-content">Content</div>
      </LoadingState>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
  
  it('renders skeleton loaders when loading', () => {
    render(
      <LoadingState isLoading={true} type="card" count={2}>
        <div data-testid="child-content">Content</div>
      </LoadingState>
    );
    
    // Child content should not be visible
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    
    // Skeletons should be visible
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
  
  it('renders the correct number of skeleton items', () => {
    const count = 3;
    render(<LoadingState isLoading={true} type="card" count={count} />);
    
    // There should be 'count' number of top-level skeleton containers
    const skeletonContainers = document.querySelectorAll('.rounded-lg.border.p-4');
    expect(skeletonContainers.length).toBe(count);
  });
  
  it('renders different skeleton types correctly', () => {
    // Test list type
    const { rerender } = render(<LoadingState isLoading={true} type="list" count={1} />);
    expect(document.querySelector('.flex.items-center.space-x-4')).toBeInTheDocument();
    
    // Test text type
    rerender(<LoadingState isLoading={true} type="text" count={1} />);
    expect(document.querySelector('.h-4.w-full')).toBeInTheDocument();
  });
});
