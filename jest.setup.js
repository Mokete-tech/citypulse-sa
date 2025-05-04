// Add Jest extended matchers
import '@testing-library/jest-dom';

// Mock the window.matchMedia function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
}

window.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
}

window.ResizeObserver = MockResizeObserver;

// Mock the import.meta.env object
global.import = {
  meta: {
    env: {
      MODE: 'test',
      PROD: false,
      DEV: true,
      VITE_SUPABASE_URL: 'https://test-supabase-url.com',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    }
  }
};

// Mock console.error to fail tests on prop type errors
const originalConsoleError = console.error;
console.error = (...args) => {
  const propTypeErrors = [
    'Failed prop type',
    'Invalid prop',
    'The prop `',
    'Required prop',
  ];
  
  if (propTypeErrors.some(errorText => 
    args.join(' ').includes(errorText)
  )) {
    throw new Error(args.join(' '));
  }
  
  originalConsoleError(...args);
};
