import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, ClerkLoading, ClerkErrorComponent } from '@clerk/clerk-react';
import { AuthProvider as ClerkAuthProvider } from './components/auth/AuthProvider';
import { useClerk } from "@clerk/clerk-react";
import { Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
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
                    <Dashboard />
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
