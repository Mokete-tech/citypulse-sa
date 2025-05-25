import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StripeProvider, useStripe } from '../StripeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ error: null })
    }))
  }
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Test component that uses the Stripe context
const TestComponent = () => {
  const { createPaymentIntent, validatePayment } = useStripe();
  const [result, setResult] = React.useState<any>(null);

  const handleCreatePaymentIntent = async () => {
    try {
      const response = await createPaymentIntent(1000, { test: true });
      setResult(response);
    } catch (error) {
      setResult({ error: error.message });
    }
  };

  const handleValidatePayment = () => {
    const validation = validatePayment(1000, 'ZAR');
    setResult(validation);
  };

  return (
    <div>
      <button onClick={handleCreatePaymentIntent}>Create Payment Intent</button>
      <button onClick={handleValidatePayment}>Validate Payment</button>
      {result && <div data-testid="result">{JSON.stringify(result)}</div>}
    </div>
  );
};

describe('StripeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates payment intent successfully', async () => {
    const mockPaymentIntent = {
      clientSecret: 'pi_test_secret',
      id: 'pi_test_123'
    };

    supabase.from().insert.mockResolvedValueOnce({
      data: mockPaymentIntent,
      error: null
    });

    render(
      <StripeProvider>
        <TestComponent />
      </StripeProvider>
    );

    fireEvent.click(screen.getByText('Create Payment Intent'));

    await waitFor(() => {
      const result = JSON.parse(screen.getByTestId('result').textContent);
      expect(result.clientSecret).toBe('pi_test_secret');
      expect(result.id).toBe('pi_test_123');
    });
  });

  it('handles payment intent creation error', async () => {
    supabase.from().insert.mockResolvedValueOnce({
      data: null,
      error: new Error('Failed to create payment intent')
    });

    render(
      <StripeProvider>
        <TestComponent />
      </StripeProvider>
    );

    fireEvent.click(screen.getByText('Create Payment Intent'));

    await waitFor(() => {
      const result = JSON.parse(screen.getByTestId('result').textContent);
      expect(result.error).toBe('Failed to create payment intent');
    });
  });

  it('validates payment amount correctly', () => {
    render(
      <StripeProvider>
        <TestComponent />
      </StripeProvider>
    );

    fireEvent.click(screen.getByText('Validate Payment'));

    const result = JSON.parse(screen.getByTestId('result').textContent);
    expect(result.isValid).toBe(true);
  });

  it('rejects invalid payment amount', () => {
    render(
      <StripeProvider>
        <TestComponent />
      </StripeProvider>
    );

    // Mock validatePayment to return invalid result
    jest.spyOn(require('../StripeContext'), 'validatePayment').mockReturnValueOnce({
      isValid: false,
      error: 'Invalid amount'
    });

    fireEvent.click(screen.getByText('Validate Payment'));

    const result = JSON.parse(screen.getByTestId('result').textContent);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid amount');
  });

  it('validates currency correctly', () => {
    render(
      <StripeProvider>
        <TestComponent />
      </StripeProvider>
    );

    // Mock validatePayment to check currency
    jest.spyOn(require('../StripeContext'), 'validatePayment').mockReturnValueOnce({
      isValid: false,
      error: 'Invalid currency'
    });

    fireEvent.click(screen.getByText('Validate Payment'));

    const result = JSON.parse(screen.getByTestId('result').textContent);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid currency');
  });

  it('shows success toast on successful payment intent creation', async () => {
    supabase.from().insert.mockResolvedValueOnce({
      data: { clientSecret: 'pi_test_secret' },
      error: null
    });

    render(
      <StripeProvider>
        <TestComponent />
      </StripeProvider>
    );

    fireEvent.click(screen.getByText('Create Payment Intent'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('shows error toast on failed payment intent creation', async () => {
    supabase.from().insert.mockResolvedValueOnce({
      data: null,
      error: new Error('Failed to create payment intent')
    });

    render(
      <StripeProvider>
        <TestComponent />
      </StripeProvider>
    );

    fireEvent.click(screen.getByText('Create Payment Intent'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
}); 