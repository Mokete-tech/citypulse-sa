
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import MerchantLogin from './MerchantLogin';
import { useAuth } from '@/contexts/AuthContext';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('MerchantLogin', () => {
  const mockSignIn = vi.fn();
  const mockSignUp = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    (useAuth as any).mockReturnValue({
      signIn: mockSignIn,
      signUp: mockSignUp,
      loading: false,
    });
  });
  
  it('renders login form correctly', () => {
    render(<MerchantLogin />);
    
    // Check for login form elements
    expect(screen.getByText('Merchant Portal')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });
  
  it('handles login submission', async () => {
    render(<MerchantLogin />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Check if signIn was called with correct arguments
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
  
  it('shows loading state during authentication', () => {
    // Mock loading state
    (useAuth as any).mockReturnValue({
      signIn: mockSignIn,
      signUp: mockSignUp,
      loading: true,
    });
    
    render(<MerchantLogin />);
    
    // Check for loading state
    expect(screen.getByRole('button', { name: /Signing in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signing in/i })).toBeDisabled();
  });
  
  it('switches to registration form', () => {
    render(<MerchantLogin />);
    
    // Click on the Register tab
    fireEvent.click(screen.getByRole('tab', { name: /Register/i }));
    
    // Check for registration form elements
    expect(screen.getByText('Become a Merchant')).toBeInTheDocument();
    expect(screen.getByLabelText(/Business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Business type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Merchant Account/i })).toBeInTheDocument();
  });
  
  it('handles registration submission', async () => {
    render(<MerchantLogin />);
    
    // Switch to registration tab
    fireEvent.click(screen.getByRole('tab', { name: /Register/i }));
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Business name/i), {
      target: { value: 'Test Business' },
    });
    
    fireEvent.change(screen.getByLabelText(/Business type/i), {
      target: { value: 'Retail' },
    });
    
    fireEvent.change(screen.getAllByLabelText(/Email address/i)[1], {
      target: { value: 'business@example.com' },
    });
    
    fireEvent.change(screen.getAllByLabelText(/Password/i)[1], {
      target: { value: 'securepass123' },
    });
    
    fireEvent.change(screen.getByLabelText(/Phone number/i), {
      target: { value: '+27123456789' },
    });
    
    fireEvent.change(screen.getByLabelText(/Business location/i), {
      target: { value: 'Cape Town' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Merchant Account/i }));
    
    // Check if signUp was called with correct arguments
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'business@example.com',
        'securepass123',
        {
          merchant_name: 'Test Business',
          business_type: 'Retail',
          phone: '+27123456789',
          location: 'Cape Town'
        }
      );
    });
  });
});
