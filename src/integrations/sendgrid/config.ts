/**
 * SendGrid integration configuration
 * 
 * This file contains the configuration for SendGrid email service.
 * In a production environment, you would use environment variables for these values.
 */

export const SENDGRID_CONFIG = {
  // SendGrid API key - should be stored in environment variables
  API_KEY: import.meta.env.VITE_SENDGRID_API_KEY || '',
  
  // Sender email address
  FROM_EMAIL: import.meta.env.VITE_SENDGRID_FROM_EMAIL || 'noreply@citypulse-sa.com',
  
  // Sender name
  FROM_NAME: import.meta.env.VITE_SENDGRID_FROM_NAME || 'CityPulse South Africa',
  
  // SMTP settings for Supabase
  SMTP: {
    host: 'smtp.sendgrid.net',
    port: '587',
    user: 'apikey',
    // The password is the API key
    pass: import.meta.env.VITE_SENDGRID_API_KEY || '',
  }
};

/**
 * Validates that the SendGrid configuration is complete
 * @returns True if the configuration is valid, false otherwise
 */
export function isConfigValid(): boolean {
  return Boolean(
    SENDGRID_CONFIG.API_KEY &&
    SENDGRID_CONFIG.FROM_EMAIL &&
    SENDGRID_CONFIG.FROM_NAME
  );
}
