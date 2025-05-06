import { toast } from '@/components/ui/sonner';

interface ErrorOptions {
  title?: string;
  message?: string;
  silent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Handles errors consistently throughout the application
 * @param error The error object
 * @param options Configuration options for error handling
 */
export function handleError(error: unknown, options: ErrorOptions = {}): void {
  // Default options
  const {
    title = 'An error occurred',
    message = 'Something went wrong. Please try again.',
    silent = false,
    action,
  } = options;

  // Always log to console for debugging
  console.error('Error:', error);

  // Don't show toast if silent is true or in production
  if (silent || import.meta.env.PROD) return;

  // Show toast notification only in development
  if (import.meta.env.DEV) {
    toast.error(title, {
      description: message,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    });
  }
}

/**
 * Handles API errors from Supabase
 * @param error The Supabase error object
 * @param options Configuration options for error handling
 */
export function handleSupabaseError(error: any, options: ErrorOptions = {}): void {
  let message = options.message || 'Something went wrong with the database operation.';

  // Extract more specific error message if available
  if (error?.message) {
    message = error.message;
  } else if (error?.error_description) {
    message = error.error_description;
  }

  handleError(error, {
    title: options.title || 'Database Error',
    message,
    silent: options.silent,
    action: options.action,
  });
}
