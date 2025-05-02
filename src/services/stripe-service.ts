import { supabase } from '@/integrations/supabase/client';

// Get Stripe publishable key from environment variables
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Check if Stripe is loaded
const isStripeLoaded = () => {
  return typeof window !== 'undefined' && window.Stripe !== undefined;
};

// Load Stripe dynamically
const loadStripe = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isStripeLoaded()) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(script);
  });
};

// Initialize Stripe
const initializeStripe = async () => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe publishable key is not defined');
  }

  await loadStripe();
  return window.Stripe(STRIPE_PUBLISHABLE_KEY);
};

interface PaymentIntentOptions {
  amount: number; // Amount in cents (e.g., 2000 for $20.00)
  currency?: string; // Default: 'zar'
  description?: string;
  metadata?: Record<string, string>;
}

interface StripeCardElement {
  mount: (selector: string) => void;
  on: (event: string, handler: (event: any) => void) => void;
  update: (options: any) => void;
}

interface StripeElements {
  create: (type: string, options?: any) => StripeCardElement;
}

// Declare global Stripe types
declare global {
  interface Window {
    Stripe: (key: string) => {
      elements: (options?: any) => StripeElements;
      createPaymentMethod: (options: any) => Promise<any>;
      confirmCardPayment: (clientSecret: string, options: any) => Promise<any>;
      redirectToCheckout?: (options: { sessionId: string }) => Promise<{ error?: { message: string } }>;
    };
  }
}

/**
 * Service for handling Stripe payments
 */
export const stripeService = {
  /**
   * Create a payment intent on the server
   * @param options Payment intent options
   * @returns Promise resolving to client secret
   */
  async createPaymentIntent(options: PaymentIntentOptions): Promise<{ clientSecret: string; error?: string }> {
    try {
      // Call Supabase Edge Function to create payment intent
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: options.amount,
          currency: options.currency || 'zar',
          description: options.description,
          metadata: options.metadata
        }
      });

      if (error) throw error;

      return { clientSecret: data.clientSecret };
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      return { clientSecret: '', error: error.message };
    }
  },

  /**
   * Process a payment with Stripe
   * @param amount Amount to charge in cents
   * @param itemId ID of the item being purchased
   * @param itemType Type of item (deal, event, etc.)
   * @param description Description of the payment
   * @returns Promise resolving to payment result
   */
  async processPayment(
    amount: number,
    itemId: string,
    itemType: string,
    description: string
  ): Promise<{ success: boolean; error?: string; paymentIntentId?: string }> {
    try {
      // Create a payment intent
      const { clientSecret, error } = await this.createPaymentIntent({
        amount,
        description,
        metadata: {
          itemId,
          itemType
        }
      });

      if (error || !clientSecret) {
        throw new Error(error || 'Failed to create payment intent');
      }

      // Initialize Stripe
      const stripe = await initializeStripe();

      // Create Stripe Elements
      const elements = stripe.elements();

      // Create card element
      const cardElement = elements.create('card');

      // Mount card element to DOM
      cardElement.mount('#card-element');

      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // These would come from the form in a real implementation
            name: 'Customer Name',
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed');
      }

      if (result.paymentIntent?.status === 'succeeded') {
        // Payment succeeded
        return {
          success: true,
          paymentIntentId: result.paymentIntent.id
        };
      } else {
        // Payment didn't succeed
        return {
          success: false,
          error: `Payment status: ${result.paymentIntent?.status || 'unknown'}`
        };
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create a checkout session for a product
   * @param priceId Stripe Price ID
   * @param successUrl URL to redirect on success
   * @param cancelUrl URL to redirect on cancel
   * @param metadata Additional metadata
   * @returns Promise resolving to session ID
   */
  async createCheckoutSession(
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ): Promise<{ sessionId: string; error?: string }> {
    try {
      // Call Supabase Edge Function to create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId,
          successUrl,
          cancelUrl,
          metadata
        }
      });

      if (error) throw error;

      return { sessionId: data.sessionId };
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      return { sessionId: '', error: error.message };
    }
  },

  /**
   * Redirect to Stripe Checkout
   * @param sessionId Checkout session ID
   */
  async redirectToCheckout(sessionId: string): Promise<void> {
    try {
      const stripe = await initializeStripe();

      // Check if redirectToCheckout is available
      if (typeof stripe.redirectToCheckout === 'function') {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw error;
      } else {
        // Fallback for environments where redirectToCheckout is not available
        console.warn('Stripe redirectToCheckout is not available in this environment');
        // In a real app, you might want to redirect to a URL like:
        // window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
      }
    } catch (error: any) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }
};
