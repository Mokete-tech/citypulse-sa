
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add Google Maps types
interface Window {
  google?: any;
}

// Add extensions to existing Jest matchers for testing
declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
  }
}

// Add extensions for testing-library
declare module '@testing-library/jest-dom' {
  export interface Matchers<R> {
    toBeInTheDocument(): R;
  }
}

declare module '@testing-library/jest-dom/matchers' {
  export function toBeInTheDocument(): ReturnType<jest.Matchers['toBeInTheDocument']>;
  // Add other matchers as needed
}

// Add JSX element type for Stripe
declare module '@stripe/stripe-js' {
  interface Stripe {
    Stripe?: any;
  }
}

// Add mock for JsPDF
declare module 'jspdf' {
  interface jsPDF {
    getNumberOfPages?: () => number;
  }
}
