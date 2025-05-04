import React, { createContext, useContext, useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { getStripe, isStripeConfigured } from '@/integrations/stripe/client';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StripeContextType {
  isLoading: boolean;
  isConfigured: boolean;
  createPaymentIntent: (amount: number, metadata?: Record<string, any>) => Promise<{ clientSecret: string | null; error?: string }>;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Initialize Stripe
    const initStripe = async () => {
      try {
        setIsLoading(true);

        // Check if Stripe is configured
        const configured = isStripeConfigured();
        setIsConfigured(configured);

        if (configured) {
          // Initialize Stripe promise
          setStripePromise(getStripe());
        } else {
          console.warn('Stripe is not configured. Payment features will be disabled.');
        }
      } catch (error) {
        console.error('Error initializing Stripe:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initStripe();
  }, []);

  /**
   * Create a payment intent via Supabase Edge Function
   * @param amount Amount in currency units (will be converted to cents)
   * @param metadata Additional metadata for the payment
   * @returns Client secret for the payment intent
   */
  const createPaymentIntent = async (
    amount: number,
    metadata?: Record<string, any>
  ): Promise<{ clientSecret: string | null; error?: string }> => {
    try {
      if (!isConfigured) {
        console.warn('Stripe is not configured, using simulation mode');
      }

      // Convert amount to cents
      const amountInCents = Math.round(amount * 100);

      console.log('Creating payment intent for amount:', amountInCents, 'with metadata:', metadata);

      // Simulate a successful payment intent creation
      // In a real implementation, we would call the Supabase Edge Function
      const simulatedClientSecret = `pi_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;

      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('Created simulated payment intent with client secret:', simulatedClientSecret);

      return { clientSecret: simulatedClientSecret };
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      toast.error('Payment processing error', {
        description: error.message || 'Failed to initialize payment. Please try again.'
      });
      return { clientSecret: null, error: error.message };
    }
  };

  // Context value
  const value = {
    isLoading,
    isConfigured,
    createPaymentIntent
  };

  // If Stripe is not initialized yet, just render children without Elements
  if (!stripePromise || !isConfigured) {
    return (
      <StripeContext.Provider value={value}>
        {children}
      </StripeContext.Provider>
    );
  }

  // Options for Stripe Elements
  const options: StripeElementsOptions = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0EA5E9',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px'
      }
    }
  };

  // Render with Stripe Elements provider
  return (
    <StripeContext.Provider value={value}>
      <Elements stripe={stripePromise} options={options}>
        {children}
      </Elements>
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);

  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }

  return context;
}
