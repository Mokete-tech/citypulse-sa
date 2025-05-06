import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Disable error overlay in production
if (import.meta.env.PROD) {
  // Disable console errors in production
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Filter out React-related errors that would show in the UI
    const errorString = args.join(' ');
    if (
      errorString.includes('React') ||
      errorString.includes('Supabase') ||
      errorString.includes('API key') ||
      errorString.includes('connection') ||
      errorString.includes('database')
    ) {
      // Suppress these errors
      return;
    }

    // Allow other errors to pass through
    originalConsoleError(...args);
  };

  // Disable window error events
  window.addEventListener('error', (event) => {
    event.stopPropagation();
    event.preventDefault();
    return true;
  }, true);

  // Disable unhandled promise rejection events
  window.addEventListener('unhandledrejection', (event) => {
    event.stopPropagation();
    event.preventDefault();
    return true;
  }, true);
}

createRoot(document.getElementById("root")!).render(<App />);
