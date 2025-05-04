import { loadStripe, Stripe } from '@stripe/stripe-js';

// Use environment variables for Stripe credentials
// Support both VITE_ and NEXT_PUBLIC_ prefixes for compatibility with Vercel integration
const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51OQvXnJXgvQFfZxPJWCVsGwSdDTrTlRKlSHEXPTox5JQRbwGJ5YdEpHmQeNOJtmZAQwXQXwpIY9LzrqPKHtE9pxF00ORJnLzIm'; // Fallback to test key

// Log Stripe configuration
console.log('Stripe Publishable Key:', STRIPE_PUBLISHABLE_KEY ? 'Key is set' : 'Key is not set');

// Validate that environment variables are set
if (!STRIPE_PUBLISHABLE_KEY) {
  console.error(
    'Missing Stripe environment variables. Please check that either VITE_STRIPE_PUBLISHABLE_KEY ' +
    'or NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.'
  );
}

// Create a promise that resolves with the Stripe object
let stripePromise: Promise<Stripe | null>;

/**
 * Get the Stripe instance (initializes it if not already done)
 * @returns Promise that resolves with the Stripe instance
 */
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY as string);
  }
  return stripePromise;
};

/**
 * Check if Stripe is properly configured
 * @returns Boolean indicating if Stripe is configured
 */
export const isStripeConfigured = (): boolean => {
  return !!STRIPE_PUBLISHABLE_KEY;
};

/**
 * Format amount for display (e.g., 1000 -> R10.00)
 * @param amount Amount in cents
 * @returns Formatted amount string
 */
export const formatAmountForDisplay = (amount: number): string => {
  const numberFormat = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'symbol',
  });

  return numberFormat.format(amount / 100);
};

/**
 * Format amount for Stripe API (e.g., R10.00 -> 1000)
 * @param amount Amount in currency units
 * @returns Amount in cents
 */
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};
