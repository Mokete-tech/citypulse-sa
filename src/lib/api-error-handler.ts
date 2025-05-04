import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

interface ErrorOptions {
  title?: string;
  message?: string;
  silent?: boolean;
  retry?: () => void;
  fallback?: any;
  logToService?: boolean;
}

/**
 * Enhanced error handler for API calls
 * 
 * @param error The error object
 * @param options Configuration options for error handling
 * @returns The fallback value if provided
 */
export function handleApiError(error: unknown, options: ErrorOptions = {}) {
  const {
    title = 'Error',
    message = 'An unexpected error occurred. Please try again later.',
    silent = false,
    retry,
    fallback,
    logToService = true
  } = options;

  // Extract error details
  let errorMessage = message;
  let errorCode = 'UNKNOWN_ERROR';
  let errorDetails = '';

  // Handle different error types
  if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    // Handle Supabase PostgrestError
    if ('code' in error && 'message' in error && 'details' in error) {
      const postgrestError = error as PostgrestError;
      errorCode = postgrestError.code;
      errorMessage = postgrestError.message;
      errorDetails = postgrestError.details || '';
    } else if ('message' in error) {
      errorMessage = (error as any).message;
    }
  }

  // Log the error
  console.error(`[${errorCode}] ${title}:`, errorMessage, error);

  // Log to error tracking service in production
  if (logToService && import.meta.env.PROD) {
    // In a real app, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { extra: { code: errorCode, details: errorDetails } });
    console.log('[Error Service] Would log error to service:', { errorCode, errorMessage, errorDetails });
  }

  // Show toast notification if not silent
  if (!silent) {
    if (retry) {
      toast.error(title, {
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: retry
        }
      });
    } else {
      toast.error(title, {
        description: errorMessage
      });
    }
  }

  // Return fallback value if provided
  return fallback;
}

/**
 * Specialized error handler for Supabase errors
 */
export function handleSupabaseError(error: unknown, options: ErrorOptions = {}) {
  // Default title for Supabase errors
  const title = options.title || 'Database Error';
  
  // Handle specific Supabase error codes
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as any).code;
    
    // Customize messages based on error code
    let customMessage = options.message;
    
    switch (code) {
      case '23505': // Unique violation
        customMessage = 'This record already exists.';
        break;
      case '23503': // Foreign key violation
        customMessage = 'This operation references a record that does not exist.';
        break;
      case '42P01': // Undefined table
        customMessage = 'The requested data table does not exist.';
        break;
      case '42703': // Undefined column
        customMessage = 'The requested data field does not exist.';
        break;
      case '28P01': // Invalid password
        customMessage = 'Invalid credentials. Please check your email and password.';
        break;
      case '3D000': // Database does not exist
        customMessage = 'Database connection error. Please try again later.';
        break;
      case 'PGRST116': // Row level security violation
        customMessage = 'You do not have permission to perform this action.';
        break;
    }
    
    return handleApiError(error, {
      ...options,
      title,
      message: customMessage || options.message
    });
  }
  
  // Fall back to generic error handling
  return handleApiError(error, {
    ...options,
    title
  });
}

/**
 * Specialized error handler for authentication errors
 */
export function handleAuthError(error: unknown, options: ErrorOptions = {}) {
  // Default title for auth errors
  const title = options.title || 'Authentication Error';
  
  // Handle specific auth error messages
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as any).message;
    
    // Customize messages based on error message content
    let customMessage = options.message;
    
    if (message.includes('Email not confirmed')) {
      customMessage = 'Please check your email to confirm your account before logging in.';
    } else if (message.includes('Invalid login credentials')) {
      customMessage = 'Invalid email or password. Please try again.';
    } else if (message.includes('Email already registered')) {
      customMessage = 'This email is already registered. Please log in instead.';
    } else if (message.includes('Password should be')) {
      customMessage = 'Password is too weak. Please use a stronger password.';
    } else if (message.includes('rate limit')) {
      customMessage = 'Too many attempts. Please try again later.';
    }
    
    return handleApiError(error, {
      ...options,
      title,
      message: customMessage || options.message
    });
  }
  
  // Fall back to generic error handling
  return handleApiError(error, {
    ...options,
    title
  });
}

/**
 * Specialized error handler for payment errors
 */
export function handlePaymentError(error: unknown, options: ErrorOptions = {}) {
  // Default title for payment errors
  const title = options.title || 'Payment Error';
  
  // Handle specific payment error codes/messages
  if (error && typeof error === 'object') {
    // Customize messages based on error type
    let customMessage = options.message;
    
    if ('code' in error) {
      const code = (error as any).code;
      
      switch (code) {
        case 'card_declined':
          customMessage = 'Your card was declined. Please try another payment method.';
          break;
        case 'expired_card':
          customMessage = 'Your card has expired. Please try another card.';
          break;
        case 'insufficient_funds':
          customMessage = 'Your card has insufficient funds. Please try another payment method.';
          break;
        case 'processing_error':
          customMessage = 'An error occurred while processing your payment. Please try again.';
          break;
      }
    }
    
    return handleApiError(error, {
      ...options,
      title,
      message: customMessage || options.message
    });
  }
  
  // Fall back to generic error handling
  return handleApiError(error, {
    ...options,
    title
  });
}
