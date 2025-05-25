import { Stripe, StripeConstructorOptions } from '@stripe/stripe-js';

interface StripeConfig {
  publishableKey: string;
  options?: StripeConstructorOptions;
}

/**
 * Validate Stripe configuration
 */
export const validateStripeConfig = (): StripeConfig | null => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.error('Stripe publishable key is not configured');
    return null;
  }

  if (!publishableKey.startsWith('pk_')) {
    console.error('Invalid Stripe publishable key format');
    return null;
  }

  return {
    publishableKey,
    options: {
      apiVersion: '2023-10-16' as const,
      typescript: true,
    }
  };
};

/**
 * Check if Stripe is configured with a valid API key
 */
export const isStripeConfigured = (): boolean => {
  return Boolean(validateStripeConfig());
};

/**
 * Format an amount in cents to a currency string
 */
export const formatAmountForDisplay = (amount: number, currency: string = 'ZAR'): string => {
  try {
    const formatter = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    });
    
    return formatter.format(amount / 100);
  } catch (error) {
    console.error('Error formatting amount:', error);
    return `${currency} ${(amount / 100).toFixed(2)}`;
  }
};

/**
 * Get a singleton Stripe instance
 */
let stripePromiseInstance: Promise<Stripe | null> | null = null;

export const getStripe = async (): Promise<Stripe | null> => {
  try {
    if (!stripePromiseInstance) {
      const config = validateStripeConfig();
      
      if (!config) {
        throw new Error('Stripe is not properly configured');
      }

      const { loadStripe } = await import('@stripe/stripe-js');
      stripePromiseInstance = loadStripe(config.publishableKey, config.options);
    }
    
    return stripePromiseInstance;
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    return null;
  }
};

export const stripePromise = getStripe();

/**
 * Validate a payment amount
 */
export const validatePaymentAmount = (amount: number): boolean => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return false;
  }

  if (amount <= 0) {
    return false;
  }

  // Maximum amount in cents (R100,000)
  if (amount > 10000000) {
    return false;
  }

  return true;
};

/**
 * Format currency code
 */
export const formatCurrencyCode = (currency: string): string => {
  return currency.toUpperCase();
};

/**
 * Get supported currencies
 */
export const getSupportedCurrencies = (): string[] => {
  return ['ZAR', 'USD', 'EUR', 'GBP'];
};

/**
 * Check if currency is supported
 */
export const isCurrencySupported = (currency: string): boolean => {
  return getSupportedCurrencies().includes(formatCurrencyCode(currency));
};
