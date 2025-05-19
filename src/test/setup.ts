
import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Custom type extension to work around typing issue
// We're assigning the matchers as a simple object of functions
// to avoid the complex type issues
expect.extend({
  toBeInTheDocument: matchers.toBeInTheDocument as unknown as any,
  // Add other matchers as needed
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: null, isLoaded: true }),
  useClerk: () => ({ 
    signOut: vi.fn(),
    signIn: {
      create: vi.fn(),
      attemptFirstFactor: vi.fn(),
    },
    signUp: {
      create: vi.fn(),
    },
    authenticateWithRedirect: vi.fn(),
  }),
  SignIn: () => null,
  SignUp: () => null,
}));

// Mock next/router
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));
