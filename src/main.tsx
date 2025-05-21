
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
import { PulsePal } from './components/ai/PulsePal';

// Get the publishable key from environment variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_Y2hvaWNlLWFuZW1vbmUtNjIuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!CLERK_PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
}

// Create ErrorBoundary component inline since we can't modify the original
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// AI Assistant Page Component
const AiAssistantPage = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">CityPulse AI Assistant</h1>
    <div className="border rounded-lg bg-white shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 p-4">
        <h2 className="text-white text-xl font-bold">PulsePal AI</h2>
        <p className="text-white text-opacity-90">Ask me anything about local deals, events, or get personalized recommendations</p>
      </div>
      <div className="p-6">
        <PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />
      </div>
    </div>
  </div>
);

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
                <Route path="/ai-assistant" element={<AiAssistantPage />} />
              </Routes>
            </StripeProvider>
          </AuthProvider>
        </BrowserRouter>
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
