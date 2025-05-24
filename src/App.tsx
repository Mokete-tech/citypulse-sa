import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, ClerkLoading, ClerkErrorComponent } from '@clerk/clerk-react';
import { AuthProvider as ClerkAuthProvider } from './components/auth/AuthProvider';
import { useClerk } from "@clerk/clerk-react";
import { Navigate } from 'react-router-dom';
import { Index } from './pages/Index';
import { Deals } from './pages/Deals';
import { Events } from './pages/Events';
import { Contact } from './pages/Contact';
import { Pricing } from './pages/Pricing';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { NotFound } from './pages/NotFound';
import { Loading } from './components/ui/loading';
import { ErrorPage } from './components/ui/error-page';
import { Layout } from './components/layout/Layout';
import { MerchantDashboard } from './pages/merchant/MerchantDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import Automation from './pages/Automation';
import { PulsePal } from './components/ai/PulsePal';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return <Layout>{children}</Layout>;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, userId } = useClerk();

  if (!isLoaded) {
    return <Loading />;
  }

  if (!userId) {
    return <Navigate to="/" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkPubKey}>
        <ClerkAuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Index />
                  </PublicRoute>
                }
              />
              <Route
                path="/deals"
                element={
                  <PublicRoute>
                    <Deals />
                  </PublicRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <PublicRoute>
                    <Events />
                  </PublicRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <PublicRoute>
                    <Contact />
                  </PublicRoute>
                }
              />
              <Route
                path="/pricing"
                element={
                  <PublicRoute>
                    <Pricing />
                  </PublicRoute>
                }
              />
              <Route
                path="/terms"
                element={
                  <PublicRoute>
                    <Terms />
                  </PublicRoute>
                }
              />
              <Route
                path="/privacy"
                element={
                  <PublicRoute>
                    <Privacy />
                  </PublicRoute>
                }
              />
              <Route
                path="/checkout-success"
                element={
                  <PrivateRoute>
                    <CheckoutSuccess />
                  </PrivateRoute>
                }
              />
              <Route
                path="/merchant/dashboard"
                element={
                  <PrivateRoute>
                    <MerchantDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/automation" element={<Automation />} />
              <Route
                path="/ai-assistant"
                element={
                  <PublicRoute>
                    <div className="p-6 max-w-4xl mx-auto">
                      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        CityPulse AI Assistant
                      </h1>
                      <div className="border rounded-lg bg-white shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 p-4">
                          <h2 className="text-white text-xl font-bold">PulsePal AI</h2>
                          <p className="text-white text-opacity-90">
                            Ask me anything about local deals, events, or get personalized recommendations
                          </p>
                        </div>
                        <div className="p-6">
                          <PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />
                        </div>
                      </div>
                    </div>
                  </PublicRoute>
                }
              />
              <Route
                path="*"
                element={
                  <PublicRoute>
                    <NotFound />
                  </PublicRoute>
                }
              />
            </Routes>
          </div>
        </ClerkAuthProvider>
      </ClerkProvider>
    </BrowserRouter>
  );
}

export default App;
