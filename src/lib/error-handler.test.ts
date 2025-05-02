import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleError, handleSupabaseError } from './error-handler';
import { toast } from '@/components/ui/sonner';

// Mock the toast module
vi.mock('@/components/ui/sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('Error Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to prevent test output pollution
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('handleError', () => {
    it('logs error to console', () => {
      const testError = new Error('Test error');
      handleError(testError);
      
      expect(console.error).toHaveBeenCalledWith('Error:', testError);
    });

    it('shows toast notification by default', () => {
      const testError = new Error('Test error');
      handleError(testError);
      
      expect(toast.error).toHaveBeenCalledWith(
        'An error occurred',
        expect.objectContaining({
          description: 'Something went wrong. Please try again.',
        })
      );
    });

    it('uses custom title and message when provided', () => {
      const testError = new Error('Test error');
      handleError(testError, {
        title: 'Custom Error Title',
        message: 'Custom error message',
      });
      
      expect(toast.error).toHaveBeenCalledWith(
        'Custom Error Title',
        expect.objectContaining({
          description: 'Custom error message',
        })
      );
    });

    it('does not show toast when silent is true', () => {
      const testError = new Error('Test error');
      handleError(testError, { silent: true });
      
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('includes action in toast when provided', () => {
      const mockAction = {
        label: 'Retry',
        onClick: vi.fn(),
      };
      
      const testError = new Error('Test error');
      handleError(testError, { action: mockAction });
      
      expect(toast.error).toHaveBeenCalledWith(
        'An error occurred',
        expect.objectContaining({
          action: {
            label: 'Retry',
            onClick: expect.any(Function),
          },
        })
      );
    });
  });

  describe('handleSupabaseError', () => {
    it('extracts error message from Supabase error object', () => {
      const supabaseError = {
        message: 'Supabase specific error',
      };
      
      handleSupabaseError(supabaseError);
      
      expect(toast.error).toHaveBeenCalledWith(
        'Database Error',
        expect.objectContaining({
          description: 'Supabase specific error',
        })
      );
    });

    it('extracts error_description if available', () => {
      const supabaseError = {
        error_description: 'Auth error description',
      };
      
      handleSupabaseError(supabaseError);
      
      expect(toast.error).toHaveBeenCalledWith(
        'Database Error',
        expect.objectContaining({
          description: 'Auth error description',
        })
      );
    });

    it('uses default message if no specific error info is available', () => {
      const supabaseError = {};
      
      handleSupabaseError(supabaseError);
      
      expect(toast.error).toHaveBeenCalledWith(
        'Database Error',
        expect.objectContaining({
          description: 'Something went wrong with the database operation.',
        })
      );
    });

    it('uses custom title when provided', () => {
      const supabaseError = {
        message: 'Supabase error',
      };
      
      handleSupabaseError(supabaseError, {
        title: 'Authentication Error',
      });
      
      expect(toast.error).toHaveBeenCalledWith(
        'Authentication Error',
        expect.objectContaining({
          description: 'Supabase error',
        })
      );
    });
  });
});
