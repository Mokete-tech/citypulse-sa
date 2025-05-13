import { toast } from '@/components/ui/sonner';

interface ErrorOptions {
  title?: string;
  message?: string;
  silent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  showInProduction?: boolean;
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
    showInProduction = false,
  } = options;

  // Always log to console for debugging
  if (import.meta.env.DEV) {
    console.error('Error:', error);
  } else {
    // In production, log with less detail to avoid exposing sensitive information
    console.error('Error occurred:', typeof error === 'object' ? (error as any)?.message || 'Unknown error' : 'Unknown error');
  }

  // Don't show toast if silent is true
  if (silent) return;

  // In production, only show user-friendly errors if explicitly allowed
  if (import.meta.env.PROD && !showInProduction) return;

  // Show toast notification
  toast.error(title, {
    description: message,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
  });
}

/**
 * Handles API errors from Supabase
 * @param error The Supabase error object
 * @param options Configuration options for error handling
 */
export function handleSupabaseError(error: any, options: ErrorOptions = {}): void {
  let message = options.message || 'Something went wrong with the database operation.';
  let userFriendlyMessage = 'We encountered an issue connecting to our services.';
  let showInProduction = options.showInProduction || false;

  // Extract more specific error message if available
  if (error?.message) {
    message = error.message;

    // Map specific error messages to user-friendly messages
    if (message.includes('JWT expired')) {
      userFriendlyMessage = 'Your session has expired. Please sign in again.';
      showInProduction = true;
    } else if (message.includes('Invalid API key')) {
      userFriendlyMessage = 'There was a problem with your connection. Please refresh the page.';
      showInProduction = true;
    } else if (message.includes('network error')) {
      userFriendlyMessage = 'Network connection issue. Please check your internet connection.';
      showInProduction = true;
    }
  } else if (error?.error_description) {
    message = error.error_description;
  }

  // In production, use the user-friendly message
  const displayMessage = import.meta.env.PROD ? userFriendlyMessage : message;

  handleError(error, {
    title: options.title || 'Connection Error',
    message: displayMessage,
    silent: options.silent,
    action: options.action,
    showInProduction,
  });

  // Return the error message for potential use by the caller
  return displayMessage;
}
