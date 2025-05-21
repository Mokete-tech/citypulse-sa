
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./integrations/stripe/client";
import { DealsCrud } from "./components/DealsCrud";
import { PaymentsList } from "./components/PaymentsList";
import { PaymentForm } from "./components/PaymentForm";
import { PulsePal } from "./components/ai/PulsePal";
import { SignIn, SignUp, useUser, useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";
import { ResponsiveLayout } from "./components/layout/ResponsiveLayout";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { EnvWarning } from "./components/ui/env-warning";
import { ResponsiveImage } from "./components/ui/responsive-image";
import { 
  Package, 
  Building, 
  Search, 
  Calendar, 
  MapPin, 
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";

export default function App() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = React.useState("signin");

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // User is not authenticated, show landing page with exploration options
  if (!user) {
    return (
      <ResponsiveLayout showFooter={false} className="bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <EnvWarning />
          
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-center mb-12 py-6 sm:py-8">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg mb-4">
                <HeartHandshake className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Discover South Africa's <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Best Local Experiences</span></h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">Find amazing deals, upcoming events, and connect with local businesses across South Africa.</p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/deals">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Package className="mr-2 h-5 w-5" />
                    Explore Deals
                  </Button>
                </Link>
                <Link to="/events">
                  <Button size="lg" variant="outline">
                    <Calendar className="mr-2 h-5 w-5" />
                    Browse Events
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <ResponsiveImage 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                  alt="CityPulse App Showcase" 
                  aspectRatio="16/9"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    size="icon" 
                    className="h-16 w-16 rounded-full bg-white/80 hover:bg-white shadow-lg"
                    aria-label="Play video"
                  >
                    <Play className="h-8 w-8 text-blue-600 fill-blue-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Package className="h-4 sm:h-5 w-4 sm:w-5 text-blue-700" />
                </div>
                <h3 className="font-bold text-xl sm:text-2xl">1000+</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Local Deals</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-purple-700" />
                </div>
                <h3 className="font-bold text-xl sm:text-2xl">500+</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Events</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <Building className="h-4 sm:h-5 w-4 sm:w-5 text-green-700" />
                </div>
                <h3 className="font-bold text-xl sm:text-2xl">300+</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Merchants</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="bg-amber-100 p-2 rounded-full">
                  <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-amber-700" />
                </div>
                <h3 className="font-bold text-xl sm:text-2xl">25+</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Cities</p>
            </div>
          </div>
          
          {/* Featured Deals Preview */}
          <div className="mb-12 sm:mb-16">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Featured Deals</h2>
              <Link to="/deals" className="text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="h-36 sm:h-48 relative">
                    <ResponsiveImage
                      src={`https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTY1MDUyMQ&ixlib=rb-4.0.3&q=80&w=600&${item}`} 
                      alt={`Deal ${item}`}
                      aspectRatio="16/9"
                      className="w-full h-full object-cover"
                      fallbackSrc="/images/placeholders/deal-placeholder.svg"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      25% OFF
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-base sm:text-lg mb-1">Weekend Special Deal {item}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Cape Town, South Africa</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">R199</span>
                      <span className="text-gray-500 text-xs sm:text-sm line-through">R265</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Assistant Preview */}
          <div className="mb-12 sm:mb-16 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full">
                  <Sparkles className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">CityPulse AI Assistant</h2>
                  <p className="text-white/80 text-sm sm:text-base">Get personalized recommendations and discover hidden gems</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg mb-4">
                <p className="italic text-gray-700 text-sm sm:text-base">"I'm looking for family-friendly weekend activities in Johannesburg under R500"</p>
              </div>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Sign in to unlock our AI-powered assistant that helps you discover the perfect local experiences tailored to your preferences.</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/auth">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600">
                    <Sparkles className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                    Sign in to try
                  </Button>
                </Link>
                <Link to="/merchant/login">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Building className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                    Business Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  // User is authenticated, show the main app
  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
  };

  return (
    <ResponsiveLayout>
      <div className="p-6">
        <EnvWarning />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">CityPulse Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}</span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="px-4 py-2"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <DealsCrud />
          </div>
          
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Payment Demo
              </h2>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={150}
                  itemId="demo-deal-1"
                  itemType="deal"
                  itemName="Jazz Night"
                  onSuccess={() => toast.success("Payment successful!")}
                  onCancel={() => toast.info("Payment cancelled")}
                />
              </Elements>
            </div>
            
            <PaymentsList />
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="mt-8">
          <div className="border rounded-lg bg-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 p-4">
              <h2 className="text-white text-xl font-bold">CityPulse AI Assistant</h2>
              <p className="text-white text-opacity-90">Ask our AI about local deals, events or get personalized recommendations</p>
            </div>
            <div className="p-6">
              <PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
