
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/utils';
import MerchantLogin from './MerchantLogin';

// Mock beforeEach using vitest
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: null, isLoaded: true }),
  useClerk: () => ({ signOut: vi.fn() }),
}));

// Using vi.hoisted instead of beforeEach
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/merchant/login', state: {} }),
  };
});

describe('MerchantLogin', () => {
  it('renders MerchantLogin component', () => {
    render(<MerchantLogin />);
    expect(screen.getByText('Merchant Login')).toBeInTheDocument();
  });

  it('navigates to /merchant/dashboard on successful login', async () => {
    render(<MerchantLogin />);
    const loginButton = screen.getByRole('button', { name: 'Sign In' });
    
    // Simulate clicking the login button
    loginButton.click();

    // Wait for navigation to occur (you might need to adjust the timing)
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Check if useNavigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/merchant/dashboard');
  });
});
