/**
 * Environment variable checker utility
 *
 * This utility helps check if required environment variables are set
 * and provides warnings for developers and users when using fallbacks.
 */

import { isUsingDefaultCredentials } from '@/integrations/supabase';

interface EnvCheckResult {
  isValid: boolean;
  missingVars: string[];
  usingFallbacks: boolean;
  warnings: string[];
}

// Add specific error types for clarity
export interface EnvError {
  code: 'missing_required' | 'invalid_format' | 'invalid_value' | 'unknown_error';
  message: string;
  details?: Record<string, unknown>;
}

// Add helper function to create EnvError
export function createEnvError(code: EnvError['code'], message: string, details?: Record<string, unknown>): EnvError {
  return {
    code,
    message,
    details
  };
}

// Add specific error codes for clarity
export const ENV_ERROR_CODES = {
  MISSING_REQUIRED: 'missing_required',
  INVALID_FORMAT: 'invalid_format',
  INVALID_VALUE: 'invalid_value',
  UNKNOWN_ERROR: 'unknown_error'
} as const;

// Add helper function to check if an error is an EnvError
export function isEnvError(error: unknown): error is EnvError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

// Helper function to check if email configuration is available
const hasEmailConfig = () => {
  const hasSmtp = Boolean(
    import.meta.env.VITE_SMTP_HOST &&
    import.meta.env.VITE_SMTP_USER &&
    import.meta.env.VITE_SMTP_PASS
  );

  const hasSendgrid = Boolean(
    import.meta.env.VITE_SENDGRID_API_KEY &&
    import.meta.env.VITE_SENDGRID_FROM_EMAIL
  );

  return hasSmtp || hasSendgrid;
};

// Helper function to check if Stripe configuration is available
const hasStripeConfig = () => {
  return Boolean(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
};

// Helper function to check if Clerk configuration is available
const hasClerkConfig = () => {
  return Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
};

/**
 * Checks if all required environment variables are set
 * @returns Object with validation results
 */
export function checkEnvironmentVariables(): EnvCheckResult {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  const optionalVars = [
    'VITE_SENDGRID_API_KEY',
    'VITE_SENDGRID_FROM_EMAIL',
    'VITE_SENDGRID_FROM_NAME',
    'VITE_APP_NAME',
    'VITE_APP_ENV',
    'VITE_SMTP_HOST',
    'VITE_SMTP_PORT',
    'VITE_SMTP_USER',
    'VITE_SMTP_PASS',
    'VITE_SMTP_ADMIN_EMAIL',
    'VITE_SMTP_SENDER_NAME',
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_GEMINI_API_KEY',
    'VITE_CLERK_PUBLISHABLE_KEY'
  ];

  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );

  const missingOptionalVars = optionalVars.filter(
    varName => !import.meta.env[varName]
  );

  const warnings = [];

  if (isUsingDefaultCredentials) {
    warnings.push(
      'Using default Supabase configuration. This is not secure for production use.'
    );
  }

  if (missingOptionalVars.length > 0) {
    // Group missing variables by category for better reporting
    const emailVars = missingOptionalVars.filter(v => 
      v.includes('SENDGRID') || v.includes('SMTP')
    );
    
    const stripeVars = missingOptionalVars.filter(v => 
      v.includes('STRIPE')
    );
    
    const aiVars = missingOptionalVars.filter(v => 
      v.includes('GEMINI') || v.includes('OPENAI')
    );
    
    const authVars = missingOptionalVars.filter(v => 
      v.includes('CLERK')
    );
    
    const appVars = missingOptionalVars.filter(v => v.includes('APP_'));
    
    const otherVars = missingOptionalVars.filter(v =>
      !v.includes('SENDGRID') && 
      !v.includes('SMTP') && 
      !v.includes('APP_') &&
      !v.includes('STRIPE') &&
      !v.includes('GEMINI') &&
      !v.includes('OPENAI') &&
      !v.includes('CLERK')
    );

    // Only warn about email configuration if both SendGrid and SMTP are missing
    if (!hasEmailConfig() && emailVars.length > 0) {
      warnings.push(
        `Email configuration missing. Email features will not work correctly.`
      );
    }

    // Warn about missing Stripe configuration
    if (!hasStripeConfig() && stripeVars.length > 0) {
      warnings.push(
        `Payment configuration missing. Payment features will not work correctly.`
      );
    }

    // Warn about missing AI configuration
    if (aiVars.length > 0) {
      warnings.push(
        `AI configuration missing. AI assistant features will not work correctly.`
      );
    }

    // Warn about missing auth configuration
    if (!hasClerkConfig() && authVars.length > 0) {
      warnings.push(
        `Authentication configuration incomplete. Some auth features may not work correctly.`
      );
    }

    if (appVars.length > 0) {
      warnings.push(
        `Application configuration incomplete: ${appVars.join(', ')}.`
      );
    }

    if (otherVars.length > 0) {
      warnings.push(
        `Other missing optional variables: ${otherVars.join(', ')}.`
      );
    }
  }

  return {
    isValid: missingVars.length === 0 || isUsingDefaultCredentials,
    missingVars,
    usingFallbacks: isUsingDefaultCredentials,
    warnings,
  };
}

/**
 * Gets a user-friendly message about environment configuration
 * @returns A message string or null if everything is properly configured
 */
export function getEnvironmentWarningMessage(): string | null {
  const { isValid, usingFallbacks, warnings } = checkEnvironmentVariables();

  if (!isValid && !usingFallbacks) {
    return '⚠️ Application is missing critical environment variables and may not function correctly.';
  }

  if (usingFallbacks) {
    return '⚠️ Using default Supabase configuration. Not suitable for production use.';
  }

  // Check if we have either SMTP or SendGrid configured
  // If we have email configured, don't show warnings about missing optional vars
  if (hasEmailConfig() &&
      warnings.length === 1 &&
      warnings[0].includes('Email configuration')) {
    return null;
  }

  if (warnings.length > 0) {
    // Filter out email warnings if we have email config
    const filteredWarnings = warnings.filter(w =>
      !hasEmailConfig() || !w.includes('Email configuration')
    );

    if (filteredWarnings.length > 0) {
      return '⚠️ Some optional environment variables are missing. Check console for details.';
    }
  }

  return null;
}
