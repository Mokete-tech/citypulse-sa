
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConnectionCheck } from "@/components/ui/connection-check";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import PageLoadingFallback from "@/components/ui/page-loading-fallback";
import KeyboardNavigation from "@/components/accessibility/KeyboardNavigation";
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";
import InstallPrompt from "@/components/pwa/InstallPrompt";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Deals = lazy(() => import("./pages/Deals"));
const DealDetail = lazy(() => import("./pages/DealDetail"));
const Events = lazy(() => import("./pages/Events"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const MerchantLogin = lazy(() => import("./pages/MerchantLogin"));
const MerchantDashboard = lazy(() => import("./pages/MerchantDashboard"));
const MerchantPackages = lazy(() => import("./pages/MerchantPackages"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AuthCallback = lazy(() => import("./pages/auth/Callback"));
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { StripeProvider } from "./contexts/StripeContext";
import { PreferencesProvider } from "./hooks/usePreferences";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StripeProvider>
          <PreferencesProvider>
            <HelmetProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <ConnectionCheck />
                <HashRouter>
                  <KeyboardNavigation />
                  <InstallPrompt />
            <Routes>
              <Route path="/" element={
                <Suspense fallback={<PageLoadingFallback />}>
                    <Index />
                  </Suspense>
              } />
              <Route path="/deals" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <Deals />
                  </Suspense>

              } />
              <Route path="/deals/:id" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <DealDetail />
                  </Suspense>

              } />
              <Route path="/events" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <Events />
                  </Suspense>

              } />
              <Route path="/contact" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <Contact />
                  </Suspense>

              } />
              <Route path="/terms" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <Terms />
                  </Suspense>

              } />
              <Route path="/merchant/login" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <MerchantLogin />
                  </Suspense>

              } />
              <Route path="/merchant/dashboard" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <ProtectedRoute requiredRole="merchant">
                      <MerchantDashboard />
                    </ProtectedRoute>
                  </Suspense>

              } />
              <Route path="/merchant/packages" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <MerchantPackages />
                  </Suspense>

              } />
              <Route path="/admin/dashboard" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  </Suspense>

              } />
              <Route path="/unauthorized" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <Unauthorized />
                  </Suspense>

              } />
              <Route path="/auth/callback" element={

                  <Suspense fallback={<PageLoadingFallback />}>
                    <AuthCallback />
                  </Suspense>

              } />
              <Route path="*" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </HashRouter>
              </TooltipProvider>
            </HelmetProvider>
          </PreferencesProvider>
        </StripeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </GlobalErrorBoundary>
);

export default App;
