
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './contexts/AuthContext';
import { StripeProvider } from './contexts/StripeContext';
import './index.css';
import './App.css';
import MerchantPackages from './pages/MerchantPackages';
import MerchantLogin from './pages/MerchantLogin';
import DealsPage from './pages/DealsPage';
import EventsPage from './pages/EventsPage';
import AuthCallback from './pages/AuthCallback';

// Get the publishable key from environment variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_Y2hvaWNlLWFuZW1vbmUtNjIuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!CLERK_PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
}

// Create ErrorBoundary component inline since we can't modify the original
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <BrowserRouter>
          <AuthProvider>
            <StripeProvider>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/merchant/packages" element={<MerchantPackages />} />
                <Route path="/merchant/login" element={<MerchantLogin />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                {/* Add more routes as needed */}
              </Routes>
            </StripeProvider>
          </AuthProvider>
        </BrowserRouter>
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
