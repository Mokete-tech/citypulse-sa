
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Deals from './pages/Deals';
import DealDetail from './pages/DealDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import MerchantLogin from './pages/MerchantLogin';
import MerchantDashboard from './pages/MerchantDashboard';
import MerchantPackages from './pages/MerchantPackages';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/AdminDashboard';
import AuthCallback from './pages/auth/Callback';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider } from './contexts/AuthContext';
import { StripeProvider } from './contexts/StripeContext';
import { PreferencesProvider } from './hooks/usePreferences';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StripeProvider>
          <PreferencesProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/deals/:id" element={<DealDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/merchant/login" element={<MerchantLogin />} />
                <Route
                  path="/merchant/dashboard"
                  element={
                    <ProtectedRoute requiredRole="merchant">
                      <MerchantDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/merchant/packages" element={<MerchantPackages />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </PreferencesProvider>
        </StripeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
