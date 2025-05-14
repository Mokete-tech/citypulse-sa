
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Deals from "./pages/Deals";
import DealDetail from "./pages/DealDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import MerchantLogin from "./pages/MerchantLogin";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantPackages from "./pages/MerchantPackages";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/AdminDashboard";
import Demo from "./pages/Demo";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { StripeProvider } from "./contexts/StripeContext";
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
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StripeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <ErrorBoundary>
                  <Index />
                </ErrorBoundary>
              } />
              <Route path="/deals" element={
                <ErrorBoundary>
                  <Deals />
                </ErrorBoundary>
              } />
              <Route path="/deals/:id" element={
                <ErrorBoundary>
                  <DealDetail />
                </ErrorBoundary>
              } />
              <Route path="/events" element={
                <ErrorBoundary>
                  <Events />
                </ErrorBoundary>
              } />
              <Route path="/events/:id" element={
                <ErrorBoundary>
                  <EventDetail />
                </ErrorBoundary>
              } />
              <Route path="/contact" element={
                <ErrorBoundary>
                  <Contact />
                </ErrorBoundary>
              } />
              <Route path="/terms" element={
                <ErrorBoundary>
                  <Terms />
                </ErrorBoundary>
              } />
              <Route path="/merchant/login" element={
                <ErrorBoundary>
                  <MerchantLogin />
                </ErrorBoundary>
              } />
              <Route path="/merchant/dashboard" element={
                <ErrorBoundary>
                  <ProtectedRoute requiredRole="merchant">
                    <MerchantDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              } />
              <Route path="/merchant/packages" element={
                <ErrorBoundary>
                  <MerchantPackages />
                </ErrorBoundary>
              } />
              <Route path="/admin/dashboard" element={
                <ErrorBoundary>
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              } />
              <Route path="/unauthorized" element={
                <ErrorBoundary>
                  <Unauthorized />
                </ErrorBoundary>
              } />
              <Route path="/demo" element={
                <ErrorBoundary>
                  <Demo />
                </ErrorBoundary>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </StripeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
