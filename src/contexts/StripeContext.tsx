import React, { createContext, useContext, useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';
import { getStripe, isStripeConfigured, validatePaymentAmount, isCurrencySupported } from '@/integrations/stripe/client';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StripeContextType {
  isLoading: boolean;
  isConfigured: boolean;
  createPaymentIntent: (amount: number, metadata?: Record<string, any>) => Promise<{ clientSecret: string | null; error?: string }>;
  validatePayment: (amount: number, currency: string) => { isValid: boolean; error?: string };
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export function useStripe() {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
}

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setIsLoading(true);
        const stripe = await getStripe();
        setStripePromise(stripe ? Promise.resolve(stripe) : null);
        setIsConfigured(Boolean(stripe));
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        setStripePromise(null);
        setIsConfigured(false);
        toast.error('Payment system initialization failed', {
          description: 'Please try again later or contact support if the issue persists.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, []);

  const validatePayment = (amount: number, currency: string) => {
    if (!validatePaymentAmount(amount)) {
      return {
        isValid: false,
        error: 'Invalid payment amount'
      };
    }

    if (!isCurrencySupported(currency)) {
      return {
        isValid: false,
        error: 'Unsupported currency'
      };
    }

    return { isValid: true };
  };

  const createPaymentIntent = async (
    amount: number,
    metadata?: Record<string, any>
  ): Promise<{ clientSecret: string | null; error?: string }> => {
    try {
      if (!isConfigured) {
        throw new Error('Stripe is not configured');
      }

      // Validate payment amount
      if (!validatePaymentAmount(amount)) {
        throw new Error('Invalid payment amount');
      }

      // Convert amount to cents
      const amountInCents = Math.round(amount * 100);

      // Call Supabase Edge Function to create payment intent
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: amountInCents,
          currency: 'zar',
          metadata: {
            ...metadata,
            created_at: new Date().toISOString()
          }
        }
      });

      if (error) {
        throw error;
      }

      if (!data?.clientSecret) {
        throw new Error('No client secret received from payment intent creation');
      }

      return { clientSecret: data.clientSecret };
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      toast.error('Payment processing error', {
        description: error.message || 'Failed to initialize payment. Please try again.'
      });
      return { clientSecret: null, error: error.message };
    }
  };

  const value = {
    isLoading,
    isConfigured,
    createPaymentIntent,
    validatePayment
  };

  // If Stripe is not initialized yet, just render children without Elements
  if (!stripePromise || !isConfigured) {
    return (
      <StripeContext.Provider value={value}>
        {children}
      </StripeContext.Provider>
    );
  }

  return (
    <StripeContext.Provider value={value}>
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  );
}
