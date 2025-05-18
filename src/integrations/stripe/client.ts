
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
  const formatter = new Intl.NumberFormatter('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  
  return `R${(amount / 100).toFixed(2)}`;
};

/**
 * Get a singleton Stripe instance
 */
let stripePromiseInstance: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromiseInstance) {
    stripePromiseInstance = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromiseInstance;
};

export const stripePromise = getStripe();
