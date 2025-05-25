import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StripePaymentForm } from '../StripePaymentForm';
import { StripeProvider } from '@/contexts/StripeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    confirmCardPayment: jest.fn(() => Promise.resolve({
      paymentIntent: { status: 'succeeded', id: 'pi_test_123' }
    }))
  }))
}));

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ error: null }))
    }))
  }
}));

// Mock Auth Context
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test_user_id',
      email: 'test@example.com'
    }
  })
}));

describe('StripePaymentForm', () => {
  const defaultProps = {
    amount: 100,
    itemType: 'deal' as const,
    itemId: 1,
    itemName: 'Test Deal',
    isPremium: true,
    onSuccess: jest.fn(),
    onCancel: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders payment form with correct amount', () => {
    render(
      <AuthProvider>
        <StripeProvider>
          <StripePaymentForm {...defaultProps} />
        </StripeProvider>
      </AuthProvider>
    );

    expect(screen.getByText('Payment Details')).toBeInTheDocument();
    expect(screen.getByText('R100.00')).toBeInTheDocument();
  });

  it('handles successful payment', async () => {
    render(
      <AuthProvider>
        <StripeProvider>
          <StripePaymentForm {...defaultProps} />
        </StripeProvider>
      </AuthProvider>
    );

    // Wait for payment intent to be created
    await waitFor(() => {
      expect(screen.getByText('Pay Now')).toBeInTheDocument();
    });

    // Submit payment
    fireEvent.click(screen.getByText('Pay Now'));

    // Wait for payment to be processed
    await waitFor(() => {
      expect(screen.getByText('Payment successful!')).toBeInTheDocument();
    });

    // Verify database record
    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(supabase.from('transactions').insert).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 100,
        currency: 'ZAR',
        status: 'succeeded',
        type: 'payment'
      })
    );

    // Verify success callback
    expect(defaultProps.onSuccess).toHaveBeenCalled();
  });

  it('handles payment failure', async () => {
    // Mock Stripe error
    jest.spyOn(require('@stripe/stripe-js'), 'loadStripe').mockImplementationOnce(() => 
      Promise.resolve({
        confirmCardPayment: jest.fn(() => Promise.resolve({
          error: { message: 'Your card was declined' }
        }))
      })
    );

    render(
      <AuthProvider>
        <StripeProvider>
          <StripePaymentForm {...defaultProps} />
        </StripeProvider>
      </AuthProvider>
    );

    // Wait for payment intent to be created
    await waitFor(() => {
      expect(screen.getByText('Pay Now')).toBeInTheDocument();
    });

    // Submit payment
    fireEvent.click(screen.getByText('Pay Now'));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Your card was declined')).toBeInTheDocument();
    });
  });

  it('handles database error', async () => {
    // Mock database error
    jest.spyOn(supabase.from('transactions'), 'insert').mockImplementationOnce(() => 
      Promise.resolve({ error: { message: 'Database error' } })
    );

    render(
      <AuthProvider>
        <StripeProvider>
          <StripePaymentForm {...defaultProps} />
        </StripeProvider>
      </AuthProvider>
    );

    // Wait for payment intent to be created
    await waitFor(() => {
      expect(screen.getByText('Pay Now')).toBeInTheDocument();
    });

    // Submit payment
    fireEvent.click(screen.getByText('Pay Now'));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to record payment in database')).toBeInTheDocument();
    });
  });

  it('validates payment amount', async () => {
    render(
      <AuthProvider>
        <StripeProvider>
          <StripePaymentForm {...defaultProps} amount={-100} />
        </StripeProvider>
      </AuthProvider>
    );

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText('Invalid payment amount')).toBeInTheDocument();
    });
  });

  it('requires authentication', async () => {
    // Mock unauthenticated user
    jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockImplementationOnce(() => ({
      user: null
    }));

    render(
      <AuthProvider>
        <StripeProvider>
          <StripePaymentForm {...defaultProps} />
        </StripeProvider>
      </AuthProvider>
    );

    // Wait for auth error
    await waitFor(() => {
      expect(screen.getByText('You must be logged in to make a payment')).toBeInTheDocument();
    });
  });
}); 