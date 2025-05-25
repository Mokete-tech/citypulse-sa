import { toast } from 'sonner';

interface ErrorOptions {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  silent?: boolean;
}

interface BaseError {
  message?: string;
  error?: {
    message?: string;
  };
  data?: {
    message?: string;
  };
}

// Utility function to extract error message from unknown error
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message?: string }).message || 'An unknown error occurred';
  }
  return 'An unknown error occurred';
}

export const handleError = (error: unknown, options: ErrorOptions = {}) => {
  console.error('Error occurred:', error);
  
  const title = options.title || 'An error occurred';
  const message = options.message || getErrorMessage(error);
  
  if (!options.silent) {
    toast.error(title, {
      description: message,
      action: options.action,
    });
  }
  
  return error;
};

export const handleSupabaseError = (error: unknown, options: ErrorOptions = {}) => {
  console.error('Supabase error:', error);
  
  // Extract specific Supabase error information
  let errorMessage = getErrorMessage(error);
  
  // Handle specific Supabase error codes
  if (error && typeof error === 'object' && 'code' in error) {
    const errorWithCode = error as { code: string };
    if (errorWithCode.code === 'PGRST116') {
      errorMessage = 'Not found: The requested resource does not exist';
    } else if (errorWithCode.code === 'PGRST301') {
      errorMessage = 'Permission denied: You do not have access to this resource';
    }
  }
  
  const title = options.title || 'Database error';
  
  if (!options.silent) {
    toast.error(title, {
      description: options.message || errorMessage,
      action: options.action,
    });
  }
  
  return error;
};

const extractErrorMessage = (error: unknown): string => {
  if (!error) return 'Unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error && typeof error === 'object') {
    const err = error as BaseError;
    if (err.message) return err.message;
    if (err.error?.message) return err.error.message;
    if (err.data?.message) return err.data.message;
  }
  
  return 'Something went wrong';
};
