
import { toast } from 'sonner';

interface ErrorOptions {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const handleError = (error: any, options: ErrorOptions = {}) => {
  console.error('Error occurred:', error);
  
  const title = options.title || 'An error occurred';
  const message = options.message || extractErrorMessage(error);
  
  toast.error(title, {
    description: message,
    action: options.action,
  });
  
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
