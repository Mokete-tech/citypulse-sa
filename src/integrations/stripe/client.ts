
import { loadStripe, Stripe } from '@stripe/stripe-js';

/**
 * Check if Stripe is configured with an API key
 */
export const isStripeConfigured = (): boolean => {
  return Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
};

/**
 * Format an amount in cents to a currency string
 */
export const formatAmountForDisplay = (amount: number, currency: string = 'ZAR'): string => {
  // Use Intl.NumberFormat instead of NumberFormatter
  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount / 100);
};

/**
 * Get a singleton Stripe instance
 */
let stripePromiseInstance: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromiseInstance) {
    // Use optional chaining and nullish coalescing to handle empty keys gracefully
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '';
    stripePromiseInstance = key ? loadStripe(key) : Promise.resolve(null);
  }
  return stripePromiseInstance;
};

export const stripePromise = getStripe();
