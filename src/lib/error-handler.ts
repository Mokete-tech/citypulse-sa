
import { toast } from 'sonner';

interface ErrorOptions {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  silent?: boolean; // Adding silent option
}

export const handleError = (error: any, options: ErrorOptions = {}) => {
  console.error('Error occurred:', error);
  
  const title = options.title || 'An error occurred';
  const message = options.message || extractErrorMessage(error);
  
  if (!options.silent) {
    toast.error(title, {
      description: message,
      action: options.action,
    });
  }
  
  return error;
};

export const handleSupabaseError = (error: any, options: ErrorOptions = {}) => {
  console.error('Supabase error:', error);
  
  // Extract specific Supabase error information
  let errorMessage = extractErrorMessage(error);
  
  // Handle specific Supabase error codes
  if (error?.code === 'PGRST116') {
    errorMessage = 'Not found: The requested resource does not exist';
  } else if (error?.code === 'PGRST301') {
    errorMessage = 'Permission denied: You do not have access to this resource';
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

const extractErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.error && error.error.message) return error.error.message;
  
  if (error.data && error.data.message) return error.data.message;
  
  return 'Something went wrong';
};
