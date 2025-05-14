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

// Helper function to check if email configuration is available
const hasEmailConfig = () => {
  const hasSmtp = Boolean(
    import.meta.env.SMTP_HOST &&
    import.meta.env.SMTP_USER &&
    import.meta.env.SMTP_PASS
  );

  const hasSendgrid = Boolean(
    import.meta.env.VITE_SENDGRID_API_KEY &&
    import.meta.env.VITE_SENDGRID_FROM_EMAIL
  );

  return hasSmtp || hasSendgrid;
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
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_ADMIN_EMAIL',
    'SMTP_SENDER_NAME',
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
    const appVars = missingOptionalVars.filter(v => v.includes('APP_'));
    const otherVars = missingOptionalVars.filter(v =>
      !v.includes('SENDGRID') && !v.includes('SMTP') && !v.includes('APP_')
    );

    // Only warn about email configuration if both SendGrid and SMTP are missing
    if (!hasEmailConfig()) {
      warnings.push(
        `Email configuration missing. Email features will not work correctly.`
      );
    }

    if (appVars.length > 0) {
      warnings.push(
        `Application configuration incomplete: ${appVars.join(', ')}.`
      );
    }

    if (otherVars.length > 0 && otherVars.some(v => !v.includes('SENDGRID') && !v.includes('SMTP'))) {
      warnings.push(
        `Other missing optional variables: ${otherVars.filter(v => !v.includes('SENDGRID') && !v.includes('SMTP')).join(', ')}.`
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
