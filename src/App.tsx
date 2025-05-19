
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
import { 
  Package, 
  Building, 
  Search, 
  Calendar, 
  MapPin, 
  HeartHandshake,
  Sparkles
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
        <div className="p-6 max-w-7xl mx-auto">
          <EnvWarning />
          
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-center mb-12 py-8">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg mb-4">
                <HeartHandshake className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Discover South Africa's <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Best Local Experiences</span></h1>
              <p className="text-xl text-gray-600 mb-8">Find amazing deals, upcoming events, and connect with local businesses across South Africa.</p>
              
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
              <img 
                src="/images/placeholder.svg" 
                alt="CityPulse App" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="bg-white p-4 rounded-lg text-center shadow-md border border-gray-200">
              <div className="bg-blue-100 p-2 inline-flex rounded-full mb-2">
                <Package className="h-5 w-5 text-blue-700" />
              </div>
              <h3 className="font-bold text-2xl">1000+</h3>
              <p className="text-gray-600">Local Deals</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-md border border-gray-200">
              <div className="bg-purple-100 p-2 inline-flex rounded-full mb-2">
                <Calendar className="h-5 w-5 text-purple-700" />
              </div>
              <h3 className="font-bold text-2xl">500+</h3>
              <p className="text-gray-600">Events</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-md border border-gray-200">
              <div className="bg-green-100 p-2 inline-flex rounded-full mb-2">
                <Building className="h-5 w-5 text-green-700" />
              </div>
              <h3 className="font-bold text-2xl">300+</h3>
              <p className="text-gray-600">Merchants</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-md border border-gray-200">
              <div className="bg-amber-100 p-2 inline-flex rounded-full mb-2">
                <MapPin className="h-5 w-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-2xl">25+</h3>
              <p className="text-gray-600">Cities</p>
            </div>
          </div>
          
          {/* Featured Deals Preview */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Deals</h2>
              <Link to="/deals" className="text-blue-600 hover:text-blue-800 flex items-center">
                View all <span className="ml-1">→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={`/images/placeholder-deal.svg`} 
                      alt={`Deal ${item}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      25% OFF
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">Weekend Special Deal {item}</h3>
                    <p className="text-gray-600 text-sm mb-3">Cape Town, South Africa</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">R199</span>
                      <span className="text-gray-500 text-sm line-through">R265</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Assistant Preview */}
          <div className="mb-16 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 p-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">CityPulse AI Assistant</h2>
                  <p className="text-white/80">Get personalized recommendations and discover hidden gems</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="italic text-gray-700">"I'm looking for family-friendly weekend activities in Johannesburg under R500"</p>
              </div>
              <p className="text-gray-600 mb-6">Sign in to unlock our AI-powered assistant that helps you discover the perfect local experiences tailored to your preferences.</p>
              <Button onClick={() => setActiveTab("signin")} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Sparkles className="mr-2 h-5 w-5" />
                Try the AI Assistant
              </Button>
            </div>
          </div>

          {/* Sign-In/Sign-Up Section */}
          <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Join CityPulse Today</h2>
                <p className="text-gray-600 mb-6">Create a free account to save your favorite deals, get personalized recommendations, and unlock exclusive offers.</p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-lg mb-2">Why sign up?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="bg-green-100 p-1 rounded-full mr-2">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Save your favorite deals and events</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-100 p-1 rounded-full mr-2">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Get personalized recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-100 p-1 rounded-full mr-2">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Unlock exclusive offers</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium mb-2 text-sm text-gray-600">Are you a business owner?</h4>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/merchant/login">
                      <Building className="h-4 w-4 mr-2" />
                      Merchant Login
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-4">
                    <SignIn routing="path" path="/" afterSignInUrl="/" />
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <SignUp routing="path" path="/" afterSignUpUrl="/" />
                  </TabsContent>
                </Tabs>
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
