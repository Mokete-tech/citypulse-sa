import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentMethodSelector } from '../PaymentMethodSelector';

describe('PaymentMethodSelector', () => {
  const defaultProps = {
    value: 'card' as const,
    onChange: jest.fn(),
    disabled: false
  };

  const renderComponent = (props = {}) => {
    return render(<PaymentMethodSelector {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct title', () => {
    renderComponent();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
  });

  it('displays card payment option', () => {
    renderComponent();
    expect(screen.getByText('Credit/Debit Card')).toBeInTheDocument();
    expect(screen.getByText('Pay securely with your card')).toBeInTheDocument();
  });

  it('calls onChange when selecting a payment method', () => {
    renderComponent();
    const radioButton = screen.getByRole('radio');
    fireEvent.click(radioButton);
    expect(defaultProps.onChange).toHaveBeenCalledWith('card');
  });

  it('disables radio button when disabled prop is true', () => {
    renderComponent({ disabled: true });
    const radioButton = screen.getByRole('radio');
    expect(radioButton).toBeDisabled();
  });

  it('applies correct styles when selected', () => {
    renderComponent();
    const container = screen.getByRole('radio').closest('div');
    expect(container).toHaveClass('border-primary/50', 'bg-primary/5', 'shadow-sm');
  });

  it('applies correct styles when not selected', () => {
    renderComponent({ value: 'other' as any });
    const container = screen.getByRole('radio').closest('div');
    expect(container).not.toHaveClass('border-primary/50', 'bg-primary/5', 'shadow-sm');
  });

  it('applies disabled styles when disabled', () => {
    renderComponent({ disabled: true });
    const container = screen.getByRole('radio').closest('div');
    expect(container).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    renderComponent({ className: customClass });
    const container = screen.getByText('Payment Method').closest('div');
    expect(container).toHaveClass(customClass);
  });
}); 