import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Deals from "@/pages/Deals";
import Events from "@/pages/Events";
import MerchantLogin from "@/pages/MerchantLogin";
import MerchantDashboard from "@/pages/MerchantDashboard";
import { AuthProvider } from "./lib/firebase";
import Contact from "./pages/Contact"; // Added import for Contact component

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/deals" component={Deals} />
      <Route path="/events" component={Events} />
      <Route path="/contact" component={Contact} /> {/* Added Contact route */}
      <Route path="/merchant/login" component={MerchantLogin} />
      <Route path="/merchant/dashboard" component={MerchantDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;