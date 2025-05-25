import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StripePaymentForm } from '../StripePaymentForm';
import { AuthProvider } from '@/contexts/AuthContext';
import { StripeProvider } from '@/contexts/StripeContext';
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

// Mock Stripe
const mockStripe = {
  confirmCardPayment: jest.fn(),
  createPaymentMethod: jest.fn()
};

const mockElements = {
  getElement: jest.fn()
};

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useStripe: () => mockStripe,
  useElements: () => mockElements,
  CardElement: () => <div data-testid="card-element">Card Element</div>
}));

describe('StripePaymentForm', () => {
  const defaultProps = {
    amount: 1000,
    itemType: 'deal' as const,
    itemId: 123,
    itemName: 'Test Deal',
    isPremium: false,
    onSuccess: jest.fn(),
    onCancel: jest.fn()
  };

  const renderComponent = (props = {}) => {
    return render(
      <AuthProvider>
        <StripeProvider>
          <StripePaymentForm {...defaultProps} {...props} />
        </StripeProvider>
      </AuthProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: 'succeeded' }
    });
  });

  it('renders payment form with correct title and description', () => {
    renderComponent();
    
    expect(screen.getByText('Payment Details')).toBeInTheDocument();
    expect(screen.getByText(/Complete your payment for Deal: Test Deal/)).toBeInTheDocument();
  });

  it('displays the correct total amount', () => {
    renderComponent();
    
    expect(screen.getByText('R10.00')).toBeInTheDocument();
  });

  it('shows card element when card payment is selected', () => {
    renderComponent();
    
    expect(screen.getByTestId('card-element')).toBeInTheDocument();
  });

  it('handles successful payment', async () => {
    renderComponent();
    
    const payButton = screen.getByText('Pay Now');
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(mockStripe.confirmCardPayment).toHaveBeenCalled();
      expect(supabase.from).toHaveBeenCalledWith('transactions');
      expect(toast.success).toHaveBeenCalled();
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('handles payment failure', async () => {
    const error = new Error('Payment failed');
    mockStripe.confirmCardPayment.mockRejectedValue(error);
    
    renderComponent();
    
    const payButton = screen.getByText('Pay Now');
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(screen.getByText('Payment Failed')).toBeInTheDocument();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderComponent();
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('disables form when processing payment', async () => {
    renderComponent();
    
    const payButton = screen.getByText('Pay Now');
    fireEvent.click(payButton);

    expect(payButton).toBeDisabled();
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('shows success state after payment completion', async () => {
    renderComponent();
    
    const payButton = screen.getByText('Pay Now');
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
    });
  });

  it('validates payment amount', async () => {
    renderComponent({ amount: -100 });
    
    const payButton = screen.getByText('Pay Now');
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('handles network errors gracefully', async () => {
    mockStripe.confirmCardPayment.mockRejectedValue(new Error('Network error'));
    
    renderComponent();
    
    const payButton = screen.getByText('Pay Now');
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Payment failed', {
        description: 'Network error'
      });
    });
  });
}); 